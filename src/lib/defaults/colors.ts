import Paper from 'paper';
import { Themes } from '../models/theme';

export const ThemedColors = {
  dark: {
    primary: '#2c2b2c',
    accent: '#d6d3d1',
    highlight: '',
  },
  light: {
    primary: '#e7e5e4',
    accent: '#2c2b2c',
    highlight: '',
  },
}

export const PaperColors = {
  dark: {
    primary: new Paper.Color('#2c2b2c'),
    accent: new Paper.Color('#d6d3d1'),
    highlight: new Paper.Color(''),
  },
  light: {
    primary: new Paper.Color('#e7e5e4'),
    accent: new Paper.Color('#2c2b2c'),
    highlight: new Paper.Color(''),
  },
}
