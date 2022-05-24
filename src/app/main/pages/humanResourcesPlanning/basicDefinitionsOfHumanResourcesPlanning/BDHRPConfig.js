import React from 'react'

const BDHRPConfig  = {
    settings:{},
    routes:[
        {
            path:'/BDHRP',
            component : React.lazy(()=> import('./BDHRP'))
        }
    ]
}

export default  BDHRPConfig