import React from 'react';
import { useTheme } from '../../util/theme';
import { ReactComponent as DarkmodeSVG } from './../../icons/darkmode-toggle.svg';

export const DarkmodeToggle = React.memo((props: ReturnType<typeof useTheme>) => {
  return (
    <button onClick={props.toggleTheme} className='icon group'>
      <DarkmodeSVG />
      <span className="tooltip color origin-center right-14 group-hover:scale-100">Toggle theme</span>
    </button>
  );
});
