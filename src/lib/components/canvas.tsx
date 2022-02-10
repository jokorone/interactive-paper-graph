import React from 'react';
import Paper from 'paper';
import { select } from 'd3';

import { Node, KeyValueContainer, PaperModel } from './../models';

import {
  SettingsContext,
  useSimulation,
  usePaperItems,
  useResize,
  useInteractiveGraph
} from './../utils';

type CanvasProps = {
  data: KeyValueContainer<Node>;
}
export const Canvas = React.memo((
  { data }: CanvasProps
) => {
  const { config } = React.useContext(SettingsContext),
    ref            = React.useRef<HTMLCanvasElement | null>(null),
    project        = React.useRef<paper.Project | null>(),
    items          = React.useRef<PaperModel | null>(),
    context        = React.useRef<CanvasRenderingContext2D | null>(),
    interaction    = React.useRef<ReturnType<typeof initHandlers>>(),

    simulation     = useSimulation(data),
    paper          = usePaperItems(data),
    initHandlers   = useInteractiveGraph(data),
    resizeHandler  = useResize();

  const resizeCanvas = () => {
    resizeHandler(ref.current!, context.current!);
  }

  React.useEffect(() => {
    project.current = new Paper.Project(ref.current!);
    context.current = ref.current!.getContext('2d');

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const setupCanvas = React.useCallback(
    () => {
      console.log('setup');

      items.current = paper.createPaperItems();
      project.current!.view.onFrame = draw;

      interaction.current = initHandlers(
        project.current!,
        ref.current!,
        simulation
      );

      return () => project.current!.clear();
    },
    [data]
  );
  React.useEffect(setupCanvas, [setupCanvas]);
  console.log('canvas');

  const updateCanvasTheme = React.useCallback(
    () => {
      select(ref.current).transition()
        .duration(100)
        .style('background', config.colors.canvas);
    },
    [config.colors]
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

    const update = paper.getItemUpdater()!;

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

      node.position = paper.create.point(d3node);

      if (currentItem.is.highlight) {
        highlights.push(currentItem.payload);

        if (config.paper.label.show && !label) {
          label
            = items.current![index].label
            = paper.create.label(d3node.id);
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

  return (<canvas ref={ref}></canvas>);
});
