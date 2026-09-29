import React, { useState } from 'react';
import { ShopeeProductData } from '../types';
import { parseShopeeInput, SHOPEE_SAMPLE_DATABASE, preloadShopeeImage, fetchShopeeProductData } from '../services/shopeeService';
import {
  X, ShoppingBag, Link as LinkIcon, Sparkles, Image as ImageIcon, Star, ArrowRight, Loader2, RefreshCw
} from 'lucide-react';

interface ShopeeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProduct: (data: ShopeeProductData) => void;
}

export const ShopeeImportModal: React.FC<ShopeeImportModalProps> = ({
  isOpen,
  onClose,
  onImportProduct,
}) => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ShopeeProductData | null>(() => SHOPEE_SAMPLE_DATABASE['earbuds-pro']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<string[]>(SHOPEE_SAMPLE_DATABASE['earbuds-pro'].images);

  if (!isOpen) return null;

  const handleExtract = async () => {
  if (!inputUrl.trim()) return;
  setIsLoading(true);

  try {
    const fetched = await fetchShopeeProductData(inputUrl);
    if (fetched) {
      setExtractedData(fetched);
      setSelectedImages(fetched.images);
    } else {
      const parsed = parseShopeeInput(inputUrl);
      if (parsed) {
        setExtractedData(parsed);
        setSelectedImages(parsed.images);
      }
    }
  } catch (e) {
    console.warn('Shopee fetch error:', e);
  }
  setIsLoading(false);
};

  const handleSelectSample = (key: string) => {
    const sample = SHOPEE_SAMPLE_DATABASE[key];
    if (sample) {
      setExtractedData(sample);
      setSelectedImages(sample.images);
      setInputUrl(sample.productUrl);
    }
  };

  const handleApplyToStudio = async () => {
    if (!extractedData) return;
    setIsLoading(true);

    const finalData: ShopeeProductData = {
      ...extractedData,
      images: selectedImages.length > 0 ? selectedImages : extractedData.images
    };

    // Preload images into browser memory cache
    try {
      await Promise.allSettled(
        finalData.images.map(url => preloadShopeeImage(url))
      );
    } catch (e) {
      console.warn('Image preloading minor issue:', e);
    }

    onImportProduct(finalData);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <span>ดึงข้อมูลสินค้า & คลังรูปภาพจาก Shopee</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold border border-orange-500/30">
                  Shopee Auto-Extract
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                วางลิงก์ Shopee หรือเลือกตัวอย่างสินค้าฮิตเพื่อดึงรูปและสเปกเข้าสู่วิดีโอ 9:16 ทันที
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Select Trending Shopee Catalog */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>สินค้าขายดีบน Shopee แนะนำ (คลิกเพื่อทดสอบดึงรูปทันที):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: 'earbuds-pro', name: '🎧 หูฟัง ANC Pro X', price: '฿389' },
                { key: 'air-fryer', name: '🍳 หม้อทอดไร้น้ำมัน 5.5L', price: '฿799' },
                { key: 'hyaluronic-serum', name: '✨ เซรั่มไฮยา Glass Skin', price: '฿290' },
                { key: 'tumbler-cup', name: '🧊 แก้วเก็บความเย็น 304', price: '฿199' },
                { key: 'wireless-mic', name: '🎙️ ไมค์ไร้สายติดเสื้อ 2.4G', price: '฿259' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleSelectSample(item.key)}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/90 hover:border-orange-500/50 text-left transition text-xs group"
                >
                  <div className="font-semibold text-slate-200 group-hover:text-orange-300 truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-orange-400 font-mono mt-0.5">
                    {item.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* URL & Text Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>หรือ วางลิงก์ Shopee (https://s.shopee.co.th/... หรือ https://shopee.co.th/...)</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="วางลิงก์สินค้า Shopee หรือข้อความแชร์จากแอป Shopee ที่นี่..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleExtract}
                disabled={isLoading || !inputUrl.trim()}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center space-x-1.5 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>ดึงข้อมูล</span>
              </button>
            </div>
          </div>

          {/* Extracted Product Preview Card */}
          {extractedData && (
            <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800/80 space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                    {extractedData.shopName || 'Shopee Verified'}
                  </span>
                  <h4 className="font-bold text-sm text-slate-100 mt-1 line-clamp-2">
                    {extractedData.title}
                  </h4>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-base font-extrabold text-orange-400 font-mono">
                    ฿{extractedData.price}
                  </div>
                  {extractedData.originalPrice && (
                    <div className="text-xs text-slate-500 line-through">
                      ฿{extractedData.originalPrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats pill */}
              <div className="flex flex-wrap gap-2 text-xs text-slate-400 font-medium">
                {extractedData.rating && (
                  <span className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{extractedData.rating} ({extractedData.ratingCount || 'รีวิว'})</span>
                  </span>
                )}
                {extractedData.soldCount && (
                  <span className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                    <span>🔥 ขายแล้ว {extractedData.soldCount} ชิ้น</span>
                  </span>
                )}
                {extractedData.discountPercentage && (
                  <span className="flex items-center space-x-1 bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-lg border border-rose-500/20">
                    <span>ลด {extractedData.discountPercentage}</span>
                  </span>
                )}
              </div>

              {/* High-Resolution Extracted Image Gallery */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>รูปภาพสินค้าที่ดึงมา ({extractedData.images.length} รูป - จะนำไปใส่ 5 ฉากอัตโนมัติ):</span>
                  </label>
                  <span className="text-[10px] text-slate-500">
                    ฉาก 1 (Hook) → ฉาก 5 (CTA)
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {extractedData.images.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-black group"
                    >
                      <img
                        src={imgUrl}
                        alt={`Shopee product ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                        ฉาก {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features snippet */}
              {extractedData.features && extractedData.features.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-xs font-semibold text-slate-400">จุดเด่นสำคัญ:</span>
                  <ul className="text-xs text-slate-300 space-y-0.5 list-disc list-inside">
                    {extractedData.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="line-clamp-1">{f}</li>
                    ))}
                  </ul>
                </div>
              )}
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
            disabled={!extractedData || isLoading}
            onClick={handleApplyToStudio}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/25 transition transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>กำลังโหลดรูปภาพเข้าสตูดิโอ...</span>
              </>
            ) : (
              <>
                <span>📥 นำข้อมูล & รูปภาพเข้าสู่สตูดิโอ 9:16</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
