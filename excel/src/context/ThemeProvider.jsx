import { createContext,  useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const location = useLocation();

    const isAdminRoute = location.pathname.startsWith("/admin");

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem("theme");

            // ⛔ Only respect saved/system preference if admin route
            if (isAdminRoute) {
                if (savedTheme) return savedTheme;
                return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            }

            // ✅ Force light for non-admin
            return "light";
        }
        return "light";
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // ⛔ On user routes: always light mode
        if (!isAdminRoute) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            return;
        }

        // ✅ Admin route: apply theme
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme, isAdminRoute]);

    const toggleTheme = () => {
        if (!isAdminRoute) return; // prevent toggle outside admin
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
