import { useGraphSettings } from '../../lib';

import { useTheme } from '../../util/theme';
import { DarkmodeToggle } from './darkmode-toggle';
import { SimulationSettings } from './graph-settings';

export const SettingsContainer = (
    props: ReturnType<typeof useGraphSettings> & ReturnType<typeof useTheme>
  ) => {

  return(<>
    <div className="absolute top-0 right-0">
      <DarkmodeToggle {...props}/>
    </div>

    <div className='absolute bottom-2 right-0'>
      <SimulationSettings {...props}/>
    </div>
  </>);
};
