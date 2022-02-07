import React from "react";
import Paper from "paper";

import { D3DragEvent } from "d3-drag";
import { Node } from "./../models";

type DragEvent = D3DragEvent<HTMLCanvasElement, Node | HTMLCanvasElement, Node>;

export const usePan = () => {

  const offset = React.useRef<paper.Point>({} as paper.Point);

  const createPanHandler = (view: paper.View) => {

    const panstart = (e: DragEvent) => {
      const point = new Paper.Point(Math.floor(e.x), Math.floor(e.y));
      offset.current = view.viewToProject(point);
    }

    const panning = (e: DragEvent) => {
      const
        eventPoint = new Paper.Point(e.x, e.y),
        panReference = view.projectToView(offset.current),
        delta = eventPoint.subtract(panReference);

      view.translate(delta);
    }

    const panstop = (e: DragEvent) => {

    }


    return { panstart, panning, panstop }
  }

  return createPanHandler;
}
