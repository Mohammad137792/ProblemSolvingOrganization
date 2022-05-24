import React , {useEffect} from "react";
import {CardContent, CardHeader} from "@material-ui/core";
import ListProAccordion from "../../../../../components/ListProAccordion";
import TablePro from "../../../../../components/TablePro";
import Typography from "@material-ui/core/Typography";
import useListState from "../../../../../reducers/listState";
import axios from "../../../../../api/axiosRest";

export default function ActionsPayrollFactors({formVariables,set_formVariables}) {

    const personnel = useListState("partyRelationshipId",formVariables?.personnel || [])
    const dataList = useListState("payrollFactorId")

    
    const columns = [
        {
            name    : "code",
            label   : "کد عامل",
            type    : "text",
            disabled: true,
            style   : {width: "10%"}
        },{
            name    : "workedFactorTypeId",
            label   : "عامل حقوقی",
            type    : "select",
            options : dataList?.list || [],
            optionIdField: "payrollFactorId",
            optionLabelField: "title",
            style   : {width: "30%"},
            required: true
        },{
            name    : "amountFactor",
            label   : "مقدار عامل",
            type    : "number",
            required: true
        }]

    const handle_resolve = (rowData) => new Promise(resolve => resolve(rowData))
    
    const set_item_operations = (item) => (newOperations) => {
        item.actionAddeddPayrolls = newOperations
        personnel.update(item)
    }

    function get_dataList() {
        axios.get("/s1/payroll/entity/payrollFactor?factorTypeEnumId=PayrollFactorGroup").then(res => {
            dataList.set(res.data.payrollFactorList)
        }).catch(() => {
            dataList.set([])
        });
    }

    React.useEffect(()=>{
        set_formVariables(prev => ({...prev, personnel: personnel.list}))
    },[personnel.list])
    
    useEffect(()=>{
        get_dataList()
    },[])

    console.log('personnel5888',personnel)

    return (
        <React.Fragment>
            <CardHeader title="ورودی دستی عوامل حقوقی"/>
            <CardContent>
                <ListProAccordion
                    title="لیست پرسنل"
                    context={personnel}
                    renderAccordionSummary={(item) => <Typography>{`${item.pseudoId} ─ ${item.fullName}`}</Typography>}
                    renderAccordionDetails={(item) => (
                        <TablePro
                            title={`لیست عوامل ${item.fullName}`}
                            columns={columns}
                            rows={item.actionAddeddPayrolls || []}
                            setRows={set_item_operations(item)}
                            edit="inline"
                            editCallback={handle_resolve}
                            add="inline"
                            addCallback={handle_resolve}
                            removeCallback={handle_resolve}
                            className="w-full"
                        />)
                    }
                />
            </CardContent>
        </React.Fragment>
    )
}
