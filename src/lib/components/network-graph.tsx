import React from 'react';
import { Canvas } from "./canvas";
import { SettingsContainer } from "./settings";

import { ThemeContext, useTheme } from '../utils/theme';
import { useGraphData } from '../utils/data';
import { GraphSettings } from '../defaults/graph-settings';
import { Theme, Themes } from '../models/theme';
import { SettingsContext, useSettings } from '../utils/settings';

export const NetworkGraph = () => {
  const { theme, toggleTheme } = useTheme(),
        { data } = useGraphData(),
        { graphSettings, updateGraphSetting } = useSettings(),
        // make setting context provider
        settings = {
          theme,
          simulation: graphSettings,
          paper: {}
        },
        updateSettings = {
          toggleTheme, updateGraphSetting
        };

  if (!Object.values(data).length) return <></>;

  return (
      <SettingsContext.Provider value={{ settings, updateSettings }}>

        <SettingsContainer/>
        <Canvas data={data} />

      </SettingsContext.Provider>
  );
}
