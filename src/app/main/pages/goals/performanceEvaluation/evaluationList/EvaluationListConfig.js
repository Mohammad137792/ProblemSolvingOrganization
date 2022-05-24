import React from 'react'

const EvaluationListConfig  = {
    settings:{},
    routes:[
        {
            path:'/evaluationList',
            component : React.lazy(()=> import('./EvaluationList'))
        }
    ]
}


export default EvaluationListConfig