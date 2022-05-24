import React from 'react'

const defineSuggestConfig  = {
    settings:{},
    routes:[
        {
            path:'/DefineSuggest',
            component : React.lazy(()=> import('./DefineSuggest'))
            // component : React.lazy(()=> import('../../tasks/forms/suggestion/submitSuggestions/DefineSuggest'))

        }
    ]
}

export default  defineSuggestConfig