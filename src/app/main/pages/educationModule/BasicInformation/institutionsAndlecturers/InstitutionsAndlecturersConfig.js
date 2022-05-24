import React from 'react'

const InstitutionsConfig = {
    settings: {},
    routes: [{
        path: '/InstitutionsAndlecturers',
        component: React.lazy(() =>
            import ('./InstitutionsAndlecturers'))
    }]
}


export default InstitutionsConfig