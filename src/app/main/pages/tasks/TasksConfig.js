import React from 'react';

const TasksConfig= {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/tasks',
            component: React.lazy(() => import('./Tasks.jsx'))
        }
    ]
}

export default TasksConfig;
