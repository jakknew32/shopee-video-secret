import { AIEngine, ApiKeys, CustomPromptOptions, Platform, PromptTemplate, Scene, ScriptFormula, ShopeeProductData, TargetAudience, ToneStyle } from '../types';

export interface GenerateScriptParams {
  productName: string;
  productCategory: string;
  productFeatures: string;
  productPrice: string;
  originalPrice?: string;
  affiliatePlatform: Platform;
  targetAudience: TargetAudience;
  tone: ToneStyle;
  formula: ScriptFormula;
  engine: AIEngine;
  customNotes?: string;
  apiKeys: ApiKeys;
  shopeeData?: ShopeeProductData;
  customPromptOptions?: CustomPromptOptions;
}

export interface GeneratedScriptOutput {
  title: string;
  scenes: Scene[];
  caption: string;
  hashtags: string[];
  engineUsed: string;
  rawResponse?: string;
}

// Background gradient presets for scenes
export const GRADIENT_PRESETS = [
  'from-rose-900 via-purple-950 to-slate-950',
  'from-amber-900 via-orange-950 to-slate-950',
  'from-cyan-900 via-blue-950 to-slate-950',
  'from-emerald-900 via-teal-950 to-slate-950',
  'from-fuchsia-900 via-pink-950 to-slate-950',
  'from-indigo-900 via-slate-900 to-black',
];

// Preset Prompt Templates with rich customization options
export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'before-after',
    name: '🔄 เปรียบเทียบ ก่อนใช้ vs หลังใช้ (Before & After)',
    category: 'Conversion Booster',
    description: 'เห็นผลลัพธ์ชัดเจน ภาพความต่างก่อน-หลัง กระตุ้นการตัดสินใจทันที',
    icon: '🔄',
    promptInject: `เน้นการเปรียบเทียบสภาพก่อนใช้สินค้า (ปัญหาทรมานใจ) เทียบกับหลังใช้สินค้า (ชีวิตดีขึ้นแบบก้าวกระโดด) ให้เห็นภาพชัดเจน ดึงดูดอารมณ์ความอยากได้`
  },
  {
    id: 'honest-pros-cons',
    name: '⚖️ รีวิวเจาะลึก ข้อดี vs ข้อควรระวัง (High Trust Review)',
    category: 'Credibility',
    description: 'พูดตรงๆ มีข้อสังเกตเล็กน้อย สร้างความน่าเชื่อถือระดับ 100%',
    icon: '⚖️',
    promptInject: `พูดถึงข้อดีหลัก 3 ข้อ และข้อสังเกตเล็กน้อยที่ไม่ใช่จุดตาย (เช่น ของหมดไวมาก หรือต้องแย่งกดโค้ด) เพื่อสร้างความเรียลและความน่าเชื่อถือสูงสุด`
  },
  {
    id: 'secret-gem',
    name: '💎 ไอเทมลับที่คนส่วนใหญ่ยังไม่รู้ (Hidden Gem)',
    category: 'Viral Curiosity',
    description: 'ปลุกกระแสความอยากรู้อยากเห็น "ของดีนอกกระแสที่ต้องแย่งกันสั่ง"',
    icon: '💎',
    promptInject: `ใช้โทนเพื่อนกระซิบเพื่อน แอบบอกของดีที่คนทั่วไปยังไม่รู้ แต่คนที่ซื้อไปแล้วทุกคนพูดเป็นเสียงเดียวกันว่าคุ้มสุดๆ`
  },
  {
    id: 'payday-flash',
    name: '🔥 มหกรรม Flash Sale / Payday ด่วนลดกระหน่ำ',
    category: 'Urgency & FOMO',
    description: 'เร่งรีบ มีโค้ดลดจำนวนจำกัด ให้รีบกดตะกร้าก่อนของหมด',
    icon: '🔥',
    promptInject: `สร้างบรรยากาศความเร่งด่วนขั้นสุด ย้ำเรื่องโปรโมชั่นจำกัดเวลา โค้ดส่งฟรี และสต็อกของที่มีจำกัด กระตุ้นให้กดสั่งทันที`
  },
  {
    id: 'asmr-unboxing',
    name: '📦 เปิดกล่องแกะสัมผัสพรีเมียม (Sensory Unboxing)',
    category: 'Product Focus',
    description: 'เน้นความรู้สึกสัมผัส ดีไซน์หรูหรา แกะกล่องสดๆ รวดเร็ว',
    icon: '📦',
    promptInject: `เน้นบรรยายสัมผัส ความประทับใจแรกตอนแกะกล่อง ความพรีเมียมของวัสดุ และความคุ้มค่าเกินราคาเมื่อได้จับตัวจริง`
  }
];

