import React,{Component} from 'react';

const bankReportConfig= {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/bankReport',
            component: React.lazy(() => import('./bankReport.jsx'))
        }
    ]
}

export default bankReportConfig;
