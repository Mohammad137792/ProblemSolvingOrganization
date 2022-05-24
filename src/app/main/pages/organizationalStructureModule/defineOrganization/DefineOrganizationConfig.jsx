import React from "react";

const DashboardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/defineOrganization',
            component: React.lazy(() => import('./DefineOrganization'))
        }
    ]
};

export default DashboardConfig;
