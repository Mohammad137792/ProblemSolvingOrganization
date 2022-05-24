import React from 'react';

export const  DefinitionSupplementaryInsuranceConfig = {
  
    routes  : [
        {
            path     : '/supplementaryInsurance/definition',
            component: React.lazy(() => import('./DefinitionSupplementaryInsuranceForm'))
        }
    ]
};

export default DefinitionSupplementaryInsuranceConfig;
