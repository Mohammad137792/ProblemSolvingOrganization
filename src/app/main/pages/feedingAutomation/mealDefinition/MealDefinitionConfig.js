import React from 'react'

const MealDefinitionConfig  = {
    settings:{},
    routes:[
        {
            path:'/mealDefinition',
            component : React.lazy(()=> import('./MealDefinition'))
        }
    ]
}


export default MealDefinitionConfig