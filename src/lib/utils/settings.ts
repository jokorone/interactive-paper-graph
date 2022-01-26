import React from 'react';

import { DefaultNetworkGraphSettings } from '..';

// use defaults as NetworkGraphSettings is with all props marked optional
type FixedNetworkGraphSettings = typeof DefaultNetworkGraphSettings;
export const SettingsContext = React.createContext<FixedNetworkGraphSettings>(
    {} as FixedNetworkGraphSettings
  );
