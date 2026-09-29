import React from 'react';
import { X, BookOpen, Flame, Sparkles, Clock, AlertTriangle } from 'lucide-react';

interface AffiliateCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AffiliateCheatSheetModal: React.FC<AffiliateCheatSheetModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">คัมภีร์สร้างคลิป Affiliate ไวรัลยอดขายหลักแสน</h3>
              <p className="text-xs text-slate-400">เทคนิคการทำนายหน้า TikTok • Reels • Shorts อัปเดต 2026</p>
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* 1. Golden 3-Second Rule */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-sm text-amber-300 flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>1. กฎทอง 3 วินาทีแรก (Hook ที่ต้องหยุดนิ้วคนดู)</span>
            </h4>
            <p className="text-slate-400">
              AI ของ TikTok และ Reels วัดผลคลิปจาก 3 วินาทีแรก ถ้าคนดูไม่ปัดทิ้ง คลิปจะถูกดันเข้าฟีด For You ทันที!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-medium">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-rose-400 font-bold block mb-0.5">❌ ห้ามพูด:</span>
                "สวัสดีครับทุกคน วันนี้จะมารีวิว..." (คนปัดหนีทันที)
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-400 font-bold block mb-0.5">✅ ควรพูด:</span>
                "หยุดก่อน! รู้งี้ซื้อตั้งนานแล้ว..." หรือ "ใครที่มีปัญหา... ต้องดูคลิปนี้!"
              </div>
            </div>
          </div>

          {/* 2. Top 5 Hook Formulas */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-sm text-pink-300 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>2. 5 โครงสร้างบทคลิปขายดี (High Conversion Script)</span>
            </h4>
            <div className="space-y-2">
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="font-bold text-slate-100">🔥 สูตร 1: ขยี้ปัญหาแล้วเฉลย (PAS)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  พูดถึงปัญหาที่เจ็บปวด → บอกความน่ารำคาญ → เปิดตัวสินค้าแก้ได้ทันที
                </p>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="font-bold text-slate-100">⚡ สูตร 2: ป้ายยาแบบอยากรู้อยากเห็น (Curiosity)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  "ของดีที่คนกำลังแย่งกันสั่ง" หรือ "ไอเทมลับเด็กหอที่ไม่มีใครบอก"
                </p>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="font-bold text-slate-100">🎯 สูตร 3: รีวิวเรียลๆ ไม่อวย (Honest Review)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  บอกข้อดี-ข้อสังเกตตรงๆ สร้างความน่าเชื่อถือ ลูกค้าตัดสินใจซื้อง่ายขึ้น 3 เท่า!
                </p>
              </div>
            </div>
          </div>

          {/* 3. Golden Posting Hours */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-sm text-cyan-300 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>3. ช่วงเวลาทองในการโพสต์คลิป (Prime Time TH)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block">07:00 - 08:30</span>
                <span className="text-[10px] text-slate-400">ช่วงเดินทางไปทำงาน</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-emerald-500/30">
                <span className="font-bold text-emerald-300 block">11:30 - 13:30 ⭐</span>
                <span className="text-[10px] text-slate-400">พักเที่ยง (ยอดสั่งซื้อสูง)</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block">17:30 - 19:00</span>
                <span className="text-[10px] text-slate-400">เลิกงานกลับบ้าน</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg border border-rose-500/30">
                <span className="font-bold text-rose-300 block">20:00 - 23:00 🔥</span>
                <span className="text-[10px] text-slate-400">ยอดวิวมหาศาล นอนไถฟีด</span>
              </div>
            </div>
          </div>

          {/* 4. Tips to avoid Shadowban */}
          <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/20 space-y-2">
            <h4 className="font-bold text-sm text-rose-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>4. ข้อควรระวังไม่ให้โดนปิดกั้นการมองเห็น (Shadowban)</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              <li>ห้ามเคลมเกินจริง เช่น "หายขาด 100% ใน 1 วัน", "ขาวทันที"</li>
              <li>หลีกเลี่ยงการใช้คำว่า "ซื้อเลย", "โอนเงิน", "แอดไลน์" บ่อยเกินไปในเสียงพากย์</li>
              <li>ให้ใช้คำกระตุ้นสไตล์ "กดตะกร้าสีเหลืองซ้ายล่าง" หรือ "พิกัดที่หน้าโปรไฟล์" แทน</li>
              <li>ใส่แฮชแท็ก 3-6 แท็กที่ตรงกับหมวดหมู่สินค้า อย่าใส่สแปมแท็กมั่ว</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            เข้าใจแล้ว & เริ่มสร้างคลิป
          </button>
        </div>
      </div>
    </div>
  );
};
