import { Panel, Row, Segmented, ColorField, Slider, TextInput } from '../ui/controls.jsx';
import { t } from '@/lib/i18n/translations.js';

export function TextPanel({ config, update, updateNow, lang = 'en' }) {
  const textConfig = config.text;
  const set = (patch) => update({ text: { ...textConfig, ...patch } });
  const setNow = (patch) => updateNow({ text: { ...textConfig, ...patch } });
  return (
    <Panel title={t('panel.textFraming', lang)}>
      <label className="flex items-center gap-2 text-xs font-medium text-[var(--color-text)] cursor-pointer">
        <input 
          type="checkbox" 
        checked={textConfig.enabled}
          onChange={(e) => setNow({ enabled: e.target.checked })} 
          className="rounded border-[var(--color-border)] accent-[var(--color-accent)]"
        />
        {t('panel.enableLabels', lang)}
      </label>
      {textConfig.enabled && (
        <>
          <Row label={t('panel.topText', lang)}>
            <TextInput ariaLabel={t('panel.topText', lang)} value={textConfig.top ?? ''} placeholder={t('preview.scanMeTitle', lang)} onChange={(top) => set({ top })} />
          </Row>
          <Row label={t('panel.bottomText', lang)}>
            <TextInput ariaLabel={t('panel.bottomText', lang)} value={textConfig.bottom ?? ''} placeholder={lang === 'ar' ? 'زر موقعنا' : 'Visit Our Website'} onChange={(bottom) => set({ bottom })} />
          </Row>
          <Row label={t('panel.fontSize', lang, { pixels: textConfig.size })}>
            <Slider ariaLabel={t('panel.fontSize', lang, { pixels: textConfig.size })} min={10} max={48} value={textConfig.size} onChange={(size) => set({ size })} />
          </Row>
          <Row label={t('panel.alignment', lang)}>
            <Segmented ariaLabel={t('panel.alignment', lang)} value={textConfig.align} onChange={(align) => setNow({ align })} options={[
              { value: 'left', label: t('align.left', lang) },
              { value: 'center', label: t('align.center', lang) },
              { value: 'right', label: t('align.right', lang) },
            ]} />
          </Row>
          <Row label={t('panel.textColor', lang)}>
            <ColorField label={t('panel.textColor', lang)} value={textConfig.color} onChange={(color) => set({ color })} />
          </Row>
        </>
      )}
    </Panel>
  );
}

