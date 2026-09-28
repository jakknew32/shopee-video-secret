import { Scene, StickerOverlay, SubtitleStyle } from '../types';

interface RenderOptions {
  scene: Scene;
  sceneProgress: number; // 0 to 1
  totalProgress: number; // 0 to 1
  currentTime: number;
  totalTime: number;
  productName: string;
  imageElement?: HTMLImageElement | null;
}

export class CanvasRenderer {
  private particles: Array<{ x: number; y: number; size: number; speedY: number; opacity: number }> = [];

  constructor() {
    // Generate static particle seeds
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 6 + 2,
        speedY: Math.random() * 0.2 + 0.1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  public render(canvas: HTMLCanvasElement, opts: RenderOptions) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const { scene, sceneProgress, totalProgress, imageElement } = opts;

    // 1. Clear background
    ctx.clearRect(0, 0, w, h);

    // 2. Draw Background (Media or Gradient)
    this.drawBackground(ctx, w, h, scene, sceneProgress, imageElement);

    // 3. Draw Floating Particles & Light Effects
    this.drawParticles(ctx, w, h, sceneProgress);

    // 4. Draw Dark Vignette / Contrast Overlay for Text Legibility
    this.drawVignette(ctx, w, h);

    // 5. Draw Top Header / Product Badge (Safe Zone)
    this.drawTopBadge(ctx, w, h, opts.productName, scene.title);

    // 6. Draw Kinetic Subtitle & Typography
    this.drawSubtitles(ctx, w, h, scene, sceneProgress);

    // 7. Draw Affiliate Stickers & Badges
    this.drawStickers(ctx, w, h, scene.stickers, sceneProgress);

    // 8. Draw Video Progress Bar (TikTok Style)
    this.drawProgressBar(ctx, w, h, totalProgress);
  }

