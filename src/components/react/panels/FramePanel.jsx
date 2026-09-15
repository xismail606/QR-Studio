import { Panel, Row, VisualCardSelect, ColorField, Slider, TextInput } from '../ui/controls.jsx';
import { t } from '@/lib/i18n/translations.js';

const FRAME_OPTIONS = [
  {
    value: 'none',
    label: 'No Frame',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="2" />
        <line x1="7.5" y1="7.5" x2="20.5" y2="20.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    value: 'badge-bottom',
    label: 'Bottom Tag',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="4" y="2" width="20" height="24" rx="4" stroke="currentColor" strokeWidth="1.75" />
        <rect x="6.5" y="5" width="15" height="12" rx="1.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <rect x="6.5" y="19.5" width="15" height="4.5" rx="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'arrow-cursive',
    label: 'Handwritten Arrow',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="7" y="3" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M4 22 C 3 13, 9 10, 13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 10 L 13 13 L 9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="14" y="24" fontSize="6.5" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold" fill="currentColor">scan</text>
      </svg>
    ),
  },
  {
    value: 'cursive',
    label: 'Cursive Script',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="6" y="3" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.25" strokeDasharray="2 2" />
        <text x="14" y="24" fontSize="7" fontFamily="sans-serif" fontStyle="italic" fontWeight="bold" textAnchor="middle" fill="currentColor">Scan me</text>
      </svg>
    ),
  },
  {
    value: 'envelope',
    label: 'Card Pocket',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="5" y="3" width="18" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 16 L 14 20 L 23 16" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8" y="19" width="12" height="4" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'camera-pill',
    label: 'Camera Lens',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="4" y="2" width="20" height="24" rx="4" stroke="currentColor" strokeWidth="1.75" />
        <rect x="6" y="19" width="16" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="9" cy="21.5" r="1.25" fill="currentColor" />
        <line x1="12" y1="21.5" x2="19" y2="21.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 'tooltip-pointer',
    label: 'Tooltip Pointer',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="4" y="2" width="20" height="17" rx="3" stroke="currentColor" strokeWidth="1.75" />
        <polygon points="14,19 11,21.5 17,21.5" fill="currentColor" />
        <rect x="6" y="21.5" width="16" height="4.5" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'speech-bubble',
    label: 'Speech Balloon',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="7" y="2" width="14" height="4" rx="1" fill="currentColor" />
        <rect x="4" y="6" width="20" height="17" rx="3" stroke="currentColor" strokeWidth="1.75" />
        <polygon points="5,23 3,27 9,23" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'phone',
    label: 'Smartphone',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="5" y="2" width="18" height="24" rx="4" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="14" cy="4.5" r="0.75" fill="currentColor" />
        <rect x="7" y="20.5" width="14" height="4" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'chef-hat',
    label: 'Chef Menu',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <path d="M10 8c-1.5-1.5-1.5-3.5 0-4.5 1-1 3.5 0 4-1 0.5-1 3-1 3.5 0 0.5 1 3 0 4 1 1.5 1 1.5 3 0 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="5" y="8" width="18" height="17" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7" y="20" width="14" height="4" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'delivery-scooter',
    label: 'Delivery Courier',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="6" y="2" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="21" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 22h7l2-4h3l1.5 2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    value: 'coffee-cup',
    label: 'Coffee Mug',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <path d="M10 3c0-1 1-1.5 1-2M14 3c0-1 1-1.5 1-2M18 3c0-1 1-1.5 1-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="5" y="4" width="15" height="19" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 9c2.5 0 3.5 1 3.5 3s-1 3-3.5 3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7" y="18.5" width="11" height="3.5" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'gift-box',
    label: 'Gift Voucher',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <path d="M14 6c-2-3-6-3-6 0s4 3 6 0zm0 0c2-3 6-3 6 0s-4 3-6 0z" stroke="currentColor" strokeWidth="1.25" fill="currentColor" fillOpacity="0.2" />
        <rect x="5" y="6" width="18" height="19" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7" y="20.5" width="14" height="3.5" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'shopping-bag',
    label: 'Retail Bag',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <path d="M10 7V4a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="5" y="7" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7" y="20.5" width="14" height="3.5" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'coffee-takeout',
    label: 'Takeout Bag',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="7" y="4" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="7" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="1.25" strokeDasharray="1.5 1.5" />
        <rect x="9" y="17.5" width="10" height="3.5" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'energy-burst',
    label: 'Energy Rays',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="6" y="4" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="2" y1="4" x2="5" y2="6" stroke="currentColor" strokeWidth="1.5" />
        <line x1="2" y1="8" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" />
        <line x1="26" y1="4" x2="23" y2="6" stroke="currentColor" strokeWidth="1.5" />
        <line x1="26" y1="8" x2="23" y2="9" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8" y="17.5" width="12" height="3.5" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'ribbon',
    label: 'Pedestal Banner',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="5" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 22 h20 l-2 2.5 l2 2.5 H4 l2 -2.5 Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: 'simple',
    label: 'Minimal Border',
    icon: (
      <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

// Older presets used these names. Keep their visual output, but show the
// closest current option as selected so the control never appears empty.
const LEGACY_FRAME_ALIASES = {
  rounded: 'badge-bottom',
  modern: 'badge-bottom',
  badge: 'badge-bottom',
  'scan-me': 'badge-bottom',
  'bottom-label': 'badge-bottom',
  'top-label': 'simple',
};

export function FramePanel({ config, update, updateNow, lang = 'en' }) {
  const f = config.frame;
  const set = (patch) => update({ frame: { ...f, ...patch } });
  const setNow = (patch) => updateNow({ frame: { ...f, ...patch } });
  const localizedFrames = FRAME_OPTIONS.map((option) => ({
    ...option,
    label: t(`frame.${option.value}`, lang),
  }));

  return (
    <Panel title={t('panel.framing', lang)} badge={t('panel.curated', lang)}>
      <Row label={t('panel.frameStyle', lang)} hint={t('panel.frameArchitecture', lang)}>
        <VisualCardSelect
          ariaLabel={t('panel.frameStyle', lang)}
          value={LEGACY_FRAME_ALIASES[f.type] ?? f.type}
          onChange={(type) => {
            const defaultText =
              type === 'chef-hat' ? t('preview.viewMenu', lang) :
              type === 'coffee-cup' ? t('preview.orderCoffee', lang) :
              type === 'delivery-scooter' ? t('preview.trackOrder', lang) :
              type === 'gift-box' ? t('preview.claimGift', lang) :
              type === 'shopping-bag' ? t('preview.shopNow', lang) :
              type === 'coffee-takeout' ? t('preview.scanToOrder', lang) :
              type === 'arrow-cursive' || type === 'cursive' ? t('preview.scanMeTitle', lang) :
              f.text || t('preview.scanMe', lang);
            const patch = { type, text: defaultText };
            if (type !== 'none' && type !== 'arrow-cursive' && type !== 'cursive') {
              patch.borderWidth = f.borderWidth > 0 ? f.borderWidth : 2;
            }
            setNow(patch);
          }}
          options={localizedFrames}
          cols="grid-cols-3 sm:grid-cols-3 xl:grid-cols-4"
        />
      </Row>

      {f.type !== 'none' && (
        <div className="space-y-4 pt-3 border-t border-[var(--color-border-subtle)]">
          <Row label={t('panel.calloutText', lang)} hint={t('panel.frameTextHint', lang)}>
            <TextInput
              ariaLabel={t('panel.calloutText', lang)}
              value={f.text ?? ''}
              placeholder={t('preview.scanMe', lang)}
              onChange={(text) => set({ text })}
            />
          </Row>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Row label={t('panel.frameAccent', lang)}>
              <ColorField
                label={t('panel.frameAccent', lang)}
                value={f.color}
                onChange={(color) => set({ color })}
              />
            </Row>

            <Row label={t('panel.frameBackground', lang)}>
              <ColorField
                label={t('panel.frameBackground', lang)}
                value={f.background}
                onChange={(background) => set({ background })}
              />
            </Row>
          </div>

          <Row label={t('panel.framePadding', lang)} hint={`${f.padding}px`}>
          <Slider
              ariaLabel={t('panel.framePadding', lang)}
              min={8}
              max={40}
              value={f.padding}
              onChange={(padding) => set({ padding })}
              unit="px"
            />
          </Row>

          <Row label={t('panel.cornerRadius', lang)} hint={`${f.radius}px`}>
          <Slider
              ariaLabel={t('panel.cornerRadius', lang)}
              min={0}
              max={48}
              value={f.radius}
              onChange={(radius) => set({ radius })}
              unit="px"
            />
          </Row>

          <Row label={t('panel.borderWidth', lang)} hint={`${f.borderWidth || 0}px`}>
          <Slider
              ariaLabel={t('panel.borderWidth', lang)}
              min={0}
              max={8}
              value={f.borderWidth || 0}
              onChange={(borderWidth) => set({ borderWidth })}
              unit="px"
            />
          </Row>
        </div>
      )}
    </Panel>
  );
}
