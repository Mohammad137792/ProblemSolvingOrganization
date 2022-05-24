import React from 'react';

export const  PerformanceReportConfig = {
  
    routes  : [
        {
            path     : '/performanceReportForm',
            component: React.lazy(() => import('./PerformanceReportForm'))
        }
    ]
};