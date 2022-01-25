import Paper from 'paper';
import React from 'react';

import { select } from 'd3';
import { drag } from 'd3-drag';
import { zoom } from 'd3-zoom';

import { Link, Node } from '../models';

const MouseOptions = { position: [0,0], radius: 8, fillColor: new Paper.Color('black'), opacity: .2 };

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

type Gestures = 'drag' | 'wheel' | 'zoom' | 'hover';

type Callback = (...args: any) => any;

type GestureCallbacks = {
  [Key in Gestures as `on${Capitalize<Key>}`]?: GestureCallback;
}

const DefaultCallbacks: GestureCallback = {
  start: () => {},
  observe: () => {},
  stop: () => {}
}

type GestureCallback = {
  start: Callback,
  observe: Callback,
  stop: Callback
}

const InitialOffsets = {
  zoom: 1, // scale provided by D3s transform event prop k
  pan: {} as paper.Point,
}
type InteractionOffsets = typeof InitialOffsets;

export const useInteractions = () => {
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
    const { min, max } = InteractionConfig.Zoom;

    const zoomHandler = ({ transform: { k }, ...event }: d3.D3ZoomEvent<HTMLCanvasElement, Node>) => {
      view.zoom = setZoomLevel(k).zoom;
      cancelEvent(event.sourceEvent);
    }

    return zoom()
      .scaleExtent([min, max])
      .translateExtent([ [0, 0], [window.innerWidth, window.innerHeight] ])
      .on("zoom", zoomHandler);
  }

  function createDragHandler(view: paper.View, simulation: d3.Simulation<Node, Link>, callbacks?: GestureCallbacks) {
    let { start, observe, stop } = (callbacks && callbacks.onDrag) || DefaultCallbacks;

    const selectDragTarget = () => {
      const { x, y } = mouse.current!.position;

      return simulation.find(x, y, InteractionConfig.Drag.selectionMinDistance)
        || view.element;
    }

    const dragstart = (event: DragEvent) => {
      if (event.subject instanceof HTMLCanvasElement) {

        const point = new Paper.Point(Math.floor(event.x), Math.floor(event.y));
        setPanOffset(view.viewToProject(point));

      } else {

        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;

      }
      start();
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

      }
      observe();
      cancelEvent(event.sourceEvent);
    }

    const dragend = (event: DragEvent) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
      draggedNode.current = null;
      stop();
      cancelEvent(event.sourceEvent);
    }

    return drag<Element, unknown, Node>()
      .subject(selectDragTarget as any)
      .on('start', dragstart)
      .on('drag', dragging)
      .on('end', dragend);
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

  const handleResize = (view: paper.View) => {
    const
      { offsetWidth, offsetHeight} = view.element,
      { innerWidth, innerHeight} = window,
        oldBounds = new Paper.Point(offsetWidth, offsetHeight),
        diff = new Paper.Point(innerWidth, innerHeight).subtract(oldBounds);

    view.center = view.center.subtract(diff);
    view.viewSize.set(innerWidth, innerHeight);
  };

  return (
    project: paper.Project,
    canvas: HTMLCanvasElement,
    simulation: d3.Simulation<Node, Link>,
    callbacks?: GestureCallbacks
  ) => {
    mouse.current = new Paper.Path.Circle(MouseOptions);

    const
      { view } = project,
        onZoom = createZoomHandler(view) as any,
        onDrag = createDragHandler(view, simulation, callbacks) as any,
        onMouseMove = createMouseMoveHandler(view);

    select(canvas)
      .on('mousemove', onMouseMove)
      .on('click', (e: MouseEvent) => { console.log('x: ', e.clientX, ' | y: ',e.clientY) })
      .on('dblclick.zoom', null)
      .call(onDrag)
      .call(onZoom);

    return {
      handleResize,
      getMouse: () => mouse.current!,
      getDraggedNode: () => draggedNode.current!,
      reset: createReset(project)
    }
  }
}
