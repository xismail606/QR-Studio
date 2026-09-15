import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  Sparkles, 
  Save, 
  Share2, 
  Copy, 
  Check, 
  FileText, 
  Shapes, 
  Palette, 
  Box, 
  Image as ImageIcon, 
  Type, 
  Sliders, 
  Download,
  Trash2,
  Bookmark,
  RotateCcw,
  SlidersHorizontal,
  Eye,
  Layers
} from 'lucide-react';
import { useQRConfig } from '@/hooks/useQRConfig.js';
import { QRPreview } from './QRPreview.jsx';
import { ContentPanel } from '../panels/ContentPanel.jsx';
import { StylePanel } from '../panels/StylePanel.jsx';
import { ColorPanel } from '../panels/ColorPanel.jsx';
import { LogoPanel } from '../panels/LogoPanel.jsx';
import { FramePanel } from '../panels/FramePanel.jsx';
import { TextPanel } from '../panels/TextPanel.jsx';
import { AdvancedPanel } from '../panels/AdvancedPanel.jsx';
import { ExportPanel } from '../panels/ExportPanel.jsx';
import { PRESETS } from '@/lib/presets/presets.js';
import { copyConfigJson, copyQRImage, shareQR } from '@/lib/export/exporter.js';
import { listDesigns, saveDesign, deleteDesign } from '@/lib/storage/savedDesigns.js';
import { getInitialLang, localizeValidationError, t } from '@/lib/i18n/translations.js';

const TAB_DEFS = [
  { id: 'Content', key: 'tab.content', defaultLabel: 'Content', icon: FileText },
  { id: 'Style', key: 'tab.style', defaultLabel: 'Style', icon: Shapes },
  { id: 'Colors', key: 'tab.colors', defaultLabel: 'Colors', icon: Palette },
  { id: 'Frame', key: 'tab.frame', defaultLabel: 'Frame', icon: Box },
  { id: 'Logo', key: 'tab.logo', defaultLabel: 'Logo', icon: ImageIcon },
  { id: 'Text', key: 'tab.text', defaultLabel: 'Text', icon: Type },
  { id: 'Advanced', key: 'tab.advanced', defaultLabel: 'Advanced', icon: Sliders },
  { id: 'Export', key: 'tab.export', defaultLabel: 'Export', icon: Download },
];

