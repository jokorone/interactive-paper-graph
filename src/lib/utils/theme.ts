import React from 'react';
import { Theme } from '../models/theme';

export const ThemeContext = React.createContext<Theme>('dark');

export function useTheme() {
  const [ theme, setTheme ] = React.useState<Theme>('dark');

  const invert = (theme: Theme) => theme === 'dark' ? 'light' : 'dark';

  React.useEffect(() => {
    const bodyClass = window.document.body.classList;

    bodyClass.remove(invert(theme));
    bodyClass.add(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(invert(theme));
  };

  return { theme, toggleTheme };
}