  private drawBackground(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    scene: Scene,
    progress: number,
    img?: HTMLImageElement | null
  ) {
    ctx.save();

    if (img && img.complete && img.naturalWidth > 0) {
      // Ken Burns Effect
      let scale = 1.0;
      let offsetX = 0;
      let offsetY = 0;

      if (scene.kenBurns === 'zoom-in') {
        scale = 1.0 + progress * 0.15;
      } else if (scene.kenBurns === 'zoom-out') {
        scale = 1.15 - progress * 0.15;
      } else if (scene.kenBurns === 'pan-up') {
        offsetY = (1 - progress) * (h * 0.05);
        scale = 1.08;
      } else if (scene.kenBurns === 'pan-down') {
        offsetY = -(progress * (h * 0.05));
        scale = 1.08;
      } else if (scene.kenBurns === 'pulse') {
        scale = 1.0 + Math.sin(progress * Math.PI * 4) * 0.04;
      }

      ctx.translate(w / 2, h / 2);
      ctx.scale(scale, scale);
      ctx.translate(-w / 2 + offsetX, -h / 2 + offsetY);

      // Draw image to cover 9:16
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;
      let drawW = w;
      let drawH = h;
      let dx = 0;
      let dy = 0;

      if (imgRatio > canvasRatio) {
        drawH = h;
        drawW = h * imgRatio;
        dx = (w - drawW) / 2;
      } else {
        drawW = w;
        drawH = w / imgRatio;
        dy = (h - drawH) / 2;
      }

      ctx.drawImage(img, dx, dy, drawW, drawH);
    } else {
      // Procedural Vibrant Dynamic Gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);

      if (scene.type === 'hook') {
        // Red / Hot Amber
        grad.addColorStop(0, '#7f1d1d');
        grad.addColorStop(0.5, '#450a0a');
        grad.addColorStop(1, '#020617');
      } else if (scene.type === 'problem') {
        // Moody Deep Purple / Indigo
        grad.addColorStop(0, '#3b0764');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#020617');
      } else if (scene.type === 'solution') {
        // Electric Cyan / Blue / Emerald
        grad.addColorStop(0, '#0e7490');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#020617');
      } else if (scene.type === 'benefits') {
        // Emerald / Teal / Gold
        grad.addColorStop(0, '#047857');
        grad.addColorStop(0.5, '#064e3b');
        grad.addColorStop(1, '#020617');
      } else {
        // CTA: TikTok Red / Gold
        grad.addColorStop(0, '#991b1b');
        grad.addColorStop(0.5, '#831843');
        grad.addColorStop(1, '#0f172a');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Animated glowing ambient light circle
      const circleGrad = ctx.createRadialGradient(
        w * (0.3 + Math.sin(progress * Math.PI) * 0.4),
        h * 0.4,
        50,
        w * 0.5,
        h * 0.4,
        w * 0.7
      );
      circleGrad.addColorStop(0, 'rgba(254, 44, 85, 0.25)');
      circleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = circleGrad;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) {
    ctx.save();
    this.particles.forEach((p, i) => {
      const curY = ((p.y - progress * p.speedY * 0.8 + 1) % 1) * h;
      const curX = ((p.x + Math.sin(progress * 4 + i) * 0.05 + 1) % 1) * w;

      ctx.beginPath();
      ctx.arc(curX, curY, p.size * (w / 720), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.4})`;
      ctx.fill();
    });
    ctx.restore();
  }

  private drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    // Top shadow for header
    const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.18);
    topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, w, h * 0.18);

    // Bottom shadow for subtitle and CTA
    const botGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
    botGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    botGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.75)');
    botGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, h * 0.45, w, h * 0.55);
    ctx.restore();
  }

  private drawTopBadge(ctx: CanvasRenderingContext2D, w: number, _h: number, productName: string, sceneTitle: string) {
    ctx.save();
    const scale = w / 720;
    const topY = 55 * scale;

    // Top Category Pill
    ctx.font = `600 ${18 * scale}px Kanit, Prompt, sans-serif`;
    const label = `⭐ รีวิวป้ายยา • ${productName.slice(0, 20)}`;
    const textWidth = ctx.measureText(label).width;
    const pillWidth = textWidth + 36 * scale;
    const pillHeight = 36 * scale;
    const pillX = (w - pillWidth) / 2;

    // Draw pill background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5 * scale;
    this.roundRect(ctx, pillX, topY, pillWidth, pillHeight, 18 * scale);
    ctx.fill();
    ctx.stroke();

    // Draw text
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, topY + pillHeight / 2);

    // Scene badge
    ctx.font = `500 ${14 * scale}px Prompt, sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(sceneTitle, w / 2, topY + pillHeight + 20 * scale);

    ctx.restore();
  }

  private drawSubtitles(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    scene: Scene,
    progress: number
  ) {
    ctx.save();
    const scale = w / 720;
    const text = scene.subtitleText || scene.voiceText;
    if (!text) {
      ctx.restore();
      return;
    }

    const style: SubtitleStyle = scene.subtitleStyle || 'tiktok-yellow';
    const highlight = scene.highlightWord || '';

    // Subtitle Position (Bottom third safe zone)
    const centerY = h * 0.62;
    const fontSize = Math.round(38 * scale);
    ctx.font = `800 ${fontSize}px Kanit, Prompt, sans-serif`;

    // Wrap lines (max 22 characters per line for short video readability)
    const lines = this.wrapText(text, 20);

    lines.forEach((line, lineIdx) => {
      const lineY = centerY + (lineIdx - (lines.length - 1) / 2) * (fontSize * 1.4);
      this.drawSubtitleLine(ctx, line, w / 2, lineY, fontSize, highlight, style, scale, progress);
    });

    ctx.restore();
  }

  private drawSubtitleLine(
    ctx: CanvasRenderingContext2D,
    line: string,
    x: number,
    y: number,
    fontSize: number,
    highlight: string,
    style: SubtitleStyle,
    scale: number,
    progress: number
  ) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const words = line.split(' ');
    const totalLineWidth = ctx.measureText(line).width;

    // Draw Background Pill if TikTok style
    if (style === 'tiktok-yellow') {
      const bgPadX = 22 * scale;
      const bgPadY = 10 * scale;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      this.roundRect(
        ctx,
        x - totalLineWidth / 2 - bgPadX,
        y - fontSize / 2 - bgPadY,
        totalLineWidth + bgPadX * 2,
        fontSize + bgPadY * 2,
        10 * scale
      );
      ctx.fill();
    }

    // Kinetic Pop scaling
    if (style === 'karaoke-pop') {
      const bounce = 1.0 + Math.sin(progress * Math.PI) * 0.08;
      ctx.translate(x, y);
      ctx.scale(bounce, bounce);
      ctx.translate(-x, -y);
    }

    // Check if line contains highlight word
    const isHighlight = highlight && line.includes(highlight);

    if (style === 'neon-glow') {
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 15 * scale;
    } else {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 8 * scale;
      ctx.shadowOffsetX = 2 * scale;
      ctx.shadowOffsetY = 2 * scale;
    }

    // Draw black stroke for crystal-clear readability
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6 * scale;
    ctx.strokeText(line, x, y);

    // Fill Color
    if (isHighlight) {
      // TikTok Viral Golden Yellow
      ctx.fillStyle = '#FFE600';
    } else {
      ctx.fillStyle = '#FFFFFF';
    }

    ctx.fillText(line, x, y);
  }

  private drawStickers(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    stickers: StickerOverlay[],
    progress: number
  ) {
    if (!stickers || stickers.length === 0) return;
    const scale = w / 720;

    stickers.forEach(stk => {
      ctx.save();
      const posX = (stk.x / 100) * w;
      const posY = (stk.y / 100) * h;
      const stkScale = (stk.scale || 1) * scale;

      ctx.translate(posX, posY);
      ctx.scale(stkScale, stkScale);

      if (stk.type === 'tiktok-basket') {
        this.drawTikTokBasketBadge(ctx, stk.label, progress);
      } else if (stk.type === 'shopee-orange-basket') {
        this.drawShopeeOrangeBasket(ctx, stk.label, progress);
      } else if (stk.type === 'shopee-voucher-50') {
        this.drawShopeeVoucherBadge(ctx, stk.label || '🏷️ โค้ดลด Shopee Video 50%', 50, progress);
      } else if (stk.type === 'shopee-voucher-30') {
        this.drawShopeeVoucherBadge(ctx, stk.label || '🏷️ โค้ดลด Shopee Video 30%', 30, progress);
      } else if (stk.type === 'discount-50') {
        this.drawDiscountBadge(ctx, stk.label, progress);
      } else if (stk.type === 'flash-sale') {
        this.drawFlashSaleBadge(ctx, stk.label, progress);
      } else if (stk.type === 'stars-rating') {
        this.drawStarRatingBadge(ctx, stk.label);
      } else if (stk.type === 'arrow-pointer') {
        this.drawArrowPointer(ctx, stk.label, progress);
      } else if (stk.type === 'free-shipping') {
        this.drawFreeShippingBadge(ctx, stk.label);
      } else {
        this.drawGenericBadge(ctx, stk.label);
      }

      ctx.restore();
    });
  }

  // Draw 3D TikTok Yellow Basket Badge with animated pulse
  private drawTikTokBasketBadge(ctx: CanvasRenderingContext2D, label: string, progress: number) {
    const bounce = Math.sin(progress * Math.PI * 6) * 6;
    ctx.translate(0, bounce);

    const width = 340;
    const height = 68;

    // Glowing shadow
    ctx.shadowColor = 'rgba(254, 214, 0, 0.6)';
    ctx.shadowBlur = 18;

    // Golden Yellow gradient
    const grad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
    grad.addColorStop(0, '#FFD700');
    grad.addColorStop(0.5, '#FFC700');
    grad.addColorStop(1, '#FFA500');

    ctx.fillStyle = grad;
    this.roundRect(ctx, -width / 2, -height / 2, width, height, 34);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Text & Icon
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';
    ctx.font = '800 24px Kanit, Prompt, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label || '🛒 กดตะกร้าสีเหลืองซ้ายล่าง', 0, 0);
  }

  // Draw 3D Shopee Orange Basket with animated bounce
  private drawShopeeOrangeBasket(ctx: CanvasRenderingContext2D, label: string, progress: number) {
    const bounce = Math.sin(progress * Math.PI * 6) * 6;
    ctx.translate(0, bounce);

    const width = 350;
    const height = 70;

    // Glowing Orange shadow
    ctx.shadowColor = 'rgba(238, 77, 45, 0.7)';
    ctx.shadowBlur = 20;

    // Shopee Orange Gradient
    const grad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
    grad.addColorStop(0, '#EE4D2D');
    grad.addColorStop(0.5, '#FF5722');
    grad.addColorStop(1, '#FF7043');

    ctx.fillStyle = grad;
    this.roundRect(ctx, -width / 2, -height / 2, width, height, 35);
    ctx.fill();

    // White Crisp Border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Text & Icon
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 23px Kanit, Prompt, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label || '🧡 กดตะกร้าส้มซ้ายล่าง Shopee', 0, 0);
  }

  // Draw Shopee Video Discount Voucher Badge (30% / 50%)
  private drawShopeeVoucherBadge(ctx: CanvasRenderingContext2D, label: string, discountPct: number, progress: number) {
    const pulse = 1.0 + Math.sin(progress * Math.PI * 6) * 0.04;
    ctx.scale(pulse, pulse);

    const width = 330;
    const height = 54;

    ctx.shadowColor = 'rgba(238, 77, 45, 0.5)';
    ctx.shadowBlur = 12;

    // Shopee Red-Orange Gradient
    const grad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
    grad.addColorStop(0, '#D32F2F');
    grad.addColorStop(0.5, '#EE4D2D');
    grad.addColorStop(1, '#F57C00');

    ctx.fillStyle = grad;
    this.roundRect(ctx, -width / 2, -height / 2, width, height, 16);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 20px Kanit, Prompt, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label || `🏷️ โค้ดลด Shopee Video ${discountPct}%`, 0, 0);
  }

