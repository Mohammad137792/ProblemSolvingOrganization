
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import FormImagesa from '../../../../../images/FormImages/a.jpg'
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { CloudUpload, Image, Visibility } from "@material-ui/icons"

const CommunicationPrintedForm = (props) => {
    const {componentRef}=props;
    const [formNumber, setformNumber] = useState("..........")
    
    return (
        <Card>
            <CardContent  ref={componentRef} >
                <div style={{
                    paddin: "20%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }} >              <Typography align="justify" style={{ fontSize: "1vw" }}>
                        در اجرای ماده 5 قانون شوری های حل اختلاف وبنا به پیشنهاد شماره &nbsp;
                        <b>{formNumber} ,</b>
                        &nbsp;رئیس کل دادگستری به موجب این ابلاغ به عنوان&nbsp;
                        <b>{formNumber}</b> <b>{formNumber}</b> <b>{formNumber}</b>
                        &nbsp;منصوب می شود.&nbsp;
                        <b>{formNumber}</b>
                        &nbsp;امید است با در نظر داشتن اهمیت صلح و سازش در اجرای عدالت اسلامی و حمایت از حقوق مشروع مردم این امر را سرلوحه کار خود قرار داده و در انجام وظایف محوله با رعایت موازین شرعی و قانونی موفق و موید باشید.&nbsp;

                    </Typography></div>
            </CardContent>
        </Card>

    )
}





export default CommunicationPrintedForm;




