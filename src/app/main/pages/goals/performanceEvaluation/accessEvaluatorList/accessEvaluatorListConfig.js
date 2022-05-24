import React from 'react'

const accessEvaluatorListConfig  = {
    settings:{},
    routes:[
        {
            path:'/accessEvaluatorList',
            component : React.lazy(()=> import('./AccessEvaluatorList'))
        }
    ]
}

export default  accessEvaluatorListConfig