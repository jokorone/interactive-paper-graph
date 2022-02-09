import React from 'react';

import { DefaultNetworkGraphSettings } from '..';

export const SettingsContext = React.createContext<typeof DefaultNetworkGraphSettings>(
    {} as typeof DefaultNetworkGraphSettings
  );
