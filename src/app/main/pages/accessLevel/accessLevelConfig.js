import React from 'react'

const accessLevelConfig = {
    settings: {},
    routes: [{
        path: '/accessLevel',
        component: React.lazy(() =>
            import ('./AccessLevel'))
    }]
}


export default accessLevelConfig