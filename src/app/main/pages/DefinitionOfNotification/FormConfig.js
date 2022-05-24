import React from 'react';

const DefinitionOfNotificationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [{
        path: '/definitionOfNotification',
        component: React.lazy(() =>
            import ('./DefinitionOfNotification'))
    }]
}

export default DefinitionOfNotificationConfig;