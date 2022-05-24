import React from 'react';

const RecordEventsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/excellence/RecordEvents',
            component: React.lazy(() => import('./RecordEvents'))
        }
    ]
}

export default RecordEventsConfig;



