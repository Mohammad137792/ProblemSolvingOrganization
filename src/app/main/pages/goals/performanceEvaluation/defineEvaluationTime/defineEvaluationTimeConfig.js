import React from 'react'

const defineEvaluationTimeConfig  = {
    settings:{},
    routes:[
        {
            path:'/defineEvaluationTime',
            // component : React.lazy(()=> import('./DefineEvaluationTime'))
            // component : React.lazy(()=> import('../../../tasks/forms/performanceEvaluation/defineEvaluationTime/DefineEvaluationTime'))
            component : React.lazy(()=> import('../../../tasks/forms/PerformanceEvaluations/difineEvaluation/DefineEvaluationForm'))

        }
    ]
}

export default  defineEvaluationTimeConfig