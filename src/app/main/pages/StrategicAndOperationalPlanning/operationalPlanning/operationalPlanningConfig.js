import React from 'react';

const operationalPlanningConfig = {
    settings: {},
    routes: [
        {
            path: '/operationalPlanning',
            component: React.lazy(() =>
                import ('./OperationalPlanning'))
        }
    ]
}

export default operationalPlanningConfig;