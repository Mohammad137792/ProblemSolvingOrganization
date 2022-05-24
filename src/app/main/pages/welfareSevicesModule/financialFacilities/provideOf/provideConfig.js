import React from "react";
import { authRoles } from 'app/auth';

const ProviderConfig = {
    routes: [{
        path: '/provideFinancialFacilitation',
        component: React.lazy(() =>
            import ("./ProviderOf"))
    }]
};

export default ProviderConfig;