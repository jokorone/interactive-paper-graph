export type PaperColors = Colors<paper.Color>;

export type Colors<T> = {
  primary: T,
  accent: T,
  highlight: T,
}
