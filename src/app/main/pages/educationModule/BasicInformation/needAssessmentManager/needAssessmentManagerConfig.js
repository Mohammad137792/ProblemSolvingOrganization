import React from 'react'

const needAssessmentManagerConfig  = {
    settings:{},
    routes:[
        {
            path:'/needAssessmentManager',
            component : React.lazy(()=> import('./needAssessmentManager'))
        }
    ]
}


export default needAssessmentManagerConfig