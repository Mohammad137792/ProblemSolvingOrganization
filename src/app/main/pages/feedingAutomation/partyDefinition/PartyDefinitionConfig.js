import React from 'react'

const PartyDefinitionConfig  = {
    settings:{},
    routes:[
        {
            path:'/partyDefinition',
            component : React.lazy(()=> import('./PartyDefinition'))
        }
    ]
}


export default PartyDefinitionConfig