import React from 'react';

const DefineJobConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/defineJob',
            component: React.lazy(() => import('./DefineJob'))
        }
    ]
}

export default DefineJobConfig;



