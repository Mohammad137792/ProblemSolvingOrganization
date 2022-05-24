import React from 'react'

const signUpConfig  = {
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
                    display: false
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
            path:'/signUp',
            component : React.lazy(()=> import('./SignUp'))
        }
    ]
}

export default  signUpConfig