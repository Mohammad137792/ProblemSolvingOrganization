import React, {useState} from "react";
import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import UserCompany from "../../../components/formControls/UserCompany";

const formDefaultValues = {
    payrollForm: 'N',
    emplPayrollForm: 'N',
    score: 'N',
    factorTypeEnumId: "PFGEmplOrder"
}

export default function EOFForm({actionObject, setActionObject, tableContent, setTableContent, userCompany, setUserCompany}){
    const dispatch = useDispatch();
    const [formValues, setFormValues] = React.useState(formDefaultValues)
    const [formValidation, setFormValidation] = useState({});
    const formStructure = [{
        type    : "component",
        component: <UserCompany setValue={setUserCompany}/>
    },{
        name    : "title",
        label   : "عنوان عامل حکمی",
        type    : "text",
        required: true
    },{
        name    : "groupEnumId",
        label   : "گروه عامل حکمی",
        type    : "select",
        options : "PayrollFactorGroup",
        filterOptions: options => options.filter(o=>o["parentEnumId"]==="PFGEmplOrder"),
    },{
        name    : "payrollForm",
        label   : "نمایش در فرم حکم",
        type    : "indicator",
    },{
        name    : "emplPayrollForm",
        label   : "نمایش در فرم حکم کارمند",
        type    : "indicator",
        disabled: formValues?.payrollForm!=='Y'
    },{
        name    : "calcBasis",
        label   : "مبنای محاسبه",
        type    : "select",
        options : "BasisCalculationOfPayrollFactor"
    },{
        name    : "displaySequence",
        label   : "ترتیب نمایش",
        type    : "number",
    },{
        name    : "calcSequence",
        label   : "ترتیب محاسبه",
        type    : "number",
    },{
        name    : "score",
        label   : "محاسبه امتیاز",
        type    : "indicator",
    },{
        name    : "description",
        label   : "شرح",
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
    function handlePost(){
        const packet = {...formValues, companyPartyId: userCompany.userCompanyId}
        axios.post(SERVER_URL + "/rest/s1/fadak/entity/PayrollFactor", { data : packet } ,{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            const payrollFactorId = res.data.payrollFactorId
            const newData = Object.assign({},packet,{payrollFactorId})
            setTableContent(tableContent.concat(newData))
            setActionObject(newData.payrollFactorId)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد.'));
        }).catch(err => {
            console.log('post error..', err);
        });
    }
    function handlePut(){
        axios.put(SERVER_URL + "/rest/s1/fadak/entity/PayrollFactor", { data :formValues } ,{
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(() => {
            const newData = Object.assign([],tableContent)
            const index = newData.indexOf(newData.find(i=>i.payrollFactorId===actionObject))
            newData[index] = formValues
            setTableContent(newData)
            setActionObject(null)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد.'));
        }).catch(err => {
            console.log('post error..', err);
        });
    }
    function handleGet(id){
        axios.get(SERVER_URL + `/rest/s1/fadak/entity/PayrollFactor?payrollFactorId=${id}`, {
            headers: {'api_key': localStorage.getItem('api_key')},
        }).then(res => {
            setFormValues(res.data.result[0])
        }).catch(err => {
            console.log('get error..', err);
        });
    }
    React.useEffect(()=>{
        if(actionObject){
            handleGet(actionObject.payrollFactorId)
        }else{
            setFormValues(formDefaultValues)
        }
    },[actionObject]);

    return(
        <FormPro formValues={formValues} setFormValues={setFormValues} formDefaultValues={formDefaultValues}
                 formValidation={formValidation} setFormValidation={setFormValidation}
                 submitCallback={handleSubmit} resetCallback={handleReset}
                 append={formStructure}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">{actionObject? "ویرایش": "افزودن"}</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                 </ActionBox>}
        />
    )
}
