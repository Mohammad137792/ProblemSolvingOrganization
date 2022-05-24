import React from 'react';

const SkillsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/skills',
            component: React.lazy(() => import('./skills'))
        }
    ]
}

export default SkillsConfig;



