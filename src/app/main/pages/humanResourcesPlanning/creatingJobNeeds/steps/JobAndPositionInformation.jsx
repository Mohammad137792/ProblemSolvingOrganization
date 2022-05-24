import FormPro from "../../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import ActionBox from "../../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';


const JobAndPositionInformation = (props) => {

    const {formValues, setFormValues , submitCallback = () => { }, submitRef, confirmation = false, managementMode = false} = props

    const [formValidation, setFormValidation] = React.useState({});

    const [fieldInfo , setFieldInfo] = useState({});
    const [positions, setPosition] = useState([]);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[{
            name    : "jobCategoryEnumId",
            label   : "رسته شغلی",
            type    : "select",
            options : fieldInfo?.jobCategory,
            optionLabelField :"description",
            optionIdField:"enumId",
            filterOptions: (options) => options.filter((o) =>  !o?.parentEnumId || (o?.parentEnumId == "") ) ,
            disabled : confirmation || managementMode ,
            col     : 4
        },{
            name    : "jobSubCategoryEnumId",
            label   : "رسته فرعی شغلی",
            type    : "select",
            options : fieldInfo?.jobCategory ,
            optionLabelField :"description",
            optionIdField:"enumId",
            filterOptions: (options) => options.filter((o) =>  o?.parentEnumId && (o?.parentEnumId == formValues?.jobCategoryEnumId) ) ,
            disabled : (formValues?.jobCategoryEnumId && formValues?.jobCategoryEnumId !== "") ? false : true ,
            disabled : confirmation || managementMode ,
            col     : 4
        },{
            name    : "jobId",
            label   : "شغل",
            type    : "select",
            options : fieldInfo?.JobGroup ,
            optionLabelField :"jobTitle",
            optionIdField:"jobId",
            filterOptions: (options) =>
            ((formValues?.jobCategoryEnumId && formValues?.jobCategoryEnumId != "") && (!formValues?.jobSubCategoryEnumId || formValues?.jobSubCategoryEnumId === ""))
              ? options.filter((o) => o?.jobCategoryEnumId == formValues?.jobCategoryEnumId)
              : 
              ((!formValues?.jobCategoryEnumId || formValues?.jobCategoryEnumId === "") && (formValues?.jobSubCategoryEnumId && formValues?.jobSubCategoryEnumId !== ""))
              ? options.filter((o) => o?.jobSubCategoryEnumId == formValues?.jobSubCategoryEnumId)
              : 
              ((formValues?.jobCategoryEnumId && formValues?.jobCategoryEnumId !== "") && (formValues?.jobSubCategoryEnumId && formValues?.jobSubCategoryEnumId !== ""))
              ? options.filter((o) => (o?.jobSubCategoryEnumId == formValues?.jobSubCategoryEnumId) && (o?.jobCategoryEnumId == formValues?.jobCategoryEnumId))
              :options,
            disabled : confirmation || managementMode ,
            col     : 4
        },{
            name    : "jobGradeId",
            label   : " طبقه شغلی",
            type    : "select",
            options : fieldInfo?.JobGrade ,
            optionLabelField :"description",
            optionIdField:"jobGradeId",
            filterOptions: (options) => formValues?.jobId ? options.filter((o) =>  o?.jobId && (o?.jobId == formValues?.jobId)) : options ,
            disabled : confirmation || managementMode ,
            col     : 4
        },{
            name    : "payGradeId",
            label   : "رتبه شغلی",
            type    : "select",
            options : fieldInfo?.PayGrade ,
            optionLabelField :"description",
            optionIdField:"payGradeId",
            disabled : confirmation || managementMode,
            col     : 4
        },{
            name    : "positionType",
            label   : "نوع پست",
            type    : "select",
            options : fieldInfo?.PositionType ,
            optionLabelField :"description",
            optionIdField:"enumId",
            disabled : confirmation || managementMode ,
            col     : 4
        },{
            name    : "gradeType",
            label   : "رده سازمانی",
            type    : "select",
            options : fieldInfo?.GradeType ,
            optionLabelField :"description",
            optionIdField:"enumId",
            disabled : confirmation || managementMode ,
            col     : 4
        },{
            name    : "organizationUnit",
            label   : "واحد سازمانی",
            type    : "select",
            options : fieldInfo?.OrganizationDetailed?.organizationUnit ,
            optionLabelField :"organizationName",
            optionIdField:"partyId",
            disabled : confirmation || managementMode,
            col     : 4
        },{
            name    : "requiredEmplPositionId",
            label   : "پست سازمانی",
            type    : "select",
            options : positions , 
            optionLabelField :"description",
            optionIdField:"emplPositionId",
            required :  true ,
            disabled : confirmation || managementMode ,
            col     : 4
        }]

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=JobCategory,PositionType,GradeType`, axiosKey).then((enumsInfo)=>{
            fieldInfo.jobCategory = enumsInfo.data.enums?.JobCategory
            fieldInfo.PositionType = enumsInfo.data.enums?.PositionType
            fieldInfo.GradeType = enumsInfo.data.enums?.GradeType
            axios.get(`${SERVER_URL}/rest/s1/humanres/GetPostAndJobOpt`, axiosKey).then((res)=>{
                console.log("ressssssssssssssss" , res.data);
                setFieldInfo(Object.assign({},fieldInfo,res.data?.PostAndJobInfo))
                setPosition(res.data?.PostAndJobInfo?.EmplPositionInfo)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    React.useEffect(()=>{
        if(fieldInfo?.EmplPositionInfo) {
            const fields = ["organizationUnit" ,"jobGradeId" , "payGradeId" , "jobCategoryEnumId" , "jobSubCategoryEnumId" , "positionType" , "gradeType" , "jobId" ]
            let result = fieldInfo?.EmplPositionInfo
            fields.map((item,index) => {
                if(item == "organizationUnit" ){
                    if(formValues?.organizationUnit && formValues?.organizationUnit !== ""){
                        result = result.filter((o) => o?.organizationPartyId == formValues?.organizationUnit)
                    }
                }
                if(item == "jobGradeId" ){
                    if(formValues?.jobGradeId && formValues?.jobGradeId !== ""){
                        result = result.filter((o) => o?.jobGradeId == formValues?.jobGradeId)
                    }
                }
                if(item == "payGradeId" ){
                    if(formValues?.payGradeId && formValues?.payGradeId !== ""){
                        result = result.filter((o) => o?.payGradeId == formValues?.payGradeId)
                    }
                }
                if(item == "positionType" ){
                    if(formValues?.positionType && formValues?.positionType !== ""){
                        result = result.filter((o) => o?.positionTypeEnumId == formValues?.positionType)
                    }
                }
                if(item == "gradeType" ){
                    if(formValues?.gradeType && formValues?.gradeType !== ""){
                        result = result.filter((o) => o?.gradeTypeEnumId == formValues?.gradeType)
                    }
                }
                if(item == "jobCategoryEnumId" ){
                    if(formValues?.jobCategoryEnumId && formValues?.jobCategoryEnumId !== ""){
                        result = result.filter((o) => o?.jobCategoryEnumId == formValues?.jobCategoryEnumId)
                    }
                }
                if(item == "jobSubCategoryEnumId" ){
                    if(formValues?.jobSubCategoryEnumId && formValues?.jobSubCategoryEnumId !== ""){
                        result = result.filter((o) => o?.jobSubCategoryEnumId == formValues?.jobSubCategoryEnumId)
                    }
                }
                if(item == "jobId" ){
                    if(formValues?.jobId && formValues?.jobId !== ""){
                        result = result.filter((o) => o?.jobId == formValues?.jobId)
                    }
                }
                if (index == 7) {
                    setPosition(result)
                }
            })
        }
    },[formValues?.organizationUnit ,formValues?.jobGradeId, formValues?.payGradeId, formValues?.positionType, formValues?.gradeType, fieldInfo?.EmplPositionInfo, formValues?.jobId, formValues?.jobSubCategoryEnumId, formValues?.jobCategoryEnumId])

    return (
        <div>
            <Box mb={2}/>
            <CardHeader title="اطلاعات پست سازمانی و شغل"/>
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

export default JobAndPositionInformation;