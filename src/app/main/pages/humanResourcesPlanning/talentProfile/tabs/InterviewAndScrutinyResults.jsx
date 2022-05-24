import FormPro from "../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TablePro from 'app/main/components/TablePro';
import ActionBox from "../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import { Description, Image, TrendingUpRounded } from "@material-ui/icons"
import VisibilityIcon from '@material-ui/icons/Visibility';




const InterviewAndScrutinyResults = (props) => {

    const {jobApplicantId} = props

    const [formValues, setFormValues] = useState({})

    const [tableContent,setTableContent]=useState([{}]);
    const [loading, setLoading] = useState(true);

    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const datas =  useSelector(({ fadak }) => fadak);
    const partyId = (partyIdUser && partyIdUser !== null) ? partyIdUser : partyIdLogin

    const [fieldInfo , setFieldInfo] = useState({});

    const [showDetail, setShowDetail] = useState(false)

    const [detailValues,setDetailValues] = useState({});

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name    : "routeLevelEnumId",
        label   : "مرحله مصاحبه",
        type    : "select",
        options : fieldInfo.RecruitmentRoute,
        col     : 3
    },{
        type    : "component",
        component : <div/> ,
        col     : 9
    }]

    const tableCols = [
        { name : "requistionTitle", label:"عنوان شغلی", type: "text" },
        { name : "levelDate", label:"تاریخ مصاحبه", type: "date" },
        // { name : "titleofDocumentation", label:"مرحله مصاحبه", type: "date" },
        { name : "interviewTypeEnumId", label: "نوع مصاحبه", type: "select" , options : fieldInfo?.InterviewType , style: {minWidth:"80px"} },
        { name : "interViewResult", label:"نتیجه مصاحبه", type: "text" , style: {minWidth:"80px"} },
        { name : "priorityEnum", label: "اولویت استخدام", type: "text", style: {minWidth:"120px"} },
    ]

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=RecruitmentRoute,InterviewType,SoftWareType,InterviewResult`, axiosKey).then((enumsInfo)=>{
            axios.get(`${SERVER_URL}/rest/s1/humanres/complementryInfo?jobApplicantId=${jobApplicantId ?? ""}`, axiosKey).then((res)=>{
                setFieldInfo({...enumsInfo?.data?.enums , RecruitmentRoute : enumsInfo?.data?.enums?.RecruitmentRoute.filter(o => o?.parentEnumId === "ReInterview" && o.enumId !== "PreInt") , facility : res.data?.complementryInfo?.faclityList})
                setFormValues(Object.assign({},formValues,{routeLevelEnumId : "IntGeneral"}))
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    React.useEffect(()=>{
        if(loading && formValues?.routeLevelEnumId !== undefined){
            getTableData()
        }
    },[loading,formValues?.routeLevelEnumId])

    React.useEffect(()=>{
        setLoading(true)
    },[formValues?.routeLevelEnumId])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/findPersonInterviewResult?partyId=${partyId}&routeLevelEnumId=${formValues?.routeLevelEnumId}`, axiosKey).then((response)=>{
            setTableContent(response.data?.jobInterview)
            setLoading(false)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const observation = (row) => {
        setShowDetail(true)
        setDetailValues(row)
        console.log("row" , row);
    }

    return (
        <Card>
            <CardContent>
                <FormPro
                    prepend={formStructure}
                    formValues={formValues}
                    setFormValues={setFormValues}
                />
                <Box mb={2}/>
                {showDetail ? <FormDetail detailValues={detailValues} setDetailValues={setDetailValues} fieldInfo={fieldInfo} setShowDetail={setShowDetail}/> : ""}
                <TablePro
                    title="لیست مصاحبه ها"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    add={(partyId !== partyIdLogin) ? "external" : false}
                    addForm={<Form setLoading={setLoading} fieldInfo={fieldInfo} routeLevelEnumId={formValues?.routeLevelEnumId} jobApplicantId={jobApplicantId}/>}
                    rowActions={[{
                        title: " مشاهده نتایج مصاحبه",
                        icon: VisibilityIcon,
                        onClick: (row) => {
                            observation(row);
                        },
                    }]}
                />
            </CardContent>
        </Card>
    );
};

export default InterviewAndScrutinyResults;


function FormDetail ({...restProps}) {

    const {detailValues, setDetailValues, fieldInfo, setShowDetail} = restProps;

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name    : "levelDate",
        label   : "تاریخ مصاحبه",
        type    : "date",
        readOnly : true ,
        col     : 3
    },{
        name    : "interviewTypeEnumId",
        label   : "نوع مصاحبه",
        type    : "select",
        options : fieldInfo?.InterviewType,
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
        display : detailValues?.interViewResultId === "InterviewAccepted" , 
        col     : 3
    },{
        name: "softwareEnumId",
        label: "نرم افزار مورد استفاده",
        type: "select",
        options : fieldInfo?.SoftWareType ,
        display : detailValues?.interviewTypeEnumId === "Virtual" , 
        readOnly : true ,
        col     : 3 ,
    },{
        name: "interviewLink",
        label: "لینک مربوطه",
        type: "text",
        display : detailValues?.interviewTypeEnumId === "Virtual" , 
        readOnly : true ,
        col     : 9 ,
    },{
        name    : "facilityId",
        label   : "محل استقرار فرد در سازمان",
        type    : "select",
        options : fieldInfo.facility ,
        optionLabelField :"facilityName",
        optionIdField:"facilityId",
        readOnly : true ,
        display : detailValues?.interviewTypeEnumId === "InPerson" , 
        col     : 3
    },{
        name    : "address",
        label   : "آدرس محل استقرار",
        type    : "text",
        readOnly : true ,
        display : detailValues?.interviewTypeEnumId === "InPerson" , 
        col     : 9
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        readOnly : true ,
        col     : 12
    }]

    React.useEffect(()=>{
        if(detailValues?.facilityId && detailValues?.facilityId != ""){
            axios.get(`${SERVER_URL}/rest/s1/humanres/FacilityAddress?facilityId=${detailValues?.facilityId}`, axiosKey).then((addressInfo)=>{
                const address = addressInfo.data?.Address
                detailValues.address = `${(address?.country ? (address?.country + "،") : "") + (address?.province ? (address?.province + "،") : "")  + (address?.county ? (address?.county +  "،" ) : "") + (address?.city ? (address?.city + "،") :  "") + (address?.district ? (address?.district + "،" ) : "") + (address?.street ?? "") }`
                setDetailValues(Object.assign({},detailValues))
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }
        if(!detailValues?.facilityId || detailValues?.facilityId == ""){
            detailValues.address = ""
            setDetailValues(Object.assign({},detailValues))
        }
    },[detailValues?.facilityId])

    const handleClose = () => {
        setShowDetail(false)
    }

    return(
        <div>
            <FormPro
                prepend={formStructure}
                formValues={detailValues}
                setFormValues={setDetailValues}
            />
            <Box mb={2}/>
            <Button
                style={{
                    width: 120,
                    color: "white",
                    backgroundColor: "#039be5",
                    marginRight: "8px",
                }}
                variant="outlined"
                onClick={handleClose}
                >
                بستن
            </Button>
        </div>
    )
}

function Form ({editing=false,...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, fieldInfo, routeLevelEnumId, jobApplicantId} = restProps;

    const [formValidation, setFormValidation] = React.useState({});
    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name: "levelDate",
        label: "تاریخ مصاحبه",
        type: "date",
        col     : 3
    },{
        name: "interviewTypeEnumId",
        label: "نوع مصاحبه",
        type: "select",
        options : fieldInfo?.InterviewType ,
        col     : 3
    },{
        name: "resultEnumId",
        label: "نتیجه مصاحبه",
        type: "select",
        options : fieldInfo?.InterviewResult ,
        filterOptions: (options) => options.filter((o) => !o?.parentEnumId ||  o?.parentEnumId === null ) ,
        col     : 3 ,
    },{
        name: "interviewResult",
        label: "اولویت استخدام",
        type: "select",
        options : fieldInfo?.InterviewResult ,
        filterOptions: (options) => options.filter((o) => o?.parentEnumId &&  o?.parentEnumId === "InterviewAccepted") ,
        display : formValues?.resultEnumId === "InterviewAccepted" , 
        col     : 3 ,
    },{
        name: "softwareEnumId",
        label: "نرم افزار مورد استفاده",
        type: "select",
        options : fieldInfo?.SoftWareType ,
        display : formValues?.interviewTypeEnumId === "Virtual" , 
        col     : 3 ,
    },{
        name: "interviewLink",
        label: "لینک مربوطه",
        type: "text",
        display : formValues?.interviewTypeEnumId === "Virtual" , 
        col     : 9 ,
    },{
        name: "facilityId",
        label: "محل استقرار فرد در سازمان",
        type: "select",
        options : fieldInfo.facility ,
        optionLabelField :"facilityName",
        optionIdField:"facilityId",
        display : formValues?.interviewTypeEnumId === "InPerson" , 
        col     : 3
    },{
        name: "address",
        label: "آدرس محل استقرار",
        type: "text",
        readOnly : true ,
        display : formValues?.interviewTypeEnumId === "InPerson" , 
        col     : 9 ,
    },{
        name: "description",
        label: "توضیحات",
        type: "textarea",
        col     : 12 ,
    }]

    React.useEffect(()=>{
        if(formValues?.facilityId && formValues?.facilityId != ""){
            axios.get(`${SERVER_URL}/rest/s1/humanres/FacilityAddress?facilityId=${formValues?.facilityId}`, axiosKey).then((addressInfo)=>{
                const address = addressInfo.data?.Address
                formValues.address = `${(address?.country ? (address?.country + "،") : "") + (address?.province ? (address?.province + "،") : "")  + (address?.county ? (address?.county +  "،" ) : "") + (address?.city ? (address?.city + "،") :  "") + (address?.district ? (address?.district + "،" ) : "") + (address?.street ?? "") }`
                setFormValues(Object.assign({},formValues))
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }
        if(!formValues?.facilityId || formValues?.facilityId == ""){
            formValues.address = ""
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.facilityId])

    const handleSubmit = () => {
        if(jobApplicantId === undefined || jobApplicantId === ""){
            dispatch(setAlertContent(ALERT_TYPES.ERROR," برای این شغل درخواستی توسط کاربر ثبت نشده است."));
            return
        }else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            axios.post(`${SERVER_URL}/rest/s1/humanres/createPersonInterviewResult` , {...formValues , routeLevelEnumId : routeLevelEnumId , resultEnumId : formValues?.resultEnumId === "InterviewAccepted" ? formValues?.interviewResult : formValues?.resultEnumId , jobApplicantId : jobApplicantId} , axiosKey).then((info)=>{
                setLoading(true)
                set_waiting(false)
                resetCallback()
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            }).catch(()=>{
                set_waiting(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            })
        }
    }

    const resetCallback = () => {
        setFormValues({})
        handleClose()
        set_waiting(false)
    }

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={handleSubmit}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                >ثبت</Button>
            </ActionBox>}
        />
    )
}

