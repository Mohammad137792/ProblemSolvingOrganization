import React from 'react';

const ProgramEvaluationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/excellence/ProgramEvaluation',
            component: React.lazy(() => import('./ProgramEvaluation'))
        }
    ]
}

export default ProgramEvaluationConfig;



