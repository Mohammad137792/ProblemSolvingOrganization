import React, {useEffect,useState} from "react";
import {FusePageSimple} from "../../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PayrollCalculationsFilterForm from "./PayrollCalculationsFilterForm";
import {PayrollCardHeader} from "../../Payroll";
import {useHistory} from "react-router-dom";
import axios from "../../../../api/axiosRest";

const primaryKey = "calcPayrollId"

export default function PayrollCalculationsList() {
    const history = useHistory();
    const dataList = useListState(primaryKey)
    const [pageOptions , setPageOPtions] = useState({paygroup:[],payslipType:[],periodTime:[],emplPositions:[]})
    const tableColumns = [
        {
        name    : "trackingCodeId",
        label   : "کد رهگیری",
        type    : "text",
    },{
        name    : "payGroupPartyClassificationId",
        label   : "گروه حقوق و دستمزد",
        type    : "select",
        options : pageOptions.paygroup,
        optionIdField   : "partyClassificationId",
        optionLabelField: "description",
    },{
        name    : "timePeriodId",
        label   : "نوع دوره زمانی",
        type    : "select",
        options : pageOptions.periodTime,
        optionIdField   : "timePeriodId",
        optionLabelField: "periodName",
    },{
    //     name    : "payrollPaymentMethodId",
    //     label   : "نوع فیش حقوق",
    //     type    : "select",
    //     options : pageOptions.payslipType,
    //     optionIdField   : "payslipTypeId",
    //     optionLabelField: "title"
    // },{
        name    : "producerEmplPositionId",
        label   : "تهیه کننده",
        type    : "select",
        options : pageOptions.emplPositions,
        optionIdField   : "emplPositionId",
        optionLabelField: "description"
    },{
        name    : "registrationDate",
        label   : "تاریخ صدور",
        type    : "date",
    // },{
    //     name    : "id7",
    //     label   : "تعداد پرسنل",
    //     type    : "number",
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "date",
    }]

    function get_dataList(filter={}) {
        axios.get("/s1/payroll/listOfPayrolls").then(res => {
            dataList.set(res.data.listOfPayrolls)
            setPageOPtions(res.data.pageOptions)
        }).catch(() => {
            dataList.set([])
        });
        // dataList.set([{id0: 10100, id1: 123}])
    }

    useEffect(()=>{
        get_dataList()
    },[])

    return (
        <FusePageSimple
            header={<PayrollCardHeader title="لیست محاسبات حقوق و دستمزد"/>}
            content={
                <Box p={2}>
                    <Card>
                        <TablePro
                            title="لیست محاسبات حقوق و دستمزد"
                            columns={tableColumns}
                            rows={dataList.list||[]}
                            loading={dataList.list===null}
                            rowActions={[{
                                title: "مشاهده جزئیات",
                                icon: VisibilityIcon,
                                onClick: (row) => history.push("/payroll/reports/calculations/"+row[primaryKey]),
                            }]}
                            filter="external"
                            filterForm={<PayrollCalculationsFilterForm handle_search={get_dataList}/>}
                        />
                    </Card>
                </Box>
            }
        />
    )
}
