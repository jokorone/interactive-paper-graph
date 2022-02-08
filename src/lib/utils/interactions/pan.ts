import React from "react";
import Paper from "paper";

import { D3DragEvent } from "d3-drag";
import { Node } from "./../../models";
import { SettingsContext } from "../settings";

type DragEvent = D3DragEvent<HTMLCanvasElement, Node | HTMLCanvasElement, Node>;

export const usePan = () => {
  const { handlers: { pan: settings } } = React.useContext(SettingsContext);

  const offset = React.useRef<paper.Point>({} as paper.Point);

  const createPanHandler = (view: paper.View) => {

    const panstart = (e: DragEvent) => {
      const point = new Paper.Point(Math.floor(e.x), Math.floor(e.y));
      offset.current = view.viewToProject(point);

      settings.handle.panstart();
    }

    const panning = (e: DragEvent) => {
      const
        panReference = view.projectToView(offset.current),
        delta = new Paper.Point(e.x, e.y).subtract(panReference);

      view.translate(delta);
      settings.handle.panning();
    }

    const panstop = (e: DragEvent) => {
      settings.handle.panstop();
    }

    return { panstart, panning, panstop }
  }

  return createPanHandler;
}
