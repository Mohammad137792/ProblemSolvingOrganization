import React,{Component} from 'react';

const OrganizationalChartConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/organizationalChart',
            component: React.lazy(() => import('./page/OrganizationalChart'))
        }
    ]
}

export default OrganizationalChartConfig;
