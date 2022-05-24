
/**
 * @author m.mahdi_rasouli <rasoulimohammadmahdi@yahoo.com>
 */

 import {useState , useEffect , createRef , useRef} from 'react';
 import React from 'react'
 import ActionBox from "../../../../components/ActionBox";
 import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider, TextField, Grid, Typography , InputAdornment } from '@material-ui/core';
 import {useDispatch, useSelector} from "react-redux";
 import { SERVER_URL } from './../../../../../../configs'
 import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
 import axios from 'axios';
 import CircularProgress from "@material-ui/core/CircularProgress";
 import checkPermis from "app/main/components/CheckPermision";
 import { useHistory } from "react-router-dom";
 import BusinessIcon from '@material-ui/icons/Business';
 import EventAvailableIcon from '@material-ui/icons/EventAvailable';
 import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';
 import CheckBoxIcon from '@material-ui/icons/CheckBox';
 import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
 import CloseIcon from '@material-ui/icons/Close';
 import ModalPro from "../../../../components/ModalPro";
 import FileCopyIcon from '@material-ui/icons/FileCopy';
 import Tooltip from "@material-ui/core/Tooltip";
 import ReactDOM from 'react-dom';
 import {CopyToClipboard} from 'react-copy-to-clipboard';

 
 const JobDescription = (props) => {
 
     const {showDescription,setShowDescription,jobInformation, closeIcon = true, submit=()=>{}, enterUsingURL = false, params} = props
 
     const [showMessageAndLink,setShowMessageAndLink] = useState(false)
 
     const  [notFoundUser, setNotFoundUser] = useState(false)
 
     const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
 
     const [jobInfo, setJobInfo] = useState(jobInformation) 

     const [loading, setLoading] = useState ((jobInformation !== undefined && Object.keys(jobInformation)?.length !== 0) ? false : true)

     const [copied, setCopied] = useState(false)

     const [incompleteParts, setIncompleteParts] = useState([])
 
     const history = useHistory()
 
     const dispatch = useDispatch();
 
     const axiosKey = {
         headers: {
             'api_key': localStorage.getItem('api_key')
         }
     }
 
     const request = () => {
         if(partyIdLogin !== undefined && partyIdLogin !== null){
             axios.get(SERVER_URL + `/rest/s1/humanres/checkForJob`, axiosKey).then(req => { 
                 console.log("req" , req?.data);
                 if(req.data?.status === "false" || req.data?.skillStatus === "false" || req.data?.contactStatus === "false" || req.data?.basicStatus === "false" || req.data?.partyQualificationStatus === "false"){
                     let incompleteArray = []
                     Object.keys(req.data).map((item,index) => {
                        if(req.data[item] === "false"){
                            if(item === "status"){
                                incompleteArray.push("در حال حاضر شما در روند بررسی یک شغل هستید ! اگر تمایل به درخواست برای این شغل دارید ، باید از درخواست شغل قبل انصراف دهید" )
                            }
                            if(item === "skillStatus"){
                                incompleteArray.push("تب مهارت و رزومه در پروفایل استعداد ها")
                            } 
                            if(item === "contactStatus"){
                                incompleteArray.push("تب اطلاعات تماس در پروفایل پرسنلی")
                            } 
                            if(item === "basicStatus"){
                                incompleteArray.push("تب اطلاعات پایه در پروفایل پرسنلی")
                            } 
                            if(item === "partyQualificationStatus"){
                                incompleteArray.push("سوابق شغلی و تحصیلی در پروفایل پرسنلی")
                            }
                        }
                        if(index === Object.keys(req.data).length-1){
                            setShowMessageAndLink(true)
                            setIncompleteParts(incompleteArray)
                        }
                     })
                 }else{
                    axios.get(SERVER_URL + `/rest/s1/humanres/applyForJob?jobRequistionId=${jobInfo?.jobRequistionId}`, axiosKey).then(reqAcc => {
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'درخواست شما با موفقیت ثبت شد'));
                        if(!closeIcon){submit()}
                    })
                 }
             })
         }else{
             setNotFoundUser(true)
         }
     }
 
     let moment = require('moment-jalaali')
 
     React.useEffect(()=>{
         if(params !== undefined && params !== null){
             axios.get(`${SERVER_URL}/rest/s1/humanres/AdvanceJobReqSearch` , {jobReqInfo : {}} , axiosKey).then((jobs)=>{
                 setJobInfo(jobs.data?.jobRequistion.find(o => o?.jobRequistionId === params ))
                 setLoading(false)
             }).catch(()=>{
                 setLoading(false)
                 dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
             })
         }
     },[params])
     
      
     React.useEffect(()=>{
        if(jobInformation !== undefined && Object.keys(jobInformation)?.length !== 0){
            setJobInfo(jobInformation)
            setCopied(false)
        }
     },[jobInformation])

     return (
         <div>
             {(jobInfo !== undefined && Object.keys(jobInfo).length !== 0 && !loading) ? 
                <Card style={{marginTop : "7px"}}>
                    <CardContent>
                        <Grid container style={{overflowY : "scroll" , overflowX : "hidden" , maxHeight: "500px" , direction : "ltr"}} >
                            <Grid item xs={12} md={12} style={{ direction : "rtl"}} >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={10} style={{display : "flex" , alignItems : "center" , justifyContent : "flex-start"}}>
                                        <Typography style={{fontWeight : "bold" , fontSize : "20px"}}>{`${jobInfo?.requistionTitle}`}</Typography>
                                    </Grid>
                                    {closeIcon == true ? <Grid item xs={12} md={2} style={{display : "flex" , alignItems : "center" , justifyContent : "flex-end"}}>
                                        <Button onClick={()=>setShowDescription(false)}><CloseIcon/></Button>
                                    </Grid> : ""}
                                </Grid>
                                <Typography style={{marginLeft : "20px" , display : "flex" , alignItems : "center" , color : "#757575"}}><BusinessIcon style={{marginLeft : "10px"}}/>{`${jobInfo?.companyName ?? "-"}`}</Typography>
                                <Typography style={{marginLeft : "20px" , display : "flex" , alignItems : "center" , color : "#757575"}}><EventAvailableIcon style={{marginLeft : "10px"}}/>{jobInfo?.AdFromDate != "" ? moment(jobInfo?.AdFromDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD') : "-"}</Typography>
                                <Grid container spacing={2}>
                                    {/* <Grid item xs={12} md={4} style={{display : "flex" , alignItems : "center" , justifyContent : "flex-start"}}>
                                        <Button style={{color : "#6d48ff" , padding : 0}}><TurnedInNotIcon style={{marginLeft : "10px"}}/>افزودن به علاقه مندی ها</Button>
                                    </Grid> */}
                                    <Grid item xs={12} md={2}>
                                        <div/>
                                    </Grid>
                                    <Grid item xs={12} md={2} style={{display : "flex" , alignItems : "center" , justifyContent : "flex-end"}}>
                                        {copied ? <Typography style={{color: 'red' , fontSize : "12px"}}>لینک شغل کپی شد.</Typography> : null}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Tooltip title="برای کپی url کلیک کنید">
                                            <CopyToClipboard text={`http://fadak.sajayanegar.ir/#/jobBoards/${jobInfo?.jobRequistionId}`}
                                                onCopy={() => setCopied(true)}>
                                                <Button style={{padding : 0}} fullWidth >
                                                    <TextField
                                                        disabled={true}
                                                        id="url"
                                                        value={`http://fadak.sajayanegar.ir/#/jobBoards/${jobInfo?.jobRequistionId}`}
                                                        variant="outlined"
                                                        fullWidth
                                                        label={"معرفی شغل به دیگران"}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <FileCopyIcon style={{ color: "#979797"}} />
                                                                </InputAdornment>
                                                            ),
                                                            style: {height :  "40px"}
                                                        }}
                                                    />
                                                </Button>
                                            </CopyToClipboard>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} md={2} style={{display : "flex" , alignItems : "center" , justifyContent : "flex-end"}}>
                                        <Button style={{backgroundColor: "#039be5" , color : "white"}} onClick={request}><CheckBoxIcon style={{marginLeft : "10px"}}/>درخواست</Button>
                                    </Grid>
                                </Grid>
                                <Typography style={{fontWeight : "bold" , fontSize : "16px"}}>اطلاعات کلی شغل</Typography>
                                <Typography style={{marginLeft : "20px" , display : "flex" , alignItems : "center"}}><FiberManualRecordIcon style={{marginLeft : "10px" , width : "10px" , height : "10px"}}/>{`${jobInfo?.companyName ?? "-"}`}</Typography>
                                <Typography ><FiberManualRecordIcon style={{marginLeft : "10px" , width : "10px" , height : "10px"}}/>{`واحد سازمانی : ${jobInfo?.unitName ?? "-"}`}</Typography>
                                <Typography ><FiberManualRecordIcon style={{marginLeft : "10px" , width : "10px" , height : "10px"}}/>{`نوع قرارداد : ${jobInfo?.contractTypeEnum ?? "-"}`}</Typography>
                                <Typography ><FiberManualRecordIcon style={{marginLeft : "10px" , width : "10px" , height : "10px"}}/>{`مکان شغل : ${(jobInfo?.stateProvinceGeoName ? (jobInfo?.stateProvinceGeoName + "،") : "-")  + (jobInfo?.countyGeoName ?? "")}`}</Typography>
                                <Typography ><FiberManualRecordIcon style={{marginLeft : "10px" , width : "10px" , height : "10px"}}/>{`حوزه شغلی : ${jobInfo?.jobCategoryEnum ?? "-"}`}</Typography>
                                <Typography ><FiberManualRecordIcon style={{marginLeft : "10px" , width : "10px" , height : "10px"}}/>{`نیاز به سفر : ${jobInfo?.travelNeeded == "Y" ? "بله" : "خیر"}`}</Typography>
                                <Typography style={{fontWeight : "bold" , fontSize : "16px"}}>اطلاعات کارفرما و شرکت</Typography>
                                <Typography >{`${jobInfo?.companyDescription ?? "-"}`}</Typography>
                                <Typography style={{fontWeight : "bold" , fontSize : "16px"}}>اطلاعات تیم</Typography>
                                <Typography >{`${jobInfo?.orgDescription  ?? "-"}`}</Typography>
                                <Typography style={{fontWeight : "bold" , fontSize : "16px"}}>شرح شغل</Typography>
                                {/* <Typography > */}
                                    <div>
                                    {jobInfo?.jobDescription
                                        ?.split("\n")
                                        .map((line) => <Typography>{line}</Typography>) ?? "-"}
                                    </div>
                                {/* </Typography> */}
                            </Grid>
                        </Grid>
                    </CardContent>
                    <ModalPro
                        title={"سلام! به شهر مشاغل ما خوش آمدید"}
                        open={showMessageAndLink}
                        setOpen={setShowMessageAndLink}
                        content={
                            <Card>
                                <CardContent>
                                    {incompleteParts.includes("در حال حاضر شما در روند بررسی یک شغل هستید ! اگر تمایل به درخواست برای این شغل دارید ، باید از درخواست شغل قبل انصراف دهید" ) ?
                                        <div>
                                            <p> در حال حاضر شما در روند بررسی یک شغل هستید ! اگر تمایل به درخواست برای این شغل دارید ، باید از درخواست شغل قبل انصراف دهید</p> 
                                            <ActionBox>
                                                <Button type="submit" role="primary" onClick={()=> history.push(`/talentProfile`)}>
                                                    موقعیت های شغلی درخواستی
                                                </Button>
                                            </ActionBox>
                                        </div>
                                    :
                                        <div>
                                            <p> لطفا موارد زیر را تکمیل کنید</p>
                                            {incompleteParts.map((item,index) =>
                                                item !== "در حال حاضر شما در روند بررسی یک شغل هستید ! اگر تمایل به درخواست برای این شغل دارید ، باید از درخواست شغل قبل انصراف دهید" ?
                                                    <p>{index+1} - {item}</p>
                                                : ""
                                            )}
                                            {/* {incompleteParts.includes("در حال حاضر شما در روند بررسی یک شغل هستید ! اگر تمایل به درخواست برای این شغل دارید ، باید از درخواست شغل قبل انصراف دهید" ) ?  */}
                                                <ActionBox>
                                                    <Button type="submit" role="primary" onClick={()=> history.push(`/talentProfile`)}>
                                                    پروفایل استعدادها   
                                                    </Button>
                                                    <Button type="submit" role="primary" onClick={()=> history.push(`/userProfile`)}>
                                                    پروفایل پرسنلی   
                                                    </Button>
                                                </ActionBox>
                                            {/* :""} */}
                                        </div>
                                    }
                                </CardContent>
                            </Card>
                        }
                    />
                    <ModalPro
                        title={"عدم امکان درخواست شغل"}
                        open={notFoundUser}
                        setOpen={setNotFoundUser}
                        maxWidth="sm"
                        content={
                            <div>
                                <Typography>
                                    برای ثبت درخواست ابتدا وارد حساب کاربری خود شوید و یا ثبت نام کنید  
                                </Typography>
                                <Box mb={1}/>
                                <ActionBox>
                                    <Button type="submit" role="primary" onClick={()=> history.push(`/signUp`)}>
                                        ثبت نام
                                    </Button>
                                    <Button type="reset" role="secondary" onClick={()=> history.push(`/login`)}>
                                        لاگین
                                    </Button>
                                </ActionBox>
                            </div>
                        }
                    />
                </Card>
            :
                !loading ?
                    <Card variant='outlined' style={{display : "flex" , justifyContent : "center" , alignItems : "center" , height : "100vh"}}>
                        <Typography>مشخصات شغل مورد نظر یافت نشد !</Typography>
                    </Card>
                :
                    <Card variant='outlined' style={{display : "flex" , justifyContent : "center" , alignItems : "center" , height : "100vh"}}>
                        <Box textAlign="center" color="text.secondary">
                            <CircularProgress />
                            <Typography variant={"body1"}>در حال دریافت اطلاعات</Typography>
                        </Box>
                    </Card> 
            }
         </div>
     );
 };
 
 export default JobDescription;
 
 