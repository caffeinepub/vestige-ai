/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        background: 'oklch(var(--bg-deep) / <alpha-value>)',
        foreground: 'oklch(var(--text-bright) / <alpha-value>)',
        card: {
          DEFAULT: 'oklch(var(--bg-card) / <alpha-value>)',
          foreground: 'oklch(var(--text-bright) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'oklch(var(--green-vivid) / <alpha-value>)',
          foreground: 'oklch(0.08 0.01 145 / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(0.18 0.025 145 / <alpha-value>)',
          foreground: 'oklch(var(--text-bright) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(0.16 0.02 145 / <alpha-value>)',
          foreground: 'oklch(var(--text-muted) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(0.2 0.03 145 / <alpha-value>)',
          foreground: 'oklch(var(--text-bright) / <alpha-value>)',
        },
        border: 'oklch(var(--green-dim) / 0.2)',
        input: 'oklch(0.14 0.02 145)',
        ring: 'oklch(var(--green-vivid))',
        destructive: {
          DEFAULT: 'oklch(0.6 0.22 25)',
          foreground: 'oklch(0.96 0.02 145)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
