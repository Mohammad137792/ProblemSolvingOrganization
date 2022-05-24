import React from "react";
import Grid from "@material-ui/core/Grid";
import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import UserCompany from "../../../components/formControls/UserCompany";
import Divider from "@material-ui/core/Divider";
import TabPro from "../../../components/TabPro";
import EOCTabTerm from "./EOCTabTerm";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import FormPro from "../../../components/formControls/FormPro";
import VerificationLevelPanel from "../verification/VerificationLevelPanel";

const formDefaultValues = {
    statusId: "ActiveAgr"
}
export default function EOCForm({agreement, setAgreement, setTableContent, userCompany, setUserCompany}){
    const dispatch = useDispatch();
    const [printSettings, setPrintSettings] = React.useState([])
    const [formValues, setFormValues] = React.useState(formDefaultValues)
    const [formValidation, setFormValidation] = React.useState({});
    React.useEffect(()=>{
        if(agreement){
            setFormValues(agreement)
        }else{
            setFormValues(formDefaultValues)
        }
    },[agreement])

    const contractForm = [{
        type    : "component",
        component: <UserCompany setValue={setUserCompany}/>
    },{
        name    : "code",
        label   : "کد نوع قرارداد",
        type    : "text",
    },{
        name    : "description",
        label   : "نوع قرارداد",
        type    : "text",
        required: true,
    },{
        name    : "agreementTypeEnumId",
        label   : "نظام استخدامی",
        type    : "select",
        options : "AgreementType",
        filterOptions: options => options.filter(o=>o["parentEnumId"]==="AgrEmployment"),
    },{
        name    : "version",
        label   : "نوع نسخه قرارداد",
        type    : "select",
        options : printSettings,
        optionIdField: "settingId",
        optionLabelField: "title"
    },{
        name    : "statusId",
        label   : "فعال",
        type    : "indicator",
        indicator   : {'true': 'ActiveAgr','false':'NotActiveAgr'},
    }]

    const agrTabs = [{
        label: "ماده های قرارداد",
        panel: <EOCTabTerm agreementId={agreement?.agreementId}/>
    },{
        label: "مراحل صدور",
        panel: <VerificationLevelPanel verificationId={agreement?.verificationId}/> // <EOCTabStep verificationId={agreement?.verificationId}/>
    }]

    const handleSubmit = ()=>{
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        if(agreement){
            axios.put(SERVER_URL + "/rest/s1/fadak/entity/Agreement",{data : formValues},{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then( () => {
                setAgreementsList("edit",formValues)
                setAgreement(null)
                setFormValues(formDefaultValues)
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            });
        }else{
            handlePost()
        }
    }
    const handlePost = ()=>{
        axios.post(SERVER_URL + "/rest/s1/emplOrder/agreement/type", {
            ...formValues, organizationPartyId: userCompany.userCompanyId},{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then( res => {
            const packet = Object.assign({},formValues,{
                agreementId: res.data.agreementId,
                verificationId: res.data.verificationId
            })
            setAgreementsList("add", packet)
            setAgreement(packet)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        });
    }
    const setAgreementsList = (action,object)=>{
        setTableContent(prevState =>{
            let newData = Object.assign([],prevState)
            if(action==="edit"){
                const index = newData.map(i=>i["agreementId"]).indexOf(object["agreementId"])
                newData[index] = object;
            }else if (action==="add"){
                newData.push(object)
            }
            return newData
        })
        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد.'));
    }
    const handleReset = ()=>{
        setAgreement(null)
    }

    React.useEffect(()=>{
        if(userCompany.userCompanyId) {
            axios.get(SERVER_URL + "/rest/s1/fadak/PrintSetting/Agreement", {
                headers: {'api_key': localStorage.getItem('api_key')},
                params: {
                    companyPartyId: userCompany.userCompanyId,
                }
            }).then(res => {
                setPrintSettings(res.data.copies)
            }).catch(() => {
            });
        }
    },[userCompany])

    React.useEffect(() => {
        if(formValues.code){
            let str = formValues.code.replace(/[^\w]/g, "")
            setFormValues({...formValues,code:str})    
        }
    },[formValues.code])

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormPro formValues={formValues} setFormValues={setFormValues} formDefaultValues={formDefaultValues}
                         formValidation={formValidation} setFormValidation={setFormValidation}
                         prepend={contractForm}
                         actionBox={<ActionBox>
                             <Button type="submit" role="primary">{agreement?"ویرایش":"افزودن"}</Button>
                             <Button type="reset" role="secondary">لغو</Button>
                         </ActionBox>}
                         submitCallback={handleSubmit} resetCallback={handleReset}
                />
            </Grid>

            {agreement && (
                <React.Fragment>
                    <Grid item xs={12}>
                        <Divider variant="fullWidth"/>
                    </Grid>
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <TabPro tabs={agrTabs}/>
                        </Card>
                    </Grid>
                </React.Fragment>
            )}

        </Grid>
    )
}
