import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const [isHighContrast, setIsHighContrast] = useState(() => {
        const savedContrast = localStorage.getItem('highContrast');
        return savedContrast === 'true';
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    useEffect(() => {
        if (isHighContrast) {
            document.documentElement.classList.add('high-contrast');
            document.documentElement.classList.add('dark');
            localStorage.setItem('highContrast', 'true');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('high-contrast');
            localStorage.setItem('highContrast', 'false');
            // Não remove o modo escuro automaticamente quando desativa o alto contraste
        }
    }, [isHighContrast]);

    const toggleTheme = () => {
        setIsDark(!isDark);    
    };

    const toggleHighContrast = () => {
        setIsHighContrast(!isHighContrast);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, isHighContrast, toggleHighContrast }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};