import React from 'react'

const jobDescriptionConfig  = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: false
                },
                footer        : {
                    display: true
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes:[
        {
            path:'/jobDescription',
            component : React.lazy(()=> import('./JobDescription'))
        }
    ]
}

export default  jobDescriptionConfig