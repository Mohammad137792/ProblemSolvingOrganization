import React from 'react'

const reportGoalsConfig  = {
    settings:{},
    routes:[
        {
            path:'/reportGoals',
            component : React.lazy(()=> import('./reportGoals'))
        }
    ]
}


export default reportGoalsConfig