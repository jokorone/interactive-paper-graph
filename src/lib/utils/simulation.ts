import React from 'react';

import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCollide,
  forceX,
  forceY
} from 'd3';

import { Node, Link, KeyValueContainer } from '../models';
import { DefaultSettings } from '..';

export const useSimulation = (
  data: KeyValueContainer<Node>,
  options = DefaultSettings
) => {

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

      simulation.alphaDecay(.01);
      simulation.alpha(.3).restart();

      return () => simulation.restart() && void 0;
    },
    [simulation, forces]
  );

  const attachData = React.useCallback(
    () => {
      const
        _data = Object.values(data),
        nodes = _data.map(node => node.payload as Node),
        links = _data.flatMap(node => Object.values(node.links));

      if (simulation.nodes().length) {
        simulation.nodes([]);
        forces.forceLink.links([]);
      }

      simulation.nodes(nodes);
      forces.forceLink.links(links as any);

      simulation.alpha(.3).restart();
    },
    [data, simulation, forces]
  );
  React.useEffect(attachData, [attachData]);

  return {simulation, attachForces};
}
