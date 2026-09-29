import React, { useState, useRef, useEffect } from 'react';
import { VideoProject } from '../types';
import { videoRecorderService, ExportProgress } from '../services/videoRecorder';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  Copy,
  Check,
  Sparkles,
  Film,
  ExternalLink,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

/**
 * Props for ExportModal.
 *   project: VideoProject – data describing scenes & captions.
 *   loadedImages: Map<string, HTMLImageElement> – preloaded Shopee images.
 *   onOpenShopeeVideoModal?: () => void – optional callback opening Shopee Video panel.
 */
export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
  loadedImages: Map<string, HTMLImageElement>;
  onOpenShopeeVideoModal?: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  loadedImages,
  onOpenShopeeVideoModal,
}) => {
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [progress, setProgress] = useState<ExportProgress>({
    percent: 0,
    currentScene: 1,
    totalScenes: project.scenes.length,
    status: 'พร้อมเริ่มเรนเดอร์วิดีโอ 9:16',
  });
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoUrlRef = useRef<string | null>(null);

  // Release the previous object URL when replaced, and on unmount, so repeated
  // renders do not leak the recorded blobs for the lifetime of the page.
  useEffect(() => {
    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
    }
  }, [videoUrl]);

  useEffect(() => {
    return () => {
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleCancelRender = () => {
    videoRecorderService.cancel();
    setIsRendering(false);
  };

  const handleStartRender = async () => {
    const canvas = hiddenCanvasRef.current;
    if (!canvas) {
      alert('ไม่พบแคนวาสสำหรับเรนเดอร์ กรุณาลองใหม่อีกครั้ง');
      return;
    }

    setIsRendering(true);
    setVideoBlob(null);
    setVideoUrl(null);
    setProgress({
      percent: 0,
      currentScene: 1,
      totalScenes: project.scenes.length,
      status: 'พร้อมเริ่มเรนเดอร์วิดีโอ 9:16',
    });

    try {
      // Renders every scene through canvasRenderer (Ken Burns, subtitles,
      // stickers, progress bar) and mixes in TTS + BGM + SFX via audioService.
      const blob = await videoRecorderService.renderAndExportVideo(
        canvas,
        project,
        loadedImages,
        (p) => setProgress(p)
      );

      setVideoBlob(blob);
      const url = URL.createObjectURL(blob);
      videoUrlRef.current = url;
      setVideoUrl(url);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Render error:', err);
      alert('เกิดข้อผิดพลาดในการเรนเดอร์วิดีโอ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `${project.productName.replace(/\s+/g, '_')}_Affiliate_9x16.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const fullScript = project.scenes
    .map((s) => `[${s.title}]\nพากย์: ${s.voiceText}\nซับบนจอ: ${s.subtitleText}`)
    .join('\n\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <canvas ref={hiddenCanvasRef} width={720} height={1280} className="hidden" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400"><Film className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-base text-white">เรนเดอร์ & ส่งออกวิดีโอ Affiliate (9:16)</h3>
              <p className="text-xs text-slate-400">ความละเอียด 720x1280 HD พร้อมแคปชั่นและแฮชแท็กไวรัล</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-100 flex items-center space-x-1.5"><Sparkles className="w-4 h-4 text-amber-400" /><span>บันทึกและเรนเดอร์ไฟล์วิดีโอ</span></h4>
                <p className="text-xs text-slate-400">ระบบจะบันทึกภาพแอนิเมชัน 9:16 พร้อมเสียงพากย์และซาวด์เอฟเฟกต์ทั้งหมด</p>
              </div>
              {!isRendering && !videoUrl && (
                <button type="button" onClick={handleStartRender} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition"><span>เริ่มเรนเดอร์วิดีโอ</span></button>
              )}
            </div>
            {isRendering && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-pink-400 font-medium flex items-center space-x-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>{progress.status}</span></span>
                  <span className="font-mono font-bold text-white">{progress.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-150" style={{ width: `${progress.percent}%` }} /></div>
                <button type="button" onClick={handleCancelRender} className="px-3 py-1.5 text-[11px] text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 rounded-lg transition">
                  ยกเลิกการเรนเดอร์
                </button>
              </div>
            )}
            {videoUrl && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center space-x-3"><CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" /><div><span className="text-xs font-bold text-emerald-300 block">เรนเดอร์สำเร็จเรียบร้อย!</span><span className="text-[11px] text-slate-300">ขนาดไฟล์: ~{Math.round((videoBlob?.size || 0) / 1024 / 1024 * 10) / 10} MB (.webm HD)</span></div></div>
                <div className="flex items-center space-x-2"><button type="button" onClick={handleStartRender} className="px-3 py-2 text-xs text-slate-400 hover:text-white transition">เรนเดอร์ใหม่</button>
                <button type="button" onClick={handleDownloadVideo} className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition transform active:scale-95"><Download className="w-4 h-4" /><span>📥 ดาวน์โหลดวิดีโอ (9:16)</span></button></div>
              </div>
            )}
          </div>
          {onOpenShopeeVideoModal && (
            <div className="p-4 bg-gradient-to-r from-orange-950/70 to-slate-950 rounded-2xl border border-orange-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3"><div className="p-2.5 bg-orange-500 text-white rounded-xl font-bold"><ShoppingBag className="w-5 h-5" /></div><div><span className="text-xs font-extrabold text-orange-300 block">เตรียมโพสต์ลง Shopee Video (ติดตะกร้าส้ม)?</span><span className="text-[11px] text-slate-300">เปิดตัวช่วยผูกตะกร้าส้ม พร้อมคัดลอกลิงก์สินค้าและรับโค้ดลด 50%</span></div></div>
              <button type="button" onClick={() => { onClose(); onOpenShopeeVideoModal(); }} className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 text-xs font-bold transition shadow-md shadow-orange-500/20 flex-shrink-0"><span>เปิดวิธีติดตะกร้าส้ม</span><ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          )}
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2"><div className="flex items-center justify-between"><label className="text-xs font-semibold text-slate-200">📝 แคปชั่นสำหรับโพสต์ (Affiliate Caption + CTA)</label><button type="button" onClick={() => handleCopyText(project.caption, 'caption')} className="text-xs text-pink-400 hover:text-pink-300 flex items-center space-x-1 font-medium">{copiedSection === 'caption' ? (<><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">คัดลอกแคปชั่นแล้ว</span></>) : (<><Copy className="w-3.5 h-3.5" /><span>คัดลอกแคปชั่น</span></>)}</button></div><textarea readOnly value={project.caption} rows={3} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 font-sans focus:outline-none resize-none" /></div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2"><div className="flex items-center justify-between"><label className="text-xs font-semibold text-slate-200">🏷️ แฮชแท็กไวรัลแนะนำ (Hashtags)</label><button type="button" onClick={() => handleCopyText(project.hashtags.join(' '), 'hashtags')} className="text-xs text-pink-400 hover:text-pink-300 flex items-center space-x-1 font-medium">{copiedSection === 'hashtags' ? (<><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">คัดลอกแฮชแท็กแล้ว</span></>) : (<><Copy className="w-3.5 h-3.5" /><span>คัดลอกแฮชแท็ก</span></>)}</button></div><div className="flex flex-wrap gap-1.5 p-2 bg-slate-900 rounded-lg border border-slate-800 text-xs text-pink-400 font-mono">{project.hashtags.map((tag, i) => (<span key={i} className="bg-slate-800 px-2 py-0.5 rounded-md">{tag}</span>))}</div></div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2"><div className="flex items-center justify-between"><label className="text-xs font-semibold text-slate-200">📜 สคริปต์บทพากย์เต็ม (Voiceover Script)</label><button type="button" onClick={() => handleCopyText(fullScript, 'script')} className="text-xs text-pink-400 hover:text-pink-300 flex items-center space-x-1 font-medium">{copiedSection === 'script' ? (<><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">คัดลอกสคริปต์แล้ว</span></>) : (<><Copy className="w-3.5 h-3.5" /><span>คัดลอกสคริปต์</span></>)}</button></div><textarea readOnly value={fullScript} rows={4} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 font-mono focus:outline-none resize-none" /></div>
          </div>
          <div className="pt-2"><label className="text-xs font-semibold text-slate-400 mb-2 block">🚀 เปิดแพลตฟอร์มเพื่ออัปโหลดทันที:</label><div className="grid grid-cols-2 sm:grid-cols-4 gap-2"><a href="https://creator.shopee.co.th" target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800 border border-orange-500/40 rounded-xl text-xs text-orange-300 font-bold transition"><span>Shopee Creator</span><ExternalLink className="w-3.5 h-3.5" /></a><a href="https://www.tiktok.com/creator-center/upload" target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-rose-300 transition"><span>TikTok Studio</span><ExternalLink className="w-3.5 h-3.5" /></a><a href="https://business.facebook.com/creatorstudio" target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-blue-300 transition"><span>Meta Studio</span><ExternalLink className="w-3.5 h-3.5" /></a><a href="https://studio.youtube.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-red-300 transition"><span>YouTube Studio</span><ExternalLink className="w-3.5 h-3.5" /></a></div></div>
        </div>
      </div>
    </div>
  );
};

export { ExportModal };
