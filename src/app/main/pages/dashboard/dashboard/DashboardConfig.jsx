import React from 'react';

export const DashboardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: ['ADMIN'],
    routes  : [
        {
            path     : '/dashboard۳',
            component: React.lazy(() => import('./Dashboard'))
        }
    ]
};