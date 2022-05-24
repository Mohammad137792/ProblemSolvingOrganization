import React from 'react';

const SystemBaseInformationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/systemBaseInformation',
            component: React.lazy(() => import('./systemBaseInformation'))
        }
    ]
}

export default SystemBaseInformationConfig;



