import { Node, GraphSettingsEnum, NetworkGraphSettingsConfig } from "../models";

export const humanReadable = (key: GraphSettingsEnum) => HumanGraphSettings[key];

const HumanGraphSettings = {
  [GraphSettingsEnum.chargeForceStrength]: 'cozyness',
  [GraphSettingsEnum.chargeDistanceMin]: 'charge distance min',
  [GraphSettingsEnum.chargeDistanceMax]: 'charge distance max',
  [GraphSettingsEnum.collideStrength]: 'collide strength',
  [GraphSettingsEnum.collideRadius]: 'collide radius',
  [GraphSettingsEnum.linkDistance]: 'link distance',
  [GraphSettingsEnum.forceX]: 'position (x)',
  [GraphSettingsEnum.forceY]: 'position (y)',
};

export const DefaultGraphSettings: {
  [key in GraphSettingsEnum]: number
} = {
  chargeForceStrength: -120,
  chargeDistanceMin: 1,
  chargeDistanceMax: 420,
  collideRadius: 5,
  collideStrength: .7,
  linkDistance: 35,
  forceX:.65,
  forceY:.5,
}

export const GraphSettingsInputs = {
  [GraphSettingsEnum.chargeForceStrength]: {
    step: 1,
    min: -200,
    max: 50,
  },
  [GraphSettingsEnum.chargeDistanceMax]: {
    step: 1,
    min: 0,
    max: 1312,
  },
  [GraphSettingsEnum.linkDistance]: {
    step: 1,
    min: 0,
    max: 100,
  },
  // [GraphSettingsEnum.chargeDistanceMin]: {
  //   step: .1,
  //   min: 0,
  //   max: 500,
  // },
  // [GraphSettingsEnum.collideRadius]: {
  //   step: 1,
  //   min: 0,
  //   max: 100,
  // },
  // [GraphSettingsEnum.collideStrength]: {
  //   step: .1,
  //   min: 0,
  //   max: 2,
  // },
  // [GraphSettingsEnum.forceX]: {
  //   step: .1,
  //   min: 0,
  //   max: 100,
  // },
  // [GraphSettingsEnum.forceY]: {
  //   step: .1,
  //   min: 0,
  //   max: 100,
  // },
}

const ZoomHandler = {}
const PanHandler = {}

const HoverHandler = (target: Node | undefined) => {};

const DragHandler = {
  start: (dragTarget: Node) => {},
  observe: (dragTarget: Node) => {},
  stop: () => {},
}

export const DefaultInteractionHandlers = {
  onHover: HoverHandler,
  onDrag: DragHandler,
  onZoom: ZoomHandler,
  onPan: PanHandler
}


export const DefaultNetworkGraphSettings = {
  colors: {
    canvas: 'black',
    items: 'white',
  },
  items: {
    node: {
      radius: 3,
      opacity: .9,
      highlight: {
          radius: 5,
          opacity: 1,
      }
    },
    links: {
      stroke: 1,
      opacity: .5,
      highlight: {
        stroke: 1.5,
        opacity: .9,
      }
    },
    label: {
      show: true,
    },
  },
  simulation: DefaultGraphSettings as typeof DefaultGraphSettings,
  handlers: DefaultInteractionHandlers,
};

export const NetworkGraphSettings = typeof DefaultNetworkGraphSettings;
