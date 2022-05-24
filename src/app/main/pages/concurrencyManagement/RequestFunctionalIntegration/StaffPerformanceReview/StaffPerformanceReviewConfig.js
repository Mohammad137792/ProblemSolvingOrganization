import React from 'react';

export const  StaffPerformanceReviewConfig = {
  
    routes  : [
        {
            path     : '/staffPerformanceReviewForm',
            component: React.lazy(() => import('./StaffPerformanceReviewForm'))
        }
    ]
};