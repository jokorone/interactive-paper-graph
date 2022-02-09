import React from 'react';

import { DefaultNetworkSimulationSettings } from '..';

export const SettingsContext = React.createContext<typeof DefaultNetworkSimulationSettings>(
    {} as typeof DefaultNetworkSimulationSettings
  );
