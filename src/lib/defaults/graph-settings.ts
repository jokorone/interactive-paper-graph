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

export const humanSettings = (key: GraphSettingsEnum) => HumanGraphSettingsEnum[key];
const HumanGraphSettingsEnum = {
  [GraphSettingsEnum.chargeForceStrength]: 'charge strength',
  [GraphSettingsEnum.chargeDistanceMin]: 'charge distance min',
  [GraphSettingsEnum.chargeDistanceMax]: 'charge distance max',
  [GraphSettingsEnum.collideStrength]: 'collide strength',
  [GraphSettingsEnum.collideRadius]: 'collide radius',
  [GraphSettingsEnum.linkDistance]: 'link distance',
  [GraphSettingsEnum.forceX]: 'position (x)',
  [GraphSettingsEnum.forceY]: 'position (y)',
};


export type GraphSettingInputConfig = {
  step: number;
  min: number;
  max: number;
}

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
  chargeForceStrength: {
    step: .1,
    min: -200,
    max: 50,
  },
  chargeDistanceMin: {
    step: .1,
    min: 0,
    max: 50,
  },
  chargeDistanceMax: {
    step: .1,
    min: 0,
    max: 2000,
  },
  collideRadius: {
    step: 1,
    min: 0,
    max: 100,
  },
  collideStrength: {
    step: .1,
    min: 0,
    max: 2,
  },
  linkDistance: {
    step: 1,
    min: 0,
    max: 100,
  },
  forceX: {
    step: .001,
    min: 0,
    max: 1,
  },
  forceY: {
    step: .001,
    min: 0,
    max: 1,
  },
}
