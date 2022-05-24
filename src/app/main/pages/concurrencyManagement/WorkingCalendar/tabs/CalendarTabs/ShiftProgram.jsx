import React, { useState, useEffect } from 'react'
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



export default function ShiftProgram(props) {

    const {companyPartyId, partyClassificationId} = props

    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState([])
    
    const [rotateTableContent, setRotateTableContent] = useState([])
    const [rotateLoading, setRotateLoading] = useState(false)

    const [fieldsInfo,setFieldsInfo] = useState ()

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/fadak/getEnums?enumTypeList=CalendarShiftType,WeekDay,MonthWeek,YearMonths`, axiosKey).then((enumsInfo)=>{
            axios.get(`${SERVER_URL}/rest/s1/functionalManagement/shift`, axiosKey).then((shift)=>{
                console.log("shift?.data?.list" , shift?.data?.list);
                setFieldsInfo({...enumsInfo.data?.enums , CalendarShiftType : enumsInfo.data?.enums?.CalendarShiftType?.filter(o => o?.enumId !== "CShTRotat") , shiftList : shift?.data?.list.filter(o => o?.companyPartyId === companyPartyId && o?.statusId === "Y")})
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
            });
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    useEffect(()=>{
        if(loading && partyClassificationId && fieldsInfo){
            getTableData()
        }
    },[loading,partyClassificationId,fieldsInfo])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/ShiftPlanning?partyClassificationId=${partyClassificationId}`, axiosKey).then((info)=>{
            setTableContent(info.data?.tableList?.list)
            setRotateTableContent(info?.data?.tableList?.detailRotateShift)
            setLoading(false)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    const tableCols = [{
        name: "title",
        label: "عنوان برنامه",
        type: "text",
    },{
        name: "typeEnumId",
        label: "نوع برنامه",
        type: "select",
        options: fieldsInfo?.CalendarShiftType,
    },{
        name: "priority",
        label: "اولویت",
        type: "number",
    }]

    const handlerRemove = (rowData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/ShiftPlanning?calendarShiftId=${rowData?.calendarShiftId}&type=${rowData?.typeEnumId}` , axiosKey).then((response)=>{
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
                    title="لیست برنامه های کاری"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    add="external"
                    addForm={<Form setLoading={setLoading} fieldsInfo={fieldsInfo} partyClassificationId={partyClassificationId} tableContent={tableContent}
                    rotateTableContent={rotateTableContent} setRotateTableContent={setRotateTableContent} rotateLoading={rotateLoading} setRotateLoading={setRotateLoading}/>}
                    edit="external"
                    editForm={<Form setLoading={setLoading} editing={true} fieldsInfo={fieldsInfo} partyClassificationId={partyClassificationId} tableContent={tableContent}
                    rotateTableContent={rotateTableContent} setRotateTableContent={setRotateTableContent} rotateLoading={rotateLoading} setRotateLoading={setRotateLoading}/>}
                    removeCallback={handlerRemove}
                />
            </CardContent>
        </Card>
    )
}

function RotateTable (props) {

    const {rotateTableContent, setRotateTableContent, rotateLoading, setRotateLoading, fieldsInfo} = props

    const tableCols = [{
        name: "seq",
        label: "ترتیب",
        type: "number",
    },{
        name: "shiftWorkId",
        label: "شیفیت کاری ",
        type: "select",
        options: fieldsInfo?.shiftList,
        optionLabelField :"title",
        optionIdField:"shiftWorkId",
    }]

    const handlerRemove = () => {

    }

    const handleAdd = (newData) => {
        return new Promise((resolve, reject) => {
            resolve(newData)
        })
    }

    return(
        <TablePro
            title="چرخشی"
            columns={tableCols}
            rows={rotateTableContent}
            setRows={setRotateTableContent}
            loading={rotateLoading}
            add="inline"
            addCallback={handleAdd}
            removeCallback={handlerRemove}

        />
    )
}

function Form ({editing=false, ...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, fieldsInfo, partyClassificationId, tableContent,
    rotateTableContent, setRotateTableContent, rotateLoading, setRotateLoading} = restProps;

    const [formValidation, setFormValidation] = useState({});  

    const [waiting, set_waiting] = useState(false)  

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name: "title",
        label: " عنوان برنامه ",
        type: "text",
        required : true
    },{
        name: "priority",
        label: " اولویت برنامه",
        type: "number",
        validator: values => {
            var ind 
            editing ?  ind = tableContent.findIndex(i=>i.priority===values.priority && i?.calendarShiftId !== values?.calendarShiftId) : 
            ind = tableContent.findIndex(i=>i.priority == values.priority ) 
            return new Promise((resolve, reject) => {
                if(ind>-1 && !editing){
                    resolve({error: true, helper: "اولویت وارد شده تکراری می باشد !"})
                }
                else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        required : true
    },{
        name: "typeEnumId",
        label: "نوع برنامه",
        type: "select",
        options: fieldsInfo?.CalendarShiftType,
        readOnly: editing ,
        required : true
    },{
        name: "shiftWorkId",
        label: "شیفت کاری",
        type: "select",
        type: "select",
        options: fieldsInfo?.shiftList,
        optionLabelField :"title",
        optionIdField:"shiftWorkId",
        display: formValues?.typeEnumId !== "CShTRotat" && formValues.typeEnumId !== undefined  && formValues?.typeEnumId !== null ,
        required : formValues?.typeEnumId !== "CShTRotat" && formValues.typeEnumId !== undefined  && formValues?.typeEnumId !== null
    },{
        name: "date",
        label: "تاریخ",
        type: "date",
        display: formValues?.typeEnumId == "CShTDay",
        required : formValues?.typeEnumId == "CShTDay"
    },{
        name: "fromDate",
        label: "تاریخ شروع",
        type: "date",
        display: formValues?.typeEnumId == "CShTRotat" ,
        required : formValues?.typeEnumId == "CShTRotat"
    },{
        name: "repetNum",
        label: "تعداد تکرار",
        type: "number",
        display: formValues?.typeEnumId == "CShTRotat" ,
        required : formValues?.typeEnumId == "CShTRotat"
    },{
        type: "component",
        component : <RotateTable fieldsInfo={fieldsInfo} rotateTableContent={rotateTableContent} setRotateTableContent={setRotateTableContent}
        rotateLoading={rotateLoading} setRotateLoading={setRotateLoading}/> ,
        display: formValues?.typeEnumId == "CShTRotat" ,
        required : formValues?.typeEnumId == "CShTRotat" ,
        col : 12 
    },{
        name: "year",
        label: "سال",
        type: "number",
        validator: values => {
            return new Promise((resolve, reject) => {
                if(values?.year && values?.year?.toString()?.length != 4 && values?.year !== undefined && values?.year !== ""){
                    resolve({error: true, helper: "سال وارد شده نامعتبر است !"})
                }
                else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        display: (formValues?.typeEnumId !== "CShTRotat") && formValues.typeEnumId !== undefined && (formValues?.typeEnumId !== null) && (formValues?.typeEnumId !== "CShTDay") ,
    },{
        name: "weekDayEnumId",
        label: "روز هفته",
        type: "select",
        options: fieldsInfo?.WeekDay.sort((a, b) => {
            return a.sequenceNum - b.sequenceNum;
          }),
        display: formValues?.typeEnumId == "CShTWeek" || formValues?.typeEnumId == "CShTDayWeekMonth" ,
        required : formValues?.typeEnumId == "CShTWeek" || formValues?.typeEnumId == "CShTDayWeekMonth"
    },{
        name: "weekMonthEnumId",
        label: "هفته ماه",
        type: "select",
        options: fieldsInfo?.MonthWeek.sort((a, b) => {
            return a.sequenceNum - b.sequenceNum;
          }),
        display: formValues?.typeEnumId == "CShTDayWeekMonth" ||  formValues?.typeEnumId == "CShTWeekMonth" ,
        required : formValues?.typeEnumId == "CShTDayWeekMonth" ||  formValues?.typeEnumId == "CShTWeekMonth"
    },{
        name: "monthEnumId",
        label: "ماه",
        type: "select",
        options: fieldsInfo?.YearMonths.sort((a, b) => {
            return a.sequenceNum - b.sequenceNum;
          }),
        display: formValues?.typeEnumId == "CShTDayWeekMonth" ||  formValues?.typeEnumId == "CShTMonthDay" ||  formValues?.typeEnumId == "CShTWeekMonth" ||  formValues?.typeEnumId == "CShTMonth" ,
        required : formValues?.typeEnumId == "CShTDayWeekMonth" ||  formValues?.typeEnumId == "CShTMonthDay" ||  formValues?.typeEnumId == "CShTWeekMonth" ||  formValues?.typeEnumId == "CShTMonth"
    },{
        name: "monthDay",
        label: "روز ماه",
        type: "number",
        display: formValues?.typeEnumId == "CShTMonthDay" ,
        validator: values => {
            return new Promise((resolve, reject) => {
                if(values?.monthDay ==0 || ((values?.monthEnumId == "YeMon01" || values?.monthEnumId == "YeMon02" || values?.monthEnumId == "YeMon03" || values?.monthEnumId == "YeMon04" || values?.monthEnumId == "YeMon05" || values?.monthEnumId == "YeMon06") ? (values?.monthDay > 31) : (values?.monthDay > 30)) ){
                    resolve({error: true, helper: "روز ماه وارد شده نامعتبر است !"})
                }
                else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        required : formValues?.typeEnumId == "CShTMonthDay"
    }]
    
    const handleSubmit = () => { 
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.post(`${SERVER_URL}/rest/s1/functionalManagement/ShiftPlanning` , {data : {...formValues , calenderPartyClassificationId : partyClassificationId , rotateTableContent : rotateTableContent}} , axiosKey).then((info)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
            handleReset()
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
        });
    }

    const handleEdit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
        set_waiting(true)
        axios.put(`${SERVER_URL}/rest/s1/functionalManagement/ShiftPlanning` , {data : formValues } , axiosKey).then((info)=>{
            setLoading(true)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
            handleReset()
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
        });
    }

    const handleReset = () => {
        setFormValues({})
        set_waiting(false)
        handleClose()
     }
     console.log("fieldsInfo" , fieldsInfo);
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
