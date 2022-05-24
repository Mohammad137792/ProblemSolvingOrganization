import React from 'react';

const CompensationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/compensation',
            component: React.lazy(() => import('./Compensation'))
        }
    ]
}

export default CompensationConfig;



