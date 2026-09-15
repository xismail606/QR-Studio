import { CONTENT_TYPES, validateContent } from '@/lib/qr/contentTypes.js';
import { Panel, Row, Segmented, TextInput } from '../ui/controls.jsx';
import { localizeValidationError, t } from '@/lib/i18n/translations.js';

const MAX_LEN = 4000;

export function ContentPanel({ config, update, updateNow, lang = 'en' }) {
  const err = validateContent(config);
  const isText = config.content.type === 'text';
  return (
    <Panel title={t('panel.content', lang)}>
      <Row label={t('panel.qrType', lang)}>
        <Segmented
          ariaLabel={t('panel.qrType', lang)}
          value={config.content.type}
          onChange={(t) => updateNow({ content: { ...config.content, type: t } })}
          options={[
            { value: 'url', label: t('panel.url', lang) },
            { value: 'text', label: t('panel.text', lang) },
          ]}
        />
      </Row>
      <Row
        label={
          isText
            ? t('panel.enterText', lang, { count: config.content.value.length, max: MAX_LEN })
            : t('panel.enterUrl', lang)
        }
      >
        <TextInput
          ariaLabel={t('panel.content', lang)}
          multiline={isText}
          placeholder={isText && lang === 'ar' ? 'مرحبًا من استوديو QR…' : CONTENT_TYPES[config.content.type].placeholder}
          value={config.content.value}
          onChange={(v) => update({ content: { ...config.content, value: v } })}
        />
      </Row>
      {err && <p role="alert" className="font-mono text-[11px] font-medium text-[var(--color-danger)]">⚠ {localizeValidationError(err, lang)}</p>}
    </Panel>
  );
}
