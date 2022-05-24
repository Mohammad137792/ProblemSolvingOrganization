import React from 'react';

export const  ReviewManagarConfig = {
  
    routes  : [
        {
            path     : '/reviewManagarForm',
            component: React.lazy(() => import('./ReviewManagarForm'))
        }
    ]
};