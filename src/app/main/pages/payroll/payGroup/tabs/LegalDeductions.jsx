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

const primaryKey = "payGroupLegalDeductId"

export default function LegalDeductions({parentKey, parentKeyValue}) {
    const datas = useSelector(({ fadak }) => fadak);
    const [data, set_data] = useState({
        formulDeducts: [],
    })
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "parentLegalDeductId",
        label   : "کسورات",
        type    : "select",
        options : "DeductionsType",
    },{
        name    : "legalDeductEnumId",
        label   : "نوع کسورات",
        type    : "select",
        options : "DeductionsType",
    },{
        name    : "formulaId",
        label   : "فرمول محاسبه مقدار مشمول",
        type    : "select",
        options : data.formulDeducts,
        optionIdField: "formulaId",
        optionLabelField: "title",
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
            axios.delete(`/s1/payroll/payGroupLegalDeduct?${primaryKey}=${row[primaryKey]}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function get_dataList() {
        axios.get("/s1/payroll/payGroupLegalDeduct?payGroupPartyClassificationId="+parentKeyValue).then(res => {
            dataList.set(res.data.payGroupLegalDeductList)
        }).catch(() => {
            dataList.set([])
        });
    }

    useEffect(()=>{
        get_dataList()
    },[parentKeyValue])

    useEffect(()=>{
        axios.get("/s1/payroll/formulDeductTypes").then(res => {
            set_data(prevState => ({...prevState, formulDeducts: res.data.formulDeducts }))
        }).catch(() => { });
    },[])

    return <TablePro
        title="لیست کسورات قانونی"
        columns={tableColumns}
        rows={dataList.list||[]}
        setRows={dataList.set}
        loading={dataList.list===null}
        add={checkPermis("payroll/payGroup/legalDeduct/add", datas) && "external"}
        addForm={<TableForm dataList={dataList} data={data} parent={{[parentKey]: parentKeyValue}}/>}
        edit={checkPermis("payroll/payGroup/legalDeduct/edit", datas) && "external"}
        editForm={<TableForm dataList={dataList} data={data} parent={{[parentKey]: parentKeyValue}} editing={true}/>}
        removeCallback={checkPermis("payroll/payGroup/legalDeduct/delete", datas) ? handle_remove : null}
    />
}

function TableForm({editing=false, dataList, data, parent,...restProps}) {
    const [formValidation, setFormValidation] = useState({});
    const {formValues, setFormValues, oldData={}, successCallback, failedCallback, handleClose} = restProps;
    const [waiting, set_waiting] = useState(false)
    const dispatch = useDispatch();
    const formDefaultValues = {}
    const formStructure = [{
        name    : "parentLegalDeductId",
        label   : "کسورات قانونی",
        type    : "select",
        options : "DeductionsType",
        filterOptions: options => options.filter(o=>!o["parentEnumId"]),
        changeCallback: () => setFormValues(prev => ({...prev, legalDeductEnumId: null})),
        required: true
    },{
        name    : "legalDeductEnumId",
        label   : "نوع کسورات قانونی",
        type    : "select",
        options : "DeductionsType",
        filterOptions: options => options.filter(o=>o["parentEnumId"]===formValues["parentLegalDeductId"]),
        required: true,
        disabled: !formValues["parentLegalDeductId"]
    },{
        name    : "fromDate",
        label   : "از تاریخ",
        type    : "date",
    },{
        name    : "thruDate",
        label   : "تا تاریخ",
        type    : "date",
    },{
        name    : "formulaId",
        label   : "فرمول محاسبه مقدار مشمول",
        type    : "select",
        options : data.formulDeducts,
        optionIdField: "formulaId",
        optionLabelField: "title",
        required: true
    },{
        name    : "employerRate",
        label   : "درصد سهم کارفرما",
        type    : "number",
        required: true
    },{
        name    : "employeeRate",
        label   : "درصد سهم کارگر",
        type    : "number",
        required: true
    }]

    const handle_add = ()=>{
        let packet = {...formValues , ...parent }
        axios.post("/s1/payroll/payGroupLegalDeduct", packet).then((res) => {
            setFormValues(formDefaultValues)
            set_waiting(false)
            successCallback({...formValues, ...res.data})
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }
    const handle_edit = ()=>{
        axios.put("/s1/payroll/payGroupLegalDeduct", formValues).then(() => {
            setFormValues(formDefaultValues)
            set_waiting(false)
            successCallback(formValues)
        }).catch(() => {
            set_waiting(false)
            failedCallback()
        });
    }

    function has_overlap() {
        const check_for_overlap = (fromDate1, thruDate1, fromDate2, thruDate2) => {
            let moment = require('moment-jalaali')
            if(typeof fromDate1 !== 'string'){
                fromDate1 = moment(fromDate1).format('YYYY-MM-DD')
                thruDate1 = moment(thruDate1).format('YYYY-MM-DD')
            }
            if(typeof fromDate2 !== 'string'){
                fromDate2 = moment(fromDate2).format('YYYY-MM-DD')
                thruDate2 = moment(thruDate2).format('YYYY-MM-DD')
            }
            return !((fromDate1 && thruDate2 && fromDate1>thruDate2) || (fromDate2 && thruDate1 && fromDate2>thruDate1))
        }
        const checkList = dataList.list.filter(item => item["legalDeductEnumId"]===formValues["legalDeductEnumId"] && item[primaryKey]!==formValues[primaryKey])
        for(let i in checkList) {
            const row = checkList[i]
            if(check_for_overlap(formValues.fromDate, formValues.thruDate, row.fromDate, row.thruDate)){
                setFormValidation({thruDate: {error: true, helper: ""}, fromDate: {error: true, helper: ""}})
                return true
            }
        }
        setFormValidation({thruDate: {error: false, helper: ""}, fromDate: {error: false, helper: ""}})
        return false
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
                if(has_overlap()){
                    failedCallback('محدوده تاریخ تعیین شده با رکورد دیگری دارای همپوشانی است!')
                    return
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
