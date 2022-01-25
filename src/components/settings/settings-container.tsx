import React from 'react';

import { GraphSettingsInputs, humanReadable } from '../../lib/defaults/graph-settings';
import { UpdateSettings, useSettings } from './../../lib';
import { GraphSettingInputConfig, GraphSettingsEnum as GraphSetting } from '../../lib/models';

import { ReactComponent as DarkmodeSVG } from './../../icons/darkmode-toggle.svg';

export const SettingsContainer = React.memo((
    props: ReturnType<typeof useSettings>
  ) => {
  const handleGraphSettingsInput = (key: GraphSetting) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      props.updateSettings.updateGraphSetting(key, +event.target.value);
    }
  }

  return(<>

    <div className="absolute top-0 right-0">
      <DarkmodeToggle {...props.updateSettings}/>
    </div>

    <div className='absolute bottom-0 right-0 h-16 flex flex-row align-baseline'>
      { (Object.entries(GraphSettingsInputs) as [
        [GraphSetting, GraphSettingInputConfig]
      ]).map(
          ( [key,config] ) => (
            <span key={key}>
              <SliderInput
                name={key}
                value={props.settings.graph[key]}
                config={config}
                handler={handleGraphSettingsInput(key)}
              />
            </span>
          )
        )
      }
      </div>

  </>);
});

const DarkmodeToggle = (props: Partial<UpdateSettings>) => {
  return (
    <button onClick={props.toggleTheme} className='icon group focus:outline-none outline-none active:outline-none'>
      <DarkmodeSVG />
      <span className="tooltip color origin-center right-14 group-hover:scale-100">Toggle theme</span>
    </button>
  );
}

const SliderInput = ({ name, value, config, handler }:{
  name: GraphSetting,
  value: number,
  config: GraphSettingInputConfig,
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void,
}) => {

  return <div className="flex flex-col m-2 text-xs w-40 justify-items-between">
    <div className='flex flex-row justify-between'>
      <span className='text-gray-900 dark:text-gray-200'>{humanReadable(name)}</span>
      <span className='text-gray-900 dark:text-gray-200 ml-auto'>{value}</span>
    </div>
    <input type="range" className='appearance-none h-1 w-28 outline-none opacity-70 transition-opacity hover:opacity-100'
      id={name}
      min={config.min}
      max={config.max}
      step={config.step}
      value={value}
      onChange={handler}
    />
  </div>
};
