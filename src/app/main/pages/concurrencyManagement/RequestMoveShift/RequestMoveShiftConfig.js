import React from 'react';

export const  RequestMoveShiftConfig = {
  
    routes  : [
        {
            path     : '/requestMoveShiftForm',
            component: React.lazy(() => import('./RequestMoveShiftForm'))
        }
    ]
};