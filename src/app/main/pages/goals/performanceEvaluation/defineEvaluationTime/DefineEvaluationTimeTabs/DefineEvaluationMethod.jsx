import React, { useState, useEffect , createRef} from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {Button, CardContent, CardHeader, Grid , Typography} from "@material-ui/core";
import TablePro from "../../../../../components/TablePro";
import TabPro from "../../../../../components/TabPro";
import ActionBox from "../../../../../components/ActionBox";
import {useDispatch, useSelector} from "react-redux";
import {SERVER_URL} from 'configs';
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import FormPro from 'app/main/components/formControls/FormPro';

const DefineEvaluationMethod = (props) => {

    const {verificationId, setVerificationId, fieldInfo, formValues, setFormValues} = props

    const [formValidation, setFormValidation] = useState({});
    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [
        {
            name: "expert",
            label: "انتخاب توسط کارشناس مسئول",
            type: "check", 
            col : 4 
        }
        // ,{
        //     name: "staff",
        //     label: "پیشنهاد توسط پرسنل ارزیابی شونده",
        //     type: "check" ,
        //     col : 4 
        // },{
        //     name: "team",
        //     label: "انتخاب توسط تیم کانون ارزیابی",
        //     type: "check",
        //     col : 4 
        // }
    ]

        
    const FormComplexPartyStructure = [
        {
            name  : "methodUnit",
            label : "واحد سازمانی",
            type  : "select",
            options: fieldInfo.unitInfo,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            col   : 3,
        },
        {
            name  : "responsibleEmplpositionId",
            label : "پست سازمانی",
            type  : "select",
            options: fieldInfo.positionInfo,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            filterOptions: (options) => formValues.unit 
            ? options.filter((item) => formValues["unit"].indexOf(item.organizationPartyId) >= 0)
            : options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            col   : 3,
        }
    ]; 

    // const teamFormStructure = [
    //     {
    //         name  : "centerEvaluatorRelationshipId",
    //         label : "اعضای کانون",
    //         type  : "select",
    //         options: fieldInfo.centerEvaluatorRelationshipId,
    //         optionLabelField: "fullName",
    //         optionIdField: "partyRelationshipId",
    //         col   : 3,
    //     }
    // ]; 

    // const staffFormStructure = [
    //     {
    //         type  : "component",
    //         component : <Typography variant="subtitle1" >
    //                         انتخاب مسئول بررسی :
    //                      </Typography> ,
    //         col   : 6,
    //     },
    //     {
    //         name  : "methodUnit",
    //         label : "واحد سازمانی",
    //         type  : "select",
    //         options: fieldInfo.unitInfo,
    //         optionLabelField: "organizationName",
    //         optionIdField: "partyId",
    //         filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
    //         col   : 3,
    //     },
    //     {
    //         name  : "responsibleEmplpositionId",
    //         label : "پست سازمانی",
    //         type  : "select",
    //         options: fieldInfo.positionInfo,
    //         optionLabelField: "description",
    //         optionIdField: "emplPositionId",
    //         filterOptions: (options) => formValues.unit 
    //         ? options.filter((item) => formValues["unit"].indexOf(item.organizationPartyId) >= 0)
    //         : options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
    //         col   : 3,
    //     },
    //     {
    //         type  : "component",
    //         component : <Typography variant="subtitle1" >
    //                           مهلت انجام امور محوله برای ارزیابی شونده (تعیین ارزیاب) :
    //                      </Typography> ,
    //         col   : 6,
    //     },
    //     {
    //         type    : "group",
    //         items   : [{
    //             label   : "تا",
    //             type    : "text",
    //             disabled: true,
    //             style:  {width:"20%"}
    //         },{
    //             name    : "evaluatedFormDay",
    //             type    : "number",
    //             style:  {width:"60%"}
    //         },{
    //             label   : " روز بعد از تاریخ ثبت ",
    //             type    : "text",
    //             disabled: true,
    //         }],
    //         col   : 3,
    //     },
    //     {
    //         label   : " تاریخ ثبت ",
    //         name  : "evaluatedFormDate",
    //         type  : "date",
    //         col   : 3,
    //     },
    //     {
    //         type  : "component",
    //         component : <Typography variant="subtitle1" >
    //                           مهلت انجام امور محوله برای  مدیران مستقیم (تایید ارزیاب) :
    //                      </Typography> ,
    //         col   : 6,
    //     },
    //     {
    //         type    : "group",
    //         items   : [{
    //             label   : "تا",
    //             type    : "text",
    //             disabled: true,
    //             style:  {width:"20%"}
    //         },{
    //             name    : "evaluatorFormDay",
    //             type    : "number",
    //             style:  {width:"60%"}
    //         },{
    //             label   : " روز بعد از تاریخ ثبت",
    //             type    : "text",
    //             disabled: true,
    //         }],
    //         col   : 3,
    //     },
    //     {
    //         label   : " تاریخ ثبت ",
    //         name  : "evaluatorFormDate",
    //         type  : "date",
    //         col   : 3,
    //     },
    //     {
    //         name : "managerConfirm" ,
    //         label: "تایید ارزیاب توسط مدیران مستقیم",
    //         type: "check",
    //         col : 6 
    //     },
    //     {
    //         type    : "group",
    //         items   : [{
    //                 label   : "مدیران تا",
    //                 type    : "text",
    //                 disabled: true,
    //             },{
    //             name    : "directManagersLevel",
    //             type    : "number",
    //             style:  {minWidth:"20%"},
    //             disabled: formValues.managerConfirm ? false : true
    //         },{
    //             label   : "لایه بالاتر",
    //             type    : "text",
    //             disabled: true,
    //         }],
    //         col   : 3,
    //     }
    // ]; 

    useEffect(() => {
        if(formValues.expert){
            formValues.unit = ""
            formValues.responsibleEmplpositionId = ""
            formValues.centerEvaluatorRelationshipId = ""
            formValues.evaluatorFormSentDate = ""
            formValues.directManagersLevel = ""
            formValues.evaluatedFormDate = ""
            formValues.evaluatedFormDay = ""
            formValues.evaluatorFormDay = ""
            formValues.managerConfirm = false
            formValues.staff = false
            formValues.team = false
            formValues.expert = true
            setFormValues(Object.assign({},formValues))
        }

    }, [formValues?.expert])

    // useEffect(() => {
    //     if(formValues.staff){
    //         formValues.unit = ""
    //         formValues.responsibleEmplpositionId = ""
    //         formValues.centerEvaluatorRelationshipId = ""
    //         formValues.evaluatorFormSentDate = ""
    //         formValues.directManagersLevel = ""
    //         formValues.evaluatedFormDate = ""
    //         formValues.evaluatedFormDay = ""
    //         formValues.evaluatorFormDay = ""
    //         formValues.managerConfirm = false
    //         formValues.expert = false
    //         formValues.team = false
    //         formValues.staff = true
    //         setFormValues(Object.assign({},formValues))
    //     }

    // }, [formValues?.staff])

    // useEffect(() => {
    //     if(formValues.team){
    //         formValues.unit = ""
    //         formValues.responsibleEmplpositionId = ""
    //         formValues.centerEvaluatorRelationshipId = ""
    //         formValues.evaluatorFormSentDate = ""
    //         formValues.directManagersLevel = ""
    //         formValues.evaluatedFormDate = ""
    //         formValues.evaluatedFormDay = ""
    //         formValues.evaluatorFormDay = ""
    //         formValues.managerConfirm = false
    //         formValues.staff = false
    //         formValues.expert = false
    //         formValues.team = true
    //         setFormValues(Object.assign({},formValues))
    //     }

    // }, [formValues?.team])

    useEffect(() => {
        if (verificationId.evaluatorSelectionVerification && verificationId.evaluatorSelectionVerification != ""){
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/VerificationLevel?verificationId=${verificationId.evaluatorSelectionVerification}`, axiosKey)
            .then((res) => {
                if (res.data.result.length != 0){
                    let tableData = []
                    res.data.result.map((item,index) => {
                        const ind = fieldInfo.evaluatingPersonsInfo.findIndex(i=> i.emplPositionIds[0] == item.emplPositionId && i.subOrgPartyId[0] == fieldInfo.companyPartyId )
                        let rowData = {
                            ...item ,
                            pseudoId : fieldInfo.evaluatingPersonsInfo[ind].pseudoId
                        }
                        tableData.push(rowData)
                        if (index == res.data.result.length-1){
                            setTableContent(tableData)
                            setLoading(false)
                        }
                    })
                }
                else {
                    setTableContent([])
                    setLoading(false)
                }
            })
            .catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }
        else{
            setTableContent([])
            setLoading(false)
        }

    }, [loading,verificationId?.evaluatorSelectionVerification])

    const submitLevelTableCols = [
        {
            name: "sequence",
            label: " ترتیب انجام ",
            type: "text",
            style: { minWidth: "130px" },
        },
        {
            name: "pseudoId",
            label: "کد پرسنلی",
            type: "text",
            style: { minWidth: "130px" },
        }, 
        {
            name  : "emplPositionId",
            label : "پست سازمانی",
            type  : "select",
            options: fieldInfo.positionInfo,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            col   : 3,
        },
        {
            name: "modify",
            label: "امکان رد برای اصلاح",
            type: "indicator",
            style: { minWidth: "130px" },
        },
        {
            name: "reject",
            label: "امکان رد",
            type: "indicator",
            style: { minWidth: "130px" },
        },
      ];

    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/fadak/entity/VerificationLevel?levelId=${oldData.levelId}`, axiosKey).then(()=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    } 

    return (
        <>
            <Box m={2}/>
            <Card>
                <CardContent>
                    <FormPro
                        formValues = {formValues}
                        setFormValues = {setFormValues}
                        append={formStructure}
                        formValidation = {formValidation}
                        setFormValidation = {setFormValidation}
                    />
                    {formValues.expert ? 
                        <FormPro
                            append = {FormComplexPartyStructure}
                            formValues = {formValues}
                            setFormValues = {setFormValues}
                            formValidation = {formValidation}
                            setFormValidation = {setFormValidation}
                        />  
                    :""}
                    {/* {formValues.staff ? 
                        <FormPro
                            formValues = {formValues}
                            setFormValues = {setFormValues}
                            append={staffFormStructure}
                        />

                    :""} */}
                    {/* {formValues.team ? 
                        <FormPro
                            formValues = {formValues}
                            setFormValues = {setFormValues}
                            append={teamFormStructure}
                            formValidation = {formValidation}
                            setFormValidation = {setFormValidation}
                        />
                    :""} */}
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <CardContent>
                    <TablePro
                        title = "مراتب تایید"
                        columns={submitLevelTableCols}
                        rows={tableContent}
                        setRows={setTableContent}
                        add="external"
                        addForm={<AddConformLevelForm verificationId={verificationId} setVerificationId={setVerificationId} setLoading={setLoading} fieldInfo={fieldInfo} />}
                        edit="external"
                        editForm={<AddConformLevelForm verificationId={verificationId} setVerificationId={setVerificationId} setLoading={setLoading} fieldInfo={fieldInfo} editing={true}/>}
                        loading={loading}
                        removeCallback={handleRemove}
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default DefineEvaluationMethod;

function AddConformLevelForm (props) {

    const {verificationId, setVerificationId, setLoading, fieldInfo, editing = false, formValues, setFormValues, handleClose} = props

    const dispatch = useDispatch();
    
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [
        {
            name  : "emplPositionId",
            label : "پست سازمانی",
            type  : "select",
            options: fieldInfo.positionInfo,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            filterOptions: (options) => options.filter((o) => o["parentOrgId"] == fieldInfo.companyPartyId),
            col   : 3,
        },
        {
            name  : "sequence",
            label : "ترتیب ارسال جهت تایید",
            type  : "number",
            col   : 3,
        },
        {
            name  : "modify",
            label : "امکان رد برای اصلاح",
            type  : "indicator",
            col   : 3,
        },
        {
            name  : "reject",
            label : "امکان رد",
            type  : "indicator",
            col   : 3,
        },
    ]

    const submitVerificationLevel = () => {
        if (!verificationId.evaluatorSelectionVerification || verificationId.evaluatorSelectionVerification == ""){
            axios.post(SERVER_URL +"/rest/s1/evaluation/EvaluationVerification", {data : {...formValues , type : "EvaluatorSelection"} } ,axiosKey).then((res) => {
                verificationId.evaluatorSelectionVerification = res.data.verificationId.verificationId
                setVerificationId(Object.assign({},verificationId))
                setLoading(true)
                resetCallback()
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            });
        }
        else {
            axios.post(SERVER_URL +"/rest/s1/evaluation/EvaluationVerification", {data : {...formValues , verificationId : verificationId.evaluatorSelectionVerification , type : "EvaluatorSelection"} } ,axiosKey).then((res) => {
                setLoading(true)
                resetCallback()
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            });
        }
    }

    const resetCallback = () => {
        setFormValues({})
        handleClose()
    }

    const handleEdit = () => {
        axios.put(SERVER_URL +"/rest/s1/fadak/entity/VerificationLevel", {data : formValues} ,axiosKey).then((res) => {
            setLoading(true)
            resetCallback()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ویرایش اطلاعات !'));
        });
    }

    return (
        <FormPro
            formValues = {formValues}
            setFormValues = {setFormValues}
            append={formStructure}
            submitCallback={()=>{
                if(editing){
                    handleEdit()
                }else{
                    submitVerificationLevel()
                }
            }}
            resetCallback={resetCallback}
            actionBox={
                <ActionBox>
                    <Button type="submit" role="primary">{editing ? "ویرایش" : "افزودن"}</Button>
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>
            }
        />

    )
}