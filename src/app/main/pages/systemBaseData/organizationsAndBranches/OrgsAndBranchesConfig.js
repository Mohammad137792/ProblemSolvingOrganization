import React from "react";

const OrgsAndBranchesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/organizationsAndBranches',
            component: React.lazy(() => import('./OrgsAndBranches'))
        }
    ]
};

export default OrgsAndBranchesConfig;
