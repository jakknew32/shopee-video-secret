# 🎬 Affilimate AI Video Studio - Free AI Video Generation Guide

## ภาพรวม
เว็บไซต์นี้ช่วยสร้างวิดีโอสำหรับโพสต์นายหน้า TikTok, Shopee Video, Instagram Reels, และ YouTube Shorts โดยใช้ **AI ฟรี 100%** ไม่ต้องจ่ายเงินใดๆ

---

## 🤖 AI ฟรีที่ใช้งานได้

### 1. Hugging Face Inference API (ฟรีไม่จำกัด)
- **Text-to-Image**: SDXL Turbo, Flux Schnell, Playground v2.5
- **Text-to-Video**: ModelScope DAMO, ZeroScope V2
- **Image-to-Video**: Stable Video Diffusion
- **LLM**: Llama 3, Mistral, Zephyr (สำหรับเขียนสคริปต์)
- **ขอ API Key ฟรี**: https://huggingface.co/settings/tokens

### 2. Replicate (เครดิตฟรี $10/เดือน)
- **Text-to-Image**: SDXL, Flux, Playground
- **Image-to-Video**: Stable Video Diffusion XT, AnimateDiff
- **Text-to-Video**: ZeroScope, ModelScope
- **ขอ API Key ฟรี**: https://replicate.com/account/api-tokens

### 3. โมเดลในเครื่อง (Transformers.js / ONNX)
- ใช้งานได้ออฟไลน์ 100%
- ไม่ต้องอินเทอร์เน็ต
- ช้ากว่า API แต่เป็นส่วนตัวที่สุด

---

## 🎯 แนวทางที่แนะนำ (Best Practice)

### วิธีที่ 1: Text-to-Image + Canvas Composer ⭐ **แนะนำมากที่สุด**
```
1. AI สร้างรูปภาพแต่ละฉาก (5 ฉาก) ← คุณภาพสูง 576x1024
2. Canvas Renderer ประกอบรูป + ซับไตเติล + สติกเกอร์ + Ken Burns
3. MediaRecorder บันทึกเป็นวิดีโอ WebM/MP4
```
**ข้อดี**: คุณภาพสูง ควบคุมได้ทุกอย่าง มีเอฟเฟกต์ TikTok ครบครัน ฟรีจริง

### วิธีที่ 2: Image-to-Video (SVD) + Canvas
```
1. AI สร้างรูปภาพฉากแรก
2. SVD ทำให้รูปเคลื่อนไหวเป็นวิดีโอสั้น 4 วินาที
3. รวมวิดีโอแต่ละฉากเข้าด้วยกัน
```
**ข้อดี**: การเคลื่อนไหวธรรมชาติมากขึ้น
**ข้อเสีย**: ความละเอียดต่ำกว่า วิดีโอสั้น (4 วินาที/ฉาก)

### วิธีที่ 3: Text-to-Video ตรงๆ
```
1. ใส่ prompt ได้วิดีโอทันที
```
**ข้อเสีย**: ความละเอียดต่ำมาก (320x240) ไม่เหมาะกับ TikTok/Reels

---

## 🛠️ การตั้งค่า

### 1. Hugging Face API Key (แนะนำ)
```
1. ไปที่ https://huggingface.co/settings/tokens
2. กด "New token" → ชื่อว่า "affilimate-video" → Role: "Read" → Generate
3. คัดลอก token (ขึ้นต้นด้วย hf_)
4. วางในช่อง "Hugging Face API Key" ในแท็บ Free AI
```

### 2. Replicate API Key (สำรอง/เพิ่มเติม)
```
1. ไปที่ https://replicate.com/account/api-tokens
2. กด "Create token" → คัดลอก token (ขึ้นต้นด้วย r8_)
3. วางในช่อง "Replicate API Key" ในแท็บ Free AI
```

---

## 📋 ขั้นตอนการสร้างวิดีโอ

