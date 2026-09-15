import { getReadability } from '@/lib/qr/readability.js';
import { localizeAuditIssue, t } from '@/lib/i18n/translations.js';

const BADGE_CONFIG = {
  excellent: { color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10', bar: 'bg-[var(--color-success)]', labelKey: 'readability.excellent' },
  good: { color: 'text-[var(--color-info)]', bg: 'bg-[var(--color-info)]/10', bar: 'bg-[var(--color-info)]', labelKey: 'readability.good' },
  warning: { color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning)]/10', bar: 'bg-[var(--color-warning)]', labelKey: 'readability.warning' },
  poor: { color: 'text-[var(--color-danger)]', bg: 'bg-[var(--color-danger)]/10', bar: 'bg-[var(--color-danger)]', labelKey: 'readability.poor' },
};

export function ReadabilityIndicator({ config, lang = 'en' }) {
  const report = getReadability(config);
  const cfg = BADGE_CONFIG[report.level] || BADGE_CONFIG.good;
  
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 shadow-card transition-all">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.bar}`} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
            {t('readability.index', lang)}
          </span>
        </div>
        <div className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${cfg.bg} ${cfg.color}`}>
          {t(`readability.level.${report.level}`, lang)} · {report.score}%
        </div>
      </div>

      {/* Scannability Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-panel)] border border-[var(--color-border-subtle)]">
        <div
          className={`h-full rounded-full transition-all duration-300 ${cfg.bar}`}
          style={{ width: `${Math.max(8, report.score)}%` }}
        />
      </div>

      {report.issues.length > 0 && (
        <div className="mt-3 space-y-1.5 pt-2.5 border-t border-[var(--color-border-subtle)]">
          {report.issues.slice(0, 2).map((issue) => {
            const i = localizeAuditIssue(issue, lang);
            return (
            <p key={i.code} className="font-mono text-[11px] text-[var(--color-text-secondary)] flex items-start gap-1.5">
              <span className="text-[var(--color-warning)] shrink-0">⚠</span>
              <span>{i.message} {i.fix && <span className="text-[var(--color-accent)] font-medium">({i.fix})</span>}</span>
            </p>
            );
          })}
        </div>
      )}
    </div>
  );
}
