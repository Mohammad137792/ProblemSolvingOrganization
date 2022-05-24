import React from 'react'

const managerConformConfig  = {
    settings:{},
    routes:[
        {
            path:'/managerConformConfig',
            component : React.lazy(()=> import('./ManagerConform'))
        }
    ]
}

export default  managerConformConfig