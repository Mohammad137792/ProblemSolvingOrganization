import React from 'react'

const porofileSuggestionConfig  = {
    settings:{},
    routes:[
        {
            path:'/porofileSuggestion',
            component : React.lazy(()=> import('./porofileSuggestion'))
            // component : React.lazy(()=> import('../../tasks/forms/suggestion/SuggestionPreliminaryReview/suggestionPreliminaryReview'))

        }
    ]
}


export default porofileSuggestionConfig