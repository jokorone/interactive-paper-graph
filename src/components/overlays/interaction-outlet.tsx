import React from 'react';

import { Node } from './../../lib';

export const InteractionOutlet = React.memo((
  props: { highlight: Node | null }
) => {

  if (!props.highlight) {
    return<></>
  }

  // const links = Object
  //   .keys(props.highlight.links)
  //   .map((id) => (
  //     <span key={id} className='text-xl block pl-2'> - {id}</span>
  //   ))

  return (
    <div className='absolute top-16 left-1/2 transform -translate-x-1/2 text-gray-700 dark:text-gray-300 font-bold'>
      <span className='text-5xl'>{props.highlight?.id}</span>
    </div>
  )

});
