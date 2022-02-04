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
import { SettingsContext } from './settings';

export const useSimulation = (data: KeyValueContainer<Node>) => {
  const { simulation: graphSettings } = React.useContext(SettingsContext);

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
    () => {
      simulation
        .force('link', forces.forceLink
          .distance(graphSettings.linkDistance)
          .iterations(1)
          .id(({ id }: any) => id ))
        .force('charge', forces.forceCharge
          .strength(graphSettings.chargeForceStrength)
          .distanceMin(graphSettings.chargeDistanceMin)
          .distanceMax(graphSettings.chargeDistanceMax))
        .force('collide', forces.forceCollide
          .strength(graphSettings.collideStrength)
          .radius(graphSettings.collideRadius)
          .iterations(1))
        // if node has no links, maybe give other x/y force
        .force('forceX', forces.forceX
          .x(window.innerWidth / 2))
        .force('forceY', forces.forceY
          .y(window.innerHeight / 2));

      simulation.alphaDecay(.01);
      simulation.alpha(.3).restart();

      return () => simulation.restart() && void 0;
    },
    [simulation, forces, graphSettings]
  );
  React.useEffect(attachForces, [attachForces]);

  const attachData = React.useCallback(
    () => {
      const createNode = ({ id, group }: Node) => ({ id, group });

      const _data = Object.values(data),
            nodes = _data.map(createNode) as Node[],
            links = _data.flatMap(node => Object.values(node.links));

      if (simulation.nodes().length) {
        simulation.nodes([]);
        forces.forceLink.links([]);
      }

      simulation.nodes(nodes);
      forces.forceLink.links(links);

      simulation.alpha(.3).restart();
    },
    [data, simulation, forces]
  );
  React.useEffect(attachData, [attachData]);

  return simulation;
}
