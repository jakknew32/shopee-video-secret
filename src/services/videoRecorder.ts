import { Scene, VideoProject } from '../types';
import { canvasRenderer } from './canvasRenderer';
import { audioService } from './audioService';

export interface ExportProgress {
  percent: number;
  currentScene: number;
  totalScenes: number;
  status: string;
}

export class VideoRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording: boolean = false;
  private shouldCancel: boolean = false;

  public async renderAndExportVideo(
    canvas: HTMLCanvasElement,
    project: VideoProject,
    loadedImages: Map<string, HTMLImageElement>,
    onProgress: (progress: ExportProgress) => void
  ): Promise<Blob> {
    this.isRecording = true;
    this.shouldCancel = false;
    this.recordedChunks = [];

    const totalScenes = project.scenes.length;
    const totalDurationSec = project.scenes.reduce((acc, s) => acc + (s.duration || 4), 0);

    // Prepare Canvas stream at 30 fps
    const stream = canvas.captureStream(30);

    // Connect Audio Context stream if available
    const audioCtx = audioService.getAudioContext();
    if (audioCtx) {
      try {
        const dest = audioCtx.createMediaStreamDestination();
        dest.stream.getAudioTracks().forEach(track => stream.addTrack(track));
      } catch (e) {
        console.warn('Audio track merge skipped:', e);
      }
    }

    // Determine supported mime type in Chrome
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = '';
    }

    const options: MediaRecorderOptions = mimeType ? { mimeType, videoBitsPerSecond: 4000000 } : {};
    this.mediaRecorder = new MediaRecorder(stream, options);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('MediaRecorder initialization failed'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: mimeType || 'video/webm' });
        this.isRecording = false;
        resolve(blob);
      };

      this.mediaRecorder.onerror = (e) => {
        this.isRecording = false;
        reject(e);
      };

      this.mediaRecorder.start(100);

      // Start rendering loop scene by scene
      this.executeRenderTimeline(canvas, project, loadedImages, totalDurationSec, onProgress)
        .then(() => {
          if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
          }
        })
        .catch((err) => {
          if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
          }
          reject(err);
        });
    });
  }

  private async executeRenderTimeline(
    canvas: HTMLCanvasElement,
    project: VideoProject,
    loadedImages: Map<string, HTMLImageElement>,
    totalDurationSec: number,
    onProgress: (progress: ExportProgress) => void
  ): Promise<void> {
    const fps = 30;
    let accumulatedTime = 0;

    for (let sIdx = 0; sIdx < project.scenes.length; sIdx++) {
      if (this.shouldCancel) break;
      const scene = project.scenes[sIdx];
      const sceneDuration = scene.duration || 4;
      const totalFramesInScene = Math.round(sceneDuration * fps);

      // Play Sound Effect if any
      if (scene.soundEffect && scene.soundEffect !== 'none') {
        audioService.playSoundEffect(scene.soundEffect);
      }

      // Trigger TTS Voiceover for this scene
      if (scene.voiceText) {
        audioService.speak(scene.voiceText, project.ttsVoice, project.ttsRate, project.ttsPitch);
      }

      const img = scene.mediaUrl ? loadedImages.get(scene.mediaUrl) : null;

      for (let frame = 0; frame < totalFramesInScene; frame++) {
        if (this.shouldCancel) break;

        const sceneProgress = frame / totalFramesInScene;
        const currentTotalSec = accumulatedTime + (frame / fps);
        const totalProgress = currentTotalSec / totalDurationSec;

        // Render frame to canvas
        canvasRenderer.render(canvas, {
          scene,
          sceneProgress,
          totalProgress,
          currentTime: currentTotalSec,
          totalTime: totalDurationSec,
          productName: project.productName,
          imageElement: img,
        });

        const percent = Math.min(99, Math.round(totalProgress * 100));
        onProgress({
          percent,
          currentScene: sIdx + 1,
          totalScenes: project.scenes.length,
          status: `กำลังเรนเดอร์ ${scene.title} (${Math.round(currentTotalSec)}s / ${Math.round(totalDurationSec)}s)`
        });

        // Frame interval delay (1000ms / 30fps = ~33.3ms)
        await new Promise(r => setTimeout(r, 33));
      }

      accumulatedTime += sceneDuration;
    }

    onProgress({
      percent: 100,
      currentScene: project.scenes.length,
      totalScenes: project.scenes.length,
      status: 'การเรนเดอร์เสร็จสมบูรณ์! พร้อมดาวน์โหลด'
    });
  }

  public cancel() {
    this.shouldCancel = true;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    audioService.stopSpeaking();
    this.isRecording = false;
  }
}

export const videoRecorderService = new VideoRecorderService();
