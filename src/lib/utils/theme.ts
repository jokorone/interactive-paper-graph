import React from 'react';
import { Theme, Themes } from '../models/theme';

export const ThemeContext = React.createContext<Theme>(Themes.Dark);

export function useTheme() {
  const [ theme, setTheme ] = React.useState<Theme>(Themes.Dark);

  const invert = (theme: Theme) => theme === Themes.Dark ? Themes.Light : Themes.Dark;

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
