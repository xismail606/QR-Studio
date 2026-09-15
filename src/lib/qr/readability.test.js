import { describe, test, expect } from 'vitest';
import { getReadability, contrastRatio } from '@/lib/qr/readability.js';
import { defaultQRConfig } from '@/types/qr.js';

function withPatch(patch) {
  const base = defaultQRConfig();
  return { ...base, ...patch, colors: { ...base.colors, ...(patch.colors ?? {}) }, content: { ...base.content, ...(patch.content ?? {}) } };
}

describe('contrastRatio', () => {
  test.each([
    ['#000000', '#ffffff', 21],
    ['#ffffff', '#ffffff', 1],
  ])('contrast %s on %s ≈ %s', (a, b, expected) => {
    expect(contrastRatio(a, b)).toBeCloseTo(expected, 0);
  });
});

describe('getReadability', () => {
  test('default black-on-white config is excellent or good', () => {
    const r = getReadability(defaultQRConfig());
    expect(['excellent', 'good']).toContain(r.level);
  });

  test('empty content is poor with guidance', () => {
    const r = getReadability(withPatch({ content: { value: '   ' } }));
    expect(r.level).toBe('poor');
    expect(r.issues[0].fix).toMatch(/URL|text/i);
  });

  test('light-gray on white warns about contrast', () => {
    const r = getReadability(withPatch({ colors: { foreground: '#e5e7eb', background: '#ffffff' } }));
    expect(['warning', 'poor']).toContain(r.level);
    expect(r.issues.some((i) => i.code === 'low-contrast')).toBe(true);
  });

  test('oversized logo reduces score and suggests fix', () => {
    const base = defaultQRConfig();
    const r = getReadability({
      ...base,
      logo: { ...base.logo, enabled: true, dataUrl: 'data:image/png;base64,xx', size: 0.34 },
    });
    expect(r.issues.some((i) => i.code === 'large-logo')).toBe(true);
  });
});
