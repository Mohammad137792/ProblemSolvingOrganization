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
import checkPermis from "../../../../components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";

const formDefaultValues = {}
const primaryKey = "timePeriodTypeId"
const defaultAction = {type: "add", payload: ""}

export default function TimePeriodType({scrollTop}) {
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const [waiting, set_waiting] = useState(false)
    const dataList = useListState(primaryKey)
    const timePeriodTypes = dataList.list||[]

    const formStructure = [{
        name    : "code",
        label   : "کد دوره",
        type    : "text",
        required: true,
        validator: values => new Promise((resolve) => {
            if( /[^a-z0-9]/i.test(values.code) ){
                resolve({error: true, helper: "کد دوره فقط می تواند شامل اعداد و حروف لاتین باشد!"})
            }
            resolve({error: false, helper: ""})
        })
    },{
        name    : "description",
        label   : "عنوان نوع دوره زمانی",
        type    : "text",
        required: true,
    },{
        name    : "periodPurposeEnumId",
        label   : "منظور نوع دوره",
        type    : "select",
        options : "TimePeriodPurpose",
        disabled: formValues.isParent,
        changeCallback: ()=>set_formValues(prevState => ({...prevState, parentPeriodTypeId: null}))
    },{
        name    : "parentPeriodTypeId",
        label   : "نوع دوره بالاتر",
        type    : "select",
        options : timePeriodTypes,
        optionIdField: "timePeriodTypeId",
        filterOptions: options => options.filter(o=>o.periodPurposeEnumId===formValues.periodPurposeEnumId && o[primaryKey]!==formValues[primaryKey]),
    },{
        type    : "group",
        items   : [{
            name    : "periodLength",
            label   : "طول دوره",
            type    : "number",
            inputProps: {min: 1},
            validator: values => new Promise((resolve) => {
                if( values.periodLength <= 0 ){
                    resolve({error: true, helper: "طول دوره باید بزرگتر از صفر باشد!"})
                }
                resolve({error: false, helper: ""})
            })
        },{
            name    : "lengthUomId",
            type    : "select",
            options : "UomUT_TIME_FREQ_MEASURE",
            optionIdField: "uomId",
            disableClearable: true,
            style   : {minWidth: 110}
        }]
    }]
    const tableColumns = [{
        name    : "code",
        label   : "کد دوره",
        type    : "text",
    },{
        name    : "description",
        label   : "عنوان نوع دوره",
        type    : "text",
    },{
        name    : "parentPeriodTypeId",
        label   : "نوع دوره بالاتر",
        type    : "select",
        options : timePeriodTypes,
        optionIdField: "timePeriodTypeId"
    },{
        name    : "periodLength",
        label   : "طول دوره",
        type    : "number",
    },{
        name    : "lengthUomId",
        label   : "واحد طول دوره",
        type    : "select",
        options : "UomUT_TIME_FREQ_MEASURE",
        optionIdField: "uomId",
    }]

    function get_dataList() {
        axios.get("/s1/payroll/entity/timePeriodType").then(res => {
            dataList.set(res.data.timePeriodTypeList)
        }).catch(() => {
            dataList.set([])
        });
    }
    function get_object(pk) {
        let object = Object.assign({}, dataList.list.find(i=>i[primaryKey]===pk), {isParent: true})
        set_formValues(object)
        axios.get("/s1/payroll/isParentPeriodType?timePeriodTypeId="+object.timePeriodTypeId).then(res => {
            set_formValues(prevState => ({...prevState, isParent: res.data.isParent}))
        }).catch(() => {});
    }
    function create_object() {
        axios.put("/s1/payroll/entity/timePeriodType",formValues).then(res=>{
            dataList.add({
                ...formValues,
                ...res.data
            })
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "نوع دوره زمانی جدید با موفقیت اضافه شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function update_object() {
        axios.put("/s1/payroll/entity/timePeriodType",formValues).then(res =>{
            if(res.data.status === "OK") {
                dataList.update(formValues)
                set_action(defaultAction)
                set_formValues(formDefaultValues)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش نوع دوره با موفقیت انجام شد."))
            } else if(res.data.status === "ERROR_LOOP") {
                set_formValidation({parentPeriodTypeId: {error: true, helper: ""}})
                dispatch(setAlertContent(ALERT_TYPES.ERROR, "نوع دوره بالاتر انتخاب شده برای این نوع دوره صحیح نیست!"))
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
        if(dataList.list.findIndex(i => i["code"]===formValues["code"] && i[primaryKey]!==formValues[primaryKey] )>=0) {
            set_formValidation({
                code: {error: true, helper: "کد دوره تکراری است!"}
            })
            return false
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
            axios.delete(`/s1/payroll/entity/timePeriodType?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch((res)=>{
                if(res.response.data.errors.indexOf("FOREIGN KEY (`TIME_PERIOD_TYPE_ID`)")) {
                    reject("امکان حذف این دوره وجود ندارد!")
                }
                reject()
            });
        })
    }

    useEffect(()=>{
        get_dataList()
    },[])
    useEffect(() => {
        if(action.type==="edit") {
            get_object(action.payload)
            scrollTop()
        }
    }, [action]);

    return (
        <Box p={2}>
            {(checkPermis("payroll/baseData/timePeriodType/add", datas) || action.type==="edit") && (
                <React.Fragment>
                    <Card>
                        <CardHeader title="تعریف نوع دوره زمانی"/>
                        <CardContent>
                            <FormPro formValues={formValues} setFormValues={set_formValues}
                                     formDefaultValues={formDefaultValues}
                                     formValidation={formValidation} setFormValidation={set_formValidation}
                                     prepend={formStructure}
                                     actionBox={<ActionBox>
                                         <Button type="submit" role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>{action.type === "add" ? "افزودن" : "ویرایش"}</Button>
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
                    title="لیست نوع دوره های زمانی"
                    columns={tableColumns}
                    rows={timePeriodTypes}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    edit={checkPermis("payroll/baseData/timePeriodType/edit", datas) ? "callback" : false}
                    editCallback={handle_edit}
                    removeCallback={checkPermis("payroll/baseData/timePeriodType/delete", datas) ? handle_remove : null}
                />
            </Card>
        </Box>
    )
}
