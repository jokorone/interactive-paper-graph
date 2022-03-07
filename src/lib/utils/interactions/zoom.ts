import React from 'react';

import { D3ZoomEvent } from 'd3';
import { zoom } from 'd3-zoom';

import { Node } from '../../models';
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

export const useZoom = () => {
  const scale = React.useRef<number>(1);

  function createZoomHandler(view: paper.View) {
    const { min, max } = InteractionConfig.Zoom;

    const zoomHandler = ({ transform: { k }, ...event }: D3ZoomEvent<HTMLCanvasElement, Node>) => {
      view.zoom = scale.current = k;
      cancelEvent(event.sourceEvent);
    };


    return zoom()
      .scaleExtent([ min, max ])
      .translateExtent([ [0, 0], [window.innerWidth, window.innerHeight] ])
      .on("zoom", zoomHandler);
  }

  return createZoomHandler;
}
