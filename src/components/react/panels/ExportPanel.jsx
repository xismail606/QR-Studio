import { useState } from 'react';
import { Download, FileImage, Sparkles, Layers } from 'lucide-react';
import { Panel, Row, VisualCardSelect } from '../ui/controls.jsx';
import { downloadQR } from '@/lib/export/exporter.js';
import { validateContent } from '@/lib/qr/contentTypes.js';
import { localizeValidationError, t } from '@/lib/i18n/translations.js';

const FORMAT_OPTIONS = [
  {
    value: 'png',
    label: 'PNG',
    description: 'Lossless alpha raster',
    icon: <FileImage size={20} />,
  },
  {
    value: 'svg',
    label: 'SVG',
    description: 'Infinite vector scale',
    icon: <Sparkles size={20} />,
  },
  {
    value: 'webp',
    label: 'WEBP',
    description: 'Lightweight web format',
    icon: <Layers size={20} />,
  },
  {
    value: 'jpg',
    label: 'JPG',
    description: 'Flattened print proof',
    icon: <FileImage size={20} />,
  },
];

const SIZE_OPTIONS = [
  {
    value: '512',
    label: '512 × 512',
    description: 'Web & Mobile',
  },
  {
    value: '1024',
    label: '1024 × 1024',
    description: 'High DPI & Docs',
  },
  {
    value: '2048',
    label: '2048 × 2048 (4K)',
    description: 'Signage & Billboards',
  },
];

export function ExportPanel({ config, notify, lang = 'en' }) {
  const [format, setFormat] = useState('png');
  const [size, setSize] = useState(1024);
  const [busy, setBusy] = useState(false);
  const invalid = validateContent(config);

  async function onDownload() {
    if (invalid) {
      notify?.(lang === 'ar' ? 'أدخل محتوى صحيحًا قبل التصدير.' : 'Add valid content before exporting.', 'error');
      return;
    }
    setBusy(true);
    try {
      await downloadQR(config, { format, size, quality: 0.92, fileName: 'qr-studio' });
      notify?.(lang === 'ar' ? `تم تنزيل رمز QR بصيغة ${format.toUpperCase()}` : `Downloaded QR code as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : t('toast.exportFailed', lang);
      notify?.(localizeValidationError(message, lang), 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel title={t('panel.productionExport', lang)} badge={t('panel.vectorRaster', lang)}>
      <Row label={t('panel.exportFormat', lang)} hint={t('panel.chooseDeliverable', lang)}>
        <VisualCardSelect
          ariaLabel={t('panel.exportFormat', lang)}
          value={format}
          onChange={setFormat}
          options={FORMAT_OPTIONS.map((option) => ({ ...option, description: t(`format.${option.value}Desc`, lang) }))}
          cols="grid-cols-2 sm:grid-cols-4"
        />
      </Row>

      {format !== 'svg' && (
        <Row label={t('panel.rasterResolution', lang)} hint={t('panel.outputDensity', lang)}>
          <VisualCardSelect
            ariaLabel={t('panel.rasterResolution', lang)}
            value={String(size)}
            onChange={(v) => setSize(Number(v))}
            options={SIZE_OPTIONS.map((option) => ({
              ...option,
              description: t(`size.${option.value === '512' ? 'web' : option.value === '1024' ? 'docs' : 'signage'}`, lang),
            }))}
            cols="grid-cols-1 sm:grid-cols-3"
          />
        </Row>
      )}

      {format === 'svg' && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] p-3.5 font-mono text-[11px] text-[var(--color-text-secondary)]">
          <span className="text-[var(--color-accent)] font-semibold">{t('panel.vectorMode', lang)}</span> {t('panel.vectorModeHelp', lang)}
        </div>
      )}

      <button
        type="button"
        disabled={busy || !!invalid}
        onClick={onDownload}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--color-accent)] px-6 py-3.5 text-sm font-semibold text-white shadow-cta hover:brightness-110 btn-tactile disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Download size={17} />
        <span>{busy ? t('panel.compiling', lang) : t('panel.download', lang, { format: format.toUpperCase(), suffix: format !== 'svg' ? `(${size}px)` : (lang === 'ar' ? 'فيكتور' : 'Vector') })}</span>
      </button>
    </Panel>
  );
}

