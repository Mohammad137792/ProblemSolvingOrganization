import React from 'react'

const RequiredCoursesConfig  = {
    settings:{},
    routes:[
        {
            path:'/RequiredCourses/:curriculumId?',
            component : React.lazy(()=> import('./RequiredCourses'))
        }
    ]
}


export default RequiredCoursesConfig