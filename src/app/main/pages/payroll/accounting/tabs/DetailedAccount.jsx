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

const formDefaultValues = {}
const primaryKey = "detailedAccountId"
const defaultAction = {type: "add", payload: ""}

export default function DetailedAccount({scrollTop}) {
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const dataList = useListState(primaryKey)
    const parentDetAccounts = dataList.list || []
    const formStructure = [{
        name    : "accountCode",
        label   : "کد حساب",
        type    : "text",
        required: true,
        validator: values => new Promise((resolve) => {
            if( /[^a-z0-9]/i.test(values.accountCode) ){
                resolve({error: true, helper: "کد حساب فقط می تواند شامل اعداد و حروف لاتین باشد!"})
            } else {
                axios.get(`/s1/payroll/checkDuplicateDetAccount?detailedAccountId=${values.detailedAccountId}&accountCode=${values.accountCode}`).then(res => {
                    if(res.data.isDuplicated) {
                        resolve({error: true, helper: "کد حساب تکراری است!"})
                    } else {
                        resolve({error: false, helper: ""})
                    }
                }).catch(() => {
                    resolve({error: true, helper: ""})
                });
            }
        })
    },{
        name    : "accountTitle",
        label   : "عنوان حساب",
        type    : "text",
        required: true
    },{
        name    : "parentAccountId",
        label   : "حساب تفصیلی سطح قبلی",
        type    : "select",
        options : parentDetAccounts,
        optionIdField: "detailedAccountId",
        optionLabelField: "accountTitle",
        filterOptions: options => options.filter(opt => opt[primaryKey] !== formValues[primaryKey]),
    }]
    const tableColumns = formStructure;

    function get_dataList() {
        axios.get("/s1/payroll/detailAccount").then(res => {
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
        axios.post("/s1/payroll/detailAccount", {newAccount: formValues}).then(res=>{
            dataList.add({
                ...formValues,
                ...res.data.registeredDetAccount
            })
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "حساب تفصیلی جدید با موفقیت اضافه شد."))
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        })
    }
    function update_object() {
        axios.put("/s1/payroll/detailAccount", {editedAccount: formValues}).then(()=>{
            dataList.update(formValues)
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش حساب با موفقیت انجام شد."))
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        })
    }
    function handle_submit() {
        // if(dataList.list.findIndex(i => i["accountCode"]===formValues["accountCode"] && i[primaryKey]!==formValues[primaryKey] )>=0) {
        //     set_formValidation({
        //         accountCode: {error: true, helper: "کد حساب تکراری است!"}
        //     })
        //     return false
        // }
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
            axios.delete(`/s1/payroll/detailAccount?${primaryKey}=${row[primaryKey]}`).then( () => {
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
            {(checkPermis("payroll/accounting/detailedAccount/add", datas) || action.type==="edit") && (
                <React.Fragment>
                    <Card>
                        <CardHeader title="تعریف حساب تفصیلی"/>
                        <CardContent>
                            <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                                     formValidation={formValidation} setFormValidation={set_formValidation}
                                     prepend={formStructure}
                                     actionBox={<ActionBox>
                                         <Button type="submit" role="primary">{action.type==="add"?"افزودن":"ویرایش"}</Button>
                                         <Button type="reset" role="secondary">لغو</Button>
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
                    title="لیست حساب های تفصیلی"
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    edit={checkPermis("payroll/accounting/detailedAccount/edit", datas) && "callback"}
                    editCallback={handle_edit}
                    removeCallback={checkPermis("payroll/accounting/detailedAccount/delete", datas) ? handle_remove : null}
                />
            </Card>
        </Box>
    )
}
