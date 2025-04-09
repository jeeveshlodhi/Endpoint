import themeService from "./services/theme-service";

/**
 * Preload themes before app initialization
 */
export async function preloadThemes(
    defaultTheme: string = "light",
    themes: string[] = ["light", "dark"],
): Promise<void> {
    try {
        await themeService.loadAllThemes(themes);
        const savedTheme = localStorage.getItem("selected-theme");
        const themeToApply = savedTheme && themes.includes(savedTheme) ? savedTheme : defaultTheme;

        themeService.applyTheme(themeToApply);
    } catch (error) {
        console.error("Failed to preload themes:", error);
        // Apply the default theme as fallback
        themeService.applyTheme(defaultTheme);
    }
}
