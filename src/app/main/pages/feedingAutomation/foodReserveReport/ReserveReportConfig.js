import React from 'react'

const ReserveReportConfig  = {
    settings:{},
    routes:[
        {
            path:'/foodReserveReport',
            component : React.lazy(()=> import('./FoodReserveReport'))
        }
    ]
}


export default ReserveReportConfig