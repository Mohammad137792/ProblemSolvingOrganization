import React from 'react'

const educationCoursesConfig  = {
    settings:{},
    routes:[
        {
            path:'/educationCourses',
            component : React.lazy(()=> import('./educationCourses'))
        }
    ]
}


export default  educationCoursesConfig
