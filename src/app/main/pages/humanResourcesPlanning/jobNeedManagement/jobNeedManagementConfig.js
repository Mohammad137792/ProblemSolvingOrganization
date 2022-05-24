import React from 'react'

const jobNeedManagementConfig  = {
    settings:{},
    routes:[
        {
            path:'/jobNeedManagement',
            component : React.lazy(()=> import('./JobNeedManagement'))
        }
    ]
}

export default  jobNeedManagementConfig