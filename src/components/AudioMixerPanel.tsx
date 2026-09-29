import React, { useEffect, useState } from 'react';
import { audioService } from '../services/audioService';
import { Volume2, Music, Mic, Play, Square } from 'lucide-react';

interface AudioMixerPanelProps {
  ttsVoice: string;
  setTtsVoice: (v: string) => void;
  ttsRate: number;
  setTtsRate: (r: number) => void;
  ttsPitch: number;
  setTtsPitch: (p: number) => void;
  bgmTrack: string;
  setBgmTrack: (t: string) => void;
  bgmVolume: number;
  setBgmVolume: (v: number) => void;
}

export const AudioMixerPanel: React.FC<AudioMixerPanelProps> = ({
  ttsVoice,
  setTtsVoice,
  ttsRate,
  setTtsRate,
  ttsPitch,
  setTtsPitch,
  bgmTrack,
  setBgmTrack,
  bgmVolume,
  setBgmVolume,
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);

  useEffect(() => {
    const loadVoices = () => {
      const v = audioService.getVoices();
      setVoices(v);
      if (!ttsVoice && v.length > 0) {
        const thai = v.find((voice) => voice.lang.includes('th') || voice.name.toLowerCase().includes('thai'));
        if (thai) {
          setTtsVoice(thai.name);
        } else {
          setTtsVoice(v[0].name);
        }
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // addEventListener, not `onvoiceschanged =` - assigning the property
      // would clobber the handler audioService installs to refresh its own
      // voice cache, leaving speak() with a stale list.
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
      // stopBgm clears the setInterval created by startProceduralBgm.
      audioService.stopBgm();
      audioService.stopSpeaking();
    };
  }, [ttsVoice, setTtsVoice]);

  const handleToggleBgm = () => {
    if (isBgmPlaying) {
      audioService.stopBgm();
      setIsBgmPlaying(false);
    } else {
      audioService.startProceduralBgm(bgmTrack, bgmVolume);
      setIsBgmPlaying(true);
    }
  };

  const handleBgmTrackChange = (track: string) => {
    setBgmTrack(track);
    if (isBgmPlaying) {
      audioService.stopBgm();
      if (track !== 'none') {
        audioService.startProceduralBgm(track, bgmVolume);
      } else {
        setIsBgmPlaying(false);
      }
    }
  };

  const handleBgmVolumeChange = (vol: number) => {
    setBgmVolume(vol);
    audioService.setBgmVolume(vol);
  };

  const handleTestTTS = () => {
    audioService.speak(
      'สวัสดีค่ะ วันนี้พามาดูไอเทมเด็ดที่กำลังฮิตใน TikTok ตอนนี้เลยค่ะ!',
      ttsVoice,
      ttsRate,
      ttsPitch
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Mic className="w-4 h-4 text-pink-400" />
          <span>ตั้งค่าเสียงพากย์ (TTS) & เพลงประกอบ (BGM)</span>
        </h3>
        <button
          type="button"
          onClick={handleTestTTS}
          className="text-xs text-pink-400 hover:text-pink-300 flex items-center space-x-1 font-medium bg-pink-500/10 px-2.5 py-1 rounded-lg border border-pink-500/20"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>ทดสอบเสียงพูด</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: TTS Voice & Speed */}
        <div className="space-y-3 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <span>🗣️ เลือกเสียงพากย์ในเครื่อง (Chrome Speech)</span>
          </label>

          <select
            value={ttsVoice}
            onChange={(e) => setTtsVoice(e.target.value)}
            className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pink-500"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
            {voices.length === 0 && <option value="">Default Chrome Voice (ไทย/English)</option>}
          </select>

          {/* Speed / Rate Slider */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>ความเร็วเสียงพากย์ (Speed):</span>
              <span className="font-bold text-pink-400 font-mono">{ttsRate}x</span>
            </div>
            <input
              type="range"
              min={0.7}
              max={1.6}
              step={0.05}
              value={ttsRate}
              onChange={(e) => setTtsRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>ช้า 0.8x</span>
              <span className="text-pink-400/80 font-medium">1.15x (แนะนำสไตล์ TikTok)</span>
              <span>เร็ว 1.5x</span>
            </div>
          </div>
        </div>

        {/* Right: BGM & Sound Mixer */}
        <div className="space-y-3 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              <span>🎵 เพลงประกอบ (BGM Synthesizer)</span>
            </label>

            <button
              type="button"
              onClick={handleToggleBgm}
              className={`text-xs px-2 py-1 rounded-lg flex items-center space-x-1 font-medium transition ${
                isBgmPlaying
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isBgmPlaying ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>หยุดเพลง</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>ลองฟัง BGM</span>
                </>
              )}
            </button>
          </div>

          <select
            value={bgmTrack}
            onChange={(e) => handleBgmTrackChange(e.target.value)}
            className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="upbeat-tiktok">🔥 Upbeat TikTok Viral (120 BPM)</option>
            <option value="lofi-chill">☕ Lo-Fi Chill Aesthetic (85 BPM)</option>
            <option value="none">🔇 ปิดเพลงพื้นหลัง</option>
          </select>

          {/* BGM Volume Slider */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>ระดับเสียงเพลง (BGM Volume):</span>
              <span className="font-bold text-cyan-400 font-mono">
                {Math.round(bgmVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={bgmVolume}
              onChange={(e) => handleBgmVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="text-[10px] text-slate-500 block mt-0.5">
              💡 ระบบมี Auto-Ducking ลดเสียงเพลงอัตโนมัติขณะมีเสียงพากย์
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
