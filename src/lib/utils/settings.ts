import React from 'react';

import { DefaultSettings, DefaultSimulationSettings } from './../defaults';
import { SimulationSettings } from './../models';


export const SettingsContext = React.createContext<typeof DefaultSettings>(
  {} as typeof DefaultSettings
);

export const useGraphSettings = (initialSimulationSettings: SimulationSettings = DefaultSimulationSettings) => {

  const [ simulationSettings, _setSimulationSettings ] = React.useState<SimulationSettings>(initialSimulationSettings);

  const updateSimulationSetting = (key: keyof SimulationSettings, value: number) =>
    _setSimulationSettings(settings => ({
      ...settings,
      [key]: value
    })
  );

  return { simulationSettings, updateSimulationSetting };
}
