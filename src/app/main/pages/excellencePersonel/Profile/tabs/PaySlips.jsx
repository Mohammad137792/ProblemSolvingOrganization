import React, {useEffect, useState} from "react";
import {Box, Button, CardContent, CardHeader} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import {useDispatch} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";

const formDefaultValues = {}
const primaryKey = "detailedAccountId"
const defaultAction = {type: "add", payload: ""}

export default function DetailedAccount({scrollTop}) {

    function handle_edit(row) {
        // set_action({type: "edit", payload: row[primaryKey]})
    }
    function handle_remove(row) {
        set_action(defaultAction)
        return new Promise((resolve, reject) => {
            // axios.delete(`/s1/fadak/deleteNotification?${primaryKey}=${row[primaryKey]}`).then( () => {
            resolve()
            // }).catch(()=>{
            //     reject()
            // });
        })
    }

    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const dataList = useListState(primaryKey)
    const parentDetAccounts = dataList.list || []
    const formStructure = [{
        name    : "accountCode",
        label   : "نوع زیربرنامه",
        type    : "select",
    },{
        name    : "accountTitle",
        label   : "عنوان ",
        type    : "text",
    },{
        name    : "parentAccountId",
        label   : "برنامه بالاتر",
        type    : "select",
        
    },{
        name    : "parentAccountId",
        label   : "مسئول برگزاری",
        type    : "multiselect",
        
    },{
        name    : "parentAccountId",
        label   : "مکان برگزاري",
        type    : "text",
        
    },{
        name    : "parentAccountId",
        label   : "ارائه دهنده",
        type    : "text",
        
    },{
        name    : "parentAccountId",
        label   : "تاریخ شروع",
        type    : "date",
        
    },{
        name    : "parentAccountId",
        label   : "تاریخ پایان",
        type    : "date",
        
    },{
        name    : "parentAccountId",
        label   : "حمل و نقل",
        type    : "select",
        
    },{
        name    : "parentAccountId",
        label   : "مربی / مربیان اقدام",
        type    : "multiselect",
        
    },{
        name    : "parentAccountId",
        label   : "بارگذاری مستندات لازم",
        type    : "inputFile",
        
    },{
        name    : "parentAccountId",
        label   : "شرح وظایف مسئول",
        type    : "text",
        
    },{
        name    : "parentAccountId",
        label   : "توضیحات",
        type    : "textarea",
        col : 12,
        
    }]

    
    const tableColumns = [{
        name    : "accountCode",
        label   : "عنوان نیاز براورد شده",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "نحوه شناسایی نیاز",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "راه رفع نیاز",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "برنامه پیشنهادی",
        type    : "text",
    },{
        name    : "accountCode",
        label   : "توصیه شخصی به پرسنل",
        type    : "text",
        col     : 9,
    },]
    // function get_dataList() {
    //     axios.get("/s1/payroll/detailAccount").then(res => {
    //         dataList.set(res.data.allAccount)
    //     }).catch(() => {
    //         dataList.set([])
    //     });
    // }
    // function get_object(pk) {
    //     const object = dataList.list.find(i=>i[primaryKey]===pk)
    //     set_formValues(object);
    // }
    // function create_object() {
    //     axios.post("/s1/payroll/detailAccount", {newAccount: formValues}).then(res=>{
    //         dataList.add({
    //             ...formValues,
    //             ...res.data.registeredDetAccount
    //         })
    //         set_action(defaultAction)
    //         set_formValues(formDefaultValues)
    //         dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "حساب تفصیلی جدید با موفقیت اضافه شد."))
    //     }).catch(()=>{
    //         dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
    //     })
    // }
    // function update_object() {
    //     axios.put("/s1/payroll/detailAccount", {editedAccount: formValues}).then(()=>{
    //         dataList.update(formValues)
    //         set_action(defaultAction)
    //         set_formValues(formDefaultValues)
    //         dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش حساب با موفقیت انجام شد."))
    //     }).catch(()=>{
    //         dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
    //     })
    // }
    // function handle_submit() {
    //     // if(dataList.list.findIndex(i => i["accountCode"]===formValues["accountCode"] && i[primaryKey]!==formValues[primaryKey] )>=0) {
    //     //     set_formValidation({
    //     //         accountCode: {error: true, helper: "کد حساب تکراری است!"}
    //     //     })
    //     //     return false
    //     // }
    //     dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
    //     if(action.type==="add") {
    //         create_object()
    //     } else if(action.type==="edit") {
    //         update_object()
    //     }
    // }
    // function handle_cancel() {
    //     set_action({type: "add", payload: ""})
    // }
    // function handle_edit(row) {
    //     set_action({type: "edit", payload: row[primaryKey]})
    // }
    // function handle_remove(row) {
    //     set_action(defaultAction)
    //     return new Promise((resolve, reject) => {
    //         axios.delete(`/s1/payroll/detailAccount?${primaryKey}=${row[primaryKey]}`).then( () => {
    //             resolve()
    //         }).catch(()=>{
    //             reject()
    //         });
    //     })
    // }

    // useEffect(()=>{
    //     get_dataList()
    // },[])
    // useEffect(() => {
    //     if(action.type==="edit") {
    //         get_object(action.payload)
    //         scrollTop()
    //     }
    // }, [action]);
    const formStructures = [{
        name    : "partyClassificationId",
        label   : "گروه حقوق و دستمزد",
        type    : "select",
        options : "Test1",
       
    },{
        name    : "serviceLocationConditionEnumId",
        label   : "وضعیت خدمت",
        type    : "select",
        
    },{
        name    : "employmentConditionEnumId",
        label   : "وضعیت کارمند",
        type    : "select",
        
    },{
        name    : "salaryStatusId",
        label   : "وضعیت حقوق و دستمزد",
        type    : "select",
        
    }]

    return (
        <Box p={2}>
            <Card>
                {/* <CardHeader title="تعریف حساب تفصیلی"/> */}
                <CardContent>
        <Box p={3}>

                <Card>
                <CardContent>
                    <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                             prepend={formStructures}
                            //  actionBox={<ActionBox>
                            //      <Button type="submit" role="primary">اصلاح</Button>
                            //  </ActionBox>}
                    />
                </CardContent>
            </Card>
        </Box>

                    <FormPro
                        formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                            formValidation={formValidation} setFormValidation={set_formValidation}
                            prepend={formStructure}
                            // actionBox={<ActionBox>
                            //     <Button type="submit" role="primary">{action.type==="add"?"افزودن":"ویرایش"}</Button>
                            //     <Button type="reset" role="secondary">لغو</Button>
                            // </ActionBox>}
                        //  submitCallback={handle_submit} resetCallback={handle_cancel}
                    />
                    <TablePro
                        columns={tableColumns}
                        rows={dataList.list||[]}
                        setRows={dataList.set}
                        loading={dataList.list===null}
                        edit="callback"
                        editCallback={handle_edit}
                        removeCallback={handle_remove}
                    />
                </CardContent>

            </Card>
        </Box>
    )
}
