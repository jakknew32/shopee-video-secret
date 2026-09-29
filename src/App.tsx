import React, { useState } from 'react';
import {
  AIEngine, ApiKeys, CustomPromptOptions, Platform, Scene, ScriptFormula,
  ShopeeProductData, TargetAudience, ToneStyle, VideoProject
} from './types';
import { generateAffiliateScript, generateSmartAffiliateScript } from './services/aiService';
import { preloadShopeeImage } from './services/shopeeService';
import { Navbar } from './components/Navbar';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AffiliateCheatSheetModal } from './components/AffiliateCheatSheetModal';
import { ExportModal } from './components/ExportModal';
import { ShopeeImportModal } from './components/ShopeeImportModal';
import { ShopeeVideoPublishModal } from './components/ShopeeVideoPublishModal';
import { PromptCustomizerModal, CREATOR_PERSONAS } from './components/PromptCustomizerModal';
import { ProductScriptForm, PRESET_PRODUCTS } from './components/ProductScriptForm';
import { VideoStudioPlayer } from './components/VideoStudioPlayer';
import { SceneTimelineEditor } from './components/SceneTimelineEditor';
import { AudioMixerPanel } from './components/AudioMixerPanel';
import { FreeAIConfigPanel } from './components/FreeAIConfigPanel';
import { FreeAIVideoConfig, generateSceneImages } from './services/freeAIVideoService';

const LOCAL_STORAGE_KEY_KEYS = 'affilimate_ai_api_keys_v1';

