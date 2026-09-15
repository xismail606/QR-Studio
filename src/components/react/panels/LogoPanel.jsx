import { useState } from 'react';
import { Panel, Row, Slider } from '../ui/controls.jsx';
import { validateLogoFile, fileToDataUrl, downscaleDataUrl } from '@/lib/qr/validation.js';
import { localizeValidationError, t } from '@/lib/i18n/translations.js';

export function LogoPanel({ config, update, updateNow, notify, lang = 'en' }) {
  const logo = config.logo;
  const set = (patch) => update({ logo: { ...logo, ...patch } });
  const [error, setError] = useState('');

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const err = validateLogoFile(file);
    if (err) {
      const localized = localizeValidationError(err, lang);
      setError(localized);
      notify?.(localized, 'error');
      return;
    }
    setError('');
    try {
      const raw = await fileToDataUrl(file);
      const small = await downscaleDataUrl(raw);
      updateNow({ logo: { ...logo, enabled: true, dataUrl: small } });
      notify?.(lang === 'ar' ? 'تم رفع الشعار' : 'Logo uploaded', 'success');
    } catch {
      setError(localizeValidationError('Could not read image file.', lang));
    }
  }

  function remove() {
    updateNow({ logo: { ...logo, enabled: false, dataUrl: '' } });
  }

  if (!logo.enabled) {
    return (
      <Panel title={t('panel.brandLogo', lang)}>
        <label className="flex flex-col items-center justify-center cursor-pointer rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-panel)]/40 hover:bg-[var(--color-bg-card)] px-4 py-8 text-center transition-all hover:border-[var(--color-accent)] group">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-hover)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] mb-3 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          </div>
          <span className="text-xs font-semibold text-[var(--color-text)] mb-1">{t('panel.uploadLogo', lang)}</span>
          <span className="font-mono text-[11px] text-[var(--color-text-muted)]">{t('panel.logoTypes', lang)}</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFile} />
        </label>
        {error && <p role="alert" className="mt-3 font-mono text-[11px] font-medium text-[var(--color-danger)]">{error}</p>}
      </Panel>
    );
  }

  return (
      <Panel title={t('panel.brandLogo', lang)}>
      <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)]">
        <div className="flex items-center gap-3">
          {logo.dataUrl && <img src={logo.dataUrl} alt="QR logo" className="h-10 w-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] object-contain p-1" />}
          <span className="font-mono text-xs text-[var(--color-text)]">{t('panel.activeLogo', lang)}</span>
        </div>
        <button type="button" onClick={remove} className="font-mono text-[11px] text-[var(--color-danger)] hover:underline">
          {t('panel.remove', lang)}
        </button>
      </div>
      <Row label={t('panel.logoScale', lang, { percent: Math.round(logo.size * 100) })}>
        <Slider ariaLabel={t('panel.logoScale', lang, { percent: Math.round(logo.size * 100) })} min={5} max={35} value={Math.round(logo.size * 100)} onChange={(v) => set({ size: v / 100 })} />
      </Row>
      {logo.size > 0.25 && <p className="font-mono text-[11px] text-[var(--color-warning)]">⚠ {t('panel.logoWarning', lang)}</p>}
      <Row label={t('panel.logoPadding', lang, { pixels: logo.padding })}>
        <Slider ariaLabel={t('panel.logoPadding', lang, { pixels: logo.padding })} min={0} max={32} value={logo.padding} onChange={(padding) => set({ padding })} />
      </Row>
      {error && <p role="alert" className="font-mono text-[11px] text-[var(--color-danger)]">{error}</p>}
    </Panel>
  );
}
