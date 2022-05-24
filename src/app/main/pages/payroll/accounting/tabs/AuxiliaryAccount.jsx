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

const formDefaultValues = {
    isDebit: 'Y'
}
const primaryKey = "glAccountId"
const defaultAction = {type: "add", payload: ""}

export default function AuxiliaryAccount({scrollTop}) {
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const [waiting, set_waiting] = useState(false)
    const dataList = useListState(primaryKey)
    const parentGlAccounts = dataList.list || []
    const formStructure = [{
        name    : "glAccountClassEnumId",
        label   : "گروه حساب",
        type    : "select",
        options : "GlAccountClass",
        required: true
    },{
        name    : "parentGlAccountId",
        label   : "حساب معین سطح قبلی",
        type    : "select",
        options : parentGlAccounts,
        optionIdField: "glAccountId",
        optionLabelField: "accountName",
        filterOptions: options => options.filter(opt => opt[primaryKey] !== formValues[primaryKey]),
    },{
        name    : "accountCode",
        label   : "کد حساب",
        type    : "text",
        required: true,
        validator: values => new Promise((resolve) => {
            if( /[^a-z0-9]/i.test(values.accountCode) ){
                resolve({error: true, helper: "کد حساب فقط می تواند شامل اعداد و حروف لاتین باشد!"})
            }
            resolve({error: false, helper: ""})
        })
    },{
        name    : "accountName",
        label   : "عنوان حساب",
        type    : "text",
        required: true
    },{
        name    : "isDebit",
        label   : "ماهیت مانده حساب",
        type    : "indicator",
    }]
    const tableColumns = [{
        name    : "accountCode",
        label   : "کد حساب",
        type    : "text",
    },{
        name    : "accountName",
        label   : "عنوان حساب",
        type    : "text",
    },{
        name    : "isDebit",
        label   : "ماهیت مانده حساب",
        type    : "indicator",
    },{
        name    : "parentGlAccountId",
        label   : "حساب معین سطح قبلی",
        type    : "select",
        options : parentGlAccounts,
        optionIdField: "glAccountId",
        optionLabelField: "accountName"
    }]

    function get_dataList() {
        axios.get("/s1/payroll/glAccount").then(res => {
            dataList.set(res.data.allAccount)
        }).catch(() => {
            dataList.set([])
        });
    }
    function get_object(pk) {
        const object = dataList.list.find(i=>i[primaryKey]===pk)
        set_formValues(object);
    }
    function create_object() {
        axios.post("/s1/payroll/glAccount", {newAccount: formValues}).then(res=>{
            dataList.add({
                ...formValues,
                ...res.data
            })
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "حساب معین جدید با موفقیت اضافه شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function update_object() {
        axios.put("/s1/payroll/glAccount", {editedAccount: formValues}).then(()=>{
            dataList.update(formValues)
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش حساب با موفقیت انجام شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function handle_submit() {
        if(dataList.list.findIndex(i => i["accountCode"]===formValues["accountCode"] && i[primaryKey]!==formValues[primaryKey] )>=0) {
            set_formValidation({
                accountCode: {error: true, helper: "کد حساب تکراری است!"}
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
            axios.delete(`/s1/payroll/glAccount?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
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
            {(checkPermis("payroll/accounting/glAccount/add", datas) || action.type==="edit") && (
                <React.Fragment>
                    <Card>
                        <CardHeader title="تعریف حساب معین"/>
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
                    title="لیست حساب های معین"
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    edit={checkPermis("payroll/accounting/glAccount/edit", datas) && "callback"}
                    editCallback={handle_edit}
                    removeCallback={checkPermis("payroll/accounting/glAccount/delete", datas) ? handle_remove : null}
                />
            </Card>
        </Box>
    )
}
