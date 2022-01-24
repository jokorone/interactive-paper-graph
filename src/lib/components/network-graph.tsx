import React from 'react';
import { Canvas } from "./canvas";
import { SettingsContainer } from "./settings";
import { useGraphData } from '../utils/data';

import { SettingsContext, useSettings } from '../utils/settings';

export const NetworkGraph = React.memo(() => {
  const { data } = useGraphData(),
        { settings, updateSettings } = useSettings();

  if (!Object.values(data).length) return <></>;

  return (
      <SettingsContext.Provider value={{ settings, updateSettings }}>

        <SettingsContainer/>
        <Canvas data={data} />

      </SettingsContext.Provider>
  );
});
