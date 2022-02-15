import React from 'react';
import Paper from 'paper';
import { select } from 'd3';

import { Node, PaperModel, InteractionHandlers, RawLink, RawNode } from './../models';

import {
  useSimulation,
  usePaperItems,
  useResize,
  useInteractiveGraph,
  useGraphData
} from './../utils';

import { DefaultSettings } from '../defaults';
import { deepmerge } from 'deepmerge-ts';

type DefaultGraphProps =  {
  data: {
    nodes: RawNode[],
    links: RawLink[]
  },
  config?: {
    colors?: typeof DefaultSettings.config.colors,
    bounds?: {
      width?: number;
      height?: number;
      resize?: {
          width: boolean;
          height: boolean;
      } | boolean,
    },
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
          show?: boolean;
      };
    };
    graph?: typeof DefaultSettings.config.graph
  },
  handlers?: InteractionHandlers,
}

type Settings = Omit<DefaultGraphProps, 'data'> & typeof DefaultSettings;

export const Canvas = React.memo((props: DefaultGraphProps) => {

  const settings = deepmerge(DefaultSettings, props as Settings),

    ref            = React.useRef<HTMLCanvasElement | null>(null),
    project        = React.useRef<paper.Project | null>(),
    items          = React.useRef<PaperModel | null>(),
    context        = React.useRef<CanvasRenderingContext2D | null>(),
    interaction    = React.useRef<ReturnType<typeof initHandlers>>(),

    data           = useGraphData(props.data),
    sim            = useSimulation(data, settings),
    paper          = usePaperItems(data, settings),
    initHandlers   = useInteractiveGraph(data, settings.handlers),
    resizeHandler  = useResize(settings.config.bounds);

  const resizeCanvas = () => {
    resizeHandler(ref.current!, context.current!);
  }

  React.useLayoutEffect(() => {
    project.current = new Paper.Project(ref.current!);
    context.current = ref.current!.getContext('2d');

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const setupCanvas = React.useCallback(
    () => {
      if (Object.keys(data).length === 0) return;

      items.current = paper.createPaperItems();
      project.current!.view.onFrame = draw;

      interaction.current = initHandlers(
        project.current!,
        ref.current!,
        sim.simulation
      );

      return () => project.current!.clear();
    },
    [data]
  );
  React.useEffect(setupCanvas, [setupCanvas]);

  const updateCanvasTheme = React.useCallback(
    () => {
      select(ref.current).transition()
        .duration(100)
        .style('background', settings.config.colors.canvas);
    },
    [settings.config.colors]
  );
  React.useEffect(updateCanvasTheme, [updateCanvasTheme]);

  const updateSimulationSettings = React.useCallback(
    () => sim.attachForces(props.config!.graph!.settings),
    [props.config?.graph?.settings]
  );
  React.useEffect(updateSimulationSettings, [updateSimulationSettings]);

  function draw(frameEvent: {
    count: number,
    time: number,
    delta: number,
  }) {
    context.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if ( !sim.simulation.nodes().length
      || !items.current
      || !interaction.current) return;

    const update = paper.getItemUpdater()!;

    let index = 0,
        highlights: Node[] = [];
    for (const d3node of sim.simulation.nodes()) {

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

        if (settings.config.paper.label.show && !label) {
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