export const App: React.FC = () => {
  // AI Engine state
  const [currentEngine, setCurrentEngine] = useState<AIEngine>('auto');

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_KEYS);
      return saved ? JSON.parse(saved) : { geminiApiKey: '', grokApiKey: '', metaApiKey: '' };
    } catch {
      return { geminiApiKey: '', grokApiKey: '', metaApiKey: '' };
    }
  });

  // Modal visibility states
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isShopeeModalOpen, setIsShopeeModalOpen] = useState<boolean>(false);
  const [isShopeeVideoModalOpen, setIsShopeeVideoModalOpen] = useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);

  // Shopee & Custom Prompt states
  const [shopeeData, setShopeeData] = useState<ShopeeProductData | undefined>(undefined);
  const [customPromptOptions, setCustomPromptOptions] = useState<CustomPromptOptions>({
    customInstructions: '',
    negativeConstraints: '',
    creatorPersona: CREATOR_PERSONAS[0].name,
    selectedTemplateId: 'before-after',
    creativityLevel: 0.7,
    enableShopeeBadges: true,
  });

  // Form input states
  const [productName, setProductName] = useState<string>('หูฟังบลูทูธตัดเสียงรบกวน Pro X');
  const [productCategory, setProductCategory] = useState<string>('แกดเจ็ต & อิเล็กทรอนิกส์');
  const [productFeatures, setProductFeatures] = useState<string>('ตัดเสียงรบกวน 98%, แบตเตอรี่อึด 40 ชม., ใส่วิ่งไม่หลุด, เบสแน่นตึ้บ');
  const [productPrice, setProductPrice] = useState<string>('389');
  const [originalPrice, setOriginalPrice] = useState<string>('1,290');
  const [affiliatePlatform, setAffiliatePlatform] = useState<Platform>('tiktok');
  const [affiliateLink, setAffiliateLink] = useState<string>('https://vt.tiktok.com/ZSXXXXXX/');
  const [formula, setFormula] = useState<ScriptFormula>('hook-problem-solve');
  const [tone, setTone] = useState<ToneStyle>('energetic-seller');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('general');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Free AI Video Generation config
  const [freeAIConfig, setFreeAIConfig] = useState<FreeAIVideoConfig>({
    hfApiKey: '',
    replicateApiKey: '',
    useLocalModels: false
  });
  const [isFreeAIGenerating, setIsFreeAIGenerating] = useState(false);

  // Audio settings
  const [ttsVoice, setTtsVoice] = useState<string>('');
  const [ttsRate, setTtsRate] = useState<number>(1.15);
  const [ttsPitch, setTtsPitch] = useState<number>(1.0);
  const [bgmTrack, setBgmTrack] = useState<string>('upbeat-tiktok');
  const [bgmVolume, setBgmVolume] = useState<number>(0.2);

  // Loaded DOM Images for Canvas
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Storyboard scenes & Player state
  const [scenes, setScenes] = useState<Scene[]>(() => {
    const initial = generateSmartAffiliateScript({
      productName: 'หูฟังบลูทูธตัดเสียงรบกวน Pro X',
      productCategory: 'แกดเจ็ต & อิเล็กทรอนิกส์',
      productFeatures: 'ตัดเสียงรบกวน 98%, แบตเตอรี่อึด 40 ชม., ใส่วิ่งไม่หลุด, เบสแน่นตึ้บ',
      productPrice: '389',
      originalPrice: '1,290',
      affiliatePlatform: 'tiktok',
      targetAudience: 'general',
      tone: 'energetic-seller',
      formula: 'hook-problem-solve',
      engine: 'auto',
      apiKeys: { geminiApiKey: '', grokApiKey: '', metaApiKey: '' }
    });
    return initial.scenes;
  });

  const [caption, setCaption] = useState<string>('');
  const [hashtags, setHashtags] = useState<string[]>(['#หูฟังบลูทูธ', '#รีวิวของดี', '#นายหน้าtiktok', '#tiktokshopครีเอเตอร์']);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);

  // Save API keys to localStorage
  const handleSaveKeys = (newKeys: ApiKeys) => {
    setApiKeys(newKeys);
    localStorage.setItem(LOCAL_STORAGE_KEY_KEYS, JSON.stringify(newKeys));
  };

  // Cache loaded Image objects for canvas drawing
  const handleImageLoaded = (url: string, imgElement: HTMLImageElement) => {
    setLoadedImages((prev) => {
      const next = new Map(prev);
      next.set(url, imgElement);
      return next;
    });
  };

  // Import Shopee Product & Load Images
  const handleImportShopee = async (data: ShopeeProductData) => {
    setShopeeData(data);
    setProductName(data.title);
    setProductPrice(data.price);
    if (data.originalPrice) setOriginalPrice(data.originalPrice);
    if (data.features && data.features.length > 0) {
      setProductFeatures(data.features.join(', '));
    }
    setAffiliatePlatform('shopee');
    setAffiliateLink(data.affiliateUrl || data.productUrl);

    // Preload image elements into DOM memory
    for (const imgUrl of data.images) {
      try {
        const img = await preloadShopeeImage(imgUrl);
        handleImageLoaded(imgUrl, img);
      } catch (e) {
        console.warn('Preload image failed:', imgUrl, e);
      }
    }

    // Auto-generate script with Shopee data and images attached
    const generated = generateSmartAffiliateScript({
      productName: data.title,
      productCategory: 'Shopee Official Store',
      productFeatures: data.features.join(', '),
      productPrice: data.price,
      originalPrice: data.originalPrice,
      affiliatePlatform: 'shopee',
      targetAudience,
      tone,
      formula,
      engine: currentEngine,
      apiKeys,
      shopeeData: data,
      customPromptOptions,
    });

    setScenes(generated.scenes);
    setCaption(generated.caption);
    setHashtags(generated.hashtags);
    setCurrentSceneIndex(0);
  };

  // Generate Script & Storyboard via AI
  const handleGenerateScript = async () => {
    if (!productName.trim()) return;
    setIsGenerating(true);

    try {
      const result = await generateAffiliateScript({
        productName,
        productCategory,
        productFeatures,
        productPrice,
        originalPrice,
        affiliatePlatform,
        targetAudience,
        tone,
        formula,
        engine: currentEngine,
        apiKeys,
        shopeeData,
        customPromptOptions,
      });

      setScenes(result.scenes);
      setCaption(result.caption);
      setHashtags(result.hashtags);
      setCurrentSceneIndex(0);
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Load Preset Product
  const handleLoadPreset = (key: string) => {
    const preset = PRESET_PRODUCTS.find((p) => p.key === key);
    if (!preset) return;

    setProductName(preset.name);
    setProductCategory(preset.cat);
    setProductPrice(preset.price);
    setOriginalPrice(preset.orig);
    setProductFeatures(preset.features);
    setAffiliatePlatform(preset.platform);
    setTone(preset.tone);
    setFormula(preset.formula);
    setTargetAudience(preset.audience);

    const generated = generateSmartAffiliateScript({
      productName: preset.name,
      productCategory: preset.cat,
      productFeatures: preset.features,
      productPrice: preset.price,
      originalPrice: preset.orig,
      affiliatePlatform: preset.platform,
      targetAudience: preset.audience,
      tone: preset.tone,
      formula: preset.formula,
      engine: currentEngine,
      apiKeys,
      shopeeData,
      customPromptOptions,
    });

    setScenes(generated.scenes);
    setCaption(generated.caption);
    setHashtags(generated.hashtags);
    setCurrentSceneIndex(0);
  };

  // Generate video with Free AI
  const handleGenerateWithFreeAI = async () => {
    setIsFreeAIGenerating(true);
    
    try {
      // First, generate the script if not already done
      const result = await generateAffiliateScript({
        productName,
        productCategory,
        productFeatures,
        productPrice,
        originalPrice,
        affiliatePlatform,
        targetAudience,
        tone,
        formula,
        engine: currentEngine,
        apiKeys,
        shopeeData,
        customPromptOptions,
      });

      setScenes(result.scenes);
      setCaption(result.caption);
      setHashtags(result.hashtags);
      setCurrentSceneIndex(0);

      // Then generate images for each scene using free AI.
      // Build the project from the freshly generated scenes - `currentProject`
      // is from the previous render and would still hold the old scenes.
      const draftProject: VideoProject = { ...currentProject, scenes: result.scenes };
      const sceneImages = await generateSceneImages(draftProject, freeAIConfig);

      // Attach each generated image to its scene AND preload it into the
      // canvas image cache. Updating `mediaUrl` is what makes the image
      // actually visible in the player, which reads `loadedImages.get(scene.mediaUrl)`.
      const newScenes = [...result.scenes];
      let loaded = 0;
      for (const [sceneId, imageUrl] of sceneImages.entries()) {
        const idx = newScenes.findIndex(s => s.id === sceneId);
        if (idx === -1) continue;
        newScenes[idx] = { ...newScenes[idx], mediaType: 'image', mediaUrl: imageUrl };
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = imageUrl;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              handleImageLoaded(imageUrl, img);
              resolve();
            };
            img.onerror = reject;
          });
          loaded++;
        } catch (e) {
          console.warn('Failed to load generated image:', sceneId, e);
        }
      }
      setScenes(newScenes);

      // The video itself is rendered by the canvas renderer + video recorder
      // when the user clicks Export.
      alert(
        `สร้างรูปภาพด้วย AI ฟรีเสร็จสิ้น! โหลดสำเร็จ ${loaded}/${sceneImages.size} รูป ` +
        `กดปุ่ม "Export Video" เพื่อเรนเดอร์วิดีโอ`
      );

    } catch (error) {
      console.error('Free AI generation failed:', error);
      // Rethrow so FreeAIConfigPanel's catch can show the failure - the panel
      // reports success whenever this promise resolves.
      throw error;
    } finally {
      setIsFreeAIGenerating(false);
    }
  };

  // Update a single scene
  const handleUpdateScene = (idx: number, updatedScene: Scene) => {
    const newScenes = [...scenes];
    newScenes[idx] = updatedScene;
    setScenes(newScenes);
  };

  // Computed Video Project Object
  const currentProject: VideoProject = {
    id: 'proj-1',
    title: `คลิปป้ายยา ${productName}`,
    productName,
    productCategory,
    productPrice,
    originalPrice,
    productFeatures,
    affiliatePlatform,
    affiliateLink,
    targetAudience,
    tone,
    formula,
    aiEngine: currentEngine,
    scenes,
    totalDuration: scenes.reduce((acc, s) => acc + (s.duration || 4), 0),
    bgmTrack,
    bgmVolume,
    ttsVoice,
    ttsRate,
    ttsPitch,
    caption,
    hashtags,
    shopeeData,
    customPromptOptions,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-prompt">
      {/* Top Navigation */}
      <Navbar
        currentEngine={currentEngine}
        onSelectEngine={setCurrentEngine}
        apiKeys={apiKeys}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenShopeeModal={() => setIsShopeeModalOpen(true)}
        onOpenShopeeVideoModal={() => setIsShopeeVideoModalOpen(true)}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        onFastDemo={() => handleLoadPreset('earphone')}
        hasShopeeData={!!shopeeData}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Product & AI Generator Form + Audio Mixer + Free AI Config (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ProductScriptForm
              productName={productName}
              setProductName={setProductName}
              productCategory={productCategory}
              setProductCategory={setProductCategory}
              productFeatures={productFeatures}
              setProductFeatures={setProductFeatures}
              productPrice={productPrice}
              setProductPrice={setProductPrice}
              originalPrice={originalPrice}
              setOriginalPrice={setOriginalPrice}
              affiliatePlatform={affiliatePlatform}
              setAffiliatePlatform={setAffiliatePlatform}
              affiliateLink={affiliateLink}
              setAffiliateLink={setAffiliateLink}
              formula={formula}
              setFormula={setFormula}
              tone={tone}
              setTone={setTone}
              targetAudience={targetAudience}
              setTargetAudience={setTargetAudience}
              isGenerating={isGenerating}
              onGenerate={handleGenerateScript}
              onLoadPreset={handleLoadPreset}
              onOpenShopeeModal={() => setIsShopeeModalOpen(true)}
              onOpenPromptModal={() => setIsPromptModalOpen(true)}
              shopeeData={shopeeData}
              customPromptOptions={customPromptOptions}
            />

            <FreeAIConfigPanel
              config={freeAIConfig}
              onConfigChange={setFreeAIConfig}
              isGenerating={isFreeAIGenerating}
              onGenerateVideo={handleGenerateWithFreeAI}
            />

            <AudioMixerPanel
              ttsVoice={ttsVoice}
              setTtsVoice={setTtsVoice}
              ttsRate={ttsRate}
              setTtsRate={setTtsRate}
              ttsPitch={ttsPitch}
              setTtsPitch={setTtsPitch}
              bgmTrack={bgmTrack}
              setBgmTrack={setBgmTrack}
              bgmVolume={bgmVolume}
              setBgmVolume={setBgmVolume}
            />
          </div>

          {/* Center / Right Column: 9:16 Player + Multi-Scene Storyboard Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live 9:16 Video Player */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-300">
                    Live 9:16 Vertical Preview (TikTok / Shopee Video / Reels)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsShopeeVideoModalOpen(true)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition font-bold"
                  >
                    🧡 โพสต์ Shopee Video
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono">
                    720 x 1280 HD
                  </span>
                </div>
              </div>

              <VideoStudioPlayer
                project={currentProject}
                loadedImages={loadedImages}
                currentSceneIndex={currentSceneIndex}
                setCurrentSceneIndex={setCurrentSceneIndex}
              />
            </div>

            {/* Storyboard Scene Editor */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
              <SceneTimelineEditor
                scenes={scenes}
                onUpdateScene={handleUpdateScene}
                activeSceneIndex={currentSceneIndex}
                setActiveSceneIndex={setCurrentSceneIndex}
                onImageUploaded={handleImageLoaded}
                ttsVoice={ttsVoice}
                ttsRate={ttsRate}
                ttsPitch={ttsPitch}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">Affilimate AI Video Studio</span>
            <span>•</span>
            <span>Shopee Video (ติดตะกร้าส้ม) + TikTok + Reels 9:16 Engine</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>รองรับ Google Flow (Gemini) • Grok (xAI) • Meta AI (Llama 3)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ShopeeImportModal
        isOpen={isShopeeModalOpen}
        onClose={() => setIsShopeeModalOpen(false)}
        onImportProduct={handleImportShopee}
      />

      <ShopeeVideoPublishModal
        isOpen={isShopeeVideoModalOpen}
        onClose={() => setIsShopeeVideoModalOpen(false)}
        project={currentProject}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      <PromptCustomizerModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        options={customPromptOptions}
        onSaveOptions={setCustomPromptOptions}
        productName={productName}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKeys={apiKeys}
        onSaveKeys={handleSaveKeys}
      />

      <AffiliateCheatSheetModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={currentProject}
        loadedImages={loadedImages}
        onOpenShopeeVideoModal={() => setIsShopeeVideoModalOpen(true)}
      />
    </div>
  );
};
