import React, { useState, useEffect } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import ActionBox from 'app/main/components/ActionBox';
import axios from 'axios';
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import {useSelector , useDispatch} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormPro from "app/main/components/formControls/FormPro";


const WorkingFactorEquivalent = (props) => {

    const {attendanceDeviceId} = props

    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const dispatch = useDispatch();
    
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols =[{
        name: "workedFactorTypeId",
        label: "عامل کاری",
        type: "select",
        options: fieldsInfo?.workingFactor ,
        optionLabelField :"title",
        optionIdField:"workedFactorTypeId",
        required: true,
    },{
        name: "equivalent",
        label: "معادل در دستگاه",
        type: "text",
        required: true
    }]

    
    useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/WorkingFactors`, axiosKey).then((info)=>{
            fieldsInfo.workingFactor = info.data?.list.filter(o => ((o.typeEnumId == "WFTMainNonShift") || (o.typeEnumId == "WFTMainShift") || (o.typeEnumId == "WFTVacation") || (o.typeEnumId == "WFTMain")) && o?.statusId == "Y")
            setFieldsInfo(Object.assign({},fieldsInfo))
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    useEffect(()=>{
        if(loading){
            getTableData()
        }
    },[loading])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/WorkingFactorEquivalent?attendanceDeviceId=${attendanceDeviceId}`, axiosKey).then((info)=>{
            setTableContent(info.data?.workingFactorEquivalentList)
            setLoading(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const handleRemove = (rowData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/WorkingFactorEquivalent?attendanceDeviceId=${rowData?.attendanceDeviceId}&workedFactorTypeId=${rowData?.workedFactorTypeId}` , axiosKey).then((response)=>{
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
                    title="لیست معادل عامل کاری در سیستم کنترل کارکرد"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    add="external"
                    addForm={<Form setLoading={setLoading} fieldsInfo={fieldsInfo} attendanceDeviceId={attendanceDeviceId}/>}
                    edit="external"
                    editForm={<Form setLoading={setLoading} editing={true} fieldsInfo={fieldsInfo} attendanceDeviceId={attendanceDeviceId}/>}
                    removeCallback={handleRemove}
                />
            </CardContent>
        </Card>
    );
};

export default WorkingFactorEquivalent;

function Form ({editing=false, ...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, fieldsInfo, attendanceDeviceId} = restProps;

    const [formValidation, setFormValidation] = useState({});  

    const [waiting, set_waiting] = useState(false)  

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name: "workedFactorTypeId",
        label: "عامل کاری",
        type: "select",
        options: fieldsInfo?.workingFactor ,
        optionLabelField :"title",
        optionIdField:"workedFactorTypeId",
        required: true,
        readOnly : editing
    },{
        name: "equivalent",
        label: "معادل در دستگاه",
        type: "text",
        required: true
    }]
    
    const handleSubmit = () => { 
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.post(`${SERVER_URL}/rest/s1/functionalManagement/WorkingFactorEquivalent` , {data : {...formValues , attendanceDeviceId : attendanceDeviceId }} , axiosKey).then((info)=>{
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
        axios.put(`${SERVER_URL}/rest/s1/functionalManagement/WorkingFactorEquivalent` , {data : formValues } , axiosKey).then((info)=>{
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
            submitCallback={()=> editing ? handleEdit() : handleSubmit()}
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
