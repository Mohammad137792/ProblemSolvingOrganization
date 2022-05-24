import { Card, CardContent, CardHeader, Button, Box } from '@material-ui/core';
import React, { useState } from 'react';
import FormPro from "../../../../components/formControls/FormPro";
import TablePro from 'app/main/components/TablePro';
import ActionBox from "../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import VisibilityIcon from '@material-ui/icons/Visibility';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import axios from 'axios';
import {useSelector , useDispatch} from "react-redux";
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';


const ResultVolunteerInterview = (props) => {

    const {jobRequistionId, setPageStatus, setCandidates} = props

    const [formValues, setFormValues] = React.useState({routeLevelEnumId : "IntGeneral"});
    const [waiting, set_waiting] = useState(false) 
    const [tableContent,setTableContent]=useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPerson, setSelectedPerson] = useState([])

    const [showInterview,setShowInterview] = useState(false);
    const [interviewFormValues, setInterviewFormValues] = React.useState({});

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[{
        name    : "routeLevelEnumId",
        label   : "مرحله مصاحبه",
        type    : "select",
        options : fieldsInfo.RecruitmentRoute,
        optionLabelField :"description",
        optionIdField:"enumId",
        col     : 4
    }]

    const interviewFormStructure=[{
        name    : "levelDate",
        label   : "تاریخ مصاحبه",
        type    : "date",
        readOnly : true ,
        col     : 3
    },{
        name    : "interviewTypeEnumId",
        label   : "نوع مصاحبه",
        type    : "select",
        options : fieldsInfo.InterviewType,
        optionLabelField :"description",
        optionIdField:"enumId",
        readOnly : true ,
        col     : 3
    },{
        name    : "interViewResult",
        label   : "نتیجه مصاحبه",
        type    : "text",
        readOnly : true ,
        col     : 3
    },{
        name    : "priorityEnum",
        label   : "اولویت استخدام",
        type    : "text",
        readOnly : true ,
        col     : 3
    },{
        name: "softwareEnumId",
        label: "نرم افزار مورد استفاده",
        type: "select",
        options : fieldsInfo?.SoftWareType ,
        display : interviewFormValues?.interviewTypeEnumId === "Virtual" , 
        readOnly : true ,
        col     : 3 ,
    },{
        name: "interviewLink",
        label: "لینک مربوطه",
        type: "text",
        display : interviewFormValues?.interviewTypeEnumId === "Virtual" , 
        readOnly : true ,
        col     : 9 ,
    },{
        name    : "facilityId",
        label   : "محل استقرار فرد در سازمان",
        type    : "select",
        options : fieldsInfo.faclityList,
        optionLabelField :"facilityName",
        optionIdField:"facilityId",
        readOnly : true ,
        display : interviewFormValues?.interviewTypeEnumId === "InPerson" , 
        col     : 3
    },{
        name    : "address",
        label   : "آدرس محل استقرار",
        type    : "text",
        readOnly : true ,
        display : interviewFormValues?.interviewTypeEnumId === "InPerson" , 
        col     : 9
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        readOnly : true ,
        col     : 12
    }]

    const tableCols = [
        { name: "firstName", label:"نام", type: "text" },
        { name : "lastName", label: "نام خانوادگی", type: "text" , style: {minWidth:"80px"} },
        { name : "tel", label:"تلفن", type: "text" , style: {minWidth:"80px"} },
        { name : "interViewResult", label: " نتیجه مصاحبه", type: "select", style: {minWidth:"120px"} },
        { name : "priorityEnum", label:"اولویت استخدام", type: "text" ,  style: {minWidth:"120px"}},
        // { name : "description", label:"امتیاز نهایی پرسشنامه/ مدل شایستگی", type: "text" ,  style: {minWidth:"120px"}},
        // { name : "description", label:"مصاحبه گر", type: "text" ,  style: {minWidth:"120px"}},
        // { name : "description", label:"شرکت ", type: "text" ,  style: {minWidth:"120px"}},
        // { name : "description", label:"واحد سازمانی", type: "text" ,  style: {minWidth:"100px"}},
        // { name : "description", label:"پست سازمانی", type: "text" ,  style: {minWidth:"120px"}},
    ]

    React.useEffect(()=>{
        if(loading && formValues?.routeLevelEnumId !== undefined){
            getTableData()
        }
    },[loading,formValues?.routeLevelEnumId])

    React.useEffect(()=>{
        setLoading(true)
    },[formValues?.routeLevelEnumId])

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=RecruitmentRoute,InterviewType,SoftWareType`, axiosKey).then((enm)=>{
            axios.get(`${SERVER_URL}/rest/s1/humanres/complementryInfo`, axiosKey).then((res)=>{
            setFieldsInfo({...enm.data?.enums,...res.data?.complementryInfo , RecruitmentRoute : enm?.data?.enums?.RecruitmentRoute.filter(o => o?.parentEnumId === "ReInterview" && o.enumId !== "PreInt")})
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            })
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const getTableData = () => {

        axios.get(`${SERVER_URL}/rest/s1/humanres/searchInterView?routeLevelEnumId=${formValues?.routeLevelEnumId}&jobRequistionId=${jobRequistionId}` , axiosKey).then((table)=>{
            setTableContent(table.data?.candidates)
            setLoading(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const observation = (rowData) => {
        console.log("rowData" , rowData);
        setShowInterview(true)
        interviewFormValues.address = (rowData?.countryGeoName ? (rowData?.countryGeoName + "،") : "") + (rowData?.stateProvinceGeoName  ? (rowData?.stateProvinceGeoName  + "،") : "")  + (rowData?.countyGeoName  ? (rowData?.countyGeoName +  "،" ) : "") + (rowData?.district ? (rowData?.district + "،") :  "") + (rowData?.district ? (rowData?.district + "،" ) : "") + (rowData?.street ? rowData?.street : "") + (rowData?.alley  ? rowData?.alley  : "") + (rowData?.floo  ? rowData?.floo  : "") 
        setInterviewFormValues(Object.assign({},interviewFormValues,rowData))
    }

    const handleSubmit = () => {
        setShowInterview(false)
    }

    const close = () => {
        setShowInterview(false)
    } 

    const reject = () => {
        if(selectedPerson.length !== 0){
            axios.put(`${SERVER_URL}/rest/s1/humanres/rejectApplicant` , {candidates : selectedPerson} , axiosKey).then((table)=>{
                setLoading(true)
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR , "خطا در ارسال اطلاعات"));
            })
        }else{
            dispatch(setAlertContent(ALERT_TYPES.ERROR , "کاربری انتخاب نشده است !"));
        }
    }

    const accept = () => {
        if(selectedPerson.length !== 0){
            if(selectedPerson[0]?.relationshipType === "requestioner" && selectedPerson[0]?.toPartyId !== null && selectedPerson[0]?.toPartyId !== undefined ){
                setPageStatus("createAccount")
                setCandidates(selectedPerson)
            }else{
                axios.put(`${SERVER_URL}/rest/s1/humanres/acceptApplicant` , {candidates : selectedPerson} , axiosKey).then((table)=>{
                    setLoading(true)
                }).catch(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR , "خطا در ارسال اطلاعات"));
                })
            }
        }else{
            dispatch(setAlertContent(ALERT_TYPES.ERROR , "کاربری انتخاب نشده است !"));
        }
    }

    return (
        <div>
            <Box mb={2}/>
            <FormPro
                prepend={formStructure}
                formValues={formValues} setFormValues={setFormValues}
            />
            <TablePro
                title="مشاهده نتیجه مصاحبه داوطلبان"
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                loading={loading}
                selectable
                singleSelect
                selectedRows={selectedPerson}
                setSelectedRows={setSelectedPerson}
                rowActions={[{
                    title: "مشاهده نتیجه مصاحبه",
                    icon: VisibilityIcon,
                    onClick: (row) => {
                        observation(row);
                    },
                }]}
                actions={[{
                    title: "رد داوطلبان",
                    icon: ThumbDownIcon,
                    onClick: ()=> {
                        reject();
                    }
                },{
                    title: "قبول داوطلبان",
                    icon: ThumbUpIcon,
                    onClick: ()=> {
                        accept();
                    }
                }]}
            />
            {showInterview ? 
                <Card>
                    <CardContent>
                        <CardHeader title="مشاهده نتیجه مصاحبه"/>
                        <FormPro
                            prepend={interviewFormStructure}
                            formValues={interviewFormValues}
                            setFormValues={setInterviewFormValues}
                            actionBox={<ActionBox>
                                <Button type="reset" role="secondary" onClick={close}>بستن</Button>
                            </ActionBox>}
                        />
                    </CardContent>
                </Card>
            :""}
        </div>
    );
};

export default ResultVolunteerInterview;