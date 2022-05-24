import React from 'react'

const DBWSConfig  = {
    settings:{},
    routes:[
        {
            path:'/determiningBasicWorkingScope',
            component : React.lazy(()=> import('./DBWS'))
        }
    ]
}

export default  DBWSConfig