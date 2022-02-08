import { Node, GraphSettingsEnum } from "../models";

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
  collideStrength: 0,
  linkDistance: 35,
  forceX: Math.floor(window.innerWidth * .65),
  forceY: Math.floor(window.innerHeight * .5),
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
  [GraphSettingsEnum.chargeDistanceMin]: {
    step: .1,
    min: 0,
    max: 500,
  },
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
  [GraphSettingsEnum.forceX]: {
    step: 1,
    min: 0,
    max: window.innerWidth * 1.75,
  },
  [GraphSettingsEnum.forceY]: {
    step: 1,
    min: 0,
    max: window.innerHeight * 1.75,
  },
}

const ZoomHandler = {
  zoomstart: () => {},
  zooming: () => {},
  zoomstop: () => {}
}

const PanHandler = {
  panstart: () => {},
  panning: () => {},
  panstop: () => {},
}

const HoverHandler = (target: Node | undefined) => {};

const DragHandler = {
  dragstart: (dragTarget: Node) => {},
  dragging: (dragTarget: Node) => {},
  dragstop: () => {},
}

const ClickHandler = (pos: [number, number], target?: Node) => {}

export const DefaultInteractionHandlers = {
  pan: {
    use: 'paper',
    handle: PanHandler
  },
  zoom: {
    use: 'paper',
    handle: ZoomHandler
  },
  drag: {
    handle: DragHandler
  },
  hover: {
    handle: HoverHandler
  },
  click: {
    handle: ClickHandler
  }
}

export const DefaultNetworkGraphSettings = {
  config: {
    colors: {
      canvas: 'black',
      items: 'white',
    },
    canvas: {
      width: '100%',
      height: 'auto',
    },
    paper: {
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
    graph: {
      updateSettings: (key: GraphSettingsEnum, value: number) => {},
      settings: DefaultGraphSettings as typeof DefaultGraphSettings
    },
  },
  handlers: DefaultInteractionHandlers,
};
