import React from 'react';

export const  RequestFunctionalIntegrationConfig = {
  
    routes  : [
        {
            path     : '/functionalIntegration',
            component: React.lazy(() => import('./FunctionalIntegrationForm'))
        }
    ]
};