import { Panel, Row, VisualCardSelect, ColorField, ToggleSwitch, Slider, Segmented } from '../ui/controls.jsx';
import { t } from '@/lib/i18n/translations.js';

const DOT_OPTIONS = [
  {
    value: 'rounded',
    label: 'Rounded',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="6" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'dots',
    label: 'Dots',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <circle cx="14" cy="14" r="9" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'classy',
    label: 'Classy',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <path d="M5 14C5 9.02944 9.02944 5 14 5H23V14C23 18.9706 18.9706 23 14 23H5V14Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'classy-rounded',
    label: 'Classy Soft',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="8" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'square',
    label: 'Square',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="0" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'extra-rounded',
    label: 'Pill Round',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="10" fill="currentColor" />
      </svg>
    ),
  },
];

const EYE_FRAME_OPTIONS = [
  {
    value: 'rounded',
    label: 'Rounded',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    value: 'circle',
    label: 'Circle',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    value: 'square',
    label: 'Square',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="0" stroke="currentColor" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    value: 'extra-rounded',
    label: 'Squircle',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="8" stroke="currentColor" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    value: 'dots',
    label: 'Dotted',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    value: 'classy',
    label: 'Classy',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <path d="M4 14C4 8.47715 8.47715 4 14 4H24V14C24 19.5228 19.5228 24 14 24H4V14Z" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
  {
    value: 'classy-rounded',
    label: 'Classy Soft',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <path d="M4 12C4 7.58172 7.58172 4 12 4H20C22.2091 4 24 5.79086 24 8V16C24 20.4183 20.4183 24 16 24H8C5.79086 24 4 22.2091 4 20V12Z" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
];

const EYE_CENTER_OPTIONS = [
  {
    value: 'rounded',
    label: 'Rounded',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="7" y="7" width="14" height="14" rx="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'circle',
    label: 'Circle',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <circle cx="14" cy="14" r="7" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'square',
    label: 'Square',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="7" y="7" width="14" height="14" rx="0" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'dots',
    label: 'Dot',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <circle cx="14" cy="14" r="5" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'classy',
    label: 'Classy',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <path d="M7 14C7 10.134 10.134 7 14 7H21V14C21 17.866 17.866 21 14 21H7V14Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'classy-rounded',
    label: 'Classy Soft',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <path d="M7 12C7 9.23858 9.23858 7 12 7H18C19.6569 7 21 8.34315 21 10V16C21 18.7614 18.7614 21 16 21H10C8.34315 21 7 19.6569 7 18V12Z" fill="currentColor" />
      </svg>
    ),
  },
];

const SHAPE_OPTIONS = [
  {
    value: 'square',
    label: 'Square',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor" />
        <rect x="12" y="7" width="4" height="4" rx="1" fill="currentColor" />
        <rect x="7" y="12" width="4" height="4" rx="1" fill="currentColor" />
        <rect x="17" y="17" width="4" height="4" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'circle',
    label: 'Circle',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="8" width="3" height="3" rx="1" fill="currentColor" />
        <rect x="12.5" y="8" width="3" height="3" rx="1" fill="currentColor" />
        <rect x="8" y="12.5" width="3" height="3" rx="1" fill="currentColor" />
        <rect x="17" y="17" width="3" height="3" rx="1" fill="currentColor" />
      </svg>
    ),
  },
];

const EC_OPTIONS = [
  { value: 'L', label: 'L · 7%' },
  { value: 'M', label: 'M · 15%' },
  { value: 'Q', label: 'Q · 25%' },
  { value: 'H', label: 'H · 30%' },
];

