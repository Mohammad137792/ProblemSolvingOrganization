import React from 'react'

const volunteerManagementConfig  = {
    settings:{},
    routes:[
        {
            path:'/volunteerManagement',
            component : React.lazy(()=> import('./VolunteerManagement'))
        }
    ]
}

export default  volunteerManagementConfig