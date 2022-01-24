import Paper from 'paper';
import { select } from 'd3';

export const useAnimations = () => {

  function changeCanvasTheme(canvas: HTMLCanvasElement, fillColor: string) {
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

    select(canvas)
      .transition()
      .duration(delay)
      .delay(duration)
      .style('background', fillColor)

    setTimeout(() => path.remove(), delayed);
  }

  return { changeCanvasTheme }
}
