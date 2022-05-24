import React from 'react'

const myNotificationsConfig = {
    settings: {},
    routes: [{
        path: '/myNotifications',
        component: React.lazy(() =>
            import ('./myNotifications'))
    }]
}


export default myNotificationsConfig