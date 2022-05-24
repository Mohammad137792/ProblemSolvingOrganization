import React from 'react'

const FoodReserveConfig  = {
    settings:{},
    routes:[
        {
            path:'/foodReserve',
            component : React.lazy(()=> import('./FoodReserve'))
        }
    ]
}


export default FoodReserveConfig