import { Card, CardContent, CardHeader } from '@material-ui/core'
import React from 'react'
import a from '../../../../../images/FormImages/a.jpg'

export default function Rulings() {
    return (
        // <div>Rulings</div>
        <>
            <CardHeader
                title={" مشاهده فرم ابلاغ"}
            />

            <CardContent style={{width:'100%' , display:'flex'}}>
                <img src={a} alt="احکام" width="70%" style={{ margin: 'auto' }} />
            </CardContent>
        </>
    )
}
