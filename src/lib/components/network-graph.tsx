import React from 'react';
import { Canvas } from "./canvas";

import { deepmerge } from 'deepmerge-ts'
import { SettingsContext, useGraphData } from '../utils';

import { RawNode, RawLink, InteractionHandlers } from './../models';
import { DefaultSettings } from '../defaults';

type DefaultGraphProps =  {
  data: {
    nodes: RawNode[],
    links: RawLink[]
  },
  config?: {
    colors?: typeof DefaultSettings.config.colors,
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
    graph?: typeof DefaultSettings.config.graph
  },
  handlers?: InteractionHandlers,
}

type Settings = Omit<DefaultGraphProps, 'data'> & typeof DefaultSettings;

export const NetworkGraph = React.memo((props: DefaultGraphProps) => {
  const [ settings, setSettings ] = React.useState<Settings>(DefaultSettings);

  const data    = useGraphData(props.data),
    initialized = Object.keys(data).length;

  const applyProps = React.useCallback(
    () => {
      setSettings(deepmerge(
        DefaultSettings,
        props as Settings
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
});
