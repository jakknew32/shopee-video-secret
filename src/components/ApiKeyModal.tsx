import React, { useState } from 'react';
import { ApiKeys } from '../types';
import { X, Key, CheckCircle, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiKeys;
  onSaveKeys: (keys: ApiKeys) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKeys,
  onSaveKeys,
}) => {
  const [geminiKey, setGeminiKey] = useState(apiKeys.geminiApiKey || '');
  const [grokKey, setGrokKey] = useState(apiKeys.grokApiKey || '');
  const [metaKey, setMetaKey] = useState(apiKeys.metaApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKeys({
      geminiApiKey: geminiKey.trim(),
      grokApiKey: grokKey.trim(),
      metaApiKey: metaKey.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ตั้งค่า AI Engine API Keys</h3>
              <p className="text-xs text-slate-400">เชื่อมต่อ Google Flow, Grok (xAI) และ Meta AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Note regarding offline mode */}
          <div className="flex items-start space-x-3 p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-200">
            <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">ระบบมีความเป็นส่วนตัว 100%:</span> คีย์จะถูกบันทึกไว้ใน Browser (LocalStorage) ของคุณเท่านั้น ไม่มีการส่งไปเก็บที่เซิร์ฟเวอร์ภายนอก
              <div className="mt-1 text-slate-300">
                💡 <span className="font-medium text-amber-300">ไม่ใส่คีย์ก็ใช้งานได้:</span> ระบบมี Smart Template AI ในตัว เจนสคริปต์ affiliate สไตล์ไทยได้ทันที!
              </div>
            </div>
          </div>

          {/* Google Flow / Gemini API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-cyan-300 flex items-center space-x-1.5">
                <span>🌟 Google Flow (Gemini API Key)</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>รับคีย์ฟรีที่ Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>

          {/* Grok (xAI) API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-amber-300 flex items-center space-x-1.5">
                <span>🚀 Grok (xAI API Key)</span>
              </label>
              <a
                href="https://console.x.ai"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1"
              >
                <span>รับคีย์ที่ xAI Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={grokKey}
              onChange={(e) => setGrokKey(e.target.value)}
              placeholder="xai-..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>

          {/* Meta AI / Groq API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-purple-300 flex items-center space-x-1.5">
                <span>🟣 Meta AI (Llama 3 via Groq API)</span>
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-400 hover:underline flex items-center space-x-1"
              >
                <span>รับคีย์ฟรีที่ Groq Cloud</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={metaKey}
              onChange={(e) => setMetaKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <div className="text-xs text-slate-400 flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>กดบันทึกเพื่อเริ่มใช้งานทันที</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-pink-500/20 transition"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>บันทึกสำเร็จ!</span>
                </>
              ) : (
                <span>บันทึกการตั้งค่า</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
