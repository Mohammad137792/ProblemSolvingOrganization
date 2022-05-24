import React from 'react'

const seniorManagersConfirmationConfig  = {
    settings:{},
    routes:[
        {
            path:'/seniorManagersConfirmation',
            component : React.lazy(()=> import('./SeniorManagersConfirmation'))
        }
    ]
}

export default  seniorManagersConfirmationConfig