import React from 'react';
import { Canvas } from "./canvas";
import { useGraphData } from '../utils/data';

import { SettingsContext, useSettings } from '../utils/settings';
import { RawNode, RawLink, InteractionHandlers } from './../models';


type DefaultGraphProps =  {
  data: {
    nodes: RawNode[],
    links: RawLink[]
  },
  options?: ReturnType<typeof useSettings>,
};

export type NetworkGraphProps = {
  nodes: RawNode[], links: RawLink[]
}
export const NetworkGraph = (props: DefaultGraphProps) => {

  const settings = useSettings(props.options),
        data = useGraphData(props.data),
        initialized = Object.keys(data).length > 0;

  return (
    <SettingsContext.Provider value={ props?.options || settings }>
      {
        initialized &&
          <Canvas data={data} />
      }
    </SettingsContext.Provider>
  );
};
