import { DefaultInteractionHandlers } from "..";

export type InteractionHandlers = {
  pan?: {
    handle?: typeof DefaultInteractionHandlers.pan.handle
  };
  zoom?: {
      handle?: typeof DefaultInteractionHandlers.zoom.handle
  };
  drag?: {
      handle: typeof DefaultInteractionHandlers.drag.handle
  };
  hover?: typeof DefaultInteractionHandlers.hover,
  click?: typeof DefaultInteractionHandlers.click
}
