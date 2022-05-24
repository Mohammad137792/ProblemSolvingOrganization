import React from 'react'

const creatingJobNeedsConfig  = {
    settings:{},
    routes:[
        {
            path:'/creatingJobNeeds',
            component : React.lazy(()=> import('./CreatingJobNeeds'))
        }
    ]
}

export default  creatingJobNeedsConfig