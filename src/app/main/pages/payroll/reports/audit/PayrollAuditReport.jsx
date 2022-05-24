import React, {useEffect, useState} from "react";
import useListState from "../../../../reducers/listState";
import {FusePageSimple} from "../../../../../../@fuse";
import {PayrollCardHeader} from "../../Payroll";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PayrollCalculationsFilterForm from "../calculations/PayrollCalculationsFilterForm";
import axios from "../../../../api/axiosRest";

const primaryKey = "id0"
const permanentTableColumns = [{
    name    : "fullName",
    label   : "نام و کد کارمند",
    type    : "render",
    render  : row => `${row?.fullName??"-"} ─ ${row?.pseudoId??"-"}`
},{
    name    : "year",
    label   : "سال",
    type    : "number",
},{
    name    : "month",
    label   : "ماه",
    type    : "number",
}]

export default function PayrollAuditReport() {
    const dataList = useListState(primaryKey)
    const [tableColumns, set_tableColumns] = useState(permanentTableColumns);

    function get_dataList(filter={}) {
        axios.get("/s1/payroll/ReportsData").then(res => {
            dataList.set(res.data.listOfPayrolls)
            set_tableColumns(res.data.payrollIds)
        }).catch(() => {
            dataList.set([])
        });
        // const data = {
        //     factors: [
        //         {factorId: "factor01", title: "کارکرد موثر"},
        //         {factorId: "factor02", title: "حقوق پایه"},
        //         {factorId: "factor03", title: "حق جذب"},
        //         {factorId: "factor04", title: "مبنای مزد ثابت"},
        //     ],
        //     personnel: [
        //         {
        //             pseudoId: "1014",
        //             fullName: "مرتضی  فتح آبادی",
        //             year    : 1400,
        //             month   : 7,
        //             factor01: 31,
        //             factor02: 36190000,
        //             factor03: 23128000,
        //             factor04: 9924000,
        //         },{
        //             pseudoId: "1057",
        //             fullName: "پژمان  چائی چی ",
        //             year    : 1400,
        //             month   : 8,
        //             factor01: 31,
        //             factor02: 46120000,
        //             factor03: 26158000,
        //             factor04: 10686000,
        //         }
        //     ]
        // }
        // set_tableColumns([...permanentTableColumns, ...data.factors.map(item => ({name: item.factorId, label: item.title}))])
        // dataList.set(data.personnel)
    }

    useEffect(()=>{
        get_dataList()
    },[])

    return (
        <FusePageSimple
            header={<PayrollCardHeader title="گزارش حسابرسی حقوق و دستمزد"/>}
            content={
                <Box p={2}>
                    <Card>
                        <TablePro
                            title="گزارش حسابرسی حقوق و دستمزد"
                            columns={tableColumns}
                            rows={dataList.list||[]}
                            loading={dataList.list===null}
                        />
                    </Card>
                </Box>
            }
        />
    )
}
