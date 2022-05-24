import React from 'react'

const InsuranceRequestConfig  = {
    settings:{},
    routes:[
        {
            path:'/InsuranceRequest',
            component : React.lazy(()=> import('./InsuranceRequest'))
        }
    ]
}


export default InsuranceRequestConfig