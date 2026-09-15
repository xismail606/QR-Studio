import { createQRInstance } from '../qr/adapter.js';
import { sanitizeLabel } from '../qr/validation.js';

function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not render QR for export.'));
    };
    img.src = url;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function getContrastColor(hex) {
  if (!hex || hex === 'transparent') return '#ffffff';
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? '#0f172a' : '#ffffff';
}

function getDefaultFrameText(type) {
  switch (type) {
    case 'chef-hat': return 'VIEW MENU';
    case 'coffee-cup': return 'ORDER COFFEE';
    case 'delivery-scooter': return 'TRACK ORDER';
    case 'gift-box': return 'CLAIM GIFT';
    case 'shopping-bag': return 'SHOP NOW';
    case 'coffee-takeout': return 'SCAN TO ORDER';
    case 'arrow-cursive':
    case 'cursive': return 'Scan me';
    default: return 'SCAN ME';
  }
}

function requiresCompositeFrame(config) {
  return config.frame.type !== 'none' || (config.text.enabled && (config.text.top || config.text.bottom));
}

async function compositeWithFrame(config, qrBlob, size) {
  try {
    await document.fonts?.ready;
  } catch {
    /* fallback if document.fonts is not supported */
  }

  const qrImg = await loadImage(qrBlob);
  const type = config.frame.type;
  const hasFrame = type !== 'none';
  const frameColor = config.frame.color || '#111827';
  const frameBg = config.frame.background || '#ffffff';
  const contrastText = getContrastColor(frameColor);

  const topText = config.text.enabled && config.text.top ? sanitizeLabel(config.text.top) : '';
  const frameText = config.frame.text ? sanitizeLabel(config.frame.text) : getDefaultFrameText(type);
  const bottomText =
    config.text.enabled && config.text.bottom ? sanitizeLabel(config.text.bottom) : frameText;

  const pad = hasFrame ? Math.round((size * (config.frame.padding || 16)) / 300) : 0;
  const scale = size / 320;

  // Compute top decoration height
  let topH = topText ? Math.round(size * 0.08) : 0;
  if (hasFrame) {
    if (type === 'chef-hat') topH = Math.max(topH, Math.round(44 * scale));
    else if (type === 'coffee-cup') topH = Math.max(topH, Math.round(32 * scale));
    else if (type === 'gift-box') topH = Math.max(topH, Math.round(36 * scale));
    else if (type === 'shopping-bag') topH = Math.max(topH, Math.round(32 * scale));
    else if (type === 'phone') topH = Math.max(topH, Math.round(20 * scale));
    else if (type === 'coffee-takeout') topH = Math.max(topH, Math.round(18 * scale));
  }

  // Compute bottom decoration height
  let bottomH = Math.round(size * 0.08);
  if (hasFrame) {
    if (type === 'delivery-scooter') bottomH = Math.round(62 * scale);
    else if (type === 'arrow-cursive' || type === 'cursive') bottomH = Math.round(44 * scale);
    else if (type !== 'simple') bottomH = Math.round(42 * scale);
  }

  const W = size + pad * 2;
  const H = size + pad * 2 + topH + bottomH;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Export failed: canvas unavailable.');

  const hasBorder = hasFrame && type !== 'arrow-cursive' && type !== 'cursive' && type !== 'none';
  const effectiveBorderWidth = hasBorder ? Math.max(config.frame.borderWidth || 0, 2) * scale : 0;

  // Card background
  ctx.fillStyle = hasFrame ? frameBg : config.colors.background === 'transparent' ? '#ffffff' : config.colors.background;
  if (hasFrame && config.frame.radius > 0) {
    roundRect(ctx, 0, 0, W, H, (config.frame.radius || 20) * scale);
    ctx.fill();
    if (effectiveBorderWidth > 0) {
      ctx.lineWidth = effectiveBorderWidth;
      ctx.strokeStyle = frameColor;
      roundRect(ctx, effectiveBorderWidth / 2, effectiveBorderWidth / 2, W - effectiveBorderWidth, H - effectiveBorderWidth, Math.max(0, (config.frame.radius - 1) * scale));
      ctx.stroke();
    }
  } else {
    ctx.fillRect(0, 0, W, H);
    if (effectiveBorderWidth > 0) {
      ctx.lineWidth = effectiveBorderWidth;
      ctx.strokeStyle = frameColor;
      ctx.strokeRect(effectiveBorderWidth / 2, effectiveBorderWidth / 2, W - effectiveBorderWidth, H - effectiveBorderWidth);
    }
  }

  // Energy Burst rays around borders
  if (hasFrame && type === 'energy-burst') {
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 2.5 * scale;
    ctx.lineCap = 'round';
    for (const [x1, y1, x2, y2] of [
      [14, 14, 28, 28],
      [6, 34, 24, 42],
      [34, 6, 42, 24],
      [W / scale - 14, 14, W / scale - 28, 28],
      [W / scale - 6, 34, W / scale - 24, 42],
      [W / scale - 34, 6, W / scale - 42, 24],
      [14, H / scale - 14, 28, H / scale - 28],
      [6, H / scale - 34, 24, H / scale - 42],
      [W / scale - 14, H / scale - 14, W / scale - 28, H / scale - 28],
      [W / scale - 6, H / scale - 34, W / scale - 24, H / scale - 42],
    ]) {
      ctx.beginPath();
      ctx.moveTo(x1 * scale, y1 * scale);
      ctx.lineTo(x2 * scale, y2 * scale);
      ctx.stroke();
    }
  }

  // Top Decorations
  if (hasFrame && type === 'chef-hat') {
    const cx = W / 2;
    const ty = pad + 6 * scale;
    ctx.fillStyle = frameBg;
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 2.5 * scale;
    // Central toque folds
    ctx.beginPath();
    ctx.arc(cx - 24 * scale, ty + 12 * scale, 14 * scale, 0, Math.PI * 2);
    ctx.arc(cx, ty + 6 * scale, 18 * scale, 0, Math.PI * 2);
    ctx.arc(cx + 24 * scale, ty + 12 * scale, 14 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Hat band
    roundRect(ctx, cx - 28 * scale, ty + 18 * scale, 56 * scale, 8 * scale, 2 * scale);
    ctx.fill();
    ctx.stroke();
    // Pleats
    ctx.beginPath();
    ctx.moveTo(cx - 12 * scale, ty + 20 * scale); ctx.lineTo(cx - 12 * scale, ty + 24 * scale);
    ctx.moveTo(cx, ty + 20 * scale); ctx.lineTo(cx, ty + 24 * scale);
    ctx.moveTo(cx + 12 * scale, ty + 20 * scale); ctx.lineTo(cx + 12 * scale, ty + 24 * scale);
    ctx.stroke();
  } else if (hasFrame && type === 'coffee-cup') {
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 2.5 * scale;
    ctx.lineCap = 'round';
    const cx = W / 2;
    const ty = pad + 4 * scale;
    for (const offset of [-14 * scale, 0, 14 * scale]) {
      ctx.beginPath();
      ctx.moveTo(cx + offset, ty + 20 * scale);
      ctx.bezierCurveTo(cx + offset - 4 * scale, ty + 14 * scale, cx + offset + 4 * scale, ty + 8 * scale, cx + offset, ty);
      ctx.stroke();
    }
    // Mug handle on the right
    ctx.beginPath();
    ctx.lineWidth = 5 * scale;
    ctx.arc(W - pad + 6 * scale, pad + topH + size / 2, 16 * scale, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  } else if (hasFrame && type === 'gift-box') {
    ctx.fillStyle = frameColor;
    ctx.strokeStyle = frameBg;
    ctx.lineWidth = 2 * scale;
    const cx = W / 2;
    const ty = pad + 16 * scale;
    // Bow loops
    ctx.beginPath();
    ctx.ellipse(cx - 16 * scale, ty, 14 * scale, 8 * scale, -Math.PI / 6, 0, Math.PI * 2);
    ctx.ellipse(cx + 16 * scale, ty, 14 * scale, 8 * scale, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, ty, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (hasFrame && type === 'shopping-bag') {
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 4 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(W / 2, pad + 24 * scale, 18 * scale, Math.PI, 0);
    ctx.stroke();
  } else if (hasFrame && type === 'coffee-takeout') {
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 2 * scale;
    const startX = pad + 12 * scale;
    const endX = W - pad - 12 * scale;
    const zigY = pad + 8 * scale;
    ctx.beginPath();
    ctx.moveTo(startX, zigY);
    let up = true;
    for (let x = startX + 10 * scale; x <= endX; x += 10 * scale) {
      ctx.lineTo(x, up ? zigY - 6 * scale : zigY);
      up = !up;
    }
    ctx.stroke();
  } else if (hasFrame && type === 'speech-bubble') {
    const cx = W / 2;
    const ty = pad + 4 * scale;
    const bw = 130 * scale;
    const bh = 24 * scale;
    ctx.fillStyle = frameColor;
    roundRect(ctx, cx - bw / 2, ty, bw, bh, 8 * scale);
    ctx.fill();
    // Speech bubble tail
    ctx.beginPath();
    ctx.moveTo(cx - 20 * scale, ty + bh);
    ctx.lineTo(cx - 12 * scale, ty + bh + 6 * scale);
    ctx.lineTo(cx - 8 * scale, ty + bh);
    ctx.fill();
    ctx.fillStyle = contrastText;
    ctx.font = `bold ${Math.round(11 * scale)}px monospace, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(topText || bottomText || 'SCAN ME', cx, ty + bh / 2);
  } else if (hasFrame && type === 'phone') {
    ctx.fillStyle = frameColor;
    roundRect(ctx, W / 2 - 22 * scale, pad + 6 * scale, 44 * scale, 4 * scale, 2 * scale);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(W / 2 + 32 * scale, pad + 8 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw optional Top text
  if (topText && type !== 'speech-bubble') {
    ctx.fillStyle = config.text.enabled ? config.text.color : frameColor;
    ctx.font = `${config.text.weight} ${Math.round(size * (config.text.size / 320))}px ${config.text.family}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(topText, W / 2, pad + 12 * scale);
  }

  // Draw QR code
  ctx.drawImage(qrImg, pad, pad + topH, size, size);

  // Bottom Decorations & Badges
  const bottomCenterY = pad + topH + size + bottomH / 2;

  if (hasFrame && (type === 'arrow-cursive' || type === 'cursive')) {
    ctx.fillStyle = frameColor;
    ctx.font = `bold ${Math.round(24 * scale)}px 'Caveat', cursive, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bottomText || 'Scan me', W / 2, bottomCenterY);

    if (type === 'arrow-cursive') {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 2 * scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(W / 2 - 70 * scale, bottomCenterY + 6 * scale);
      ctx.quadraticCurveTo(W / 2 - 75 * scale, bottomCenterY - 14 * scale, W / 2 - 50 * scale, bottomCenterY - 8 * scale);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W / 2 - 58 * scale, bottomCenterY - 12 * scale);
      ctx.lineTo(W / 2 - 50 * scale, bottomCenterY - 8 * scale);
      ctx.lineTo(W / 2 - 56 * scale, bottomCenterY - 4 * scale);
      ctx.stroke();
    }
  } else if (hasFrame && type === 'envelope') {
    const ey = bottomCenterY - 14 * scale;
    const eh = 30 * scale;
    ctx.fillStyle = frameColor;
    roundRect(ctx, 4 * scale, ey, W - 8 * scale, eh, 8 * scale);
    ctx.fill();
    // V flap
    ctx.fillStyle = frameBg;
    ctx.beginPath();
    ctx.moveTo(4 * scale, ey);
    ctx.lineTo(W / 2, ey + 12 * scale);
    ctx.lineTo(W - 4 * scale, ey);
    ctx.fill();
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    ctx.fillStyle = contrastText;
    ctx.font = `bold ${Math.round(12 * scale)}px monospace, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bottomText || 'SCAN ME', W / 2, ey + eh - 8 * scale);
  } else if (hasFrame && type === 'delivery-scooter') {
    const badgeText = bottomText || 'TRACK ORDER';
    ctx.font = `bold ${Math.round(11 * scale)}px monospace, sans-serif`;
    const tw = ctx.measureText(badgeText).width;
    const bw = Math.max(tw + 24 * scale, 90 * scale);
    const bh = 22 * scale;
    ctx.fillStyle = frameColor;
    roundRect(ctx, (W - bw) / 2, bottomCenterY - 18 * scale, bw, bh, bh / 2);
    ctx.fill();
    ctx.fillStyle = contrastText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, W / 2, bottomCenterY - 7 * scale);

    // Scooter wheels and chassis
    const sy = bottomCenterY + 12 * scale;
    const scx = W / 2;
    ctx.fillStyle = frameBg;
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath(); ctx.arc(scx - 42 * scale, sy, 8 * scale, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(scx + 42 * scale, sy, 8 * scale, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(scx - 42 * scale, sy);
    ctx.lineTo(scx + 20 * scale, sy);
    ctx.lineTo(scx + 34 * scale, sy - 14 * scale);
    ctx.lineTo(scx + 44 * scale, sy - 14 * scale);
    ctx.stroke();
  } else if (hasFrame && type === 'simple') {
    ctx.fillStyle = config.text.enabled ? config.text.color : frameColor;
    ctx.font = `bold ${Math.round(13 * scale)}px monospace, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bottomText || 'SCAN ME', W / 2, bottomCenterY);
  } else if (hasFrame && type !== 'none') {
    // Solid Pill Badge
    const badgeText = bottomText || 'SCAN ME';
    const fontSize = Math.round(13 * scale);
    ctx.font = `bold ${fontSize}px monospace, sans-serif`;
    const textWidth = ctx.measureText(badgeText).width;
    const badgePadX = 18 * scale;
    const badgeW = Math.max(textWidth + badgePadX * 2, 100 * scale);
    const badgeH = 26 * scale;
    const badgeX = (W - badgeW) / 2;
    const badgeY = bottomCenterY - badgeH / 2;

    ctx.fillStyle = frameColor;
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
    ctx.fill();

    ctx.fillStyle = contrastText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, W / 2, bottomCenterY + 0.5 * scale);
  } else if (bottomText) {
    ctx.fillStyle = config.text.enabled ? config.text.color : frameColor;
    ctx.font = `${config.text.weight} ${Math.round(size * (config.text.size / 320))}px ${config.text.family}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bottomText, W / 2, bottomCenterY);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed: could not encode image.'))), 'image/png');
  });
}

export async function downloadQR(config, job) {
  const qrConfig =
    job.format === 'jpg' && config.colors.background === 'transparent'
      ? { ...config, colors: { ...config.colors, background: '#ffffff' } }
      : config;
  const inst = await createQRInstance(qrConfig, job.size);
  if (job.format === 'svg') {
    const blob = await inst.getRawData('svg');
    if (!blob) throw new Error('SVG export failed.');
    triggerDownload(blob, `${job.fileName}.svg`);
    return;
  }
  const ext = job.format === 'jpg' ? 'jpeg' : job.format;
  let blob = await inst.getRawData(ext);
  if (!blob) throw new Error('Export failed.');
  if (requiresCompositeFrame(config)) {
    blob = await compositeWithFrame(config, blob, job.size);
  }
  triggerDownload(blob, `${job.fileName}.${job.format}`);
}

function triggerDownload(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function copyQRImage(config) {
  const inst = await createQRInstance(config, 1024);
  let blob = await inst.getRawData('png');
  if (!blob) throw new Error('Copy failed.');
  if (requiresCompositeFrame(config)) {
    blob = await compositeWithFrame(config, blob, 1024);
  }
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

export function copyConfigJson(config) {
  return navigator.clipboard.writeText(JSON.stringify(config, null, 2));
}

export async function shareQR(config) {
  const inst = await createQRInstance(config, 1024);
  let blob = await inst.getRawData('png');
  if (!blob) throw new Error('Share failed.');
  if (requiresCompositeFrame(config)) {
    blob = await compositeWithFrame(config, blob, 1024);
  }
  const file = new File([blob], 'qr-code.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], title: 'QR Code' });
    return 'shared';
  }
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  return 'copied';
}
