import React, { useState, useEffect, createRef } from 'react'
import FormPro from 'app/main/components/formControls/FormPro';
import { Button, } from "@material-ui/core";
import ActionBox from "../../../../components/ActionBox";
import { SERVER_URL } from './../../../../../../configs'
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import TablePro  from 'app/main/components/TablePro';
import {Card, CardContent, CardHeader, Grid, TextField} from "@material-ui/core"
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak"; 


const InstructorQualification = () => {
    const [formValues, setFormValues] = useState({});
    const [formValidation, set_formValidation] = useState({});
    const [fieldList,setFieldList] = useState({status : [] , course : [] , institute : [] , companyPartyId : ""});
    const [loading,setLoading] = useState(true)
    const [tableContent, setTableContent] = React.useState([]);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [firstTimeCreate,setFirstTimeCreate] = useState({InstituteVsInstructor : true , EntInstructor : true });
    const [exData,setExData] = useState({});
    const [course,setCourse] =  useState();
    const [institute,setInstitute] = useState();
    const [tableInitData,setTableInitData] = useState([]);
    const [init,setInit] = useState(true);

    const submitRef = createRef(0);
    const [clicked, setClicked] = useState(0);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [
        {name: "courseId", label: "دوره های قابل ارائه", type: "select" , options: course , optionLabelField: "title", optionIdField: "courseId" ,  required: true, style: {width:"60%"}},
    ] 

    const formStructure = [
        { name: "institute", label: 'موسسه یا شرکت تامین کننده گواهی نامه' , type: 'select' , options: fieldList.institute , optionLabelField: "organizationName", optionIdField: "partyId" , col : 4 } ,
        { name: "score", label: 'نمره نهایی', type: 'number' , col : 4 },
        { name: "qualificationStatusId", label: ' وضعیت صلاحیت', type: 'select', options: fieldList.status , optionLabelField: "description", optionIdField: "statusId" ,  col : 4 ,
        filterOptions   : options => options.filter(o=>o.statusTypeId=="InstructorQualification")} ,
    ]

    const desc = [
        { name: "description", label: 'توضیحات', type: 'textarea' , col : 12 , rows : 24 , },
    ]

    useEffect(() => {
        if(partyRelationshipId){
            axios.get(`${SERVER_URL}/rest/s1/training/instructorSubmitFormInfo?pageSize=100000&partyRelationshipId=${partyRelationshipId}`, axiosKey).then(res => {
                axios.post(`${SERVER_URL}/rest/s1/training/instituteFilter` ,  {formValues : {companyPartyId : res.data.userCompanyPartyId , institueDisabled : "N" }}, axiosKey).then(ins => {
                    fieldList.status = res.data.status
                    fieldList.course = res.data.course.filter(o=>o.companyPartyId==res.data.userCompanyPartyId)
                    const allInstitute = ins.data?.filter.filter(o=>o?.institueDisabled == "N" && o?.qualificationStatusId == "تایید صلاحیت")
                    if(allInstitute.length > 0){
                        let data = [] 
                        allInstitute.map((ele, index) => {    
                            data.push(ele?.org)                       
                            if(index == allInstitute.length-1){
                                fieldList.institute = data
                            }
                        })
                    }
                    fieldList.companyPartyId = res.data.userCompanyPartyId
                    setCourse(res.data.course.filter(o=>o.companyPartyId==res.data.userCompanyPartyId))
                    axios.get(`${SERVER_URL}/rest/s1/training/instructorSubmit?pageSize=100000&partyId=${partyId}`, axiosKey).then(user => {
                        if(user.data.instructorQualificationInfo){setFirstTimeCreate((preState)=>({...preState , EntInstructor : false }))}
                        if(user.data.institute){setFirstTimeCreate((preState)=>({...preState , InstituteVsInstructor : false }))}
                        formValues.courseId = user?.data?.course ? JSON.stringify(user?.data?.course) : ""
                        formValues.institute = user?.data?.institute?.toPartyId ?? ""
                        formValues.partyRelationshipId = user?.data?.institute?.partyRelationshipId ?? ""
                        formValues.score = user?.data?.instructorQualificationInfo?.score ?? ""
                        formValues.qualificationStatusId = user?.data?.instructorQualificationInfo?.qualificationStatusId ?? ""
                        formValues.description = user?.data?.instructorQualificationInfo?.description ?? ""
                        formValues.date = user?.data?.instructorQualificationInfo?.date ?? ""
                        setFormValues(Object.assign({},formValues))
                        setExData(Object.assign({},formValues))
                        setFieldList(Object.assign({},fieldList))
                    })
                }) 
            })
        }
    }, [partyRelationshipId])

    // useEffect(() => {
    //     if(formValues?.institute && formValues?.institute != "" && fieldList.institute){
    //         const ind = fieldList.institute.findIndex(o => o.partyId == formValues?.institute)
    //         setCourse(fieldList.institute[ind].instituteCourse)
    //         setInit(false)
    //         if(!init){
    //             setTableContent([])
    //         }
    //     }
    //     if(formValues?.institute == null ){
    //         setTableContent([])
    //     }
    // }, [formValues?.institute,fieldList.institute])

    useEffect(() => {
        if(loading && fieldList?.companyPartyId){
            axios.get(`${SERVER_URL}/rest/s1/training/instructorSubmit?pageSize=100000&partyId=${partyId}`, axiosKey).then(user => {
                setTableContent(user?.data?.course)
                setTableInitData(user?.data?.course)
                setLoading(false)
            })
        }
    }, [loading,partyRelationshipId,fieldList?.companyPartyId])

    const handlerSubmit = () =>{
        let postData ={
            relationshipTypeEnumId : "PrtInsEmployee" ,
            fromPartyId : partyId ,
            toPartyId : formValues.institute
        }
        if(firstTimeCreate.InstituteVsInstructor && firstTimeCreate.EntInstructor){
            axios.post(`${SERVER_URL}/rest/s1/fadak/entity/PartyRelationship` , {data : postData} , axiosKey).then(res => {
                axios.post(`${SERVER_URL}/rest/s1/fadak/entity/Instructor` , {data : {...formValues , partyId : partyId , date : Math.round(new Date().getTime())}} , axiosKey).then(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد "));
                    setFirstTimeCreate((preState)=>({...preState , EntInstructor : false , InstituteVsInstructor : false }))
                    setExData(Object.assign({},formValues,{courseId : JSON.stringify(tableContent)}))
                }).catch(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ثبت !"));
                    setFirstTimeCreate((preState)=>({...preState , InstituteVsInstructor : false }))
                })
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ثبت !"));
            })

        }
        if(firstTimeCreate.InstituteVsInstructor && !firstTimeCreate.EntInstructor){
            axios.post(`${SERVER_URL}/rest/s1/fadak/entity/PartyRelationship` , {data : postData} , axiosKey).then(res => {
                axios.put(`${SERVER_URL}/rest/s1/fadak/entity/Instructor` , {data : {...formValues , partyId : partyId , date :  formValues.date}} , axiosKey).then(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش اطلاعات با موفقیت انجام شد "));
                    setFirstTimeCreate((preState)=>({...preState , EntInstructor : false , InstituteVsInstructor : false }))
                    setExData(Object.assign({},formValues,{courseId : JSON.stringify(tableContent)}))
                }).catch(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ویرایش !"));
                    setFirstTimeCreate((preState)=>({...preState , InstituteVsInstructor : false }))
                })
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ویرایش !"));
            })
        }
        if(!firstTimeCreate.InstituteVsInstructor && firstTimeCreate.EntInstructor){
            axios.put(`${SERVER_URL}/rest/s1/fadak/entity/PartyRelationship` , {data : {...postData , partyRelationshipId : formValues.partyRelationshipId}} , axiosKey).then(res => {
                axios.post(`${SERVER_URL}/rest/s1/fadak/entity/Instructor` , {data : {...formValues , partyId : partyId , date : Math.round(new Date().getTime())}} , axiosKey).then(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش اطلاعات با موفقیت انجام شد"));
                    setFirstTimeCreate((preState)=>({...preState , EntInstructor : false , InstituteVsInstructor : false }))
                    setExData(Object.assign({},formValues,{courseId : JSON.stringify(tableContent)}))
                }).catch(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ویرایش !"));
                })
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ویرایش !"));
            })
        }
        if(!firstTimeCreate.InstituteVsInstructor && !firstTimeCreate.EntInstructor){
            axios.put(`${SERVER_URL}/rest/s1/fadak/entity/PartyRelationship` , {data : {...postData , partyRelationshipId : formValues.partyRelationshipId }} , axiosKey).then(res => {
                axios.put(`${SERVER_URL}/rest/s1/fadak/entity/Instructor` , {data : {...formValues , partyId : partyId , date :  formValues.date}} , axiosKey).then(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش اطلاعات با موفقیت انجام شد"));
                    setFirstTimeCreate((preState)=>({...preState , EntInstructor : false , InstituteVsInstructor : false }))
                    setExData(Object.assign({},formValues,{courseId : JSON.stringify(tableContent)}))
                }).catch(()=>{
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ویرایش !"));
                })
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ویرایش !"));
            })
        }

    }

    const handleAdd = (newData)=>{
        return new Promise((resolve, reject) => {
            const ind = tableContent.findIndex(i=>i.courseId===newData.courseId)
            if(ind>-1){
                reject("دوره ی اضافه شده تکراری است !")
            }else{
                axios.post(`${SERVER_URL}/rest/s1/training/entity/PartyCourse` , {partyId : partyId , courseId : newData.courseId } , axiosKey)
                    .then(()=>{
                        setLoading(true)
                        resolve(newData)
                    }).catch(()=>{
                        reject()
                    })
            }
        })
    }

    const handleRemove = (oldData)=>{
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/training/entity/PartyCourse?partyId=${partyId}&courseId=${oldData.courseId}` , axiosKey)
                .then(()=>{
                    setLoading(true)
                    resolve()
                }).catch(()=>{
                    reject()
                })
        })
    }

    function trigerHiddenSubmitBtn() {
        setClicked(clicked + 1);
    }

    React.useEffect(() => {
        if (submitRef.current && clicked > 0) {
          submitRef.current.click();
        }
      }, [clicked]);

    return (
        <Grid container spacing={2} >
            <Grid item xs={12} md={12} >
                <FormPro
                    prepend={formStructure}
                    formValues={formValues} setFormValues={setFormValues}
                    formValidation={formValidation}
                    setFormValidation={set_formValidation}
                    submitCallback={() => handlerSubmit(formValues)}
                    actionBox={<ActionBox>
                        <Button type="submit" role="primary" ref={submitRef} style={{ display: "none" }}/>
                    </ActionBox>}
                />
            </Grid>
            <Grid item xs={12} md={6} >
                <TablePro
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    // add={(formValues?.institute && formValues?.institute != "")? "inline" : false}
                    add="inline"
                    addCallback={handleAdd}
                    removeCallback={handleRemove}
                    loading={loading}
                />
            </Grid>
            <Grid item xs={12} md={6} >
                <FormPro
                    prepend={desc}
                    formValues={formValues} setFormValues={setFormValues}
                    formValidation={formValidation}
                    setFormValidation={set_formValidation}
                    submitCallback={trigerHiddenSubmitBtn}
                    actionBox={<ActionBox>
                        <Button type="submit" role="primary">{((exData.courseId != "[]" && exData.courseId) || (exData.institute != "" && exData.institute) || (exData.score != "" && exData.score) 
                        || (exData.qualificationStatusId != "" && exData.qualificationStatusId) ||( exData.description != "" && exData.description)) ? "ویرایش" : "ثبت"}</Button>
                    </ActionBox>}
                />
            </Grid>
        </Grid>

    );
};

export default InstructorQualification;
