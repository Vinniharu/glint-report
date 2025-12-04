"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SUBSIDIARY_THEMES, DEFAULT_THEME, ThemeColors } from "@/lib/subsidiaryColors";

interface ThemeContextType {
    theme: ThemeColors;
    setTheme: (subsidiary?: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeColors>(DEFAULT_THEME);
    const [mounted, setMounted] = useState(false);

    const applyTheme = (newTheme: ThemeColors) => {
        const root = document.documentElement;
        root.style.setProperty("--theme-background", newTheme.background);
        root.style.setProperty("--theme-foreground", newTheme.foreground);
        root.style.setProperty("--theme-primary", newTheme.primary);
        root.style.setProperty("--theme-secondary", newTheme.secondary);
        root.style.setProperty("--theme-border", newTheme.border);
        root.style.setProperty("--theme-muted", newTheme.muted);
        setThemeState(newTheme);
    };

    const setTheme = (subsidiary?: string) => {
        let newTheme = DEFAULT_THEME;
        if (subsidiary) {
            const subsidiaryKey = subsidiary.toLowerCase().replace(/\s+/g, "");
            newTheme = SUBSIDIARY_THEMES[subsidiaryKey] || DEFAULT_THEME;
        }
        applyTheme(newTheme);
    };

    useEffect(() => {
        setMounted(true);
        // Initial check from storage
        try {
            const userStr = sessionStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                setTheme(user.subsidiary);
            } else {
                applyTheme(DEFAULT_THEME);
            }
        } catch (e) {
            console.error("Failed to load theme", e);
            applyTheme(DEFAULT_THEME);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
