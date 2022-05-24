import React from 'react'

const needAssessmentConfig  = {
    settings:{},
    routes:[
        {
            path:'/TrainingNeedsAssessment',
            component : React.lazy(()=> import('./TrainingNeedsAssessment'))
        }
    ]
}


export default needAssessmentConfig