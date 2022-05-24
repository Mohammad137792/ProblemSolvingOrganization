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
const primaryKeyCost = "excCostId"
const defaultAction = {type: "add", payload: ""}

export default function ExcCost({dataListCost , cost, scrollTop}) {
console.log("cost : " , cost)
    function handle_edit(row) {
        // set_action({type: "edit", payload: row[primaryKeyCost]})
    }
    function handle_remove(row) {
        set_action(defaultAction)
        return new Promise((resolve, reject) => {
            // axios.delete(`/s1/fadak/deleteNotification?${primaryKeyCost}=${row[primaryKeyCost]}`).then( () => {
            resolve()
            // }).catch(()=>{
            //     reject()
            // });
        })
    }

    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState()
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    // const parentDetAccounts = dataListCost.list || []
    const formStructureCost = [{
        name    : "excProgPerfId",
        label   : "نوع برنامه",
        type    : "select",
        required:true,

        options: cost?.progPerf,
        optionLabelField: "title",
        optionIdField: "excProgPerfId",
    },{
        name    : "familyMemberEnumId",
        label   : "نوع فرد ",
        type    : "select",
        required:true,

        options: cost?.familyMemberEnum,
        optionLabelField: "description",
        optionIdField: "enumId",
    },{
        name    : "personelPayment",
        label   : "سهم پرداختی فرد ",
        type    : "number",
        required:true,

    },{
        name    : "organizationPayment",
        label   : "سهم پرداختی سازمان ",
        type    : "number",
        required:true,

    },{
        name    : "capacity",
        label   : "ظرفیت برنامه ",
        type    : "number",
        required:true,

    }]
   
   
   
   
    function get_dataListCost() {
        dataListCost.set(cost.costStructureTable)
    }

    useEffect(() => {
            get_dataListCost()
    }, []);

    const handleSubmit = (dataListCost) => {
        let CostTable = dataListCost.list
        let data = formValues
        let FindCostTabel = CostTable.find(ele => ele.excProgPerfId === data.excProgPerfId && ele.familyMemberEnumId === data.familyMemberEnumId)
        if (!FindCostTabel){
            dataListCost.set([formValues,...dataListCost.list])
        } else {
            // dataListCost.set([...dataListCost.list])
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'ریکورد تکراری است.'));

        }
        set_formValues({})

    }

 

    const tableColumns = [{
        name    : "excProgPerfId",
        label   : "نوع زیر برنامه",
        type    : "select",
        options: cost?.progPerf,
        optionLabelField: "title",
        optionIdField: "excProgPerfId",
        
    },{
        name    : "familyMemberEnumId",
        label   : "نوع فرد ",
        type    : "select",
        options: cost?.familyMemberEnum,
        optionLabelField: "description",
        optionIdField: "enumId",
    },{
        name    : "personelPayment",
        label   : "هزینه پرداختی فرد",
        type    : "number",
    },{
        name    : "organizationPayment",
        label   : "هزینه پرداختی سازمان",
        type    : "number",
    },{
        name    : "capacity",
        label   : "ظرفیت",
        type    : "number",
    }];

    // function get_dataListCost() {
    //     axios.get("/s1/payroll/detailAccount").then(res => {
    //         dataListCost.set(res.data.allAccount)
    //     }).catch(() => {
    //         dataListCost.set([])
    //     });
    // }
    // function get_object(pk) {
    //     const object = dataListCost.list.find(i=>i[primaryKeyCost]===pk)
    //     set_formValues(object);
    // }
    // function create_object() {
    //     axios.post("/s1/payroll/detailAccount", {newAccount: formValues}).then(res=>{
    //         dataListCost.add({
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
    //         dataListCost.update(formValues)
    //         set_action(defaultAction)
    //         set_formValues(formDefaultValues)
    //         dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش حساب با موفقیت انجام شد."))
    //     }).catch(()=>{
    //         dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
    //     })
    // }
    function handle_submit() {
        if(dataListCost.list.findIndex(i => i["accountCode"]===formValues["accountCode"] && i[primaryKeyCost]!==formValues[primaryKeyCost] )>=0) {
            set_formValidation({
                accountCode: {error: true, helper: "کد حساب تکراری است!"}
            })
            return false
        }
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
        // if(action.type==="add") {
        //     create_object()
        // } else if(action.type==="edit") {
        //     update_object()
        // }
    }
    function handle_cancel() {
        set_action({type: "add", payload: ""})
    }
    function handle_edit(row) {
        set_action({type: "edit", payload: row[primaryKeyCost]})
    }
    // function handle_remove(row) {
    //     set_action(defaultAction)
    //     return new Promise((resolve, reject) => {
    //         axios.delete(`/s1/payroll/detailAccount?${primaryKeyCost}=${row[primaryKeyCost]}`).then( () => {
    //             resolve()
    //         }).catch(()=>{
    //             reject()
    //         });
    //     })
    // }

    // useEffect(()=>{
    //     get_dataListCost()
    // },[])
    // useEffect(() => {
    //     if(action.type==="edit") {
    //         get_object(action.payload)
    //         scrollTop()
    //     }
    // }, [action]);
    
    console.log("cost : " , cost)

    return (
        <Box p={2}>
            <Card>
                {/* <CardHeader title="تعریف حساب تفصیلی"/> */}
                <CardContent>
                    <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                             formValidation={formValidation} setformValidation={set_formValidation}
                             prepend={formStructureCost}
                             actionBox={<ActionBox>
                                 <Button type="submit" role="primary">{action.type==="add"?"افزودن":"ویرایش"}</Button>
                                 <Button type="reset" role="secondary">لغو</Button>
                             </ActionBox>}
                             submitCallback={()=>{handleSubmit(dataListCost)}} resetCallback={handle_cancel}
                    />
                </CardContent>
            </Card>
            <Box m={2}/>
            <Card>
                <TablePro
                    columns={tableColumns}
                    rows={dataListCost.list}
                    setRows={dataListCost.set}
                    loading={dataListCost.list===null}
                    edit="callback"
                    editCallback={handle_edit}
                    removeCallback={handle_remove}
                />
            </Card>
        </Box>
    )
}
