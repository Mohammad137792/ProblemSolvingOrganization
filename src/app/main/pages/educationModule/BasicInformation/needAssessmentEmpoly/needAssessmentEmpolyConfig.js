import React from 'react'

const needAssessmentEmpolyConfig  = {
    settings:{},
    routes:[
        {
            path:'/needAssessmentEmpoly',
            component : React.lazy(()=> import('./needAssessmentEmpoly'))
        }
    ]
}


export default needAssessmentEmpolyConfig