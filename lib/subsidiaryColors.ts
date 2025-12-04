export interface ThemeColors {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    border: string;
    muted: string;
}

export const SUBSIDIARY_THEMES: Record<string, ThemeColors> = {
    // Default theme (Blue and White)
    default: {
        background: "#ffffff",
        foreground: "#0a0a0a",
        primary: "#2563eb", // blue-600
        secondary: "#eff6ff", // blue-50
        border: "#e5e5e5", // neutral-200
        muted: "#737373", // neutral-500
    },
    // Example Subsidiary 1: "TechCorp" - Cyberpunk/Neon Blue theme
    techcorp: {
        background: "#050510",
        foreground: "#e0f2fe",
        primary: "#0ea5e9", // sky-500
        secondary: "#0f172a", // slate-900
        border: "#1e293b", // slate-800
        muted: "#64748b", // slate-500
    },
    // Example Subsidiary 2: "GreenEnergy" - Nature/Green theme
    greenenergy: {
        background: "#022c22", // teal-950
        foreground: "#ecfdf5", // teal-50
        primary: "#10b981", // emerald-500
        secondary: "#064e3b", // emerald-900
        border: "#065f46", // emerald-800
        muted: "#34d399", // emerald-400
    },
    // Example Subsidiary 3: "RedSteel" - Industrial/Red theme
    redsteel: {
        background: "#2b0a0a", // red-950 (custom dark)
        foreground: "#fef2f2", // red-50
        primary: "#ef4444", // red-500
        secondary: "#450a0a", // red-900
        border: "#7f1d1d", // red-900
        muted: "#f87171", // red-400
    },
};

export const DEFAULT_THEME = SUBSIDIARY_THEMES.default;

export interface Subsidiary {
    id: string;
    name: string;
    logo: string;
}

export const SUBSIDIARIES: Subsidiary[] = [
    {
        id: "default",
        name: "EIB Group",
        logo: "https://placehold.co/200x50/2563eb/ffffff?text=EIB+Group"
    },
    {
        id: "techcorp",
        name: "TechCorp",
        logo: "https://placehold.co/200x50/0ea5e9/ffffff?text=TechCorp"
    },
    {
        id: "greenenergy",
        name: "GreenEnergy",
        logo: "https://placehold.co/200x50/10b981/ffffff?text=GreenEnergy"
    },
    {
        id: "redsteel",
        name: "RedSteel",
        logo: "https://placehold.co/200x50/ef4444/ffffff?text=RedSteel"
    }
];
