import React from 'react';

const SurveyConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/survey',
            component: React.lazy(() => import('./Survey'))
        },
    ]
}

export default SurveyConfig;



