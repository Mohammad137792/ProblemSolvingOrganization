import React from 'react';

const PersonnelBaseInformationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/personnelBaseInformation/:index?',
            component: React.lazy(() => import('./PersonnelBaseInformation'))
        }
    ]
}

export default PersonnelBaseInformationConfig;
