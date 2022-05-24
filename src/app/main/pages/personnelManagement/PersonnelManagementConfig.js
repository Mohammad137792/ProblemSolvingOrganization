import React from 'react';

const PersonnelManagementConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/personnel/search',
            component: React.lazy(() => import('./searchPersonnel/SearchPersonnel'))
        },{
            path     : '/personnel/register',
            component: React.lazy(() => import('./definePersonnel/DefinePersonnel'))
        },{
            path     : '/personnel/profile',
            component: React.lazy(() => import('./personnelProfile/PersonnelProfile'))
        }
    ]
}

export default PersonnelManagementConfig;



