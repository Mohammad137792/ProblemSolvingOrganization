import React, {useEffect, useState} from "react";
import {CardContent} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import axios from "../../../../../api/axiosRest";

export default function SettingsInsurance({formVariables, formValues, set_formValues, formValidation, set_formValidation,getArrearseInfo}) {
    // const [formValues, set_formValues] = useState(formDefaultValues)
    // const [formValidation, set_formValidation] = useState({});
    const groupName = "insuranceSettings"
    const disabledArrears = formValues[groupName] ? formValues[groupName]["payArrears"]!=="Y" : true
    const [fieldsInfo, setFieldsInfo] = useState({});
    
    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }

    const formStructure = [{
        name    : "payArrears",
        label   : "محاسبه معوقات",
        type    : "indicator",
        group   : groupName,
    },{
        name    : "payArrearsFromDate",
        label   : "پرداخت معوقات از تاریخ",
        type    : "date",
        group   : groupName,
        disabled: disabledArrears
    },{
        name    : "payArrearsThruDate",
        label   : "پرداخت معوقات تا تاریخ",
        type    : "date",
        group   : groupName,
        disabled: disabledArrears
    },{
        name    : "payArrearsPercent",
        label   : "درصد پرداخت معوقات",
        type    : "number",
        group   : groupName,
        disabled: disabledArrears
    },{
        name    : "payArrearsPayslip",
        label   : "پرداخت معوقات فیش حقوق",
        type    : "multiselect",
        options : fieldsInfo?.PayslipTypeList,
        optionLabelField :"title",
        optionIdField:"payslipTypeId",
        group   : groupName,
        disabled: disabledArrears
    },{
        name    : "payArrearsPaymentMethod",
        label   : "روش محاسبه معوقه",
        type    : "select",
        options : fieldsInfo?.ArrearsPaymentMethod,
        optionLabelField :"description",
        optionIdField:"enumId",
        group   : groupName,
        disabled: disabledArrears
    },{
        name    : "payArrearsPayroll",
        label   : "عامل حقوقی پرداخت معوقه",
        type    : "select",
        options : fieldsInfo?.PayGroupList,
        optionLabelField :"title",
        // optionIdField:"payslipTypeId",
        group   : groupName,
    },{
        name    : "payArrearsinsuranceNumber",
        label   : "شماره لیست بیمه",
        type    : "number",
        group   : groupName,
    },{
        name    : "payArrearsDescription",
        label   : "شرح لیست بیمه",
        type    : "select",
        options : fieldsInfo?.InsuranceList,
        optionLabelField :"value",
        // optionIdField:"payslipTypeId",
        group   : groupName,
    }]

    useEffect(()=>{
        setFieldsInfo(getArrearseInfo )
        if(formVariables?.payslipInsurance){
            set_formValues(formVariables?.payslipInsurance)
        }
    },[formValues])

    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/getAllPageInfo?PayslipTypeId=${formVariables?.payslipTypeId}&PayGroup=${formVariables?.partyClassificationId}`, axiosKey).then(res => { /* todo: rest? */
            setFieldsInfo(res.data)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    return (
        <React.Fragment>
            <CardContent>
                <FormPro
                    formValues={formValues}
                    setFormValues={set_formValues}
                    formValidation={formValidation}
                    setFormValidation={set_formValidation}
                    prepend={formStructure}
                />
            </CardContent>
        </React.Fragment>
    )

}
