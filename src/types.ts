export type AIEngine = 'gemini' | 'grok' | 'meta' | 'auto';

export type ScriptFormula =
  | 'hook-problem-solve' // PAS: Problem - Agitate - Solution
  | 'aida'               // Attention - Interest - Desire - Action
  | 'viral-curiosity'    // ป้ายยาแบบอยากรู้อยากเห็น / คอนเทนต์กระแส
  | 'honest-review'      // รีวิวแบบเรียลๆ จากผู้ใช้จริง
  | 'unboxing-fast'      // เปิดกล่องแบบเร็ว สะดุดตา 15วิ
  | 'before-after'       // เปรียบเทียบ ก่อนใช้ vs หลังใช้
  | 'pros-cons'          // เจาะลึกข้อดี vs ข้อควรระวัง (สร้าง Trust)
  | 'hidden-gem';        // ไอเทมลับที่คนส่วนใหญ่ยังไม่รู้

export type Platform = 'tiktok' | 'shopee' | 'lazada' | 'reels' | 'shorts' | 'facebook';

export type TargetAudience =
  | 'general'
  | 'students'
  | 'office-workers'
  | 'moms'
  | 'tech-lovers'
  | 'beauty'
  | 'budget-hunters';

export type ToneStyle =
  | 'energetic-seller' // แม่ค้าพลังบวก ตื่นเต้น เร้าอารมณ์
  | 'honest-reviewer'  // รีวิวตรงๆ เพื่อนบอกเพื่อน
  | 'humor-viral'      // ตลก กวนๆ ภาษา Gen Z
  | 'luxury-expert'    // ดูแพง มืออาชีพ น่าเชื่อถือ
  | 'urgent-deal';     // แจกพิกัด ด่วน ของจะหมด

export type SceneType = 'hook' | 'problem' | 'solution' | 'benefits' | 'cta';

export type SubtitleStyle =
  | 'tiktok-yellow'    // พื้นหลังดำ ตัวอักษรขาว ไฮไลต์คำเหลือง
  | 'karaoke-pop'      // เด้งทีละคำ สไตล์ TikTok ยอดฮิต
  | 'neon-glow'        // แสงนีออน สไตล์เกมเมอร์/วัยรุ่น
  | 'bold-clean'       // ตัวหนาคมชัด สไตล์มินิมอล
  | 'gradient-box';    // กล่องสีไล่เฉด สวยสะดุดตา

export type KenBurnsEffect = 'zoom-in' | 'zoom-out' | 'pan-up' | 'pan-down' | 'pulse' | 'none';

export type StickerType =
  | 'tiktok-basket'         // ตะกร้าเหลือง TikTok
  | 'shopee-orange-basket'  // ตะกร้าส้ม Shopee Video
  | 'shopee-voucher-50'     // โค้ดลด Shopee Video 50%
  | 'shopee-voucher-30'     // โค้ดลด Shopee Video 30%
  | 'shopee-deal'           // ป้าย Shopee ลดกระหน่ำ
  | 'lazada-voucher'        // โค้ดลด Lazada
  | 'discount-50'           // ป้ายลด 50%
  | 'flash-sale'            // Flash Sale มีไฟวิ่ง
  | 'arrow-pointer'         // ลูกศรชี้ซ้ายล่าง
  | 'stars-rating'          // 5 ดาว รีวิวแน่น
  | 'free-shipping';        // ส่งฟรี ทั่วไทย

export interface StickerOverlay {
  id: string;
  type: StickerType;
  label: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  scale: number;
  rotation?: number;
  color?: string;
  badgeText?: string;
}

export interface Scene {
  id: string;
  type: SceneType;
  title: string;
  voiceText: string;       // ข้อความพากย์เสียง TTS
  subtitleText: string;    // ข้อความขึ้นบนหน้าจอ (บรรทัดสั้นๆ จำง่าย)
  highlightWord?: string;  // คำที่จะเน้นสีสะดุดตา
  duration: number;        // วินาที (เช่น 3.5s)
  mediaType: 'image' | 'video' | 'gradient' | 'ai-prompt';
  mediaUrl?: string;       // URL รูป/วิดีโอ (Base64 หรือ Cloud)
  aiImagePrompt?: string;  // Prompt สำหรับส่งเจนภาพ (Google Imagen / Grok / Midjourney)
  gradientTheme: string;   // ธีมสีพื้นหลังกรณีไม่มีรูป
  kenBurns: KenBurnsEffect;
  subtitleStyle: SubtitleStyle;
  stickers: StickerOverlay[];
  soundEffect?: 'woosh' | 'ding' | 'cash' | 'pop' | 'camera' | 'none';
}

export interface ShopeeProductData {
  title: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: string;
  rating?: string;
  ratingCount?: string;
  soldCount?: string;
  shopLocation?: string;
  shopName?: string;
  description: string;
  features: string[];
  images: string[];
  productUrl: string;
  affiliateUrl?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  promptInject: string;
}

export interface CustomPromptOptions {
  customInstructions: string;     // คำสั่งเฉพาะ เช่น "ห้ามใช้คำว่าซื้อเลย", "เน้นภาษาวัยรุ่น"
  negativeConstraints: string;    // สิ่งที่ห้ามมีในสคริปต์
  creatorPersona: string;         // สวมบทบาทครีเอเตอร์ เช่น "บิวตี้บล็อกเกอร์ตัวแม่", "สายไอทีมืออาชีพ"
  selectedTemplateId?: string;    // ID ของ Template Prompt ที่เลือก
  creativityLevel: number;        // 0.2 (เน้นข้อมูลตรงเป๊ะ) - 1.0 (ครีเอทีฟสุดๆ)
  enableShopeeBadges: boolean;    // แทรกป้ายลดราคา Shopee ลงใน CTA อัตโนมัติ
}

export interface VideoProject {
  id: string;
  title: string;
  productName: string;
  productCategory: string;
  productPrice: string;
  originalPrice: string;
  productFeatures: string;
  affiliatePlatform: Platform;
  affiliateLink: string;
  targetAudience: TargetAudience;
  tone: ToneStyle;
  formula: ScriptFormula;
  aiEngine: AIEngine;
  scenes: Scene[];
  totalDuration: number;
  bgmTrack: string;
  bgmVolume: number;
  ttsVoice: string;
  ttsRate: number;
  ttsPitch: number;
  caption: string;
  hashtags: string[];
  shopeeData?: ShopeeProductData;
  customPromptOptions?: CustomPromptOptions;
}

export interface ApiKeys {
  geminiApiKey: string;
  grokApiKey: string;
  metaApiKey: string; // Groq / Together / OpenRouter for Llama 3
}

export interface EngineInfo {
  id: AIEngine;
  name: string;
  provider: string;
  model: string;
  badge: string;
  description: string;
  features: string[];
  color: string;
}
