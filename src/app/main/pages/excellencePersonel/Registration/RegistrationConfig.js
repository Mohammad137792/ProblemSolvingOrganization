import React from 'react';

const ExecutionProgramConfig = {
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

export default WaitingRegistrationConfig;



