import React from 'react'

const baseOrganizationStructureInformationConfig  = {
    settings:{},
    routes:[
        {
            path:'/BaseOrganizationStructureInformation',
            component : React.lazy(()=> import('./BaseOrganizationStructureInformation'))
        }
    ]
}


export default baseOrganizationStructureInformationConfig