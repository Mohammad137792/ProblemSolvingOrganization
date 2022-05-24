import React from 'react'

const getCourseInfoConfig  = {
    settings:{},
    routes:[
        {
            path:'/getCourseInfo',
            component : React.lazy(()=> import('./getCourseInfo'))
        }
    ]
}


export default  getCourseInfoConfig
