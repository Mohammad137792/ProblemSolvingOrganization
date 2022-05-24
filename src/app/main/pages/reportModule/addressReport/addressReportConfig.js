import React,{Component} from 'react';

const addressReportConfig= {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/addressReport',
            component: React.lazy(() => import('./addressReport.jsx'))
        }
    ]
}

export default addressReportConfig;
