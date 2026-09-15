import { PRESETS } from './presets.js';

export const TEMPLATES = PRESETS.map((p) => ({
  ...p,
  previewHint: `${p.name} · ${p.tagline}`,
  tags: [p.id],
}));