export function StylePanel({ config, update, updateNow, lang = 'en' }) {
  const s = config.style;
  const set = (patch) => update({ style: { ...s, ...patch } });
  const setNow = (patch) => updateNow({ style: { ...s, ...patch } });
  const localizeOptions = (options, prefix) => options.map((option) => ({
    ...option,
    label: t(`${prefix}.${option.value}`, lang),
  }));

  return (
    <Panel title={t('panel.geometryStyle', lang)} badge={t('panel.parametric', lang)}>
      {/* QR Code Shape */}
      <Row label={t('panel.qrShape', lang)} hint={t('panel.overallSilhouette', lang)}>
        <VisualCardSelect
          ariaLabel={t('panel.qrShape', lang)}
          value={config.shape || 'square'}
          onChange={(shape) => updateNow({ shape })}
          options={localizeOptions(SHAPE_OPTIONS, 'shape')}
          cols="grid-cols-2"
        />
      </Row>

      <Row label={t('panel.moduleShape', lang)} hint={t('panel.matrixStyle', lang)}>
        <VisualCardSelect
          ariaLabel={t('panel.moduleShape', lang)}
          value={s.dots}
          onChange={(dots) => setNow({ dots })}
          options={localizeOptions(DOT_OPTIONS, 'shape')}
          cols="grid-cols-3 sm:grid-cols-3"
        />
      </Row>

      <Row label={t('panel.cornerFrame', lang)} hint={t('panel.finderBorder', lang)}>
        <VisualCardSelect
          ariaLabel={t('panel.cornerFrame', lang)}
          value={s.eyeFrame}
          onChange={(eyeFrame) => setNow({ eyeFrame })}
          options={localizeOptions(EYE_FRAME_OPTIONS, 'shape')}
          cols="grid-cols-3 sm:grid-cols-4"
        />
      </Row>

      <Row label={t('panel.cornerCenter', lang)} hint={t('panel.innerPupil', lang)}>
        <VisualCardSelect
          ariaLabel={t('panel.cornerCenter', lang)}
          value={s.eyeCenter}
          onChange={(eyeCenter) => setNow({ eyeCenter })}
          options={localizeOptions(EYE_CENTER_OPTIONS, 'shape')}
          cols="grid-cols-3"
        />
      </Row>

      {/* Spacing & Precision */}
      <div className="pt-3 border-t border-[var(--color-border-subtle)] space-y-4">
        <Row label={t('panel.quietZone', lang)} hint={`${config.margin ?? 0}px padding`}>
          <Slider
            ariaLabel={t('panel.quietZone', lang)}
            min={0}
            max={20}
            value={config.margin ?? 0}
            onChange={(margin) => update({ margin })}
            unit="px"
          />
        </Row>

        <Row label={t('panel.backgroundRadius', lang)} hint={`${config.bgRound ?? 0}px`}>
          <Slider
            ariaLabel={t('panel.backgroundRadius', lang)}
            min={0}
            max={50}
            value={config.bgRound ?? 0}
            onChange={(bgRound) => update({ bgRound })}
            unit="px"
          />
        </Row>

        <Row label={t('panel.errorCorrection', lang)} hint={t('panel.redundancy', lang)}>
          <Segmented
            ariaLabel={t('panel.errorCorrection', lang)}
            value={config.errorCorrection ?? 'M'}
            onChange={(errorCorrection) => updateNow({ errorCorrection })}
            options={EC_OPTIONS}
          />
        </Row>
      </div>

      {/* Eye Colors Section */}
      <div className="pt-3 border-t border-[var(--color-border-subtle)] space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-[var(--color-text)]">{t('panel.eyeAppearance', lang)}</span>
          <span className="rounded-md bg-[var(--color-accent-light)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--color-accent)]">
            {t('panel.finderPatterns', lang)}
          </span>
        </div>

        <Row label={t('panel.eyeFrameColor', lang)}>
          <ColorField
            label={t('panel.eyeFrameColor', lang)}
            value={s.eyeColor}
            onChange={(eyeColor) => set({ eyeColor, ...(s.singleEyeColor ? { eyeCenterColor: eyeColor } : {}) })}
          />
        </Row>

        <ToggleSwitch
          label={t('panel.matchEyeCenter', lang)}
          checked={s.singleEyeColor}
          onChange={(checked) => setNow({ singleEyeColor: checked, ...(checked ? { eyeCenterColor: s.eyeColor } : {}) })}
        />

        {!s.singleEyeColor && (
          <Row label={t('panel.eyeCenterColor', lang)}>
            <ColorField
              label={t('panel.eyeCenterColor', lang)}
              value={s.eyeCenterColor}
              onChange={(eyeCenterColor) => set({ eyeCenterColor })}
            />
          </Row>
        )}

        {/* Eye Frame Gradient */}
        <ToggleSwitch
          label={t('panel.eyeFrameGradient', lang)}
          checked={s.eyeFrameGradient ?? false}
          onChange={(checked) => setNow({ eyeFrameGradient: checked })}
        />

        {s.eyeFrameGradient && (
          <div className="space-y-3 pl-2 border-l-2 border-[var(--color-accent)]/40 pt-1">
            <Row label={t('panel.gradientStart', lang)}>
              <ColorField
                label={t('panel.gradientStart', lang)}
                value={s.eyeFrameGradStart ?? s.eyeColor}
                onChange={(eyeFrameGradStart) => set({ eyeFrameGradStart })}
              />
            </Row>
            <Row label={t('panel.gradientEnd', lang)}>
              <ColorField
                label={t('panel.gradientEnd', lang)}
                value={s.eyeFrameGradEnd ?? '#d4ad63'}
                onChange={(eyeFrameGradEnd) => set({ eyeFrameGradEnd })}
              />
            </Row>
          </div>
        )}

        {/* Eye Center Gradient */}
        <ToggleSwitch
          label={t('panel.eyeCenterGradient', lang)}
          checked={s.eyeCenterGradient ?? false}
          onChange={(checked) => setNow({ eyeCenterGradient: checked })}
        />

        {s.eyeCenterGradient && (
          <div className="space-y-3 pl-2 border-l-2 border-[var(--color-accent)]/40 pt-1">
            <Row label={t('panel.gradientStart', lang)}>
              <ColorField
                label={t('panel.gradientStart', lang)}
                value={s.eyeCenterGradStart ?? (s.singleEyeColor ? s.eyeColor : s.eyeCenterColor)}
                onChange={(eyeCenterGradStart) => set({ eyeCenterGradStart })}
              />
            </Row>
            <Row label={t('panel.gradientEnd', lang)}>
              <ColorField
                label={t('panel.gradientEnd', lang)}
                value={s.eyeCenterGradEnd ?? '#d4ad63'}
                onChange={(eyeCenterGradEnd) => set({ eyeCenterGradEnd })}
              />
            </Row>
          </div>
        )}
      </div>
    </Panel>
  );
}
