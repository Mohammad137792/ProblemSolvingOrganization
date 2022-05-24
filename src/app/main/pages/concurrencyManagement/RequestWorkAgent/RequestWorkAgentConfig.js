import React from 'react';

export const  RequestWorkAgentConfig = {
  
    routes  : [
        {
            path     : '/requestWorkAgentForm',
            component: React.lazy(() => import('./RequestWorkAgentForm'))
        }
    ]
};