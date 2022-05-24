import React,{Component} from 'react';

const familyReportConfig= {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/familyReport',
            component: React.lazy(() => import('./familyReport.jsx'))
        }
    ]
}

export default familyReportConfig;
