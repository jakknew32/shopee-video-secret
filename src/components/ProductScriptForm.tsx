import React from 'react';
import { CustomPromptOptions, Platform, ScriptFormula, ShopeeProductData, TargetAudience, ToneStyle } from '../types';
import {
  Sparkles, ShoppingBag, Tag, Layers, Zap, Loader2, Sliders, Image as Star
} from 'lucide-react';

interface ProductScriptFormProps {
  productName: string;
  setProductName: (val: string) => void;
  productCategory: string;
  setProductCategory: (val: string) => void;
  productFeatures: string;
  setProductFeatures: (val: string) => void;
  productPrice: string;
  setProductPrice: (val: string) => void;
  originalPrice: string;
  setOriginalPrice: (val: string) => void;
  affiliatePlatform: Platform;
  setAffiliatePlatform: (val: Platform) => void;
  affiliateLink: string;
  setAffiliateLink: (val: string) => void;
  formula: ScriptFormula;
  setFormula: (val: ScriptFormula) => void;
  tone: ToneStyle;
  setTone: (val: ToneStyle) => void;
  targetAudience: TargetAudience;
  setTargetAudience: (val: TargetAudience) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onLoadPreset: (presetKey: string) => void;
  onOpenShopeeModal: () => void;
  onOpenPromptModal: () => void;
  shopeeData?: ShopeeProductData;
  customPromptOptions?: CustomPromptOptions;
}

export const PRESET_PRODUCTS = [
  {
    key: 'earphone',
    name: 'หูฟังบลูทูธตัดเสียงรบกวน Pro X',
    cat: 'แกดเจ็ต & อิเล็กทรอนิกส์',
    price: '389',
    orig: '1,290',
    features: 'ตัดเสียงรบกวนภายนอก 98%, แบตเตอรี่อึด 40 ชม., ใส่วิ่งออกกำลังกายไม่หลุด, เบสแน่นตึ้บระดับสตูดิโอ',
    platform: 'tiktok' as Platform,
    tone: 'energetic-seller' as ToneStyle,
    formula: 'hook-problem-solve' as ScriptFormula,
    audience: 'general' as TargetAudience,
  },
  {
    key: 'airfryer',
    name: 'หม้อทอดไร้น้ำมันกระจกใส 5.5L',
    cat: 'ของใช้ในบ้าน & ครัวเรือน',
    price: '799',
    orig: '2,490',
    features: 'มองเห็นอาหารข้างในไม่ต้องเปิดฝา, ปรับอุณหภูมิได้ถึง 200°C, ทำความสะอาดง่ายไม่ติดหม้อ, ลดไขมันได้ 90%',
    platform: 'shopee' as Platform,
    tone: 'honest-reviewer' as ToneStyle,
    formula: 'honest-review' as ScriptFormula,
    audience: 'moms' as TargetAudience,
  },
  {
    key: 'serum',
    name: 'เซรั่มไฮยาเข้มข้นหน้ากระจกใส Glass Skin',
    cat: 'สกินแคร์ & ความงาม',
    price: '290',
    orig: '890',
    features: 'กู้ผิวโทรมใน 7 วัน, ซึมไวไม่เหนอะหนะ, รูขุมขนกระชับ ผิวฉ่ำวาวอิ่มน้ำ, ผิวแพ้ง่ายใช้ได้ไม่มีแอลกอฮอล์',
    platform: 'tiktok' as Platform,
    tone: 'viral-curiosity' as any,
    formula: 'viral-curiosity' as ScriptFormula,
    audience: 'beauty' as TargetAudience,
  },
  {
    key: 'wireless-mic',
    name: 'ไมค์ไร้สายติดเสื้อ Type-C/Lightning สำหรับไลฟ์สด',
    cat: 'ไอที & อุปกรณ์ทำงาน',
    price: '259',
    orig: '690',
    features: 'เสียบปุ๊บติดปั๊บไม่ต้องโหลดแอป, ตัดเสียงลมเสียงรบกวนเนียนกริบ, แบตอึด 10 ชม., เหมาะกับสายทำคลิป TikTok',
    platform: 'tiktok' as Platform,
    tone: 'urgent-deal' as ToneStyle,
    formula: 'unboxing-fast' as ScriptFormula,
    audience: 'office-workers' as TargetAudience,
  }
];

