/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Colors reference CSS custom properties so dark mode flips automatically
      // Variables hold space-separated R G B channels for opacity modifier support
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        muted:   'rgb(var(--color-muted)   / <alpha-value>)',
        faint:   'rgb(var(--color-faint)   / <alpha-value>)',
        border:  'rgb(var(--color-border)  / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        bg:      'rgb(var(--color-bg)      / <alpha-value>)',
        accent:  'rgb(var(--color-accent)  / <alpha-value>)',
        info:    'rgb(var(--color-info)    / <alpha-value>)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      },
      maxWidth: {
        prose: '68ch',
        content: '900px',
        wide: '1200px',
      },
      lineHeight: {
        editorial: '1.75',
      },
      // Page-level fade-in + per-item stagger fade-up
      animation: {
        'fade-in':  'fadeIn 150ms ease-out both',
        'fade-up':  'fadeUp 200ms ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: ({ theme }) => ({
        editorial: {
          css: {
            '--tw-prose-body':     'rgb(var(--color-primary))',
            '--tw-prose-headings': 'rgb(var(--color-primary))',
            '--tw-prose-links':    'rgb(var(--color-info))',
            '--tw-prose-code':     'rgb(var(--color-primary))',
            '--tw-prose-borders':  'rgb(var(--color-border))',
            fontFamily: theme('fontFamily.sans').join(', '),
            lineHeight: '1.75',
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