export function QREditor() {
  const qr = useQRConfig();
  const { config } = qr;
  const [tab, setTab] = useState('Content');
  const [lang, setLang] = useState(getInitialLang());
  const [mobileView, setMobileView] = useState('both'); // 'both' | 'controls' | 'preview'
  const [toasts, setToasts] = useState([]);
  const [designs, setDesigns] = useState(() => listDesigns());
  const [designName, setDesignName] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const presetApplied = useRef(false);

  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail?.lang) {
        setLang(e.detail.lang);
      }
    };
    window.addEventListener('languagechange', handleLangChange);
    return () => window.removeEventListener('languagechange', handleLangChange);
  }, []);

  const notify = useCallback((message, kind = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // Templates link here as /generator?preset=<id> : apply once on mount.
  useEffect(() => {
    if (presetApplied.current) return;
    presetApplied.current = true;
    const id = new URLSearchParams(window.location.search).get('preset');
    if (id && PRESETS.some((p) => p.id === id)) {
      qr.applyPresetById(id);
      notify(t('toast.loadedPreset', lang, { name: id }), 'success');
    }
  }, [lang, notify, qr.applyPresetById]);

  const panels = useMemo(
    () => ({
      Content: <ContentPanel config={config} update={qr.update} updateNow={qr.updateNow} lang={lang} />,
      Style: <StylePanel config={config} update={qr.update} updateNow={qr.updateNow} lang={lang} />,
      Colors: <ColorPanel config={config} update={qr.update} updateNow={qr.updateNow} lang={lang} />,
      Logo: <LogoPanel config={config} update={qr.update} updateNow={qr.updateNow} notify={notify} lang={lang} />,
      Frame: <FramePanel config={config} update={qr.update} updateNow={qr.updateNow} lang={lang} />,
      Text: <TextPanel config={config} update={qr.update} updateNow={qr.updateNow} lang={lang} />,
      Advanced: <AdvancedPanel config={config} update={qr.update} updateNow={qr.updateNow} lang={lang} />,
      Export: <ExportPanel config={config} notify={notify} lang={lang} />,
    }),
    [config, lang, notify, qr.update, qr.updateNow]
  );

  async function onCopyImage() {
    try {
      await copyQRImage(config);
      notify(t('toast.imageCopied', lang));
    } catch {
      notify(t('toast.copyFailed', lang), 'error');
    }
  }

  async function onCopyConfig() {
    try {
      await copyConfigJson(config);
      notify(t('toast.configCopied', lang));
    } catch {
      notify(t('toast.copyFailed', lang), 'error');
    }
  }

  async function onShare() {
    try {
      const res = await shareQR(config);
      notify(res === 'shared' ? t('toast.shared', lang) : t('toast.shareReady', lang));
    } catch {
      notify(t('toast.shareUnsupported', lang), 'error');
    }
  }

  function onSave() {
    try {
      saveDesign(designName || `Design ${designs.length + 1}`, config);
      setDesigns(listDesigns());
      setDesignName('');
      setShowSaved(true);
      notify(t('toast.saved', lang));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('toast.saveFailed', lang);
      notify(localizeValidationError(message, lang), 'error');
    }
  }

  function handleReset() {
    qr.reset();
    setTab('Content');
    setMobileView('both');
    notify(t('toast.reset', lang), 'success');
  }

  return (
    <div className="mx-auto w-full max-w-[1360px] pb-24 overflow-x-hidden">
      {/* Studio Top Control Deck */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-2.5 sm:gap-3 p-2 sm:p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-card backdrop-blur-md">
        {/* History, Randomize & Reset */}
        <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-1.5 overflow-x-auto py-0.5 -mx-0.5 px-0.5">
          <div className="flex items-center gap-1">
            <button 
              type="button" 
              onClick={qr.undo} 
              disabled={!qr.canUndo} 
              aria-label={t('action.undo', lang)}
              title={`${t('action.undo', lang)} (Ctrl+Z)`}
              className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-2.5 py-1.5 sm:py-2 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-hover)] disabled:opacity-30 btn-tactile"
            >
              <Undo2 size={13} /> <span className="hidden md:inline">{t('action.undo', lang)}</span>
            </button>
            <button 
              type="button" 
              onClick={qr.redo} 
              disabled={!qr.canRedo} 
              aria-label={t('action.redo', lang)}
              title={`${t('action.redo', lang)} (Ctrl+Y)`}
              className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-2.5 py-1.5 sm:py-2 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-hover)] disabled:opacity-30 btn-tactile"
            >
              <Redo2 size={13} /> <span className="hidden md:inline">{t('action.redo', lang)}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button 
              type="button" 
              onClick={() => { qr.randomize(); notify(t('toast.randomized', lang)); }}
              className="flex items-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white shadow-cta hover:brightness-110 btn-tactile"
            >
              <Sparkles size={13} /> <span>{t('action.randomize', lang)}</span>
            </button>
            <button 
              type="button" 
              onClick={handleReset} 
              aria-label={t('toast.reset', lang)}
              title={t('toast.reset', lang)}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20 hover:border-[var(--color-danger)]/50 btn-tactile transition-colors"
            >
              <RotateCcw size={13} /> <span>{t('action.reset', lang)}</span>
            </button>
          </div>
        </div>

        {/* Quick Presets Strip (desktop only) */}
        <div className="hidden xl:flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="font-mono text-[10px] uppercase text-[var(--color-text-muted)] mr-1">
            {t('action.presets', lang)}:
          </span>
          {PRESETS.slice(0, 6).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => { qr.applyPresetById(p.id); notify(t('toast.appliedPreset', lang, { name: t(`preset.${p.id}.name`, lang) })); }}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)] btn-tactile"
            >
              {t(`preset.${p.id}.name`, lang)}
            </button>
          ))}
        </div>

        {/* Actions Deck */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 flex-wrap">
          <button 
            type="button" 
            onClick={onCopyImage} 
            className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-hover)] btn-tactile"
          >
            <Copy size={13} /> <span className="hidden sm:inline">{t('action.copy', lang)}</span>
          </button>
          <button 
            type="button" 
            onClick={onCopyConfig} 
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-hover)] btn-tactile"
          >
            <Check size={13} /> <span>JSON</span>
          </button>
          <button 
            type="button" 
            onClick={onShare} 
            className="flex items-center gap-1.5 rounded-xl bg-[var(--color-text)] px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-[var(--color-bg)] hover:opacity-90 btn-tactile"
          >
            <Share2 size={13} /> <span>{t('action.share', lang)}</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Viewport Mode Switcher (< lg) */}
          <div className="lg:hidden mb-3 sm:mb-4 p-1 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-sm flex items-center gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={() => setMobileView('controls')}
          className={`flex-1 py-2 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all btn-tactile flex items-center justify-center gap-1 sm:gap-1.5 min-w-0 ${
            mobileView === 'controls'
              ? 'bg-[var(--color-accent)] text-white shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          }`}
        >
          <SlidersHorizontal size={13} className="shrink-0" />
           <span className="truncate">{t('editor.controls', lang)}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all btn-tactile flex items-center justify-center gap-1 sm:gap-1.5 min-w-0 ${
            mobileView === 'preview'
              ? 'bg-[var(--color-accent)] text-white shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          }`}
        >
          <Eye size={13} className="shrink-0" />
          <span className="truncate">{t('action.fullPreview', lang)}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView('both')}
          className={`flex-1 py-2 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all btn-tactile flex items-center justify-center gap-1 sm:gap-1.5 min-w-0 ${
            mobileView === 'both'
              ? 'bg-[var(--color-accent)] text-white shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          }`}
        >
          <Layers size={13} className="shrink-0" />
           <span className="truncate">{t('editor.both', lang)}</span>
        </button>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[minmax(280px,400px)_minmax(0,1fr)] xl:grid-cols-[minmax(340px,440px)_minmax(0,1fr)]">
        {/* Left Side: Sticky Preview Canvas */}
        <div className={`space-y-4 ${mobileView === 'controls' ? 'hidden lg:block' : 'block'}`}>
           <QRPreview config={config} lang={lang} notify={notify} />
        </div>

        {/* Right Side: Studio Control Decks */}
        <div className={`space-y-6 ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Studio Section Tabs with Icons */}
          <div className="flex gap-0.5 sm:gap-1 overflow-x-auto p-1 sm:p-1.5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-sm scrollbar-none scroll-smooth touch-pan-x -webkit-overflow-scrolling-touch" role="tablist" aria-label={t('editor.sections', lang)} style={{ WebkitOverflowScrolling: 'touch' }}>
            {TAB_DEFS.map((tItem) => {
              const Icon = tItem.icon;
              const active = tab === tItem.id;
              const label = t(tItem.key, lang) || tItem.defaultLabel;
              return (
                <button
                  key={tItem.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(tItem.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 whitespace-nowrap rounded-xl px-2 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium transition-all btn-tactile shrink-0 ${
                    active
                      ? 'bg-[var(--color-accent)] text-white font-semibold shadow-sm' 
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-white' : 'text-[var(--color-text-muted)]'} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Panel View */}
          <div className="rise min-h-[300px]" key={tab}>
            {panels[tab]}
          </div>

          {/* Presets Quick Catalog */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 sm:p-5 shadow-card">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[var(--color-text)] flex items-center gap-2">
                <Bookmark size={14} className="text-[var(--color-accent)]" />
                 <span>{t('editor.curatedPresets', lang)}</span>
              </h3>
               <span className="font-mono text-[11px] text-[var(--color-text-muted)]">{t('editor.payloadKept', lang)}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1.5 sm:gap-2.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                   onClick={() => { qr.applyPresetById(p.id); notify(t('toast.loadedPresetShort', lang)); }}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] text-left transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] btn-tactile group"
                >
                  <span className="font-mono text-xs font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                    {t(`preset.${p.id}.name`, lang)}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)] truncate w-full mt-0.5">
                    {t(`preset.${p.id}.tagline`, lang)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Studio Designs */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 sm:p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
                <Save size={14} className="text-[var(--color-accent)]" /> 
                 <span>{t('editor.localLibrary', lang)}</span>
              </h3>
              {designs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSaved(!showSaved)}
                  className="font-mono text-[11px] text-[var(--color-accent)] hover:underline"
                >
                   {showSaved ? t('editor.hideSaved', lang) : `${t('editor.showSaved', lang)} (${designs.length})`}
                </button>
              )}
            </div>

            <div className="flex gap-1.5 sm:gap-2 mb-3">
              <input
                 aria-label={t('editor.designName', lang)}
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                 placeholder={t('editor.designPlaceholder', lang)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-3.5 py-2 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
              />
              <button 
                type="button" 
                onClick={onSave} 
                className="whitespace-nowrap rounded-xl bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white shadow-cta hover:brightness-110 btn-tactile"
              >
                 {t('editor.save', lang)}
              </button>
            </div>

            {(showSaved || designs.length > 0) && (
              <ul className="space-y-2 max-h-48 overflow-y-auto pt-2 border-t border-[var(--color-border-subtle)]">
                {designs.map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)]/60 px-3.5 py-2 text-xs">
                    <button 
                      type="button" 
                       onClick={() => { qr.loadConfig(d.config); notify(lang === 'ar' ? `تم تحميل «${d.name}»` : `Loaded “${d.name}”`); }}
                      className="font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors text-left"
                    >
                      {d.name}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { deleteDesign(d.id); setDesigns(listDesigns()); }} 
                      className="p-1 text-[var(--color-danger)] hover:text-[var(--color-danger)] btn-tactile ml-3"
                       title={t('editor.deleteDesign', lang)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Floating Quick Preview Button on mobile when in controls view */}
      {mobileView === 'controls' && (
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className="lg:hidden fixed bottom-6 right-3 sm:right-4 z-40 flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-3.5 sm:px-4 py-2.5 text-xs font-semibold text-white shadow-xl shadow-[var(--color-accent)]/30 hover:brightness-110 btn-tactile"
        >
          <Eye size={15} />
           <span>{t('editor.viewLive', lang)}</span>
        </button>
      )}

      {/* Floating Studio Toasts : Top Right Position */}
      <div 
        aria-live="polite" 
        className="fixed top-16 right-2 sm:top-24 sm:right-6 z-[100] flex flex-col items-end gap-2 sm:gap-2.5 pointer-events-none max-w-[calc(100vw-1rem)] sm:max-w-sm w-full"
      >
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-medium shadow-elevated border backdrop-blur-xl transition-all duration-300 ${
              t.kind === 'error' 
                ? 'bg-[var(--color-bg-card)]/95 text-[var(--color-danger)] border-[var(--color-danger)]/40 shadow-xl'
                : 'bg-[var(--color-bg-card)]/95 text-[var(--color-text)] border-[var(--color-border)] shadow-xl'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${t.kind === 'error' ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-accent)]'}`} />
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
