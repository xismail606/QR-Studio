import { Panel, Row, VisualCardSelect, ColorField, ToggleSwitch } from '../ui/controls.jsx';
import { t } from '@/lib/i18n/translations.js';

const DESIGNER_PALETTES = [
  {
    name: 'Cyber Neon',
    fg: '#22d3ee',
    bg: '#05070f',
    gradient: true,
    start: '#22d3ee',
    end: '#a78bfa',
    dir: 'diagonal',
  },
  {
    name: 'Electric Indigo',
    fg: '#6366f1',
    bg: '#07080c',
    gradient: true,
    start: '#6366f1',
    end: '#818cf8',
    dir: 'diagonal',
  },
  {
    name: 'Emerald Matrix',
    fg: '#10b981',
    bg: '#05130e',
    gradient: true,
    start: '#10b981',
    end: '#34d399',
    dir: 'diagonal',
  },
  {
    name: 'Sunset Pulse',
    fg: '#f43f5e',
    bg: '#0d0814',
    gradient: true,
    start: '#f43f5e',
    end: '#a855f7',
    dir: 'horizontal',
  },
  {
    name: 'Luxury Gold',
    fg: '#c9a227',
    bg: '#14120e',
    gradient: true,
    start: '#fbbf24',
    end: '#b45309',
    dir: 'diagonal',
  },
  {
    name: 'Royal Sapphire',
    fg: '#3b82f6',
    bg: '#080d1a',
    gradient: true,
    start: '#38bdf8',
    end: '#6366f1',
    dir: 'horizontal',
  },
  {
    name: 'Obsidian Dark',
    fg: '#f8fafc',
    bg: '#090a0f',
    gradient: false,
    start: '#f8fafc',
    end: '#f8fafc',
    dir: 'horizontal',
  },
  {
    name: 'Print Minimal',
    fg: '#090a0f',
    bg: '#ffffff',
    gradient: false,
    start: '#090a0f',
    end: '#090a0f',
    dir: 'horizontal',
  },
];

const GRADIENT_DIRECTIONS = [
  {
    value: 'horizontal',
    label: 'Horizontal',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    ),
  },
  {
    value: 'vertical',
    label: 'Vertical',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" />
      </svg>
    ),
  },
  {
    value: 'diagonal',
    label: 'Diagonal',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l10-10M17 7H9m8 0v8" />
      </svg>
    ),
  },
  {
    value: 'radial',
    label: 'Radial',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
];

