import React, {createRef, useEffect, useState} from "react";
import {Box, Button, CardContent, CardHeader} from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import Card from "@material-ui/core/Card";
import TablePro from "../../../components/TablePro";
import useListState from "../../../reducers/listState";
import axios from "../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {FusePageSimple} from "../../../../../@fuse";
import {PayrollCardHeader} from "../Payroll";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "../../../components/CheckPermision";

const formDefaultValues = {
    factorTypeEnumId: "PayrollFactorGroup"
}
const primaryKey = "payrollFactorId"
const defaultAction = {type: "add", payload: ""}

export default function PayrollFactors({scrollTop}) {
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch();
    const myScrollElement = createRef();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const [waiting, set_waiting] = useState(false)
    const dataList = useListState(primaryKey)
    const formStructure = [{
        name    : "code",
        label   : "کد عامل",
        type    : "text",
        required: true,
        validator: values => new Promise((resolve) => {
            if( /[^a-z0-9]/i.test(values.code) ){
                resolve({error: true, helper: "کد عامل فقط می تواند شامل اعداد و حروف لاتین باشد!"})
            }
            resolve({error: false, helper: ""})
        })
    },{
        name    : "title",
        label   : "عنوان عامل",
        type    : "text",
        required: true,
    },{
        name    : "groupEnumId",
        label   : "گروه عامل",
        type    : "select",
        options : "PayrollFactorGroup",
        filterOptions: options => options.filter(o=>o["parentEnumId"]==="PayrollFactorGroup"),
        required: true,
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        col     : 12
    }]
    const tableColumns = formStructure

    function get_dataList() {
        axios.get("/s1/payroll/entity/payrollFactor?factorTypeEnumId=PayrollFactorGroup").then(res => {
            dataList.set(res.data.payrollFactorList)
        }).catch(() => {
            dataList.set([])
        });
    }
    function get_object(pk) {
        const object = dataList.list.find(i=>i[primaryKey]===pk)
        set_formValues(object);
    }
    function create_object() {
        axios.put("/s1/payroll/entity/payrollFactor",formValues).then(res=>{
            dataList.add({
                ...formValues,
                ...res.data
            })
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "عامل حقوق و دستمزد جدید با موفقیت اضافه شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function update_object() {
        axios.put("/s1/payroll/entity/payrollFactor",formValues).then(()=>{
            dataList.update(formValues)
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش عامل با موفقیت انجام شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function handle_submit() {
        if(dataList.list.findIndex(i => i["code"]===formValues["code"] && i[primaryKey]!==formValues[primaryKey] )>=0) {
            set_formValidation({
                code: {error: true, helper: "کد عامل تکراری است!"}
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
            axios.delete(`/s1/payroll/entity/payrollFactor?${primaryKey}=${row[primaryKey]}`).then( res => {
                if(res.data.deleteRow)
                    resolve()
                else reject("این عامل در سند حسابداری استفاده شده و قابل حذف نیست!")
            }).catch(()=>{
                reject()
            });
        })
    }
    function scroll_to_top() {
        myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
    }

    useEffect(()=>{
        get_dataList()
    },[])
    useEffect(() => {
        if(action.type==="edit") {
            get_object(action.payload)
            scroll_to_top()
        }
    }, [action]);

    return checkPermis("payroll/payrollFactor", datas) && (
        <FusePageSimple
            ref={myScrollElement}
            header={<PayrollCardHeader title="عوامل حقوق و دستمزد"/>}
            content={
                <Box p={2}>
                    {(checkPermis("payroll/payrollFactor/add", datas) || action.type==="edit") && (
                        <React.Fragment>
                            <Card>
                                <CardHeader title="تعریف عامل حقوق و دستمزد"/>
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
                            title="لیست عوامل حقوق و دستمزد"
                            columns={tableColumns}
                            rows={dataList.list||[]}
                            setRows={dataList.set}
                            loading={dataList.list===null}
                            edit={checkPermis("payroll/payrollFactor/edit", datas) && "callback"}
                            editCallback={handle_edit}
                            removeCallback={checkPermis("payroll/payrollFactor/delete", datas) ? handle_remove : null}
                        />
                    </Card>
                </Box>
            }
        />
    )
}
