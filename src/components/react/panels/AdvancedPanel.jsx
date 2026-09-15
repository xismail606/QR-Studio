import { Panel, Row, Segmented, Slider } from '../ui/controls.jsx';
import { EC_LEVELS } from '@/types/qr.js';
import { t } from '@/lib/i18n/translations.js';

export function AdvancedPanel({ config, update, updateNow, lang = 'en' }) {
  return (
    <Panel title={t('panel.advanced', lang)}>
      <Row label={t('panel.errorCorrection', lang)}>
        <Segmented
          ariaLabel={t('panel.errorCorrection', lang)}
          value={config.errorCorrection}
          onChange={(errorCorrection) => updateNow({ errorCorrection })}
          options={EC_LEVELS.map((v) => ({ value: v, label: v }))}
        />
      </Row>
      <p className="font-mono text-[11px] text-[var(--color-text-secondary)]">
        {t('panel.errorCorrectionHelp', lang)}
      </p>
      {config.logo.enabled && config.errorCorrection !== 'H' && (
        <p className="font-mono text-[11px] text-[var(--color-warning)] font-medium">{t('panel.logoTip', lang)}</p>
      )}
      <Row label={`${t('panel.quietZone', lang)} (${config.margin} modules)`}>
        <Slider ariaLabel={t('panel.quietZone', lang)} min={4} max={12} value={config.margin} onChange={(margin) => update({ margin })} />
      </Row>
    </Panel>
  );
}

