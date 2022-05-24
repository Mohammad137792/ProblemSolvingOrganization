import React from 'react';

const ApproveOffersConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/excellence/ApproveOffers',
            component: React.lazy(() => import('./ApproveOffersForm'))
        }
    ]
}

export default ApproveOffersConfig;



