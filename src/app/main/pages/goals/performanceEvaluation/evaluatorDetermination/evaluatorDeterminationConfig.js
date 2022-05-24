import React from 'react'

const evaluatorDeterminationConfig  = {
    settings:{},
    routes:[
        {
            path:'/evaluatorDetermination',
            component : React.lazy(()=> import('./EvaluatorDetermination'))
        }
    ]
}

export default  evaluatorDeterminationConfig