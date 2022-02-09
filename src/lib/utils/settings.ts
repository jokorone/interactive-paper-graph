import React from 'react';

import { DefaultSettings, DefaultSimulationSettings } from './../defaults';
import { SimulationSettings } from './../models';


export const SettingsContext = React.createContext<typeof DefaultSettings>(
    {} as typeof DefaultSettings
  );

export const useGraphSettings = () => {
  const [
    simulationSettings,
    _setSimulationSettings
  ] = React.useState<SimulationSettings>(DefaultSimulationSettings);

  const updateGraphSetting = (
    key: keyof SimulationSettings,
    value: number
  ) => _setSimulationSettings(settings => ({
    ...settings,
    [key]: value
  }));

  return { simulationSettings, updateGraphSetting };
}
