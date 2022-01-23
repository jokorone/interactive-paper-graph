import React from 'react';
import Paper from 'paper';
import { select } from 'd3';

import { useSimulation } from '../../utils/simulation';
import { usePaperItems } from '../../utils/paper';

import { PaperModel } from '../../models/paper';
import { useThemedColors } from '../../utils/colors';
import { Node, KeyValueContainer } from '../../models';

import { useAnimations } from '../../utils/animations';
import { useInteractions } from '../../utils/interaction';

type CanvasProps = {
  data: KeyValueContainer<Node>;
}
export const Canvas = ({ data }: CanvasProps) => {

  const
    ref         = React.useRef<HTMLCanvasElement | null>(null),
    project     = React.useRef<paper.Project | null>(null),
    items       = React.useRef<PaperModel | null>(null),
    context     = React.useRef<CanvasRenderingContext2D | null>(),
    update      = React.useRef<ReturnType<typeof makeItemUpdater> | null>(null),
    interaction = React.useRef<ReturnType<typeof registerInteractionHandlers>>(),

    { simulation, updateSimulationData } = useSimulation(),
    { createPaperItems, makeItemUpdater, create } = usePaperItems(data),
    { hexColors, paperColors }           = useThemedColors(),
    { changeCanvasTheme }                = useAnimations(),
    registerInteractionHandlers              = useInteractions();

  React.useEffect(() => {
    project.current = new Paper.Project(ref.current!);
    context.current = ref.current!.getContext('2d');
    fixAspectRatio();
  }, []);

  const initializeInteractivity = React.useCallback(
    () => {
      console.log('reset interactivity');

      interaction.current = registerInteractionHandlers(
        project.current!,
        ref.current!,
        simulation,
      );
    },
    [data, hexColors]
  );

  React.useEffect(() => {
    updateSimulationData(data);
    initializeInteractivity();

    items.current = createPaperItems();
    project.current!.view.onFrame = draw;

    return () => {
      console.log('stop & recreate canvas');
      simulation.stop();
      project.current?.activeLayer.remove();
    };
  }, [data]);

  const updateItemUpdater = () => {
    update.current = makeItemUpdater();
  }

  const updateCanvasTheme = React.useCallback(
    () => { items.current!.length && changeTheme() },
    [hexColors]
  );
  React.useEffect(updateCanvasTheme, [updateCanvasTheme]);

  const changeTheme = () => {
    const delayed = { delay: 200, callback: updateItemUpdater };
    changeCanvasTheme(ref.current!, hexColors.primary, [delayed]);
  };

  function draw() {
    context.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if ( !simulation.nodes().length
      || !items.current!.length
      || !update.current!
      || !interaction.current) return;

    const { getMouse, getDraggedNode } = interaction.current,
          mouse = getMouse(),
          draggedNode = getDraggedNode();

    let index = 0;
    for (const d3node of simulation.nodes()) {
      const { node, links } = items.current![index];
      let label = items.current![index].label;

      const nodeIsHovered = mouse.intersects(node) || mouse.contains(node.position),
            nodeIsDragged = d3node.id === draggedNode?.id;

      node.position = create.point(d3node);

      if (nodeIsHovered || nodeIsDragged) {
        if (!label) {
          label
            = items.current![index].label
            = create.label(d3node.id);
        }

        update.current.highlight(node, label);
      } else {
        update.current.node(d3node, node);

        if (label) {
          label
            = items.current![index].label
            = update.current.remove(label);
        }
      }

      for (const [_targetId, { target, path }] of Object.entries(links)) {
        update.current.link(nodeIsHovered, d3node, target, path);
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
  }, [interaction.current]);

  function fixAspectRatio() {
    const  { devicePixelRatio: scale, innerWidth, innerHeight } = window;

    if (window.devicePixelRatio) {
      select(ref.current)
        .attr('width', innerWidth * scale)
        .attr('height', innerHeight * scale)
        .style('width', `${innerWidth}px`)
        .style('height', `${innerHeight}px`);

      context.current!.scale(scale, scale);
    }
  }

  return (<>
    {ref.current && <button className='m-2 p-2 fixed bottom-0 right-0' onClick={interaction.current!.reset}>reset</button>}
    <canvas ref={ref}></canvas>
  </>);
}

const stop = (message: string) => void 0; //console.warn(message);
