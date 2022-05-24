import React,{Component} from 'react';

const contactReportConfig= {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/contactReport',
            component: React.lazy(() => import('./contactReport.jsx'))
        }
    ]
}

export default contactReportConfig;
