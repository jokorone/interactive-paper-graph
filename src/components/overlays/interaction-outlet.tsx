import React from 'react';

import { Node } from './../../lib';

export const InteractionOutlet = React.memo((
  props: { highlight: Node | null }
) => {


  return (
    <div className='pointer-events-none absolute top-16 left-1/2 transform -translate-x-1/2 text-gray-700 dark:text-gray-300 font-bold'>
      {
        Boolean(props.highlight)
        && <span className='text-4xl opacity-90'>
            {props.highlight?.id}
          </span>
      }
    </div>
  )

});
