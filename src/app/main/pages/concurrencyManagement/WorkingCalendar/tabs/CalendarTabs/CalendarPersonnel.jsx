import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import TabPro from "app/main/components/TabPro";
import { useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from './../../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import {useSelector , useDispatch} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";


export default function CalendarPersonnel(props) {

    const {partyClassificationId} = props

    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const [info, setInfo] = useState({})

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [{
        name: "fullName",
        label: " پرسنل",
        type: "text",
    }, {
        name: "fromDate",
        label: " از تاریخ",
        type: "date",
    }, {
        name: "thruDate",
        label: "تا تاریخ",
        type: "date",
    }]

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/CalendarPersonnelTabFieldsData` , axiosKey).then((info)=>{
            fieldsInfo.unit = info.data?.listsData?.unit?.organizationUnit
            fieldsInfo.personnel = info.data?.listsData?.personnel
            fieldsInfo.positions = info.data?.listsData?.positions
            setFieldsInfo(Object.assign({},fieldsInfo))
            setInfo(info.data?.listsData)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    React.useEffect(()=>{
        if(loading && partyClassificationId){
            getTableData()
        }
    },[loading,partyClassificationId])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/CalendarPersonnel?partyClassificationId=${partyClassificationId}` , axiosKey).then((tableList)=>{
            setTableContent(tableList.data?.tableList)
            setLoading(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const handlerRemove = (rowData) => { 
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/CalendarPersonnel?partyClassificationId=${rowData?.partyClassificationId}&partyRelationshipId=${rowData?.partyRelationshipId}&fromDate=${rowData?.fromDate}` , axiosKey).then((response)=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }
    return (
        <Card>
            <CardContent>
                <TablePro
                    title='پرسنل'
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    add="external"
                    addForm={<Form setLoading={setLoading} fieldsInfo={fieldsInfo} partyClassificationId={partyClassificationId} info={info} setFieldsInfo={setFieldsInfo} 
                    tableContent={tableContent}/>}
                    edit="external"
                    editForm={<Form setLoading={setLoading} editing={true} fieldsInfo={fieldsInfo} partyClassificationId={partyClassificationId} info={info} 
                    setFieldsInfo={setFieldsInfo} tableContent={tableContent}/>}
                    removeCallback={handlerRemove}
                />
            </CardContent>
        </Card>
    )
}

function Form ({editing=false, ...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, fieldsInfo, partyClassificationId, info, setFieldsInfo, tableContent} = restProps;

    const [formValidation, setFormValidation] = useState({});  

    const [waiting, set_waiting] = useState(false)  

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name: "unitOrganizationId",
        label: "واحد سازمانی",
        type    : "select",
        options : fieldsInfo?.unit ,
        optionLabelField :"organizationName",
        optionIdField:"partyId",
        readOnly : editing ,
        col : 2
    },{
        name: "emplPositionId",
        label: "پست سازمانی",
        type    : "select",
        options : fieldsInfo.positions,
        optionLabelField :"description",
        optionIdField:"emplPositionId",
        readOnly : editing ,
    },{
        name: "partyRelationshipId",
        label: " پرسنل",
        type    : "select",
        options : fieldsInfo?.personnel ,
        optionLabelField :"fullName",
        optionIdField:"partyRelationshipId",
        readOnly : editing ,
        validator: values=>{
            var ind 
            editing ? ind = tableContent.findIndex(i=>i.partyRelationshipId == values.partyRelationshipId && i?.fromDate !== values?.fromDate ) :
            ind = tableContent.findIndex(i=>i.partyRelationshipId == values.partyRelationshipId) 
            return new Promise(resolve => {
                if(ind > -1){
                    resolve ({error: true, helper: "برای پرسنل انتخابی قبلا بازه ی تاریخی انتخاب شده است !"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        required: true
    }, {
        name: "fromDate",
        label: " از تاریخ",
        type: "date",
        required: true ,
        readOnly : editing ,
        col : 2
    }, {
        name: "thruDate",
        label: "تا تاریخ",
        type: "date",
        // required: true , 
        col : 2 
    }]
    
    useEffect(()=>{
        if(!formValues?.emplPositionId || formValues?.emplPositionId === null){
            fieldsInfo.personnel = (formValues?.unitOrganizationId  && formValues?.unitOrganizationId != "" ) ?
                                     info?.personnel.filter(o =>  o?.unitOrganizationId == formValues?.unitOrganizationId) :
                                     info?.personnel
            fieldsInfo.unit =   (formValues?.partyRelationshipId  && formValues?.partyRelationshipId  !== "") ?
                                     info?.unit?.organizationUnit?.filter((o) =>  o?.partyId == info?.personnel.find(o => o?.partyRelationshipId === formValues?.partyRelationshipId)?.unitOrganizationId ) :
                                     info?.unit?.organizationUnit
            setFieldsInfo(Object.assign({},fieldsInfo))         
        }else{
            
            fieldsInfo.personnel = (formValues?.unitOrganizationId  && formValues?.unitOrganizationId != "" ) ?
                                     info?.personnel.filter(o =>  o?.unitOrganizationId == formValues?.unitOrganizationId && o?.emplPositionId == formValues?.emplPositionId ) :
                                     info?.personnel.filter((o) =>  o?.emplPositionId == formValues?.emplPositionId )
            fieldsInfo.unit =   (formValues?.partyRelationshipId  && formValues?.partyRelationshipId  !== "") ?
                                     info?.unit?.organizationUnit?.filter((o) =>  o?.partyId == info?.personnel.find(o => o?.partyRelationshipId === formValues?.partyRelationshipId)?.unitOrganizationId &&
                                     o?.partyId == info.positions.find(o => o?.emplPositionId === formValues?.emplPositionId)?.organizationPartyId ) :
                                     info?.unit?.organizationUnit?.filter((o) =>  o?.partyId == info.positions.find(o => o?.emplPositionId === formValues?.emplPositionId)?.organizationPartyId )
            setFieldsInfo(Object.assign({},fieldsInfo))   
        }
    },[formValues?.emplPositionId,info])

    useEffect(()=>{
        if(!formValues?.unitOrganizationId || formValues?.unitOrganizationId === null){
            fieldsInfo.personnel = (formValues?.emplPositionId  && formValues?.emplPositionId != "" ) ?
                                     info?.personnel.filter(o =>  o?.emplPositionId == formValues?.emplPositionId) :
                                     info?.personnel
            fieldsInfo.positions =   (formValues?.partyRelationshipId  && formValues?.partyRelationshipId  !== "") ?
                                     info.positions?.filter((o) =>  o?.emplPositionId == info?.personnel.find(o => o?.partyRelationshipId === formValues?.partyRelationshipId)?.emplPositionId ) :
                                     info.positions?.position
            setFieldsInfo(Object.assign({},fieldsInfo))         
        }else{
            fieldsInfo.personnel = (formValues?.emplPositionId  && formValues?.emplPositionId != "" ) ?
                                     info?.personnel?.filter(o =>  o?.unitOrganizationId == formValues?.unitOrganizationId && o?.emplPositionId == formValues?.emplPositionId ) :
                                     info?.personnel?.filter((o) =>  o?.unitOrganizationId == formValues?.unitOrganizationId )
            fieldsInfo.positions =   (formValues?.partyRelationshipId  && formValues?.partyRelationshipId  !== "") ?
                                     info.positions?.filter((o) =>  o?.emplPositionId == info?.personnel.find(o => o?.partyRelationshipId === formValues?.partyRelationshipId)?.emplPositionId &&
                                     o?.organizationPartyId == formValues?.unitOrganizationId ) :
                                     info.positions?.filter((o) =>  o?.organizationPartyId == formValues?.unitOrganizationId )
            setFieldsInfo(Object.assign({},fieldsInfo))   
        }
    },[formValues?.unitOrganizationId,info])

    useEffect(()=>{
        if(!formValues?.partyRelationshipId || formValues?.partyRelationshipId === null){
            fieldsInfo.unit = (formValues?.emplPositionId  && formValues?.emplPositionId != "" ) ?
                                     info?.unit?.organizationUnit?.filter((o) =>  o?.partyId == info.positions.find(o => o?.emplPositionId === formValues?.emplPositionId)?.organizationPartyId ) :
                                     info?.unit?.organizationUnit
            fieldsInfo.positions =   (formValues?.unitOrganizationId  && formValues?.unitOrganizationId  !== "") ?
                                     info.positions.filter((o) =>  o?.organizationPartyId == formValues?.unitOrganizationId ) :
                                     info.positions
            setFieldsInfo(Object.assign({},fieldsInfo))         
        }else{
            fieldsInfo.unit = (formValues?.emplPositionId  && formValues?.emplPositionId != "" ) ?
                                     info?.unit?.organizationUnit?.filter((o) =>  o?.partyId == info.positions?.find(o => o?.emplPositionId === formValues?.emplPositionId)?.organizationPartyId &&
                                     o?.partyId == info?.personnel.find(o => o?.partyRelationshipId === formValues?.partyRelationshipId)?.unitOrganizationId ) :
                                     info?.unit?.organizationUnit?.filter((o) => o?.partyId == info?.personnel.find(o => o?.partyRelationshipId === formValues?.partyRelationshipId)?.unitOrganizationId )
            fieldsInfo.positions =   (formValues?.unitOrganizationId  && formValues?.unitOrganizationId  !== "") ?
                                     info.positions?.filter((o) =>  o?.organizationPartyId == formValues?.unitOrganizationId && 
                                     o?.emplPositionId ==  info?.personnel.find(o => o?.partyRelationshipId === formValues?.partyRelationshipId)?.emplPositionId ) :
                                     info.positions?.filter((o) =>  o?.emplPositionId ==  info?.personnel.find(o => o?.partyRelationshipId === formValues?.partyRelationshipId)?.emplPositionId)
            setFieldsInfo(Object.assign({},fieldsInfo))   
        }
    },[formValues?.partyRelationshipId,info])

    const checkAddPerson = () => {
        axios.post(`${SERVER_URL}/rest/s1/functionalManagement/CheckAddPersonToCalendar` , {data : {...formValues , partyClassificationId : partyClassificationId}} , axiosKey).then((info)=>{
            if(info.data?.response === "valid"){
                handleSubmit()
            }
            if(info.data?.response === "notValid"){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'پرسنل انتخاب شده در بازه مشخص شده عضو تقویم دیگری می باشد .'));
            }
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            set_waiting(false)
        })
    }

    const handleSubmit = () => { 
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.post(`${SERVER_URL}/rest/s1/functionalManagement/CalendarPersonnel` , {data : {...formValues , partyClassificationId : partyClassificationId}} , axiosKey).then((info)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            handleReset()
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            set_waiting(false)
        });
    }

    const handleEdit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.put(`${SERVER_URL}/rest/s1/functionalManagement/CalendarPersonnel` , {data : formValues } , axiosKey).then((info)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            handleReset()
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            set_waiting(false)
        });
    }

    const handleReset = () => {
        setFormValues({})
        set_waiting(false)
        handleClose()
     }

    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={() => editing ? handleEdit() : checkAddPerson()}
            actionBox={<ActionBox>
                <Button type="submit" role="primary" 
                                disabled={waiting}
                                endIcon={waiting?<CircularProgress size={20}/>:null}
                >{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
            resetCallback={handleReset}
        />
    )
}

