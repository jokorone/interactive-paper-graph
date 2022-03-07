import React from 'react';
import { Node, RawNode, RawLink, KeyValueContainer, Link } from '../models';

export const makeIterable = (key: string) => <T>(value: T): [ string, T ] => [ key, value ];

export const useGraphData = (source: { nodes: RawNode[], links: RawLink[] }) => {
  const [ data, setData ] = React.useState<KeyValueContainer<Node>>(fromRawData(source));

  const addNode = () => {
    const i = Object.keys(data).length + 1;

    const payload = {
      id: `Node-${i}`,
      group: 420,
    };

    const newNode = {
      ...payload,
      payload,
      links: {},
    } as Node;

    setData(nodes => ({ ...nodes, [newNode.id]: newNode }));

    return newNode;
  }

  const addLink = (n0: Node, n1: Node) => {

    let newlink: Link = {
      source: n0,
      target: n1,
      value: 10
    };

    const node = data[n0.id]
    console.log(node);


    // .links[n1.id] = newlink;




    // data[newlink.source.id].links[newlink.target.id] = newlink;

    setData(nodes => ({
      ...nodes,
      [newlink.source.id]: data[newlink.source.id]
    }));
}


  return { data, create: { node: addNode, link: addLink }};
}

const fromRawData = (data: {
  nodes: RawNode[],
  links: RawLink[]
}) => {
  const model = Object.create({});

  for (const node of data.nodes) {
    const nodeIsSource = (link: RawLink) => link.source === node.id;

    const createLink = (link: RawLink) => {
      const iterable = makeIterable(link.target);

      const _link = iterable({
        source: node.id,
        target: link.target,
        value: link.value
      });

      return _link;
    };

    const _links = data.links
      .filter(nodeIsSource)
      .map(createLink);

    model[node.id] = {
      ...node,
      payload: node,
      links: Object.fromEntries(_links),
    }
  }

  return model;
};
