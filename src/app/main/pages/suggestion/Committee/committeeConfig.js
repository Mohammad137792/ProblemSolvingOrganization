import React from 'react'

const committeeConfig  = {
    settings:{},
    routes:[
        {
            path:'/committee',
            component : React.lazy(()=> import('./committee'))
        }
    ]
}


export default committeeConfig