import React, {useEffect, useState} from "react";
import {CardContent} from "@material-ui/core";
import FormPro from "../../../../../components/formControls/FormPro";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import axios from "../../../../../api/axiosRest";

export default function SettingsTaxation({formVariables,formValues, set_formValues, formValidation, set_formValidation,getTaxPaymentInfo}) {

    const groupName = "taxationSettings"
    const [fieldsInfo, setFieldsInfo] = useState({});

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }

    const formStructure = [{
        name    : "id1",
        label   : "حساب بانکی پرداخت مالیات",
        type    : "select",
        options : fieldsInfo.CreditInfo,
        optionIdField   : "paymentMethodId",
        optionLabelField: "bankName",
        otherOutputs    : [{name: "FullName", optionIdField: "FullName"},
        {name: "shebaNumber", optionIdField: "shebaNumber"},{name: "routingNumber", optionIdField: "routingNumber"}],
    },{
        name    : "FullName",
        label   : "نام و نام خانوادگی دارنده حساب",
        type    : "display",
    },{
        name    : "routingNumber",
        label   : "شماره حساب",
        type    : "display",
    },{
        name    : "shebaNumber",
        label   : "شماره شبا",
        type    : "display",
    },{
        name    : "registrationDate",
        label   : "تاریخ ثبت در دفتر روزنامه ای",
        type    : "date",
        group   : groupName,
    },{
        name    : "taxPaymentMethod",
        label   : "نحوه پرداخت",
        type    : "select",
        options : fieldsInfo.PayForTaxList,
        optionLabelField :"description",
        optionIdField:"enumId",
        filterOptions: options => options.filter(o=>o?.default==="Yes"),
        group   : groupName,
    },{
        name    : "taxNumber",
        label   : "شماره سری",
        type    : "number",
        group   : groupName,
    },{
        name    : "taxPaymrntDate",
        label   : "تاریخ پرداخت",
        type    : "date",
        group   : groupName,
    },{
        name    : "tacBillImage",
        label   : "تصویر چک مالیات",
        type    : "inputFile",
        group   : groupName,
    }]

    useEffect(()=>{
        setFieldsInfo(getTaxPaymentInfo)
    },[formValues])

    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/GetTaxPaymentInfo?Payslip=${formVariables?.payslipTypeId}&PayGroup=${formVariables?.partyClassificationId}`, axiosKey).then(res => { /* todo: rest? */
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
