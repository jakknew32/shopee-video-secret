import React, { useState } from 'react';
import { CustomPromptOptions } from '../types';
import { PROMPT_TEMPLATES } from '../services/aiService';
import {
  X, Sliders, Sparkles, User, MessageSquare,
  ShieldAlert, Check, Copy, Eye
} from 'lucide-react';

interface PromptCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: CustomPromptOptions;
  onSaveOptions: (newOptions: CustomPromptOptions) => void;
  productName: string;
}

export const CREATOR_PERSONAS = [
  {
    id: 'tech-guru',
    name: '💻 ครีเอเตอร์สายแกดเจ็ต / เทคโนโลยี',
    desc: 'อธิบายฟีเจอร์ชัดเจน มั่นใจ ใช้ศัพท์เทคกระชับแต่เข้าใจง่าย',
  },
  {
    id: 'beauty-queen',
    name: '💄 บิวตี้บล็อกเกอร์ / ตัวแม่ป้ายยา',
    desc: 'ภาษาเฟรนด์ลี่ สดใส มีความน่ารัก ชวนลอง กรี๊ดแรง',
  },
  {
    id: 'energetic-seller',
    name: '📣 แม่ค้าไลฟ์สดพลังบวก (Live Streamer)',
    desc: 'เสียงสูง มีเอเนอร์จี้ เร้าอารมณ์ ด่วนของจะหมด ยอดจองถล่มทลาย',
  },
  {
    id: 'honest-friend',
    name: '🤝 เพื่อนสนิทบอกเพื่อน (Real Friend)',
    desc: 'ชิลๆ ไม่ฮาร์ดเซลล์ เหมือนเพื่อนบอกต่อของดีที่ใช้จริง',
  },
  {
    id: 'smart-mom',
    name: '🏠 แม่บ้าน / พ่อบ้านยุคใหม่นักคำนวณ',
    desc: 'เน้นความคุ้มค่า ประหยัดเวลา ปลอดภัย คุ้มเงินทุกบาท',
  }
];

