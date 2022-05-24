import React, {useEffect, useState} from "react";
import {Box, Button, CardContent, CardHeader} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "../../../../components/CheckPermision";

const formDefaultValues = {}
const primaryKey = "timePeriodId"
const defaultAction = {type: "add", payload: ""}

export default function TimePeriods({scrollTop}) {
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const [waiting, set_waiting] = useState(false)
    const [timePeriodTypes, set_timePeriodTypes] = useState([])
    const dataList = useListState(primaryKey)
    const timePeriods = dataList.list||[]
    const formStructure = [{
        name    : "periodNum",
        label   : "شماره دوره",
        type    : "number",
        required: true,
        // validator: values => new Promise((resolve) => {
        //     if( /[^a-z0-9]/i.test(values.code) ){
        //         resolve({error: true, helper: "شماره دوره فقط می تواند شامل اعداد و حروف لاتین باشد!"})
        //     }
        //     resolve({error: false, helper: ""})
        // })
    },{
        name    : "periodName",
        label   : "عنوان دوره زمانی",
        type    : "text",
        required: true,
    },{
        name    : "timePeriodTypeId",
        label   : "نوع دوره زمانی",
        type    : "select",
        options : timePeriodTypes,
        optionIdField   : "timePeriodTypeId",
        required: true,
        changeCallback  : () => set_formValues(prevState => ({
            ...prevState,
            parentPeriodId: null,
            previousPeriodId: null
        }))
    },{
        name    : "previousPeriodId",
        label   : "دوره قبل",
        type    : "select",
        options : timePeriods,
        optionIdField   : primaryKey,
        optionLabelField: "periodName",
        disabled: !formValues["timePeriodTypeId"],
        filterOptions   : options => options.filter(item=>item["timePeriodTypeId"]===formValues["timePeriodTypeId"] && item[primaryKey]!==formValues[primaryKey])
    },{
        name    : "parentPeriodId",
        label   : "دوره زمانی بالاتر",
        type    : "select",
        options : timePeriods,
        optionIdField   : primaryKey,
        optionLabelField: "periodName",
        disabled: !formValues["timePeriodTypeId"],
        filterOptions   : options => {
            const id = timePeriodTypes.find(i => i["timePeriodTypeId"] === formValues["timePeriodTypeId"])?.parentPeriodTypeId
            return options.filter(item => item["timePeriodTypeId"] === id)
        }
    },{
        name    : "fromDate",
        label   : "روز اول دوره",
        type    : "date",
        required: true,
    },{
        name    : "thruDate",
        label   : "روز آخر دوره",
        type    : "date",
        required: true,
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        col     : 12
    }]
    const tableColumns = [{
        name    : "periodNum",
        label   : "شماره دوره",
        type    : "number",
    },{
        name    : "periodName",
        label   : "عنوان دوره زمانی",
        type    : "text",
    },{
        name    : "timePeriodTypeId",
        label   : "نوع دوره زمانی",
        type    : "select",
        options : timePeriodTypes,
        optionIdField   : "timePeriodTypeId",
    },{
        name    : "previousPeriodId",
        label   : "دوره قبل",
        type    : "select",
        options : timePeriods,
        optionIdField   : primaryKey,
        optionLabelField: "periodName",
    },{
        name    : "parentPeriodId",
        label   : "دوره زمانی بالاتر",
        type    : "select",
        options : timePeriods,
        optionIdField   : primaryKey,
        optionLabelField: "periodName",
    },{
        name    : "fromDate",
        label   : "روز اول دوره",
        type    : "date",
    },{
        name    : "thruDate",
        label   : "روز آخر دوره",
        type    : "date",
    }]

    function get_dataList() {
        axios.get("/s1/payroll/timePeriodList").then(res => {
            dataList.set(res.data.timePeriodList)
        }).catch(() => {
            dataList.set([])
        });
    }
    function get_object(pk) {
        const object = dataList.list.find(i=>i[primaryKey]===pk)
        set_formValues(object);
    }
    function has_overlap() {
        const check_for_overlap = (fromDate1, thruDate1, fromDate2, thruDate2) => {
            let moment = require('moment-jalaali')
            if(typeof fromDate1 !== 'string'){
                fromDate1 = moment(fromDate1).format('YYYY-MM-DD')
                thruDate1 = moment(thruDate1).format('YYYY-MM-DD')
            }
            if(typeof fromDate2 !== 'string'){
                fromDate2 = moment(fromDate2).format('YYYY-MM-DD')
                thruDate2 = moment(thruDate2).format('YYYY-MM-DD')
            }
            return !((fromDate1 && thruDate2 && fromDate1>thruDate2) || (fromDate2 && thruDate1 && fromDate2>thruDate1))
        }
        const checkList = dataList.list.filter(item => item["timePeriodTypeId"]===formValues["timePeriodTypeId"] && item[primaryKey]!==formValues[primaryKey])
        for(let i in checkList) {
            const row = checkList[i]
            if(check_for_overlap(formValues.fromDate, formValues.thruDate, row.fromDate, row.thruDate)){
                set_formValidation({thruDate: {error: true, helper: ""}, fromDate: {error: true, helper: ""}})
                return true
            }
        }
        set_formValidation({thruDate: {error: false, helper: ""}, fromDate: {error: false, helper: ""}})
        return false
    }
    function is_dates_invalid() {
        let moment = require('moment-jalaali')
        let fromDate = formValues.fromDate
        let thruDate = formValues.thruDate
        if(!fromDate || !thruDate) {
            return false
        }
        if(typeof fromDate !== 'string'){
            fromDate = moment(fromDate).format('YYYY-MM-DD')
        }
        if(typeof thruDate !== 'string'){
            thruDate = moment(thruDate).format('YYYY-MM-DD')
        }
        const error = fromDate > thruDate
        if(error)
            set_formValidation({thruDate: {error: true, helper: ""}, fromDate: {error: true, helper: ""}})
        else
            set_formValidation({thruDate: {error: false, helper: ""}, fromDate: {error: false, helper: ""}})
        return error
    }
    function create_object() {
        axios.put("/s1/payroll/entity/timePeriod",formValues).then(res=>{
            dataList.add({
                ...formValues,
                ...res.data
            })
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "دوره زمانی جدید با موفقیت اضافه شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function update_object() {
        axios.put("/s1/payroll/entity/timePeriod",formValues).then(res=>{
            if(res.data.status === "OK") {
                dataList.update(formValues)
                set_action(defaultAction)
                set_formValues(formDefaultValues)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش دوره با موفقیت انجام شد."))
            } else if(res.data.status === "ERROR_LOOP") {
                set_formValidation({previousPeriodId: {error: true, helper: ""}})
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "دوره قبل انتخاب شده برای این دوره صحیح نیست!"))
            } else {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ویرایش اطلاعات!"))
            }
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function handle_submit() {
        if(dataList.list.findIndex(i => i["periodNum"]===formValues["periodNum"] && i[primaryKey]!==formValues[primaryKey] )>=0) {
            set_formValidation({
                periodNum: {error: true, helper: "شماره دوره تکراری است!"}
            })
            return false
        }
        if(is_dates_invalid()){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'محدوده تاریخ تعیین شده نادرست است!'));
            return
        }
        if(has_overlap()){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'محدوده تاریخ تعیین شده با دوره دیگری دارای همپوشانی است!'));
            return
        }
        set_waiting(true)
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        if(action.type==="add") {
            create_object()
        } else if(action.type==="edit") {
            update_object()
        }
    }
    function handle_cancel() {
        set_action({type: "add", payload: ""})
    }
    function handle_edit(row) {
        set_action({type: "edit", payload: row[primaryKey]})
    }
    function handle_remove(row) {
        set_action(defaultAction)
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/payroll/entity/timePeriod?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }

    useEffect(()=>{
        get_dataList()
        axios.get("/s1/payroll/entity/timePeriodType").then(res => {
            set_timePeriodTypes(res.data.timePeriodTypeList)
        }).catch(()=>{});
    },[])
    useEffect(() => {
        if(action.type==="edit") {
            get_object(action.payload)
            scrollTop()
        }
    }, [action]);

    return (
        <Box p={2}>
            {(checkPermis("payroll/baseData/timePeriodDef/add", datas) || action.type==="edit") && (
                <React.Fragment>
                    <Card>
                        <CardHeader title="تعریف دوره زمانی"/>
                        <CardContent>
                            <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                                     formValidation={formValidation} setFormValidation={set_formValidation}
                                     prepend={formStructure}
                                     actionBox={<ActionBox>
                                         <Button type="submit" role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>{action.type==="add"?"افزودن":"ویرایش"}</Button>
                                         <Button type="reset" role="secondary" disabled={waiting}>لغو</Button>
                                     </ActionBox>}
                                     submitCallback={handle_submit} resetCallback={handle_cancel}
                            />
                        </CardContent>
                    </Card>
                    <Box m={2}/>
                </React.Fragment>
            )}
            <Card>
                <TablePro
                    title="لیست دوره های زمانی"
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    edit={checkPermis("payroll/baseData/timePeriodDef/edit", datas) && "callback"}
                    editCallback={handle_edit}
                    removeCallback={checkPermis("payroll/baseData/timePeriodDef/delete", datas) ? handle_remove : null}
                />
            </Card>
        </Box>
    )
}
