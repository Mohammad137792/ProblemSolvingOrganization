import React from 'react'

const CreditChargeConfig  = {
    settings:{},
    routes:[
        {
            path:'/creditCharge',
            component : React.lazy(()=> import('./CreditCharge'))
        }
    ]
}


export default CreditChargeConfig