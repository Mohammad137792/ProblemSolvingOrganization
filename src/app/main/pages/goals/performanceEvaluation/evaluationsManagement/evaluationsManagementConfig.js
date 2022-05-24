import React from 'react'

const evaluationsManagementConfig  = {
    settings:{},
    routes:[
        {
            path:'/evaluationsManagement',
            component : React.lazy(()=> import('./EvaluationsManagement'))
        }
    ]
}

export default  evaluationsManagementConfig