import React from 'react';
import Paper from 'paper';

import { KeyValueContainer, Node } from '../models';

import { makeIterable } from './data';
import { useThemedColors } from './colors';

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
  const { paperColors } = useThemedColors();

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

  const makeItemUpdater = React.useCallback(
    () => ({
      node: function (p: d3.SubjectPosition, node: paper.Item) {
        node.position = create.point(p);
        node.fillColor = paperColors.accent;
        this.radius(node, PaperDefaults.Node.radius)
        node.opacity = PaperDefaults.Node.opacity;
      },
      link: function (hovered: boolean, from: d3.SubjectPosition, to: d3.SubjectPosition, path: paper.Path) {
        path.firstSegment.point = create.point(from);
        path.lastSegment.point = create.point(to);
        path.strokeColor = paperColors.accent;
        path.opacity = hovered ? 1 : PaperDefaults.Link.opacity;
      },
      highlight: function (node: paper.Path, label: paper.PointText) {
        this.radius(node, 5);
        node.opacity = 1;
        label.position = node.position.subtract({ x: 0, y: 12 } as paper.Point);
        label.fillColor = paperColors.accent;
      },
      radius: function (path: paper.Item, radius: number) {
        const newRadiusWithoutStroke = radius - path.strokeWidth / 2,
              oldRadiusWithoutStroke = path.bounds.width / 2;

        path.scale(newRadiusWithoutStroke / oldRadiusWithoutStroke);
      },
      remove: function(item: paper.Item) {
        item.remove()
        return null;
      },
    }),
    [paperColors]
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

  return {
    createPaperItems,
    makeItemUpdater,
    create
  };
}
