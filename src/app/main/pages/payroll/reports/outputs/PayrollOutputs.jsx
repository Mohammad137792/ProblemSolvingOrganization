import React, {createRef, useEffect, useState} from "react";
import {FusePageSimple} from "../../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import {useDispatch} from "react-redux";
import useListState from "../../../../reducers/listState";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import Card from "@material-ui/core/Card";
import {Button, CardContent, Divider} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import TablePro from "../../../../components/TablePro";
import axios from "../../../../api/axiosRest";
import UserFullName from "../../../../components/formControls/UserFullName";
import UserEmplPosition from "../../../../components/formControls/UserEmplPosition";
import ModalPro from "../../../../components/ModalPro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PayrollOutputsPersonnel from "./PayrollOutputsPersonnel";
import {PayrollCardHeader} from "../../Payroll";

export default function PayrollOutputs() {
    const moment = require("moment-jalaali");
    const primaryKey = "id0"
    const defaultAction = {type: "add", payload: ""}
    const myScrollElement = createRef();
    const dispatch = useDispatch();
    const [modalPreview, set_modalPreview] = useState({display: false, data: null});
    const [formDefaultValues, set_formDefaultValues] = useState({
        createDate: moment().format("Y-MM-DD"),
    })
    const [formValues, set_formValues] = useState(formDefaultValues)
    const [formValidation, set_formValidation] = useState({});
    const [action, set_action] = useState(defaultAction)
    const dataList = useListState(primaryKey)
    const formStructure = [{
        name    : "createDate",
        label   : "تاریخ ایجاد",
        type    : "display",
        options : "Date",
    },{
        type    : "component",
        component: <UserFullName label="تهیه کننده" name="producerPartyId" name2="producerFullName" setValue={set_formDefaultValues}/>
    },{
        type    : "component",
        component: <UserEmplPosition label="پست سازمانی تهیه کننده" name="producerEmplPositionId" valueObject={formValues} valueHandler={set_formValues}
                                        getOptionLabel={opt => opt ? (`${opt.pseudoId} ─ ${opt.description}` || "؟") : ""}/>
    },{
        name    : "id1",
        label   : "خروجی",
        type    : "select",
        options : "Test1",
        required: true
    },{
        name    : "id2",
        label   : "محاسبات",
        type    : "multiselect",
        options : "Test1",
    }]
    const tableColumns = [{
        name    : "producerFullName",
        label   : "تهیه کننده",
        type    : "text",
    },{
        name    : "producerEmplPositionId",
        label   : "پست سازمانی",
        type    : "select",
        options : "EmplPosition",
        optionIdField: "emplPositionId"
    },{
        name    : "id2",
        label   : "محاسبات",
        type    : "multiselect",
        options : "Test1",
    },{
        label   : "تاریخ ایجاد",
        name    : "createDate",
        type    : "date",
    },{
        name    : "id1",
        label   : "خروجی",
        type    : "select",
        options : "Test1",
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
        handle_edit(res.data)
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
    function show_preview(data) {
        set_modalPreview({
            display: true,
            data: data
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
    useEffect(()=>{
        set_formValues(prevState => ({...prevState,...formDefaultValues}))
    },[formDefaultValues])

    return (
        <FusePageSimple
            ref={myScrollElement}
            header={<PayrollCardHeader title={"خروجی های حقوق و دستمزد"}/>}
            content={
                <Box p={2}>
                    <Card>
                        <CardHeader title="تعریف خروجی"/>
                        <CardContent>
                            <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                                     formValidation={formValidation} setFormValidation={set_formValidation}
                                     prepend={formStructure}
                                     actionBox={<ActionBox>
                                         <Button type="submit" role="primary">{action.type==="add"?"افزودن":"ویرایش"}</Button>
                                         <Button type="reset" role="secondary">لغو</Button>
                                         {/*<Button type="button" role="tertiary" onClick={()=>console.log("formValues",formValues)}>LOG</Button>*/}
                                     </ActionBox>}
                                     submitCallback={handle_submit} resetCallback={handle_cancel}
                            />
                            {action.type==="edit" &&
                            <React.Fragment>
                                <Box my={2}>
                                    <Divider variant="fullWidth"/>
                                </Box>
                                <PayrollOutputsPersonnel parentKey={primaryKey} parentKeyValue={action.payload}/>
                            </React.Fragment>
                            }
                        </CardContent>
                    </Card>
                    <Box m={2}/>
                    <Card>
                        <TablePro
                            title="لیست خروجی های تولید شده"
                            columns={tableColumns}
                            rows={dataList.list||[]}
                            setRows={dataList.set}
                            loading={dataList.list===null}
                            edit="callback"
                            editCallback={handle_edit}
                            removeCallback={handle_remove}
                            rowActions={[{
                                title: "نمایش",
                                icon: VisibilityIcon,
                                onClick: row => show_preview(row)
                            }]}
                        />
                    </Card>
                    <ModalPro
                        title={modalPreview.data?.id0}
                        open={modalPreview.display}
                        setOpen={(val)=>set_modalPreview(prevState => ({...prevState, display: val}))}
                        content={
                            <Box p={5}>

                            </Box>
                        }
                    />
                </Box>
            }
        />
    )
}
