import React from 'react';
import * as d3 from 'd3';
import { Node, Link, KeyValueContainer } from '../models';
import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { SettingsContext } from './settings';

export const useSimulation = (data: KeyValueContainer<Node>) => {
  const { settings: { graph: graphSettings } } = React.useContext(SettingsContext);

  const simulation = React.useMemo(
    () => d3.forceSimulation<Node, Link>(),
    []
  );

  const forces = React.useMemo(
    () => ({
      forceCharge: d3.forceManyBody(),
      forceLink: d3.forceLink(),
      forceCollide: d3.forceCollide(),
      forceX: d3.forceX(),
      forceY: d3.forceY(),
    }),
    []
  );

  const attachForces = React.useCallback(
    () => {
      console.log('attach forces to sim');

      simulation
        .force('link', forces.forceLink
          .distance(graphSettings.linkDistance)
          .iterations(1)
          .id((l: any) => l.id))
        .force('charge', forces.forceCharge
          .strength(graphSettings.chargeForceStrength)
          .distanceMin(graphSettings.chargeDistanceMin)
          .distanceMax(graphSettings.chargeDistanceMax))
        .force('collide', forces.forceCollide
          .strength(graphSettings.collideStrength)
          .radius(graphSettings.collideRadius)
          .iterations(1))
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
      console.log('attach data to sim');
      const createNode = ({ id, group }: Node) => ({ id, group });

      const _data = Object.values(data),
            nodes = _data.map(createNode) as Node[],
            links = _data.flatMap(node => Object.values(node.links) as unknown as SimulationLinkDatum<SimulationNodeDatum>);

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

  return { simulation };
}
