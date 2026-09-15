import { useState, useEffect } from 'react';
import { getInitialLang, setLanguage, t } from '../../../lib/i18n/translations.js';

export function LanguageToggle() {
  const [lang, setLang] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = getInitialLang();
    setLang(initial);
    document.documentElement.setAttribute('lang', initial);
    document.documentElement.setAttribute('dir', initial === 'ar' ? 'rtl' : 'ltr');

    const handleLangChange = (e) => {
      if (e.detail?.lang) {
        setLang(e.detail.lang);
      }
    };
    window.addEventListener('languagechange', handleLangChange);
    return () => window.removeEventListener('languagechange', handleLangChange);
  }, []);

  const toggle = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    setLanguage(nextLang);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-hover)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] opacity-60"
        disabled
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
        </svg>
        <span className="font-mono text-[11px] font-semibold">AR</span>
      </button>
    );
  }

  const isArabic = lang === 'ar';

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent)] px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[var(--color-text)] transition-all duration-200 active:scale-95 shadow-sm group"
      aria-label={isArabic ? t('nav.switchToEnglish', lang) : t('nav.switchToArabic', lang)}
      title={isArabic ? t('nav.switchToEnglish', lang) : t('nav.switchToArabic', lang)}
    >
      <svg
        className="w-3.5 h-3.5 text-[var(--color-accent)] transition-transform group-hover:rotate-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
      </svg>
      <span className="font-mono text-[11px] font-bold tracking-wide">
        {isArabic ? 'EN' : 'العربية'}
      </span>
    </button>
  );
}
