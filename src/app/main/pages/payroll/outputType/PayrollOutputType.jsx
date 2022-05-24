import React, {createRef, useEffect, useState} from "react";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import {useDispatch} from "react-redux";
import useListState from "../../../reducers/listState";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import Card from "@material-ui/core/Card";
import {Button, CardContent, Divider} from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import TablePro from "../../../components/TablePro";
import PayrollOutputTypeSettings from "./PayrollOutputTypeSettings";
import axios from "../../../api/axiosRest";
import {PayrollCardHeader} from "../Payroll";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function PayrollOutputType() {
    const formDefaultValues = {}
    const primaryKey = "outputTypeId"
    const defaultAction = {type: "add", payload: ""}
    const myScrollElement = createRef();
    const dispatch = useDispatch();
    const [waiting, set_waiting] = useState(false)
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const [data, set_data] = useState({
        partySettingTypes: [],
        printSettings: [],
        PayFor: [],
        TaxPaymentMethod: [],
    })
    const dataList = useListState(primaryKey)
    const formStructure = [{
        name    : "title",
        label   : "عنوان نوع خروجی",
        type    : "text",
        required: true
    },{
        name    : "outputTypeEnumId",
        label   : "نوع خروجی",
        type    : "select",
        options : "OutputType",
        changeCallback: () => set_formValues(prevState => ({...prevState, settingId: null})),
        required: true
    },{
        name    : "settingId",
        label   : "نسخه خروجی",
        type    : "select",
        options : data.printSettings,
        optionIdField: "settingId",
        optionLabelField: "title",
        filterOptions: (options) => options.filter(opt => opt.typeEnumId===formValues["outputTypeEnumId"]),
        disabled: !formValues["outputTypeEnumId"],
        required: true,
    }]
    const tableColumns = formStructure

    function get_dataList() {
        axios.get("/s1/payroll/outputType").then(res => {
            dataList.set(res.data.outputTypeList)
        }).catch(() => {
            dataList.set([])
        });
    }
    function get_object(pk) {
        const object = dataList.list.find(i=>i[primaryKey]===pk)
        set_formValues(object);
    }
    function create_object() {
        axios.put("/s1/payroll/outputType",formValues).then(res=>{
            dataList.add({
                ...formValues,
                ...res.data
            })
            handle_edit(res.data)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "نوع خروجی جدید با موفقیت اضافه شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
    }
    function update_object() {
        axios.put("/s1/payroll/outputType",formValues).then(()=>{
            dataList.update(formValues)
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش نوع خروجی با موفقیت انجام شد."))
            set_waiting(false)
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            set_waiting(false)
        })
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
            axios.delete(`/s1/payroll/outputType?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
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
        axios.get("/s1/payroll/outputPrintSetting").then(res => {
            set_data(prevState => ({...prevState, printSettings: res.data.printSettingList }))
        }).catch(() => {});
        axios.get("/s1/payroll/entity/partySettingType?settingTypeEnumId=SettingTypeOutput").then(res => {
            set_data(prevState => ({...prevState, partySettingTypes: res.data.partySettingTypeList }))
        }).catch(() => {});
        axios.get("/s1/fadak/entity/Enumeration?enumTypeId=PayFor").then(res => {
            set_data(prevState => ({...prevState, PayFor: res.data.result }))
        }).catch(() => {});
        axios.get("/s1/fadak/entity/Enumeration?enumTypeId=TaxPaymentMethod").then(res => {
            set_data(prevState => ({...prevState, TaxPaymentMethod: res.data.result }))
        }).catch(() => {});
    },[])
    useEffect(() => {
        if(action.type==="edit") {
            get_object(action.payload)
            scroll_to_top()
        }
    }, [action]);

    return (
        <FusePageSimple
            ref={myScrollElement}
            header={<PayrollCardHeader title={"نوع خروجی"}/>}
            content={
                <Box p={2}>
                    <Card>
                        <CardHeader title="تعریف نوع خروجی"/>
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
                            {action.type==="edit" &&
                            <React.Fragment>
                                <Box my={2}>
                                    <Divider variant="fullWidth"/>
                                </Box>
                                <PayrollOutputTypeSettings parentKey={primaryKey} parentKeyValue={action.payload} data={data}/>
                            </React.Fragment>
                            }
                        </CardContent>
                    </Card>
                    <Box m={2}/>
                    <Card>
                        <TablePro
                            title="لیست انواع خروجی"
                            columns={tableColumns}
                            rows={dataList.list||[]}
                            setRows={dataList.set}
                            loading={dataList.list===null}
                            edit="callback"
                            editCallback={handle_edit}
                            removeCallback={handle_remove}
                        />
                    </Card>
                </Box>
            }
        />
    )
}
