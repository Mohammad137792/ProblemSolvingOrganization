import React, { useState, useEffect } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import axios from 'axios';
import { SERVER_URL } from './../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import {useSelector , useDispatch} from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import TabPro from "app/main/components/TabPro";
import Cards from "./tabs/Cards"
import WorkingFactorEquivalent from "./tabs/WorkingFactorEquivalent"

const formDefaultValues = {
    statusId : "Y"
}

const ExForm = (props) => {

    const {loading, setLoading, editing, setEditing, fieldsInfo, formValues, setFormValues, attendanceDeviceId, setattendanceDeviceId, rowInfo, setRowInfo,tableContent} = props

    const [formValidation, setFormValidation] = useState({});

    const [waiting, set_waiting] = useState(false)  

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure =[{
        name: "code",
        label: " کد سیستم",
        type: "text",
        required: true
    },{
        name: "title",
        label: " عنوان سیستم",
        type: "text",
        required: true
    },{
        name: "statusId",
        label: " وضعیت ",
        type: "indicator",
    },{
        name: "attendanceDeviceTypeEnumId",
        label: " نوع سیستم ",
        type: "select",
        options:fieldsInfo?.AttendenceDeviceType ,
        required: true
    },{
        name: "attendanceDeviceModelEnumId",
        label: "مدل دستگاه",
        type: "select",
        options:fieldsInfo?.AttendenceDeviceModel,
        required: formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf",
        display : formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf"
    },{
        name: "username",
        label: " نام کاربری ",
        type: "text",
        validator: values => {
            const username = values.username;
            return new Promise((resolve, reject) => {
                if(formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf"){
                    if( /[^a-z0-9]/i.test(username) || username.length>30 || username.length<6 ){
                        resolve({error: true, helper: "نام کاربری باید بین 6 تا 30 کاراکتر و فقط شامل اعداد و حروف لاتین باشد!"})
                    }
                    if (rowInfo?.username !== username ){
                        axios.get(SERVER_URL + `/rest/s1/fadak/entity/UserAccount?username=${username}`, {
                            headers: {'api_key': localStorage.getItem('api_key')},
                        }).then(res => {
                            if(res.data.result.length>0){
                                resolve({error: true, helper: "این نام کاربری تکراری است."})
                            }
                            resolve({error: false, helper: ""})
                        }).catch(err => {
                            console.log('get username error..', err);
                            reject({error: true, helper: ""})
                        })
                    }else{
                        resolve({error: false, helper: ""})
                    }
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        required: formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf" ,
        display : formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf"
    },{
        name: "currentPassword",
        label: "  کلمه عبور",
        type: "password",
        autoComplete: "new-password",
        validator: values => {
            const rule = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s)(?=.{8,})";//"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"; //.{8,15}$
            const password = values.currentPassword;
            const message = "کلمه عبور باید حداقل 8 کاراکتر و شامل حروف کوچک و بزرگ لاتین، اعداد و علائم ویژه باشد!";
            return new Promise(resolve => {
                if(formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf"){
                    if(password.match(rule)){
                        resolve({error: false, helper: ""})
                    }else{
                        resolve({error: true, helper: message})
                    }
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        required: formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf" ,
        display : formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf"
    },{
        name: "passwordVerify",
        label: " تکرار کلمه عبور ",
        type: "password",
        validator: values => {
            const password = values.currentPassword;
            const passwordVerify = values.passwordVerify;
            const message = "تکرار کلمه عبور صحیح نیست!"
            return new Promise(resolve => {
                if(formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf"){
                    if(passwordVerify===password){
                        resolve({error: false, helper: ""})
                    }else{
                        resolve({error: true, helper: message})
                    }
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        required: formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf" ,
        display : formValues?.attendanceDeviceTypeEnumId !== undefined && fieldsInfo?.AttendenceDeviceType.find(o => o.enumId === formValues?.attendanceDeviceTypeEnumId)?.parentEnumId === "ADTConf"
    },]

    React.useEffect(()=>{
        if(formValues?.code && formValues?.code != ""){
            formValues.code = formValues?.code.replace(/[^A-Za-z0-9]/gi, "") ;
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.code])

    React.useEffect(()=>{
        if(rowInfo?.attendanceDeviceTypeEnumId !== formValues?.attendanceDeviceTypeEnumId){
            formValues.attendanceDeviceModelEnumId = ""
            formValues.username = ""
            formValues.currentPassword = ""
            formValues.passwordVerify = ""
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.attendanceDeviceTypeEnumId])

    const handleSubmit = () => { 
        let codeExist = tableContent.find(x=>x.code == formValues.code)
        if(codeExist){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'کد سیستم تکراری است!'));
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            axios.post(`${SERVER_URL}/rest/s1/functionalManagement/Devices` , {data : {...formValues , statusId : formValues?.statusId == "Y" ? "ADSActive" : "ADSNotActive" }} , axiosKey).then((info)=>{
                setattendanceDeviceId(info?.data?.response?.attendanceDeviceId)
                setLoading(true)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                set_waiting(false)
                setEditing(true)
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                set_waiting(false)
            });
        }
    }

    const handleEdit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.put(`${SERVER_URL}/rest/s1/functionalManagement/Devices` , {data : {...formValues , statusId : formValues?.statusId == "Y" ? "ADSActive" : "ADSNotActive"} } , axiosKey).then((info)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            handleReset()
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            set_waiting(false)
        });
    }

    const handleReset = () => { 
        set_waiting(false)
        setFormValues(formDefaultValues)
        setEditing(false)
        setattendanceDeviceId("")
    }
    
    return (
        <FormPro
            append={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formDefaultValues={formDefaultValues}
            formValidation={formValidation} setFormValidation={setFormValidation}
            actionBox={<ActionBox>
                <Button type="submit" role="primary" 
                                disabled={waiting}
                                endIcon={waiting?<CircularProgress size={20}/>:null}
                >{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
            submitCallback={editing ? handleEdit : handleSubmit }
            resetCallback={handleReset}
        />
    )
}

export default function DevicesForm() {

    const [formValues, setFormValues] = useState(formDefaultValues)

    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)

    const [editing, setEditing] = useState(false)  

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const [attendanceDeviceId, setattendanceDeviceId] = useState("")

    const [rowInfo, setRowInfo] = useState ({})

    const dispatch = useDispatch();
    
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [{
        name: "code",
        label: "کد سیستم",
        type: "text",
    },{
        name: "title",
        label: "نام سیستم",
        type: "text",
    },{
        name: "attendanceDeviceTypeEnumId",
        label: "نوع سیستم",
        type: "select",
        options:fieldsInfo?.AttendenceDeviceType ,
    },{
        name: "statusId",
        label: "وضعیت",
        type: "indicator",
    }]

    useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=AttendenceDeviceType,AttendenceDeviceModel`, axiosKey).then((info)=>{
            setFieldsInfo({...info.data?.enums , AttendenceDeviceType : info.data?.enums?.AttendenceDeviceType.filter(o => o.parentEnumId && o.parentEnumId !== null) })
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
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/Devices`, axiosKey).then((info)=>{
            console.log("info" , info.data);
            setTableContent(info.data?.diviceList)
            setLoading(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const handleEdit = (rowData) => { 
        setFormValues(rowData)
        setEditing(true)
        setattendanceDeviceId(rowData?.attendanceDeviceId)
        setRowInfo(rowData)
    }

    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/Devices?attendanceDeviceId=${oldData.attendanceDeviceId}`, axiosKey).then(()=>{
                resolve()
            }).catch(()=>{
                reject("امکان حذف این ردیف وجود ندارد !")
            })
        })
     }

    const tabs = [{
        label: "معادل عامل کاری در سیستم",
        panel: <WorkingFactorEquivalent attendanceDeviceId={attendanceDeviceId}/>
    },{
        label: "کارت های سیستم",
        panel: <Cards attendanceDeviceId={attendanceDeviceId}/>
    }]

    return (
        <FusePageSimple
            header={<CardHeader title={'سیستم کنترل کارکرد'} />}
            content={
                <Box p={2}>
                    <Card>

                        <CardContent>
                            <ExForm loading={loading} setLoading={setLoading} editing={editing} setEditing={setEditing} fieldsInfo={fieldsInfo}
                            formValues={formValues} setFormValues={setFormValues} attendanceDeviceId={attendanceDeviceId} setattendanceDeviceId={setattendanceDeviceId}
                            rowInfo={rowInfo} setRowInfo={setRowInfo} tableContent={tableContent}/>
                        </CardContent>
                    </Card>
                    {(attendanceDeviceId && attendanceDeviceId !== "") ?
                        <div>
                            <Box m={1} />
                            <TabPro tabs={tabs} />
                        </div>
                    :""}
                    <Box m={2} />
                    <Card>

                        <CardContent>
                            <TablePro
                                title="سیستم کنترل کارکرد"
                                columns={tableCols}
                                rows={tableContent}
                                setRows={setTableContent}
                                loading={loading}
                                edit="callback"
                                editCallback={handleEdit}
                                delete="inline"
                                removeCallback={handleRemove}
                                exportCsv="خروجی اکسل"
                                filter="external"
                                filterForm={<FilterForm fieldsInfo={fieldsInfo} tableContent={tableContent} setTableContent={setTableContent} setLoading={setLoading}/>}

                            />
                        </CardContent>
                    </Card>
                </Box>
            }
        />
    )
}

function FilterForm (props) {

    const {setLoading, fieldsInfo, handleClose, tableContent, setTableContent} = props

    const [formValues, setFormValues] = useState({})

    const [waiting, set_waiting] = useState(false)  

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure =[{
        name: "code",
        label: " کد سیستم",
        type: "text",
    },{
        name: "title",
        label: " عنوان سیستم",
        type: "text",
    },{
        name: "statusId",
        label: " وضعیت ",
        type: "indicator",
    },{
        name: "attendanceDeviceTypeEnumId",
        label: " نوع سیستم ",
        type: "select",
        options:fieldsInfo?.AttendenceDeviceType ,
    }]

    const search = () => {
        axios.post(`${SERVER_URL}/rest/s1/functionalManagement/FilterDevices` , {data : formValues} , axiosKey).then((info)=>{
            setTableContent(info.data?.diviceList)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const handleReset = () => {
        setFormValues({})
        setLoading(true)
        set_waiting(false)
    }

    return (
        <FormPro
            append={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formDefaultValues={formDefaultValues}
            actionBox={<ActionBox>
                <Button type="submit" role="primary" 
                                disabled={waiting}
                                endIcon={waiting?<CircularProgress size={20}/>:null}
                >جستجو</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
            submitCallback={search}
            resetCallback={handleReset}
        />
    )
}