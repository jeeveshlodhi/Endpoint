export interface ThemeColors {
    background: string;
    foreground: string;
    card: string;
    "card-foreground": string;
    popover: string;
    "popover-foreground": string;
    primary: string;
    "primary-foreground": string;
    secondary: string;
    "secondary-foreground": string;
    muted: string;
    "muted-foreground": string;
    accent: string;
    "accent-foreground": string;
    destructive: string;
    "destructive-foreground": string;
    border: string;
    input: string;
    ring: string;
    "chart-1": string;
    "chart-2": string;
    "chart-3": string;
    "chart-4": string;
    "chart-5": string;
    sidebar: string;
    "sidebar-foreground": string;
    "sidebar-primary": string;
    "sidebar-primary-foreground": string;
    "sidebar-accent": string;
    "sidebar-accent-foreground": string;
    "sidebar-border": string;
    "sidebar-ring": string;
    [key: string]: string; // Allow for additional properties
}

export interface Theme {
    name: string;
    colors: ThemeColors;
}

export type ThemeChangeListener = (theme: Theme) => void;
export type ThemeUnsubscribe = () => void;
