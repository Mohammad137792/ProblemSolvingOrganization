
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import FormImagesa from '../../../../../images/FormImages/a.jpg'
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { CloudUpload, Image, Visibility } from "@material-ui/icons"
import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";
const CommunicationElectronicForm = (props) => {
    const { componentRef } = props;
    const useStyles = makeStyles(() => ({
        bg: {
            backgroundImage: `url(${FormImagesa})`,
            // height: 1356,
            backgroundSize: "cover",
            maxWidth: "100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            position: "relative"
            // backgroundAttachment: "fix",

        },
        card: {
            display: 'flex',
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            width: 151,
        },
        controls: {
            display: 'flex',
            alignItems: 'center',
        },
        container: {
            position: 'relative',
            textAlign: 'center',
            color: 'white',
        },
        topasad: {
            color: 'blue',
            position: 'absolute',
            top: '10%',
            left: '50%',
        },

        media: {
            display: 'flex',
            height: "100%",
            objectFit: 'contain',
            alignItems: 'left',

        },
        container: { position: "relative" },
        img: { display: "block" },
        faDownload: { position: "absolute", bottom: 0, left: 0 },
        btnPrint: { display: "none" }

    }));

    const classes = useStyles()
    const [formNumber, setformNumber] = useState("..........")
    const [image, setImage] = useState(null)
    const inputRef = useRef(null);
    const [style, setStyle] = useState({ display: 'none', fontSize: "1vw", color: "gray" });

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];

            setImage(URL.createObjectURL(img))

        }
    };
    const handleUpload = () => {
        inputRef.current.click();
    }
    const deleteImage = () => {
        setImage(null)

    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <Card className={classes.card}>
            {/* <div>
                <IconButton onClick={handlePrint}>
                    <PrintIcon />
                </IconButton>
            </div> */}
            <div className={classes.con}>
                <CardContent className={classes.content}>
                    <div style={{ position: 'relative' }} ref={componentRef} >
                        <CardMedia
                            component="img"
                            image={FormImagesa}

                        />
                        <Grid container direction="row" style={{ height: "30%" }} >
                            <Grid item xs={6} sm={6} style={{ height: "100%" }} ></Grid>
                            <Grid item xs={6} sm={6} style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                                <Grid item xs={6} sm={6} style={{ height: "100%" }} ></Grid>
                                <Grid item xs={6} sm={6} style={{ height: "100%" }} >
                                    <Grid   >
                                        <Typography style={{
                                            position: 'absolute',
                                            top: "11%",
                                            left: '15%',
                                            transform: 'translateX(-50%)',
                                            fontSize: "1vw"
                                        }}>{formNumber} </Typography>
                                    </Grid>
                                    <Grid   >
                                        <Typography style={{
                                            position: 'absolute',
                                            top: "15%",
                                            left: '15%',
                                            transform: 'translateX(-50%)',
                                            fontSize: "1vw"

                                        }}>{formNumber} </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <div style={{
                            position: 'absolute',
                            top: "30%",
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: "black"
                        }} >              <Typography align="justify" style={{ fontSize: "1vw" }}>
                                در اجرای ماده 5 قانون شوری های حل اختلاف وبنا به پیشنهاد شماره &nbsp;
                                <b>{formNumber} ,</b>
                                &nbsp;رئیس کل دادگستری به موجب این ابلاغ به عنوان&nbsp;
                                <b>{formNumber}</b> <b>{formNumber}</b> <b>{formNumber}</b>
                                &nbsp;منصوب می شود.&nbsp;
                                <b>{formNumber}</b>
                                &nbsp;امید است با در نظر داشتن اهمیت صلح و سازش در اجرای عدالت اسلامی و حمایت از حقوق مشروع مردم این امر را سرلوحه کار خود قرار داده و در انجام وظایف محوله با رعایت موازین شرعی و قانونی موفق و موید باشید.&nbsp;

                            </Typography></div>
                        <div style={{
                            position: 'absolute',
                            left: '20%',
                            transform: 'translateX(-50%)',
                            top: "63%",
                            bottom: "5%",
                            color: "black"
                        }} >
                            <Grid item xs={12} sm={12} style={{ width: "100%", justifyContent: "center", alignItems: "center", display: "flex" }}>
                                <Grid item xs={12} sm={12} onMouseLeave={e => {
                                    setStyle(prevState => ({ ...prevState, display: 'none' }))
                                }} onMouseEnter={e => {
                                    setStyle(prevState => ({ ...prevState, display: 'block' }))


                                }}>
                                    {image ? <Grid item xs={6} sm={6} style={{ width: "100%", justifyContent: "flex-end", alignItems: "center", display: "flex" }} >
                                        <CloseIcon onClick={deleteImage} style={style}></CloseIcon>
                                    </Grid> : ""}
                                    {image ? <Grid item xs={6} sm={6} style={{ width: "100%", justifyContent: "flex-end", alignItems: "center", display: "flex" }} >
                                        <img src={image} style={{ width: "50%", height: "50%" }} />
                                    </Grid> : ""}
                                    {!image ? <Grid item xs={12} sm={12}>
                                        <div style={{ width: "100%" }}>
                                            <Typography align="justify" style={{ fontSize: "1vw" }}>آپلود عکس امضا </Typography>
                                        </div>

                                        <input type="file" name="myImage" onChange={onImageChange} ref={inputRef}
                                            style={{ display: "none" }} />
                                        <IconButton >
                                            <CloudUpload onClick={handleUpload}>
                                            </CloudUpload>
                                        </IconButton>
                                    </Grid> : ""}
                                </Grid>
                            </Grid>
                        </div>
                    </div>



                </CardContent>
            </div>
        </Card>

    )
}





export default CommunicationElectronicForm;




