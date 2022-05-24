import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, InputAdornment, TextField } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import TabPro from "app/main/components/TabPro";
import Restrictions from './CalendarTabs/Restrictions';
import ShiftProgram from './CalendarTabs/ShiftProgram';
import CertificationSteps from './CalendarTabs/CertificationSteps';
import CalendarPersonnel from './CalendarTabs/CalendarPersonnel';
import { useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import {useSelector , useDispatch} from "react-redux";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";


const helperTextStyles = makeStyles(theme => ({
    root: {
        margin: 4,
        color: "red",
        borderWidth: "1px",
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& label span": {
            color: "red"
        }

    },
    error: {
        "&.MuiFormHelperText-root.Mui-error": {
            color: theme.palette.common.white
        },
    }
}));

const useStyles = makeStyles({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        },
        width: "100%",
        "& label span": {
            color: "red"
        }

    },
    NonDispaly: {
        display: "none"
    },
    formControl: {
        width: "100%",
        "& label span": {
            color: "red"
        }
    },
    enter: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "green"
        },
    }
});

const Exfilter = (props) => {

    const {setLoading, formStructure, setTableContent} = props;

    const [formValues, setFormValues] = useState({})

    const [waiting, set_waiting] = useState(false)  

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const search = () => {
        set_waiting(true)
        axios.post(`${SERVER_URL}/rest/s1/functionalManagement/WorkCalendarSearching` , {data : formValues } , axiosKey).then((search)=>{
            setTableContent(search.data?.result)
            set_waiting(false)
        }).catch(()=>{
            set_waiting(false)
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }
    
    const resetCallback = () => {
        setFormValues({})
        setLoading(true)
    }

    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={search}
            resetCallback={resetCallback}
            actionBox={<ActionBox>
                <Button type="submit" role="primary" 
                    disabled={waiting}
                    endIcon={waiting?<CircularProgress size={20}/>:null}
                >جستجو</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}


export default function Calendar() {

    const [formValues, setFormValues] = useState({statusId : "Y"})

    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const [formValidation, setFormValidation] = React.useState({allowFromTime : false , durationAllowTime : false , allowThruTime : false});

    const [inValid,setInValid] = useState({allowFromTime : false , durationAllowTime : false , allowThruTime : false})

    const [updateComponent,setUpdateComponent] = useState(false)

    const [editing, setEditing] = useState(false)

    const [partyClassificationId, setPartyClassificationId] = useState("")

    const [waiting, set_waiting] = useState(false)   

    const datas = useSelector(({ fadak }) => fadak);

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const convertTimeToNumber = (time) => {
        var hoursMinutes = time.split(/[.:]/);
        var Hour = parseInt(hoursMinutes[0], 10);
        var Minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return ((Hour*60)+Minutes)
    }

    const calculateThruTime = (fromTime,duration) => {
        var fromTimeHour = 0
        var fromTimeMinutes = 0
        var durationHour = 0
        var durationMinutes = 0
        if(fromTime && fromTime !== ""){
            var hoursMinutes = fromTime.split(/[.:]/);
            fromTimeHour = parseInt(hoursMinutes[0], 10);
            fromTimeMinutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        }
        if(duration && duration !== ""){
            var hoursMinutes = duration.split(/[.:]/);
            durationHour = parseInt(hoursMinutes[0], 10);
            durationMinutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        }
        var totalMinutes = durationMinutes + fromTimeMinutes
        var addedHour = totalMinutes > 59 ? 1 : 0 
        var totalHour = fromTimeHour + durationHour + addedHour
        var day = Math.floor(totalHour/24)
        var dayHour = totalHour - (24 * day)
        var dayMinutes = (totalMinutes % 60)
        if (day == 0){ return (`امروز ${dayMinutes} : ${dayHour}`)}
        if(day == 1){ return (`فردا ${dayMinutes} : ${dayHour}`)}
        if(day == 2){ return (`پس فردا ${dayMinutes} : ${dayHour}`)}
        if(day > 2){ return (` ${day} روز دیگر ${dayMinutes} : ${dayHour}`)}
    }

    const fromTimeValidationCallback = () => {
        return new Promise((resolve, reject) => {
            var hoursMinutes = "" 
            var hours = ""
            var minutes = ""
            if(formValues?.allowFromTime && formValues?.allowFromTime !== ""){
                hoursMinutes = formValues?.allowFromTime.split(/[.:]/);
                hours = parseInt(hoursMinutes[0], 10);
                minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
                if(hours > 23 || minutes > 59){
                    reject()
                }
                if(hours < 23 && minutes < 59){
                    resolve()
                }
            }
            if(!formValues?.allowFromTime || formValues?.allowFromTime === ""){
                resolve()
            }
        })
    }

    const formStructure = [{
        name: "standardCode",
        label: "کد نقویم ",
        type: "text",
        validator: values=>{
            var ind
            editing ? ind = tableContent.findIndex(i=>i.standardCode == values.standardCode && i?.partyClassificationId !== values?.partyClassificationId) : 
            ind = tableContent.findIndex(i=>i.standardCode == values.standardCode)
            return new Promise(resolve => {
                if(ind > -1){
                    resolve ({error: true, helper: "کد وارد شده تکراری است ."})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        required : true
    },{
        name: "description",
        label: "عنوان تقویم",
        type: "text",
        required : true
    },{
        name: "parentCalendar",
        label: "  تقویم بالاتر",
        type: "select",
        options: fieldsInfo?.parentCalendar ,
        optionLabelField :"description",
        optionIdField:"partyClassificationId",
        filterOptions: (options) => options.filter((o) => o["partyClassificationId"] !== formValues["partyClassificationId"])
    },{
        name: "responsibleEmplPositionId",
        label: "مسئول تقویم",
        type: "select",
        options: fieldsInfo?.responsibleEmplPositionId ,
        optionLabelField :"nameAndId",
        optionIdField:"emplPositionId",
    },{
        name: "incompleteTrafficEnumId",
        label: " تردد های ناقص",
        type: "select",
        options: fieldsInfo?.incompleteTrafficEnumId ,
        optionLabelField :"description",
        optionIdField:"enumId",
        col: 2
    },{
        name: "statusId",
        label: "وضعیت",
        type: "indicator",
        col: 1
    },{
        type: "component",
        component : <DurationField formValues={formValues} setFormValues={setFormValues} fieldName="allowFromTime" label="تردد مجاز از ساعت" validationCallback={fromTimeValidationCallback}
        required={true} formValidation={formValidation}  setFormValidation={setFormValidation} inValid={inValid} setInValid={setInValid} key={updateComponent}/> , 
        col: 2
    },{
        type: "component",
        component : <DurationField formValues={formValues} setFormValues={setFormValues} fieldName="durationAllowTime" label="مدت تردد" 
        required={true} formValidation={formValidation}  setFormValidation={setFormValidation} inValid={inValid} setInValid={setInValid} key={updateComponent}/> , 
        col: 2
    },{
        name: "allowThruTime",
        label: "تردد مجاز تا ساعت",
        type: "text",
        readOnly : true ,
        col : 2
    },{
        name: "workedFactorTypeId",
        label: "عامل های کاری مجاز برای درخواست",
        type: "multiselect",
        options: fieldsInfo?.agentsAllowedToApply ,
        optionLabelField :"title",
        optionIdField:"workedFactorTypeId",
    }]

    useEffect(()=>{
        if(loading){
            getTableData()
        }
    },[loading])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/WorkCalendar`, axiosKey).then((info)=>{
            setTableContent(info.data?.workCalendarList)
            setLoading(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    useEffect(()=>{
        if(loading){
            getInintialData()
        }
    },[loading])

    const getInintialData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/WorkCalendarFieldsData`, axiosKey).then((info)=>{
            setFieldsInfo(info.data?.listsData)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    React.useEffect(()=>{
        if(formValues?.standardCode && formValues?.standardCode != ""){
            formValues.standardCode = formValues?.standardCode.replace(/[^A-Za-z0-9]/gi, "") ;
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.standardCode])

    useEffect(()=>{
        if(formValues?.allowFromTime && formValues?.allowFromTime?.length == 5 && formValues?.durationAllowTime && formValues?.durationAllowTime?.length == 5) {
            formValues.allowThruTime = calculateThruTime(formValues?.allowFromTime,formValues?.durationAllowTime)
            setFormValues(Object.assign({},formValues))
            setUpdateComponent(!updateComponent)
        }
    },[formValues?.allowFromTime , formValues?.durationAllowTime])

    const checkValidation = () => {
        return new Promise((resolve, reject) => {
            if(!formValues?.allowFromTime || formValues?.allowFromTime === null || !formValues?.durationAllowTime || formValues?.durationAllowTime === null ){
                formValidation.allowFromTime = (!formValues?.allowFromTime || formValues?.allowFromTime.length !== 5) ? true : false
                formValidation.durationAllowTime = (!formValues?.durationAllowTime || formValues?.durationAllowTime.length !== 5) ? true : false
                setFormValidation(Object.assign({},formValidation))
                reject() 
            }else{
                resolve()
            }

        })
    }

    const handleSubmit = () => {
        checkValidation().then(()=>{
            if(inValid?.allowFromTime || inValid?.durationAllowTime ){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'اطلاعات وارد شده صحیح نمی باشد!'));
                return 
            }else{
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
                set_waiting(true)
                axios.post(`${SERVER_URL}/rest/s1/functionalManagement/WorkCalendar`, {data : {...formValues , durationAllowTime : convertTimeToNumber(formValues?.durationAllowTime)} } ,axiosKey).then((response)=>{
                    setPartyClassificationId(response.data?.response?.partyClassificationId)
                    setLoading(true)
                    set_waiting(false)
                    setEditing(true)
                    formValues.partyClassificationId = response.data?.response?.partyClassificationId
                    setFormValues(Object.assign({},formValues))
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                }).catch(()=>{
                    set_waiting(false)
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                })
            }
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید تمام فیلدهای ضروری وارد شوند!'));
        })
    }

    const putRequest = () => {
        checkValidation().then(()=>{
            if(inValid?.allowFromTime || inValid?.durationAllowTime ){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'اطلاعات وارد شده صحیح نمی باشد!'));
                return 
            }else{
                dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
                set_waiting(true)
                axios.put(`${SERVER_URL}/rest/s1/functionalManagement/WorkCalendar`, {data : {...formValues , durationAllowTime : convertTimeToNumber(formValues?.durationAllowTime)} } ,axiosKey).then((info)=>{
                    setLoading(true)
                    handleReset()
                    set_waiting(false)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
                }).catch(()=>{
                    set_waiting(false)
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
                })
            }
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید تمام فیلدهای ضروری وارد شوند!'));
        })
    }

    const handleReset = () => { 
        setUpdateComponent(!updateComponent)
        setFormValues({statusId : "Y" , allowFromTime : "" , durationAllowTime : ""})
        setEditing(false)
        setPartyClassificationId("")
    }

    const tabs = [{
        label: " محدودیت ",
        panel: <Restrictions partyClassificationId={partyClassificationId}/>
    },
    {
        label: "برنامه شیفت کاری ",
        panel: <ShiftProgram companyPartyId={fieldsInfo?.companyPartyId} partyClassificationId={partyClassificationId}/>
    },
    {
        label: " مراحل تایید ",
        panel: <CertificationSteps partyClassificationId={partyClassificationId}/>
    },
    {
        label: " پرسنل تقویم ",
        panel: <CalendarPersonnel partyClassificationId={partyClassificationId}/>
    },

    ]

    const tableCols = [
    {
        name: "standardCode",
        label: "کد تقویم",
        type: "text",
    },{
        name: "description",
        label: "عنوان تقویم",
        type: "text",
    },{
        name: "statusId",
        label: " فعال",
        type: "indicator",
    }]

    const removeHandler = (rowData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/WorkCalendar?partyClassificationId=${rowData?.partyClassificationId}` , axiosKey).then((response)=>{
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    }

    const handleEdit = (rowData) => {
        handleReset()
        setTimeout(() => {
            setFormValues(Object.assign({},rowData,{allowThruTime : calculateThruTime(rowData?.allowFromTime,rowData?.durationAllowTime)}))
        setUpdateComponent(!updateComponent)
        setEditing(true)
        setPartyClassificationId(rowData?.partyClassificationId)
        }, 1000);
        
    }

    return (
        <Card>
            <CardContent>
                <Card>
                    <CardContent>
                        <FormPro
                            prepend={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            formValidation={formValidation}
                            setFormValidation={setFormValidation}
                            actionBox={<ActionBox>
                                {checkPermis("functionalManagement/workCalendar/calendar/add", datas) ?
                                    <Button type="submit" role="primary" 
                                        disabled={waiting}
                                        endIcon={waiting?<CircularProgress size={20}/>:null}
                                    >{editing?"ویرایش":"افزودن"}</Button>
                                :""}
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}
                            submitCallback={()=> editing ? putRequest() : handleSubmit() }
                            resetCallback={handleReset}
                        />
                    </CardContent>
                </Card>
                {(partyClassificationId && partyClassificationId !== "") ?
                    <div>
                        <Box m={1} />
                        <TabPro tabs={tabs} />
                    </div>
                :""}
                <Box m={2} />
                <Card>
                    <CardContent>
                        <TablePro
                            exportCsv="خروجی اکسل"
                            title="لیست تقویم ها "
                            columns={tableCols}
                            rows={tableContent}
                            setRows={setTableContent}
                            loading={loading}
                            removeCondition={(row) =>
                                checkPermis("functionalManagement/workCalendar/calendar/delete", datas) 
                            }
                            removeCallback={removeHandler}
                            editCondition={(row) =>
                                checkPermis("functionalManagement/workCalendar/calendar/edit", datas) 
                            }
                            edit="callback"
                            editCallback={handleEdit}
                            filter="external"
                            filterForm={
                                <Exfilter formStructure={tableCols} setLoading={setLoading} setTableContent={setTableContent}/>
                            }

                        />
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}


function DurationField (props) {

    const classes = useStyles();
    const helperTestClasses = helperTextStyles();
    const cx = require("classnames");

    const {formValues, setFormValues, fieldName, formValidation, setFormValidation, inValid, setInValid, label, required, readOnly = false, key, disabled = false ,
         validationCallback=()=>{return new Promise((resolve, reject) => {resolve()})}} = props

    const handleOnChange = (e) => {
        setFormValidation(Object.assign({},formValidation,{[fieldName] : false}))
        setFormValues(Object.assign({},formValues,{[fieldName] : `${(e?.target?.value[0] && e?.target?.value[0] !== ":") ? e?.target?.value[0] : ""}
                                                                  ${(e?.target?.value[1] && e?.target?.value[1] !== ":") ? (e?.target?.value[1]+":") : ""}
                                                                  ${(e?.target?.value[3] && e?.target?.value[3] !== ":") ? e?.target?.value[3] : ""}
                                                                  ${(e?.target?.value[4] && e?.target?.value[4] !== ":") ? e?.target?.value[4] : ""}`}))
    } 

    React.useEffect(()=>{
        if(formValues[fieldName] && formValues[fieldName] != ""){
            formValues[fieldName] = formValues[fieldName].replace(/[^:0-9]/gi, "") ;
            setFormValues(Object.assign({},formValues))
        }
    },[formValues[fieldName]])

    const validation = () => {
        if(formValues[fieldName] !== "" && formValues[fieldName]){
            if(formValues[fieldName].length !==5){
                setInValid(Object.assign({},inValid,{[fieldName] : true}))
            }else{
                var minutes = 0
                var hoursMinutes = ""
                hoursMinutes = formValues[fieldName].split(/[.:]/);
                minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
                if(minutes > 59){
                    setInValid(Object.assign({},inValid,{[fieldName] : true}))
                }
                if(minutes < 59){
                    validationCallback().then(()=>{
                        setInValid(Object.assign({},inValid,{[fieldName] : false}))
                    }).catch(()=>{
                        setInValid(Object.assign({},inValid,{[fieldName] : true}))
                    })
                }
            }
        }
        if(formValues[fieldName] === "" || !formValues[fieldName]){
            setInValid(Object.assign({},inValid,{[fieldName] : false}))
        }
    }

    return (
        <TextField
            key={key}
            disabled={disabled}
            required={required}
            id="required"
            value={formValues[fieldName]}
            onChange={(e,newData)=>handleOnChange(e)}
            placeholder="__:__"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 5 }}
            // error={inValid[fieldName]|| formValidation[fieldName]}
            helperText={inValid[fieldName] ? "ساعت وارد شده معتبر نمي باشد ." : (formValidation[fieldName] == true) ? "تعیین این فیلد الزامی است!" : ""}
            onBlur={validation}
            label={label}
            className={cx(readOnly && "read-only", (inValid[fieldName]|| formValidation[fieldName]) ? classes.root : classes.formControl)}
            FormHelperTextProps={{ classes: helperTestClasses }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <AccessTimeIcon style={{ color: "#979797"}} />
                    </InputAdornment>
                )
            }}
        />

    )
}
