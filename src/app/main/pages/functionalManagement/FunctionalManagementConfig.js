import React from 'react';

const FunctionalManagementConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/functional',
            component: React.lazy(() => import('./FunctionalManagement'))
        }
    ]
}

export default FunctionalManagementConfig;



