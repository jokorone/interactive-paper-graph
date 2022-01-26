export type InteractionOptions = {
  zoomCallback: (transform: d3.ZoomTransform) => void;
}


export type InteractionTypes = 'drag' | 'wheel' | 'zoom' | 'hover';

export const InteractionCallback = {
  start: () => {},
  observe: () => {},
  stop: () => {},
}

export type InteractionHandlers = {
  [Key in InteractionTypes as `on${Capitalize<Key>}`]?: typeof InteractionCallback
}
