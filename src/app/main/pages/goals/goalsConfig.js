import React from 'react'

const goalsConfig  = {
    settings:{},
    routes:[
        {
            path:'/goals',
            component : React.lazy(()=> import('./goals'))
        }
    ]
}

export default  goalsConfig