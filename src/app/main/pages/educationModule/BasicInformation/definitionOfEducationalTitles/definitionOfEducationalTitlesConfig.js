import React from 'react'

const definitionOfEducationalTitlesConfig  = {
    settings:{},
    routes:[
        {
            path:'/DefinitionOfEducationalTitles',
            component : React.lazy(()=> import('./DefinitionOfEducationalTitles'))
        }
    ]
}


export default definitionOfEducationalTitlesConfig