import React from 'react';

export const  DevicesConfig = {
  
    routes  : [
        {
            path     : '/devicesForm',
            component: React.lazy(() => import('./DevicesForm'))
        }
    ]
};