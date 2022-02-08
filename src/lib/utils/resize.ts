import React from 'react';
import { select } from 'd3';

export const useResize = () => {

  const fixAspectRatio = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const  { devicePixelRatio, innerWidth, innerHeight } = window;

    if (window.devicePixelRatio) {
      select(canvas)
        .attr('width', innerWidth * devicePixelRatio)
        .attr('height', innerHeight * devicePixelRatio)
        .style('width', `${innerWidth}px`)
        .style('height', `${innerHeight}px`);

      context.scale(devicePixelRatio, devicePixelRatio);
    }
  }

  const resizeHandler = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    fixAspectRatio(canvas, context);
  }

  return {
    resizeHandler,
    add:       (listener: () => void) => window.addEventListener('resize', listener),
    removeListener: (listener: () => void) => window.removeEventListener('resize', listener),
  }
}
