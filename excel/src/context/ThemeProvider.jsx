import { createContext, useContext, useEffect, useState } from "react";

// Create a context for theme management
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    // Get theme from localStorage or system preference as fallback
    const [theme, setTheme] = useState(() => {
        // If running in a browser environment
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) return savedTheme;

            // Check system preference if no saved theme
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }

        // Default to light for SSR
        return "light";
    });

    // Apply theme effect
    useEffect(() => {
        // Early return if not in browser
        if (typeof window === 'undefined') return;

        // Apply to document element
        document.documentElement.classList.toggle("dark", theme === "dark");

        // Store in localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook to use the theme
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}