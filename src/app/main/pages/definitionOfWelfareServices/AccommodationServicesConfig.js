import React from 'react'

const AccommodationServicesConfig  = {
    settings:{},
    routes:[
        {
            path:'/AccommodationServices',
            component : React.lazy(()=> import('./AccommodationServices'))
        }
    ]
}


export default AccommodationServicesConfig