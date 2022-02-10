import { Node, SimulationSettingsEnum } from "../models";

export const humanReadable = (key: SimulationSettingsEnum) => HumanSimulationSettings[key];

const HumanSimulationSettings = {
  [SimulationSettingsEnum.chargeForceStrength]: 'cozyness',
  [SimulationSettingsEnum.chargeDistanceMin]: 'charge distance min',
  [SimulationSettingsEnum.chargeDistanceMax]: 'charge distance max',
  [SimulationSettingsEnum.collideStrength]: 'collide strength',
  [SimulationSettingsEnum.collideRadius]: 'collide radius',
  [SimulationSettingsEnum.linkDistance]: 'link distance',
  [SimulationSettingsEnum.forceX]: 'position (x)',
  [SimulationSettingsEnum.forceY]: 'position (y)',
};

export const DefaultSimulationSettings: {
  [key in SimulationSettingsEnum]: number
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

export const SimulationSettingsInputs = {
  [SimulationSettingsEnum.chargeForceStrength]: {
    step: 1,
    min: -200,
    max: 50,
  },
  [SimulationSettingsEnum.chargeDistanceMax]: {
    step: 1,
    min: 0,
    max: 1312,
  },
  [SimulationSettingsEnum.linkDistance]: {
    step: 1,
    min: 0,
    max: 100,
  },
  [SimulationSettingsEnum.chargeDistanceMin]: {
    step: .1,
    min: 0,
    max: 500,
  },
  // [SimulationSettingsEnum.collideRadius]: {
  //   step: 1,
  //   min: 0,
  //   max: 100,
  // },
  // [SimulationSettingsEnum.collideStrength]: {
  //   step: .1,
  //   min: 0,
  //   max: 2,
  // },
  [SimulationSettingsEnum.forceX]: {
    step: 1,
    min: 0,
    max: window.innerWidth * 1.75,
  },
  [SimulationSettingsEnum.forceY]: {
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
    handle: PanHandler
  },
  zoom: {
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

export const DefaultSettings = {
  config: {
    colors: {
      canvas: 'black',
      items: 'white',
    },
    bounds: {
      width: 800,
      height: 600,
      resize: {  width: false, height: false }
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
      settings: DefaultSimulationSettings as typeof DefaultSimulationSettings
    },
  },
  handlers: DefaultInteractionHandlers,
};
