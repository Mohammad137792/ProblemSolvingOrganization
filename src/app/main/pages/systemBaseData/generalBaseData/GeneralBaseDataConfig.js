import React from "react";

const GeneralBaseDataConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/generalBaseData',
            component: React.lazy(() => import('./GeneralBaseData'))
        }
    ]
};

export default GeneralBaseDataConfig;