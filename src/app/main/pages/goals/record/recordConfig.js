import React from 'react'

const recordConfig  = {
    settings:{},
    routes:[
        {
            path:'/record',
            component : React.lazy(()=> import('./record'))
        }
    ]
}

export default  recordConfig