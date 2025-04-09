import { Theme, ThemeChangeListener, ThemeUnsubscribe } from "../types/theme";

class ThemeService {
    private currentTheme: string | null = null;
    private themes: Record<string, Theme> = {};
    private themeChangeListeners: ThemeChangeListener[] = [];

    /**
     * Load a theme from JSON file
     */
    public async loadTheme(themeName: string): Promise<Theme | null> {
        if (this.themes[themeName]) {
            return this.themes[themeName];
        }

        try {
            const response = await fetch(`/themes/${themeName}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load theme: ${themeName}`);
            }
            const theme: Theme = await response.json();
            this.themes[themeName] = theme;
            return theme;
        } catch (error) {
            console.error("Error loading theme:", error);
            return null;
        }
    }

    /**
     * Load multiple themes at once
     */
    public async loadAllThemes(themeNames: string[]): Promise<Record<string, Theme>> {
        const promises = themeNames.map((name) => this.loadTheme(name));
        await Promise.all(promises);
        return this.themes;
    }

    /**
     * Apply a theme to the document
     */
    public applyTheme(themeName: string): boolean {
        const theme = this.themes[themeName];
        if (!theme) {
            console.error(`Theme not loaded: ${themeName}`);
            return false;
        }

        // Apply the theme colors to CSS variables
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });

        // Update body/html classes if needed
        document.body.className = document.body.className.replace(/theme-\w+/g, "").trim();
        document.body.classList.add(`theme-${themeName}`);

        // For backward compatibility with dark class
        if (themeName === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        // Store the current theme
        this.currentTheme = themeName;
        localStorage.setItem("selected-theme", themeName);

        // Notify listeners
        this.notifyThemeChange(theme);

        return true;
    }

    /**
     * Get the current theme name
     */
    public getCurrentTheme(): string | null {
        return this.currentTheme;
    }

    /**
     * Get the current theme object
     */
    public getCurrentThemeObject(): Theme | null {
        return this.currentTheme ? this.themes[this.currentTheme] : null;
    }

    /**
     * Get all available theme names
     */
    public getAvailableThemes(): string[] {
        return Object.keys(this.themes);
    }

    /**
     * Register a listener for theme changes
     */
    public onThemeChange(listener: ThemeChangeListener): ThemeUnsubscribe {
        this.themeChangeListeners.push(listener);
        return () => {
            this.themeChangeListeners = this.themeChangeListeners.filter((l) => l !== listener);
        };
    }

    /**
     * Notify all listeners of a theme change
     */
    private notifyThemeChange(theme: Theme): void {
        this.themeChangeListeners.forEach((listener) => listener(theme));
    }

    /**
     * Initialize the theme service
     */
    public async initialize(
        defaultTheme: string = "light",
        availableThemes: string[] = ["light", "dark"],
    ): Promise<string> {
        await this.loadAllThemes(availableThemes);

        const savedTheme = localStorage.getItem("selected-theme");
        const themeToApply = savedTheme && this.themes[savedTheme] ? savedTheme : defaultTheme;

        this.applyTheme(themeToApply);
        return themeToApply;
    }
}

// Export a singleton instance
export const themeService = new ThemeService();
export default themeService;