export function ColorPanel({ config, update, updateNow, lang = 'en' }) {
  const c = config.colors;
  const set = (patch) => update({ colors: { ...c, ...patch } });
  const setNow = (patch) => updateNow({ colors: { ...c, ...patch } });

  function applyPalette(p) {
    updateNow({
      colors: {
        ...c,
        foreground: p.fg,
        background: p.bg,
        gradientEnabled: p.gradient,
        gradientStart: p.start,
        gradientEnd: p.end,
        gradientDir: p.dir,
      },
    });
  }

  function invertColors() {
    if (c.background === 'transparent') return;
    const oldFg = c.foreground;
    const oldBg = c.background;
    updateNow({
      colors: {
        ...c,
        foreground: oldBg,
        background: oldFg,
        gradientStart: oldBg,
        gradientEnd: oldBg,
      },
    });
  }

  const isTransparent = c.background === 'transparent';
  const paletteKeys = {
    'Cyber Neon': 'palette.cyber',
    'Electric Indigo': 'palette.indigo',
    'Emerald Matrix': 'palette.emerald',
    'Sunset Pulse': 'palette.sunset',
    'Luxury Gold': 'palette.gold',
    'Royal Sapphire': 'palette.sapphire',
    'Obsidian Dark': 'palette.obsidian',
    'Print Minimal': 'palette.print',
  };
  const directions = GRADIENT_DIRECTIONS.map((option) => ({
    ...option,
    label: t(`direction.${option.value}`, lang),
  }));

  return (
    <Panel title={t('panel.colorways', lang)} badge={t('panel.isoVerified', lang)}>
      {/* Curated Quick Palettes */}
      <Row label={t('panel.designerPalettes', lang)} hint={t('panel.oneClickTheme', lang)}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DESIGNER_PALETTES.map((p) => {
            const isMatch = c.foreground === p.fg && c.background === p.bg;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPalette(p)}
                className={`flex items-center gap-2 p-2 rounded-xl border transition-all text-left btn-tactile ${
                  isMatch
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]/40 ring-1 ring-[var(--color-accent)]'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-panel)] hover:border-[var(--color-border-highlight)] hover:bg-[var(--color-bg-hover)]'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-lg border border-black/20 shrink-0 shadow-sm"
                  style={{
                    background: p.gradient
                      ? `linear-gradient(135deg, ${p.start}, ${p.end})`
                      : p.fg,
                  }}
                />
                <span className="font-mono text-[10.5px] font-medium text-[var(--color-text)] truncate">
                  {t(paletteKeys[p.name], lang)}
                </span>
              </button>
            );
          })}
        </div>
      </Row>

      {/* Main Colors */}
      <div className="pt-2 border-t border-[var(--color-border-subtle)] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">{t('panel.customBaseColors', lang)}</span>
          <button
            type="button"
            onClick={invertColors}
            disabled={isTransparent}
            className="font-mono text-[11px] text-[var(--color-accent)] hover:underline disabled:opacity-30 disabled:no-underline btn-tactile"
          >
            {t('panel.invertColors', lang)}
          </button>
        </div>

        <Row label={t('panel.qrModuleColor', lang)}>
          <ColorField
            label={t('panel.qrModuleColor', lang)}
            value={c.foreground}
            onChange={(foreground) => set({ foreground })}
          />
        </Row>

        <Row label={t('panel.backgroundCanvas', lang)}>
          <div className="space-y-2">
            <ColorField
              label={t('panel.backgroundCanvas', lang)}
              value={isTransparent ? '#ffffff' : c.background}
              onChange={(background) => set({ background })}
            />
            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-[11px] text-[var(--color-text-muted)]">{t('panel.transparentBackground', lang)}</span>
              <button
                type="button"
                onClick={() => setNow({ background: isTransparent ? '#ffffff' : 'transparent' })}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium border transition-colors btn-tactile ${
                  isTransparent
                    ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                    : 'bg-[var(--color-bg-panel)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-[var(--color-text)]'
                }`}
              >
                {isTransparent ? t('panel.transparent', lang) : t('panel.makeTransparent', lang)}
              </button>
            </div>
          </div>
        </Row>
      </div>

      {/* Module Gradient */}
      <div className="pt-3 border-t border-[var(--color-border-subtle)] space-y-4">
        <ToggleSwitch
          label={t('panel.enableGradient', lang)}
          checked={c.gradientEnabled}
          onChange={(checked) => setNow({ gradientEnabled: checked })}
        />

        {c.gradientEnabled && (
          <div className="space-y-4 pl-2 border-l-2 border-[var(--color-accent)]/40 mt-3 pt-1">
            <Row label={t('panel.gradientStartColor', lang)}>
              <ColorField
                label={t('panel.gradientStartColor', lang)}
                value={c.gradientStart}
                onChange={(gradientStart) => set({ gradientStart })}
              />
            </Row>

            <Row label={t('panel.gradientEndColor', lang)}>
              <ColorField
                label={t('panel.gradientEndColor', lang)}
                value={c.gradientEnd}
                onChange={(gradientEnd) => set({ gradientEnd })}
              />
            </Row>

            <Row label={t('panel.gradientDirection', lang)}>
              <VisualCardSelect
                ariaLabel={t('panel.gradientDirection', lang)}
                value={c.gradientDir}
                onChange={(gradientDir) => setNow({ gradientDir })}
                options={directions}
                cols="grid-cols-2 sm:grid-cols-4"
              />
            </Row>
          </div>
        )}
      </div>
    </Panel>
  );
}
