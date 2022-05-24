import React from 'react'

const FoodDefinitionConfig  = {
    settings:{},
    routes:[
        {
            path:'/foodDefinition',
            component : React.lazy(()=> import('./FoodDefinition'))
        }
    ]
}


export default FoodDefinitionConfig