export const PromptCustomizerModal: React.FC<PromptCustomizerModalProps> = ({
  isOpen,
  onClose,
  options,
  onSaveOptions,
  productName,
}) => {
  const [customInstructions, setCustomInstructions] = useState(options.customInstructions || '');
  const [negativeConstraints, setNegativeConstraints] = useState(options.negativeConstraints || '');
  const [creatorPersona, setCreatorPersona] = useState(options.creatorPersona || CREATOR_PERSONAS[0].name);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(options.selectedTemplateId || 'before-after');
  const [creativityLevel, setCreativityLevel] = useState(options.creativityLevel || 0.7);
  const [enableShopeeBadges, setEnableShopeeBadges] = useState(options.enableShopeeBadges ?? true);
  const [activeTab, setActiveTab] = useState<'settings' | 'preview'>('settings');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveOptions({
      customInstructions: customInstructions.trim(),
      negativeConstraints: negativeConstraints.trim(),
      creatorPersona,
      selectedTemplateId,
      creativityLevel,
      enableShopeeBadges,
    });
    onClose();
  };

  const selectedTemplate = PROMPT_TEMPLATES.find((t) => t.id === selectedTemplateId);

  // Generate real-time prompt preview
  const previewSystemPrompt = `
[AI SCRIPTWRITER SYSTEM PROMPT]
คุณเป็นยอดนักสร้างคอนเทนต์วิดีโอสั้น (TikTok / Reels / Shorts 9:16)
- ชื่อสินค้า: "${productName || 'ตัวอย่างสินค้า'}"
- สวมบทบาทครีเอเตอร์ (Persona): ${creatorPersona}
${selectedTemplate ? `- สูตรสไตล์พิเศษ (${selectedTemplate.name}): ${selectedTemplate.promptInject}` : ''}
${customInstructions ? `- คำสั่งเฉพาะเจาะจงเพิ่มเติม: ${customInstructions}` : ''}
${negativeConstraints ? `- ข้อห้ามเด็ดขาด (Negative Constraints): ${negativeConstraints}` : ''}
- ความคิดสร้างสรรค์ (Temperature): ${creativityLevel}

โครงสร้างสคริปต์ 5 ฉาก 25-30 วินาที พร้อมคำพากย์เสียง, ซับไตเติลบนหน้าจอ, และคำไฮไลต์สีเหลือง
`.trim();

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(previewSystemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-pink-500/10 rounded-xl text-pink-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <span>ปรับแต่งตัวเลือก Prompt & AI Persona</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full font-bold border border-pink-500/30">
                  Custom AI Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                กำหนดคำสั่งพิเศษ, บทบาทครีเอเตอร์, สูตรไวรัล และข้อห้ามสำหรับ AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'settings'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>ตั้งค่า Prompt & Persona</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-3 ml-6 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'preview'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>พรีวิวคำสั่งดิบ (Live Raw Prompt)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'settings' ? (
            <>
              {/* 1. Prompt Strategy Templates */}
              <div>
                <label className="text-xs font-semibold text-slate-200 mb-2 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>เลือกสูตร Prompt พิเศษ (Prompt Templates):</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PROMPT_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        selectedTemplateId === tpl.id
                          ? 'bg-pink-500/10 border-pink-500/60 text-white shadow-md'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className="font-bold text-xs">{tpl.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {tpl.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Creator Persona */}
              <div>
                <label className="text-xs font-semibold text-slate-200 mb-2 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>บทบาทของครีเอเตอร์ (AI Persona Voice):</span>
                </label>
                <select
                  value={creatorPersona}
                  onChange={(e) => setCreatorPersona(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-pink-500"
                >
                  {CREATOR_PERSONAS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} - {p.desc}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Custom Instructions */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                    <span>คำสั่งเฉพาะเจาะจงเพิ่มเติม (Custom Instructions)</span>
                  </label>
                  <span className="text-[10px] text-slate-500">เช่น "เน้นภาษาวัยรุ่น", "ย้ำเรื่องส่งฟรี"</span>
                </div>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={2}
                  placeholder="เช่น ให้ใช้ภาษาวัยรุ่น Gen Z มีคำว่า 'ตัวมารดา', 'ปังมาก', เน้นย้ำว่าของแท้ 100% มีรับประกัน 1 ปี..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none resize-none"
                />
              </div>

              {/* 4. Negative Constraints */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>ข้อห้ามเด็ดขาด (Negative Constraints)</span>
                  </label>
                  <span className="text-[10px] text-slate-500">ป้องกันคลิปโดนปิดกั้น</span>
                </div>
                <input
                  type="text"
                  value={negativeConstraints}
                  onChange={(e) => setNegativeConstraints(e.target.value)}
                  placeholder="เช่น ห้ามใช้คำว่า 'ซื้อเลย', ห้ามเคลมว่าหายขาด 100%, ห้ามพูดคำหยาบ..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                />
              </div>

              {/* 5. Creativity Slider & Shopee Auto Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Creativity (Temperature) */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span className="font-semibold">ระดับความคิดสร้างสรรค์:</span>
                    <span className="font-mono font-bold text-pink-400">{creativityLevel}</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={1.0}
                    step={0.05}
                    value={creativityLevel}
                    onChange={(e) => setCreativityLevel(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>ตรงเป๊ะ (0.2)</span>
                    <span className="text-pink-400/80">สมดุล (0.7)</span>
                    <span>ไวรัลสุดๆ (1.0)</span>
                  </div>
                </div>

                {/* Auto Badges Toggle */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">แทรกป้าย Shopee / TikTok อัตโนมัติ</span>
                    <span className="text-[10px] text-slate-400">ใส่ป้ายตะกร้าเหลือง, Flash Sale ในฉาก CTA</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableShopeeBadges}
                    onChange={(e) => setEnableShopeeBadges(e.target.checked)}
                    className="w-4 h-4 rounded accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Live Raw Prompt Preview Tab */
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  โครงสร้าง Prompt ที่จะถูกส่งไปยัง Google Flow / Grok / Meta AI:
                </span>
                <button
                  type="button"
                  onClick={handleCopyPreview}
                  className="text-xs text-pink-400 hover:text-pink-300 flex items-center space-x-1"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">คัดลอก Prompt แล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอก Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto">
                {previewSystemPrompt}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 transition transform active:scale-95"
          >
            บันทึกตัวเลือก Prompt
          </button>
        </div>
      </div>
    </div>
  );
};
