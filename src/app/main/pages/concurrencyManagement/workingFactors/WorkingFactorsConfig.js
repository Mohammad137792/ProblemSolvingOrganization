import React from 'react';

export const  WorkingFactorsConfig = {
  
    routes  : [
        {
            path     : '/workingFactors',
            component: React.lazy(() => import('./WorkingFactorsForm'))
        }
    ]
};