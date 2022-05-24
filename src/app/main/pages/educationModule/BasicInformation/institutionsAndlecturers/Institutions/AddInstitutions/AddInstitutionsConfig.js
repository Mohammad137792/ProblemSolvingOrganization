import React from 'react'

const AddInstitutionsConfig = {
    settings: {},
    routes: [{
        path: '/addInstitutions/:index?',
        component: React.lazy(() =>
            import ('./InstitutionTabs'))
    }]
}


export default AddInstitutionsConfig