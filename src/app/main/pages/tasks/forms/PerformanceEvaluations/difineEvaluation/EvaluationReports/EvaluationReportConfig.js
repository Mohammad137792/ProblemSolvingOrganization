import React from 'react'

const EvaluationReportConfig  = {
    settings:{},
    routes:[
        {
            path:'/EvaluationReport',
            component : React.lazy(()=> import('./EvaluationReport'))
        }
    ]
}


export default EvaluationReportConfig