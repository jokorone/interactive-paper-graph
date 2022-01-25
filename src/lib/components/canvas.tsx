import React from 'react';
import Paper from 'paper';
import { select } from 'd3';

import { PaperModel } from '../../lib/models/paper';
import { Node, KeyValueContainer } from '../../lib/models';

import { useSimulation } from '../utils/simulation';
import { usePaperItems } from '../utils/paper';
import { useInteractions } from '../utils/interactions';
import { SettingsContext } from '../utils/settings';

type CanvasProps = {
  data: KeyValueContainer<Node>;
}
export const Canvas = React.memo(({ data }: CanvasProps) => {
  const
    { settings: { colors } } = React.useContext(SettingsContext),

    ref          = React.useRef<HTMLCanvasElement | null>(null),
    project      = React.useRef<paper.Project | null>(null),
    items        = React.useRef<PaperModel | null>(null),
    context      = React.useRef<CanvasRenderingContext2D | null>(),
    interaction  = React.useRef<ReturnType<typeof registerInteractionHandlers>>(),

    { simulation } = useSimulation(data),
    { createPaperItems, getItemUpdater, create } = usePaperItems(data),
    registerInteractionHandlers = useInteractions();

  React.useEffect(() => {
    project.current = new Paper.Project(ref.current!);
    context.current = ref.current!.getContext('2d');
    fixAspectRatio();
  }, []);

  const setupCanvas = React.useCallback(
    () => {
      items.current = createPaperItems();
      project.current!.view.onFrame = draw;

      interaction.current = registerInteractionHandlers(
        project.current!,
        ref.current!,
        simulation,
        { onDrag: {
          // arg: Node (from d3 simulation)
          // need to find PaperNode here to create/update LinkHints
          // maybe pass all items (and logic) to interaction
          start: () => {},
          observe: () => {},
          stop: () => {}
        } }
      );

      return () => project.current!.clear();
    },
    [ref.current, data, createPaperItems]
  );
  React.useEffect(setupCanvas, [setupCanvas]);

  const updateCanvasTheme = React.useCallback(
    () => {
      const fillColor = colors.paper.canvas;

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
            options = { duration, easing: 'easeInQuad'},
            from = { scaling: 0.001 },
            to = { scaling: 1, fillColor };

      path.sendToBack();
      path.tween(from, to, options);

      select(ref.current)
        .transition()
        .duration(duration)
        .delay(delay)
        .style('background', colors.canvas)

      setTimeout(() => path.remove(), delayed);
    },
    [colors]
  );
  React.useEffect(updateCanvasTheme, [updateCanvasTheme]);

  function draw() {
    context.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if ( !simulation.nodes().length
      || !items.current
      || !interaction.current) return;

    const { getMouse, getDraggedNode } = interaction.current,
          mouse = getMouse(),
          draggedNode = getDraggedNode(),
          update = getItemUpdater()!;

    let index = 0;
    for (const d3node of simulation.nodes()) {

      const { node, links } = items.current![index];
      let label = items.current![index].label;

      const nodeIsHovered = mouse.intersects(node),
            nodeIsDragged = d3node.id === draggedNode?.id;

      node.position = create.point(d3node);

      if (nodeIsHovered || nodeIsDragged) {

        if (!label) {
          label
            = items.current![index].label
            = create.label(d3node.id);
        }
        update.highlight(node, label);

      } else {

        update.node(d3node, node);

        if (label) {
          label
            = items.current![index].label
            = update.remove(label);
        }
      }

      for (const [_targetId, { target, path }] of Object.entries(links)) {
        update.link(nodeIsHovered, d3node, target, path);
      }

      ++index;
    }
  }

  React.useEffect(() => {
    const resizeHandler = () => {
      interaction.current!.handleResize(project.current!.view)
      fixAspectRatio();
    };

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  function fixAspectRatio() {
    const  { devicePixelRatio, innerWidth, innerHeight } = window;

    if (window.devicePixelRatio) {
      select(ref.current)
        .attr('width', innerWidth * devicePixelRatio)
        .attr('height', innerHeight * devicePixelRatio)
        .style('width', `${innerWidth}px`)
        .style('height', `${innerHeight}px`);

      context.current!.scale(devicePixelRatio, devicePixelRatio);
    }
  }

  return (<>
    {ref.current && <button className='m-2 p-2 fixed bottom-0 right-0' onClick={interaction.current!.reset}>reset</button>}
    <canvas ref={ref}></canvas>
  </>);
});
