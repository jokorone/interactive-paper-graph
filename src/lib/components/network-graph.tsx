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
  simulation?: typeof DefaultNetworkGraphSettings.simulation,
  items?: typeof DefaultNetworkGraphSettings.items,
  colors?: typeof DefaultNetworkGraphSettings.colors,
  handlers?: typeof DefaultNetworkGraphSettings.handlers,
};

export const NetworkGraph = (props: DefaultGraphProps) => {
  const
    data = useGraphData(props.data),
    initialized = Object.keys(data).length > 0,
    initialSettings = {
      ...DefaultNetworkGraphSettings,
      ...props
    } as typeof DefaultNetworkGraphSettings;

  console.log(initialSettings);


  return (
    <SettingsContext.Provider value={initialSettings}>
      {
        initialized &&
          <Canvas data={data} />
      }
    </SettingsContext.Provider>
  );
};
