import { useEffect, useRef, useState } from 'react';
import { Download, Sparkles, Copy, Check } from 'lucide-react';
import { createQRInstance } from '@/lib/qr/adapter.js';
import { validateContent } from '@/lib/qr/contentTypes.js';
import { downloadQR, copyQRImage } from '@/lib/export/exporter.js';
import { ReadabilityIndicator } from '../ui/ReadabilityIndicator.jsx';
import { t } from '@/lib/i18n/translations.js';

const PREVIEW_SIZE = 320;

function getContrastTextColor(hex) {
  if (!hex || hex === 'transparent') return '#ffffff';
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? '#0f172a' : '#ffffff';
}

function getDefaultFrameText(type, lang) {
  switch (type) {
    case 'chef-hat': return t('preview.viewMenu', lang);
    case 'coffee-cup': return t('preview.orderCoffee', lang);
    case 'delivery-scooter': return t('preview.trackOrder', lang);
    case 'gift-box': return t('preview.claimGift', lang);
    case 'shopping-bag': return t('preview.shopNow', lang);
    case 'coffee-takeout': return t('preview.scanToOrder', lang);
    case 'arrow-cursive':
    case 'cursive': return t('preview.scanMeTitle', lang);
    default: return t('preview.scanMe', lang);
  }
}

