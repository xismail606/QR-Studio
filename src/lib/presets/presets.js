import { mergeConfig } from '../config/mergeConfig.js';

// Curated presets: data only, no UI logic.
export const PRESETS = [
  {
    id: 'modern', name: 'Modern', tagline: 'Rounded dots, blue gradient',
    patch: {
      style: { dots: 'rounded', eyeFrame: 'rounded', eyeCenter: 'rounded', eyeColor: '#1e3a8a', eyeCenterColor: '#1e3a8a', singleEyeColor: true },
      colors: { foreground: '#1e3a8a', background: '#ffffff', gradientEnabled: true, gradientStart: '#2563eb', gradientEnd: '#7c3aed', gradientDir: 'diagonal' },
      frame: { type: 'rounded', color: '#1e3a8a', background: '#ffffff', radius: 24, borderWidth: 0, padding: 16, text: '' },
    },
  },
  {
    id: 'minimal', name: 'Minimal', tagline: 'Clean black on white',
    patch: {
      style: { dots: 'square', eyeFrame: 'square', eyeCenter: 'square', eyeColor: '#000000', eyeCenterColor: '#000000', singleEyeColor: true },
      colors: { foreground: '#000000', background: '#ffffff', gradientEnabled: false, gradientStart: '#000000', gradientEnd: '#000000', gradientDir: 'horizontal' },
      frame: { type: 'none', color: '#000000', background: '#ffffff', radius: 0, borderWidth: 0, padding: 16, text: '' },
    },
  },
  {
    id: 'business', name: 'Business', tagline: 'Navy, trustworthy',
    patch: {
      style: { dots: 'classy-rounded', eyeFrame: 'rounded', eyeCenter: 'rounded', eyeColor: '#0f2a4a', eyeCenterColor: '#0f2a4a', singleEyeColor: true },
      colors: { foreground: '#0f2a4a', background: '#ffffff', gradientEnabled: false, gradientStart: '#0f2a4a', gradientEnd: '#0f2a4a', gradientDir: 'horizontal' },
      frame: { type: 'bottom-label', color: '#0f2a4a', background: '#f1f5f9', radius: 16, borderWidth: 0, padding: 16, text: 'Visit Our Website' },
      text: { enabled: false, top: '', bottom: '', size: 18, weight: 600, family: 'Plus Jakarta Sans, system-ui, sans-serif', spacing: 0, align: 'center', color: '#0f2a4a' },
    },
  },
  {
    id: 'corporate', name: 'Corporate', tagline: 'Slate, sharp edges',
    patch: {
      style: { dots: 'classy', eyeFrame: 'square', eyeCenter: 'square', eyeColor: '#334155', eyeCenterColor: '#334155', singleEyeColor: true },
      colors: { foreground: '#334155', background: '#ffffff', gradientEnabled: false, gradientStart: '#334155', gradientEnd: '#334155', gradientDir: 'horizontal' },
      frame: { type: 'simple', color: '#334155', background: '#ffffff', radius: 8, borderWidth: 2, padding: 16, text: '' },
    },
  },
  {
    id: 'cyber', name: 'Cyber', tagline: 'Neon on dark',
    patch: {
      style: { dots: 'dots', eyeFrame: 'circle', eyeCenter: 'circle', eyeColor: '#22d3ee', eyeCenterColor: '#22d3ee', singleEyeColor: true },
      colors: { foreground: '#22d3ee', background: '#05070f', gradientEnabled: true, gradientStart: '#22d3ee', gradientEnd: '#a78bfa', gradientDir: 'diagonal' },
      frame: { type: 'modern', color: '#22d3ee', background: '#0a0f1e', radius: 20, borderWidth: 1, padding: 16, text: '' },
    },
  },
  {
    id: 'gradient', name: 'Gradient', tagline: 'Violet to pink pop',
    patch: {
      style: { dots: 'extra-rounded', eyeFrame: 'extra-rounded', eyeCenter: 'rounded', eyeColor: '#7c3aed', eyeCenterColor: '#7c3aed', singleEyeColor: true },
      colors: { foreground: '#7c3aed', background: '#ffffff', gradientEnabled: true, gradientStart: '#7c3aed', gradientEnd: '#ec4899', gradientDir: 'horizontal' },
      frame: { type: 'rounded', color: '#7c3aed', background: '#ffffff', radius: 24, borderWidth: 0, padding: 16, text: '' },
    },
  },
  {
    id: 'dark', name: 'Dark', tagline: 'White on near-black',
    patch: {
      style: { dots: 'rounded', eyeFrame: 'rounded', eyeCenter: 'rounded', eyeColor: '#f8fafc', eyeCenterColor: '#f8fafc', singleEyeColor: true },
      colors: { foreground: '#f8fafc', background: '#0a0f1e', gradientEnabled: false, gradientStart: '#f8fafc', gradientEnd: '#f8fafc', gradientDir: 'horizontal' },
      frame: { type: 'none', color: '#f8fafc', background: '#0a0f1e', radius: 0, borderWidth: 0, padding: 16, text: '' },
    },
  },
  {
    id: 'luxury', name: 'Luxury', tagline: 'Gold on charcoal',
    patch: {
      style: { dots: 'classy', eyeFrame: 'extra-rounded', eyeCenter: 'rounded', eyeColor: '#c9a227', eyeCenterColor: '#c9a227', singleEyeColor: true },
      colors: { foreground: '#2b2b2b', background: '#faf7ef', gradientEnabled: false, gradientStart: '#2b2b2b', gradientEnd: '#2b2b2b', gradientDir: 'horizontal' },
      frame: { type: 'badge', color: '#c9a227', background: '#faf7ef', radius: 28, borderWidth: 2, padding: 18, text: '' },
    },
  },
  {
    id: 'restaurant', name: 'Restaurant', tagline: 'Warm scan-me card',
    patch: {
      style: { dots: 'rounded', eyeFrame: 'rounded', eyeCenter: 'circle', eyeColor: '#b45309', eyeCenterColor: '#b45309', singleEyeColor: true },
      colors: { foreground: '#78350f', background: '#fffbeb', gradientEnabled: false, gradientStart: '#78350f', gradientEnd: '#78350f', gradientDir: 'horizontal' },
      frame: { type: 'scan-me', color: '#b45309', background: '#fffbeb', radius: 20, borderWidth: 0, padding: 16, text: 'SCAN ME' },
    },
  },
  {
    id: 'social', name: 'Social', tagline: 'Playful violet',
    patch: {
      style: { dots: 'dots', eyeFrame: 'circle', eyeCenter: 'circle', eyeColor: '#7c3aed', eyeCenterColor: '#ec4899', singleEyeColor: false },
      colors: { foreground: '#6d28d9', background: '#ffffff', gradientEnabled: true, gradientStart: '#7c3aed', gradientEnd: '#ec4899', gradientDir: 'radial' },
      frame: { type: 'badge', color: '#7c3aed', background: '#f5f3ff', radius: 28, borderWidth: 0, padding: 16, text: '' },
    },
  },
  {
    id: 'chef-menu', name: 'Chef Menu', tagline: 'Toque hat, culinary card',
    patch: {
      style: { dots: 'classy', eyeFrame: 'rounded', eyeCenter: 'circle', eyeColor: '#854d0e', eyeCenterColor: '#854d0e', singleEyeColor: true },
      colors: { foreground: '#451a03', background: '#ffffff', gradientEnabled: false, gradientStart: '#451a03', gradientEnd: '#451a03', gradientDir: 'horizontal' },
      frame: { type: 'chef-hat', color: '#854d0e', background: '#fffbeb', radius: 24, borderWidth: 0, padding: 18, text: 'VIEW MENU' },
    },
  },
  {
    id: 'cafe-roast', name: 'Cafe & Roastery', tagline: 'Steaming mug, warm espresso',
    patch: {
      style: { dots: 'rounded', eyeFrame: 'rounded', eyeCenter: 'rounded', eyeColor: '#78350f', eyeCenterColor: '#78350f', singleEyeColor: true },
      colors: { foreground: '#3e1f0e', background: '#ffffff', gradientEnabled: false, gradientStart: '#3e1f0e', gradientEnd: '#3e1f0e', gradientDir: 'horizontal' },
      frame: { type: 'coffee-cup', color: '#78350f', background: '#fef3c7', radius: 22, borderWidth: 0, padding: 18, text: 'ORDER COFFEE' },
    },
  },
  {
    id: 'delivery-rush', name: 'Delivery Express', tagline: 'Courier scooter, swift route',
    patch: {
      style: { dots: 'extra-rounded', eyeFrame: 'square', eyeCenter: 'square', eyeColor: '#ea580c', eyeCenterColor: '#ea580c', singleEyeColor: true },
      colors: { foreground: '#1e293b', background: '#ffffff', gradientEnabled: false, gradientStart: '#1e293b', gradientEnd: '#1e293b', gradientDir: 'horizontal' },
      frame: { type: 'delivery-scooter', color: '#ea580c', background: '#fff7ed', radius: 20, borderWidth: 0, padding: 16, text: 'TRACK ORDER' },
    },
  },
  {
    id: 'gift-voucher', name: 'Gift Voucher', tagline: 'Tied ribbon bow, festive emerald',
    patch: {
      style: { dots: 'classy-rounded', eyeFrame: 'extra-rounded', eyeCenter: 'rounded', eyeColor: '#059669', eyeCenterColor: '#059669', singleEyeColor: true },
      colors: { foreground: '#064e3b', background: '#ffffff', gradientEnabled: false, gradientStart: '#064e3b', gradientEnd: '#064e3b', gradientDir: 'horizontal' },
      frame: { type: 'gift-box', color: '#059669', background: '#f0fdf4', radius: 24, borderWidth: 0, padding: 18, text: 'CLAIM GIFT' },
    },
  },
  {
    id: 'boutique', name: 'Boutique Store', tagline: 'Shopping bag, luxury velvet',
    patch: {
      style: { dots: 'classy', eyeFrame: 'rounded', eyeCenter: 'circle', eyeColor: '#be185d', eyeCenterColor: '#be185d', singleEyeColor: true },
      colors: { foreground: '#4c0519', background: '#ffffff', gradientEnabled: false, gradientStart: '#4c0519', gradientEnd: '#4c0519', gradientDir: 'horizontal' },
      frame: { type: 'shopping-bag', color: '#be185d', background: '#fdf2f8', radius: 20, borderWidth: 0, padding: 18, text: 'SHOP NOW' },
    },
  },
  {
    id: 'camera-social', name: 'Social Lens', tagline: 'Camera pill, creator profile',
    patch: {
      style: { dots: 'dots', eyeFrame: 'circle', eyeCenter: 'circle', eyeColor: '#9333ea', eyeCenterColor: '#ec4899', singleEyeColor: false },
      colors: { foreground: '#7e22ce', background: '#ffffff', gradientEnabled: true, gradientStart: '#ec4899', gradientEnd: '#8b5cf6', gradientDir: 'diagonal' },
      frame: { type: 'camera-pill', color: '#0f172a', background: '#ffffff', radius: 24, borderWidth: 0, padding: 16, text: 'FOLLOW ME' },
    },
  },
  {
    id: 'artisan-script', name: 'Artisan Script', tagline: 'Handwritten arrow, organic ink',
    patch: {
      style: { dots: 'rounded', eyeFrame: 'rounded', eyeCenter: 'rounded', eyeColor: '#18181b', eyeCenterColor: '#18181b', singleEyeColor: true },
      colors: { foreground: '#18181b', background: '#ffffff', gradientEnabled: false, gradientStart: '#18181b', gradientEnd: '#18181b', gradientDir: 'horizontal' },
      frame: { type: 'arrow-cursive', color: '#18181b', background: '#fafaf9', radius: 20, borderWidth: 0, padding: 16, text: 'Scan me' },
    },
  },
  {
    id: 'speech-chat', name: 'Conversational', tagline: 'Speech balloon callout',
    patch: {
      style: { dots: 'extra-rounded', eyeFrame: 'rounded', eyeCenter: 'circle', eyeColor: '#0284c7', eyeCenterColor: '#0284c7', singleEyeColor: true },
      colors: { foreground: '#0369a1', background: '#ffffff', gradientEnabled: false, gradientStart: '#0369a1', gradientEnd: '#0369a1', gradientDir: 'horizontal' },
      frame: { type: 'speech-bubble', color: '#0284c7', background: '#f0f9ff', radius: 24, borderWidth: 0, padding: 18, text: 'CHAT WITH US' },
    },
  },
  {
    id: 'neon-burst', name: 'Energy Pulse', tagline: 'Radiating spark rays',
    patch: {
      style: { dots: 'dots', eyeFrame: 'circle', eyeCenter: 'circle', eyeColor: '#06b6d4', eyeCenterColor: '#06b6d4', singleEyeColor: true },
      colors: { foreground: '#06b6d4', background: '#020617', gradientEnabled: true, gradientStart: '#06b6d4', gradientEnd: '#3b82f6', gradientDir: 'diagonal' },
      frame: { type: 'energy-burst', color: '#06b6d4', background: '#090d1a', radius: 20, borderWidth: 1, padding: 18, text: 'SCAN NOW' },
    },
  },
];

export function applyPreset(config, presetId) {
  const preset = PRESETS.find((p) => p.id === presetId);
  if (!preset) return config;
  return mergeConfig(config, preset.patch);
}
