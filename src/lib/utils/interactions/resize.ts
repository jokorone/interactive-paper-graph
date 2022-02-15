import React from 'react';

import { select } from 'd3';
import { DefaultSettings } from '../..';

export const useResize = (bounds = DefaultSettings.config.bounds) => {

  const fixAspectRatio = (ref: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    let { width, height } = bounds;
    console.log(bounds);

    if (typeof bounds.resize === 'boolean' && bounds.resize) {
      width = window.innerWidth;
      height = window.innerHeight;
    } else {
      bounds.resize.width && (width = window.innerWidth);
      bounds.resize.height && (height = window.innerHeight);
    }

    if (window.devicePixelRatio) {

      select(ref)
        .attr('width', width * window.devicePixelRatio)
        .attr('height', height * window.devicePixelRatio)
        .style('width', `${width}px`)
        .style('height', `${height}px`);

      context.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  const resizeHandler = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    fixAspectRatio(canvas, context);
  }

  return resizeHandler;
}
