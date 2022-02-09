type d3Node = & d3.SimulationNodeDatum & d3.SubjectPosition


export type Node = BaseNode<RawNode> & d3Node;
export type Link = BaseLink<Node>;

type BaseNode<T> = T & {
    payload: T,
    links: KeyValueContainer<BaseLink<string>>,
  };

type BaseLink<T> = {
  source: T;
  target: T;
  value: number;
}

export type RawNode = typeof InitialNode;
export type RawLink = BaseLink<string>;

export type GraphModel = KeyValueContainer<Node>;


export type KeyValueContainer<T> = { [key: string]: T };

export const InitialNode = {
  id: '',
  group: NaN,
  // index: 0,
  // vx: 0,
  // vy: 0,
  // x: 0,
  // y: 0,
};
