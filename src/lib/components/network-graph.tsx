import React from 'react';
import { Canvas } from "./canvas";
import { useGraphData } from '../utils/data';

import { SettingsContext, useSettings } from '../utils/settings';
import { RawNode, RawLink } from './../models';


type DefaultGraphProps =  {
  options?: ReturnType<typeof useSettings>,
  data: {
    nodes: RawNode[],
    links: RawLink[]
  }
};

export type NetworkGraphProps = {
  nodes: RawNode[], links: RawLink[]
}
export const NetworkGraph = (props: DefaultGraphProps) => {
  const { data } = useGraphData(props.data);
  let fallbackSettings = useSettings();

  if (!Object.values(props.data).length) return <></>;

  return (
      <SettingsContext.Provider value={props.options || fallbackSettings}>
        <Canvas data={data} />
      </SettingsContext.Provider>
  );
};
