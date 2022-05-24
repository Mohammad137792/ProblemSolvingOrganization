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

const Cards = (props) => {

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
        name: "cardNumber",
        label: "شماره کارت",
        type: "number",
        required: true ,
        style : {width : "20%"},
        col : 3
    },{
        name: "partyRelationshipId",
        label: "پرسنل",
        type    : "select",
        options : fieldsInfo?.personnel ,
        optionLabelField :"fullName",
        // getOptionLabel: opt => `${opt.pseudoId} ─ ${opt.fullName}`,
        optionIdField:"partyRelationshipId",
        required: true ,
        style : {width : "35%"}
    },{
        name: "fromDate",
        label: "از تاریخ",
        type: "date",
        required: true ,
        style : {width : "20%"}
    },{
        name: "thruDate",
        label: "تا تاریخ",
        type: "date",
        style : {width : "25%"},
    }]

    
    useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.post(`${SERVER_URL}/rest/s1/fadak/searchUsers` , {data : {}} , axiosKey).then((info)=>{
            console.log("info" , info.data);
            fieldsInfo.personnel = info.data?.result
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
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/Cards?attendanceDeviceId=${attendanceDeviceId}`, axiosKey).then((info)=>{
            setTableContent(info.data?.cardsList)
            setLoading(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const handleRemove = (rowData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/Cards?cardId=${rowData?.cardId}` , axiosKey).then((response)=>{
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
                    addForm={<Form setLoading={setLoading} fieldsInfo={fieldsInfo} attendanceDeviceId={attendanceDeviceId} tableContent={tableContent}/>}
                    edit="external"
                    editForm={<Form setLoading={setLoading} editing={true} fieldsInfo={fieldsInfo} attendanceDeviceId={attendanceDeviceId}  tableContent={tableContent}/>}
                    removeCallback={handleRemove}
                />
            </CardContent>
        </Card>
    );
};

export default Cards;

function Form ({editing=false, ...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, fieldsInfo, attendanceDeviceId, tableContent} = restProps;

    const [formValidation, setFormValidation] = useState({});  

    const [waiting, set_waiting] = useState(false)  

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure =[{
        name: "cardNumber",
        label: "شماره کارت",
        required: true ,
        type: "number",
        col : 3
    },{
        name: "partyRelationshipId",
        label: "پرسنل",
        type    : "select",
        options : fieldsInfo?.personnel ,
        // optionLabelField :"fullName",
        getOptionLabel: opt => `${opt.pseudoId} ─ ${opt.fullName}`,
        optionIdField:"partyRelationshipId",
        required: true ,
    },{
        name: "fromDate",
        label: "از تاریخ",
        type: "date",
        required: true ,
    },{
        name: "thruDate",
        label: "تا تاریخ",
        type: "date",
        validator: values => {
            return new Promise(resolve => {
                if(values?.thruDate !== undefined && values?.thruDate !== null){
                    if(new Date (values?.thruDate) < new Date (values?.fromDate)){
                        resolve({error: true, helper: "تاریخ وارد شده نامعتبر است."})
                    }else{
                        resolve({error: false, helper: ""})
                    }
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
    }]

    const checkDates = () => {
        return new Promise((resolve, reject) => {
            let personnelCards = []
            if(editing){ personnelCards = tableContent.filter(o => o.partyRelationshipId == formValues?.partyRelationshipId && o.cardId !== formValues?.cardId)}
            if(!editing){ personnelCards = tableContent.filter(o => o.partyRelationshipId == formValues?.partyRelationshipId)}
            if(personnelCards.length > 0){
                let invalid = []
                personnelCards.map((item,index)=>{
                    const thruDate = item.thruDate ? new Date(item.thruDate) : new Date(2099,12,25)
                    const formThru = formValues.thruDate ? new Date(formValues.thruDate) : new Date(2099,12,25)
                    if( ((thruDate >= formThru) && (formThru >= new Date(item.fromDate))) || ((thruDate >= new Date(formValues.fromDate)) && (new Date(formValues.fromDate) >= new Date(item.fromDate)))){
                        invalid.push("invalid")
                    }
                    if(index === personnelCards.length-1){
                        if(invalid.length == 0){resolve()}
                        if(invalid.length > 0){reject()}
                    }
                })
            }else{
                resolve()
            }
        })
    }
    
    const handleSubmit = () => { 
        let cardNumberExist = tableContent.find(x=>x.cardNumber == formValues.cardNumber)
        if(cardNumberExist){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'شماره کارت وارد شده تکراری است.'));
        }
        else{
            checkDates().then(()=>{
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
                set_waiting(true)
                axios.post(`${SERVER_URL}/rest/s1/functionalManagement/Cards` , {data : {...formValues , attendanceDeviceId : attendanceDeviceId }} , axiosKey).then((info)=>{
                    setLoading(true)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                    handleReset()
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                    set_waiting(false)
                });
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'در بازه وارد شده ، پرسنل انتخابی دارای کارت فعال می باشد'));
            })
        }
    }

    const handleEdit = () => {
        checkDates().then(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            axios.put(`${SERVER_URL}/rest/s1/functionalManagement/Cards` , {data : formValues } , axiosKey).then((info)=>{
                setLoading(true)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
                handleReset()
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
                set_waiting(false)
            });
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'در بازه وارد شده ، پرسنل انتخابی دارای کارت فعال می باشد'));
        })
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