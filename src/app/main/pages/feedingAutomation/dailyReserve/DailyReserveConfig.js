import React from 'react'

const DailyReserveConfig  = {
    settings:{},
    routes:[
        {
            path:'/dailyReserve',
            component : React.lazy(()=> import('./DailyReserve'))
        }
    ]
}


export default DailyReserveConfig