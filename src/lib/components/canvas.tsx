import React from 'react';
import Paper from 'paper';
import { select } from 'd3';
import { deepmerge } from 'deepmerge-ts';

import {
  useSimulation,
  usePaperItems,
  useResize,
  useInteractiveGraph,
  useGraphData
} from './../utils';

import { DefaultSettings } from '../defaults';
import { InteractionHandlers, Node, PaperModel, RawLink, RawNode } from './../models';

type GraphProps = {
  bounds?: {
      width?: number;
      height?: number;
      full?: boolean;
  };
  colors?: {
      canvas?: string;
      items?: string;
  };
  graph?: typeof DefaultSettings.graph;
  handlers?: InteractionHandlers;
  paper?: {
    node?: {
      radius?: number;
      opacity?: number;
      highlight?: {
          radius?: number;
          opacity?: number;
      };
    };
    links?: {
      stroke?: number;
      opacity?: number;
      highlight?: {
          stroke?: number;
          opacity?: number;
      };
    };
    label?: {
      show?: boolean
    };
  };
  data: {
    nodes: RawNode[];
    links: RawLink[];
  }
};
// omit data and create union type to overwrite optional props
type Settings = Omit<GraphProps, 'data'> & typeof DefaultSettings;

export const Canvas = React.memo((props: GraphProps) => {

  const settings = deepmerge(DefaultSettings, props as Settings),

    ref            = React.useRef<HTMLCanvasElement | null>(null),
    project        = React.useRef<paper.Project | null>(),
    items          = React.useRef<PaperModel | null>(),
    context        = React.useRef<CanvasRenderingContext2D | null>(),
    interaction    = React.useRef<ReturnType<typeof initHandlers>>(),

  { data, create } = useGraphData(props.data),
    sim            = useSimulation(data, settings),
    paper          = usePaperItems(data, settings),
    initHandlers   = useInteractiveGraph(data, settings.handlers),
    resizeHandler  = useResize(settings.bounds);

  const resizeCanvas = () => resizeHandler(ref.current!, context.current!);

  const setupCanvas = React.useCallback(
    () => {
      project.current     = new Paper.Project(ref.current!);
      context.current     = ref.current!.getContext('2d');
      items.current       = paper.createPaperItems();
      interaction.current = initHandlers(
        project.current!,
        ref.current!,
        sim.simulation
      );
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      project.current!.view.onFrame = draw;

      return () => {
        project.current!.clear();
        window.removeEventListener('resize', resizeCanvas);
      }
    },
    []
  );
  React.useEffect(setupCanvas, [setupCanvas]);

  const updateCanvasTheme = React.useCallback(
    () => {
      select(ref.current).transition()
        .duration(100)
        .style('background', settings.colors.canvas);
    },
    [settings.colors]
  );
  React.useLayoutEffect(updateCanvasTheme, [updateCanvasTheme]);

  const updateSimulationSettings = React.useCallback(
    () => sim.attachForces(settings.graph),
    [props.graph]
  );
  React.useLayoutEffect(updateSimulationSettings, [updateSimulationSettings]);

  function draw(frameEvent: {
    count: number,
    time: number,
    delta: number,
  }) {
    context.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const update = paper.getItemUpdater()!;

    let index = 0,
        highlights: Node[] = [];
    for (const d3node of sim.simulation.nodes()) {

      const { node, links, ...currentItem } = items.current![index];

      let label = currentItem.label;

      const { isHovered, isDragged } = interaction.current!.handle(d3node, node);

      currentItem.is = {
        hovered: isHovered,
        dragged: isDragged,
        highlight: isHovered || isDragged,
      }

      node.position = paper.create.point(d3node);

      if (currentItem.is.highlight) {
        highlights.push(currentItem.payload);

        if (settings.paper.label.show && !label) {
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

    (frameEvent.count % 24 === 0)
      && interaction.current!.emit(highlights.pop());
  }

  return (<>
    <button className='absolute bottom-2 left-2 w-12' onClick={() => {

      const node = create.node();
      items.current?.push(paper.createPaperNode(node, {}));

    }}>Add Node</button>
    <canvas ref={ref}></canvas>
  </>);
});
