import React from 'react';

import { GraphSettings } from '../defaults/graph-settings';
import { GraphSettingsEnum } from '../models/settings';
import { Theme } from '../models/theme';
import { AppColors } from '../defaults/colors';

const _DefaultSettings = {
  theme: 'dark' as Theme,
  colors: AppColors.dark,
  graph: GraphSettings
}

const _DefaultUpdateSettings = {
  toggleTheme: () => {},
  updateGraphSetting: (key: GraphSettingsEnum, value: number) => {},
}

const DefaultSettingsProps = {
  settings: _DefaultSettings,
  updateSettings: _DefaultUpdateSettings
}

export type UpdateSettings = typeof _DefaultUpdateSettings;
type SettingsContextProps = typeof DefaultSettingsProps;

export const SettingsContext = React.createContext<SettingsContextProps>(DefaultSettingsProps);

export const useSettings = (): {
  settings: typeof _DefaultSettings,
  updateSettings: UpdateSettings
} => {
  const
    [ graphSettings, setGraphSettings ] = React.useState<GraphSettings>(_DefaultSettings.graph),
    [ theme, setTheme ] = React.useState<Theme>(_DefaultSettings.theme),
    [ colors, setColors ] = React.useState<typeof _DefaultSettings.colors>(_DefaultSettings.colors);

  const invertTheme = (theme: Theme): Theme => theme === 'dark' ? 'light' : 'dark';
  const invertColors = (theme: Theme) => AppColors[invertTheme(theme)] as typeof _DefaultSettings.colors;

  const updateGraphSetting = (key: GraphSettingsEnum, value: number) => {
    setGraphSettings(settings => ({
      ...settings,
      [key]: value
    }));
  }

  function toggleTheme() {
    window.document.body.classList.remove(theme)
    window.document.body.classList.add(invertTheme(theme))
    setColors(invertColors(theme));
    setTheme(invertTheme(theme));
  };

  return {
    settings: {
      graph: graphSettings,
      theme: theme,
      colors
    },
    updateSettings: {
      updateGraphSetting,
      toggleTheme,
    },
  }
}
