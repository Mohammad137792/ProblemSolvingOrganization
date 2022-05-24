
import React from 'react'
import { Box, Card, CardContent, Typography, Button, Hidden } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { FuseAnimate } from '@fuse';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import JWTLoginTab from './JWTLoginTab';
import { makeStyles } from '@material-ui/styles';
import login_wallpaper from '../../../../images/login_background.jpg';
import headerImg from '../../../../images/logo.png';
import { useHistory } from 'react-router-dom';
const useStyles = makeStyles(theme => ({
    root: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + darken(theme.palette.primary.dark, 0.5) + ' 100%)',
        color: "#214d76"
    },
    loginBg: {
        position: "relative",
        zIndex: 1,
        backgroundImage: `url(${login_wallpaper})`,
        backgroundSize: "cover",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        width: "100%",
        height: "100%",
        // '&:before': {
        //     content: "''",
        //     display: "block",
        //     position: "absolute",
        //     zIndex: -1,
        //     width: "100%",
        //     height: "100%",
        //     top: 0,
        //     right: 0,
        //     backgroundColor: "rgba(52, 58, 64, .55)"
        // }
    },
    container: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    card: {
        borderRadius: 15,
        width: "48%"
    },
    cardMoile: {
        borderRadius: 15,
        width: "80%"
    },
    tylpo: {
        width: "51%",
        "& p": {
            width: "51%",
        }
    },
    welCome: {

    }
}));



function Login() {
    const classes = useStyles();

    const history = useHistory();
    const historyb = useHistory();

    const rout = () => {
        history.push(`\Register`)
    }
    const routb = () => {
        historyb.push(`\PasswordRecovery`)
    }

    return (
        <div
            style={{ width: "100%" }}
            className={clsx(classes.root, "flex flex-col flex-1 flex-shrink-0  md:flex-row md:p-0")}>

            <div style={{ width: "100%", overflow: "hidden" }}
                className={clsx(classes.loginBg, classes.container)}>
                {/* only={['sm', 'xs']}> */}
                {/* only={['md', 'lg', 'xl']}  */}
                <Hidden only={['sm', 'xs']} >
                    <div style={{ width: "40%", height: '80%', overflow: "hidden" }} className={clsx(classes.welCome)} >

                        <FuseAnimate animation="transition.slideUpIn" delay={300}>
                            <Typography variant="h3" style={{ width: "51%", color: "red" }} className={clsx(classes.tylpo, "text-center ")}>
                                خوش آمدید
                            </Typography>
                        </FuseAnimate>
                        <FuseAnimate delay={400}>
                            <Typography variant="subtitle1" className="max-w-512 text-center mt-16">
                            برای استفاده از سامانه، وارد حساب کاربری خود شوید.

                            </Typography>
                        </FuseAnimate>
                    </div>
                    <div style={{ width: "50%", justifyContent: 'flex-end', height: '90%', borderRadius: 15, display: 'flex' }}>



                        <FuseAnimate style={{ borderRadius: 15 }} animation={{ translateX: [0, '100%'] }}>

                            <Card style={{ width: '90%', borderRadius: 15 }} className={clsx(classes.card, " max-w-400 mx-auto m-16 md:m-0")} square>

                                <CardContent className="flex flex-col items-center justify-center   ">
                                    <img style={{ width: '50%' }} src={ headerImg} alt="sinaLogo" />

                                    <div style={{ width: '85%', color: '#ccc' }} >
                                        <Typography variant="h6" className="text-center md:w-full mt-48 mb-48">
                                            ورود به حساب کاربری
                                 </Typography>
                                        <JWTLoginTab />
                                        <div className="flex flex-col items-center justify-center pt-32">
                                            <Link className="font-medium mt-8" to="/PasswordRecovery">فراموشی کلمه عبور؟</Link>
                                            {/* <Link className="font-medium mt-8" to="/Register">ثبت نام</Link> */}

                                        </div>


                                    </div>

                                </CardContent>
                            </Card>
                        </FuseAnimate>
                    </div>
                </Hidden>
                <Hidden only={['md', 'lg', 'xl']} >
                    <div style={{ width: "100%", justifyContent: 'flex-end', height: '90%', borderRadius: 15, display: 'flex' }}>
                        <FuseAnimate style={{ borderRadius: 15 }} animation={{ translateX: [0, '100%'] }}>

                            <Card style={{ borderRadius: 15 }} className={clsx(classes.cardMoile, " max-w-400 mx-auto m-16 md:m-0")} square>

                                <CardContent className="flex flex-col items-center justify-center   ">
                                    {/* <img style={{ width: '50%' }} src={headerLogin} alt="sinaLogo" /> */}

                                    <div style={{ width: '100%' }} >
                                        <Typography variant="h6" className="text-center md:w-full mt-48 mb-48">
                                            ورود به حساب کاربری
                                         </Typography>
                                        <JWTLoginTab />
                                        <div className="flex flex-col items-center justify-center pt-32">
                                            <Link className="font-medium mt-8" to="/PasswordRecovery">فراموشی کلمه عبور؟</Link>
                                            {/* <Link className="font-medium mt-8" to="/Register">ثبت نام</Link> */}
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        </FuseAnimate>
                    </div>
                </Hidden>
            </div>
        </div>

    )
}

export default Login;




