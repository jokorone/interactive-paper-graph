import { GraphSettingsEnum, GraphSettingInputConfig } from "../models/settings";

export const humanReadable = (key: GraphSettingsEnum) => HumanGraphSettings[key];

const HumanGraphSettings = {
  [GraphSettingsEnum.chargeForceStrength]: 'charge strength',
  [GraphSettingsEnum.chargeDistanceMin]: 'charge distance min',
  [GraphSettingsEnum.chargeDistanceMax]: 'charge distance max',
  [GraphSettingsEnum.collideStrength]: 'collide strength',
  [GraphSettingsEnum.collideRadius]: 'collide radius',
  [GraphSettingsEnum.linkDistance]: 'link distance',
  [GraphSettingsEnum.forceX]: 'position (x)',
  [GraphSettingsEnum.forceY]: 'position (y)',
};

export const GraphSettings: {
  [key in GraphSettingsEnum]: number
} = {
  chargeForceStrength: -120,
  chargeDistanceMin: 1,
  chargeDistanceMax: 1420,
  collideRadius: 5,
  collideStrength: .7,
  linkDistance: 35,
  forceX:.65,
  forceY:.5,
}
export type GraphSettings = typeof GraphSettings;

export const GraphSettingsInput: {
  [key in GraphSettingsEnum]: GraphSettingInputConfig
} = {
  [GraphSettingsEnum.chargeForceStrength]: {
    step: .1,
    min: -200,
    max: 50,
  },
  [GraphSettingsEnum.chargeDistanceMin]: {
    step: .1,
    min: 0,
    max: 50,
  },
  [GraphSettingsEnum.chargeDistanceMax]: {
    step: .1,
    min: 0,
    max: 2000,
  },
  [GraphSettingsEnum.collideRadius]: {
    step: 1,
    min: 0,
    max: 100,
  },
  [GraphSettingsEnum.collideStrength]: {
    step: .1,
    min: 0,
    max: 2,
  },
  [GraphSettingsEnum.linkDistance]: {
    step: 1,
    min: 0,
    max: 100,
  },
  [GraphSettingsEnum.forceX]: {
    step: .001,
    min: 0,
    max: 1,
  },
  [GraphSettingsEnum.forceY]: {
    step: .001,
    min: 0,
    max: 1,
  },
}
