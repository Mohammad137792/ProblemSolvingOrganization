import React from "react";
import { authRoles } from 'app/auth';

const LoginConfig = {
    routes: [{
        path: '/providingloans',
        component: React.lazy(() =>
            import ("./ProvidingloansForm"))
    }]
};

export default LoginConfig;