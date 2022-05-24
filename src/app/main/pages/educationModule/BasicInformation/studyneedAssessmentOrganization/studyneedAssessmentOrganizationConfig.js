import React from 'react'

const studyneedAssessmentOrganizationConfig  = {
    settings:{},
    routes:[
        {
            path:'/studyneedAssessmentOrganization',
            component : React.lazy(()=> import('./studyneedAssessmentOrganization'))
        }
    ]
}


export default studyneedAssessmentOrganizationConfig