import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        line: 'var(--line)',
        'inverse-bg': 'var(--inverse-bg)',
        'inverse-ink': 'var(--inverse-ink)',
        'green-signal': 'var(--green-signal)',
        'green-light': 'var(--green-light)',
        'green-deep': 'var(--green-deep)',
        'line-accent': 'var(--line-accent)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '24': '6rem',
        '32': '8rem',
        '48': '12rem',
      },
      maxWidth: {
        content: '1600px',
      },
      borderRadius: {
        card: '6px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
