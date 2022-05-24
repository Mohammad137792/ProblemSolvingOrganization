import React from "react";

const DashboardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/systemBaseData',
            component: React.lazy(() => import('./systemBaseData'))
        }
    ]
};

export default DashboardConfig;