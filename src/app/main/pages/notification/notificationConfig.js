import React from 'react'

const notificationConfig = {
    settings: {},
    routes: [{
        path: '/notification',
        component: React.lazy(() =>
            import ('./notification'))
    }]
}


export default notificationConfig