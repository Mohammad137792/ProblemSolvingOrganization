import React from 'react'

const AddedCourseListConfig  = {
    settings:{},
    routes:[
        {
            path:'/AddedCourseList/:params?',
            component : React.lazy(()=> import('./AddedCoursesList'))
        }
    ]
}


export default AddedCourseListConfig