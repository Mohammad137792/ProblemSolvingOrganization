import React from 'react'

const suggestionGeneralConfig  = {
    settings:{},
    routes:[
        {
            path:'/suggestionGeneral',
            component : React.lazy(()=> import('./suggestionGeneral'))
        }
    ]
}


export default suggestionGeneralConfig