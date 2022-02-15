import React from 'react';
import { Node, RawNode, RawLink, KeyValueContainer } from '../models';

export const makeIterable = (key: string) => <T>(value: T): [ string, T ] => [ key, value ];

export const useGraphData = (source: { nodes: RawNode[], links: RawLink[] }) => {
  const [ data, setData ] = React.useState<KeyValueContainer<Node>>({});

  const createModel = React.useCallback(
    () => {
      setData(fromRawData(source));
    },
    []
  );

  React.useEffect(createModel, [createModel]);

  return data;
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
      ...node,
      payload: node,
      links: Object.fromEntries(_links),
    }
  }

  return model;
};