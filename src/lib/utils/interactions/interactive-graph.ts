import React from 'react';

import { drag } from 'd3-drag';

import {
  select,
  Simulation,
  D3DragEvent
} from 'd3';

import { KeyValueContainer, Link, Node } from './../../models';

import { SettingsContext } from './../settings';
import { useZoom, useMouse, usePan, useDrag } from './../interactions';

import { cancelEvent } from './../helpers';

const InteractionConfig = {
  Zoom: {
    min: .5,
    max: 1.2,
  },
  Drag: {
    selectionMinDistance: 20
  }
};

export type DragEvent = D3DragEvent<HTMLCanvasElement, Node | HTMLCanvasElement, Node>;

export const useInteractiveGraph = (data: KeyValueContainer<Node>) => {
  const
    { handlers } = React.useContext(SettingsContext),
    { mouse,
      createMouse,
      createMouseMoveHandler } = useMouse(),
    { draggedNode,
      createDragHandler } = useDrag(),
      createZoomHandler = useZoom(),
      createPanHandler = usePan();

  function dragOrPan(
    view: paper.View,
    simulation: Simulation<Node, Link>,
  ) {

    const onDrag = createDragHandler(mouse.current!, simulation);
    const onPan = createPanHandler(view);

    const selectTarget = (): Node | HTMLCanvasElement => {
      const { x, y } = mouse.current!.position;

      return simulation.find(x, y, InteractionConfig.Drag.selectionMinDistance)
        || view.element;
    }

    const start = (event: DragEvent) => {
      (event.subject instanceof HTMLCanvasElement
        ? onPan.panstart
        : onDrag.dragstart
      )(event);
      cancelEvent(event.sourceEvent);
    }

    const observe = (event: DragEvent) => {
      (event.subject instanceof HTMLCanvasElement
        ? onPan.panning
        : onDrag.dragging
      )(event);
      cancelEvent(event.sourceEvent);
    }

    const stop = (event: DragEvent) => {
      (event.subject instanceof HTMLCanvasElement
        ? onPan.panstop
        : onDrag.dragstop
      )(event);
      cancelEvent(event.sourceEvent);
    }

    return drag<HTMLCanvasElement, Node, Node | HTMLCanvasElement>()
      .subject(selectTarget)
      .on('start', start)
      .on('drag', observe)
      .on('end', stop);
  }

  const handleInteraction = (
    current: Node,
    item: paper.Path,
  ) => {
    const
      isHovered = mouse.current!.intersects(item),
      isDragged = current.id === draggedNode.current?.id;

    return { isHovered, isDragged };
  }

  const createClickHandler = (simulation: Simulation<Node, Link>) => {
    return () => {
      const
      { x, y } = mouse.current!.position,
        d3node = simulation.find(x, y, InteractionConfig.Drag.selectionMinDistance),
        target = d3node && data[d3node.id];

      handlers.click.handle([ x, y ], target);
    }
  }

  return (
    project: paper.Project,
    canvas: HTMLCanvasElement,
    simulation: Simulation<Node, Link>,
  ) => {
    createMouse();

    select(canvas)
      .on('mousemove', createMouseMoveHandler(project.view))
      .on('click', createClickHandler(simulation))
      .on('dblclick.zoom', null)
      .call(dragOrPan(project.view, simulation) as any)
      .call(createZoomHandler(project.view) as any);

    return {
      handle: handleInteraction,
      emit: handlers.hover.handle,
    }
  }
}
