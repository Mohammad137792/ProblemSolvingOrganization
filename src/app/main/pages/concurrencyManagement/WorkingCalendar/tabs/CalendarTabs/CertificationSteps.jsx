import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import TabPro from "app/main/components/TabPro";
import axios from 'axios';
import { SERVER_URL } from './../../../../../../../configs'
import { ALERT_TYPES, getData, setAlertContent } from "../../../../../../store/actions/fadak";
import {useSelector , useDispatch} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useEffect } from 'react';


export default function CertificationSteps(props) {

    const {partyClassificationId} = props

    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState([])

    const [formValidation, setFormValidation] = useState({});

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    React.useEffect(()=>{
        if(partyClassificationId){
            getData()
        }
    },[partyClassificationId])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/CertificationStepsTabFieldsData?partyClassificationId=${partyClassificationId}` , axiosKey).then((info)=>{
            console.log("info" , info.data);
            setFieldsInfo(info.data?.listsData)
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
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/CertificationSteps?partyClassificationId=${partyClassificationId}` , axiosKey).then((tableList)=>{
            console.log("tableList" , tableList.data);
            setTableContent(tableList.data?.result)
            setLoading(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }
    console.log("fieldsInfo?.positions?.position" , fieldsInfo?.positions);
    const tableCols = [{
        name: "sequence",
        label: "ترتیب",
        type: "number",
        required: true ,
        style : {width : "10%"}
    },{
        name: "workedFactorTypeId",
        label: "عامل کاری",
        type: "select",
        options : fieldsInfo?.workedFactorType ,
        optionLabelField :"title",
        optionIdField:"workedFactorTypeId",
        required: true,
        style : {width : "25%"}
    },{
        name: "emplPositionId",
        label: "پست سازمانی",
        type: "select",
        options : fieldsInfo?.positions ,
        optionLabelField :"description",
        optionIdField:"emplPositionId",
        style : {width : "25%"}
    },{
        name: "actionEnumId",
        label: "دسترسی",
        type: "multiselect",
        options : fieldsInfo?.enums ,
        style : {width : "40%"}
    }]

    const handlerRemove = (rowData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/CertificationSteps?calenderPartyClassificationId=${rowData?.calenderPartyClassificationId}&workedFactorTypeId=${rowData?.workedFactorTypeId}&verificationId=${rowData?.verificationId}&levelId=${rowData?.levelId}`, axiosKey).then((info)=>{
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
                    title='مراحل تایید'
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    removeCallback={handlerRemove}
                    add="external"
                    addForm={<Form setLoading={setLoading} fieldsInfo={fieldsInfo} partyClassificationId={partyClassificationId} tableContent={tableContent}/>}
                    edit="external"
                    editForm={<Form setLoading={setLoading} editing={true} fieldsInfo={fieldsInfo} partyClassificationId={partyClassificationId} tableContent={tableContent}/>}

                />
            </CardContent>
        </Card>
    )
}

function Form ({editing=false,...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, fieldsInfo, partyClassificationId, tableContent} = restProps;

    const [formValidation, setFormValidation] = React.useState({});
    const [waiting, set_waiting] = useState(false) 

    const [init, setInit] = useState(false) 

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    useEffect(()=>{
        if(editing){
            setInit(true)
        }
    },[editing])

    const formStructure = [{
        name: "sequence",
        label: "ترتیب",
        type: "number",
        validator: values=>{
            var ind 
            editing ? ind = tableContent.findIndex(i=>i.sequence == values.sequence && i?.levelId !== values?.levelId && i?.workedFactorTypeId !== values?.workedFactorTypeId) :
            ind = tableContent.findIndex(i=>i.sequence == values.sequence && i?.workedFactorTypeId === values?.workedFactorTypeId) 
            return new Promise(resolve => {
                if(ind > -1){
                    resolve ({error: true, helper: "ترتیب وارد شده تکراری است ."})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        required : true,
        col     : 3
    },{
        name: "workedFactorTypeId",
        label: "عامل کاری",
        type: "select",
        options : fieldsInfo?.workedFactorType ,
        optionLabelField :"title",
        optionIdField:"workedFactorTypeId",
        required: true,
        col     : 3
    },{
        name: "emplPositionId",
        label: "پست سازمانی",
        type: "select",
        options : fieldsInfo?.positions ,
        optionLabelField :"description",
        optionIdField:"emplPositionId",
        col     : 3
    },{
        name: "actionEnumId",
        label: "دسترسی",
        type: "multiselect",
        options : fieldsInfo?.enums ,
        col     : 3 ,
    }]

    React.useEffect(()=>{
        if(formValues?.sequence !== undefined && formValues?.sequence !== "" && init){
            formValues.sequence = formValues?.sequence?.replace(/[^0-9]/gi, "") ;
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.sequence])

    const handleEdit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.put(`${SERVER_URL}/rest/s1/functionalManagement/CertificationSteps` , {data : formValues} , axiosKey).then((info)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            set_waiting(false)
            resetCallback()
        }).catch(()=>{
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
        })
    }

    const handleSubmit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.post(`${SERVER_URL}/rest/s1/functionalManagement/CertificationSteps` , {data : {...formValues , calenderPartyClassificationId : partyClassificationId}} , axiosKey).then((info)=>{
            setLoading(true)
            set_waiting(false)
            resetCallback()
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
        }).catch(()=>{
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
        })
    }

    const resetCallback = () => {
        setFormValues({})
        handleClose()
        set_waiting(false)
        setInit(false)
    }

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

