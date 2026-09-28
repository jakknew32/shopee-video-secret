import React, { useRef } from 'react';
import { Scene, KenBurnsEffect, SubtitleStyle, StickerType } from '../types';
import { audioService } from '../services/audioService';
import {
  Volume2, Image as ImageIcon, Sparkles, Sliders,
  Trash2, Upload, Plus, MoveVertical, Copy, Check, Eye
} from 'lucide-react';

interface SceneTimelineEditorProps {
  scenes: Scene[];
  onUpdateScene: (sceneIndex: number, updatedScene: Scene) => void;
  activeSceneIndex: number;
  setActiveSceneIndex: (index: number) => void;
  onImageUploaded: (url: string, imgElement: HTMLImageElement) => void;
  ttsVoice: string;
  ttsRate: number;
  ttsPitch: number;
}

export const SceneTimelineEditor: React.FC<SceneTimelineEditorProps> = ({
  scenes,
  onUpdateScene,
  activeSceneIndex,
  setActiveSceneIndex,
  onImageUploaded,
  ttsVoice,
  ttsRate,
  ttsPitch,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copiedPromptId, setCopiedPromptId] = React.useState<string | null>(null);

  const handleFieldChange = (idx: number, field: keyof Scene, value: any) => {
    const updated = { ...scenes[idx], [field]: value };
    onUpdateScene(idx, updated);
  };

  const handleTestVoice = (text: string) => {
    if (!text.trim()) return;
    audioService.speak(text, ttsVoice, ttsRate, ttsPitch);
  };

  const handleTestSoundEffect = (fx: any) => {
    if (fx && fx !== 'none') {
      audioService.playSoundEffect(fx);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, sceneIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          onImageUploaded(dataUrl, img);
          handleFieldChange(sceneIdx, 'mediaUrl', dataUrl);
          handleFieldChange(sceneIdx, 'mediaType', 'image');
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleAddSticker = (sceneIdx: number, type: StickerType) => {
    const scene = scenes[sceneIdx];
    let label = '🔥 HOT DEAL';
    let y = 50;

    if (type === 'tiktok-basket') {
      label = '🛒 กดตะกร้าสีเหลืองซ้ายล่าง';
      y = 78;
    } else if (type === 'shopee-orange-basket') {
      label = '🧡 กดตะกร้าส้มซ้ายล่าง Shopee';
      y = 78;
    } else if (type === 'shopee-voucher-50') {
      label = '🏷️ โค้ดลด Shopee Video 50%';
      y = 22;
    } else if (type === 'shopee-voucher-30') {
      label = '🏷️ โค้ดลด Shopee Video 30%';
      y = 22;
    } else if (type === 'discount-50') {
      label = '🔥 ลดพิเศษ 50%';
      y = 22;
    } else if (type === 'flash-sale') {
      label = '⚡ FLASH SALE';
      y = 18;
    } else if (type === 'stars-rating') {
      label = '⭐⭐⭐⭐⭐ 4.9/5 (รีวิวแน่น)';
      y = 25;
    } else if (type === 'arrow-pointer') {
      label = '👇 จิ้มลิงก์ที่คอมเมนต์';
      y = 80;
    } else if (type === 'free-shipping') {
      label = '🚚 ส่งฟรี มีเก็บเงินปลายทาง';
      y = 88;
    }

    const newSticker = {
      id: `stk-${Date.now()}`,
      type,
      label,
      x: 50,
      y,
      scale: type === 'tiktok-basket' ? 1.2 : 1.0,
    };

    handleFieldChange(sceneIdx, 'stickers', [...scene.stickers, newSticker]);
  };

  const handleRemoveSticker = (sceneIdx: number, stickerId: string) => {
    const scene = scenes[sceneIdx];
    handleFieldChange(
      sceneIdx,
      'stickers',
      scene.stickers.filter((s) => s.id !== stickerId)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <span>🎬 ลำดับฉากและสคริปต์ (Storyboard Scenes)</span>
          <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-mono">
            {scenes.length} ฉาก
          </span>
        </h3>
        <span className="text-xs text-slate-400">คลิกที่ฉากเพื่อแก้ไขรายละเอียด & พรีวิว</span>
      </div>

      <div className="space-y-3">
        {scenes.map((scene, idx) => {
          const isActive = idx === activeSceneIndex;

          return (
            <div
              key={scene.id || idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isActive
                  ? 'bg-slate-900 border-rose-500/60 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header / Accordion Bar */}
              <div
                onClick={() => setActiveSceneIndex(idx)}
                className="flex items-center justify-between p-3.5 cursor-pointer select-none bg-slate-950/40 hover:bg-slate-950/70 transition"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                      isActive ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200">{scene.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 max-w-md">
                      {scene.subtitleText || scene.voiceText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-md">
                    {scene.duration}s
                  </span>
                  {scene.mediaUrl && (
                    <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                      มีรูป
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Scene Editor */}
              {isActive && (
                <div className="p-4 border-t border-slate-800/80 space-y-4 bg-slate-900/80">
                  {/* Spoken Voiceover Text */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                        <span>บทพากย์เสียง (Voiceover TTS)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleTestVoice(scene.voiceText)}
                        className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center space-x-1 font-medium"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>ฟังเสียงพากย์</span>
                      </button>
                    </div>
                    <textarea
                      value={scene.voiceText}
                      onChange={(e) => handleFieldChange(idx, 'voiceText', e.target.value)}
                      rows={2}
                      placeholder="ข้อความที่ระบบจะพูดพากย์เสียง..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Subtitle Text & Highlight Word */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-slate-300 mb-1 block">
                        ข้อความซับไตเติลบนหน้าจอ (สั้น กระชับ อ่านง่าย)
                      </label>
                      <input
                        type="text"
                        value={scene.subtitleText}
                        onChange={(e) => handleFieldChange(idx, 'subtitleText', e.target.value)}
                        placeholder="ข้อความโชว์บนคลิป..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-amber-300 mb-1 block">
                        คำไฮไลต์สีเหลือง ⭐
                      </label>
                      <input
                        type="text"
                        value={scene.highlightWord || ''}
                        onChange={(e) => handleFieldChange(idx, 'highlightWord', e.target.value)}
                        placeholder="เช่น พลาดมาก / ตัวจบ"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-amber-300 font-semibold placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Media Upload & Ken Burns Animation */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Image / Media */}
                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1 block flex items-center justify-between">
                        <span>รูปสินค้า / ภาพประกอบ</span>
                        {scene.mediaUrl && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange(idx, 'mediaUrl', undefined)}
                            className="text-[10px] text-rose-400 hover:underline"
                          >
                            ลบรูป
                          </button>
                        )}
                      </label>

                      {scene.mediaUrl ? (
                        <div className="relative group aspect-video rounded-xl overflow-hidden border border-slate-700 bg-black">
                          <img
                            src={scene.mediaUrl}
                            alt="Scene visual"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-800 hover:border-pink-500/50 rounded-xl cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition text-center">
                          <Upload className="w-4 h-4 text-slate-400 mb-1" />
                          <span className="text-[11px] text-slate-400">อัปโหลดรูปสินค้า</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, idx)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Ken Burns & Subtitle Style */}
                    <div>
                      <label className="text-xs font-medium text-slate-300 mb-1 block">
                        การเคลื่อนไหวกล้อง (Ken Burns)
                      </label>
                      <select
                        value={scene.kenBurns}
                        onChange={(e) => handleFieldChange(idx, 'kenBurns', e.target.value as KenBurnsEffect)}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                      >
                        <option value="zoom-in">🔍 ซูมเข้า (Zoom In)</option>
                        <option value="zoom-out">🔎 ซูมออก (Zoom Out)</option>
                        <option value="pan-up">⬆️ เลื่อนขึ้น (Pan Up)</option>
                        <option value="pan-down">⬇️ เลื่อนลง (Pan Down)</option>
                        <option value="pulse">💓 เต้นตามจังหวะ (Pulse)</option>
                        <option value="none">⏹️ นิ่ง (None)</option>
                      </select>
                    </div>

                    {/* Sound Effect & Duration */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-slate-300">
                          เอฟเฟกต์เสียง (SFX)
                        </label>
                        {scene.soundEffect && scene.soundEffect !== 'none' && (
                          <button
                            type="button"
                            onClick={() => handleTestSoundEffect(scene.soundEffect)}
                            className="text-[10px] text-cyan-400 hover:underline"
                          >
                            ลองฟัง
                          </button>
                        )}
                      </div>
                      <select
                        value={scene.soundEffect || 'none'}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleFieldChange(idx, 'soundEffect', val);
                          handleTestSoundEffect(val);
                        }}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="woosh">💨 ฟิ้วว (Woosh)</option>
                        <option value="ding">✨ ปิ๊งง (Ding Chime)</option>
                        <option value="cash">💰 ชะชิ้งกริ๊งๆ (Cash Register)</option>
                        <option value="pop">🫧 ป๊อป (Pop)</option>
                        <option value="camera">📸 แชะ (Camera Shutter)</option>
                        <option value="none">🔇 ไม่มีเสียง</option>
                      </select>
                    </div>
                  </div>

                  {/* Duration Slider */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>ความยาวฉากนี้:</span>
                      <span className="font-bold text-pink-400 font-mono">{scene.duration} วินาที</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      step={0.5}
                      value={scene.duration}
                      onChange={(e) => handleFieldChange(idx, 'duration', parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  {/* AI Visual Prompt for Image Generators (Midjourney / Imagen / Grok) */}
                  {scene.aiImagePrompt && (
                    <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>AI Visual Prompt สำหรับเจนรูป:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(scene.aiImagePrompt || '', scene.id)}
                          className="text-[10px] text-pink-400 hover:text-pink-300 flex items-center space-x-1"
                        >
                          {copiedPromptId === scene.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">คัดลอกแล้ว</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>คัดลอก Prompt</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono bg-slate-900/90 p-1.5 rounded-lg border border-slate-800/80">
                        {scene.aiImagePrompt}
                      </p>
                    </div>
                  )}

                  {/* Affiliate Stickers & Badges Management */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        ป้ายสติกเกอร์ / ปุ่ม Affiliate ในฉากนี้
                      </label>
                    </div>

                    {/* Sticker Quick Add Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <button
                        type="button"
                        onClick={() => handleAddSticker(idx, 'shopee-orange-basket')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/40 text-orange-300 hover:bg-orange-500/20 transition flex items-center space-x-1 font-bold"
                      >
                        <span>🧡 ตะกร้าส้ม Shopee Video</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddSticker(idx, 'shopee-voucher-50')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition flex items-center space-x-1"
                      >
                        <span>🏷️ โค้ดลด Shopee 50%</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddSticker(idx, 'tiktok-basket')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition flex items-center space-x-1"
                      >
                        <span>🛒 ตะกร้าเหลือง TikTok</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddSticker(idx, 'flash-sale')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition flex items-center space-x-1"
                      >
                        <span>⚡ Flash Sale</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddSticker(idx, 'discount-50')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 transition flex items-center space-x-1"
                      >
                        <span>🔥 ลด 50%</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddSticker(idx, 'stars-rating')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 transition flex items-center space-x-1"
                      >
                        <span>⭐ 5 ดาว 4.9/5</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddSticker(idx, 'free-shipping')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition flex items-center space-x-1"
                      >
                        <span>🚚 ส่งฟรี</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddSticker(idx, 'arrow-pointer')}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition flex items-center space-x-1"
                      >
                        <span>👇 พิกัดที่คอมเมนต์</span>
                      </button>
                    </div>

                    {/* Active Stickers in Scene */}
                    {scene.stickers && scene.stickers.length > 0 && (
                      <div className="space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
                        {scene.stickers.map((stk) => (
                          <div
                            key={stk.id}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                          >
                            <span className="font-medium text-slate-200">{stk.label}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSticker(idx, stk.id)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
