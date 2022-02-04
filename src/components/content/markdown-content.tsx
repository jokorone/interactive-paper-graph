import React from 'react';
import ReactMarkdown from 'react-markdown';
// import remarkGFM from 'remark-gfm';

import { useFetch } from '../../util/fetch';
import { Node } from './../../lib';

type MarkdownContentProps = {
  selected: Node,
}
export const MarkdownContent = React.memo((props: MarkdownContentProps) => {
  const { status, content } = useFetch('about');

  return <div className="absolute overflow-scroll p-2 max-w-lg m-0 h-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
    <article className="prose prose-gray prose-sm xl:prose-base dark:prose-invert">

      <ReactMarkdown
        // remarkPlugins={[remarkGFM]}
        children={content}
      />

    </article>
  </div>
});
