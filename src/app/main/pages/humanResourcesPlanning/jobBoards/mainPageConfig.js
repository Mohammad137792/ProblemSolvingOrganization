import React from 'react'

const mainPageConfig  = {
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
            path:'/jobBoards/:jobid?',
            component : React.lazy(()=> import('./MainPage'))
        }
    ]
}

export default  mainPageConfig