import React from 'react';
import Paper from 'paper';
import { select } from 'd3';

import { PaperModel } from '../../lib/models/paper';
import { Node, KeyValueContainer } from '../../lib/models';

import {
  SettingsContext,
  useSimulation,
  usePaperItems,
  useInteractions
} from './../utils';

type CanvasProps = {
  data: KeyValueContainer<Node>;
}
export const Canvas = React.memo((
  { data }: CanvasProps
) => {
  const
    { colors, items: config } = React.useContext(SettingsContext),

    ref          = React.useRef<HTMLCanvasElement | null>(null),
    project      = React.useRef<paper.Project | null>(null),
    items        = React.useRef<PaperModel | null>(null),
    context      = React.useRef<CanvasRenderingContext2D | null>(),
    interaction  = React.useRef<ReturnType<typeof registerInteractionHandlers>>(),

    simulation = useSimulation(data),
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
      );

      return () => project.current!.clear();
    },
    [data]
  );
  React.useEffect(setupCanvas, [setupCanvas]);

  const updateCanvasTheme = React.useCallback(
    () => {
      select(ref.current).transition()
        .duration(200).delay(100)
        .style('background', colors.canvas)
    },
    [colors]
  );

  React.useEffect(updateCanvasTheme, [updateCanvasTheme]);

  function draw(frameEvent: {
    count: number,
    time: number,
    delta: number,
  }) {
    context.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if ( !simulation.nodes().length
      || !items.current
      || !interaction.current) return;

    const update = getItemUpdater()!;

    let index = 0,
        highlights: Node[] = [];
    for (const d3node of simulation.nodes()) {

      const { node, links, ...currentItem } = items.current![index];

      let label = currentItem.label;

      const { isHovered, isDragged } = interaction.current.handle(
        d3node, node
      );

      currentItem.is = {
        hovered: isHovered,
        dragged: isDragged,
        highlight: isHovered || isDragged,
      }

      node.position = create.point(d3node);

      if (currentItem.is.highlight) {
        highlights.push(currentItem.payload);

        if (config.label.show && !label) {
          label
            = items.current![index].label
            = create.label(d3node.id);
        }

        update.highlight(node, label || undefined);
      } else {

        update.node(d3node, node);

        if (label) {
          label
            = items.current![index].label
            = update.remove(label);
        }
      }

      for (const [_targetId, { target, path }] of Object.entries(links)) {
        update.link(isHovered, d3node, target, path);
      }

      items.current![index].is = currentItem.is;

      ++index;
    }

    (frameEvent.count % 16 === 0)
      && interaction.current!.emit(highlights.pop());
  }

  React.useEffect(() => {
    const resizeHandler = () => {
      interaction.current!.onResize(project.current!.view)
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

  return (<canvas ref={ref}></canvas>);
});
