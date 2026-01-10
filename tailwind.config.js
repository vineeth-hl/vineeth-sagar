/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0D0D0D',
                card: '#1A1A1A',
                primary: '#FFFFFF',
                secondary: '#AAAAAA',
                accent: {
                    purple: '#A855F7',
                    cyan: '#06B6D4',
                }
            },
            fontFamily: {
                heading: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'gradient-main': 'linear-gradient(135deg, #A855F7, #06B6D4)',
            }
        },
    },
    plugins: [],
}
