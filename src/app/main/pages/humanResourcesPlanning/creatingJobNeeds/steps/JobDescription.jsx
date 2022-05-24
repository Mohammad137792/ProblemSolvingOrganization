import FormPro from "../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import ActionBox from "../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";


const JobDescription = (props) => {

    const {formValues, setFormValues, submitCallback = () => { }, submitRef, confirmation = false, draftMode = false} = props

    const [formValidation, setFormValidation] = React.useState({});

    const [fieldInfo , setFieldInfo] = useState({}); 

    const [jobDescriptionInitialization, setJobDescriptionInitialization] = useState(false);
    
    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[{
            name    : "jobDescription",
            label   : "توضیح شغل",
            type    : "textarea",
            required : true ,
            // disabled : confirmation ,
            col     : 12
        },{
            name    : "orgTemplate",
            label   : "انتخاب از الگو های متنی",
            type    : "select",
            options : fieldInfo.orgTemplate ,
            optionLabelField :"templateTitle",
            optionIdField:"templateId",
            // disabled : confirmation ,
            col     : 3
        },{
            name    : "orgDescription",
            label   : "توضیح واحد سازمانی",
            type    : "textarea",
            // disabled : confirmation ,
            // disabled: (!formValues?.orgTemplate || formValues?.orgTemplate == "" || confirmation) ? true : false ,
            col     : 12
        },{
            name    : "companyTemplate",
            label   : "انتخاب از الگو های متنی",
            type    : "select",
            options : fieldInfo.companyTemplate ,
            optionLabelField :"templateTitle",
            optionIdField:"templateId",
            // disabled : confirmation ,
            col     : 3
        },{
            name    : "companyDescription",
            label   : "توضیح کارفرما",
            type    : "textarea" ,
            // disabled : confirmation ,
            // disabled: (!formValues?.companyTemplate || formValues?.companyTemplate == "" || confirmation) ? true : false ,
            col     : 12
        }]

    React.useEffect(()=>{
        getData()
    },[])

    React.useEffect(()=>{
        if(jobDescriptionInitialization){
            if(!formValues?.companyTemplate || formValues?.companyTemplate === ""){
                formValues.companyDescription = ""
                setFormValues(Object.assign({},formValues))
            }
            if(formValues?.companyTemplate && formValues?.companyTemplate !== ""){
                companyTemplateHandler()
            }
        }
    },[formValues?.companyTemplate])

    React.useEffect(()=>{
        if(jobDescriptionInitialization){
            if(!formValues?.orgTemplate || formValues?.orgTemplate === ""){
                formValues.orgDescription = ""
                setFormValues(Object.assign({},formValues))
            }
            if(formValues?.orgTemplate && formValues?.orgTemplate !== ""){
                orgTemplateHandler()
            }
        }
    },[formValues?.orgTemplate ])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/jobforPosition?requiredEmplPositionId=${formValues?.requiredEmplPositionId}`, axiosKey).then((desc)=>{
            axios.get(`${SERVER_URL}/rest/s1/humanres/template`, axiosKey).then((org)=>{
                fieldInfo.orgTemplate = org.data?.orgTemplate
                fieldInfo.companyTemplate = org.data?.companyTemplate
                setFieldInfo(Object.assign({},fieldInfo))
                if(!formValues.jobDescription || formValues.jobDescription == ""){
                    formValues.jobDescription = desc.data?.jobDescription
                    setFormValues(Object.assign({},formValues))
                }
                setJobDescriptionInitialization(true)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const orgTemplateHandler = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/template`, axiosKey).then((org)=>{
            const index = org.data?.orgTemplate.findIndex(o=> o.templateId === formValues?.orgTemplate)
            formValues.orgDescription = org.data?.orgTemplate[index].templateText
            setFormValues(Object.assign({},formValues))
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const companyTemplateHandler = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/template`, axiosKey).then((comp)=>{
            const index = comp.data?.companyTemplate.findIndex(o=> o.templateId === formValues?.companyTemplate)
            formValues.companyDescription = comp.data?.companyTemplate[index].templateText
            setFormValues(Object.assign({},formValues))
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    return (
        <div>
            <Box mb={2}/>
            <CardHeader title="شرح شغل نمایشی به داوطلبان" />
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

export default JobDescription;