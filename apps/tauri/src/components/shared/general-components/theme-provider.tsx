import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import themeService from '@/config/services/theme-service';
import { Theme } from '@/config/types/theme';

interface ThemeContextType {
    currentTheme: string | null;
    currentThemeObject: Theme | null;
    availableThemes: string[];
    changeTheme: (themeName: string) => void;
    isThemeLoaded: boolean;
}

const defaultContextValue: ThemeContextType = {
    currentTheme: null,
    currentThemeObject: null,
    availableThemes: [],
    changeTheme: () => {},
    isThemeLoaded: false,
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const useTheme = (): ThemeContextType => useContext(ThemeContext);

interface ThemeProviderProps {
    defaultTheme?: string;
    availableThemes?: string[];
}

export function ThemeProvider({
    children,
    defaultTheme = 'light',
    availableThemes = ['light', 'dark'],
}: PropsWithChildren<ThemeProviderProps>): React.ReactElement {
    const [currentTheme, setCurrentTheme] = useState<string | null>(null);
    const [currentThemeObject, setCurrentThemeObject] = useState<Theme | null>(null);
    const [themeList, setThemeList] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const initializeTheme = async (): Promise<void> => {
            await themeService.initialize(defaultTheme, availableThemes);
            setCurrentTheme(themeService.getCurrentTheme());
            setCurrentThemeObject(themeService.getCurrentThemeObject());
            setThemeList(themeService.getAvailableThemes());
            setIsLoaded(true);
        };

        initializeTheme();

        const unsubscribe = themeService.onThemeChange(theme => {
            setCurrentTheme(theme.name);
            setCurrentThemeObject(theme);
        });

        return () => unsubscribe();
    }, [defaultTheme, availableThemes.join()]);

    const changeTheme = (themeName: string): void => {
        themeService.applyTheme(themeName);
    };

    return (
        <ThemeContext.Provider
            value={{
                currentTheme,
                currentThemeObject,
                availableThemes: themeList,
                changeTheme,
                isThemeLoaded: isLoaded,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}
