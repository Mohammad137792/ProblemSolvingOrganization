import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, InputAdornment, TextField } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import TabPro from "app/main/components/TabPro";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from './../../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import {useSelector , useDispatch} from "react-redux";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { makeStyles } from "@material-ui/core/styles";

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

export default function Restrictions(props) {

    const {partyClassificationId} = props

    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)

    const [fieldsInfo,setFieldsInfo] = useState ({})

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const tableCols = [{
        name: "title",
        label: " عنوان محدودیت ",
        type: "text",
    },{
        name: "workedFactorTypeId",
        label: " عامل کاری",
        type: "select",
        options: fieldsInfo?.workingFactor ,
        optionLabelField :"title",
        optionIdField:"workedFactorTypeId",
    },{
        name: "timePeriodeTypeId",
        label: "نوع دوره زمانی  ",
        type: "select",
        options: fieldsInfo?.timePeriodType ,
        optionLabelField :"description",
        optionIdField:"timePeriodTypeId",
    },{
        name: "years",
        label: "سال",
        type: "number",
    }]

    useEffect(()=>{
        getInintialData()
    },[])

    const getInintialData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/RestrictionsTabFieldsData`, axiosKey).then((info)=>{
            setFieldsInfo(info.data?.listsData)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    useEffect(()=>{
        if(loading && partyClassificationId){
            getTableData()
        }
    },[loading,partyClassificationId])

    const getTableData = () => {
        axios.get(`${SERVER_URL}/rest/s1/functionalManagement/Restrictions?partyClassificationId=${partyClassificationId}`, axiosKey).then((info)=>{
            setTableContent(info.data.tableList)
            setLoading(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.WARNING , "مشکلی در دریافت اطلاعات رخ داده است."));
        })
    }

    const handleRemove = (rowData) => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/functionalManagement/Restrictions?limitId=${rowData?.limitId}` , axiosKey).then((response)=>{
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
                    title="لیست محدودیت ها "
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    add="external"
                    addForm={<Form setLoading={setLoading} fieldsInfo={fieldsInfo} partyClassificationId={partyClassificationId} tableContent={tableContent} />}
                    edit="external"
                    editForm={<Form setLoading={setLoading} editing={true} fieldsInfo={fieldsInfo} partyClassificationId={partyClassificationId} tableContent={tableContent}/>}
                    removeCallback={handleRemove}

                />
            </CardContent>
        </Card>
    )
}

