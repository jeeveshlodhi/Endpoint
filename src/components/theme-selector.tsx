import React from 'react';
import { useTheme } from './theme-provider';

interface ThemeSelectorProps {
    className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
    const { currentTheme, availableThemes, changeTheme, isThemeLoaded } = useTheme();

    if (!isThemeLoaded) {
        return <div className={className}>Loading themes...</div>;
    }

    return (
        <div className={`theme-selector ${className}`}>
            <label htmlFor="theme-select">Theme: </label>
            <select id="theme-select" value={currentTheme || ''} onChange={e => changeTheme(e.target.value)}>
                {availableThemes.map(theme => (
                    <option key={theme} value={theme}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ThemeSelector;