  private drawFlashSaleBadge(ctx: CanvasRenderingContext2D, label: string, progress: number) {
    const pulse = 1.0 + Math.sin(progress * Math.PI * 8) * 0.05;
    ctx.scale(pulse, pulse);

    const width = 240;
    const height = 50;

    const grad = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
    grad.addColorStop(0, '#FF0055');
    grad.addColorStop(1, '#FF5500');

    ctx.shadowColor = 'rgba(255, 0, 85, 0.6)';
    ctx.shadowBlur = 14;

    ctx.fillStyle = grad;
    this.roundRect(ctx, -width / 2, -height / 2, width, height, 25);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 20px Kanit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label || '⚡ FLASH SALE', 0, 0);
  }

  private drawDiscountBadge(ctx: CanvasRenderingContext2D, label: string, _progress: number) {
    const width = 200;
    const height = 48;

    ctx.fillStyle = '#E11D48';
    this.roundRect(ctx, -width / 2, -height / 2, width, height, 24);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 20px Kanit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label || '🔥 ลด 50%', 0, 0);
  }

  private drawStarRatingBadge(ctx: CanvasRenderingContext2D, label: string) {
    const width = 260;
    const height = 44;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.roundRect(ctx, -width / 2, -height / 2, width, height, 22);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFD700';
    ctx.font = '700 18px Kanit, Prompt, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label || '⭐⭐⭐⭐⭐ 4.9/5', 0, 0);
  }

  private drawArrowPointer(ctx: CanvasRenderingContext2D, label: string, progress: number) {
    const bounceX = Math.sin(progress * Math.PI * 4) * 8;
    ctx.translate(bounceX, 0);

    const width = 260;
    const height = 50;

    ctx.fillStyle = '#0284C7';
    this.roundRect(ctx, -width / 2, -height / 2, width, height, 25);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 20px Kanit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label || '👇 พิกัดจิ้มลิงก์', 0, 0);
  }

  private drawFreeShippingBadge(ctx: CanvasRenderingContext2D, label: string) {
    const width = 290;
    const height = 40;

    ctx.fillStyle = '#059669';
    this.roundRect(ctx, -width / 2, -height / 2, width, height, 20);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 16px Prompt, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label || '🚚 ส่งฟรี มีเก็บเงินปลายทาง', 0, 0);
  }

  private drawGenericBadge(ctx: CanvasRenderingContext2D, label: string) {
    const width = 220;
    const height = 44;

    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    this.roundRect(ctx, -width / 2, -height / 2, width, height, 22);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 18px Prompt, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 0);
  }

  private drawProgressBar(ctx: CanvasRenderingContext2D, w: number, h: number, totalProgress: number) {
    ctx.save();
    const barHeight = 6;
    const y = h - barHeight - 2;

    // Track Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, y, w, barHeight);

    // Active Bar (TikTok Red Gradient)
    const activeWidth = Math.max(0, Math.min(w, w * totalProgress));
    const grad = ctx.createLinearGradient(0, 0, activeWidth, 0);
    grad.addColorStop(0, '#FE2C55');
    grad.addColorStop(1, '#FF007F');

    ctx.fillStyle = grad;
    ctx.fillRect(0, y, activeWidth, barHeight);

    // Dot indicator at progress head
    ctx.beginPath();
    ctx.arc(activeWidth, y + barHeight / 2, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.restore();
  }

  private wrapText(text: string, maxCharsPerLine: number = 22): string[] {
    if (text.length <= maxCharsPerLine) return [text];

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        // If single word is longer than maxChars
        if (word.length > maxCharsPerLine) {
          lines.push(word.slice(0, maxCharsPerLine));
          currentLine = word.slice(maxCharsPerLine);
        } else {
          currentLine = word;
        }
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

export const canvasRenderer = new CanvasRenderer();
