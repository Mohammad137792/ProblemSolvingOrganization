
import React, { useEffect, useRef, useState } from 'react';
import { FusePageSimple } from "@fuse";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";

import { Box, Button, Card, CardContent, CardMedia, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import ActionBox from 'app/main/components/ActionBox';
import VerificationLevel from './Tab/VerificationLevel';
import CasesAllowedChange from './Tab/CasesAllowedChange';
import TabPro from 'app/main/components/TabPro';
import axios from "../../../api/axiosRest";
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { useDispatch } from 'react-redux';
import FormImagesa from '../../../../../images/FormImages/a.jpg'
import DisplayField from 'app/main/components/DisplayField';
import Signature from 'app/main/components/Signature';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import { CloudUpload, Image, Visibility } from "@material-ui/icons"
import { color } from 'd3';

const CommunicationForm = (props) => {
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
        faDownload: { position: "absolute", bottom: 0, left: 0 }
    }));
    const classes = useStyles()
    const [formNumber, setformNumber] = useState("..........")
    const [image, setImage] = useState(null)
    const inputRef = useRef(null);
    const [style, setStyle] = useState({ display: 'none',fontSize:"1vw",color:"gray" });

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
    return (
        <Card className={classes.card}>
            <div className={classes.con}>
                <CardContent className={classes.content}>
                    <div style={{ position: 'relative' }} >
                        <CardMedia
                            component="img"
                            className={classes.media}
                            image={FormImagesa}
                        />
                        <Grid container direction="row" style={{ height: "30%" }}>
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
                                ???? ?????????? ???????? 5 ?????????? ???????? ?????? ???? ???????????? ???????? ???? ?????????????? ?????????? &nbsp;
                                <b>{formNumber} ,</b>
                                &nbsp;???????? ???? ???????????????? ???? ???????? ?????? ?????????? ???? ??????????&nbsp;
                                <b>{formNumber}</b> <b>{formNumber}</b> <b>{formNumber}</b>
                                &nbsp;?????????? ???? ??????.&nbsp;
                                <b>{formNumber}</b>
                                &nbsp;???????? ?????? ???? ???? ?????? ?????????? ?????????? ?????? ?? ???????? ???? ?????????? ?????????? ???????????? ?? ?????????? ???? ???????? ?????????? ???????? ?????? ?????? ???? ???????????? ?????? ?????? ???????? ???????? ?? ???? ?????????? ?????????? ?????????? ???? ?????????? ???????????? ???????? ?? ???????????? ???????? ?? ???????? ??????????.&nbsp;

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
                                    setStyle(prevState=>({...prevState, display: 'none' }))
                                }} onMouseEnter={e => {
                                    setStyle(prevState=>({...prevState, display: 'block' }))


                                }}>
                                    {image ? <Grid item xs={6} sm={6} style={{ width: "100%", justifyContent: "flex-end", alignItems: "center", display: "flex" }} >
                                        <CloseIcon onClick={deleteImage}  style={style}></CloseIcon>
                                    </Grid> : ""}
                                    {image ? <Grid item xs={6} sm={6} style={{ width: "100%", justifyContent: "flex-end", alignItems: "center", display: "flex" }} >
                                        <img src={image} style={{ width: "50%", height: "50%" }} />
                                    </Grid> : ""}
                                    {!image ? <Grid item xs={12} sm={12}>
                                        <div style={{ width: "100%" }}>
                                            <Typography align="justify" style={{ fontSize: "1vw" }}>?????????? ?????? ???????? </Typography>
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





export default CommunicationForm;




