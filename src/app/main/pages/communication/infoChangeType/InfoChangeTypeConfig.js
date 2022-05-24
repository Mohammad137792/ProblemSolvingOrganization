import React from 'react';

const InfoChangeTypeConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [{
        path: '/infoChangeType',
        component: React.lazy(() =>
            import ('./InfoChangeType'))
    }]
}

export default InfoChangeTypeConfig;