function Form ({editing=false, ...restProps}) {

    const {formValues, setFormValues, handleClose, setLoading, fieldsInfo, partyClassificationId, tableContent} = restProps;

    const [formValidation, setFormValidation] = useState({maximum : false});  

    const [inValid,setInValid] = useState({maximum : false})

    const [updateComponent,setUpdateComponent] = useState(false)

    const [waiting, set_waiting] = useState(false)  

    // const [display, setDisplay] = useState(true)  

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [{
        name: "title",
        label: "عنوان محدودیت",
        type: "text",
        required: true
    },{
        name: "workedFactorTypeId",
        label: "عامل کاری",
        type: "select",
        options: fieldsInfo?.workingFactor ,
        optionLabelField :"title",
        optionIdField:"workedFactorTypeId",
        required: true,
    },{
        name: "timePeriodeTypeId",
        label: "نوع دوره زمانی",
        type: "select",
        options: fieldsInfo?.timePeriodType ,
        optionLabelField :"description",
        optionIdField:"timePeriodTypeId",
        required: true,
    },{
        name: "years",
        label: "سال",
        type: "number",
        validator: values => {
            return new Promise((resolve, reject) => {
                var ind
                editing ? 
                ind = tableContent.findIndex(i=>i?.workedFactorTypeId === values?.workedFactorTypeId && i?.timePeriodeTypeId === values?.timePeriodeTypeId && i?.years?.toString() == values?.years && i?.limitId !== values?.limitId ) :
                ind = tableContent.findIndex(i=>i?.workedFactorTypeId === values?.workedFactorTypeId && i?.timePeriodeTypeId === values?.timePeriodeTypeId && i?.years?.toString() === values?.years ) 
                if(values?.years?.toString()?.length != 4 && values?.years !== undefined && values?.years !== ""){
                    resolve({error: true, helper: " سال وارد شده نامعتبر است!"})
                }else if(ind > -1){
                    resolve({error: true, helper: " به ازای عامل کاری و نوع دوره زمانی انتخاب شده سال نمی تواند تکراری باشد"})
                }else{
                    resolve({error: false, helper: ""})
                }
            })
        },
        col : 1
    },{
        name: "maximum",
        label: "میزان سقف",
        type: "number",
        required: true ,
        display : fieldsInfo?.workingFactor && fieldsInfo?.workingFactor.find(o => o.workedFactorTypeId == formValues?.workedFactorTypeId)?.parentEnumId !== "WFTHours" ,
        col : 2
    },{
        type: "component",
        component : <DurationField formValues={formValues} setFormValues={setFormValues} fieldName="maximum" label="میزان سقف" 
        required={true} formValidation={formValidation}  setFormValidation={setFormValidation} inValid={inValid} setInValid={setInValid} key={updateComponent} 
        display={fieldsInfo?.workingFactor && fieldsInfo?.workingFactor.find(o => o.workedFactorTypeId == formValues?.workedFactorTypeId)?.parentEnumId === "WFTHours"}/> ,
        display : fieldsInfo?.workingFactor && fieldsInfo?.workingFactor.find(o => o.workedFactorTypeId == formValues?.workedFactorTypeId)?.parentEnumId === "WFTHours" ,
        col : 2
    }]

    React.useEffect(()=>{
        if(formValues?.code && formValues?.code != ""){
            formValues.code = formValues?.code.replace(/[^A-Za-z0-9]/gi, "") ;
            setFormValues(Object.assign({},formValues))
        }
    },[formValues?.code])

    const convertNumberToTime = (number) => {
        let hours = Math.floor(number/60) 
        let minutes = number - ( 60 * hours )
        let ShowHours = hours>9 ? `${hours}` : `0${hours}`
        let showMinutes = minutes>9 ? `${minutes}` : `0${minutes}`
        return (`${ShowHours}:${showMinutes}`)
    }

    // React.useEffect(()=>{
    //     if(fieldsInfo?.workingFactor) {
    //         if(editing && fieldsInfo?.workingFactor && fieldsInfo?.workingFactor.find(o => o.workedFactorTypeId == formValues?.workedFactorTypeId)?.parentEnumId === "WFTHours"){
    //             console.log("formValues?.maximum" , formValues?.maximum);
    //             formValues.maximum = convertNumberToTime(formValues?.maximum) ;
    //             setFormValues(Object.assign({},formValues))
    //             setDisplay(true)
    //         }else{
    //             setDisplay(true)
    //         }
    //     }
    // },[editing,fieldsInfo])

    const convertTimeToNumber = (time) => {
        var hoursMinutes = time.split(/[.:]/);
        var Hour = parseInt(hoursMinutes[0], 10);
        var Minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return ((Hour*60)+Minutes)
    }

    const checkValidation = () => {
        return new Promise((resolve, reject) => {
            if(!formValues?.maximum || formValues?.maximum === "" ){
                formValidation.maximum = (!formValues?.maximum || formValues?.maximum.length !== 5) ? true : false
                setFormValidation(Object.assign({},formValidation))
                reject() 
            }else{
                resolve()
            }

        })
    }

    const handleSubmit = () => { 
        if(fieldsInfo?.workingFactor && fieldsInfo?.workingFactor.find(o => o.workedFactorTypeId == formValues?.workedFactorTypeId)?.parentEnumId === "WFTHours" ){
            checkValidation().then(()=>{
                if(inValid?.maximum){
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'اطلاعات وارد شده صحیح نمی باشد!'));
                    return 
                }else{
                    dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
                    set_waiting(true)
                    axios.post(`${SERVER_URL}/rest/s1/functionalManagement/Restrictions`, {data : {...formValues , calenderPartyClassificationId : partyClassificationId , maximum : convertTimeToNumber(formValues?.maximum) } } , axiosKey).then((info)=>{
                        setLoading(true)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                        handleReset()
                    }).catch(()=>{
                        set_waiting(false)
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
                    })
                }
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید تمام فیلدهای ضروری وارد شوند!'));
            })
        }else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            axios.post(`${SERVER_URL}/rest/s1/functionalManagement/Restrictions`, {data : {...formValues , calenderPartyClassificationId : partyClassificationId} } , axiosKey).then((info)=>{
                setLoading(true)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد'));
                handleReset()
            }).catch(()=>{
                set_waiting(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ارسال اطلاعات !'));
            })
        }
    }

    const handleEdit = () => {
        if(fieldsInfo?.workingFactor && fieldsInfo?.workingFactor.find(o => o.workedFactorTypeId == formValues?.workedFactorTypeId)?.parentEnumId === "WFTHours" ){
            checkValidation().then(()=>{
                if(inValid?.maximum){
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'اطلاعات وارد شده صحیح نمی باشد!'));
                    return 
                }else{
                    dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
                    set_waiting(true)
                    axios.put(`${SERVER_URL}/rest/s1/functionalManagement/Restrictions`, {data : {...formValues , maximum : convertTimeToNumber(formValues?.maximum)} } , axiosKey).then((info)=>{
                        setLoading(true)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
                        handleReset()
                    }).catch(()=>{
                        set_waiting(false)
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
                    })
                }
            }).catch(()=>{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'باید تمام فیلدهای ضروری وارد شوند!'));
            })
        }else{
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"در حال ارسال اطلاعات ..."));
            set_waiting(true)
            axios.put(`${SERVER_URL}/rest/s1/functionalManagement/Restrictions`, {data : formValues } , axiosKey).then((info)=>{
                setLoading(true)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'ویرایش اطلاعات با موفقیت انجام شد'));
                handleReset()
            }).catch(()=>{
                set_waiting(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'ویرایش اطلاعات موفقیت آمیز نبود ، لطفا مجدد تلاش کنید'));
            })
        }
    }

    const handleReset = () => {
        setUpdateComponent(true)
     }

    useEffect(()=>{
        if(updateComponent){
            setFormValues({})
            handleClose()
            set_waiting(false)
            setUpdateComponent(false)
        }
    },[updateComponent])
    
    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation} setFormValidation={setFormValidation}
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



function DurationField (props) {

    const classes = useStyles();
    const helperTestClasses = helperTextStyles();
    const cx = require("classnames");

    const {formValues, setFormValues, fieldName, formValidation, setFormValidation, inValid, setInValid, label, required, readOnly = false, key, disabled = false , display ,
         validationCallback=()=>{return new Promise((resolve, reject) => {resolve()})}} = props

    const handleOnChange = (e) => {
        setFormValidation(Object.assign({},formValidation,{[fieldName] : false}))
        setFormValues(Object.assign({},formValues,{[fieldName] : `${(e?.target?.value[0] && e?.target?.value[0] !== ":") ? e?.target?.value[0] : ""}
                                                                  ${(e?.target?.value[1] && e?.target?.value[1] !== ":") ? (e?.target?.value[1]+":") : ""}
                                                                  ${(e?.target?.value[3] && e?.target?.value[3] !== ":") ? e?.target?.value[3] : ""}
                                                                  ${(e?.target?.value[4] && e?.target?.value[4] !== ":") ? e?.target?.value[4] : ""}`}))
    } 

    React.useEffect(()=>{
        if(formValues[fieldName] && formValues[fieldName] != "" && display){
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