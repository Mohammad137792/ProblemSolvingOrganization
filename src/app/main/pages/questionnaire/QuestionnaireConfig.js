import React from 'react';

const QuestionnaireConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/questionnaire',
            component: React.lazy(() => import('./Questionnaire'))
        }
    ]
}

export default QuestionnaireConfig;



