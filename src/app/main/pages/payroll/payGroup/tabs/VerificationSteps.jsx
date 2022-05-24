import React, {useEffect, useState} from "react";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import axios from "../../../../api/axiosRest";
import {ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "../../../../components/CheckPermision";

const primaryKey = "levelId"

export default function VerificationSteps({parentKey, parentKeyValue}) {
    const datas = useSelector(({ fadak }) => fadak);
    const [data, set_data] = useState({
        position: [],
    })
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "sequence",
        label   : "ترتیب",
        type    : "number",
    },{
        name    : "title",
        label   : "عنوان",
        type    : "text",
    },{
        name    : "emplPositionId",
        label   : "سمت سازمانی",
        type    : "select",
        options : data.position,
        optionIdField: "emplPositionId"
    },{
        name    : "actionEnumId",
        label   : "انواع دسترسی ها",
        type    : "multiselect",
        options : "VerActionPayrollCalc",
    }]
    function handle_remove(row) {
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/payroll/verificationLevel?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function get_dataList() {
        axios.get("/s1/payroll/verificationLevel?payGroupPartyClassificationId="+parentKeyValue).then(res => {
            dataList.set(res.data.verificationLevelList)
        }).catch(() => {
            dataList.set([])
        });
    }

    useEffect(()=>{
        get_dataList()
    },[parentKeyValue])

    useEffect(()=>{
        axios.get("/s1/fadak/emplPosition").then(res => {
            set_data(prevState => ({...prevState, position: res.data.position }))
        }).catch(() => { });
    },[])

    return <TablePro
        title="لیست مراحل تایید"
        columns={tableColumns}
        rows={dataList.list||[]}
        setRows={dataList.set}
        loading={dataList.list===null}
        add={checkPermis("payroll/payGroup/verificationLevel/add", datas) && "external"}
        addForm={<TableForm dataList={dataList} data={data} parent={{[parentKey]: parentKeyValue}}/>}
        edit={checkPermis("payroll/payGroup/verificationLevel/edit", datas) && "external"}
        editForm={<TableForm dataList={dataList} data={data} parent={{[parentKey]: parentKeyValue}} editing={true}/>}
        removeCallback={checkPermis("payroll/payGroup/verificationLevel/delete", datas) ? handle_remove : null}
        showRowNumber={false}
        defaultOrderBy="sequence"
    />
}

function TableForm({editing=false, dataList, data, parent,...restProps}) {
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;
    const [waiting, set_waiting] = useState(false)
    const dispatch = useDispatch();
    const formDefaultValues = {}
    const formStructure = [{
        name    : "title",
        label   : "عنوان",
        type    : "text",
        required: true
    },{
        name    : "sequence",
        label   : "ترتیب",
        type    : "number",
        required: true
    },{
        name    : "emplPositionId",
        label   : "سمت سازمانی",
        type    : "select",
        options : data.position,
        optionIdField: "emplPositionId",
        getOptionLabel: opt => opt ? (`${opt.pseudoId} ─ ${opt.description}` || "؟") : "",
        required: true
    },{
        name    : "actionEnumId",
        label   : "انواع دسترسی ها",
        type    : "multiselect",
        options : "VerActionPayrollCalc",
        col     : {sm: 8, md: 6}
    }]

    const handle_add = ()=>{
        let packet = {...formValues, ...parent }
        axios.post("/s1/payroll/verificationLevel", packet).then((res) => {
            setFormValues(formDefaultValues)
            set_waiting(false)
            successCallback({...formValues, ...res.data})
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }
    const handle_edit = ()=>{
        axios.put("/s1/payroll/verificationLevel", formValues).then(() => {
            setFormValues(formDefaultValues)
            set_waiting(false)
            successCallback(formValues)
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
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
                if(dataList.list.findIndex(i => i["sequence"]===formValues["sequence"] && i[primaryKey]!==formValues[primaryKey] )>=0) {
                    setFormValidation({
                        sequence: {error: true, helper: "ترتیب تکراری است!"}
                    })
                    return false
                }
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات...'));
                set_waiting(true)
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
