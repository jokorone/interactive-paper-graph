import React from 'react';
import jsonData from './../../data/mock.json';

import { Node, RawNode, RawLink, InitialNode, KeyValueContainer  } from './../model';

export const makeIterable = (key: string) => <T>(value: T): [ string, T ] => [ key, value ];

export const useGraphData = () => {
  const [ data, setData ] = React.useState<KeyValueContainer<Node>>({});

  const createModel = React.useCallback(
    () => {
      setData(fromRawData(jsonData));
    },
    []
  );

  React.useEffect(createModel, [createModel]);

  return { data };
}

export const fromRawData = (data: {
  nodes: RawNode[],
  links: RawLink[]
}) => {
  const model = Object.create({});

  for (const node of data.nodes) {
    const nodeIsSource = (link: RawLink) => link.source === node.id;

    const createLink = (link: RawLink) => {
      const iterable = makeIterable(link.target);
      /** WTF */
      const _link = iterable({
        source: node.id,
        target: link.target,
        value: link.value
      });
      /** WTF_AFTER */

      return _link;
    };

    const _links = data.links
      .filter(nodeIsSource)
      .map(createLink);

    model[node.id] = {
      ...InitialNode,
      ...node,
      payload: node,
      x: (node as Node).x || 0,
      y: (node as Node).y || 0,
      links: Object.fromEntries(_links),
    }

    Object.seal(model[node.id]);
  }

  console.log('create models');
  return model;
};
