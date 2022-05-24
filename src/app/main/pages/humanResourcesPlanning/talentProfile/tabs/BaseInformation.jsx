import React, {useEffect, useState, createRef} from "react";
import {SERVER_URL} from 'configs';
import FormPro from "../../../../components/formControls/FormPro";
import TablePro from "../../../../components/TablePro";
import ActionBox from "../../../../components/ActionBox";
import {Button, CardContent, CardHeader, Grid,Box, Card, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from 'axios';
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import Switch from "@material-ui/core/Switch";


const BaseInformation = () => {

    const [formValues, setFormValues] = React.useState();
    const [waiting, set_waiting] = useState(false) 

    const [tableContent,setTableContent]=useState([{}]);
    const [loading, setLoading] = useState(true);

    const submitRef = createRef(0);

    const [clicked, setClicked] = useState(0);

    const dispatch = useDispatch();

    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser && partyIdUser !== null) ? partyIdUser : partyIdLogin

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/skillProfile?partyId=${partyId}`, axiosKey).then((response)=>{
            setFormValues(Object.assign({},formValues,response.data?.knowCompany,{callForNewJob : response.data?.knowCompany?.callForNewJob == "Y" ? true : false}))
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    React.useEffect(()=>{
        if(loading){
            getTableData()
        }
    },[loading])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/skillProfile?partyId=${partyId}`, axiosKey).then((response)=>{
            setTableContent(response.data?.partyPreference)
            setLoading(false)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const headerStructure = [{
        name    : "knowCompanyEnumId",
        label   : "نحوه آشنایی با سازمان",
        type    : "select",
        options : "KnowCompanyType" ,
        optionLabelField :"description",
        optionIdField:"enumId",
        col     : 3 ,
        readOnly : partyId !== partyIdLogin ? true : (formValues?.knowCompanyEnumId !== undefined && formValues?.knowCompanyEnumId !== null)
    },{
        name    : "callForNewJob",
        label   : "دریافت اعلانات مربوط به شغل های جدید",
        type    : "check",
        disabled : partyId !== partyIdLogin ,
        col     : 6,
    }]

    const tableCols = [{
        name    : "internalTravel",
        label   : "سفر داخلی",
        type    : "indicator",
        style   : {minWidth : "80px"}
    },{
        name    : "externalTravel",
        label   : "سفر خارجی",
        type    : "indicator",
        style   : {minWidth : "80px"}
    },{
        name    : "partTime",
        label   : "تمایل به کار نیمه وقت",
        type    : "indicator",
        style   : {minWidth : "80px"}
    },{
        name    : "minPayment",
        label   : "مینیمم پرداختی",
        type    : "number",
        style   : {minWidth : "80px"}
    },{
        name    : "flexibleTime",
        label   : "ترجیح به برنامه کاری منعطف",
        type    : "indicator",
        style   : {minWidth : "80px"}
    },{
        name    : "jobCategoryEnumId",
        label   : "حوزه شغلی مورد علاقه",
        type    : "select",
        options : "JobCategory" ,
        style   : {minWidth : "80px"}
    },{
        name    : "fromDate",
        label   : "از تاریخ",
        type    : "date",
        disabled : true ,
        style   : {minWidth : "80px"}
    },{
        name    : "thruDate",
        label   : "تا تاریخ",
        type    : "date",
        disabled : true ,
        style   : {minWidth : "120px"}
    }]

    const footerStructure = [{
        name    : "getToKnowTypeEnumId",
        label   : "نسبت با معرف",
        type    : "select",
        options : "GetToKnowType" ,
        readOnly : partyId !== partyIdLogin ,
        col     : 3 ,
    },{
        name    : "aboutIntroducer",
        label   : "توضیحات معرف",
        type    : "text",
        readOnly : partyId !== partyIdLogin ,
        col     : 9,
    }]

    const submitCallback = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.put(`${SERVER_URL}/rest/s1/humanres/skillProfile` , { knowCompany : {...formValues , callForNewJob : formValues?.callForNewJob == true ? "Y" : "N"}} , axiosKey).then((response)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            set_waiting(false)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            set_waiting(false)
        });
    }

    function trigerHiddenSubmitBtn() {
        setClicked(clicked + 1);
    }

    React.useEffect(() => {
        if (submitRef.current && clicked > 0) {
            submitRef.current.click();
        }
    }, [clicked]);

    return (
        <Card>
            <CardContent>
                <FormPro
                    prepend={headerStructure}
                    formValues={formValues} setFormValues={setFormValues}
                />
                <Card>
                    <CardContent>
                        <TablePro
                            title="سابقه ترجیحات شغلی"
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            add={partyId == partyIdLogin ? "external" : false}
                            addForm={<Form setLoading={setLoading} />}
                        />
                    </CardContent>
                </Card>
                <Box mb={2}/>
                <Card>
                    <CardContent>
                        <CardHeader title="معرف" />
                        <FormPro
                            prepend={footerStructure}
                            formValues={formValues} setFormValues={setFormValues}
                            submitCallback={submitCallback}
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
                <Box mb={2}/>
                {partyId == partyIdLogin ?
                    <div style={{display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            style={{
                                width: 120,
                                color: "white",
                                backgroundColor: "#039be5",
                                marginRight: "8px",
                            }}
                            variant="outlined"
                            type="submit"
                            role="primary"
                            onClick={trigerHiddenSubmitBtn}
                            disabled={waiting}
                            endIcon={waiting?<CircularProgress size={20}/>:null}
                            >
                            ثبت
                        </Button>
                    </div>
                :""}
            </CardContent>
        </Card>
    );
};

export default BaseInformation;

function Form ({editing=false, ...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading} = restProps;

    const [formValidation, setFormValidation] = useState({});  

    const [waiting, set_waiting] = useState(false)  

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    useEffect(()=>{
        setFormValues(Object.assign({},formValues,{fromDate : new Date()}))
    },[])

    const formStructure = [{
        name    : "internalTravel",
        label   : "سفر داخلی" ,
        type    : "indicator",
        col     : 2
    },{
        name    : "externalTravel",
        label   : "سفر خارجی" ,
        type    : "indicator",
        col     : 2
    },{
        name    : "partTime",
        label   : "کار نیمه وقت" ,
        type    : "indicator",
        col     : 2
    },{
        type    : "group" ,
        items   : [{
            name    : "minPayment",
            label   : "مینیمم پرداختی" ,
            type    : "number",
            style   : {minWidth : "100px"}
        },{
            type : "component" , 
            component : 
                <div style={{display : "flex" , justifyContent : "center" , alignItems : "center" , marginRight : "10px" , minWidth : "40px"}}>
                    <Typography>ریال</Typography> 
                </div>,
        }],
        col     : 3
    },{
        name    : "flexibleTime",
        label   : "ترجیح به برنامه کاری منعطف" ,
        type    : "indicator",
        col     : 3
    },{
        name    : "jobCategoryEnumId",
        label   : "حوزه شغلی مورد علاقه",
        type    : "select",
        options : "JobCategory" ,
        col     : 2
    },{
        name    : "fromDate",
        label   : "از تاریخ",
        type    : "date",
        disabled : true ,
        col     : 2
    },{
        name    : "thruDate",
        label   : "تا تاریخ",
        type    : "date",
        disabled : true ,
        col     : 2
    }]
    
    const handleSubmit = () => { 
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.post(`${SERVER_URL}/rest/s1/humanres/skillProfile` , { skillInfo : formValues} , axiosKey).then((info)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            handleReset()
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            set_waiting(false)
        });
    }

    const handleReset = () => {
        setFormValues({})
        set_waiting(false)
        handleClose()
     }

    return (
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
                >افزودن</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
            resetCallback={handleReset}
        />
    )
}