### ขั้นตอนที่ 1: ใส่ข้อมูลสินค้า
- ชื่อสินค้า
- หมวดหมู่
- จุดเด่น/คุณสมบัติ
- ราคาโปรโมชั่น / ราคาเต็ม
- เลือกแพลตฟอร์ม (TikTok / Shopee / Reels)

### ขั้นตอนที่ 2: เลือกสไตล์วิดีโอ
- **สูตรโครงสร้าง**: Before/After, Pros/Cons, Hidden Gem, Flash Sale, Unboxing
- **Persona**: แม่ค้าไลฟ์สด, บิวตี้บล็อกเกอร์, เพื่อนสนิท, แม่บ้านคำนวณ
- **โทนเสียง**: เร้าใจ, เรียล, ตลก, หรูหรา, เร่งด่วน

### ขั้นตอนที่ 3: สร้างสคริปต์และรูปภาพ
1. กด **"🚀 สร้างสคริปต์ด้วย AI"** (ใช้ Smart Template ฟรี)
2. หรือใส่ API Key แล้วกด **"🤖 สร้างวิดีโอด้วย AI ฟรี"**
3. ระบบจะ:
   - เขียนสคริปต์ 5 ฉาก (Hook → Problem → Solution → Benefits → CTA)
   - สร้าง Prompt สำหรับรูปภาพแต่ละฉาก
   - เรียก AI สร้างรูปภาพ (ถ้ามี API Key)
   - นำรูปภาพไปใส่ใน Timeline อัตโนมัติ

### ขั้นตอนที่ 4: ปรับแต่งใน Timeline
- เล่นดูตัวอย่างแต่ละฉาก
- ปรับซับไตเติล สี ตำแหน่ง
- เพิ่ม/ลบ สติกเกอร์ (ตะกร้าเหลือง, Flash Sale, 5 ดาว, ส่งฟรี)
- ปรับ Ken Burns Effect (Zoom, Pan, Pulse)
- เลือกเสียงพากย์ (Web Speech API ฟรีใน Chrome)
- เลือกเพลงประกอบ (BGM Synthesizer ฟรี)

### ขั้นตอนที่ 5: Export วิดีโอ
1. กด **"Export Video"**
2. เลือกคุณภาพ (720x1280 HD)
3. รอเรนเดอร์ (ประมาณ 30-60 วินาที)
4. ดาวน์โหลดไฟล์ .webm หรือ .mp4

---

## 🎨 ฟีเจอร์พิเศษสำหรับ Affiliate

### Shopee Auto-Extractor
- วางลิงก์ Shopee → ดึงรูปภาพ ราคา รีวิว ยอดขาย อัตโนมัติ
- มีสินค้าตัวอย่าง 5 ชิ้น (หูฟัง, หม้อทอด, เซรั่ม, แก้ว, ไมค์)

### TikTok/Shopee/Reels Formatting
- **9:16 Vertical** พอดีจอโทรศัพท์
- **Safe Zones** หลีกเลี่ยง UI ของแอป (ปุ่มไลค์, ตะกร้า, คำอธิบาย)
- **Stickers**: ตะกร้าเหลือง TikTok, ตะกร้าส้ม Shopee, Flash Sale, ส่งฟรี
- **Subtitle Styles**: TikTok Yellow, Karaoke Pop, Neon Glow, Bold Clean
- **CTA Buttons**: "กดตะกร้าสีเหลืองซ้ายล่าง", "พิกัด Shopee ในคอมเมนต์"

### Audio Features
- **Web Speech TTS**: เสียงพากย์ไทยใน Chrome ฟรี (ปรับสปีด 1.15x)
- **Sound Effects**: Woosh, Ding, Cash Register, Pop, Camera Snap
- **BGM Synthesizer**: เพลงประกอบ Auto-Ducking (เล็กเสียงเพลงตอนมีพากย์)

---

## 💡 เคล็ดลับการใช้งาน

