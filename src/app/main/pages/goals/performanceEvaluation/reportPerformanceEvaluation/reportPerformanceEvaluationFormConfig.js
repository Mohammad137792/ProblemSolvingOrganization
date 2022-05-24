import React from 'react'

const reportPerformanceEvaluationFormConfig  = {
    settings:{},
    routes:[
        {
            path:'/reportPerformanceEvaluation',
            component : React.lazy(()=> import('./ReportPerformanceEvaluation'))
        }
    ]
}

export default  reportPerformanceEvaluationFormConfig