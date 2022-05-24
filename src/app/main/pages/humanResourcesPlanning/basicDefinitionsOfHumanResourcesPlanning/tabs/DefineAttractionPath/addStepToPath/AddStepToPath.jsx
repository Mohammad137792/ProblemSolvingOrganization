import React, { useState } from 'react';
import Card from "@material-ui/core/Card";
import TablePro from "../../../../../../components/TablePro";
import {Button, CardContent, CardHeader, Grid} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../../../../../components/ActionBox";
import {SERVER_URL , AXIOS_TIMEOUT} from "../../../../../../../../configs";
import axios from "axios";
import {useSelector , useDispatch} from "react-redux";
import {Image} from "@material-ui/icons"
import { ALERT_TYPES, setAlertContent } from "../../../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Box} from "@material-ui/core";


const AddStepToPath = (props) => {

    const {recruitmentRouteId} = props

    const [tableContent,setTableContent]=useState([]);
    const [loading, setLoading] = useState(true);
    const [fieldInfo , setFieldInfo] = useState({organizationUnit : [] , position : [] , phase : [] , level : [] , levelResponsibleTypeEnumId : [] , questionnaire : []});

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        { name : "parentRouteLevelId", label: "فاز مسیر", type    : "select", options : fieldInfo.phase, optionLabelField :"description", optionIdField:"enumId" , style: {minWidth:"80px"} },
        { name : "routeLevelEnumId", label: "مرحله فاز", type : "select", options : fieldInfo.level, optionLabelField :"description", optionIdField:"enumId" , style: {minWidth:"120px"} },
        { name : "levelSequence", label: "ترتیب انجام مرحله", type: "number" , style: {minWidth:"80px"} },
        { name : "description", label: " توضیحات", type: "text", style: {minWidth:"120px"} },
        { name : "levelNeeded", label: "مرحله ضروری", type: "indicator" , style: {minWidth:"80px"} },
        { name : "levelResponsibleTypeEnum", label: "مسئول مرحله", type    : "text" , style: {minWidth:"120px"} },
        { name : "tools", label: "ابزار مرحله", type: "text", style: {minWidth:"120px"} },
    ]

    
    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/fadak/party/subOrganization`, axiosKey).then((unitres)=>{
            fieldInfo.organizationUnit = unitres.data.organizationUnit
            axios.get(`${SERVER_URL}/rest/s1/fadak/emplPosition`, axiosKey).then((empres)=>{
                fieldInfo.position = empres.data.position
                axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=recruitmentRoute`, axiosKey).then((phares)=>{
                    fieldInfo.phase = phares.data.result.filter((o) => o["parentEnumId"] == "" || !o["parentEnumId"])
                    axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=LevelResponsible`, axiosKey).then((levelResponsibleTypeEnumId)=>{
                        fieldInfo.levelResponsibleTypeEnumId = levelResponsibleTypeEnumId.data.result
                        axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=QuestionnaireCategory&parentEnumId=QcRecruitment`, axiosKey).then((questionnaire)=>{
                            fieldInfo.questionnaire = questionnaire.data.result
                            axios.get(`${SERVER_URL}/rest/s1/fadak/entity/Enumeration?enumTypeId=RecruitmentRoute`, axiosKey).then((levres)=>{
                                fieldInfo.level = levres.data.result
                                setFieldInfo(Object.assign({},fieldInfo))
                                axios.get(`${SERVER_URL}/rest/s1/humanres/RouteLevel?recruitmentRouteId=${recruitmentRouteId}`, axiosKey).then((res)=>{
                                    console.log("ressssssss" , res.data);
                                    setLoading(false)
                                    setTableContent(res.data.routeLevelList)
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    React.useEffect(()=>{
        if(loading){
            getData()
        }
    },[loading])

    const handleRemove = (row) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/humanres/RouteLevel?routeLevelId=${row.routeLevelId}`, axiosKey).then(()=>{
                resolve()
                setLoading(true)
            }).catch(()=>{
                reject()
            })
        })
    }

    return (
        <Card>
            <CardContent>
                <TablePro
                    title="لیست فازها و مراحل مسیر جذب"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    add="external"
                    addForm={<Form setLoading={setLoading} fieldInfo={fieldInfo} setFieldInfo={setFieldInfo} recruitmentRouteId={recruitmentRouteId}/>}
                    edit="external"
                    editForm={<Form editing={true} setLoading={setLoading} fieldInfo={fieldInfo} setFieldInfo={setFieldInfo} recruitmentRouteId={recruitmentRouteId}/>}
                    removeCallback={handleRemove}
                />

           </CardContent> 
        </Card>                                        
    );
};

export default AddStepToPath;

function Form ({editing=false,...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, fieldInfo, setFieldInfo, recruitmentRouteId} = restProps;

    const [checksLastStatus,setChecksLastStatus] = React.useState({questionnaire : false , competencyModel : false});

    const [formValidation, setFormValidation] = React.useState({});
    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();
    
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }  

    React.useEffect(()=>{
        if(!editing) {
            setFormValues({levelNeeded : "Y"})
        }
    },[])

    React.useEffect(()=>{
        if(formValues.parentRouteLevelId == null){
            formValues.routeLevelEnumId = ""
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.parentRouteLevelId])

    const formStructure=[
        {
            name    : "parentRouteLevelId",
            label   : "فاز",
            type    : "select",
            options : fieldInfo.phase,
            optionLabelField :"description",
            optionIdField:"enumId",
            required : true ,
            col     : 3
        },{
            name    : "routeLevelEnumId",
            label   : "مرحله",
            type    : "select",
            options : fieldInfo.level,
            optionLabelField :"description",
            optionIdField:"enumId",
            filterOptions: (options) =>
            (formValues["parentRouteLevelId"] && formValues["parentRouteLevelId"] != "") 
              ? options.filter((o) => o["parentEnumId"] == formValues["parentRouteLevelId"]) : options ,
            required : true ,
            disabled : (formValues.parentRouteLevelId && formValues.parentRouteLevelId !== "") ? false : true ,
            col     : 3
        },{
            name    : "levelSequence",
            label   : "ترتیب انجام مرحله",
            type    : "number",
            required : true  ,
            col     : 3
        },{
            name    : "levelNeeded",
            label   : "مرحله ضروری",
            type    : "indicator",
            col     : 3
        },{
            type: "component",
            component : <p>تعیین ابزار های مورد استفاده در مرحله : </p> , 
            col     : 3
        },{
            name    : "questionnaire",
            label: "پرسشنامه",
            type    : "check",
            col : 1
        },formValues.questionnaire ? {
            name    : "questionnaireId",
            label   : "انتخاب پرسشنامه",
            type    : "select",
            options : fieldInfo.questionnaire,
            optionLabelField :"description",
            optionIdField:"enumId",
            required : true ,
            required : formValues.questionnaire ? true : false ,
            col : 2
        }:{
            type: "component",
            component : <div/> , 
            col : 2
        },{
            name    : "levelResponsibleTypeEnumId",
            label   : "مسئول مرحله",
            type    : "select",
            options : fieldInfo.levelResponsibleTypeEnumId,
            optionLabelField :"description",
            optionIdField:"enumId",
            col     : 3
        } , formValues.levelResponsibleTypeEnumId == "OTHER" ? {
            type: "component",
            component : <OtherPersons formValues={formValues} setFormValues={setFormValues} fieldInfo={fieldInfo} /> , 
            col     : 3
        }:{
            type: "component",
            component : <div/> , 
            col     : 3
        },{
            name    : "description",
            label   : "توضیحات مرحله",
            type    : "textarea",
            col     : 12
        }]

    function OtherPersons (props) {

        const {formValues, setFormValues, fieldInfo} = props

        const structure = [{
            name    : "organizationPartyId",
            label   : "واحد سازمانی",
            type    : "select",
            options : fieldInfo.organizationUnit,
            optionLabelField :"organizationName",
            optionIdField:"partyId",
            // filterOptions: (options) =>
            // (formValues["ResponsibleEmplePositionID"] && formValues["ResponsibleEmplePositionID"] != "") 
            //   ? options.filter((o) => o["partyId"] == formValues["ResponsibleEmplePositionID"]) : options ,
            col : 6
        },{
            name    : "responsibleEmplePositionId",
            label   : "پست سازمانی",
            type    : "select",
            options : fieldInfo.position,
            optionLabelField :"description",
            optionIdField:"emplPositionId",
            filterOptions: (options) =>
            (formValues["unit"] && formValues["unit"] != "") 
              ? options.filter((o) => o["organizationPartyId"] == formValues["unit"]) : options ,
            col : 6
        }]

        return (
            <FormPro
                prepend={structure}
                formValues={formValues}
                setFormValues={setFormValues}
            />
        )
    }

    // React.useEffect(()=>{
    //     if(formValues?.questionnaire && (checksLastStatus?.questionnaire !== formValues?.questionnaire) ){
    //         formValues.competencyModel = false
    //         formValues.questionnaire = true
    //         setFormValues(Object.assign({} ,formValues ))
    //         checksLastStatus.competencyModel = false
    //         checksLastStatus.questionnaire = true
    //         setChecksLastStatus(Object.assign({} ,checksLastStatus ))
    //     }
    //     if(formValues?.competencyModel && (checksLastStatus?.competencyModel !== formValues?.competencyModel) ){
    //         checksLastStatus.questionnaire = false
    //         checksLastStatus.competencyModel = true
    //         formValues.questionnaire = false
    //         setFormValues(Object.assign({} ,formValues ))
    //         setChecksLastStatus(Object.assign({} ,checksLastStatus ))
    //     }
    // },[formValues?.questionnaire,formValues?.competencyModel])

    React.useEffect(()=>{
        if(!formValues?.questionnaire || formValues?.questionnaire == false ){
            formValues.questionnaireId = ""
            setFormValues(Object.assign({} ,formValues ))
        }
    },[formValues?.questionnaire])

    React.useEffect(()=>{
        if(formValues?.levelResponsibleTypeEnumId != "OTHER" ){
            formValues.unit = ""
            formValues.responsibleEmplePositionId = ""
            setFormValues(Object.assign({} ,formValues ))
        }
    },[formValues?.levelResponsibleTypeEnumId])

    const handleSubmit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        formValues.recruitmentRouteId = recruitmentRouteId
        axios.post(`${SERVER_URL}/rest/s1/humanres/RouteLevel` , formValues , axiosKey)
        .then(()=>{
            setLoading(true)
            resetCallback()
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
        });
    }

    const handleEdit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        formValues.recruitmentRouteId = recruitmentRouteId
        axios.put(`${SERVER_URL}/rest/s1/humanres/RouteLevel` , formValues , axiosKey).then((res)=>{
            setLoading(true)
            set_waiting(false)
            resetCallback()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
        });
    }

    const resetCallback = () => {
        handleClose()
        setFormValues({levelNeeded : "Y"})
    }
    console.log("formValues" , formValues)
    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                if(editing){
                    handleEdit()
                }else{
                    handleSubmit()
                }
            }}
            resetCallback={resetCallback}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                >{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}