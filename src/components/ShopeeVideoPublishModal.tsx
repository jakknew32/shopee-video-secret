import React, { useState } from 'react';
import { VideoProject } from '../types';
import {
  X, ShoppingBag, ExternalLink, Copy, Check, Sparkles,
  Smartphone, Tag, Flame, AlertCircle, ArrowRight, Share2, CheckCircle2
} from 'lucide-react';

interface ShopeeVideoPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
  onOpenExportModal: () => void;
}

export const ShopeeVideoPublishModal: React.FC<ShopeeVideoPublishModalProps> = ({
  isOpen,
  onClose,
  project,
  onOpenExportModal,
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const shopeeVideoCaption = `🔥 รู้งี้ซื้อนานแล้ว! ${project.productName} ตัวช่วยตัวจบ รีวิวตรงๆ\n⚡ โค้ดลด Shopee Video สูงสุด 50% ส่งฟรีทั่วไทย\n👇 จิ้มตะกร้าส้มซ้ายล่างได้เลยค่ะ!\n\n#ShopeeVideoTH #รีวิวช้อปปี้ #Shopeeป้ายยา #พิกัดตะกร้าส้ม #โค้ดลดShopeeVideo #ShopeeHaul`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const productLinkOrName = project.shopeeData?.affiliateUrl || project.affiliateLink || project.productName;

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
                <span>โพสต์ลง Shopee Video พร้อมติดตะกร้าส้ม 🧡</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold border border-orange-500/30">
                  Shopee Video Creator
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                วิธีโพสต์วิดีโอ 9:16 + ผูกตะกร้าสินค้าส้ม เพื่อรับค่าคอมมิชชันและโค้ดลด 50%
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Copy Toolkit Box */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-orange-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click เครื่องมือเตรียมโพสต์ Shopee Video:</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Copy Product Link for Tagging */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block">
                    🔗 ลิงก์ / ชื่อสินค้าสำหรับติดตะกร้าส้ม
                  </span>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {productLinkOrName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(productLinkOrName, 'link')}
                  className="mt-2 text-xs py-1.5 px-3 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-bold flex items-center justify-center space-x-1 transition"
                >
                  {copiedItem === 'link' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอกลิงก์ไปค้นหาสินค้า</span>
                    </>
                  )}
                </button>
              </div>

              {/* Copy Shopee Video Caption */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-300 block">
                    📝 แคปชั่น Shopee Video + แฮชแท็กไวรัล
                  </span>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    #ShopeeVideoTH #รีวิวช้อปปี้ #พิกัดตะกร้าส้ม
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(shopeeVideoCaption, 'caption')}
                  className="mt-2 text-xs py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center space-x-1 transition"
                >
                  {copiedItem === 'caption' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">คัดลอกแคปชั่นแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอกแคปชั่นป้ายยา</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 4 Steps to Attach Orange Basket (ตะกร้าส้ม) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <span>📌 ขั้นตอนการโพสต์และติดตะกร้าส้มใน Shopee (4 สเต็ปง่ายๆ):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Step 1 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span className="font-bold text-slate-100">เปิดแอป Shopee</span>
                </div>
                <p className="text-slate-400 text-[11px] pl-7">
                  กดเมนู <span className="text-orange-400 font-semibold">"Shopee Video"</span> (แท็บตรงกลางล่าง) แล้วกดไอคอนกล้อง 📷 ที่มุมขวาบน
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <span className="font-bold text-slate-100">เลือกวิดีโอ 9:16 ที่ดาวน์โหลด</span>
                </div>
                <p className="text-slate-400 text-[11px] pl-7">
                  เลือกไฟล์วิดีโอ 9:16 จากมือถือที่เรนเดอร์เสร็จแล้ว กดปุ่ม "ถัดไป" (Next)
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-orange-500/40 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[11px]">
                    3
                  </span>
                  <span className="font-bold text-orange-300">กดปุ่ม "เพิ่มสินค้า" (ติดตะกร้าส้ม) 🧡</span>
                </div>
                <p className="text-slate-400 text-[11px] pl-7">
                  กดที่ <span className="text-orange-400 font-semibold">"เพิ่มสินค้า" (Add Product)</span> แล้ววางชื่อหรือลิงก์สินค้าที่คัดลอกไว้ เพื่อเลือกสินค้ามาผูกกับคลิป
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[11px]">
                    4
                  </span>
                  <span className="font-bold text-slate-100">วางแคปชั่น & กดโพสต์</span>
                </div>
                <p className="text-slate-400 text-[11px] pl-7">
                  วางแคปชั่นพร้อมแฮชแท็ก แล้วกด <span className="text-emerald-400 font-semibold">"โพสต์"</span> ตะกร้าส้มจะแสดงบนวิดีโอทันที!
                </p>
              </div>
            </div>
          </div>

          {/* Shopee Video Commission & Voucher Hacks */}
          <div className="p-3.5 bg-gradient-to-r from-orange-950/60 to-slate-950 rounded-xl border border-orange-500/20 space-y-1.5 text-xs">
            <span className="font-bold text-orange-300 flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>เคล็ดลับเพิ่มยอดขายบน Shopee Video:</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              <li>Shopee Video แจกโค้ดลด 30% - 50% ให้คนดูทุกวัน ยอดสั่งซื้อจะสูงกว่าช่องทางอื่น</li>
              <li>การติดตะกร้าส้มตรงกับสินค้าในคลิป จะทำให้ระบบดันคลิปเข้าฟีด For You ง่ายขึ้น 3 เท่า</li>
              <li>สามารถใส่แฮชแท็ก #ShopeeVideoTH #รีวิวช้อปปี้ เพื่อร่วมแคมเปญแจกโบนัสครีเอเตอร์</li>
            </ul>
          </div>

          {/* Direct Portals */}
          <div className="pt-1">
            <span className="text-xs font-semibold text-slate-400 mb-2 block">
              🚀 ลิงก์ตรงเปิด Shopee Creator Studio / Affiliate:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="https://creator.shopee.co.th"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-orange-300 font-bold transition"
              >
                <span>🌐 Shopee Creator Center (PC Web)</span>
                <ExternalLink className="w-4 h-4 text-orange-400" />
              </a>

              <a
                href="https://affiliate.shopee.co.th"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 font-bold transition"
              >
                <span>📊 Shopee Affiliate Portal</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            ปิด
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenExportModal();
            }}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/25 transition transform active:scale-95"
          >
            <span>เรนเดอร์ & ดาวน์โหลดวิดีโอ 9:16</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
