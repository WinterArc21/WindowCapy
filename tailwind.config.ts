import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
        text: 'var(--color-text)',
        outline: 'var(--color-outline)',
        bg: 'var(--color-bg)',
        bgError: 'var(--bg-error)',
        bgWarning: 'var(--bg-warning)',
        bgSuccess: 'var(--bg-success)',
        bgMuted: 'var(--bg-muted)',
        bgInfo: 'var(--bg-info)',
      },
      ringColor: {
        DEFAULT: 'var(--ring-primary)',
        info: 'var(--ring-info)',
        error: 'var(--ring-error)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
    fontFamily: {
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
    },
  },
  plugins: [],
}
export default config
