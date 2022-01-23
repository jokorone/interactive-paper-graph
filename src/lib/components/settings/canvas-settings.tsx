import React from 'react';
import { useTheme } from '../../utils/theme';
import { ReactComponent as DarkmodeSVG } from './../../icons/darkmode-toggle.svg'


type DarkmodeToggleProps = {
  toggleTheme: () => void
}

export const CanvasSettings = (props: DarkmodeToggleProps) => {

  return <div className="absolute top-0 right-0">
    <DarkmodeToggle toggleTheme={props.toggleTheme}/>
  </div>
}

export const DarkmodeToggle = ({ toggleTheme }: DarkmodeToggleProps) => {
  return (
    <button onClick={toggleTheme} className='icon group focus:outline-none'>
      <DarkmodeSVG />
      <span className="tooltip color origin-right right-14 group-hover:scale-100">Toggle theme</span>
    </button>
  );
}
