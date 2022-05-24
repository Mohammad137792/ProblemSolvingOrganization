import React from 'react';

const DataAnalysisDashboardComponentConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [{
        path: '/DataAnalysisDashboard',
        component: React.lazy(() =>
            import ('./DataAnalysisDashboardComponent'))
    }]
}

export default DataAnalysisDashboardComponentConfig;