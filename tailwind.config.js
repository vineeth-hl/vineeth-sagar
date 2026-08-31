import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--bg-main) / <alpha-value>)',
                card: 'rgb(var(--surface) / <alpha-value>)',
                line: 'rgb(var(--line) / <alpha-value>)',
                primary: 'rgb(var(--text-primary) / <alpha-value>)',
                secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
                accent: {
                    blue: 'rgb(var(--accent) / <alpha-value>)',
                    gold: 'rgb(var(--accent-gold) / <alpha-value>)',
                    // legacy aliases -> resolve to the blue accent
                    purple: 'rgb(var(--accent) / <alpha-value>)',
                    cyan: 'rgb(var(--accent) / <alpha-value>)'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
            }
        }
    },
    plugins: [typography]
};
