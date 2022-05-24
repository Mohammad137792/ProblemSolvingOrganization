import React from 'react';

const HirePersonnelConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/hirePersonnel',
            component: React.lazy(() => import('./HirePersonnel'))
        }
    ]
}

export default HirePersonnelConfig;

