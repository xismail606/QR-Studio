import { describe, test, expect } from 'vitest';
import { CONTENT_TYPES, validateContent, encodeContent } from '@/lib/qr/contentTypes.js';
import { validateLogoFile, sanitizeLabel } from '@/lib/qr/validation.js';
import { applyPreset, PRESETS } from '@/lib/presets/presets.js';
import { randomizeVisuals } from '@/lib/presets/randomize.js';
import { defaultQRConfig } from '@/types/qr.js';

describe('content validation', () => {
  test.each([
    ['url', 'https://example.com', null],
    ['url', '', 'Enter a URL'],
    ['url', 'ht!tp', 'incomplete'],
    ['text', 'hello', null],
    ['text', '   ', 'Enter some text'],
  ])('%s "%s" → %s', (type, value, expectedStart) => {
    const err = validateContent({ content: { type, value } });
    if (expectedStart === null) expect(err).toBeNull();
    else expect(err).toMatch(expectedStart);
  });

  test('url without protocol gets https prefix on encode', () => {
    expect(encodeContent({ content: { type: 'url', value: 'example.com' } })).toBe('https://example.com');
  });

  test('registry exposes url + text only for MVP', () => {
    expect(Object.keys(CONTENT_TYPES).sort()).toEqual(['text', 'url']);
  });
});

describe('logo validation', () => {
  test('rejects exe, accepts png', () => {
    expect(validateLogoFile({ type: 'application/x-msdownload', size: 100 })).toMatch(/Unsupported/);
    expect(validateLogoFile({ type: 'image/png', size: 100 })).toBeNull();
  });

  test('rejects oversized file', () => {
    expect(validateLogoFile({ type: 'image/png', size: 3 * 1024 * 1024 })).toMatch(/too large/);
  });

  test('sanitizeLabel strips control chars and caps length', () => {
    expect(sanitizeLabel('a\u0000b', 10)).toBe('ab');
    expect(sanitizeLabel('x'.repeat(200)).length).toBe(120);
  });
});

describe('presets', () => {
  test('catalog ships 10 presets', () => {
    expect(PRESETS.length).toBeGreaterThanOrEqual(10);
  });

  test('applyPreset keeps user content', () => {
    const base = { ...defaultQRConfig(), content: { type: 'url', value: 'https://mine.test' } };
    const next = applyPreset(base, 'cyber');
    expect(next.content.value).toBe('https://mine.test');
    expect(next.colors.foreground).not.toBe(base.colors.foreground);
  });

  test('applyPreset with unknown id returns config unchanged', () => {
    const base = defaultQRConfig();
    expect(applyPreset(base, 'nope')).toBe(base);
  });

  test('randomize keeps content but changes visuals', () => {
    const base = defaultQRConfig();
    const next = randomizeVisuals(base);
    expect(next.content).toEqual(base.content);
    expect(next).not.toEqual(base);
  });

  test('randomize stays within readable bounds', () => {
    for (let i = 0; i < 20; i += 1) {
      const next = randomizeVisuals(defaultQRConfig());
      expect(next.logo).toEqual(defaultQRConfig().logo);
      expect(['horizontal', 'vertical', 'diagonal', 'radial']).toContain(next.colors.gradientDir);
    }
  });
});
