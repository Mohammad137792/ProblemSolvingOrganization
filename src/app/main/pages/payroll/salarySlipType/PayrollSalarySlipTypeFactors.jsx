import React, {useEffect, useState} from "react";
import TablePro from "../../../components/TablePro";
import Card from "@material-ui/core/Card";
import useListState from "../../../reducers/listState";
import axios from "../../../api/axiosRest";


export default function PayrollSalarySlipTypeFactors({parentKey, parentKeyValue}) {
    const primaryKey = "payrollFactorId"
    const [payrollFactors, set_payrollFactors] = useState([])
    const dataList = useListState(primaryKey)
    const tableColumns = [{
        name    : "payrollFactorId",
        label   : "عامل حقوقی",
        type    : "select",
        options : payrollFactors,
        optionIdField: "payrollFactorId",
        optionLabelField: "title",
        required: true
    },{
        name    : "calcTypeEnumId",
        label   : "نوع محاسبات",
        type    : "select",
        options : "PayFactorCalcType",
        required: true,
    },{
        name    : "arrearsPay",
        label   : "پرداخت معوقات",
        type    : "indicator",
    }]
    function handle_add(newData) {
        return new Promise((resolve, reject) => {
            let data = {...newData , [parentKey]: parentKeyValue }
            axios.post("/s1/payroll/PayrollFactor", data).then((res) => {
                resolve({...newData, ...res.data})
            }).catch(() => {
                reject()
            });
        })
    }
    function handle_edit(newData, oldData) {
        return new Promise((resolve, reject) => {
            axios.put("/s1/payroll/PayrollFactor", {editedPayroll: newData}).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }
    function handle_remove(row) {
        return new Promise((resolve, reject) => {
            axios.delete(`/s1/payroll/PayrollFactor?${primaryKey}=${row[primaryKey]}&${parentKey}=${parentKeyValue}`).then( () => {
                resolve()
            }).catch(()=>{
                reject()
            });
        })
    }
    function get_dataList() {
        axios.get(`/s1/payroll/PayrollFactor?${parentKey}=${parentKeyValue}`).then(res => {
            dataList.set(res.data.PayrollFactorList)
        }).catch(() => {
            dataList.set([])
        });
    }

    useEffect(()=>{
        get_dataList()
    },[parentKeyValue])

    useEffect(()=>{
        axios.get("/s1/payroll/legalAgentTypes").then(res => {
            set_payrollFactors(res.data.legalAgents)
        }).catch(() => {});
    },[])

    return (
        <Card variant="outlined">
            <TablePro
                title="لیست عوامل حقوقی"
                columns={tableColumns}
                rows={dataList.list||[]}
                setRows={dataList.set}
                loading={dataList.list===null}
                add="inline"
                addCallback={handle_add}
                edit="inline"
                editCallback={handle_edit}
                removeCallback={handle_remove}
            />
        </Card>
    )
}
