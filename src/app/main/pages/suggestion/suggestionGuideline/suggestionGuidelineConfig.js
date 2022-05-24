import React from 'react'

const suggestionGuidelineConfig  = {
    settings:{},
    routes:[
        {
            path:'/suggestionGuideline',
            component : React.lazy(()=> import('./suggestionGuideline'))
        }
    ]
}


export default suggestionGuidelineConfig