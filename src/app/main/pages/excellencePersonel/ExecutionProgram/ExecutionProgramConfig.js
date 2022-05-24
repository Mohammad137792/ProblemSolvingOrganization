import React from 'react';

const ExecutionProgramConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/excellence/ExecutionProgram',
            component: React.lazy(() => import('./ExecutionProgramForm'))
        }
    ]
}

export default WaitingRegistrationConfig;



