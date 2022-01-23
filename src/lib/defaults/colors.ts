import Paper from 'paper';
import { Themes } from '../model/theme';

export const ThemedColors = {
  [Themes.Dark]: {
    primary: '#2c2b2c',
    accent: '#d6d3d1',
    highlight: '',
  },
  [Themes.Light]: {
    primary: '#e7e5e4',
    accent: '#2c2b2c',
    highlight: '',
  },
}

export const PaperColors = {
  [Themes.Dark]: {
    primary: new Paper.Color('#2c2b2c'),
    accent: new Paper.Color('#d6d3d1'),
    highlight: new Paper.Color(''),
  },
  [Themes.Light]: {
    primary: new Paper.Color('#e7e5e4'),
    accent: new Paper.Color('#2c2b2c'),
    highlight: new Paper.Color(''),
  },
}
