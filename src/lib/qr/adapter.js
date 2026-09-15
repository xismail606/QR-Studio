import { encodeContent } from './contentTypes.js';

const ctorPromise = import('qr-code-styling').then((m) => {
  const ctor = m.default ?? m.QRCodeStyling;
  if (!ctor) throw new Error('qr-code-styling failed to load.');
  return ctor;
});

function loadCtor() {
  return ctorPromise;
}

function gradientType(dir) {
  return dir === 'radial' ? 'radial' : 'linear';
}

function gradientRotation(dir) {
  switch (dir) {
    case 'horizontal':
      return 0;
    case 'vertical':
      return Math.PI / 2;
    case 'diagonal':
      return Math.PI / 4;
    default:
      return 0;
  }
}

function eyeFrameType(v) {
  if (v === 'circle') return 'dot';
  if (v === 'rounded') return 'rounded';
  if (v === 'extra-rounded') return 'extra-rounded';
  if (v === 'dots') return 'dots';
  if (v === 'classy') return 'classy';
  if (v === 'classy-rounded') return 'classy-rounded';
  return 'square';
}

function eyeCenterType(v) {
  if (v === 'circle') return 'dot';
  if (v === 'dots') return 'dot';
  if (v === 'classy') return 'classy';
  if (v === 'classy-rounded') return 'classy-rounded';
  return v;
}

export function toStylingOptions(config, size) {
  const data = encodeContent(config) || 'https://example.com';
  const eyeColor = config.style.eyeColor;
  const centerColor = config.style.singleEyeColor ? eyeColor : config.style.eyeCenterColor;

  // Build eye frame color/gradient
  const cornersSquareColor = config.style.eyeFrameGradient
    ? undefined
    : eyeColor;
  const cornersSquareGradient = config.style.eyeFrameGradient
    ? {
        type: 'linear',
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: config.style.eyeFrameGradStart || eyeColor },
          { offset: 1, color: config.style.eyeFrameGradEnd || '#d4ad63' },
        ],
      }
    : undefined;

  // Build eye center color/gradient
  const cornersDotColor = config.style.eyeCenterGradient
    ? undefined
    : centerColor;
  const cornersDotGradient = config.style.eyeCenterGradient
    ? {
        type: 'linear',
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: config.style.eyeCenterGradStart || centerColor },
          { offset: 1, color: config.style.eyeCenterGradEnd || '#d4ad63' },
        ],
      }
    : undefined;

  return {
    width: size,
    height: size,
    data,
    margin: config.margin ?? 0,
    shape: config.shape || 'square',
    qrOptions: { errorCorrectionLevel: config.errorCorrection },
    image: config.logo.enabled && config.logo.dataUrl ? config.logo.dataUrl : undefined,
    dotsOptions: {
      color: config.colors.foreground,
      type: config.style.dots,
      ...(config.colors.gradientEnabled
        ? {
            gradient: {
              type: gradientType(config.colors.gradientDir),
              rotation: gradientRotation(config.colors.gradientDir),
              colorStops: [
                { offset: 0, color: config.colors.gradientStart },
                { offset: 1, color: config.colors.gradientEnd },
              ],
            },
          }
        : {}),
    },
    cornersSquareOptions: {
      color: cornersSquareColor,
      type: eyeFrameType(config.style.eyeFrame),
      ...(cornersSquareGradient ? { gradient: cornersSquareGradient } : {}),
    },
    cornersDotOptions: {
      color: cornersDotColor,
      type: eyeCenterType(config.style.eyeCenter),
      ...(cornersDotGradient ? { gradient: cornersDotGradient } : {}),
    },
    backgroundOptions: {
      color: config.colors.background === 'transparent' ? 'transparent' : config.colors.background,
      round: config.bgRound ? config.bgRound / 100 : 0,
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      hideBackgroundDots: true,
      imageSize: config.logo.size,
      margin: config.logo.padding,
    },
  };
}

export async function createQRInstance(config, size) {
  const Ctor = await loadCtor();
  const inst = new Ctor({ ...toStylingOptions(config, size), type: 'canvas' });
  return {
    append: (el) => inst.append(el),
    update: (next, nextSize) => inst.update(toStylingOptions(next, nextSize)),
    getRawData: async (ext) => {
      const raw = await inst.getRawData(ext);
      if (!raw) return null;
      if (raw instanceof Blob) return raw;
      return new Blob([raw], { type: `image/${ext === 'svg' ? 'svg+xml' : ext}` });
    },
  };
}
