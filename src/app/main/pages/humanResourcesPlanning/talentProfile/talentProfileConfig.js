import React from 'react'

const talentProfileConfig  = {
    settings:{},
    routes:[
        {
            path:'/talentProfile',
            component : React.lazy(()=> import('./TalentProfile'))
        }
    ]
}

export default  talentProfileConfig