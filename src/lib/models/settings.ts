import { DefaultGraphSettings } from "../defaults";

export enum GraphSettingsEnum {
  chargeForceStrength = 'chargeForceStrength',
  chargeDistanceMin = 'chargeDistanceMin',
  chargeDistanceMax = 'chargeDistanceMax',
  collideStrength = 'collideStrength',
  collideRadius = 'collideRadius',
  linkDistance = 'linkDistance',
  forceX = 'forceX',
  forceY = 'forceY',
};

export type GraphSettings = typeof DefaultGraphSettings;

export type GraphSettingInputConfig = {
  step: number;
  min: number;
  max: number;
}
