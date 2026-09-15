const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_MIME = new Set(['image/png', 'image/jpeg', 'image/webp']);

export function validateLogoFile(file) {
  if (!ALLOWED_LOGO_MIME.has(file.type)) {
    return 'Unsupported image. Use PNG, JPG or WEBP (SVG is not supported in MVP for security).';
  }
  if (file.size > MAX_LOGO_BYTES) {
    return `Logo is too large (${(file.size / 1048576).toFixed(1)}MB). Max 2MB.`;
  }
  return null;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.readAsDataURL(file);
  });
}

export function downscaleDataUrl(dataUrl, maxDim = 512) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      if (scale >= 1) return resolve(dataUrl);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export function sanitizeLabel(input, max = 120) {
  return String(input ?? '').replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max);
}
