function hexToRgb(hex) {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance([r, g, b]) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(a, b) {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return 1;
  const la = luminance(ra);
  const lb = luminance(rb);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

export function getReadability(config) {
  const issues = [];
  let score = 100;

  if (!config.content.value.trim()) {
    return {
      level: 'poor',
      score: 0,
      issues: [{ code: 'empty-content', message: 'No content yet.', fix: 'Enter a URL or text to generate.' }],
    };
  }

  const fg = config.colors.gradientEnabled ? config.colors.gradientStart : config.colors.foreground;
  const bg = config.colors.background === 'transparent' ? '#ffffff' : config.colors.background;

  const ratio = contrastRatio(fg, bg);
  if (ratio < 2.2) {
    score -= 45;
    issues.push({
      code: 'low-contrast',
      message: `Low contrast (${ratio.toFixed(1)}:1) may prevent scanning.`,
      fix: 'Use a darker foreground on a light background.',
    });
  } else if (ratio < 3.5) {
    score -= 20;
    issues.push({
      code: 'low-contrast',
      message: `Contrast is borderline (${ratio.toFixed(1)}:1).`,
      fix: 'Darken the QR color or lighten the background.',
    });
  }

  if (config.colors.gradientEnabled) {
    const gRatio = contrastRatio(config.colors.gradientEnd, bg);
    if (Math.min(ratio, gRatio) < 2.2) {
      score -= 15;
      issues.push({
        code: 'gradient-contrast',
        message: 'One gradient end is too close to the background.',
        fix: 'Pick two darker gradient colors.',
      });
    }
  }

  if (config.colors.background === 'transparent') {
    score -= 10;
    issues.push({
      code: 'transparency',
      message: 'Transparent background can fail on dark surfaces.',
      fix: 'Use a solid light background for print.',
    });
  }

  if (config.logo.enabled && config.logo.dataUrl) {
    if (config.logo.size > 0.3) {
      score -= 25;
      issues.push({
        code: 'large-logo',
        message: 'Logo covers a large area and may block scanning.',
        fix: 'Keep logo under 25% and use High error correction.',
      });
    } else if (config.logo.size > 0.25) {
      score -= 12;
      issues.push({
        code: 'large-logo',
        message: 'Large logo — readability reduced.',
        fix: 'Reduce logo size slightly for safer scanning.',
      });
    }
    if (config.errorCorrection !== 'H' && config.errorCorrection !== 'Q') {
      score -= 8;
      issues.push({
        code: 'low-ec-with-logo',
        message: 'Low error correction with a logo.',
        fix: 'Switch error correction to High.',
      });
    }
  }

  if (config.margin < 4) {
    score -= 15;
    issues.push({
      code: 'small-margin',
      message: 'Quiet zone is too small for reliable scanning.',
      fix: 'Keep margin at 4 modules or more.',
    });
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const level = score >= 85 ? 'excellent' : score >= 65 ? 'good' : score >= 45 ? 'warning' : 'poor';

  return { level, score, issues };
}
