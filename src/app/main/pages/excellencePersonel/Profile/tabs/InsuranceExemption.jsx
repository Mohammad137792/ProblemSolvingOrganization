import React, {createRef, useEffect, useState} from "react";
import {Box, Button, CardContent, CardHeader} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import Card from "@material-ui/core/Card";
import TabPro from "../../../../components/TabPro";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import {useDispatch} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";

const formDefaultValues = {}
const primaryKey = "id0"
const defaultAction = {type: "add", payload: ""}

export default function InsuranceExemption({scrollTop}) {
    const dispatch = useDispatch();
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const dataList = useListState(primaryKey)
    const formStructure = [{
        name    : "id1",
        label   : "کسورات قانونی",
        type    : "select",
        options : "Test1",
        required: true
    },{
        name    : "id2",
        label   : "نوع کسورات قانونی",
        type    : "select",
        options : "Test1",
        required: true
    },{
        name    : "id3",
        label   : "نوع معافیت",
        type    : "select",
        options : "Test1",
        required: true
    },{
        name    : "id4",
        label   : "نحوه تعیین مقدار",
        type    : "select",
        options : "Test1",
        required: true
    },{
        name    : "id5",
        label   : "فرمول",
        type    : "select",
        options : "Test1",
        required: true
    },{
        name    : "id6",
        label   : "از تاریخ",
        type    : "date",
    },{
        name    : "id7",
        label   : "تا تاریخ",
        type    : "date",
    }]
    const tableColumns = [{
        name    : "id1",
        label   : "کسورات قانونی",
        type    : "select",
        options : "Test1",
    },{
        name    : "id2",
        label   : "نوع کسورات قانونی",
        type    : "select",
        options : "Test1",
    },{
        name    : "id3",
        label   : "معافیت مربوط به",
        type    : "select",
        options : "Test1",
    },{
        name    : "id6",
        label   : "از تاریخ",
        type    : "date",
    },{
        name    : "id7",
        label   : "تا تاریخ",
        type    : "date",
    }]

    function get_dataList() {
        // axios.get("/s1/fadak/listOfAllMessages").then(res => {
        //     dataList.set(res.data.notifs)
        // }).catch(() => {
            dataList.set([])
        // });
    }
    function get_object(pk) {
        const object = dataList.list.find(i=>i[primaryKey]===pk)
        set_formValues(object);
    }
    function create_object() {
        // axios.post("/s1/fadak/createNotification",formValues).then(res=>{
            const res = {data: {[primaryKey]: Math.random().toString()}}
            dataList.add({
                ...formValues,
                ...res.data
            })
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "معافیت با موفقیت اضافه شد."))
        // }).catch(()=>{
        //     dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        // })
    }
    function update_object() {
        // axios.put("/s1/fadak/editNotification",formValues).then(()=>{
            dataList.update(formValues)
            set_action(defaultAction)
            set_formValues(formDefaultValues)
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "ویرایش معافیت با موفقیت انجام شد."))
        // }).catch(()=>{
        //     dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
        // })
    }
    function handle_submit() {
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
            // axios.delete(`/s1/fadak/deleteNotification?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            // }).catch(()=>{
            //     reject()
            // });
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
            <Card>
                <CardHeader title="معافیت"/>
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
            <Card>
                <TablePro
                    title="لیست معافیت ها"
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
    )
}
