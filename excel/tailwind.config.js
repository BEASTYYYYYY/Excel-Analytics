/** @type {import('tailwindcss').Config} */
export default {
    content: [ 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    // or 'media' for system preference based
    theme: {
        extend: {
            colors: {
                primary: {
                    light: 'rgb(var(--accent-primary))',
                    dark: 'rgb(var(--accent-secondary))',
                }
            }, 
        },
    },
    plugins: [],
}