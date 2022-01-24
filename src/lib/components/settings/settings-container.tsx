import React from 'react';
import { GraphSettingsInputs, humanReadable } from '../../defaults/graph-settings';
import { GraphSettingInputConfig, GraphSettingsEnum } from '../../models/settings';
import { SettingsContext, UpdateSettings } from '../../utils/settings';

import { ReactComponent as DarkmodeSVG } from './../../icons/darkmode-toggle.svg'

export const SettingsContainer = React.memo(() => {
  const { settings: { graph }, updateSettings } = React.useContext(SettingsContext);

  const handleGraphSettingsInput = (key: GraphSettingsEnum) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      updateSettings.updateGraphSetting(key, +event.target.value);
    }
  }

  return(<>

    <div className="absolute top-0 right-0">
      <DarkmodeToggle {...updateSettings}/>
    </div>

    <div className='absolute bottom-0 right-0 h-16 flex flex-row align-baseline'>
      { (Object.entries(GraphSettingsInputs) as [
        [GraphSettingsEnum, GraphSettingInputConfig]
      ]).map(
          ( [key,config] ) => (
            <span key={key}>
              <SliderInput
                name={key}
                value={graph[key]}
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
    <button onClick={props.toggleTheme} className='icon group focus:outline-none'>
      <DarkmodeSVG />
      <span className="tooltip color origin-right right-14 group-hover:scale-100">Toggle theme</span>
    </button>
  );
}

const SliderInput = ({ name, value, config, handler }:{
  name: GraphSettingsEnum,
  value: number,
  config: GraphSettingInputConfig,
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void,
}) => {

  return <div className="flex flex-col m-2 text-xs w-40 dark:text-gray-300 justify-items-between">
    <span className=''>{humanReadable(name)}</span>
    <span className='ml-auto'>{value}</span>
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
