import React from 'react'

const editEducationalProgramAndBudgetConfig  = {
    settings:{},
    routes:[
        {
            path:'/editEducationalProgramAndBudget',
            component : React.lazy(()=> import('./editEducationalProgramAndBudget'))
        }
    ]
}


export default  editEducationalProgramAndBudgetConfig
