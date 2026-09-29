import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VideoProject } from '../types';
import { canvasRenderer } from '../services/canvasRenderer';
import { audioService } from '../services/audioService';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Eye, EyeOff,
  Heart, MessageCircle, Bookmark, Share2, Music, ChevronLeft, ChevronRight
} from 'lucide-react';

interface VideoStudioPlayerProps {
  project: VideoProject;
  loadedImages: Map<string, HTMLImageElement>;
  currentSceneIndex: number;
  setCurrentSceneIndex: (index: number) => void;
  onSceneTimeUpdate?: (currentTime: number) => void;
}

export const VideoStudioPlayer: React.FC<VideoStudioPlayerProps> = ({
  project,
  loadedImages,
  currentSceneIndex,
  setCurrentSceneIndex,
  onSceneTimeUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showTikTokUi, setShowTikTokUi] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  // Mirrors `currentTime` for the RAF loop, which must not read state inside
  // its own updater. Kept in sync by every place that seeks.
  const timeRef = useRef<number>(0);

  const totalDuration = project.scenes.reduce((acc, s) => acc + (s.duration || 4), 0);

  // Find active scene index for a given timestamp
  const getSceneAtTime = useCallback((time: number) => {
    let accumulated = 0;
    for (let i = 0; i < project.scenes.length; i++) {
      const duration = project.scenes[i].duration || 4;
      if (time >= accumulated && time < accumulated + duration) {
        return {
          index: i,
          scene: project.scenes[i],
          sceneTime: time - accumulated,
          sceneProgress: (time - accumulated) / duration,
        };
      }
      accumulated += duration;
    }
    const lastIdx = project.scenes.length - 1;
    return {
      index: lastIdx,
      scene: project.scenes[lastIdx],
      sceneTime: project.scenes[lastIdx].duration || 4,
      sceneProgress: 1,
    };
  }, [project.scenes]);

  // App.tsx rebuilds `project` as a fresh object literal on every render, so it
  // cannot be a dependency of the RAF loop - that would tear down and restart
  // playback (cancelling speech mid-sentence) roughly 60x/second. Keep it in a
  // ref so the loop always sees fresh data without re-subscribing.
  const projectRef = useRef(project);
  projectRef.current = project;

  // Render current frame
  const renderCurrentFrame = useCallback((time: number) => {
    const canvas = canvasRef.current;
    const p = projectRef.current;
    if (!canvas || p.scenes.length === 0) return;

    const { scene, sceneProgress, index } = getSceneAtTime(time);
    const totalProgress = totalDuration > 0 ? time / totalDuration : 0;
    const img = scene.mediaUrl ? loadedImages.get(scene.mediaUrl) : null;

    canvasRenderer.render(canvas, {
      scene,
      sceneProgress,
      totalProgress,
      currentTime: time,
      totalTime: totalDuration,
      productName: p.productName,
      imageElement: img,
    });

    if (index !== currentSceneIndex) {
      setCurrentSceneIndex(index);
    }
  }, [getSceneAtTime, loadedImages, totalDuration, currentSceneIndex, setCurrentSceneIndex]);

  // Redraw when project scenes or time change while paused
  useEffect(() => {
    if (!isPlaying) {
      renderCurrentFrame(currentTime);
    }
  }, [currentTime, isPlaying, renderCurrentFrame, project]);

  // Animation & Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioService.stopSpeaking();
      return;
    }

    lastTimeRef.current = performance.now();
    timeRef.current = currentTime;
    const startProject = projectRef.current;

    // Trigger voiceover for starting scene
    const initialSceneInfo = getSceneAtTime(currentTime);
    if (!isMuted && initialSceneInfo.scene.voiceText) {
      audioService.speak(
        initialSceneInfo.scene.voiceText,
        startProject.ttsVoice,
        startProject.ttsRate,
        startProject.ttsPitch
      );
      if (initialSceneInfo.scene.soundEffect) {
        audioService.playSoundEffect(initialSceneInfo.scene.soundEffect);
      }
    }

    let prevSceneIdx = initialSceneInfo.index;

    const tick = (now: number) => {
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const p = projectRef.current;

      // Advance time via a ref and mirror it into state, so the audio/render
      // side effects below run exactly once per frame. They must not live
      // inside a setState updater: React may call updaters more than once
      // (StrictMode double-invokes them), which would replay speech and SFX.
      let nextTime = timeRef.current + deltaSec;

      if (nextTime >= totalDuration) {
        // Loop back to start
        nextTime = 0;
        prevSceneIdx = 0;
        if (!isMuted && p.scenes[0]?.voiceText) {
          audioService.speak(
            p.scenes[0].voiceText,
            p.ttsVoice,
            p.ttsRate,
            p.ttsPitch
          );
        }
      }

      const sceneInfo = getSceneAtTime(nextTime);

      // When entering a new scene during playback
      if (sceneInfo.index !== prevSceneIdx) {
        prevSceneIdx = sceneInfo.index;
        if (!isMuted) {
          if (sceneInfo.scene.soundEffect) {
            audioService.playSoundEffect(sceneInfo.scene.soundEffect);
          }
          if (sceneInfo.scene.voiceText) {
            audioService.speak(
              sceneInfo.scene.voiceText,
              p.ttsVoice,
              p.ttsRate,
              p.ttsPitch
            );
          }
        }
      }

      timeRef.current = nextTime;
      renderCurrentFrame(nextTime);
      if (onSceneTimeUpdate) onSceneTimeUpdate(nextTime);
      setCurrentTime(nextTime);

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioService.stopSpeaking();
    };
  }, [isPlaying, totalDuration, getSceneAtTime, isMuted, renderCurrentFrame, onSceneTimeUpdate]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    timeRef.current = 0;
    setCurrentTime(0);
    setCurrentSceneIndex(0);
    renderCurrentFrame(0);
    audioService.stopSpeaking();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    timeRef.current = val;
    setCurrentTime(val);
    renderCurrentFrame(val);
    const { index, scene } = getSceneAtTime(val);
    setCurrentSceneIndex(index);
    if (!isPlaying && !isMuted && scene.voiceText) {
      audioService.speak(scene.voiceText, project.ttsVoice, project.ttsRate, project.ttsPitch);
    }
  };

  const handleJumpToScene = (idx: number) => {
    let t = 0;
    for (let i = 0; i < idx; i++) {
      t += project.scenes[i].duration || 4;
    }
    timeRef.current = t;
    setCurrentTime(t);
    setCurrentSceneIndex(idx);
    renderCurrentFrame(t);
    if (!isPlaying && !isMuted && project.scenes[idx]?.voiceText) {
      audioService.speak(
        project.scenes[idx].voiceText,
        project.ttsVoice,
        project.ttsRate,
        project.ttsPitch
      );
    }
  };

  const activeScene = project.scenes[currentSceneIndex] || project.scenes[0];

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* 9:16 Smartphone Mockup Preview Frame */}
      <div
        ref={containerRef}
        className="relative group w-[310px] sm:w-[340px] md:w-[360px] aspect-[9/16] bg-slate-950 rounded-[40px] p-3 shadow-2xl border-[6px] border-slate-800 ring-1 ring-slate-700/50 select-none overflow-hidden"
      >
        {/* Phone Speaker & Camera Notch (Dynamic Island) */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center space-x-2 border border-slate-800/80 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-500/80"></div>
          </div>
          <div className="w-8 h-1 rounded-full bg-slate-800"></div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-black flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={1280}
            className="w-full h-full object-cover"
          />

          {/* Simulated TikTok UI Overlays (Right Action Bar & Bottom Info) */}
          {showTikTokUi && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 pt-12 text-white z-20">
              {/* Top Tabs */}
              <div className="flex items-center justify-center space-x-4 text-xs font-bold text-white/80 drop-shadow">
                <span className="opacity-60">Following</span>
                <span className="border-b-2 border-white pb-0.5 opacity-100">For You</span>
              </div>

              {/* Middle / Right Action Bar */}
              <div className="flex justify-between items-end pb-6">
                {/* Left Bottom User & Affiliate Info */}
                <div className="space-y-1.5 max-w-[72%] text-left drop-shadow-md">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs">@affiliate.guru</span>
                    <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded font-bold">ติดตาม</span>
                  </div>
                  <p className="text-[11px] text-white/95 line-clamp-2 leading-snug">
                    {project.productName} ของดีบอกต่อ พิกัดในคลิปเลยค่ะ! 🔥
                  </p>
                  <div className="flex items-center space-x-1.5 text-[10px] text-white/80">
                    <Music className="w-3 h-3 animate-spin text-pink-400" />
                    <span className="truncate">เสียงต้นฉบับ - Affiliate Viral Beat</span>
                  </div>
                </div>

                {/* Right Floating Actions */}
                <div className="flex flex-col items-center space-y-3.5 pb-2">
                  {/* Profile Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 p-0.5 relative">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold">
                      ⭐
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      +
                    </div>
                  </div>

                  {/* Like Button */}
                  <div className="flex flex-col items-center space-y-0.5">
                    <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                    </div>
                    <span className="text-[9px] font-semibold">28.4K</span>
                  </div>

                  {/* Comment */}
                  <div className="flex flex-col items-center space-y-0.5">
                    <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-semibold">1,492</span>
                  </div>

                  {/* Bookmark */}
                  <div className="flex flex-col items-center space-y-0.5">
                    <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                      <Bookmark className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="text-[9px] font-semibold">8,310</span>
                  </div>

                  {/* Share */}
                  <div className="flex flex-col items-center space-y-0.5">
                    <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-semibold">Share</span>
                  </div>

                  {/* Rotating Music Disc */}
                  <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center animate-spin">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Center Play Overlay when Paused */}
          {!isPlaying && (
            <button
              onClick={handleTogglePlay}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition hover:bg-black/20 group"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/90 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/30 transform group-hover:scale-110 transition">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Control Bar & Timeline Scrubber */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        {/* Timeline Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="text-pink-400 font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-300 font-medium truncate max-w-[180px] text-center">
              {activeScene?.title || `Scene ${currentSceneIndex + 1}`}
            </span>
            <span>{formatTime(totalDuration)}</span>
          </div>

          <input
            type="range"
            min={0}
            max={totalDuration || 1}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
          />
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center justify-between pt-1">
          {/* Left tools: Reset & Mute */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleReset}
              title="เริ่มใหม่ตั้งแต่ต้น"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'เปิดเสียงพากย์' : 'ปิดเสียงพากย์'}
              className={`p-2 rounded-xl transition ${
                isMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowTikTokUi(!showTikTokUi)}
              title={showTikTokUi ? 'ซ่อนกรอบ TikTok UI' : 'แสดงกรอบ TikTok UI'}
              className={`p-2 rounded-xl transition ${
                showTikTokUi ? 'bg-slate-800 text-slate-300' : 'bg-slate-800/50 text-slate-500'
              }`}
            >
              {showTikTokUi ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Center Play & Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleJumpToScene(Math.max(0, currentSceneIndex - 1))}
              disabled={currentSceneIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="p-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg shadow-rose-500/25 transition transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => handleJumpToScene(Math.min(project.scenes.length - 1, currentSceneIndex + 1))}
              disabled={currentSceneIndex === project.scenes.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scene Jump Pills */}
          <div className="flex items-center space-x-1 text-xs">
            {project.scenes.map((_, i) => (
              <button
                key={i}
                onClick={() => handleJumpToScene(i)}
                className={`w-5 h-5 rounded-full text-[10px] font-bold transition ${
                  currentSceneIndex === i
                    ? 'bg-rose-500 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
