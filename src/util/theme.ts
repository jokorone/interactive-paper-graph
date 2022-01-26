import React from 'react';

export type Theme = 'light' | 'dark';

const initialTheme = window
  .matchMedia('(prefers-color-scheme: dark)')
  .matches ? 'dark' : 'light' as Theme;

export const useTheme = () => {
  const [ theme,  _setTheme ] = React.useState<Theme>(initialTheme),
    toggleTheme = () => _setTheme(invert(theme)),
    invert = (theme: Theme): Theme => theme === 'dark' ? 'light' : 'dark';

  React.useEffect(() => {
    window.document.body.classList.remove(invert(theme));
    window.document.body.classList.add(theme);
  }, [theme])

  return {
    theme,
    toggleTheme
  };
}
