import React from 'react';

const PayrollConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/payroll',
            component: React.lazy(() => import('./Payroll'))
        }
    ]
}

export default PayrollConfig;



