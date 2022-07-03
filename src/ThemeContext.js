import React, { useState, useEffect } from 'react';
import { createContext } from "react";

export const themes = {
    dark: "dark-theme",
    light: "",
};

export const ThemeContext = createContext("");

export default function ThemeContextWrapper(props) {
    const [theme, setTheme] = useState(localStorage.getItem('dark') ? themes.dark : themes.light);

    function changeTheme(theme) {
        setTheme(theme);
    }

    useEffect(() => {
        switch (theme) {
            case themes.dark:
                document.body.classList.add('dark-theme');
                localStorage.setItem('dark', themes.dark);
                break;
            default:
                document.body.classList.remove('dark-theme');
                localStorage.removeItem('dark');
                break;
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme,changeTheme }}>
            {props.children}
        </ThemeContext.Provider>
    );
}