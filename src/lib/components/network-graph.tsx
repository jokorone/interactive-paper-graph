import React from 'react';
import { Canvas } from "./canvas";


import { deepmerge } from 'deepmerge-ts'
import { SettingsContext, useGraphData } from '../utils';

import { RawNode, RawLink, GraphSettingsEnum, InteractionHandlers } from './../models';
import { DefaultNetworkGraphSettings } from '../defaults';

type DefaultGraphProps =  {
  data: {
    nodes: RawNode[],
    links: RawLink[]
  },
  config?: {
    colors?: typeof DefaultNetworkGraphSettings.config.colors,
    paper?: {
      node?: {
        radius?: number;
        opacity?: number;
        highlight?: {
            radius?: number;
            opacity?: number;
        };
      };
      links?: {
          stroke?: number;
          opacity?: number;
          highlight?: {
              stroke?: number;
              opacity?: number;
          };
      };
      label?: {
          show?: boolean;
      };
    };
    graph?: typeof DefaultNetworkGraphSettings.config.graph
  },
  handlers?: InteractionHandlers,
};
export const NetworkGraph = (props: DefaultGraphProps) => {

  const { data: _data, ...userSettings } = props,
    data = useGraphData(_data),
    initialized = Object.keys(data).length;

  const [ settings, setSettings ] = React.useState(DefaultNetworkGraphSettings);

  const applyProps = React.useCallback(
    () => {
      setSettings(deepmerge(
        DefaultNetworkGraphSettings,
        userSettings as typeof DefaultNetworkGraphSettings
      ));
    },
    [props]
  );
  React.useEffect(applyProps, [applyProps]);

  return (
    <SettingsContext.Provider value={settings}>
      {
        initialized && <Canvas data={data} />
      }
    </SettingsContext.Provider>
  );
};
