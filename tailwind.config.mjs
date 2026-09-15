/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic design system mapped to CSS variables
        surface: {
          DEFAULT: 'var(--color-bg)',
          card: 'var(--color-bg-card)',
          panel: 'var(--color-bg-panel)',
          elevated: 'var(--color-bg-elevated)',
          hover: 'var(--color-bg-hover)',
        },
        content: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          subtle: 'var(--color-text-subtle)',
        },
        stroke: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
          highlight: 'var(--color-border-highlight)',
        },
        brand: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          light: 'var(--color-accent-light)',
          glow: 'var(--color-accent-glow)',
          cyan: '#78b59a',
          violet: '#d4ad63',
          emerald: '#8dc7a1',
          rose: '#e38e86',
        },

        // Legacy compatibility mappings
        volt: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
        obsidian: {
          DEFAULT: '#0b0f0d',
          light: '#151c18',
        },
        onyx: '#1b241e',
        ash: 'var(--color-border)',
        mist: 'var(--color-bg-hover)',
        charcoal: 'var(--color-text-secondary)',

        // Vercel / dark palette aliases
        'vercel-black': '#0b0f0d',
        'vercel-white': '#ffffff',
        'vercel-ship-red': '#e38e86',
        'vercel-preview-pink': '#c97969',
        'vercel-develop-blue': 'var(--color-accent)',
        'vercel-link-blue': 'var(--color-accent)',
        'vercel-focus-blue': 'var(--color-accent)',
      },
      fontFamily: {
        display: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.0', letterSpacing: '-0.035em', fontWeight: '600' }],
        'display-lg': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '600' }],
        'heading-xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'heading-lg': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '500' }],
        'heading-md': ['1.375rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.55', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'caption': ['0.8125rem', { lineHeight: '1.45', letterSpacing: '0.01em', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '500' }],
        'micro': ['0.6875rem', { lineHeight: '1.35', letterSpacing: '0.06em', fontWeight: '600' }],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--color-border)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'elevated': '0 12px 32px -4px rgba(0, 0, 0, 0.16), 0 0 0 1px var(--color-border)',
        'glow': '0 0 35px -5px var(--color-accent-glow)',
        'glow-sm': '0 0 18px -2px var(--color-accent-glow)',
        'cta': '0 4px 16px 0 var(--color-accent-glow)',
        'glass': 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 32px rgba(0, 0, 0, 0.2)',
        'vercel-border': 'var(--shadow-vercel-border)',
        'vercel-card': 'var(--shadow-vercel-card)',
        'vercel-elevation': 'var(--shadow-vercel-elevation)',
        'vercel-ring': 'var(--shadow-vercel-ring)',
      },
      borderRadius: {
        'micro': '3px',
        'subtle': '6px',
        'standard': '8px',
        'comfortable': '12px',
        'image': '16px',
        'panel': '20px',
        'pill': '9999px',
      },
      maxWidth: {
        'page': '1240px',
        'content': '1080px',
      },
    },
  },
  plugins: [],
};