export const ProductScriptForm: React.FC<ProductScriptFormProps> = ({
  productName,
  setProductName,
  productCategory,
  setProductCategory,
  productFeatures,
  setProductFeatures,
  productPrice,
  setProductPrice,
  originalPrice,
  setOriginalPrice,
  affiliatePlatform,
  setAffiliatePlatform,
  affiliateLink,
  setAffiliateLink,
  formula,
  setFormula,
  tone,
  setTone,
  targetAudience,
  setTargetAudience,
  isGenerating,
  onGenerate,
  onLoadPreset,
  onOpenShopeeModal,
  onOpenPromptModal,
  shopeeData,
  customPromptOptions,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Shopee Importer & Custom Prompt Quick Launch Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
        {/* Shopee Importer Button */}
        <button
          type="button"
          onClick={onOpenShopeeModal}
          className="flex items-center justify-between p-2.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold transition group"
        >
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-orange-500 text-white font-black text-[10px]">
              SHOPEE
            </span>
            <div className="text-left">
              <span className="block leading-tight">ดึงข้อมูล & รูปจาก Shopee</span>
              <span className="text-[10px] text-orange-400/80 font-normal">
                {shopeeData ? `ดึงแล้ว ${shopeeData.images.length} รูปภาพ` : 'วางลิงก์ดึงรูปใส่ 5 ฉากทันที'}
              </span>
            </div>
          </div>
          <span className="text-orange-400 group-hover:translate-x-0.5 transition font-bold">
            →
          </span>
        </button>

        {/* Custom AI Prompt Options Button */}
        <button
          type="button"
          onClick={onOpenPromptModal}
          className="flex items-center justify-between p-2.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold transition group"
        >
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-pink-500 text-white">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="block leading-tight">ตัวเลือก Prompt & Persona</span>
              <span className="text-[10px] text-pink-400/80 font-normal">
                {customPromptOptions?.customInstructions ? 'มีคำสั่งพิเศษเปิดใช้งาน' : 'สูตรก่อน-หลัง / ข้อห้าม / สไตล์'}
              </span>
            </div>
          </div>
          <span className="text-pink-400 group-hover:translate-x-0.5 transition font-bold">
            ⚙️
          </span>
        </button>
      </div>

      {/* Shopee Connected Information Banner (if Shopee data is active) */}
      {shopeeData && (
        <div className="p-3 bg-orange-950/40 border border-orange-500/30 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-orange-500/40 flex-shrink-0 bg-black">
              {shopeeData.images[0] && (
                <img
                  src={shopeeData.images[0]}
                  alt="Shopee main"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold text-orange-300 flex items-center space-x-1.5">
                <span>เชื่อมต่อข้อมูล Shopee สำเร็จ!</span>
                {shopeeData.rating && (
                  <span className="text-[10px] text-amber-300 flex items-center">
                    <Star className="w-3 h-3 fill-amber-300 inline mr-0.5" />
                    {shopeeData.rating}
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-400">
                นำรูป {shopeeData.images.length} ภาพ และสเปกจัดลงในทั้ง 5 ฉากเรียบร้อย
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenShopeeModal}
            className="text-[11px] text-orange-400 hover:underline font-semibold flex-shrink-0"
          >
            เปลี่ยนสินค้า
          </button>
        </div>
      )}

      {/* Top Presets Row */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>ตัวอย่างสินค้าฮิต (คลิกเพื่อโหลดทันที):</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_PRODUCTS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onLoadPreset(p.key)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:border-pink-500/40 transition flex items-center space-x-1"
            >
              <span>{p.name.split(' ')[0]}</span>
              <span className="text-[10px] text-pink-400 font-medium">฿{p.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Info */}
      <div className="space-y-3.5">
        {/* Product Name */}
        <div>
          <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5 mb-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-pink-400" />
            <span>ชื่อสินค้าที่ต้องการทำ Affiliate *</span>
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="เช่น หูฟังบลูทูธไร้สาย Pro X ตัดเสียงรบกวน"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-pink-500 transition"
          />
        </div>

        {/* Category & Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              หมวดหมู่สินค้า
            </label>
            <input
              type="text"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              placeholder="แกดเจ็ต / บิวตี้ / ของใช้"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span>ราคาโปร (บาท)</span>
              <Tag className="w-3 h-3 text-emerald-400" />
            </label>
            <input
              type="text"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="389"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-emerald-300 font-semibold placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              ราคาเต็มก่อนลด (บาท)
            </label>
            <input
              type="text"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="1,290"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-slate-600 rounded-xl text-xs text-slate-400 placeholder-slate-600 focus:outline-none line-through"
            />
          </div>
        </div>

        {/* Features / Selling points */}
        <div>
          <label className="text-xs font-medium text-slate-300 flex items-center space-x-1.5 mb-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>จุดเด่น / คุณสมบัติสำคัญของสินค้า</span>
          </label>
          <textarea
            value={productFeatures}
            onChange={(e) => setProductFeatures(e.target.value)}
            rows={2}
            placeholder="เช่น ตัดเสียงรบกวน 98%, แบตอึด 40 ชั่วโมง, เบสแน่น, ชาร์จไว Type-C"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none resize-none"
          />
        </div>

        {/* Platform Selector */}
        <div>
          <label className="text-xs font-medium text-slate-300 mb-1.5 block">
            แพลตฟอร์มปลายทางที่จะโพสต์ (CTA จะปรับตามแพลตฟอร์ม)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'tiktok', label: 'TikTok Shop', icon: '🛒', color: 'border-rose-500 bg-rose-500/10 text-rose-300' },
              { id: 'shopee', label: 'Shopee Affiliate', icon: '🧡', color: 'border-orange-500 bg-orange-500/10 text-orange-300' },
              { id: 'lazada', label: 'Lazada Affiliate', icon: '💙', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
              { id: 'reels', label: 'Reels / Shorts', icon: '🎥', color: 'border-purple-500 bg-purple-500/10 text-purple-300' },
            ].map((plt) => (
              <button
                key={plt.id}
                type="button"
                onClick={() => setAffiliatePlatform(plt.id as Platform)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border transition ${
                  affiliatePlatform === plt.id
                    ? plt.color + ' font-bold shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{plt.icon}</span>
                <span className="truncate">{plt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Affiliate Link Input */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1 block">
            ลิงก์สินค้า Affiliate (ไม่บังคับ - ไว้ใช้สร้างแคปชั่น)
          </label>
          <input
            type="text"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
            placeholder="https://vt.tiktok.com/... หรือ https://s.shopee.co.th/..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-slate-600 rounded-xl text-xs text-slate-300 placeholder-slate-700 focus:outline-none"
          />
        </div>

        {/* Advanced Strategy Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Formula */}
          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">
              สูตรโครงสร้างคลิป
            </label>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value as ScriptFormula)}
              className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pink-500"
            >
              <option value="hook-problem-solve">🔥 PAS (ขยี้ปัญหา-เฉลยตัวจบ)</option>
              <option value="viral-curiosity">⚡ ไวรัล (อยากรู้อยากเห็น/พลาดมาก)</option>
              <option value="honest-review">🎯 รีวิวเรียลๆ (พูดตรงๆ ไม่อวย)</option>
              <option value="before-after">🔄 Before & After (เทียบก่อน-หลัง)</option>
              <option value="pros-cons">⚖️ Pros & Cons (ข้อดี vs ข้อระวัง)</option>
              <option value="hidden-gem">💎 Hidden Gem (ไอเทมลับนอกกระแส)</option>
              <option value="unboxing-fast">📦 เปิดกล่องเร็ว (แกะกล่องของฮิต)</option>
              <option value="aida">🏆 AIDA (ดึงดูด-เร้าใจ-กดซื้อ)</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">
              โทนการพูด / อารมณ์
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ToneStyle)}
              className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pink-500"
            >
              <option value="energetic-seller">📣 แม่ค้าพลังบวก ตื่นเต้น</option>
              <option value="honest-reviewer">🤝 เพื่อนบอกเพื่อน ชิลๆ เรียลๆ</option>
              <option value="humor-viral">🤣 ตลก กวนๆ ภาษา Gen Z</option>
              <option value="urgent-deal">⚡ ด่วน ของจะหมด ลดวันเดียว</option>
              <option value="luxury-expert">💎 ดูแพง มินิมอล น่าเชื่อถือ</option>
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="text-[11px] font-medium text-slate-400 mb-1 block">
              กลุ่มเป้าหมาย
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
              className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pink-500"
            >
              <option value="general">🌍 ทั่วไป (Mass)</option>
              <option value="students">🎓 นักเรียน / นักศึกษา / เด็กหอ</option>
              <option value="office-workers">💼 คนทำงาน / มนุษย์เงินเดือน</option>
              <option value="moms">👶 คุณแม่ / แม่บ้าน</option>
              <option value="beauty">💄 สายบิวตี้ / ดูแลตัวเอง</option>
              <option value="tech-lovers">💻 สายไอที / แกดเจ็ต</option>
              <option value="budget-hunters">💰 สายล่าโปร / เน้นคุ้มค่า</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Generate Button */}
      <button
        type="button"
        disabled={isGenerating || !productName.trim()}
        onClick={onGenerate}
        className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm font-bold transition shadow-lg ${
          isGenerating || !productName.trim()
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:via-pink-600 hover:to-amber-600 text-white shadow-pink-500/25 active:scale-[0.99]'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            <span>AI กำลังแต่งสคริปต์ & วิดีโอ 9:16...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            <span>✨ สร้างสคริปต์ & ประกอบวิดีโอ 9:16 ด้วย AI</span>
          </>
        )}
      </button>
    </div>
  );
};
