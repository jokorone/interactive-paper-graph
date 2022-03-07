import React from 'react';

import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCollide,
  forceX,
  forceY,
} from 'd3';

import { Node, Link, KeyValueContainer } from '../models';
import { DefaultSettings } from '..';

export const useSimulation = (
  data: KeyValueContainer<Node>,
  options = DefaultSettings
) => {
  let currentChargeStrength = options.graph.chargeForceStrength;

  const [ draggedNode, setDraggedNode ] = React.useState<{
    node: Node,
    closeIds: string[]
  } | null>();

  const simulation = React.useMemo(
    () => forceSimulation<Node, Link>(),
    []
  );

  const forces = React.useMemo(
    () => ({
      forceCharge: forceManyBody(),
      forceLink: forceLink(),
      forceCollide: forceCollide(),
      forceX: forceX(),
      forceY: forceY(),
    }),
    []
  );

  const restart = () => {
    simulation.alphaDecay(.01);
    simulation.alpha(.3).restart();
  }

  const attachForces = React.useCallback(
    (settings: typeof DefaultSettings.graph) => {

      simulation
        .force('link', forces.forceLink
          .distance(settings.linkDistance)
          .iterations(1)
          .id(({ id }: any) => id ))
        .force('charge', forces.forceCharge
          .strength(settings.chargeForceStrength)
          .distanceMin(settings.chargeDistanceMin)
          .distanceMax(settings.chargeDistanceMax))
        .force('collide', forces.forceCollide
          .strength(settings.collideStrength)
          .radius(settings.collideRadius)
          .iterations(1))
        // if node has no links, maybe give other x/y force
        .force('forceX', forces.forceX
          .x((options.bounds.full ? window.innerWidth : options.bounds.width) / 2))
        .force('forceY', forces.forceY
          .y((options.bounds.full ? window.innerHeight : options.bounds.height) / 2))

      currentChargeStrength = settings.chargeForceStrength;

      return restart;
    },
    [simulation, forces]
  );

  const updateData = React.useCallback(
    () => {
      const
        _data = Object.values(data),
        // nodes = _data.map(node => node as Node),
        links = _data.flatMap(node => Object.values(node.links));

      // console.log('nodes', nodes.length, nodes.at(-1));
      console.log('links', links.length, links.at(-1));

      simulation.nodes(_data);
      forces.forceLink.links(links as any);

      return restart;
    },
    [data]
  );
  React.useEffect(updateData, [updateData]);

  const unsetChargeDistance =(
    _draggedNode: Node,
    neighbourIds: string[]
  ) => {
    console.log(draggedNode?.node.id, _draggedNode.id);

    if (
      _draggedNode.id === draggedNode?.node.id
      && neighbourIds.length === draggedNode.closeIds.length
    ) {
      return;
    }
    console.log('set dragged node', _draggedNode.id);

    setDraggedNode({node: _draggedNode, closeIds: neighbourIds });
  }

  React.useEffect(() => {
    console.log('change charge strength');

    forces.forceCharge.strength((node) => {
      const
        isDragged = (node as Node).id === draggedNode?.node.id,
        isDraggedNeighbour = draggedNode?.closeIds.includes((node as Node).id);

      if (isDragged || isDraggedNeighbour) {
        return 0;
      }

      return currentChargeStrength;
    });
  }, [draggedNode])

  return { simulation, attachForces, updateData, unsetChargeDistance };
}
