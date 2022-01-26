import React from 'react';
import { Canvas } from "./canvas";

import { SettingsContext, useGraphData } from '../utils';

import { RawNode, RawLink, NetworkGraphSettingsConfig } from './../models';
import { DefaultNetworkGraphSettings } from '../defaults';


type DefaultGraphProps =  {
  data: {
    nodes: RawNode[],
    links: RawLink[]
  },
  config?: NetworkGraphSettingsConfig
};

export const NetworkGraph = (props: DefaultGraphProps) => {
  const initialSettings = {
    ...DefaultNetworkGraphSettings,
    ...props.config,
  } as typeof DefaultNetworkGraphSettings;

  const data = useGraphData(props.data),
        initialized = Object.keys(data).length > 0;

  return (
    <SettingsContext.Provider value={initialSettings}>
      {
        initialized &&
          <Canvas data={data} />
      }
    </SettingsContext.Provider>
  );
};
