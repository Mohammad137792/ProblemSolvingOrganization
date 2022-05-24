import React from 'react';

const ReportsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/excellence/Reports',
            component: React.lazy(() => import('./ReportsForm'))
        }
    ]
}

export default ReportsConfig;



