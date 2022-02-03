import React from 'react';
import { Node } from './../../lib';

const
  Owner = `jokorone` as const,
  Repo = `interactive-paper-graph` as const,
  ContentURL = `https://raw.githubusercontent.com/${Owner}/${Repo}/develop/README.md` as const;


type MarkdownContentProps = {
  selected: Node,
}
export const MarkdownContent = (props: MarkdownContentProps) => {

  React.useEffect(() => {
    const content = fetch(ContentURL).then(res => res.text());
    content.then(text => console.log(text));
  }, []);

  return <div className="absolute p-2 m-2 h-max w-5/12 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
    {props.selected.id}
    {JSON.stringify(props.selected, null, 2)}
  </div>
}
