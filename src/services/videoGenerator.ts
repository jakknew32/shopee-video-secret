// src/services/videoGenerator.ts
// Generates a simple 9:16 video from an array of image URLs using MediaRecorder.
// The video will be rendered at 25 fps by default, each image shown for 2 seconds.

export async function generateVideo(
  imageUrls: string[],
  options?: { fps?: number; frameDuration?: number; canvasSize?: { w: number; h: number } }
): Promise<Blob> {
  const fps = options?.fps ?? 25;
  const frameDuration = options?.frameDuration ?? 2; // seconds per image
  const { w: canvasW, h: canvasH } = options?.canvasSize ?? { w: 720, h: 1280 };

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d')!;

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  recorder.start();

  for (const url of imageUrls) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    await new Promise<void>((res, rej) => {
      img.onload = () => {
        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.drawImage(img, 0, 0, canvasW, canvasH);
        res();
      };
      img.onerror = () => res();
    });

    await new Promise((r) => setTimeout(r, frameDuration * 1000));
  }

  recorder.stop();

  await new Promise<void>((resolve, reject) => {
    recorder.onstop = () => resolve();
    recorder.onerror = () => reject(new Error('MediaRecorder failed'));
  });

  return new Blob(chunks, { type: 'video/webm' });
}
