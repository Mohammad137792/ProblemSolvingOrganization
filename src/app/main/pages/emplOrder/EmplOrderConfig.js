import React from 'react';

const EmplOrderConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/emplOrder',
            component: React.lazy(() => import('./EmplOrder'))
        }
    ]
}

export default EmplOrderConfig;



