import Paper from 'paper';
import { Theme } from '../models/theme';


const ColorPalettes = {
  default: {
    dark: {
      background: '#2c2b2c',
      accent: '#d6d3d1'
    },
    light: {
      background: '#e7e5e4',
      accent: '#2c2b2c'
    }
  }
}

const DarkColors = {
  canvas: '#2c2b2c',
  paper: {
    canvas: new Paper.Color('#2c2b2c'),
    accent: new Paper.Color('#d6d3d1'),
  },
}

const LightColors = {
  canvas: '#e7e5e4',
  paper: {
    canvas: new Paper.Color('#e7e5e4'),
    accent: new Paper.Color('#2c2b2c'),
  },
}

export const AppColors = { ['light' as Theme]: LightColors, ['dark' as Theme]: DarkColors } as const;
