import React from 'react';

export const  InstantReportConfig = {
  
    routes  : [
        {
            path     : '/instantReportForm',
            component: React.lazy(() => import('./InstantReportForm'))
        }
    ]
};