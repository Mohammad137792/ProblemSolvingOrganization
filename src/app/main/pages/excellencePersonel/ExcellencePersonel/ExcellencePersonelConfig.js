import React from 'react';

export const  ExcellencePersonelConfig = {
  
    routes  : [
        {
            path     : '/excellence/ExcellencePersonel',
            component: React.lazy(() => import('./Excellence'))
        }
    ]
};