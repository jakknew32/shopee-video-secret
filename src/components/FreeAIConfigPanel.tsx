import React, { useState, useEffect } from 'react';
import { FreeAIVideoConfig, FREE_VIDEO_MODELS } from '../services/freeAIVideoService';
import { cn } from '../utils/cn';

interface FreeAIConfigPanelProps {
  config: FreeAIVideoConfig;
  onConfigChange: (config: FreeAIVideoConfig) => void;
  isGenerating: boolean;
  onGenerateVideo: () => Promise<void>;
}

export const FreeAIConfigPanel: React.FC<FreeAIConfigPanelProps> = ({
  config,
  onConfigChange,
  isGenerating,
  onGenerateVideo
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'models'>('image');
  const [hfApiKey, setHfApiKey] = useState(config.hfApiKey || '');
  const [replicateApiKey, setReplicateApiKey] = useState(config.replicateApiKey || '');
  const [useLocalModels, setUseLocalModels] = useState(config.useLocalModels || false);
  const [generationStatus, setGenerationStatus] = useState<string>('');

  useEffect(() => {
    onConfigChange({
      hfApiKey,
      replicateApiKey,
      useLocalModels
    });
  }, [hfApiKey, replicateApiKey, useLocalModels, onConfigChange]);

  const handleGenerateWithFreeAI = async () => {
    setGenerationStatus('กำลังสร้างรูปภาพด้วย AI ฟรี...');
    try {
      await onGenerateVideo();
      setGenerationStatus('สร้างรูปภาพสำเร็จ! กด "Export Video" เพื่อเรนเดอร์วิดีโอ');
    } catch (error) {
      setGenerationStatus(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          🤖 Free AI Video Generation
          <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
            ฟรี 100%
          </span>
        </h3>
        <button
          onClick={handleGenerateWithFreeAI}
          disabled={isGenerating}
          className={cn(
            'px-4 py-2 rounded-xl font-bold transition-all',
            isGenerating
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700'
          )}
        >
          {isGenerating ? '⏳ กำลังสร้าง...' : '🚀 สร้างวิดีโอด้วย AI ฟรี'}
        </button>
      </div>

      {generationStatus && (
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-slate-300">
          {generationStatus}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-800">
        <nav className="flex gap-4" role="tablist">
          {[
            { id: 'image', label: '🖼️ Text-to-Image', desc: 'สร้างรูปภาพฉากต่างๆ' },
            { id: 'video', label: '🎬 Text-to-Video', desc: 'สร้างวิดีโอตรงจากข้อความ' },
            { id: 'models', label: '📋 โมเดลที่ใช้ได้', desc: 'รายการโมเดล AI ฟรี' }
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex flex-col items-start py-2 px-2 border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              )}
            >
              <span className="font-medium text-sm">{tab.label}</span>
              <span className="text-xs text-slate-500">{tab.desc}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      {activeTab === 'image' && (
        <div className="space-y-4" role="tabpanel">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="font-medium text-slate-200 mb-3">🔑 API Keys สำหรับสร้างรูปภาพ (Optional)</h4>
            <p className="text-xs text-slate-400 mb-4">
              ใส่ API Key เพื่อสร้างรูปภาพคุณภาพสูงด้วย AI ฟรี ไม่ใส่ก็ได้ (จะใช้รูปสำรองจาก Unsplash)
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Hugging Face API Key</label>
                <input
                  type="password"
                  value={hfApiKey}
                  onChange={(e) => setHfApiKey(e.target.value)}
                  placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
                <p className="text-xs text-slate-500 mt-1">
                  ขอฟรีได้ที่ <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener" className="text-emerald-400 hover:underline">huggingface.co/settings/tokens</a>
                </p>
              </div>
              
              <div>
                <label className="block text-xs text-slate-400 mb-1">Replicate API Key</label>
                <input
                  type="password"
                  value={replicateApiKey}
                  onChange={(e) => setReplicateApiKey(e.target.value)}
                  placeholder="r8_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
                <p className="text-xs text-slate-500 mt-1">
                  ขอฟรีได้ที่ <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener" className="text-emerald-400 hover:underline">replicate.com/account/api-tokens</a> (มีเครดิตฟรี $10/เดือน)
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="font-medium text-slate-200 mb-3">⚙️ ตัวเลือกการสร้าง</h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useLocalModels}
                onChange={(e) => setUseLocalModels(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded border-slate-600"
              />
              <span className="text-sm text-slate-300">
                ใช้โมเดลในเครื่อง (Transformers.js / ONNX) - ไม่ต้องอินเทอร์เน็ต แต่ช้ากว่า
              </span>
            </label>
          </div>

          <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-xl">
            <h4 className="font-medium text-emerald-300 mb-2">💡 วิธีใช้งาน</h4>
            <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
              <li>ใส่ Hugging Face API Key (ฟรี ไม่ต้องผูกบัตรเครดิต)</li>
              <li>หรือใส่ Replicate API Key (ได้เครดิตฟรี $10/เดือน)</li>
              <li>กดปุ่ม "สร้างวิดีโอด้วย AI ฟรี" ระบบจะสร้างรูปภาพทุกฉากอัตโนมัติ</li>
              <li>รูปภาพจะถูกนำไปประกอบเป็นวิดีโอ 9:16 พร้อมซับไตเติล สติกเกอร์ และเอฟเฟกต์</li>
            </ol>
          </div>
        </div>
      )}

      {activeTab === 'video' && (
        <div className="space-y-4" role="tabpanel">
          <div className="p-4 bg-amber-900/30 border border-amber-500/30 rounded-xl">
            <h4 className="font-medium text-amber-300 mb-2">⚠️ สถานะ Text-to-Video ฟรี</h4>
            <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
              <li>โมเดลฟรีส่วนใหญ่ให้ความละเอียดต่ำ (320x240 - 576x320)</li>
              <li>ระยะเวลาสั้นมาก (3-16 วินาที)</li>
              <li>ไม่ควบคุมรายละเอียดฉากได้ละเอียดเหมือน Image-to-Video</li>
              <li>แนะนำให้ใช้ <strong>Text-to-Image + Canvas Renderer</strong> แทน (คุณภาพดีกว่ามาก)</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="font-medium text-slate-200 mb-3">🎬 โมเดล Text-to-Video ฟรี</h4>
            <div className="space-y-3">
              {Object.entries(FREE_VIDEO_MODELS.textToVideo).map(([key, model]) => (
                <div key={key} className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-100">{model.name}</p>
                      <p className="text-xs text-slate-400">{model.provider} • {model.maxDuration}s • {model.resolution}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded">{model.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="space-y-4" role="tabpanel">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="font-medium text-slate-200 mb-3">🖼️ Text-to-Image Models (แนะนำสำหรับทำวิดีโอ)</h4>
            <div className="space-y-2">
              {Object.entries(FREE_VIDEO_MODELS.textToImage).map(([key, model]) => (
                <div key={key} className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-100">{model.name}</p>
                      <p className="text-xs text-slate-400">{model.provider} • {model.resolution}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                      {model.cost}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="font-medium text-slate-200 mb-3">🎞️ Image-to-Video Models</h4>
            <div className="space-y-2">
              {Object.entries(FREE_VIDEO_MODELS.imageToVideo).map(([key, model]) => (
                <div key={key} className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-100">{model.name}</p>
                      <p className="text-xs text-slate-400">{model.provider} • {model.maxDuration}s • {model.resolution}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                      {model.cost}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl">
            <h4 className="font-medium text-blue-300 mb-2">💡 แนวทางที่แนะนำ (Best Practice)</h4>
            <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
              <li><strong>Text-to-Image:</strong> ใช้ SDXL Turbo / Flux Schnell สร้างรูปแต่ละฉาก (คุณภาพสูง เร็ว ฟรี)</li>
              <li><strong>Canvas Composer:</strong> ใช้ระบบ Canvas Renderer ที่มีอยู่ ประกอบรูป + ซับไตเติล + สติกเกอร์ + Ken Burns</li>
              <li><strong>Video Export:</strong> ใช้ MediaRecorder บันทึกเป็น WebM/MP4 (มีอยู่แล้วในระบบ)</li>
              <li><strong>Optional:</strong> ใช้ Image-to-Video (SVD) เพื่อเพิ่มการเคลื่อนไหวธรรมชาติมากขึ้น</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};