import Paper from 'paper';
import React from 'react';

import { select } from 'd3';
import { drag } from 'd3-drag';
import { zoom } from 'd3-zoom';

import { Link, Node } from '../models';

import { SettingsContext } from './settings';

const MouseOptions = { radius: 5, fillColor: new Paper.Color('black'), opacity: .2 };

const InteractionConfig = {
  Zoom: {
    min: .5,
    max: 1.2,
  },
  Drag: {
    selectionMinDistance: 20
  }
};

export type DragEvent = d3.D3DragEvent<HTMLCanvasElement, Node | HTMLCanvasElement, Node>;

const InitialOffsets = {
  zoom: 1, // scale provided by D3s transform event prop k
  pan: {} as paper.Point,
}
type InteractionOffsets = typeof InitialOffsets;

export const useInteractions = () => {
  const { handlers } = React.useContext(SettingsContext);

  const mouse       = React.useRef<paper.Path.Circle>(),
        draggedNode = React.useRef<Node | null>(null);

  const offsets = React.useRef<InteractionOffsets>(InitialOffsets),
    _setOffsets = (
        key: keyof InteractionOffsets
      ) => (
        value: InteractionOffsets[keyof InteractionOffsets]
      ) => (offsets.current = { ...offsets.current, [key]: value }),
    setPanOffset = _setOffsets('pan'),
    setZoomLevel = _setOffsets('zoom');

  function createMouseMoveHandler(view: paper.View) {
    return ({ x, y }: MouseEvent) => {
      mouse.current!.position = view.viewToProject(new Paper.Point(x, y));
    }
  }

  function createZoomHandler(view: paper.View) {
    const zoomHandler = ({ transform: { k }, ...event }: d3.D3ZoomEvent<HTMLCanvasElement, Node>) => {
      view.zoom = setZoomLevel(k).zoom;
      cancelEvent(event.sourceEvent);
    },
    { min, max } = InteractionConfig.Zoom;

    return zoom()
      .scaleExtent([min, max])
      .translateExtent([ [0, 0], [window.innerWidth, window.innerHeight] ])
      .on("zoom", zoomHandler);
  }

  function createDragHandler(view: paper.View, simulation: d3.Simulation<Node, Link>) {
    const { start, observe, stop } = handlers.onDrag;

    const selectDragTarget = (): Node | HTMLCanvasElement => {
      const { x, y } = mouse.current!.position;

      return simulation.find(x, y, InteractionConfig.Drag.selectionMinDistance)
        || view.element;
    }

    const dragstart = (event: DragEvent) => {
      const target = selectDragTarget();

      if (event.subject instanceof HTMLCanvasElement) {

        const point = new Paper.Point(Math.floor(event.x), Math.floor(event.y));
        setPanOffset(view.viewToProject(point));

      } else {

        start!(target as Node);
        if (!event.active) simulation.alphaTarget(0.2).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;

      }
      cancelEvent(event.sourceEvent)
    }

    const dragging = (event: DragEvent) => {
      const eventPoint = new Paper.Point(event.x, event.y);

      if (event.subject instanceof HTMLCanvasElement) {

        const delta = eventPoint.subtract(view.projectToView(offsets.current.pan));
        view.translate(delta);

      } else {

        mouse.current!.position = eventPoint;
        event.subject.fx = eventPoint.x;
        event.subject.fy = eventPoint.y;

        draggedNode.current = event.subject;
        observe(draggedNode.current);
      }

      cancelEvent(event.sourceEvent);
    }

    const dragstop = (event: DragEvent) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;

      if (draggedNode.current) {
        draggedNode.current = null;
        stop!();
      }

      cancelEvent(event.sourceEvent);
    }

    return drag<HTMLCanvasElement, Node, Node | HTMLCanvasElement>()
      .subject(selectDragTarget)
      .on('start', dragstart)
      .on('drag', dragging)
      .on('end', dragstop);
  }

  function cancelEvent(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
  }

  const createReset = (project: paper.Project) => {
    return () => {

    }
  }

  const onResize = (view: paper.View) => {
    const
      { offsetWidth, offsetHeight} = view.element,
      { innerWidth, innerHeight} = window,
        oldBounds = new Paper.Point(offsetWidth, offsetHeight),
        diff = new Paper.Point(innerWidth, innerHeight).subtract(oldBounds);

    view.center = view.center.subtract(diff);
    view.viewSize.set(innerWidth, innerHeight);
  };

  const handleInteraction = (
    current: Node,
    item: paper.Path,
  ) => {
    const
      isHovered = mouse.current!.intersects(item),
      isDragged = current.id === draggedNode.current?.id;

    return { isHovered, isDragged };
  }

  return (
    project: paper.Project,
    canvas: HTMLCanvasElement,
    simulation: d3.Simulation<Node, Link>
  ) => {
    mouse.current = new Paper.Path.Circle(MouseOptions);

    const
      { view } = project,
        onZoom = createZoomHandler(view),
        onDrag = createDragHandler(view, simulation),
        onMouseMove = createMouseMoveHandler(view);

    select(canvas)
      .on('mousemove', onMouseMove)
      .on('click', (e: MouseEvent) => { console.log('x: ', e.clientX, ' | y: ',e.clientY, 'id:', simulation.find(e.x, e.y, 20)?.id ) })
      .on('dblclick.zoom', null)
      .call(onDrag as any)
      .call(onZoom as any);

    return {
      onResize,
      handle: handleInteraction
    }
  }
}
