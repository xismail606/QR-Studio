import { useState, useEffect } from 'react';

export function Panel({ title, badge, children }) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 sm:p-5 md:p-6 shadow-card transition-all">
      {title && (
        <div className="mb-5 flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
          <h3 className="font-display text-sm font-semibold tracking-tight text-[var(--color-text)] flex items-center gap-2">
            <span>{title}</span>
            {badge && (
              <span className="rounded-md bg-[var(--color-accent-light)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--color-accent)]">
                {badge}
              </span>
            )}
          </h3>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] opacity-60"></span>
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Row({ label, hint, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</span>
        {hint && <span className="font-mono text-[11px] text-[var(--color-text-muted)]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function Slider({ value, min, max, step = 1, onChange, ariaLabel, unit = '' }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        aria-label={ariaLabel}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[var(--color-accent)] cursor-pointer h-1.5 rounded-full"
      />
      <span className="w-12 text-right font-mono text-xs font-semibold text-[var(--color-text)]">
        {value}{unit}
      </span>
    </div>
  );
}

export function ColorField({ value, onChange, label }) {
  const [localHex, setLocalHex] = useState(value);

  useEffect(() => {
    setLocalHex(value);
  }, [value]);

  function handleTextChange(e) {
    const val = e.target.value;
    setLocalHex(val);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
      onChange(val);
    }
  }

  return (
    <div className="flex items-center gap-2.5">
      {/* Color picker preview tile */}
      <label className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] cursor-pointer shadow-sm hover:border-[var(--color-accent)] transition-all shrink-0 group">
        <input 
          type="color" 
          aria-label={label} 
          value={value && value.startsWith('#') ? value : '#000000'} 
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
        />
        <div 
          className="w-5 h-5 rounded-md border border-black/10 shadow-inner"
          style={{ backgroundColor: value }}
        />
      </label>

      {/* Hex text input */}
      <div className="relative flex-1">
        <input
          type="text"
          value={localHex}
          dir="ltr"
          onChange={handleTextChange}
          placeholder="#000000"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-panel)] px-3 py-1.5 font-mono text-xs font-medium uppercase text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>
    </div>
  );
}

export function VisualCardSelect({ options, value, onChange, ariaLabel, cols = 'grid-cols-3' }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={`grid ${cols} gap-1.5 sm:gap-2`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border text-center transition-all btn-tactile group min-w-0 ${
              active
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]/40 shadow-sm text-[var(--color-text)] ring-1 ring-[var(--color-accent)]'
                : 'border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-highlight)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text)]'
            }`}
          >
            {o.icon && (
              <div className={`mb-1 sm:mb-1.5 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-colors ${active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]'}`}>
                {o.icon}
              </div>
            )}
            <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-tight leading-tight truncate w-full">
              {o.label}
            </span>
            {o.description && (
              <span className="mt-0.5 text-[8.5px] sm:text-[9.5px] text-[var(--color-text-muted)] leading-tight truncate w-full">
                {o.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Segmented({ options, value, onChange, ariaLabel }) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-1.5 rounded-xl bg-[var(--color-bg-panel)] p-1.5 border border-[var(--color-border)]">
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? o : o.label;
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={active}
            className={`flex-1 min-w-fit rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 btn-tactile text-center ${
              active
                ? 'bg-[var(--color-accent)] text-white shadow-sm font-semibold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-xs font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 btn-tactile ${
          checked ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-bg-hover)] border border-[var(--color-border)]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}

export function TextInput({ value, onChange, placeholder, ariaLabel, multiline = false }) {
  const cls = 'w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border border-[var(--color-border)] bg-[var(--color-bg-panel)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-all font-sans';
  if (multiline) {
    return (
      <textarea aria-label={ariaLabel} dir="auto" rows={3} className={cls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    );
  }
  return (
    <input aria-label={ariaLabel} dir="auto" className={cls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  );
}
