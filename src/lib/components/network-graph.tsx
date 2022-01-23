import { Canvas } from "./canvas";
import { CanvasSettings } from './settings';

import { ThemeContext, useTheme } from '../util/theme';
import { useGraphData } from '../util/data';

export const NetworkGraph = () => {
  const { theme, toggleTheme } = useTheme(),
        { data } = useGraphData();

  if (!Object.values(data).length) return <></>;

  return (
    <ThemeContext.Provider value={theme}>
      <CanvasSettings toggleTheme={toggleTheme}/>
      <Canvas data={data} />
    </ThemeContext.Provider>
  );
}
