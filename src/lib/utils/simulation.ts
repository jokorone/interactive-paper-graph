import React from 'react';
import * as d3 from 'd3';
import { Node, Link, GraphModel } from '../models';
import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { SettingsContext } from './settings';

export const useSimulation = () => {
  const { settings } = React.useContext(SettingsContext);

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
          .distance(settings.simulation.linkDistance)
          .iterations(1)
          .id((l: any) => l.id))
        .force('charge', forces.forceCharge
          .strength(settings.simulation.chargeForceStrength)
          .distanceMin(settings.simulation.chargeDistanceMin)
          .distanceMax(settings.simulation.chargeDistanceMax))
        .force('collide', forces.forceCollide
          .strength(settings.simulation.collideStrength)
          .radius(settings.simulation.collideRadius)
          .iterations(1))
        .force('forceX', forces.forceX
          .x(window.innerWidth / 2))
        .force('forceY', forces.forceY
          .y(window.innerHeight / 2));

      simulation.alphaDecay(.01);
    },
    [simulation, forces, settings]
  );

  React.useEffect(attachForces, [attachForces]);

  const updateSimulationData = React.useCallback(
    (data: GraphModel) => {
      const createNode = ({ id, group }: Node) => ({ id, group });

      const _data = Object.values(data),
            nodes = _data.map(createNode) as Node[],
            links = _data.flatMap(node => Object.values(node.links) as unknown as SimulationLinkDatum<SimulationNodeDatum>);

      simulation.nodes(nodes);
      forces.forceLink.links(links);

      simulation.restart();
    },
    [simulation, forces]
  )

  return { simulation, updateSimulationData };
}
