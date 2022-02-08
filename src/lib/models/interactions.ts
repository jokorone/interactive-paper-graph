import { DefaultInteractionHandlers } from "..";

export type InteractionHandlers = {
  pan?: {
    use: string;
    handle?: typeof DefaultInteractionHandlers.pan.handle
  };
  zoom?: {
      use: string;
      handle?: typeof DefaultInteractionHandlers.zoom.handle
  };
  drag?: {
      handle: typeof DefaultInteractionHandlers.drag.handle
  };
  hover?: typeof DefaultInteractionHandlers.hover,
  click?: typeof DefaultInteractionHandlers.click
}
