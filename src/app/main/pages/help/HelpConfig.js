import React from 'react';

const HelpConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/help',
            component: React.lazy(() => import('./Help'))
        }
    ]
}

export default HelpConfig;



