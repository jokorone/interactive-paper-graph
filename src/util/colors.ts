import { Theme } from "./theme";

const AppColors = {
  ['dark' as Theme]: {
    canvas: '#2c2b2c',
    items: '#d6d3d1'
  },
  ['light' as Theme]: {
    canvas: '#d6d3d1',
    items: '#2c2b2c'
  }
} as const;

export const useColors = (theme: Theme) => {
  return AppColors[theme];
}