// Fallback high-conversion smart generation
export function generateSmartAffiliateScript(params: GenerateScriptParams): GeneratedScriptOutput {
  const {
    productName,
    productFeatures,
    productPrice,
    originalPrice,
    affiliatePlatform,
    formula,
    shopeeData,
    customPromptOptions
  } = params;

  const priceFormatted = productPrice ? `${productPrice} บาท` : 'หลักร้อย';
  const origPriceFormatted = originalPrice ? `${originalPrice} บาท` : 'ราคาปกติหลักพัน';

  // Hook variation based on formula & tone & template
  let hookVoice = '';
  let hookSub = '';
  let hookHighlight = '';

  if (formula === 'viral-curiosity') {
    hookVoice = `ถ้าคุณยังไม่เคยลอง ${productName} บอกเลยว่าคุณกำลังพลาดมาก! รู้งี้ซื้อตั้งนานแล้ว`;
    hookSub = `พลาดมากถ้ายังไม่ลอง! ${productName}`;
    hookHighlight = 'พลาดมาก';
  } else if (formula === 'honest-review') {
    hookVoice = `ขอพูดตรงๆ ไม่อวย! ใช้ ${productName} มาครบ 1 อาทิตย์ เป็นยังไงมาฟังเลย`;
    hookSub = `พูดตรงๆ ไม่อวย! รีวิว ${productName}`;
    hookHighlight = 'ไม่อวย';
  } else if (formula === 'unboxing-fast') {
    hookVoice = `แกะกล่องของดีที่คนกำลังแย่งกันสั่งตอนนี้ ${productName} มาส่งแล้วจ้า!`;
    hookSub = `เปิดกล่องด่วน! ของฮิตกำลังมา`;
    hookHighlight = 'เปิดกล่องด่วน';
  } else if (formula === 'before-after') {
    hookVoice = `ดูความต่างชัดๆ ก่อนและหลังใช้ ${productName} เปลี่ยนชีวิตได้ขนาดนี้เลยเหรอ!`;
    hookSub = `เทียบชัดๆ ก่อน vs หลังใช้ 😱`;
    hookHighlight = 'เทียบชัดๆ';
  } else if (formula === 'pros-cons') {
    hookVoice = `สรุปข้อดีข้อเสียของ ${productName} แบบไม่อวย มีจุดไหนต้องระวังบ้างมาดู!`;
    hookSub = `ข้อดี vs ข้อเสีย ${productName}`;
    hookHighlight = 'ข้อดีข้อเสีย';
  } else {
    // PAS default
    hookVoice = `หยุดก่อน! ใครที่มีปัญหาเรื่องนี้อยู่ วันนี้เจอตัวจบแล้ว ${productName}!`;
    hookSub = `หยุดก่อน! เจอตัวจบแล้ว ✨`;
    hookHighlight = 'เจอตัวจบแล้ว';
  }

  // If custom instructions exist, customize phrasing
  if (customPromptOptions?.customInstructions) {
    if (customPromptOptions.customInstructions.includes('วัยรุ่น')) {
      hookVoice = `แกรรรร! ใครยังไม่มี ${productName} บอกเลยว่าเอ้าท์มากกกก ตัวนี้คือเดอะเบสต์!`;
      hookSub = `ตัวนี้คือเดอะเบสต์! ${productName} 🔥`;
      hookHighlight = 'เดอะเบสต์';
    }
  }

  // Problem scene
  const problemVoice = `เคยเบื่อไหมกับปัญหาเดิมๆ เสียเงินไปตั้งเยอะแต่ไม่ได้ดั่งใจ จนมาเจอเจ้าตัวนี้`;
  const problemSub = `เคยเจอปัญหานี้ไหม? เสียเงินฟรีซ้ำๆ 😭`;

  // Solution scene
  const solutionVoice = `${productName} ตัวนี้ตอบโจทย์มาก จุดเด่นคือ ${productFeatures || 'ใช้งานง่าย คุณภาพพรีเมียม เห็นผลชัดเจน'}`;
  const solutionSub = `จุดเด่น: ${productFeatures ? productFeatures.split('\n')[0].slice(0, 30) : 'คุณภาพเกินราคา ใช้งานง่ายมาก'}`;

  // Benefit / Demo scene with Shopee rating proof
  const ratingText = shopeeData?.rating ? `การันตีรีวิว ${shopeeData.rating} ดาว ยอดขาย ${shopeeData.soldCount || 'หมื่นชิ้น'}` : 'ยอดขายและรีวิวการันตีคนซื้อซ้ำเพียบ';
  const benefitVoice = `เทียบกับของทั่วไปในตลาด ตัวนี้คุ้มค่าสุดๆ ${ratingText}!`;
  const benefitSub = shopeeData?.rating ? `⭐ รีวิว ${shopeeData.rating}/5 ขายแล้ว ${shopeeData.soldCount || '10,000+'} ชิ้น` : `รีวิว 5 ดาวแน่นๆ ลูกค้าซื้อซ้ำเพียบ ⭐⭐⭐⭐⭐`;

  // Call to Action
  let ctaVoice = '';
  let ctaSub = '';

  if (affiliatePlatform === 'tiktok') {
    ctaVoice = `ตอนนี้มีโปรเหลือแค่ ${priceFormatted} จาก ${origPriceFormatted} รีบกดตะกร้าสีเหลืองซ้ายล่างก่อนของหมดนะคะ!`;
    ctaSub = `กดตะกร้าเหลืองซ้ายล่าง ด่วน! 🛒👇`;
  } else if (affiliatePlatform === 'shopee') {
    ctaVoice = `ตอนนี้ Shopee ลดเหลือแค่ ${priceFormatted} ส่งฟรีทั่วไทย พิกัดจิ้มลิงก์หน้าโปรไฟล์ หรือคอมเมนต์แรกเลยจ้า!`;
    ctaSub = `พิกัด Shopee ในคอมเมนต์ / หน้าโปรไฟล์ 🧡👇`;
  } else if (affiliatePlatform === 'lazada') {
    ctaVoice = `แจกคูปองลดพิเศษเหลือแค่ ${priceFormatted} ส่งฟรีทั่วไทย จิ้มลิงก์ตรงไบโอได้เลย!`;
    ctaSub = `แจกโค้ดส่งฟรี จิ้มลิงก์ที่ Bio 💙👇`;
  } else {
    ctaVoice = `โปรจำกัดเวลาเพียง ${priceFormatted} สนใจจิ้มลิงก์ตรงแคปชั่นหรือคอมเมนต์ด่วนเลยค่ะ!`;
    ctaSub = `พิกัดลิงก์ในคอมเมนต์ / โปรไฟล์ ⚡👇`;
  }

  // Preload Shopee Images across scenes if available
  const imgList = shopeeData?.images && shopeeData.images.length > 0 ? shopeeData.images : [];

  const scenes: Scene[] = [
    {
      id: 'scene-1',
      type: 'hook',
      title: 'Scene 1: หยุดดู (Hook 0-3s)',
      voiceText: hookVoice,
      subtitleText: hookSub,
      highlightWord: hookHighlight,
      duration: 3.5,
      mediaType: imgList[0] ? 'image' : 'gradient',
      mediaUrl: imgList[0] || undefined,
      gradientTheme: GRADIENT_PRESETS[0],
      aiImagePrompt: `Extreme close-up commercial product shot of ${productName}, glowing studio lighting, cinematic hyper-realistic 8k, viral tiktok aesthetic vertical 9:16`,
      kenBurns: 'zoom-in',
      subtitleStyle: 'tiktok-yellow',
      soundEffect: 'woosh',
      stickers: [
        {
          id: 'stk-1',
          type: 'flash-sale',
          label: '🔥 HOT ITEM',
          x: 50,
          y: 18,
          scale: 1,
        }
      ]
    },
    {
      id: 'scene-2',
      type: 'problem',
      title: 'Scene 2: ขยี้ปัญหา (Pain Point 3-7s)',
      voiceText: problemVoice,
      subtitleText: problemSub,
      highlightWord: 'เสียเงินฟรี',
      duration: 4.0,
      mediaType: imgList[1] ? 'image' : 'gradient',
      mediaUrl: imgList[1] || undefined,
      gradientTheme: GRADIENT_PRESETS[1],
      aiImagePrompt: `Frustrated modern lifestyle situation showing the problem that ${productName} solves, moody cinematic vertical 9:16`,
      kenBurns: 'pan-up',
      subtitleStyle: 'tiktok-yellow',
      soundEffect: 'pop',
      stickers: []
    },
    {
      id: 'scene-3',
      type: 'solution',
      title: 'Scene 3: เฉลยตัวช่วย (Product Reveal 7-14s)',
      voiceText: solutionVoice,
      subtitleText: solutionSub,
      highlightWord: productName.slice(0, 15),
      duration: 7.0,
      mediaType: imgList[2] ? 'image' : 'gradient',
      mediaUrl: imgList[2] || undefined,
      gradientTheme: GRADIENT_PRESETS[2],
      aiImagePrompt: `Unboxing and showcasing ${productName} on a luxury aesthetic desk, crisp product details, dynamic lighting 9:16`,
      kenBurns: 'zoom-out',
      subtitleStyle: 'tiktok-yellow',
      soundEffect: 'camera',
      stickers: [
        {
          id: 'stk-2',
          type: 'discount-50',
          label: `ลดเหลือ ${priceFormatted}`,
          x: 75,
          y: 22,
          scale: 1,
        }
      ]
    },
    {
      id: 'scene-4',
      type: 'benefits',
      title: 'Scene 4: รีวิวความคุ้มค่า (Social Proof 14-21s)',
      voiceText: benefitVoice,
      subtitleText: benefitSub,
      highlightWord: shopeeData?.rating ? `${shopeeData.rating} ดาว` : '5 ดาวแน่นๆ',
      duration: 6.5,
      mediaType: imgList[3] ? 'image' : 'gradient',
      mediaUrl: imgList[3] || undefined,
      gradientTheme: GRADIENT_PRESETS[3],
      aiImagePrompt: `Satisfied user using ${productName}, glowing smile, vibrant high quality vertical shot 9:16`,
      kenBurns: 'zoom-in',
      subtitleStyle: 'tiktok-yellow',
      soundEffect: 'ding',
      stickers: [
        {
          id: 'stk-3',
          type: 'stars-rating',
          label: shopeeData?.rating ? `⭐⭐⭐⭐⭐ ${shopeeData.rating}/5 (${shopeeData.soldCount || 'ขายดี'})` : '⭐⭐⭐⭐⭐ 4.9/5',
          x: 50,
          y: 25,
          scale: 1.1,
        }
      ]
    },
    {
      id: 'scene-5',
      type: 'cta',
      title: 'Scene 5: ชี้เป้าสั่งซื้อ (Call to Action 21-27s)',
      voiceText: ctaVoice,
      subtitleText: ctaSub,
      highlightWord: affiliatePlatform === 'tiktok' ? 'กดตะกร้าเหลือง' : (affiliatePlatform === 'shopee' ? 'พิกัด Shopee' : 'พิกัดลิงก์'),
      duration: 6.0,
      mediaType: imgList[4] || imgList[0] ? 'image' : 'gradient',
      mediaUrl: imgList[4] || imgList[0] || undefined,
      gradientTheme: GRADIENT_PRESETS[4],
      aiImagePrompt: `Call to action graphic background with vibrant energetic colors, sales promotion mood vertical 9:16`,
      kenBurns: 'pulse',
      subtitleStyle: 'tiktok-yellow',
      soundEffect: 'cash',
      stickers: [
        {
          id: 'stk-4',
          type: affiliatePlatform === 'tiktok' ? 'tiktok-basket' : (affiliatePlatform === 'shopee' ? 'shopee-deal' : 'arrow-pointer'),
          label: affiliatePlatform === 'tiktok' ? '🛒 กดตะกร้าสีเหลือง' : (affiliatePlatform === 'shopee' ? '🧡 พิกัด Shopee ในคอมเมนต์' : '👉 จิ้มลิงก์หน้าโปรไฟล์'),
          x: 50,
          y: 78,
          scale: 1.25,
        },
        {
          id: 'stk-5',
          type: 'free-shipping',
          label: '🚚 ส่งฟรี มีเก็บเงินปลายทาง',
          x: 50,
          y: 88,
          scale: 0.95,
        }
      ]
    }
  ];

  // Hashtags. Thai text has no spaces, so slicing on length cuts mid-word and
  // produces a broken tag - use the first meaningful word/segment instead.
  const nameForTag = productName.split(/[\s,|]+/).find(w => w.length >= 3) || productName;
  const baseTags = [
    `#${nameForTag.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 15)}`,
    '#รีวิวของดี',
    '#ของดีบอกต่อ',
    '#ของมันต้องมี',
    '#ป้ายยา',
    '#tiktokป้ายยา'
  ];

  if (affiliatePlatform === 'tiktok') {
    baseTags.push('#นายหน้าtiktok', '#tiktokshopครีเอเตอร์', '#พิกัดในตะกร้า');
  } else if (affiliatePlatform === 'shopee') {
    baseTags.push('#ShopeeTH', '#ShopeeHaul', '#รีวิวช้อปปี้', '#พิกัดShopee');
  } else if (affiliatePlatform === 'lazada') {
    baseTags.push('#lazadath', '#รีวิวลาซาด้า', '#พิกัดในไบโอ');
  }

  const caption = `🔥 รู้งี้ซื้อนานแล้ว! ${productName} ตัวช่วยที่ตอบโจทย์มากกกก\n⚡ จากปกติ ${origPriceFormatted} เหลือแค่ ${priceFormatted}\n👇 ${ctaSub}\n\n${baseTags.join(' ')}`;

  return {
    title: `คลิปป้ายยา ${productName}`,
    scenes,
    caption,
    hashtags: baseTags,
    engineUsed: 'Smart Template AI (High-Conversion Optimizer)',
  };
}

