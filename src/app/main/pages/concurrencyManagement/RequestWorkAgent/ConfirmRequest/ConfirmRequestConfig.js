import React from 'react';

export const  ConfirmRequestConfig = {
  
    routes  : [
        {
            path     : '/confirmRequestForm',
            component: React.lazy(() => import('./ConfirmRequestForm'))
        }
    ]
};