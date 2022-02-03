import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGFM from 'remark-gfm';

import { useFetch } from '../../util/fetch';
import { Node } from './../../lib';

type MarkdownContentProps = {
  selected: Node,
}
export const MarkdownContent = React.memo((props: MarkdownContentProps) => {
  const { status, content } = useFetch('about');

  const MdxComponents: Components = {
    h1: ({ children }) => <h1 className='markdown'>{children}</h1>,
    code: ({ children }) => <code className='markdown'>{children}</code>,
    p: ({ children }) => <p className='markdown'>{children}</p>
  }


  return <div className="absolute p-2 max-w-lg m-0 h-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
    <ReactMarkdown
      components={MdxComponents}
      remarkPlugins={[remarkGFM]}
      children={content}
    />
  </div>
});
