import React from 'react';

import { GraphSettings } from '../defaults/graph-settings';
import { GraphSettingsEnum } from '../models/settings';
import { Theme } from '../models/theme';

const _DefaultSettings = {
  theme: 'dark' as Theme,
  simulation: GraphSettings,
  paper: {}
}

const _DefaultUpdateSettings = {
  toggleTheme: () => {},
  updateGraphSetting: (key: GraphSettingsEnum, value: number) => {}
}

const DefaultSettingsProps = {
  settings: _DefaultSettings,
  updateSettings: _DefaultUpdateSettings
}

export type Settings = typeof _DefaultSettings;
export type UpdateSettings = typeof _DefaultUpdateSettings;
type SettingsContextProps = typeof DefaultSettingsProps;

export const SettingsContext = React.createContext<SettingsContextProps>(DefaultSettingsProps);

// Provider functions for SettingsContext
export const useSettings = () => {

  const [ graphSettings, setGraphSettings ] = React.useState<GraphSettings>(GraphSettings);
  const theme = React.useState<Theme>();

  const updateGraphSetting = (key: GraphSettingsEnum, value: number) => {

    setGraphSettings(settings => ({
      ...settings,
      key: value
    }));

  }

  return { graphSettings, updateGraphSetting };
}
