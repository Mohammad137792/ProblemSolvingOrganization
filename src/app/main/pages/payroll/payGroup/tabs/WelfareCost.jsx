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

const IS_FORMULA_OPTIONS = [{enumId: "N", description: "مقدار ریالی"},{enumId: "Y", description: "بر اساس فرمول"}]

export default function WelfareCost({parentKey, parentKeyValue}) {
    const datas = useSelector(({ fadak }) => fadak);
    const [data, set_data] = useState({
        payslipTypes: [],
        welfareFormuls: [],
    })
    const primaryKey = "id0"
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "parentFixedWelfareTypeEnumId",
        label   : "نوع امکانات",
        type    : "select",
        options : "FixedWelfareType",
    },{
        name    : "fixedWelfareTypeEnumId",
        label   : "ویژگی امکانات",
        type    : "select",
        options : "FixedWelfareType",
    },{
        name    : "deductPayslipTypeId",
        label   : "نوع فیش حقوقی کسر هزینه",
        type    : "select",
        options : data.payslipTypes,
        optionIdField: "payslipTypeId",
        optionLabelField: "title",
    },{
        name    : "isFormula",
        label   : "نحوه تعیین مقدار",
        type    : "select",
        options : IS_FORMULA_OPTIONS,
    },{
        name    : "fromDate",
        label   : "از تاریخ",
        type    : "date",
    },{
        name    : "thruDate",
        label   : "تا تاریخ",
        type    : "date",
    }]
    function handle_remove(row) {
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/payroll/fixedWelfareCost?payGroupPartyClassificationId=${parentKeyValue}&fixedWelfareTypeEnumId=${row["fixedWelfareTypeEnumId"]}&fromDate=${row["fromDate"]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function get_dataList() {
        axios.get("/s1/payroll/fixedWelfareCost?payGroupPartyClassificationId="+parentKeyValue).then(res => {
            dataList.set(res.data.welfareCostList)
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
        axios.get("/s1/payroll/welfareFormuls").then(res => {
            set_data(prevState => ({...prevState, welfareFormuls: res.data.welfareFormuls }))
        }).catch(() => { });
    },[])

    return <TablePro
        title="لیست امکانات"
        columns={tableColumns}
        rows={dataList.list||[]}
        setRows={dataList.set}
        loading={dataList.list===null}
        add={checkPermis("payroll/payGroup/welfareCost/add", datas) && "external"}
        addForm={<TableForm data={data} parent={{[parentKey]: parentKeyValue}}/>}
        edit={checkPermis("payroll/payGroup/welfareCost/edit", datas) && "external"}
        editForm={<TableForm data={data} parent={{[parentKey]: parentKeyValue}} editing={true}/>}
        removeCallback={checkPermis("payroll/payGroup/welfareCost/delete", datas) ? handle_remove : null}
    />
}

function TableForm({editing=false, data, parent,...restProps}) {
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;
    const [waiting, set_waiting] = useState(false)
    const dispatch = useDispatch();
    const formDefaultValues = {
        isFormula: "N"
    }
    const formStructure = [{
        name    : "parentFixedWelfareTypeEnumId",
        label   : "نوع امکانات",
        type    : "select",
        options : "FixedWelfareType",
        required: true,
        disabled: editing,
        filterOptions: options => options.filter(o=>!o["parentEnumId"]),
        changeCallback: () => setFormValues(prevState => ({...prevState, ["fixedWelfareTypeEnumId"]: null}))
    },{
        name    : "fixedWelfareTypeEnumId",
        label   : "ویژگی امکانات",
        type    : "select",
        options : "FixedWelfareType",
        disabled: !formValues["parentFixedWelfareTypeEnumId"] || editing,
        filterOptions: options => options.filter(o=>o["parentEnumId"]===formValues["parentFixedWelfareTypeEnumId"]),
    },{
        name    : "fromDate",
        label   : "از تاریخ",
        type    : "date",
        disabled: editing
    },{
        name    : "thruDate",
        label   : "تا تاریخ",
        type    : "date",
    },{
        name    : "deductPayslipTypeId",
        label   : "نوع فیش حقوقی کسر هزینه",
        type    : "select",
        options : data.payslipTypes,
        optionIdField: "payslipTypeId",
        optionLabelField: "title",
        required: true
    },{
        name    : "costUomId",
        label   : "واحد هزینه",
        type    : "select",
        options : "UomUT_TIME_FREQ_MEASURE",
        optionIdField: "uomId",
        required: true
    },{
        name    : "isFormula",
        label   : "نحوه تعیین مقدار",
        type    : "select",
        options : IS_FORMULA_OPTIONS,
        required: true,
        disableClearable: true
    },{
        name    : "formulaId",
        label   : "فرمول محاسبه هزینه",
        type    : "select",
        options : data.welfareFormuls,
        optionIdField: "formulaId",
        optionLabelField: "title",
        display : formValues["isFormula"]==="Y",
        required: formValues["isFormula"]==="Y",
    },{
        type    : "group",
        display : formValues["isFormula"]!=="Y",
        items   : [{
            name    : "costAmount",
            label   : "هزینه امکانات",
            type    : "number",
            required: formValues["isFormula"]!=="Y",
        },{
            label   : "ریال",
            type    : "text",
            disabled: true,
            fullWidth: false,
            style:  {width:"66px"}
        }],
    }]

    const handle_add = ()=>{
        let packet = {...formValues, ...parent }
        axios.post("/s1/payroll/fixedWelfareCost", packet).then((res) => {
            setFormValues(formDefaultValues)
            set_waiting(false)
            successCallback({...packet, ...res.data})
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }
    const handle_edit = ()=>{
        axios.put("/s1/payroll/fixedWelfareCost", formValues).then(() => {
            setFormValues(formDefaultValues)
            set_waiting(false)
            successCallback(formValues)
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }

    useEffect(()=>{
        if(!editing){
            setFormValues(prevState=>({
                ...prevState,
                ...formDefaultValues
            }))
        }
    },[])

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
                {/*<Button type="button" role="tertiary" onClick={()=>console.log("formValues",formValues)}>لغو</Button>*/}
            </ActionBox>}
        />
    )
}
