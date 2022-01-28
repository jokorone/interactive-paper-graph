import React from 'react';
import Paper from 'paper';

import { KeyValueContainer, Node, PaperModel } from '../models';

import { makeIterable } from './data';
import { SettingsContext } from './settings';

const PaperDefaults = {
  Node: {
    radius: 4,
    opacity: .8,
  },
  Link: {
    strokeWidth: 1,
    opacity: .4,
  },
}

export const usePaperItems = (data: KeyValueContainer<Node>) => {

  const
  { colors: hexColors, items } = React.useContext(SettingsContext),
    itemUpdater = React.useRef<ReturnType<typeof makeItemUpdater>>(),
    colors = React.useRef<paper.Color>();

  const updateColors = React.useCallback(
    () => { colors.current = new Paper.Color(hexColors.items) },
    [hexColors]
  );
  React.useEffect(updateColors, [updateColors]);

  const createPaperItems = React.useCallback(
    (): PaperModel => Object.entries(data).map(([ name, node ]) => {

      const d3ToPaperLink = (link: any) => {
        const iterable = makeIterable(link.target.id);

        return iterable({
          target: link.target as Node,
          path: create.link()
        });
      }

      const _links = Object.values(node.links)
        .map(d3ToPaperLink);

      return {
        id: name,
        node: create.node(),
        links: Object.fromEntries(_links),
        label: null,
        hints: null,
        payload: node,
        is: {
          hovered: false,
          dragged: false,
          highlight: false,
        },
      }
    }),
    [data]
  );


  const
    _createPoint = (p: d3.SimulationNodeDatum) => new Paper.Point(p),
    _createNode = () => new Paper.Path.Circle({
      center: [0, 0],
      radius: items.node.radius,
      applyMatrix: false
    }),
    _createLabel = (content: string) => new Paper.PointText({
      center: [0, 0],
      applyMatrix: false,
      content
    }),
    _createLink = () => new Paper.Path({
      segments: [ [0,0], [0,0] ],
      applyMatrix: false,
      strokeWidth: items.links.stroke
    }),
    create = {
      point: _createPoint,
      node: _createNode,
      label: _createLabel,
      link: _createLink,
    } as const;
  ;

  const
    _updateNode = (p: d3.SubjectPosition, node: paper.Item) => {
      node.position = create.point(p);
      node.fillColor = colors.current!;
      _nodeRadius(node, items.node.radius)
      node.opacity = items.node.opacity;
    },
    _updateLink = (sourceIsHovered: boolean, from: d3.SubjectPosition, to: d3.SubjectPosition, path: paper.Path) => {
      path.firstSegment.point = create.point(from);
      path.lastSegment.point = create.point(to);
      path.strokeColor = colors.current!;

      const { stroke, opacity } = sourceIsHovered ? items.links.highlight : items.links;

      path.strokeWidth = stroke;
      path.opacity = opacity;
    },
    _highlight = (node: paper.Path, label?: paper.PointText) => {
      _nodeRadius(node, items.node.highlight.radius);
      node.opacity = items.node.highlight.opacity;

      if (label) {
        label.position = node.position.subtract({ x: 0, y: 12 } as paper.Point);
        label.fillColor = colors.current!;
      }
    },
    _nodeRadius = (path: paper.Item, radius: number) => {
      const newRadiusWithoutStroke = radius - path.strokeWidth / 2,
            oldRadiusWithoutStroke = path.bounds.width / 2;

      path.scale(newRadiusWithoutStroke / oldRadiusWithoutStroke);
    },
    _removeItem = (item: paper.Item) => (item.remove(), null),

    makeItemUpdater = React.useCallback(
      () => ({
        node: _updateNode,
        link: _updateLink,
        highlight: _highlight,
        remove: _removeItem
      }) as const,
      [_updateNode, _updateLink, _highlight, _removeItem]
    )
  ;

  React.useEffect(() => {
    itemUpdater.current = makeItemUpdater();
  }, [makeItemUpdater]);

  return {
    createPaperItems,
    getItemUpdater: () => itemUpdater.current,
    create
  };
}
