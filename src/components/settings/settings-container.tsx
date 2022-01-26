import { Settings } from './../../lib';
import { DarkmodeToggle } from './darkmode-toggle';
import { GraphSettings } from './graph-settings';

export const SettingsContainer = (
    props: Settings
  ) => {

  return(<>

    <div className="absolute top-0 right-0">
      <DarkmodeToggle {...props.updateSettings}/>
    </div>

    <div className='absolute bottom-2 right-0'>
      <GraphSettings {...props}/>
    </div>

  </>);
};
