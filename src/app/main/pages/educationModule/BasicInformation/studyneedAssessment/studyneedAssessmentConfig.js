import React from 'react'

const studyneedAssessmentConfig  = {
    settings:{},
    routes:[
        {
            path:'/studyneedAssessment/:cuId?',
            component : React.lazy(()=> import('./studyneedAssessment'))
        }
    ]
}


export default studyneedAssessmentConfig