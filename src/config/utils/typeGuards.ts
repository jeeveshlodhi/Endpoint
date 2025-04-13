import { Theme, ThemeColors } from "../types/theme";

/**
 * Type guard to check if an object is a valid Theme
 */
export function isTheme(obj: unknown): obj is Theme {
    if (!obj || typeof obj !== "object") return false;

    const theme = obj as Partial<Theme>;

    return typeof theme.name === "string" && !!theme.colors && typeof theme.colors === "object";
}

/**
 * Type guard to check if an object is valid ThemeColors
 */
export function isThemeColors(obj: unknown): obj is ThemeColors {
    if (!obj || typeof obj !== "object") return false;

    const colors = obj as Record<string, unknown>;

    // Check some essential color properties
    const requiredProps = ["background", "foreground", "primary", "secondary"];

    return requiredProps.every((prop) => prop in colors && typeof colors[prop] === "string");
}
