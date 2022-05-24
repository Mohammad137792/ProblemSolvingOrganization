
/**
 * @author m.mahdi_rasouli <rasoulimohammadmahdi@yahoo.com>
 */

 import FormPro from "../../../components/formControls/FormPro";
 import {useState , useEffect , createRef} from 'react';
 import React from 'react'
 import ActionBox from "../../../components/ActionBox";
 import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider, TextField, Grid, Typography } from '@material-ui/core';
 import {useDispatch, useSelector} from "react-redux";
 import { SERVER_URL } from './../../../../../configs'
 import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
 import axios from 'axios';
 import CircularProgress from "@material-ui/core/CircularProgress";
 import checkPermis from "app/main/components/CheckPermision";
 import { useHistory, useParams } from "react-router-dom";
 import logo_fadak from '../../../../../images/jobImages/logo_fadak.jpg';
 import {makeStyles} from '@material-ui/styles';
 import BusinessIcon from '@material-ui/icons/Business';
 import EventAvailableIcon from '@material-ui/icons/EventAvailable';
 import PlaceIcon from '@material-ui/icons/Place';
 import VpnKeyIcon from '@material-ui/icons/VpnKey';
 import InfoIcon from '@material-ui/icons/Info';
 import HowToRegIcon from '@material-ui/icons/HowToReg';
 import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
 import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
 import JobFullDescription from "./jobDescription/JobDescription";
 
 
 const useStyles = makeStyles(theme => ({
     hover: {
         "&:hover": {
             backgroundColor: theme.palette.action.hover //"#f5f5f5"
         },
         padding : 0
     },
     box:{
         '& .MuiOutlinedInput-root': {
             '& fieldset': {
               borderRadius: `4px 0 0 4px`,
             },
           },
     },
     noBorder: {
         border: "none",
     },
 }));
 
 
 const MainPage = () => {
 
     const classes = useStyles()
 
     const history = useHistory()
 
     const [filterFormValues, setFilterFormValues] = React.useState({});
 
     const [jobInfo, setJobInfo] = useState({}) 
 
     const [jobsList,setJobsList] = useState([]) 
 
     const [moreFilter, setMoreFilter] = useState(false);
 
     const [waiting, set_waiting] = useState(false) 
 
     const [fieldInfo , setFieldInfo] = useState({});
 
     const [showDescription,setShowDescription] = useState(false) 

     const [loading, setLoading] = useState ((params?.jobid === undefined || params?.jobid === null) ? true : false)
 
     const params = useParams()
 
     const dispatch = useDispatch();
 
     const axiosKey = {
         headers: {
             'api_key': localStorage.getItem('api_key')
         }
     }
 
     let moment = require('moment-jalaali')
 
     const getData = () => {
         axios.get(`${SERVER_URL}/rest/s1/humanres/AdvanceJobReqSearch` , {jobReqInfo : {}} , axiosKey).then((jobs)=>{
             setJobsList(jobs.data?.jobRequistion)
             axios.get(`${SERVER_URL}/rest/s1/humanres/FadakJobs`, axiosKey).then((info)=>{
                 axios.get(`${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=ContractType,universityFields,ReleaseDate`, axiosKey).then((enm)=>{
                     setFieldInfo({...info.data?.FadakJobs,...enm.data?.enums})
                     setLoading(false)
                 }).catch(()=>{
                     dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
                 })
             }).catch(()=>{
                 dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
             })
         }).catch(()=>{
             dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
         })
     }
 
     React.useEffect(()=>{
         getData()
     },[])
 
     const filterFormStructure = [{
         name: "requistionTitle",
         label: "عنوان شغلی",
         type: "text",
         col : 4
     },{
         name: "stateProvinceGeoId",
         label: "استان",
         type: "select",
         optionLabelField: "geoName",
         optionIdField: "geoId",
         options: fieldInfo?.Province ?? [],
         col : 2
     },{
         name: "countyGeoId",
         label: "شهرستان",
         type: "select",
         optionLabelField: "geoName",
         optionIdField: "geoId",
         options: fieldInfo?.County ?? [],
         col : 2
     }, {
         name: "jobCategoryEnumId",
         label: "حوزه شغلی",
         type: "select",
         optionLabelField: "description",
         optionIdField: "enumId",
         options: fieldInfo?.JobCategory ?? [],
         col : 2
     }, {
         type: "component",
         component : 
             <div>
                 <div style={{display : "flex" , alignItems : "center" ,justifyContent : "center" }}>
                     <ActionBox >
                         <Button type="submit" role="primary" onClick={()=>handleFilter()} 
                             disabled={waiting}
                             endIcon={waiting?<CircularProgress size={20}/>:null}
                         >جستجو</Button>
                     </ActionBox> 
                 </div>
                 {!moreFilter ? 
                     <div style={{display : "flex" , alignItems : "center" ,justifyContent : "center" }}>
                         <Button onClick={()=>setMoreFilter(true)}>جستجو پیشرفته <KeyboardArrowDownIcon/></Button> 
                     </div>
                 :""}
             </div>,
         col : 2 ,
     }, {
         name: "contractTypeEnumId",
         label: "نوع قرارداد",
         type: "select",
         optionLabelField: "description",
         optionIdField: "enumId",
         options: fieldInfo?.ContractType ?? [],
         display: moreFilter , 
         col : 2 ,
     }, {
         name: "workExperience",
         label: "میزان تجربه کاری (سال)",
         type: "number",
         col : 2 ,
         display: moreFilter
     }, {
         name: "fieldEnumId",
         label: "تحصیلات",
         type: "select",
         options: fieldInfo?.UniversityFields ?? [],
         optionLabelField: "description",
         optionIdField: "enumId",
         col : 2 ,
         display: moreFilter
     }, {
         name: "AdFromDate",
         label: "تاریخ انتشار اگهی",
         type: "select",
         options: fieldInfo?.ReleaseDate ?? [],
         optionLabelField: "description",
         optionIdField: "enumId",
         col : 2 ,
         display: moreFilter
     },{
         type: "component",
         component : <div/> ,
         display: moreFilter ,
         col : 2
     },{
         type: "component",
         component : 
             <div style={{display : "flex" , alignItems : "center" ,justifyContent : "center" }}>
                 <Button  onClick={()=>setMoreFilter(false)}>بستن <KeyboardArrowUpIcon/></Button> 
             </div>,
         col : 2 ,
         display: moreFilter
     }]
 
     React.useEffect(()=>{
         if(params?.jobid !== undefined && params?.jobid !== null){
             setJobInfo(jobsList.find(o => o?.jobRequistionId === params?.jobid ))
         }
     },[params?.jobid])
 
     const handleSignUp = () => {
         history.push(`/signUp`)
     }
 
     const submitAds = (rowData) => {
         setShowDescription(true)
         setJobInfo(rowData)
     }
 
     function JobDescription (props) {
 
         const {input,index} = props
 
         return (
             <Grid item xs={12} md={12}  style={{ direction : "rtl"}} >
                 <Box className={classes.hover} onClick={()=>submitAds(input)}>
                     <p style={{marginRight : "20px" , fontWeight : "bold" , fontSize : "16px" , paddingTop : "10px" , paddingBottom : 0}}>{input?.requistionTitle}</p>
                     <div style={{display : "flex" , alignItems : "center" , justifyContent: "flex-start"}}>
                         <p style={{marginLeft : "20px" , marginRight : "20px" , display : "flex" , alignItems : "center" , color : "#757575"}}><BusinessIcon style={{marginLeft : "10px"}}/>{input?.companyName}</p>
                         <Divider orientation="vertical" flexItem />
                         <p style={{marginLeft : "20px" , marginRight : "20px"  , display : "flex" , alignItems : "center" , color : "#757575"}}><PlaceIcon style={{marginLeft : "10px"}}/>{(input?.stateProvinceGeoName ? (input?.stateProvinceGeoName + "،") : "")  + (input?.countyGeoName ?? "")}</p>
                         <Divider orientation="vertical" flexItem />
                         <p style={{marginLeft : "20px" , marginRight : "20px"  , display : "flex" , alignItems : "center" , color : "#757575"}}><EventAvailableIcon style={{marginLeft : "10px"}}/>{moment(input?.AdFromDate).locale('fa', { useGregorianParser: true }).format('jYYYY/jMM/jDD')}</p>
                     </div>
                     {!showDescription ?
                        //  <p style={{marginLeft : "20px" , marginRight : "20px" , color : "#757575"}}>{input?.jobDescription}</p>
                        <div>
                            {input?.jobDescription
                                ?.split("\n")
                                .map((line) => <Typography>{line}</Typography>) ?? "-"}
                        </div>
                     :""}
                 </Box>
             </Grid>
         )
     }   
 
     const handleFilter = () => {
         axios.get(`${SERVER_URL}/rest/s1/humanres/AdvanceJobReqSearch?requistionTitle=${filterFormValues?.requistionTitle ?? ""}&stateProvinceGeoId=${filterFormValues?.stateProvinceGeoId ?? ""}&countyGeoId=${filterFormValues?.countyGeoId ?? ""}&jobCategoryEnumId=${filterFormValues?.jobCategoryEnumId ?? ""}&contractTypeEnumId=${filterFormValues?.contractTypeEnumId ?? ""}&workExperience=${filterFormValues?.workExperience ?? ""}&fieldEnumId=${filterFormValues?.fieldEnumId ?? ""}&releaseDate=${filterFormValues?.AdFromDate ?? ""}` , axiosKey).then((jobs)=>{
             setJobsList(jobs.data?.jobRequistion)
             setShowDescription(false)
         })
     }
 
     const login = () => {
         history.push(`/login`)
     }
 
     return (
         <div>
             {(params?.jobid === undefined || params?.jobid === null) ?
                <div>
                    {!loading ? 
                        <div style={{ backgroundColor : "#f4f5f7" , height : "100vh" , overflowX : "hidden"}}>
                            <Card style={{backgroundColor : "#444444"}}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={1}>
                                            <div/>
                                        </Grid>
                                        <Grid item xs={12} md={5} style={{display : "flex" , alignItems : "center" }} >
                                            <img src={logo_fadak} style={{width : "10%" , height : "40px" , marginLeft : "20px" , marginRight : "20px" , marginTop : "5px"}} />
                                            <Typography style={{width : "90%" , marginLeft : "20px" , color : "#c9c9c9"}} variant="h6">به شهر شغل فدک خوش آمدید</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <div/>
                                        </Grid>
                                        <Grid item xs={12} md={3} style={{display : "flex" , alignItems : "center" , justifyContent : "flex-end"}} >
                                            <Button onClick={login} style={{color : "#c9c9c9"}}><VpnKeyIcon style={{marginLeft : "10px"}}/> ورود</Button>
                                            <Button onClick={handleSignUp} style={{color : "#c9c9c9"}}><HowToRegIcon style={{marginLeft : "10px"}}/>ثبت نام</Button>
                                            <Button style={{color : "#c9c9c9"}} ><InfoIcon style={{marginLeft : "10px"}}/>درباره فدک</Button>
                                        </Grid>
                                        <Grid item xs={12} md={1}>
                                            <div/>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                
                            <div style={{marginTop : "10px"}}>
                                <Grid container spacing={2} >
                                    <Grid item xs={12} md={1}>
                                        <div/>
                                    </Grid>
                                    <Grid item xs={12} md={10}>
                                        <Card >
                                            <CardContent>
                                                <FormPro
                                                    prepend={filterFormStructure}
                                                    formValues={filterFormValues}
                                                    setFormValues={setFilterFormValues}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                        <div/>
                                    </Grid>
                                </Grid>
                            </div>
                            <div style={{marginTop : "10px" , marginBottom : "20px"}}>
                                <Grid container spacing={2} style={{display : "flex", justifyContent: "center"}} >
                                    <Grid item xs={12} md={1}>
                                        <div/>
                                    </Grid>
                                    <Grid item xs={12} md={showDescription ? 4 : 10}  >
                                        <Card>
                                            <CardContent>
                                                <Grid container style={{overflowY:"scroll" , maxHeight : "500px" , direction : "ltr"}} >
                                                    {jobsList && jobsList.map((input,index)=>(
                                                        <JobDescription key={index} input={input} index={index}/>
                                                    ))}
                                                </Grid>
                                                {jobsList.length == 0 ?
                                                    <div style={{display : "flex", justifyContent: "center" , alignItems : "center" , height : "400px"}}>
                                                        <Typography color={"textSecondary"}>آگهی وجود ندارد</Typography>
                                                    </div>
                                                :""}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    {showDescription ? 
                                        <Grid item xs={12} md={6} style={{padding : 0}}>
                                            <JobFullDescription showDescription={showDescription} setShowDescription={setShowDescription} jobInformation={jobInfo}/>
                                        </Grid>
                                    :""}
                                    <Grid item xs={12} md={1}>
                                        <div/>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    :
                        <Card variant='outlined' style={{display : "flex" , justifyContent : "center" , alignItems : "center" , height : "100vh"}}>
                            <Box textAlign="center" color="text.secondary">
                                <CircularProgress />
                                <Typography variant={"body1"}>در حال دریافت اطلاعات</Typography>
                            </Box>
                        </Card> 
                    }
                </div>
             :
                 <div style={{marginTop : "10px" , marginBottom : "20px" , backgroundColor : "#f4f5f7" , height : "100vh" , overflowX : "hidden"}} >
                     <Grid container spacing={2} style={{display : "flex", justifyContent: "center"}} >
                         <Grid item xs={12} md={2}>
                             <div/>
                         </Grid>
                         <Grid item xs={12} md={8}>
                             <JobFullDescription showDescription={showDescription} setShowDescription={setShowDescription} jobInformation={jobInfo} closeIcon={false} enterUsingURL={true}
                             params={params?.jobid}/>
                         </Grid>
                         <Grid item xs={12} md={2}>
                             <div/>
                         </Grid>
                     </Grid>
                 </div>
             }
         </div>
         
     );
 };
 
 export default MainPage;
 
 