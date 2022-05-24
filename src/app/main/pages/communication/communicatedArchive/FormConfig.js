import React from 'react';

const communicatedArchiveConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [{
        path: '/communicatedArchive',
        component: React.lazy(() =>
            import ('./CommunicatedArchive'))
    }]
}

export default communicatedArchiveConfig;