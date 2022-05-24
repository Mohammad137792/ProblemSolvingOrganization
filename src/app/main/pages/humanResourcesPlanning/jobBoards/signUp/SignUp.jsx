
/**
 * @author m.mahdi_rasouli <rasoulimohammadmahdi@yahoo.com>
 */

import FormPro from "../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import ActionBox from "../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider, TextField, Grid, Typography } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import { useHistory } from "react-router-dom";
import titleBox from '../../../../../../images/jobImages/titleBox.jpg';
import login_wallpaper from '../../../../../../images/login_background.jpeg';
import {makeStyles} from '@material-ui/styles';
import {darken} from '@material-ui/core/styles/colorManipulator';
import clsx from 'clsx';
import { setPermision } from "app/store/actions/fadak";
import FadakAPIService from 'app/services/fadakAPIService';
import { setUserData } from '../../../../../auth/store/actions/user.actions';
import * as Actions from 'app/store/actions';
import { addConstData, emptyConstData } from "../../../../../store/actions/fadak";
import * as authActions from "app/auth/store/actions";
import { setUser } from "../../../../../store/actions/fadak";
import {setAuthFunction} from './../../../../helpers/setAuthMobile'
import Formsy from 'formsy-react';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";



export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';


const useStyles = makeStyles(theme => ({
    root: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + darken(theme.palette.primary.dark, 0.5) + ' 100%)',
        color: theme.palette.primary.contrastText
    },
    loginBg: {
        position: "relative",
        zIndex: 1,
        backgroundImage: `url(${login_wallpaper})`,
        backgroundSize: "cover",
        '&:before': {
            content: "''",
            display: "block",
            position: "absolute",
            zIndex: -1,
            width: "100%",
            height: "100%",
            top: 0,
            right: 0,
            backgroundColor: "rgba(52, 58, 64, .55)"
        }
    }
}));


