import React from 'react';

export const  PerformanceProfileConfig = {
  
    routes  : [
        {
            path     : '/performanceProfileForm',
            component: React.lazy(() => import('./PerformanceProfileForm'))
        }
    ]
};