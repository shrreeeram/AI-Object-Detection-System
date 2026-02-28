import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'cyber');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const root = window.document.documentElement;

        // Clear previous theme classes
        root.classList.remove('light', 'dark', 'cyber');

        // Add current theme class
        root.classList.add(theme);

        // Meta theme color update for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'light' ? '#ffffff' : '#020617');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === 'dark') return 'cyber';
            return 'dark';
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
