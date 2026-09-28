import React from 'react';
import { AIEngine, ApiKeys } from '../types';
import { Sparkles, Key, BookOpen, Download, Wand2, Zap, PlayCircle, ShoppingBag, Sliders, Tag } from 'lucide-react';

interface NavbarProps {
  currentEngine: AIEngine;
  onSelectEngine: (engine: AIEngine) => void;
  apiKeys: ApiKeys;
  onOpenApiKeyModal: () => void;
  onOpenGuideModal: () => void;
  onOpenExportModal: () => void;
  onOpenShopeeModal: () => void;
  onOpenShopeeVideoModal: () => void;
  onOpenPromptModal: () => void;
  onFastDemo: () => void;
  hasShopeeData?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentEngine,
  onSelectEngine,
  apiKeys,
  onOpenApiKeyModal,
  onOpenGuideModal,
  onOpenExportModal,
  onOpenShopeeModal,
  onOpenShopeeVideoModal,
  onOpenPromptModal,
  onFastDemo,
  hasShopeeData
}) => {
  const hasKeys = !!(apiKeys.geminiApiKey || apiKeys.grokApiKey || apiKeys.metaApiKey);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-pink-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-pink-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Affilimate
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  AI Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                สร้างวิดีโอ 9:16 สไตล์ TikTok • Shopee Video • Reels เพื่อทำ Affiliate
              </p>
            </div>
          </div>

          {/* AI Engine Switcher */}
          <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => onSelectEngine('auto')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentEngine === 'auto'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Smart Auto</span>
            </button>

            <button
              onClick={() => onSelectEngine('gemini')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentEngine === 'gemini'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Google Flow</span>
              {apiKeys.geminiApiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>

            <button
              onClick={() => onSelectEngine('grok')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentEngine === 'grok'
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🚀 Grok (xAI)</span>
              {apiKeys.grokApiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>

            <button
              onClick={() => onSelectEngine('meta')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentEngine === 'meta'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🟣 Meta AI</span>
              {apiKeys.metaApiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Shopee Importer Quick Header Button */}
            <button
              onClick={onOpenShopeeModal}
              title="ดึงข้อมูลและรูปภาพจาก Shopee"
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                hasShopeeData
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-orange-400 border-slate-700/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
              <span>ดึงรูป Shopee</span>
              {hasShopeeData && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>}
            </button>

            {/* Shopee Video Posting Helper Button */}
            <button
              onClick={onOpenShopeeVideoModal}
              title="เปิดคู่มือโพสต์ลง Shopee Video ติดตะกร้าส้ม"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-orange-600/90 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition"
            >
              <span>🧡 โพสต์ Shopee Video</span>
            </button>

            {/* Custom Prompt Header Button */}
            <button
              onClick={onOpenPromptModal}
              title="ปรับแต่งตัวเลือก Prompt & Persona"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-pink-300 text-xs font-medium border border-slate-700/60 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-pink-400" />
              <span>Prompt Options</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                hasKeys
                  ? 'bg-slate-800 text-emerald-400 border-emerald-500/30 hover:bg-slate-700'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>API Keys</span>
              {hasKeys && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
            </button>

            {/* Render & Export CTA */}
            <button
              onClick={onOpenExportModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 transition transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>เรนเดอร์ 9:16</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
