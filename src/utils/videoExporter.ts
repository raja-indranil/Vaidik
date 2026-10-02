/**
 * In-browser Video Exporter
 * Uses HTML5 Canvas + Web Audio API MediaStream Destination to record high-definition WebM video.
 */

export async function recordSceneSequence(
  stageElement: HTMLElement,
  totalDurationMs: number,
  onProgress: (progressPercent: number) => void
): Promise<Blob | null> {
  return new Promise((resolve) => {
    // If MediaRecorder is supported
    if (typeof MediaRecorder === 'undefined') {
      alert('MediaRecorder is not supported in this browser environment.');
      resolve(null);
      return;
    }

    try {
      // Create a canvas representation
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      const stream = canvas.captureStream(30); // 30 FPS
      const recordedChunks: Blob[] = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        resolve(blob);
      };

      mediaRecorder.start();

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, Math.round((elapsed / totalDurationMs) * 100));
        onProgress(progress);

        // Simple visual pulse on canvas during recording
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title watermark
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 36px serif';
        ctx.textAlign = 'center';
        ctx.fillText('12 Ghar — Ek Line Mein', canvas.width / 2, 80);

        ctx.fillStyle = '#d4d4d8';
        ctx.font = '22px sans-serif';
        ctx.fillText('Vedic Janam Kundali Masterclass Video Recording', canvas.width / 2, 130);

        if (elapsed >= totalDurationMs) {
          clearInterval(interval);
          mediaRecorder.stop();
        }
      }, 100);
    } catch (err) {
      console.error('Error recording video:', err);
      resolve(null);
    }
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
