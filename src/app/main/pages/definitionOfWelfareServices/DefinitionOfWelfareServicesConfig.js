import React from 'react'

const DefinitionOfWelfareServicesConfig  = {
    settings:{},
    routes:[
        {
            path:'/DefinitionOfWelfareServices',
            component : React.lazy(()=> import('./DefinitionOfWelfareServices'))
        }
    ]
}


export default DefinitionOfWelfareServicesConfig