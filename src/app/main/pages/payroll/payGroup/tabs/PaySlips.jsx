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

export default function PaySlips({parentKey, parentKeyValue}) {
    const datas = useSelector(({ fadak }) => fadak);
    const [data, set_data] = useState({
        payslipTypes: [],
        position: [],
    })
    const primaryKey = "payGroupPayslipTypeId"
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "payslipTypeId",
        label   : "نوع فیش",
        type    : "select",
        options : data.payslipTypes,
        optionIdField: "payslipTypeId",
        optionLabelField: "title",
    },{
        name    : "paymentDate",
        label   : "روز پرداخت",
        type    : "number",
    },{
        name    : "voucherTemplateId",
        label   : "الگوی سند حسابداری",
        type    : "select",
        options : data.templateList,
        optionIdField: "voucherTemplateId",
        optionLabelField: "title",
    }]
    function handle_remove(row) {
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/payroll/payGroupPayslipType?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function get_dataList() {
        axios.get("/s1/payroll/payGroupPayslipType?payGroupPartyClassificationId="+parentKeyValue).then(res => {
            dataList.set(res.data.payGroupPayslipList)
        }).catch(() => {
            dataList.set([])
        });
    }

    useEffect(()=>{
        get_dataList()
    },[parentKeyValue])

    useEffect(()=>{
        axios.get("/s1/payroll/payslipType").then(res => {
            set_data(prevState => ({...prevState, payslipTypes: res.data.payslipTypes }))
        }).catch(() => { });
        axios.get("/s1/fadak/emplPosition").then(res => {
            set_data(prevState => ({...prevState, position: res.data.position }))
        }).catch(() => { });
        axios.get("/s1/payroll/voucherTemplate?voucherStatusId=VTActive").then(res => {
            set_data(prevState => ({...prevState, templateList: res.data.templateList }))
        }).catch(() => { });
    },[])

    return <TablePro
        title="لیست فیش حقوق و دستمزد"
        columns={tableColumns}
        rows={dataList.list||[]}
        setRows={dataList.set}
        loading={dataList.list===null}
        add={checkPermis("payroll/payGroup/payslip/add", datas) && "external"}
        addForm={<TableForm data={data} parent={{[parentKey]: parentKeyValue}}/>}
        edit={checkPermis("payroll/payGroup/payslip/edit", datas) && "external"}
        editForm={<TableForm data={data} parent={{[parentKey]: parentKeyValue}} editing={true}/>}
        removeCallback={checkPermis("payroll/payGroup/payslip/delete", datas) ? handle_remove : null}
    />
}

function TableForm({editing=false, data, parent,...restProps}) {
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;
    const [waiting, set_waiting] = useState(false)
    const dispatch = useDispatch();
    const formDefaultValues = {}
    const formStructure = [{
        name    : "payslipTypeId",
        label   : "نوع فیش",
        type    : "select",
        options : data.payslipTypes,
        optionIdField: "payslipTypeId",
        optionLabelField: "title",
        required: true,
    },{
        name    : "timePeriodType",
        label   : "نوع دوره زمانی",
        type    : "text",
        readOnly: true
    },{
        name    : "paymentDate",
        label   : "روز پرداخت حقوق دستمزد",
        type    : "number",
        required: true
    },{
        name    : "responEmplPositionId",
        label   : "مسئول پرداخت",
        type    : "select",
        options : data.position,
        optionIdField: "emplPositionId",
        required: true
    },{
        name    : "voucherTemplateId",
        label   : "الگوی سند حسابداری",
        type    : "select",
        options : data.templateList,
        optionIdField: "voucherTemplateId",
        optionLabelField: "title",
    },{
        name    : "sendTypeEnumId",
        label   : "روش های ارسال فیش حقوقی",
        type    : "multiselect",
        options : "PayslipSendType",
    }]

    const handle_add = ()=>{
        let packet = {...formValues , ...parent }
        axios.post("/s1/payroll/payGroupPayslipType", packet).then((res) => {
            setFormValues(formDefaultValues)
            set_waiting(false)
            successCallback({...formValues, ...res.data})
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }
    const handle_edit = ()=>{
        axios.put("/s1/payroll/payGroupPayslipType", formValues).then(() => {
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

    useEffect(()=>{
        let timePeriodType = ""
        if(formValues.payslipTypeId) {
            const opt = data.payslipTypes.find(item=>item.payslipTypeId===formValues.payslipTypeId)
            timePeriodType = opt?.timePeriodType
        }
        setFormValues(prev=>({...prev, timePeriodType}))
    },[formValues.payslipTypeId])

    return(
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            formDefaultValues={formDefaultValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            submitCallback={()=>{
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
