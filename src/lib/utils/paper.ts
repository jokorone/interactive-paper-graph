import React from 'react';
import Paper from 'paper';

import { KeyValueContainer, Node } from '../models';

import { makeIterable } from './data';
import { SettingsContext } from './settings';

const PaperDefaults = {
  Node: {
    radius: 4,
    opacity: .8,
  },
  Link: {
    strokeWidth: 1,
    opacity: .6,
  },
}

export const usePaperItems = (data: KeyValueContainer<Node>) => {
  const { settings: { colors } } = React.useContext(SettingsContext);

  const createPaperItems = React.useCallback(
    () => Object.entries(data).map(([ name, node ]) => {

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
        label: null,
        links: Object.fromEntries(_links),
        hints: {}
      }
    }),
    [data]
  );


  const
    _createPoint = (p: d3.SimulationNodeDatum) => new Paper.Point(p),
    _createNode = () => new Paper.Path.Circle({
      center: [0, 0],
      radius: PaperDefaults.Node.radius,
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
      strokeWidth: PaperDefaults.Link.strokeWidth
    }),
    create = {
      point: _createPoint,
      node: _createNode,
      label: _createLabel,
      link: _createLink,
    }
  ;

  const
    _updateNode = (p: d3.SubjectPosition, node: paper.Item) => {
      node.position = create.point(p);
      node.fillColor = colors.paper.accent;
      _nodeRadius(node, PaperDefaults.Node.radius)
      node.opacity = PaperDefaults.Node.opacity;
    },
    _updateLink = (sourceIsHovered: boolean, from: d3.SubjectPosition, to: d3.SubjectPosition, path: paper.Path) => {
      path.firstSegment.point = create.point(from);
      path.lastSegment.point = create.point(to);
      path.strokeColor = colors.paper.accent;
      path.opacity = sourceIsHovered ? 1 : PaperDefaults.Link.opacity;
    },
    _highlight = (node: paper.Path, label: paper.PointText) => {
      _nodeRadius(node, 5);
      node.opacity = 1;
      label.position = node.position.subtract({ x: 0, y: 12 } as paper.Point);
      label.fillColor = colors.paper.accent;
    },
    _nodeRadius = (path: paper.Item, radius: number) => {
      const newRadiusWithoutStroke = radius - path.strokeWidth / 2,
            oldRadiusWithoutStroke = path.bounds.width / 2;

      path.scale(newRadiusWithoutStroke / oldRadiusWithoutStroke);
    },
    _removeItem =(item: paper.Item) => (item.remove(), null),

    makeItemUpdater = React.useCallback(
      () => ({
        node: _updateNode,
        link: _updateLink,
        highlight: _highlight,
        remove: _removeItem
      }),
      [colors]
    )
  ;

  return {
    createPaperItems,
    makeItemUpdater,
    create
  };
}
