import { InteractionHandlers } from './interactions';
import { GraphSettings } from './settings';

export * from './data';
export * from './interactions';
export * from './paper';
export * from './settings';

export type NetworkGraphSettingsConfig = {
  colors?: {
      canvas?: string;
      items?: string;
  };
  items?: {
      node?: {
          radius?: number;
          opacity?: number;
          highlight?: {
              radius?: number;
              opacity?: number;
          };
      };
      links?: {
          stroke?: number;
          opacity?: number;
          highlight?: {
              stroke?: number;
              opacity?: number;
          };
      };
      label?: {
        show?: boolean,
        showOnHover?: boolean,
      };
  };
  simulation?: GraphSettings
  handlers?: InteractionHandlers
}
