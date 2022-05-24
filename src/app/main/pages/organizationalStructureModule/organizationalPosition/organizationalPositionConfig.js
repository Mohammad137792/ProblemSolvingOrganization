import React,{Component} from 'react';

const organizationalPositionConfig= {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/organizationalPosition',
            component: React.lazy(() => import('./organizationalPosition.jsx'))
        }
    ]
}

export default organizationalPositionConfig;
