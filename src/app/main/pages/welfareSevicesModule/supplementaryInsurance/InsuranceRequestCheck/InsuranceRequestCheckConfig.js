import React from 'react'

const InsuranceRequestCheckConfig  = {
    settings:{},
    routes:[
        {
            path:'/InsuranceRequestCheck',
            component : React.lazy(()=> import('./InsuranceRequestCheck'))
        }
    ]
}


export default InsuranceRequestCheckConfig