export function QRPreview({ config, lang = 'en' }) {
  const mountRef = useRef(null);
  const instRef = useRef(null);
  const latestRef = useRef(config);
  latestRef.current = config;
  const invalid = validateContent(config);
  const [backdrop, setBackdrop] = useState('dark'); // 'dark', 'light', 'checker'
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [renderState, setRenderState] = useState('loading');

  useEffect(() => {
    let alive = true;
    createQRInstance(latestRef.current, PREVIEW_SIZE)
      .then((inst) => {
        if (!alive) return;
        instRef.current = inst;
        if (mountRef.current) {
          mountRef.current.innerHTML = '';
          inst.append(mountRef.current);
        }
        setRenderState('ready');
      })
      .catch(() => {
        if (alive) setRenderState('error');
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      instRef.current?.update(config, PREVIEW_SIZE);
    }, 80);
    return () => clearTimeout(t);
  }, [config]);

  async function quickDownload(format) {
    if (invalid || downloading) return;
    setDownloading(true);
    try {
      await downloadQR(config, { format, size: 1024, quality: 0.92, fileName: 'qr-studio' });
    } catch {
      /* ignore */
    } finally {
      setDownloading(false);
    }
  }

  async function quickCopy() {
    if (invalid) return;
    try {
      await copyQRImage(config);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  }

  const frameOn = config.frame.type !== 'none';
  const frameType = config.frame.type;
  const frameColor = config.frame.color || '#111827';
  const frameBg = config.frame.background || '#ffffff';
  const contrastText = getContrastTextColor(frameColor);

  const hasFrameBorder = frameOn && frameType !== 'arrow-cursive' && frameType !== 'cursive' && frameType !== 'none';
  const effectiveBorderWidth = hasFrameBorder ? Math.max(config.frame.borderWidth || 0, 2) : 0;

  const topLabel = config.text.enabled && config.text.top ? config.text.top : '';
  const frameText = config.frame.text || getDefaultFrameText(frameType, lang);
  const bottomLabel =
    config.text.enabled && config.text.bottom
      ? config.text.bottom
      : frameOn
        ? frameText
        : '';
  const labelColor = (fallback) => (config.text.enabled ? config.text.color : fallback);

  return (
    <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
      {/* Main Preview Card */}
      <div className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-card overflow-hidden">
        {/* Subtle glow behind preview */}
        <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[var(--color-accent)]/10 via-transparent to-[var(--color-success)]/10 blur-xl opacity-70"></div>

        {/* Preview Deck Toolbar */}
        <div className="relative z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-panel)]/80 px-3 sm:px-4 py-2.5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span>
            <span className="font-mono text-[11px] font-semibold text-[var(--color-text)]">{t('preview.liveViewport', lang)}</span>
          </div>

          {/* Backdrop Canvas Toggles */}
          <div className="flex items-center gap-1 rounded-lg bg-[var(--color-bg)] p-0.5 border border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setBackdrop('dark')}
              title={t('preview.darkCanvas', lang)}
              className={`rounded px-2 sm:px-2.5 py-0.5 text-[10px] font-mono transition-colors ${backdrop === 'dark' ? 'bg-[var(--color-accent)] text-white font-medium' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              {t('preview.dark', lang)}
            </button>
            <button
              type="button"
              onClick={() => setBackdrop('light')}
              title={t('preview.lightCanvas', lang)}
              className={`rounded px-2 sm:px-2.5 py-0.5 text-[10px] font-mono transition-colors ${backdrop === 'light' ? 'bg-[var(--color-accent)] text-white font-medium' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              {t('preview.light', lang)}
            </button>
            <button
              type="button"
              onClick={() => setBackdrop('checker')}
              title={t('preview.transparencyGrid', lang)}
              className={`rounded px-2 sm:px-2.5 py-0.5 text-[10px] font-mono transition-colors ${backdrop === 'checker' ? 'bg-[var(--color-accent)] text-white font-medium' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              {t('preview.alpha', lang)}
            </button>
          </div>
        </div>

        {/* Render Surface */}
        <div 
          className={`relative z-10 p-4 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center transition-colors min-h-[200px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[360px] ${
            backdrop === 'dark' 
              ? 'preview-surface-dark'
              : backdrop === 'checker' 
                ? 'preview-checker'
                : 'preview-surface-light'
          }`}
        >
          {/* Outer Frame Container */}
          <div className="relative max-w-full flex flex-col items-center w-full">
            {/* Top Frame SVG Decorations */}
            {frameOn && frameType === 'chef-hat' && (
              <div className="flex justify-center -mb-2.5 z-20">
                <svg viewBox="0 0 100 48" className="w-20 h-10 drop-shadow-md" fill="none">
                  {/* White hat body with dark outline */}
                  <path
                    d="M26 36 C18 36, 12 28, 16 18 C19 10, 30 10, 36 14 C40 6, 60 6, 64 14 C70 10, 81 10, 84 18 C88 28, 82 36, 74 36 Z"
                    fill={frameBg}
                    stroke={frameColor}
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <rect x="24" y="34" width="52" height="8" rx="2" fill={frameBg} stroke={frameColor} strokeWidth="2.5" />
                  <line x1="36" y1="36" x2="36" y2="40" stroke={frameColor} strokeWidth="2" strokeLinecap="round" />
                  <line x1="50" y1="36" x2="50" y2="40" stroke={frameColor} strokeWidth="2" strokeLinecap="round" />
                  <line x1="64" y1="36" x2="64" y2="40" stroke={frameColor} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}

            {frameOn && frameType === 'coffee-cup' && (
              <div className="flex justify-center -mb-2 z-20">
                <svg viewBox="0 0 60 28" className="w-16 h-7 drop-shadow-sm" fill="none">
                  <g stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" opacity="0.9">
                    <path d="M15 24 C 11 16, 19 10, 15 2" />
                    <path d="M30 26 C 26 18, 34 12, 30 2" />
                    <path d="M45 24 C 41 16, 49 10, 45 2" />
                  </g>
                  <g stroke={frameColor} strokeWidth="2.5" strokeLinecap="round">
                    <path d="M15 24 C 11 16, 19 10, 15 2" />
                    <path d="M30 26 C 26 18, 34 12, 30 2" />
                    <path d="M45 24 C 41 16, 49 10, 45 2" />
                  </g>
                </svg>
              </div>
            )}

            {frameOn && frameType === 'gift-box' && (
              <div className="flex justify-center -mb-3 z-20">
                <svg viewBox="0 0 100 44" className="w-20 h-9 drop-shadow-md" fill="none">
                  <path d="M50 24 C 42 12, 20 8, 24 22 C 28 32, 45 25, 50 24 Z" fill={frameColor} stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M50 24 C 58 12, 80 8, 76 22 C 72 32, 55 25, 50 24 Z" fill={frameColor} stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
                  <ellipse cx="50" cy="24" rx="6" ry="5" fill={frameColor} stroke="#ffffff" strokeWidth="2" />
                  <path d="M47 27 C 42 36, 32 40, 26 42" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
                  <path d="M47 27 C 42 36, 32 40, 26 42" stroke={frameColor} strokeWidth="3" strokeLinecap="round" />
                  <path d="M53 27 C 58 36, 68 40, 74 42" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
                  <path d="M53 27 C 58 36, 68 40, 74 42" stroke={frameColor} strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            )}

            {frameOn && frameType === 'shopping-bag' && (
              <div className="flex justify-center -mb-2 z-20">
                <svg viewBox="0 0 80 34" className="w-18 h-8 drop-shadow-sm" fill="none">
                  <path d="M22 32 V 14 C 22 5, 58 5, 58 14 V 32" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                  <path d="M22 32 V 14 C 22 5, 58 5, 58 14 V 32" stroke={frameColor} strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>
            )}

            {frameOn && frameType === 'coffee-takeout' && (
              <div className="flex justify-center -mb-2 z-20 overflow-hidden w-full max-w-[220px]">
                <svg viewBox="0 0 200 14" className="w-full h-3.5 drop-shadow-sm" fill={frameBg}>
                  <polygon
                    points="0,14 10,2 20,14 30,2 40,14 50,2 60,14 70,2 80,14 90,2 100,14 110,2 120,14 130,2 140,14 150,2 160,14 170,2 180,14 190,2 200,14"
                    fill={frameBg}
                    stroke={frameColor}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            {frameOn && frameType === 'speech-bubble' && (
              <div className="flex flex-col items-center -mb-1.5 z-20">
                <div
                  className="px-5 py-1.5 rounded-xl shadow-md text-center font-mono text-xs font-bold tracking-wider uppercase"
                  style={{
                    backgroundColor: frameColor,
                    color: contrastText,
                  }}
                >
                  {topLabel || frameText || getDefaultFrameText(frameType, lang)}
                </div>
                <div
                  className="w-0 h-0 border-x-[6px] border-x-transparent border-t-[7px] self-start ml-8 -mt-0.5"
                  style={{ borderTopColor: frameColor }}
                />
              </div>
            )}

            {/* Main Card Body */}
            <div
              className="relative rounded-2xl transition-all shadow-md flex flex-col items-center justify-center max-w-full box-border"
              style={
                frameOn
                  ? {
                      background: config.frame.background,
                      borderRadius: `${config.frame.radius}px`,
                      border: effectiveBorderWidth > 0
                        ? `${effectiveBorderWidth}px solid ${frameColor}`
                        : undefined,
                      padding: `clamp(10px, ${16 + config.frame.padding}px, ${16 + config.frame.padding}px)`,
                    }
                  : {
                      background: config.colors.background === 'transparent' ? 'transparent' : config.colors.background,
                      padding: '16px',
                      borderRadius: '16px',
                    }
              }
            >
              {/* Coffee Takeout: Coffee cup standing on the left base */}
              {frameOn && frameType === 'coffee-takeout' && (
                <div className="absolute -left-3 sm:-left-6 bottom-2 sm:bottom-3 pointer-events-none z-20">
                  <svg viewBox="0 0 32 48" className="w-6 h-9 sm:w-8 sm:h-12 drop-shadow-md" fill="none">
                    <rect x="3" y="4" width="26" height="5" rx="2" fill={frameBg} stroke={frameColor} strokeWidth="2" />
                    <rect x="8" y="2" width="16" height="3" rx="1" fill={frameColor} />
                    <polygon points="5,9 27,9 23,44 9,44" fill={frameBg} stroke={frameColor} strokeWidth="2" />
                    <polygon points="6,20 26,20 24,32 8,32" fill={frameColor} />
                  </svg>
                </div>
              )}

              {/* Coffee Mug Handle attached to right */}
              {frameOn && frameType === 'coffee-cup' && (
                <div className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg viewBox="0 0 32 60" className="w-5 h-12 sm:w-7 sm:h-16 drop-shadow-md" fill="none">
                    <path
                      d="M2 6 C 24 6, 28 18, 28 30 C 28 42, 24 54, 2 54"
                      stroke="#ffffff"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 6 C 24 6, 28 18, 28 30 C 28 42, 24 54, 2 54"
                      stroke={frameColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}

              {/* Energy Rays radiating around */}
              {frameOn && frameType === 'energy-burst' && (
                <div className="absolute -inset-3 sm:-inset-5 pointer-events-none">
                  <svg viewBox="0 0 380 380" className="w-full h-full" fill="none">
                    <g stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.95">
                      <line x1="20" y1="20" x2="44" y2="44" />
                      <line x1="8" y1="46" x2="34" y2="58" />
                      <line x1="46" y1="8" x2="58" y2="34" />
                      <line x1="360" y1="20" x2="336" y2="44" />
                      <line x1="372" y1="46" x2="346" y2="58" />
                      <line x1="334" y1="8" x2="322" y2="34" />
                      <line x1="20" y1="360" x2="44" y2="336" />
                      <line x1="8" y1="334" x2="34" y2="322" />
                      <line x1="360" y1="360" x2="336" y2="336" />
                      <line x1="372" y1="334" x2="346" y2="322" />
                      <line x1="4" y1="190" x2="24" y2="190" />
                      <line x1="376" y1="190" x2="356" y2="190" />
                    </g>
                    <g stroke={frameColor} strokeWidth="2.75" strokeLinecap="round">
                      <line x1="20" y1="20" x2="44" y2="44" />
                      <line x1="8" y1="46" x2="34" y2="58" />
                      <line x1="46" y1="8" x2="58" y2="34" />
                      <line x1="360" y1="20" x2="336" y2="44" />
                      <line x1="372" y1="46" x2="346" y2="58" />
                      <line x1="334" y1="8" x2="322" y2="34" />
                      <line x1="20" y1="360" x2="44" y2="336" />
                      <line x1="8" y1="334" x2="34" y2="322" />
                      <line x1="360" y1="360" x2="336" y2="336" />
                      <line x1="372" y1="334" x2="346" y2="322" />
                      <line x1="4" y1="190" x2="24" y2="190" />
                      <line x1="376" y1="190" x2="356" y2="190" />
                    </g>
                  </svg>
                </div>
              )}

              {/* Smartphone Top Notch */}
              {frameOn && frameType === 'phone' && (
                <div className="flex items-center justify-center gap-2 mb-2 w-full">
                  <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: frameColor }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: frameColor }} />
                </div>
              )}

              {/* Optional Top Text */}
              {topLabel ? (
                <p
                  className="mb-3 font-display font-bold tracking-tight"
                  style={{
                    color: labelColor(config.frame.color),
                    fontSize: `${config.text.size}px`,
                    fontWeight: config.text.weight,
                    fontFamily: config.text.family,
                    letterSpacing: `${config.text.spacing}px`,
                    textAlign: config.text.align,
                  }}
                >
                  {topLabel}
                </p>
              ) : null}

              {/* QR Code Canvas */}
              {invalid ? (
                <div className="flex h-[180px] w-[180px] sm:h-[260px] sm:w-[260px] md:h-[280px] md:w-[280px] items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)]/40 p-3 sm:p-4 text-center text-xs font-mono text-[var(--color-text-muted)]">
                  {t('preview.enterContent', lang)}
                </div>
              ) : (
                <div className="relative flex min-h-[170px] min-w-[170px] items-center justify-center">
                  <div
                    ref={mountRef}
                    className="mx-auto flex w-fit max-w-full justify-center overflow-hidden [&_canvas]:h-auto [&_canvas]:max-h-[170px] sm:[&_canvas]:max-h-[240px] md:[&_canvas]:max-h-[280px] lg:[&_canvas]:max-h-[320px] [&_canvas]:max-w-full [&_canvas]:rounded-lg"
                  />
                  {renderState === 'loading' && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="absolute inset-0 flex min-h-[170px] min-w-[170px] flex-col items-center justify-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)]/90 p-5 text-center backdrop-blur-sm"
                    >
                      <span className="h-9 w-9 animate-pulse rounded-xl border-2 border-[var(--color-accent)]/70 bg-[var(--color-accent-light)]/40" />
                      <span className="font-mono text-[10px] font-semibold text-[var(--color-text-muted)]">
                        {t('preview.preparing', lang)}
                      </span>
                    </div>
                  )}
                  {renderState === 'error' && (
                    <div
                      role="alert"
                      className="absolute inset-0 flex min-h-[170px] min-w-[170px] items-center justify-center rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-5 text-center font-mono text-[10px] text-[var(--color-danger)]"
                    >
                      {t('preview.loadError', lang)}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Frame Elements */}
              {frameOn && frameType === 'arrow-cursive' && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <svg viewBox="0 0 36 28" className="w-8 h-6 shrink-0" fill="none">
                    <path
                      d="M4 22 C 3 10, 14 6, 26 12"
                      stroke={frameColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 7 L 27 12 L 20 17"
                      stroke={frameColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="text-2xl font-bold tracking-wide italic select-none"
                    style={{
                      fontFamily: "'Caveat', cursive, sans-serif",
                      color: frameColor,
                    }}
                  >
                    {bottomLabel || getDefaultFrameText(frameType, lang)}
                  </span>
                </div>
              )}

              {frameOn && frameType === 'cursive' && (
                <div className="mt-2.5 flex flex-col items-center">
                  <span
                    className="text-2xl font-bold tracking-wide italic select-none"
                    style={{
                      fontFamily: "'Caveat', cursive, sans-serif",
                      color: frameColor,
                    }}
                  >
                    {bottomLabel || getDefaultFrameText(frameType, lang)}
                  </span>
                  <svg viewBox="0 0 80 8" className="w-20 h-2 mt-0.5" fill="none">
                    <path
                      d="M4 4 Q 40 8, 76 2"
                      stroke={frameColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}

              {frameOn && frameType === 'camera-pill' && (
                <div className="mt-3">
                  <div
                    className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full shadow-sm"
                    style={{
                      backgroundColor: frameColor,
                      color: contrastText,
                    }}
                  >
                    <svg viewBox="0 0 20 20" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="16" height="12" rx="3" />
                      <circle cx="10" cy="11" r="3" />
                      <circle cx="14.5" cy="7.5" r="0.8" fill="currentColor" />
                    </svg>
                    <span className="font-mono text-xs font-bold tracking-wider uppercase">
                      {bottomLabel || getDefaultFrameText(frameType, lang)}
                    </span>
                  </div>
                </div>
              )}

              {frameOn && frameType === 'tooltip-pointer' && (
                <div className="mt-2 flex flex-col items-center">
                  <div
                    className="w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px]"
                    style={{ borderTopColor: frameColor }}
                  />
                  <div
                    className="px-4 py-1.5 rounded-xl shadow-sm text-center -mt-0.5"
                    style={{
                      backgroundColor: frameColor,
                      color: contrastText,
                    }}
                  >
                    <span className="font-mono text-xs font-bold tracking-wider uppercase">
                      {bottomLabel || getDefaultFrameText(frameType, lang)}
                    </span>
                  </div>
                </div>
              )}

              {frameOn && frameType === 'envelope' && (
                <div className="w-full mt-3 -mb-1 relative">
                  <div
                    className="relative rounded-b-xl pt-4 pb-2.5 px-4 text-center shadow-md overflow-hidden"
                    style={{
                      backgroundColor: frameColor,
                      color: contrastText,
                    }}
                  >
                    <svg viewBox="0 0 200 24" className="absolute top-0 left-0 w-full h-4" preserveAspectRatio="none">
                      <polygon points="0,0 100,18 200,0" fill={frameBg} />
                      <polyline points="0,0 100,18 200,0" fill="none" stroke={frameColor} strokeWidth="2" />
                    </svg>
                    <span className="font-mono text-xs font-bold tracking-wider uppercase relative z-10">
                      {bottomLabel || getDefaultFrameText(frameType, lang)}
                    </span>
                  </div>
                </div>
              )}

              {frameOn && frameType === 'delivery-scooter' && (
                <div className="mt-3 w-full flex flex-col items-center">
                  <div
                    className="px-5 py-1.5 rounded-xl shadow-sm text-center mb-1.5"
                    style={{
                      backgroundColor: frameColor,
                      color: contrastText,
                    }}
                  >
                    <span className="font-mono text-xs font-bold tracking-wider uppercase">
                      {bottomLabel || getDefaultFrameText(frameType, lang)}
                    </span>
                  </div>
                  <div className="relative">
                    <svg viewBox="0 0 160 52" className="w-44 h-14 drop-shadow-sm" fill="none">
                      <g stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="32" cy="36" r="12" />
                        <circle cx="128" cy="36" r="12" />
                        <path d="M32 36 H 75 L 105 36 L 118 16 H 132" />
                        <path d="M118 16 L 128 36" />
                        <path d="M114 16 L 110 8 H 126" />
                      </g>
                      <circle cx="32" cy="36" r="12" fill={frameBg} stroke={frameColor} strokeWidth="3" />
                      <circle cx="32" cy="36" r="5" fill={frameColor} />
                      <circle cx="128" cy="36" r="12" fill={frameBg} stroke={frameColor} strokeWidth="3" />
                      <circle cx="128" cy="36" r="5" fill={frameColor} />
                      <path d="M32 36 H 75 L 105 36 L 118 16 H 132" stroke={frameColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M118 16 L 128 36" stroke={frameColor} strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M114 16 L 110 8 H 126" stroke={frameColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="132" cy="16" r="3.5" fill="#f59e0b" stroke={frameColor} strokeWidth="1.5" />
                      <path d="M42 22 C 45 18, 70 18, 72 24 Z" fill={frameColor} />
                    </svg>
                  </div>
                </div>
              )}

              {frameOn && frameType === 'ribbon' && (
                <div className="mt-3 flex justify-center">
                  <div className="relative">
                    <div
                      className="px-6 py-1.5 font-mono text-xs font-bold tracking-wider uppercase shadow-md relative z-10"
                      style={{
                        backgroundColor: frameColor,
                        color: contrastText,
                      }}
                    >
                      {bottomLabel || getDefaultFrameText(frameType, lang)}
                    </div>
                    <div
                      className="absolute -left-3 top-1 w-3 h-full -z-0"
                      style={{
                        backgroundColor: frameColor,
                        clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
                        filter: 'brightness(0.85)',
                      }}
                    />
                    <div
                      className="absolute -right-3 top-1 w-3 h-full -z-0"
                      style={{
                        backgroundColor: frameColor,
                        clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                        filter: 'brightness(0.85)',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Standard Solid Pill Badge for other framed styles */}
              {frameOn &&
                [
                  'badge-bottom',
                  'chef-hat',
                  'coffee-cup',
                  'gift-box',
                  'shopping-bag',
                  'coffee-takeout',
                  'energy-burst',
                  'phone',
                  'badge',
                  'scan-me',
                  'bottom-label',
                  'rounded',
                  'modern',
                ].includes(frameType) && (
                  <div className="mt-3">
                    <div
                      className="px-5 py-1.5 rounded-xl shadow-sm text-center"
                      style={{
                        backgroundColor: frameColor,
                        color: contrastText,
                      }}
                    >
                      <span className="font-mono text-xs font-bold tracking-wider uppercase">
                        {bottomLabel || getDefaultFrameText(frameType, lang)}
                      </span>
                    </div>
                  </div>
                )}

              {/* Simple frame: text inside card border */}
              {frameOn && frameType === 'simple' && (
                <p
                  className="mt-3 font-mono text-xs font-bold tracking-wider uppercase text-center"
                  style={{ color: labelColor(frameColor) }}
                >
                  {bottomLabel || getDefaultFrameText(frameType, lang)}
                </p>
              )}

              {/* No frame with bottom label */}
              {!frameOn && bottomLabel ? (
                <p
                  className="mt-3 font-display font-bold tracking-tight text-center"
                  style={{
                    color: labelColor(frameColor),
                    fontSize: `${config.text.size}px`,
                    fontWeight: config.text.weight,
                    fontFamily: config.text.family,
                    letterSpacing: `${config.text.spacing}px`,
                    textAlign: config.text.align,
                  }}
                >
                  {bottomLabel}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Footer Meta Bar */}
        <div className="relative z-10 flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-[9.5px] sm:text-[10.5px] text-[var(--color-text-muted)]">
          <span>{t('preview.resolution', lang)}</span>
          <span className="text-[var(--color-accent)] font-medium">{t('preview.vectorPrecision', lang)}</span>
        </div>
      </div>

      {/* Instant Quick Export Strip */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          disabled={downloading || !!invalid}
          onClick={() => quickDownload('png')}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-white shadow-sm hover:brightness-110 btn-tactile disabled:opacity-40"
        >
          <Download size={14} />
          <span>{t('preview.downloadPng', lang)}</span>
        </button>

        <button
          type="button"
          disabled={downloading || !!invalid}
          onClick={() => quickDownload('svg')}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-[var(--color-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] btn-tactile disabled:opacity-40"
        >
          <Sparkles size={14} className="text-[var(--color-accent)]" />
          <span>SVG</span>
        </button>

        <button
          type="button"
          disabled={!!invalid}
          onClick={quickCopy}
          title={t('preview.copyImage', lang)}
          className="flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2 sm:p-2.5 text-[var(--color-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] btn-tactile disabled:opacity-40"
        >
          {copied ? <Check size={16} className="text-[var(--color-success)]" /> : <Copy size={16} />}
        </button>
      </div>

      <ReadabilityIndicator config={config} lang={lang} />
    </div>
  );
}
