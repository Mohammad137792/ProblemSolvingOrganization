import React from 'react'

const correctEvaluatorConfig  = {
    settings:{},
    routes:[
        {
            path:'/correctEvaluator',
            component : React.lazy(()=> import('./CorrectEvaluator'))
        }
    ]
}

export default  correctEvaluatorConfig