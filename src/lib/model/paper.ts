import { KeyValueContainer, Node } from ".";

export type PaperLink = {
  target: Node,
  path: paper.Path
}

export type PaperNode = {
  id: string;
  node: paper.Path.Circle;
  label: paper.PointText | null;
  links: KeyValueContainer<PaperLink>;
  hints: KeyValueContainer<paper.Path>;
}

export type PaperModel = PaperNode[];
