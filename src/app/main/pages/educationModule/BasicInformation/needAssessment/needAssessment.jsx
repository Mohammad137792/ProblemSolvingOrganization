import React, {useState,useEffect,createRef} from 'react';
import {FusePageSimple} from "@fuse";
import axios from "axios";
import {SERVER_URL} from "../../../../../../configs";
import {CardContent,Divider,Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardHeader from '@material-ui/core/CardHeader';
import TablePro from "../../../../components/TablePro";
import moment from "moment-jalaali";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import DefineNeedAssessment from "./defineNeedAssessment";
import DefineApproval from "./defineApproval";
import OrganizationNeedsAssessment from "./organizationNeedsAssessment";
import {makeStyles} from "@material-ui/core/styles";
import ActionBox from "../../../../components/ActionBox";


export default function NeedAssessment(){
    var courseTitles = [];
    const tableCols = [
        {name: "title", label: "عنوان دوره آموزشی", type: "text"},
        {name: "institute", label: "موسسه برگزارکننده دوره", type: "text"   },
        {name: "teacher", label: "مدرس برگزارکننده", type: "text"},
        {name: "fromDate", label: "تاریخ شروع", type: "text"},
        {name: "thruDate", label: "تاریخ پایان", type: "text"},
        {name: "applicationFee", label: "هزینه دوره(ریال)", type: "text"},
        {name: "duration", label: "مدت دوره(ساعت)", type: "text"},
        {name: "certificate", label: "گواهینامه", type: "text"},
    ]

    const [initData, setInitData] = useState({});
    const [activeAssessment, setActiveAssessment] = useState(null);
    const [needsContacts, setNeedsContacts] = useState(false);
    const [verificarion, setVerificarion] = useState(false);
    const [tableContent, setTableContent] = useState([]);
    const [data, setData] = useState(null);
    const [actionObject, setActionObject] = useState(null);
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

    function getAssessments(){
        axios.get(SERVER_URL + "/rest/s1/training/getNeedsAssessments", {
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setInitData(res.data)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }

    function deleteCourse(course){
        return axios.post(SERVER_URL + "/rest/s1/training/deleteCourse", {course:course} ,{
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {

        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
        });
    }

    function emptyPage(){
        setActiveAssessment(null)
    }

    function finalizeAssessment(){

    }

    useEffect(()=>{
        getAssessments()
    },[data]);

    useEffect(()=>{
        // myScrollElement.current.rootRef.current.parentElement.style.transition = "all 2s"
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
                                                  activeAssessment = {activeAssessment}
                                                  needsContacts = {needsContacts}
                                                  setNeedsContacts = {setNeedsContacts}/>
                            <DefineApproval classes = {classes}
                                            initData = {initData}
                                            setActiveAssessment = {setActiveAssessment}
                                            activeAssessment = {activeAssessment}
                                            verificarion = {verificarion}
                                            setVerificarion = {setVerificarion}/>
                        </CardContent>
                        <div >
                            {activeAssessment ?
                                <ActionBox className={classes.centerFlux}>
                                    <Button style={{margin:'8px 4px 8px 8px'}} type="submit" role="primary" onClick={finalizeAssessment}>ثبت نهایی و شروع فرآیند</Button>
                                    <Button style={{margin:'8px 4px 8px 8px'}} type="submit" role="primary" onClick={emptyPage}>ایجاد ارزیابی جدید</Button>
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
