import React from 'react';
import { Canvas } from "./canvas";

import { deepmerge } from 'deepmerge-ts'
import { SettingsContext, useGraphData } from '../utils';

import { RawNode, RawLink, InteractionHandlers } from './../models';
import { DefaultNetworkSimulationSettings } from '../defaults';

type DefaultGraphProps =  {
  data: {
    nodes: RawNode[],
    links: RawLink[]
  },
  config?: {
    colors?: typeof DefaultNetworkSimulationSettings.config.colors,
    bounds?: {
      width?: number;
      height?: number;
      resize?: {
          width: boolean;
          height: boolean;
      } | boolean,
    },
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
    graph?: typeof DefaultNetworkSimulationSettings.config.graph
  },
  handlers?: InteractionHandlers,
};
export const NetworkGraph = (props: DefaultGraphProps) => {

  const { data: _data, ...userSettings } = props,
    data = useGraphData(_data),
    initialized = Object.keys(data).length;

  const [ settings, setSettings ] = React.useState(DefaultNetworkSimulationSettings);

  const applyProps = React.useCallback(
    () => {
      setSettings(deepmerge(
        DefaultNetworkSimulationSettings,
        userSettings as typeof DefaultNetworkSimulationSettings
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
