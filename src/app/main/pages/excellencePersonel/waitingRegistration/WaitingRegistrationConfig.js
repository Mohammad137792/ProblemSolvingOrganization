import React from 'react';

const WaitingRegistrationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/excellence/WaitingRegistration',
            component: React.lazy(() => import('./WaitingRegistrationConfig'))
        }
    ]
}

export default WaitingRegistrationConfig;



