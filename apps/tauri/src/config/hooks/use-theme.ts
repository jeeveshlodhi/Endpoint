import { useMemo } from "react";
import { useTheme } from "../../components/theme-provider";

/**
 * Get a specific color value from the current theme
 */
export function useThemeColor(colorName: string): string {
    const { currentThemeObject } = useTheme();

    return useMemo(() => {
        if (!currentThemeObject) return "";
        return currentThemeObject.colors[colorName] || "";
    }, [currentThemeObject, colorName]);
}

/**
 * Get all theme colors
 */
export function useThemeColors() {
    const { currentThemeObject } = useTheme();

    return useMemo(() => {
        if (!currentThemeObject) return {};
        return currentThemeObject.colors;
    }, [currentThemeObject]);
}
