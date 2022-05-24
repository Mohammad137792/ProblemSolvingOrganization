import React from 'react'

const sessionPageConfig  = {
    settings:{},
    routes:[
        {
            path:'/sessionPage',
            component : React.lazy(()=> import('./SessionPage'))
        }
    ]
}

export default  sessionPageConfig