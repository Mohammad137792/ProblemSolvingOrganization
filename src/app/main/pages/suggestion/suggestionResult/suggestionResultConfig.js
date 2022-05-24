import React from 'react'

const suggestionResultConfig  = {
    settings:{},
    routes:[
        {
            path:'/suggestionResult',
            component : React.lazy(()=> import('./suggestionResult'))
        }
    ]
}


export default suggestionResultConfig