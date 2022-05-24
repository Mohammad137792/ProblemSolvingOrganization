import React, {useEffect, useState} from "react";
import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import UserCompany from "../../../components/formControls/UserCompany";
import FormPro from "../../../components/formControls/FormPro";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {useDispatch} from "react-redux";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import VerificationLevelPanel from "../verification/VerificationLevelPanel";

const formDefaultValues = {
    statusId: 'Y',
    typeEnumId: 'EostEmplOrder',
}

export default function EOOForm({actionObject, setActionObject, tableContent, setTableContent, userCompany, setUserCompany}){
    const dispatch = useDispatch();
    const [formValues, setFormValues] = useState(formDefaultValues);
    const [formValidation, setFormValidation] = useState({});
    const [factors, setFactors] = useState([]);
    const [prints, setPrints] = useState([]);
    const formStructure = [{
        type    : "component",
        component: <UserCompany setValue={setUserCompany}/>
    },{
        name    : "code",
        label   : "پیش کد حکم کارگزینی",
        type    : "text",
        required: true,
        validator: values => {
            const code = values.code;
            return new Promise(resolve => {
                if (!code || !/[^a-zA-Z0-9]/.test(code)) {
                    resolve({error: false, helper: ""})
                }else{
                    resolve({error: true, helper: "فقط از اعداد و حروف لاتین!"})
                }
            })
        }
    },{
        name    : "title",
        label   : "عنوان حکم کارگزینی",
        type    : "text",
        required: true
    },{
        name    : "dateEnumId",
        label   : "زمان صدور حکم",
        type    : "select",
        options : "IssueTimeEmplOrder"
    },{
        name    : "statusId",
        label   : "فعال",
        type    : "indicator",
    },{
        name    : "configPayrollFactor",
        label   : "تنظیم مجدد عوامل حکمی",
        type    : "multiselect",
        options : factors,
        optionIdField: "payrollFactorId",
        optionLabelField: "title"
    },{
        name    : "configParameter",
        label   : "تنظیم مجدد پارامترها",
        type    : "multiselect",
        options : "EmplOrderParameter"
    },{
        name    : "configPrint",
        label   : "نسخه های حکم کارگزینی",
        type    : "multiselect",
        options : prints,
        optionIdField: "settingId",
        optionLabelField: "title"
    },{
        name    : "description",
        label   : "شرح پیش فرض حکم کارگزینی",
        type    : "textarea",
        col     : 12
    }]
    function handleSubmit() {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        if(actionObject){
            handlePut()
        }else{
            handlePost()
        }
    }
    function handleReset() {
        setActionObject(null)
    }
    function throwErrorCode() {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'پیش کد وارد شده تکراری است!'));
        setFormValidation(prevState => ({
            ...prevState,
            code: {error: true, helper: "پیش کد وارد شده تکراری است!"}
        }))
    }
    function handlePost(){
        if (tableContent.findIndex(i=>i.code===formValues.code) > -1) {
            throwErrorCode()
            return
        }
        const packet = {...formValues, companyPartyId: userCompany.userCompanyId}
        console.log('post packet..', packet);
        axios.post(SERVER_URL + "/rest/s1/emplOrder/emplOrderSetting", packet,{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            const settingId = res.data.settingId
            const verificationId = res.data.verificationId
            const newData = Object.assign({},formValues,{settingId,verificationId})
            setTableContent(tableContent.concat(newData))
            setActionObject(newData.settingId)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد.'));
        }).catch(err => {
            console.log('post error..', err);
        });
    }
    function handlePut(){
        if (tableContent.findIndex(i=>i.code===formValues.code && i.settingId!==formValues.settingId) > -1) {
            throwErrorCode()
            return
        }
        axios.put(SERVER_URL + "/rest/s1/emplOrder/emplOrderSetting", formValues,{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(() => {
            const newData = Object.assign([],tableContent)
            const index = newData.indexOf(newData.find(i=>i.settingId===actionObject))
            newData[index] = formValues
            setTableContent(newData)
            setActionObject(null)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد.'));
        }).catch(err => {
            console.log('post error..', err);
        });
    }
    function handleGet(id){
        axios.get(SERVER_URL + "/rest/s1/emplOrder/emplOrderSetting", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {settingId: id}
        }).then(res => {
            setFormValues(res.data.emplOrderSetting)
        }).catch(err => {
            console.log('get error..', err);
        });
    }

    useEffect(()=>{
        if(userCompany.userCompanyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/PayrollFactor?companyPartyId=${userCompany.userCompanyId}`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setFactors(res.data.result)
            }).catch(()=> {
            });
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/EmplOrderSetting?companyPartyId=${userCompany.userCompanyId}&typeEnumId=EostEmplOrderPrint`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setPrints(res.data.result)
            }).catch(() => {
            });
        }
    },[userCompany])

    useEffect(()=>{
        if(actionObject){
            handleGet(actionObject)
        }else{
            setFormValues(formDefaultValues)
        }
    },[actionObject]);

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormPro formValues={formValues} setFormValues={setFormValues} formDefaultValues={formDefaultValues}
                         formValidation={formValidation} setFormValidation={setFormValidation}
                         submitCallback={handleSubmit} resetCallback={handleReset}
                         append={formStructure}
                         actionBox={<ActionBox>
                             <Button type="submit" role="primary">{actionObject? "ویرایش": "افزودن"}</Button>
                             <Button type="reset" role="secondary">لغو</Button>
                         </ActionBox>}
                />
            </Grid>
            {actionObject && (
                <React.Fragment>
                    <Grid item xs={12}>
                        <Divider variant="fullWidth"/>
                    </Grid>
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <VerificationLevelPanel verificationId={formValues?.verificationId}/>
                        </Card>
                    </Grid>
                </React.Fragment>
            )}
        </Grid>
    )
}
