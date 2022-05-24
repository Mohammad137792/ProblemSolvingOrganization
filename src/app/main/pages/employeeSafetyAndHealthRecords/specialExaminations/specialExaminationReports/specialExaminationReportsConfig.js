import React from 'react'

const specialExaminationReportsConfig  = {
    settings:{},
    routes:[
        {
            path:'/specialExaminationReports',
            component : React.lazy(()=> import('./SpecialExaminationReports'))
        }
    ]
}

export default  specialExaminationReportsConfig