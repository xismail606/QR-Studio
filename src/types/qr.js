// Central QR config : plain JavaScript (no TypeScript).
// All visual options live here. UI state (tabs, toasts, theme) stays outside.

export const DOT_STYLES = ['square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded'];
export const EYE_FRAME_STYLES = ['square', 'rounded', 'circle', 'extra-rounded', 'dots', 'classy', 'classy-rounded'];
export const EYE_CENTER_STYLES = ['square', 'rounded', 'circle', 'dots', 'classy', 'classy-rounded'];
export const GRADIENT_DIRS = ['horizontal', 'vertical', 'diagonal', 'radial'];
export const EC_LEVELS = ['L', 'M', 'Q', 'H'];
export const FRAME_TYPES = [
  'none',
  'badge-bottom',
  'arrow-cursive',
  'cursive',
  'envelope',
  'camera-pill',
  'tooltip-pointer',
  'speech-bubble',
  'phone',
  'ribbon',
  'chef-hat',
  'delivery-scooter',
  'coffee-cup',
  'gift-box',
  'coffee-takeout',
  'energy-burst',
  'shopping-bag',
  'simple',
  'rounded',
  'modern',
  'scan-me',
  'badge',
  'top-label',
  'bottom-label',
];
export const EXPORT_FORMATS = ['png', 'jpg', 'webp', 'svg'];
export const EXPORT_SIZES = [512, 1024, 2048];

export function defaultQRConfig() {
  return {
    shape: 'square',
    bgRound: 0,
    content: { type: 'url', value: 'https://example.com' },
    style: {
      dots: 'rounded',
      eyeFrame: 'rounded',
      eyeCenter: 'rounded',
      eyeColor: '#17211c',
      eyeCenterColor: '#17211c',
      singleEyeColor: true,
      eyeFrameGradient: false,
      eyeFrameGradStart: '#9a6b25',
      eyeFrameGradEnd: '#d4ad63',
      eyeCenterGradient: false,
      eyeCenterGradStart: '#b86f5d',
      eyeCenterGradEnd: '#d4ad63',
    },
    colors: {
      foreground: '#17211c',
      background: '#ffffff',
      gradientEnabled: false,
      gradientStart: '#9a6b25',
      gradientEnd: '#4f8a66',
      gradientDir: 'diagonal',
    },
    logo: {
      enabled: false,
      dataUrl: '',
      size: 0.2,
      padding: 8,
      background: '#ffffff',
      radius: 12,
      borderWidth: 0,
      borderColor: '#e5e7eb',
    },
    frame: {
      type: 'none',
      color: '#111827',
      background: '#ffffff',
      radius: 24,
      borderWidth: 0,
      padding: 16,
      text: '',
    },
    text: {
      enabled: false,
      top: '',
      bottom: '',
      size: 18,
      weight: 600,
      family: 'Plus Jakarta Sans, system-ui, sans-serif',
      spacing: 0,
      align: 'center',
      color: '#111827',
    },
    errorCorrection: 'M',
    size: 1024,
    margin: 4,
  };
}
