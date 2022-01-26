import { UpdateSettings } from '../../lib';
import { ReactComponent as DarkmodeSVG } from './../../icons/darkmode-toggle.svg';

export const DarkmodeToggle = (props: UpdateSettings) => {
  return (
    <button onClick={props.toggleTheme} className='icon group focus:outline-none outline-none active:outline-none'>
      <DarkmodeSVG />
      <span className="tooltip color origin-center right-14 group-hover:scale-100">Toggle theme</span>
    </button>
  );
}