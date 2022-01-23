import Paper from 'paper';
import * as d3 from 'd3';


type DelayCallbacks = {
  delay: number,
  callback: () => void,
}[];
export const useAnimations = () => {

  function changeCanvasTheme(canvas: HTMLCanvasElement, fillColor: string, steps: DelayCallbacks) {
    const path = new Paper.Path.Circle({
      fillColor,
      center: [ window.innerWidth, 0 ],
      applyMatrix: false,
      radius: window.innerWidth * 3,
      scale: 1
    });

    const duration = 450,
          delay = 200,
          delayed = duration + delay,
          options = { duration, easing: 'easeInQuad' };

    path.sendToBack();

    const from = { scaling: 0.001 },
          to = { scaling: 1, fillColor: fillColor };

    path.tween(from, to, options);

    d3.select(canvas)
      .transition()
      .duration(delay)
      .delay(duration)
      .style('background', fillColor)

    for (const { delay, callback } of steps) {
      setTimeout(callback, delay);
    }

    setTimeout(() => path.remove(), delayed);
  }

  return { changeCanvasTheme }
}
