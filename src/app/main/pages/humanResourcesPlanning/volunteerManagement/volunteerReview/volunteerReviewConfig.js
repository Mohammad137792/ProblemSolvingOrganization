import React from 'react'

const volunteerReviewConfig  = {
    settings:{},
    routes:[
        {
            path:'/volunteerReview',
            component : React.lazy(()=> import('./VolunteerReview'))
        }
    ]
}

export default  volunteerReviewConfig