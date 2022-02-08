import React from "react";
import Paper from "paper";

import { D3DragEvent } from "d3-drag";
import { GraphSettingsEnum, Node } from "./../../models";
import { SettingsContext } from "../settings";

type DragEvent = D3DragEvent<HTMLCanvasElement, Node | HTMLCanvasElement, Node>;

export const usePan = () => {
  const {
    handlers: { pan: settings },
    config: { graph }
  } = React.useContext(SettingsContext);

  const offset = React.useRef<paper.Point>({} as paper.Point);


  const emitUpdateSettings = (delta: paper.Point) => {
    graph.updateSettings(GraphSettingsEnum.forceX, graph.settings.forceX + delta.x);
    graph.updateSettings(GraphSettingsEnum.forceY, graph.settings.forceY + delta.y);
  }

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

        settings.use === 'paper' ? view.translate(delta) : emitUpdateSettings(delta);

      settings.handle.panning();
    }

    const panstop = (e: DragEvent) => {
      settings.handle.panstop();
    }

    return { panstart, panning, panstop }
  }

  return createPanHandler;
}
