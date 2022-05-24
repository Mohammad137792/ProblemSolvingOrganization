import React from 'react';

const AudienceEvaluationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/excellence/AudienceEvaluation',
            component: React.lazy(() => import('./AudienceEvaluation'))
        }
    ]
}

export default AudienceEvaluationConfig;