### เพื่อผลลัพธ์ดีที่สุด:
1. **ใส่รายละเอียดสินค้าให้ชัดเจน** → AI เขียนสคริปต์แม่นยำขึ้น
2. **ใช้ Shopee Import** → ได้รูปภาพจริง รีวิวจริง ยอดขายจริง
3. **เลือก Template ให้ตรงสินค้า**:
   - เครื่องสำอาง/สกินแคร์ → Before & After
   - อิเล็กทรอนิกส์ → Pros & Cons / Hidden Gem
   - ของใช้บ้าน/ครัว → Sensory Unboxing
   - โปรโมชั่นลดราคา → Flash Sale
4. **ปรับ Negative Constraints** → กัน Shadowban (ห้ามคำว่า "ซื้อเลย", "보장" ฯลฯ)
5. **ใช้ Persona ให้ตรง Target Audience** → เพิ่ม Conversion

### ประหยัด API Calls:
- Hugging Face Inference API ฟรีไม่จำกัด (แต่มี rate limit)
- Replicate ให้ $10/เดือน ≈ 500-1000 รูปภาพ
- ใช้ Smart Template (Local AI) ก่อน ถ้าดีพอก็ไม่ต้องเรียก API

---

## 🔧 Troubleshooting

### รูปภาพไม่โหลด / Error CORS
- ใช้ `crossOrigin="anonymous"` ใน Image element
- บางโมเดล Hugging Face คืน blob URL ใช้งานได้ทันที
- ถ้า error ให้ fallback ไป Unsplash placeholder

### วิดีโอ Export ไม่ได้
- ต้องใช้ Chrome/Edge (รองรับ MediaRecorder + canvas.captureStream)
- ต้อง Allow "Autoplay" และ "Audio" ใน site settings
- หน่วยความจำต้องเพียงพอ (วิดีโอ 30 วินาที ≈ 10-20 MB RAM)

### เสียงพากย์ไม่มี / ไม่ใช่ภาษาไทย
- Chrome ต้องมี Thai voice ติดตั้ง (มาติดมากับ Windows/Mac)
- ไป chrome://settings/voices ตรวจสอบ
- ปรับ Rate = 1.15x Pitch = 1.0 สไตล์ TikTok

---

## 📊 เปรียบเทียบค่าใช้จ่าย

| วิธี | ค่าใช้จ่าย | คุณภาพ | ความเร็ว | ความยาก |
|-----|------------|---------|----------|----------|
| **Smart Template (Local)** | **ฟรี 100%** | ⭐⭐⭐⭐ | เร็วที่สุด | ง่ายที่สุด |
| **Hugging Face Text-to-Image** | **ฟรี 100%** | ⭐⭐⭐⭐⭐ | เร็ว | งาน |
| **Replicate Text-to-Image** | $10/เดือนฟรี | ⭐⭐⭐⭐⭐ | ปานกลาง | งาน |
| **Hugging Face Text-to-Video** | **ฟรี 100%** | ⭐⭐ | ช้า | งาน |
| **Replicate Image-to-Video** | $10/เดือนฟรี | ⭐⭐⭐⭐ | ช้า | ปานกลาง |
| **Runway Gen-3 / Sora** | จ่ายต่อวิดีโอ | ⭐⭐⭐⭐⭐ | เร็ว | ง่าย |
| **Kling / Luma Dream Machine** | จ่าย/เดือน | ⭐⭐⭐⭐⭐ | เร็ว | ง่าย |

---

## 🚀 เริ่มใช้งานเลย!

1. **ไม่ต้องติดตั้งอะไร** - เปิด `start.bat` หรือรัน `npm run dev`
2. **ลอง Smart Template ก่อน** - กดปุ่มสร้างสคริปต์ (ไม่ต้อง API Key)
3. **เพิ่ม API Key ต่อไป** - เมื่ออยากได้รูปภาพ AI คุณภาพสูง
4. **Export และโพสต์** - ดาวน์โหลดวิดีโอ โพสต์ TikTok/Shopee/Reels ได้ทันที

---

## 📞 สนับสนุน
- หากพบ Bug: แจ้งใน GitHub Issues
- ขอ Feature ใหม่: เปิด Discussion
- แชร์ผลงาน: Tag #AffilimateAIVideoStudio

**Happy Creating! 🎬✨**