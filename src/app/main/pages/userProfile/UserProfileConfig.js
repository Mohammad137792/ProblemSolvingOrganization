import React from 'react';

const UserProfileConfig = {
    settings: {
        layout: {

        }
    },
    routes  : [
        {
            path     : '/userProfile',
            component: React.lazy(() => import('./UserProfile'))
        }
    ]
}

export default UserProfileConfig;



