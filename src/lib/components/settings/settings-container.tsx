import React from 'react';
import { SettingsContext, UpdateSettings } from '../../utils/settings';

import { ReactComponent as DarkmodeSVG } from './../../icons/darkmode-toggle.svg'

export const SettingsContainer = () => {
  const { settings, updateSettings } = React.useContext(SettingsContext);

  return(<div className="absolute top-0 right-0">
    <DarkmodeToggle toggleTheme={updateSettings.toggleTheme}/>
    <GraphSettings />
  </div>);
}

const DarkmodeToggle = (props: Partial<UpdateSettings>) => {
  return (
    <button onClick={props.toggleTheme} className='icon group focus:outline-none'>
      <DarkmodeSVG />
      <span className="tooltip color origin-right right-14 group-hover:scale-100">Toggle theme</span>
    </button>
  );
}

const GraphSettings = () => {
  return <></>
}
