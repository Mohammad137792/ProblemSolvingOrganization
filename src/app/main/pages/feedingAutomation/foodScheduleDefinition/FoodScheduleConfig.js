import React from 'react'

const FoodScheduleConfig  = {
    settings:{},
    routes:[
        {
            path:'/foodSchedule',
            component : React.lazy(()=> import('./FoodSchedule'))
        }
    ]
}


export default FoodScheduleConfig