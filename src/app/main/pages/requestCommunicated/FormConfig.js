import React from 'react';

const RequestCommunicatedConfig = {
    settings: {
        layout: {
            requestCommunicated: {}
        }
    },
    routes: [{
        path: '/requestCommunicated',
        component: React.lazy(() =>
            import ('./RequestCommunicated'))
    }]
}

export default RequestCommunicatedConfig;