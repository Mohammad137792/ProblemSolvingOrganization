import React from 'react';

export const  ExcellenceConfig = {
  
    routes  : [
        {
            path     : '/excellence',
            component: React.lazy(() => import('./Excellence'))
        }
    ]
};

export default ExcellenceConfig;