const SignUp = () => {

    const classes = useStyles();

    const [formValues, setFormValues] = React.useState({});
    const [formValidation, setFormValidation] = React.useState({});

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const history = useHistory()

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [clicked, setClicked] = useState(0);
    const submitRef = createRef(0);

    React.useEffect(() => {
        if (submitRef.current && clicked > 0) {
            submitRef.current.click();
        }
      }, [clicked]);

    const registerFormStructure = [{
        name: "username",
        label: "نام کاربری",
        type: "text",
        required: true,
        validator: values => {
            const username = values.username;
            return new Promise((resolve, reject) => {
                if( /[^a-z0-9]/i.test(username) || username.length>30 || username.length<6 ){
                    resolve({error: true, helper: "نام کاربری باید بین 6 تا 30 کاراکتر و فقط شامل اعداد و حروف لاتین باشد!"})
                }
                axios.get(SERVER_URL + `/rest/s1/humanres/checkUsername?username=${formValues?.username}`, axiosKey).then(res => {
                    if(res.data?.isDuplicated == true){
                        resolve({error: true, helper: "این نام کاربری تکراری است."})
                    }
                    resolve({error: false, helper: ""})
                }).catch(err => {
                    reject({error: true, helper: ""})
                })
            })
        },
        col : 6
    },{
        name: "nationalcode",
        label: "کد ملی",
        type: "number",
        required: true,
        validator: values=>{
            const nationalId = `${values.nationalcode}`
            console.log("nationalId" , nationalId);
            console.log("nationalIdLength" , nationalId.length);
            return new Promise(resolve => {
                if(nationalId.length !== 10){
                    resolve({error: true, helper: "کد ملی اشتباه است."})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        col : 6
    },{
        name: "currentPassword",
        label: "رمز ورود",
        type: "password",
        autoComplete: "new-password",
        required: true,
        validator: values => {
            const rule = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s)(?=.{8,})"
            const password = values.currentPassword;
            const message = "رمز عبور باید حداقل 8 کاراکتر و شامل حروف کوچک و بزرگ لاتین، اعداد و علائم ویژه باشد!";
            return new Promise(resolve => {
                if(password.match(rule)){
                    resolve({error: false, helper: ""})
                }else{
                    resolve({error: true, helper: message})
                }
            })
        },
        col : 6
    },{
        name: "newPasswordVerify",
        label: "تکرار رمز ورود",
        type: "password",
        required: true,
        validator: values => {
            const password = values.currentPassword;
            const passwordVerify = values.newPasswordVerify;
            const message = "تکرار رمز عبور صحیح نیست!"
            return new Promise(resolve => {
                if(passwordVerify===password){
                    resolve({error: false, helper: ""})
                }else{
                    resolve({error: true, helper: message})
                }
            })
        },
        col : 6
    },{
        name: "emailAddress",
        label: "ایمیل",
        type: "text",
        validator: values => {
            const email = values.emailAddress;
            return new Promise(resolve => {
                if (!email || /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                    resolve({error: false, helper: ""})
                }else{
                    resolve({error: true, helper: "آدرس ایمیل اشتباه است."})
                }
            })
        },
        col : 6
    }, {
        name: "knowCompanyEnumId",
        label: "نحوه آشنایی با ما",
        type: "select",
        options: fieldsInfo?.KnowCompanyType,
        col : 6
    }, {
        type : "component" ,
        component : 
            <div style={{display : "flex" , alignItems : "center" , justifyContent : "flex-start"}}>
                <FormControlLabel label={"دریافت اعلانات مربوط به شغل های جدید"}
                    control={
                        <Checkbox name={"callForNewJob"}
                            // checked={value === true}
                            onChange={e => setFormValues(Object.assign({},formValues,{callForNewJob : e.target.checked}))}
                        />
                    }
                />
            </div>,
        col : 12
    },
    //  {
    //     type : "component" ,
    //     component : 
    //         <div style={{display : "flex" , alignItems : "center" , justifyContent: "flex-start" , marginRight : "2%"}}>
    //             <Typography>با ثبت نام در فدک جاب ،</Typography>
    //             <Typography style={{color : "blue"}}>قوانین و مقررات </Typography>
    //             <Typography>فدک جاب را خواهید پذیرفت</Typography>
    //         </div>,
    //     col : 12
    // },
     {
        type : "component" ,
        component : 
            <div style={{display : "flex" , alignItems : "center" , justifyContent: "center"}}>
                {/* <Formsy
                    onValidSubmit={handleSignUp}
                    ref={submitRef}
                    className="flex flex-col justify-center w-full"
                > */}
                    <Button style={{width : "50%" , backgroundColor : "#43a047" , color : "white"}} onClick={()=>trigerHiddenSubmitBtn()}                                    
                        disabled={waiting}
                        endIcon={waiting?<CircularProgress size={20}/>:null}> ثبت نام</Button>
                {/* </Formsy> */}
            </div>,
        col : 12
    },{
        type    : "component",
        component : 
            <div style={{display : "flex" , alignItems : "center" , justifyContent: "center"}}>
                <Typography >در حال حاضر یک حساب کاربری دارید؟ </Typography>
                <Button style={{ color : "#438bfe" , padding : 0}} onClick={()=> history.push(`/login`)}>ورود</Button>
            </div>,
        col     : 12 ,
    },{
        type    : "component",
        component : 
            <div style={{marginBottom : "20px" , display : "flex" , alignItems : "center" , justifyContent: "center"}}>
                <Typography >آیا کلمه عبور خود را فراموش کرده اید؟</Typography>
                <Button style={{ color : "#438bfe" , padding : 0 }} > بازیابی کلمه عبور</Button>
            </div>,
        col     : 12 ,
    }] 

    React.useEffect(()=>{
        axios.get(`${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=KnowCompanyType`, axiosKey).then((enumsInfo)=>{
            setFieldsInfo(enumsInfo?.data?.enums)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        });
    },[])

    const handleSignUp = () => {
        // dispatch(setUser(null))
        axios.get(SERVER_URL + `/rest/s1/humanres/submitNewUser?username=${formValues?.username}&nationalcode=${formValues?.nationalcode}&currentPassword=${formValues?.currentPassword}&newPasswordVerify=${formValues?.newPasswordVerify}&emailAddress=${formValues?.emailAddress ?? ""}&knowCompanyEnumId=${formValues?.knowCompanyEnumId ?? ""}&callForNewJob=${formValues?.callForNewJob == true ? "Y" : "N" }` , axiosKey).then(sign => { 
            // const packet = {
            //     email : formValues?.username ,
            //     password: formValues?.password
            // }
            // setAuthFunction(packet)
            // dispatch(authActions.submitLogin(packet));
            // history.push(`/dashboard`)
            dispatch(authActions.logoutUser());
            dispatch(setUser(null));
            window.location.replace("/");

        })
    }

    const trigerHiddenSubmitBtn = () => {
        setClicked(clicked+1)
    }

    return (
        <div style={{ backgroundColor : "#f7f7f7" , display : "flex" , alignItems : "center" , justifyContent: "center" , height: '100vh'}}
        className={clsx(classes.loginBg, "flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left")}>
            <Box mb={2}/>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <div/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card stye={{backgroundColor : "#eeeeee"}} variant="outlined">
                        <div style={{position : "relative"}}>
                            <img src={titleBox} style={{width : "100%" , height : "100px"}}/>
                            <p style={{position : "absolute" , top: "10px" , right: "45%" , color : "white" , fontWeight : "bold" , fontSize : "24px"}}>ثبت نام </p>
                        </div>
                        <CardContent>
                            <FormPro
                                prepend={registerFormStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                formValidation={formValidation}
                                setFormValidation={setFormValidation}
                                submitCallback={handleSignUp}
                                actionBox={
                                    <ActionBox>
                                        <Button
                                        ref={submitRef}
                                        type="submit"
                                        role="primary"
                                        style={{ display: "none" }}
                                        />
                                    </ActionBox>
                                }
                            /> 
                        </CardContent>   
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div/>
                </Grid>
            </Grid>
            <Box mb={2}/>
        </div>
    );
};

export default SignUp;
