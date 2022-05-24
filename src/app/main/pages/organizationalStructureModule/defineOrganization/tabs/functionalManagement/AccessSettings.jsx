import React, {useEffect, useState} from "react";
import {Box, Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../../components/TablePro";
import useListState from "../../../../../reducers/listState";
import axios from "../../../../../api/axiosRest";
import {useDispatch} from "react-redux";
import FormPro from "../../../../../components/formControls/FormPro";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import ActionBox from "../../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import {PREV_ORDER, PROFILE} from "../../../../tasks/forms/EmplOrder/issuance/EmplOrderIssuance";

export default function AccessSettings({parentKey, parentKeyValue}) {
    const primaryKey = "id"
    // const [data, set_data] = useState({})
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "id4",
        label   : "ترتیب",
        type    : "number",
    },{
        name    : "id1",
        label   : "نوع",
        type    : "select",
        options : "Test1",
    },{
        name    : "emplPositionId",
        label   : "پست سازمانی",
        type    : "select",
        options : "EmplPosition",
        optionIdField       : "emplPositionId",
        filterOptions       : options => options.filter(o=>!o.thruDate),
        getOptionLabel      : opt => opt ? (`${opt.pseudoId} ─ ${opt.description}` || "؟") : "",
    },{
        name    : "id3",
        label   : "دسترسی ها",
        type    : "select",
        options : "Test1",
    }]
    function handle_remove(row) {
        return new Promise((resolve, reject) => {
            // axios.delete(`/s1/fadak/deleteFinanceArea?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            // }).catch(()=>{
            //     reject()
            // });
        })
    }
    function get_dataList() {
        // axios.get("/s1/fadak/financeList").then(res => {
        //     dataList.set(res.data.financeList)
        // }).catch(() => {
            dataList.set([])
        // });
    }

    useEffect(()=>{
        get_dataList()
    },[parentKeyValue])

    // useEffect(()=>{
    //     axios.get("/s1/fadak/financeOrgans").then(res => {
    //         set_data(prevState => ({...prevState, organs: res.data.organs}) )
    //     }).catch(() => {});
    // },[])

    return (
        <Box p={2}>
            <Card>
                <TablePro
                    title="لیست دسترسی ها"
                    columns={tableColumns}
                    rows={dataList.list||[]}
                    setRows={dataList.set}
                    loading={dataList.list===null}
                    add="external"
                    addForm={<TableForm parentKey={parentKey} parentKeyValue={parentKeyValue}/>}
                    edit="external"
                    editForm={<TableForm parentKey={parentKey} parentKeyValue={parentKeyValue} editing={true}/>}
                    removeCallback={handle_remove}
                    showRowNumber={false}
                />
            </Card>
        </Box>
    )
}

function TableForm({editing=false, parentKey, parentKeyValue, data,...restProps}) {
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;
    const dispatch = useDispatch();
    const [waiting, set_waiting] = useState(false)
    const formDefaultValues = {}
    const formStructure = [{
        name    : "id1",
        label   : "نوع",
        type    : "select",
        options : "Test1",
    },{
        name    : "emplPositionId",
        label   : "پست سازمانی",
        type    : "select",
        options : "EmplPosition",
        optionIdField       : "emplPositionId",
        filterOptions       : options => options.filter(o=>!o.thruDate),
        getOptionLabel      : opt => opt ? (`${opt.pseudoId} ─ ${opt.description}` || "؟") : "",
    },{
        name    : "id3",
        label   : "دسترسی ها",
        type    : "select",
        options : "Test1",
    },{
        name    : "id4",
        label   : "ترتیب ارسال جهت تایید",
        type    : "number",
    }]

    const handle_add = ()=>{
        successCallback(formValues)
        // let data = {...formValues , [parentKey]: parentKeyValue }
        // axios.post("/s1/fadak/createFinanceArea", { newFinance : data}).then((res) => {
        //     setFormValues(formDefaultValues)
        //     successCallback(formValues)
        //     set_waiting(false)
        //     successCallback({...formValues, ...res.data})
        // }).catch(() => {
        //     set_waiting(false)
        //     failedCallback()
        // });
    }
    const handle_edit = ()=>{
        successCallback(formValues)
        // axios.put("/s1/fadak/updateFinanceArea", {editedFinance: formValues}).then(() => {
        //     setFormValues(formDefaultValues)
        //     set_waiting(false)
        //     successCallback(formValues)
        // }).catch(() => {
        //     set_waiting(false)
        //     failedCallback()
        // });
    }

    // useEffect(()=>{
    //     if(!editing){
    //         setFormValues(prevState=>({
    //             ...prevState,
    //             ...formDefaultValues
    //         }))
    //     }
    // },[])

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formDefaultValues={formDefaultValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
                set_waiting(true)
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
                if(editing){
                    handle_edit()
                }else{
                    handle_add()
                }
            }}
            resetCallback={()=>{handleClose()}}
            actionBox={<ActionBox>
                <Button type="submit" role="primary" disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}>{editing?"ویرایش":"افزودن"}</Button>
                <Button type="reset" role="secondary" disabled={waiting}>لغو</Button>
            </ActionBox>}
        />
    )
}