// Google Gemini API Engine
async function callGeminiApi(apiKey: string, prompt: string, temperature: number = 0.7): Promise<string> {
  // Key goes in the `x-goog-api-key` header, not a `?key=` query param - query
  // strings end up in server access logs, browser history and Referer headers.
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: temperature || 0.7,
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Gemini Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response content from Gemini');
  return text;
}

// Grok (xAI API) Engine
async function callGrokApi(apiKey: string, prompt: string, temperature: number = 0.8): Promise<string> {
  const url = 'https://api.x.ai/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        {
          role: 'system',
          content: 'You are Grok, an expert viral TikTok & Reels scriptwriter for affiliate marketing. Respond strictly in valid JSON format only.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: temperature || 0.8
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Grok xAI Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No content returned from Grok');
  return text;
}

// Meta AI (Llama 3 via Groq API)
async function callMetaApi(apiKey: string, prompt: string, temperature: number = 0.7): Promise<string> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are Meta AI (Llama 3), world-class video scriptwriter for short-form viral affiliate video. Return ONLY valid JSON format.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: temperature || 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Meta AI / Groq Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No content returned from Meta AI');
  return text;
}

export async function generateAffiliateScript(params: GenerateScriptParams): Promise<GeneratedScriptOutput> {
  const { engine, apiKeys, customPromptOptions, shopeeData } = params;

  // Build specialized prompt injected with Custom Prompt Options & Shopee Insights
  let promptCustomInjection = '';
  if (customPromptOptions) {
    if (customPromptOptions.creatorPersona) {
      promptCustomInjection += `\n- สวมบทบาทครีเอเตอร์ (Persona): ${customPromptOptions.creatorPersona}`;
    }
    if (customPromptOptions.customInstructions) {
      promptCustomInjection += `\n- คำสั่งเฉพาะเพิ่มเติม: ${customPromptOptions.customInstructions}`;
    }
    if (customPromptOptions.negativeConstraints) {
      promptCustomInjection += `\n- สิ่งที่ห้ามมีในสคริปต์เด็ดขาด: ${customPromptOptions.negativeConstraints}`;
    }
    if (customPromptOptions.selectedTemplateId) {
      const tpl = PROMPT_TEMPLATES.find(t => t.id === customPromptOptions.selectedTemplateId);
      if (tpl) {
        promptCustomInjection += `\n- เทคนิคสไตล์พิเศษ (${tpl.name}): ${tpl.promptInject}`;
      }
    }
  }

  let shopeeDetailsInjection = '';
  if (shopeeData) {
    shopeeDetailsInjection = `
- ข้อมูลร้านค้าและรีวิวจาก Shopee:
  * คะแนนรีวิว: ${shopeeData.rating || '4.9'} / 5 (จำนวนรีวิว ${shopeeData.ratingCount || 'พัน'})
  * ยอดขายทั้งหมด: ${shopeeData.soldCount || 'หลายหมื่น'} ชิ้น
  * ชื่อร้าน: ${shopeeData.shopName || 'Shopee Official Store'}
  * ส่วนลด: ${shopeeData.discountPercentage || 'ลดพิเศษ'}`;
  }

  const systemPrompt = `
คุณเป็นยอดนักสร้างคอนเทนต์วิดีโอสั้น (TikTok, Instagram Reels, YouTube Shorts) เพื่อทำ Affiliate Marketing ระดับท็อป
จงสร้างบทสคริปต์วิดีโอ 9:16 ความยาวประมาณ 25-30 วินาที สำหรับสินค้า:
- ชื่อสินค้า: "${params.productName}"
- หมวดหมู่: "${params.productCategory}"
- คุณสมบัติ/จุดเด่น: "${params.productFeatures}"
- ราคาโปรโมชั่น: "${params.productPrice || 'ราคาพิเศษ'}" บาท (จากราคาเต็ม ${params.originalPrice || 'ปกติ'})
- แพลตฟอร์ม: "${params.affiliatePlatform}"
- กลุ่มเป้าหมาย: "${params.targetAudience}"
- โทนเสียง: "${params.tone}"
- สูตรโครงสร้าง: "${params.formula}"
${shopeeDetailsInjection}
${promptCustomInjection}

กรุณาตอบเป็น JSON รูปแบบนี้เท่านั้น:
{
  "title": "หัวข้อคลิปป้ายยา",
  "scenes": [
    {
      "id": "scene-1",
      "type": "hook",
      "title": "Scene 1: หยุดดู (Hook 0-3s)",
      "voiceText": "คำพูดพากย์เสียงสั้นๆ เร้าใจ",
      "subtitleText": "ข้อความบนจอสะดุดตา",
      "highlightWord": "คำที่จะไฮไลต์สีเหลือง",
      "duration": 3.5,
      "aiImagePrompt": "Prompt ภาษาอังกฤษสำหรับเจนรูปสินค้าในฉากนี้ เช่น Extreme close up shot of...",
      "soundEffect": "woosh"
    },
    {
      "id": "scene-2",
      "type": "problem",
      "title": "Scene 2: ขยี้ปัญหา (Pain Point 3-7s)",
      "voiceText": "...",
      "subtitleText": "...",
      "highlightWord": "...",
      "duration": 4.0,
      "aiImagePrompt": "...",
      "soundEffect": "pop"
    },
    {
      "id": "scene-3",
      "type": "solution",
      "title": "Scene 3: เฉลยตัวช่วย (Product Reveal 7-14s)",
      "voiceText": "...",
      "subtitleText": "...",
      "highlightWord": "...",
      "duration": 7.0,
      "aiImagePrompt": "...",
      "soundEffect": "camera"
    },
    {
      "id": "scene-4",
      "type": "benefits",
      "title": "Scene 4: รีวิวความคุ้มค่า (Social Proof 14-21s)",
      "voiceText": "...",
      "subtitleText": "...",
      "highlightWord": "...",
      "duration": 6.5,
      "aiImagePrompt": "...",
      "soundEffect": "ding"
    },
    {
      "id": "scene-5",
      "type": "cta",
      "title": "Scene 5: ชี้เป้าสั่งซื้อ (Call to Action 21-27s)",
      "voiceText": "...",
      "subtitleText": "...",
      "highlightWord": "...",
      "duration": 6.0,
      "aiImagePrompt": "...",
      "soundEffect": "cash"
    }
  ],
  "caption": "แคปชั่นโพสต์ TikTok พร้อมใส่อิโมจิและการกระตุ้นคลิกลิงก์",
  "hashtags": ["#นายหน้าtiktok", "#รีวิวของดี", "#ของมันต้องมี"]
}
`;

  try {
    let rawJson = '';
    let engineUsedName = '';
    const temp = customPromptOptions?.creativityLevel || 0.7;

    if (engine === 'gemini' && apiKeys.geminiApiKey) {
      engineUsedName = 'Google Gemini (1.5 Flash)';
      rawJson = await callGeminiApi(apiKeys.geminiApiKey, systemPrompt, temp);
    } else if (engine === 'grok' && apiKeys.grokApiKey) {
      engineUsedName = 'Grok (xAI Grok-Beta)';
      rawJson = await callGrokApi(apiKeys.grokApiKey, systemPrompt, temp);
    } else if (engine === 'meta' && apiKeys.metaApiKey) {
      engineUsedName = 'Meta AI (Llama 3.3 70B)';
      rawJson = await callMetaApi(apiKeys.metaApiKey, systemPrompt, temp);
    } else {
      // Offline fallback
      return generateSmartAffiliateScript(params);
    }

    // Clean JSON text (strip markdown ```json fences if any)
    const cleaned = rawJson
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    const imgList = shopeeData?.images && shopeeData.images.length > 0 ? shopeeData.images : [];

    // Hydrate default scene visual properties
    const scenes: Scene[] = (parsed.scenes || []).map((sc: any, index: number) => {
      const assignedImage = imgList[index] || (index === 4 ? imgList[0] : undefined);

      return {
        id: sc.id || `scene-${index + 1}`,
        type: sc.type || 'solution',
        title: sc.title || `Scene ${index + 1}`,
        voiceText: sc.voiceText || '',
        subtitleText: sc.subtitleText || sc.voiceText || '',
        highlightWord: sc.highlightWord || '',
        duration: Number(sc.duration) || 5,
        mediaType: assignedImage ? 'image' : 'gradient',
        mediaUrl: assignedImage || undefined,
        gradientTheme: GRADIENT_PRESETS[index % GRADIENT_PRESETS.length],
        aiImagePrompt: sc.aiImagePrompt || `Commercial vertical shot of ${params.productName}`,
        kenBurns: index % 2 === 0 ? 'zoom-in' : 'pan-up',
        subtitleStyle: 'tiktok-yellow',
        soundEffect: sc.soundEffect || 'ding',
        stickers: index === 4 ? [
          {
            id: `stk-${Date.now()}`,
            type: params.affiliatePlatform === 'tiktok' ? 'tiktok-basket' : (params.affiliatePlatform === 'shopee' ? 'shopee-deal' : 'arrow-pointer'),
            label: params.affiliatePlatform === 'tiktok' ? '🛒 กดตะกร้าสีเหลือง' : (params.affiliatePlatform === 'shopee' ? '🧡 พิกัด Shopee ในคอมเมนต์' : '👉 พิกัดลิงก์ที่ไบโอ'),
            x: 50,
            y: 80,
            scale: 1.2
          }
        ] : []
      };
    });

    return {
      title: parsed.title || `คลิปสั้น ${params.productName}`,
      scenes,
      caption: parsed.caption || '',
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['#รีวิวของดี', '#นายหน้าtiktok'],
      engineUsed: engineUsedName,
      rawResponse: rawJson
    };
  } catch (err: any) {
    console.warn('AI API Call failed, falling back to Smart Local Engine:', err);
    const fallback = generateSmartAffiliateScript(params);
    fallback.engineUsed = `Local Smart Engine (เนื่องจาก API ขัดข้อง: ${err.message || 'Error'})`;
    return fallback;
  }
}
