import { DOT_STYLES, EYE_FRAME_STYLES, EYE_CENTER_STYLES } from '@/types/qr.js';

const SAFE_FG = ['#111827', '#0f2a4a', '#1e3a8a', '#334155', '#6d28d9', '#0f766e', '#b45309'];
const SAFE_BG = ['#ffffff', '#f8fafc', '#fffbeb', '#f5f3ff', '#f1f5f9'];
const GRADIENTS = [
  ['#2563eb', '#7c3aed'],
  ['#0ea5e9', '#6366f1'],
  ['#7c3aed', '#ec4899'],
  ['#0f766e', '#2563eb'],
];
const FRAMES = ['none', 'rounded', 'simple', 'modern', 'bottom-label'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomizeVisuals(config) {
  const useGradient = Math.random() < 0.4;
  const [g1, g2] = pick(GRADIENTS);
  const fg = useGradient ? g1 : pick(SAFE_FG);
  return {
    ...config,
    style: {
      ...config.style,
      dots: pick(DOT_STYLES),
      eyeFrame: pick(EYE_FRAME_STYLES),
      eyeCenter: pick(EYE_CENTER_STYLES),
      eyeColor: fg,
      eyeCenterColor: fg,
      singleEyeColor: true,
    },
    colors: {
      ...config.colors,
      foreground: fg,
      background: pick(SAFE_BG),
      gradientEnabled: useGradient,
      gradientStart: g1,
      gradientEnd: g2,
      gradientDir: pick(['horizontal', 'vertical', 'diagonal', 'radial']),
    },
    frame: {
      ...config.frame,
      type: pick(FRAMES),
    },
  };
}
