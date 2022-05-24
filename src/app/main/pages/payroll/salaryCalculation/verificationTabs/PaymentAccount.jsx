import React, {useEffect, useState} from "react";
import {CardContent} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import axios from "../../../../api/axiosRest";

export default function PaymentAccount({formVariables, formValues, set_formValues, formValidation, set_formValidation,getArrearseInfo}) {
    // const [formValues, set_formValues] = useState(formDefaultValues)
    // const [formValidation, set_formValidation] = useState({});
    const groupName = "insuranceSettings"
    // const disabledArrears = formValues[groupName] ? formValues[groupName]["payArrears"]!=="Y" : true
    const [fieldsInfo, setFieldsInfo] = useState({});
    
    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }

      const formStructure = [
        {
        name    : "paymentMethodId",
        label   : "حساب بانکی پرداخت حقوق",
        type    : "select",
        options : fieldsInfo?.CreditInfo ,
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
        name    : "paymentDate",
        label   : "تاریخ پرداخت حقوق",
        type    : "date",
    },{
        name    : "paymentDescription",
        label   : "شرح تراکنش",
        type    : "text",
    },{
        name    : "paymentFor",
        label   : "پرداخت بابت",
        type    : "select",
        options : fieldsInfo?.PayForList ,
        optionIdField   : "enumId",
        optionLabelField: "description",
    },{
        name    : "paymentBillImage",
        label   : "تصویر چک پرداخت",
        type    : "inputFile",
    }]

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
