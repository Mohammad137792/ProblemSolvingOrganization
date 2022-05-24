import FormPro from "../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import ActionBox from "../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';



const BaseInformation = (props) => {

    const {submitCallback = () => { }, submitRef, managementMode = false, confirmation = false, formValues, setFormValues} = props

    const [formValidation, setFormValidation] = React.useState({});

    const [fieldInfo , setFieldInfo] = useState({});

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[{
            name    : "startDate",
            label   : "تاریخ ایجاد",
            type    : "date",
            display : managementMode ,
            disabled : true ,
            col     : 3
        },{
            name    : "starterName",
            label   : "نام و نام خانوادگی ایجاد کننده",
            type    : "text",
            display : managementMode ,
            disabled : true ,
            col     : 3
        },{
            name    : "trackingCode",
            label   : "کد رهگیری نیازمندی",
            type    : "text",
            display : managementMode ,
            disabled : true ,
            col     : 3
        },{
            name    : "requistionTitle",
            label   : "عنوان نیازمندی",
            type    : "text",
            required : !managementMode ? true : false ,
            disabled : managementMode || confirmation ,
            col     : (!confirmation && !managementMode) ? 4 : (confirmation ? 4 : 3)
        },{
            name    : "requistionSourceEnumId",
            label   : "منبع جذب",
            type    : "select",
            options : fieldInfo.RequisitionSource ,
            optionLabelField :"description",
            optionIdField:"enumId",
            disabled : confirmation ,
            col     : ((!confirmation && !managementMode) || confirmation) ? 2 : 3
        },{
            name    : "contractTypeEnumId",
            label   : "نوع قرارداد",
            type    : "select",
            options : fieldInfo.ContractType,
            optionLabelField :"description",
            optionIdField:"enumId",
            disabled : confirmation ,
            col     : ((!confirmation && !managementMode) || confirmation) ? 2 : 3
        },{
            name    : "recruitingReasonEnumId",
            label   : "علت جذب",
            type    : "select",
            options : fieldInfo.RecruitingReason,
            optionLabelField :"description",
            optionIdField:"enumId",
            disabled : confirmation ,
            col     : ((!confirmation && !managementMode) || confirmation) ? 2 : 3
        },{
            name    : "neededNum",
            label   : "تعداد مورد نیاز",
            type    : "number",
            disabled : confirmation ,
            col     : ((!confirmation && !managementMode) || confirmation) ? 2 : 3
        },{
            name    : "otherReason",
            label   : "سایر دلایل نیاز به جذب",
            type    : "textarea",
            display : formValues?.recruitingReasonEnumId === "OtherReason" ,
            disabled : confirmation ,
            col     : 6
        },{
            name    : "justification",
            label   : "توجیه نیاز به شغل",
            type    : "textarea",
            disabled : confirmation ,
            col     : formValues?.recruitingReasonEnumId === "OtherReason" ? 6 : 12
        }]

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {

        axios.get(`${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=RequisitionSource,ContractType,RecruitingReason`, axiosKey).then((enumsInfo)=>{
            setFieldInfo(enumsInfo?.data?.enums)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    return (
        <div>
            <Box mb={2}/>
            <CardHeader title= "اطلاعات پایه" />
            <FormPro
                prepend={formStructure}
                formValues={formValues} setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={setFormValidation}
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
        </div>
    );
};

export default BaseInformation;