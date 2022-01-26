import React from 'react';

import { GraphSettings } from '../defaults/graph-settings';
import { GraphSettingsEnum } from '../models/settings';
import { InteractionHandlers } from '../models/interactions';
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
  updateSettings: _DefaultUpdateSettings,
  interactionHandlers: {} as InteractionHandlers,
}

export type UpdateSettings = typeof _DefaultUpdateSettings;
export type Settings = typeof DefaultSettingsProps;

export const SettingsContext = React.createContext<Settings>(DefaultSettingsProps);

export const useSettings = (preferUserSettings?: Partial<Settings>): Settings => {
  const initial = preferUserSettings?.settings || _DefaultSettings;

  const
    [ graphSettings, setGraphSettings ] = React.useState<GraphSettings>(initial.graph),
    [ theme, setTheme ] = React.useState<Theme>(initial.theme),
    [ colors, setColors ] = React.useState<typeof _DefaultSettings.colors>(initial.colors);

  const
    invertTheme = (theme: Theme): Theme => theme === 'dark' ? 'light' : 'dark',
    invertColors = (theme: Theme) => AppColors[invertTheme(theme)] as typeof _DefaultSettings.colors;

  const updateGraphSetting = (key: GraphSettingsEnum, value: number) => {
    setGraphSettings(settings => ({
      ...settings,
      [key]: value
    }));
  }

  const toggleTheme = () => {
    window.document.body.classList.remove(theme)
    window.document.body.classList.add(invertTheme(theme))
    setColors(invertColors(theme));
    setTheme(invertTheme(theme));
  };

  const updateSettings = preferUserSettings?.updateSettings
    || { updateGraphSetting, toggleTheme };

  const interactionHandlers = preferUserSettings?.interactionHandlers
    || {};

  return {
    settings: {
      graph: graphSettings,
      theme,
      colors
    },
    updateSettings,
    interactionHandlers
  }
}
