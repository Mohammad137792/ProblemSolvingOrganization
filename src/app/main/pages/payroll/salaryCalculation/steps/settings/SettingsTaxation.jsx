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
        name    : "taxPaymentAccount",
        label   : "حساب بانکی پرداخت مالیات",
        type    : "select",
        options : fieldsInfo?.CreditForPayTaxList,
        optionIdField   : "paymentMethodId",
        optionLabelField: "bankName",
        otherOutputs    : [{name: "taxFullName", optionIdField: "FullName"},
        {name: "taxShebaNumber", optionIdField: "shebaNumber"},{name: "taxRoutingNumber", optionIdField: "routingNumber"}],
    },{
        name    : "taxFullName",
        label   : "نام و نام خانوادگی دارنده حساب",
        type    : "display",
    },{
        name    : "taxRoutingNumber",
        label   : "شماره حساب",
        type    : "display",
    },{
        name    : "taxShebaNumber",
        label   : "شماره شبا",
        type    : "display",
    },{
        name    : "registrationDate",
        label   : "تاریخ ثبت در دفتر روزنامه ای",
        type    : "date",
        // group   : groupName,
    },{
        name    : "taxPaymentMethod",
        label   : "نحوه پرداخت",
        type    : "select",
        options : fieldsInfo?.PayForTaxList,
        optionLabelField :"description",
        optionIdField:"enumId",
        // filterOptions: options => options.filter(o=>o?.default==="Yes"),
        // group   : groupName,
    },{
        name    : "taxNumber",
        label   : "شماره سری",
        type    : "number",
        // group   : groupName,
    },{
        name    : "taxPaymrntDate",
        label   : "تاریخ پرداخت",
        type    : "date",
        // group   : groupName,
    },{
        name    : "taxBillImage",
        label   : "تصویر چک مالیات",
        type    : "inputFile",
        // group   : groupName,
    }]

    useEffect(()=>{
        setFieldsInfo(getTaxPaymentInfo)
    },[])

    
    useEffect(()=>{
        let file = formValues.taxBillImage
        
        if(file){
            if(file['type'].split('/')[0] === 'image'){
                if(file.size < 1024000){
                    let bodyFormData = new FormData();
                    bodyFormData.append("file", file)
        
                    axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile",bodyFormData, axiosKey)
                        .then(res => {
                            set_formValues({...formValues,"taxBillImageName":res.data.name})
                        }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
                    });
                }
                else{
                    set_formValues({...formValues,"paymentBillImage":""})
                    dispatch(setAlertContent(ALERT_TYPES.ERROR,"حجم فایل نباید بیشتر از 1 مگابایت باشد"));
                }
            }
            else{
                dispatch(setAlertContent(ALERT_TYPES.ERROR,"فقط فایل عکس ارسال شود."));
                set_formValues({...formValues,"paymentBillImage":""})
            }
        }
       
    },[formValues.taxBillImage])
    

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
