import React from 'react'

const EducationalProfileConfig  = {
    settings:{},
    routes:[
        {
            path:'/EducationalProfile',
            component : React.lazy(()=> import('./EducationalProfile'))
        }
    ]
}


export default EducationalProfileConfig