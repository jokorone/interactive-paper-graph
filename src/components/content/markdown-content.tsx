import React from 'react';
import { useFetch } from '../../util/fetch';
import { Node } from './../../lib';

type MarkdownContentProps = {
  selected: Node,
}
export const MarkdownContent = React.memo((props: MarkdownContentProps) => {
  const { status, content } = useFetch('about');

  return <div className="absolute p-2 m-2 h-max w-5/12 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
    {props.selected.id}
    {content}
  </div>
});
