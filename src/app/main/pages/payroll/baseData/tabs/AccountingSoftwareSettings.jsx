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
import Tooltip from "@material-ui/core/Tooltip";
import GetAppIcon from '@material-ui/icons/GetApp';
import ConfirmDialog, {useDialogReducer} from "../../../../components/ConfirmDialog";
import checkPermis from "../../../../components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";

const formDefaultValues = {
    isDefault: 'N'
}
const primaryKey = "configId"
const defaultAction = {type: "add", payload: ""}

export default function AccountingSoftwareSettings({scrollTop}) {
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [waiting, set_waiting] = useState(false)
    const [action, set_action] = useState(defaultAction)
    const dataList = useListState(primaryKey)
    const dialogConfirmation = useDialogReducer(handle_submit)
    const formStructure = [{
        name    : "title",
        label   : "عنوان ارتباط",
        type    : "text",
        required: true
    },{
        name    : "url",
        label   : "آدرس",
        type    : "text",
    },{
        name    : "userName",
        label   : "نام کاربری",
        type    : "text",
    },{
        name    : "password",
        label   : "کلمه عبور",
        type    : "password",
        autoComplete: "new-password",
    },{
        type    : "group",
        items   : [{
            name    : "outputExcelTypeEnumId",
            label   : "نوع فایل اکسل خروجی",
            type    : "select",
            options : "ExcelAccountingOutput",
            style   : {width: "100%"}
        },{
            type    : "component",
            component: (
                <Tooltip title="دریافت نمونه فایل اکسل">
                    <span>
                        <Button variant="outlined" disabled={!formValues["id5"]}>
                            <GetAppIcon color={formValues["id5"]?"action":"disabled"}/>
                        </Button>
                    </span>
                </Tooltip>
            )
        }]
    },{
        type    : "group",
        items   : [{
            name    : "id6",
            label   : "نوع ارسال اطلاعات",
            type    : "select",
            options : "Test1",
            disabled: true,
            style   : {width: "100%"}
        },{
            type    : "component",
            component: (
                <Tooltip title="دریافت نمونه فایل">
                    <span>
                        <Button variant="outlined" disabled={!formValues["id6"]}>
                            <GetAppIcon color={formValues["id6"]?"action":"disabled"}/>
                        </Button>
                    </span>
                </Tooltip>
            )
        }]
    },{
        name    : "isDefault",
        label   : "تعیین به عنوان مقدار پیش فرض",
        type    : "indicator",
        col     : 6
    }]
    const tableColumns = [{
        name    : "title",
        label   : "عنوان ارتباط",
        type    : "text",
    },{
        name    : "outputExcelTypeEnumId",
        label   : "نوع فایل اکسل خروجی",
        type    : "select",
        options : "ExcelAccountingOutput",
    },/*{
        name    : "id6",
        label   : "نوع ارسال اطلاعات",
        type    : "select",
        options : "Test1",
    },*/{
        name    : "url",
        label   : "آدرس",
        type    : "text",
    },{
        name    : "userName",
        label   : "نام کاربری",
        type    : "text",
    },{
        name    : "isDefault",
        label   : "مقدار پیش فرض",
        type    : "indicator",
    }]
    function get_dataList() {
        axios.get("/s1/payroll/relationList").then(res => {
            dataList.set(res.data.Relations)
        }).catch(() => {
            dataList.set([])
        });
    }
    function get_object(pk) {
        const object = dataList.list.find(i=>i[primaryKey]===pk)
        set_formValues(object);
    }
    function create_object() {
        axios.post("/s1/payroll/registerRelation", {rel: formValues}).then(res=>{
            const newRow = {
                ...formValues,
                ...res.data.registeredRelation
            }
            const targetIndex = dataList.list.findIndex(item => item.isDefault==='Y')
            if(formValues.isDefault==='Y' && targetIndex>-1) {
                let newList = Object.assign([],dataList.list)
                newList[targetIndex].isDefault = 'N'
                dataList.set(newList.concat(newRow))
            } else {
                dataList.add(newRow)
            }
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ارتباط جدید با موفقیت اضافه شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function update_object() {
        axios.put("/s1/payroll/updateRelation", {editedRelation: formValues}).then(()=>{
            let newList = Object.assign([],dataList.list)
            const targetIndex = newList.findIndex(item => item.isDefault==='Y' && item[primaryKey]!==formValues[primaryKey])
            if(formValues.isDefault==='Y' && targetIndex>-1) {
                newList[targetIndex].isDefault = 'N'
            }
            const index = newList.findIndex(item => item[primaryKey]===formValues[primaryKey])
            newList[index] = formValues
            dataList.set(newList)
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش ارتباط با موفقیت انجام شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function handle_check() {
        if(formValues.isDefault==='Y' && dataList.list.filter(item => item.isDefault==='Y' && item[primaryKey]!==formValues[primaryKey]).length>0) {
            dialogConfirmation.show()
        }else{
            handle_submit()
        }
    }
    function handle_submit() {
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
            axios.delete(`/s1/payroll/deleteRelation?${primaryKey}=${row[primaryKey]}`).then( () => {
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
            {(checkPermis("payroll/baseData/accountingSoftware/add", datas) || action.type==="edit") && (
                <React.Fragment>
                    <Card>
                        <CardHeader title="تعریف ارتباط با نرم افزار حسابداری"/>
                        <CardContent>
                            <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                                     formValidation={formValidation} setFormValidation={set_formValidation}
                                     prepend={formStructure}
                                     actionBox={<ActionBox>
                                         <Button type="submit" role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>{action.type==="add"?"افزودن":"ویرایش"}</Button>
                                         <Button type="reset" role="secondary" disabled={waiting}>لغو</Button>
                                         <Button type="button" role="tertiary" disabled>تست ارتباط</Button>
                                     </ActionBox>}
                                     submitCallback={handle_check} resetCallback={handle_cancel}
                            />
                        </CardContent>
                    </Card>
                    <Box m={2}/>
                </React.Fragment>
            )}
            <Card>
                <TablePro
                    title="لیست ارتباط ها"
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    edit={checkPermis("payroll/baseData/accountingSoftware/edit", datas) && "callback"}
                    editCallback={handle_edit}
                    removeCallback={checkPermis("payroll/baseData/accountingSoftware/delete", datas) ? handle_remove : null}
                />
            </Card>
            <ConfirmDialog
                dialogReducer={dialogConfirmation}
                title="آیا مایل به تغییر مقدار پیش فرض هستید؟ "
                content="در صورت تایید مقدار قبلی غیر فعال خواهد شد."
            />
        </Box>
    )
}
