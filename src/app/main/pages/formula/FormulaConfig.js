import React from 'react';

const FormulaConfig= {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/formula',
            component: React.lazy(() => import('./Formula'))
        }
    ]
}

export default FormulaConfig;



