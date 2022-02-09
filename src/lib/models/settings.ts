import { DefaultSimulationSettings } from "../defaults";

export enum SimulationSettingsEnum {
  chargeForceStrength = 'chargeForceStrength',
  chargeDistanceMin = 'chargeDistanceMin',
  chargeDistanceMax = 'chargeDistanceMax',
  collideStrength = 'collideStrength',
  collideRadius = 'collideRadius',
  linkDistance = 'linkDistance',
  forceX = 'forceX',
  forceY = 'forceY',
};

export type SimulationSettings = typeof DefaultSimulationSettings;

export type GraphSettingInputConfig = {
  step: number;
  min: number;
  max: number;
}
