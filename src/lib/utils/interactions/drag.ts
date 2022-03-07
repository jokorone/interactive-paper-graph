import React from "react";
import Paper from "paper";

import { D3DragEvent } from "d3-drag";
import { Simulation } from "d3-force";

import { Node, Link, KeyValueContainer } from './../../models';
import { DefaultInteractionHandlers } from "../../defaults";

type DragEvent = D3DragEvent<HTMLCanvasElement, Node | HTMLCanvasElement, Node>;

type DraggedNode = Node & { hints: KeyValueContainer<paper.Path> }

export const useDrag = (drag = DefaultInteractionHandlers.drag) => {
  const draggedNode = React.useRef<DraggedNode | null>(null);

  const createDragHandler = (mouse: paper.Path, simulation: Simulation<Node, Link>) => {

    const dragstart = (event: DragEvent) => {
      drag.handle.dragstart(event.subject);
      if (!event.active) simulation.alphaTarget(0.2).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    const dragging = (event: DragEvent) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;

      mouse.position = new Paper.Point(event.x, event.y);

      draggedNode.current = {
        ...event.subject,
        hints: draggedNode.current?.hints || {}
      };

      drag.handle.dragging(draggedNode.current);
    }

    const dragstop = (event: DragEvent) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;

      if (draggedNode.current) {
        Object.values(draggedNode.current.hints).map(path => path.remove());
        draggedNode.current = null;
        drag.handle.dragstop();
      }
    }

    return { dragstart, dragging, dragstop }
  }

  return { createDragHandler, draggedNode };

}
