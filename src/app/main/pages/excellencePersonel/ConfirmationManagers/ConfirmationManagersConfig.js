import React from 'react';

const ConfirmationManagersConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/excellence/ConfirmationManagers',
            component: React.lazy(() => import('./ConfirmationManagersConfig'))
        }
    ]
}

export default ConfirmationManagersConfig;



