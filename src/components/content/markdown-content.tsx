import React from 'react';
import { useFetch } from '../../util/fetch';
import { Node } from './../../lib';

import Markdown from 'markdown-to-jsx';

type MarkdownContentProps = {
  selected: Node,
}
export const MarkdownContent = React.memo((props: MarkdownContentProps) => {
  const { status, content } = useFetch('about');

  return <div className="absolute p-2 max-w-lg m-0 h-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
    <Markdown options={{ wrapper: 'article' }}>
      {content}
    </Markdown>
  </div>
});
