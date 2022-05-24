import React, {useState,useEffect,createRef} from 'react';
import {FusePageSimple} from "@fuse";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import {CardContent,Divider,Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardHeader from '@material-ui/core/CardHeader';
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import DefineNeedAssessment from "./defineNeedAssessment";
import DefineApproval from "./defineApproval";
import OrganizationNeedsAssessment from "./organizationNeedsAssessment";
import {makeStyles} from "@material-ui/core/styles";
import ActionBox from "../../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";


export default function NeedAssessment(props){
    const {submitCallback}= props
    const [initData, setInitData] = useState({});
    const [activeAssessment, setActiveAssessment] = useState(null);
    const [needsContacts, setNeedsContacts] = useState(false);
    const [verificarion, setVerificarion] = useState(false);
    const [verificationlength, setVerificationlength] = useState(0);
    const [contactList, setContactList] = useState([]);
    const [managerList, setManagerList] = useState([]);
    const [data, setData] = useState(null);
    const dispatch = useDispatch();
    const useStyles = makeStyles({
        DisableRow: {
            position:'relative',
            '&::after':{
                content: '""',
                zIndex:'9999',
                position: 'absolute',
                top:'0',
                display:'block',
                width: '100%',
                height: '100%',
                background:'#ffffff74'
            }

        },
        centerFlux:{
            display: "flex" ,
            alignItems : "center",
            justifyContent: "center"
        },
        headerCollapse:{
            backgroundColor: "#2D323E",
            justifyContent: "center",
            color:"#fff",
            textAlign : "center",
            "& .MuiCardHeader-action" :{
                backgroundColor: "#fff",
                borderRadius:"4px"
            }
        }
    });
    const classes = useStyles();
    const myScrollElement =  createRef(0);
    const [waiting, set_waiting] = useState({'wait':false,'target':false})
    function getAssessments(){
        axios.get(SERVER_URL + "/rest/s1/training/getNeedsAssessments", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setInitData(res.data)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }

    function emptyPage(){
        setActiveAssessment(null)
    }

    function finalizeAssessment(){
        if(contactList.length == 0){
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مخاطبی برای نیازسنجی انتخاب نشده است.'));
        }
        else if(!verificationlength || verificationlength == 0){
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مراتب تایید برای نیازسنجی انتخاب نشده است.'));
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'درحال ارسال اطلاعات...'));
            set_waiting({'wait':true,'target':2})
            let asesment = JSON.parse(JSON.stringify(activeAssessment))
            asesment.emplPosition = initData?.responsibles?.find(x=>x.emplPositionId == asesment.emplPositionId)?.description
            let fdata = {
                "assessment":asesment,
                "timeDuration":parseInt(activeAssessment.emplTime),
                "contactList":[],//contactList,
                "managerList" :[],// managerList.contactsManager,
                // "contactList":[],
                "api_key": localStorage.getItem('Authorization')
            }
            submitCallback(fdata)
        }
        
    }

    useEffect(()=>{
        getAssessments()
    },[data]);

    useEffect(()=>{
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
    },[activeAssessment]);


    return (
        <FusePageSimple  ref={myScrollElement}
            header={<CardHeader title={"نیازسنجی آموزشی"}/>}
            content={
                <Box p={2} >
                    <Card >
                        <CardHeader title={"تعریف نیازسنجی آموزشی"}/>
                        <CardContent>
                            <DefineNeedAssessment classes={classes}
                                                  initData={initData}
                                                  data={data}
                                                  setData={setData} 
                                                  setActiveAssessment = {setActiveAssessment}
                                                  setManagerList={setManagerList}
                                                  activeAssessment = {activeAssessment}
                                                  needsContacts = {needsContacts}
                                                  setNeedsContacts = {setNeedsContacts}
                                                  setContactList={setContactList}
                                                  waiting={waiting}
                                                  set_waiting={set_waiting}
                                                  />
                            <DefineApproval classes = {classes}
                                            initData = {initData}
                                            setActiveAssessment = {setActiveAssessment}
                                            activeAssessment = {activeAssessment}
                                            verificarion = {verificarion}
                                            setVerificarion = {setVerificarion}
                                            setVerificationlength={setVerificationlength}
                                            waiting={waiting}
                                            set_waiting={set_waiting}/>
                        </CardContent>
                        <div >
                            {activeAssessment ?
                                <ActionBox className={classes.centerFlux}>
                                    <Button style={{margin:'8px 4px 8px 8px'}} type="submit" role="primary"  disabled={waiting.wait} endIcon={waiting.target == 2?<CircularProgress size={20}/>:null}  onClick={finalizeAssessment}>ثبت نهایی و شروع فرآیند</Button>
                                    <Button  disabled={waiting.wait} style={{margin:'8px 4px 8px 8px'}} type="submit" role="primary" onClick={emptyPage}>ایجاد ارزیابی جدید</Button>
                                </ActionBox>
                            : ""}
                        </div>
                    </Card>
                    
                    <Box mt={2}>
                        <Card >
                            <CardHeader title={"نیازسنجی های سازمان"}/>
                            <CardContent>
                                <OrganizationNeedsAssessment initData={initData} data={data} setData={setData} setActiveAssessment={setActiveAssessment} activeAssessment={activeAssessment}/>
                            </CardContent>
                        </Card>
                    </Box>


                </Box>

            }

        />
    );
}
