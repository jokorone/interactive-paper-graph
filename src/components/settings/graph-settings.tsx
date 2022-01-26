import React from 'react';

import { GraphSettingInputConfig, GraphSettingsEnum as GraphSetting } from "../../lib";
import { GraphSettingsInputs, humanReadable } from "../../lib/defaults/graph-settings";
import { Settings } from '../../lib';

import { ReactComponent as SettingsSVG } from './../../icons/settings.svg';

export const GraphSettings = (
  props: Settings
) => {
  const [ visible, setVisible ] = React.useState(false);

  const handleGraphSettingsInput = (key: GraphSetting) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.updateSettings.updateGraphSetting(key, +event.target.value);
    }
  }

  const Settings = <div className='flex flex-row'>
    { (Object.entries(GraphSettingsInputs) as [
      [GraphSetting, GraphSettingInputConfig]
    ]).map(
      ([ key, config ]) =>
        <React.Fragment key={key}>
          <SliderInput
            name={key}
            value={props.settings.graph[key]}
            config={config}
            handler={handleGraphSettingsInput(key)}
          />
        </React.Fragment>
      )
    }
  </div>

  const IconToggle =  <button className="icon group focus:outline-none outline-none active:outline-none"
      onClick={() => (console.log('toggle'), setVisible(!visible))}>
      {
        visible ? 'x' : <>
          <SettingsSVG />
          <span className="tooltip color origin-center right-14 group-hover:scale-100">
            Settings
          </span>
        </>
      }
  </button>

  return (<div className='flex flex-row-reverse'>
    {IconToggle}
    {visible && Settings}
  </div>
  );
}



const SliderInput = ({ name, value, config, handler }:{
  name: GraphSetting,
  value: number,
  config: GraphSettingInputConfig,
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void,
}) => {

  return <div className="flex flex-col mx-2 my-auto text-xs w-40 justify-items-between">
    <div className='flex flex-row justify-between'>
      <span className='text-gray-900 dark:text-gray-200'>{humanReadable(name)}</span>
      <span className='text-gray-900 dark:text-gray-200 ml-auto'>{value}</span>
    </div>
    <input type="range" className='appearance-none h-1 w-max outline-none opacity-70 transition-opacity hover:opacity-100'
      id={name}
      min={config.min}
      max={config.max}
      step={config.step}
      value={value}
      onChange={handler}
    />
  </div>
};
