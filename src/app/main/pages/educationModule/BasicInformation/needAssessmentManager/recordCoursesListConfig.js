import React from 'react'

const recordCoursesListConfig  = {
    settings:{},
    routes:[
        {
            path:'/recordCoursesList',
            component : React.lazy(()=> import('./recordCoursesList'))
        }
    ]
}


export default recordCoursesListConfig