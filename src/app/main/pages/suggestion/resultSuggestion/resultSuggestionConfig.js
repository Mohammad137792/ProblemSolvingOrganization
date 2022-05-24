import React from 'react'

const resultSuggestionConfig  = {
    settings:{},
    routes:[
        {
            path:'/rewierSuggestion',
            // component : React.lazy(()=> import('./resultSuggestion'))
            component : React.lazy(()=> import('../../tasks/forms/suggestion/rewierSuggestion/rewierSuggestion'))

        }
    ]
}


export default resultSuggestionConfig