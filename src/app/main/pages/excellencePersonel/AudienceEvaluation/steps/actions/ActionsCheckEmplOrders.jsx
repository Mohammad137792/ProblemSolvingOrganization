import React from "react";
import {CardContent, CardHeader} from "@material-ui/core";
import useListState from "../../../../../reducers/listState";
import TablePro from "../../../../../components/TablePro";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";

export default function ActionsCheckEmplOrders({formVariables}) {
    const primaryKey = "partyId"
    const dataList = useListState(primaryKey,formVariables.personnel||[])

    const tableColumns = [{
        name    : "pseudoId",
        label   : "کد پرسنل",
        type    : "text",
        style   : {width:"80px"}
    },{
        name    : "fullName",
        label   : "نام پرسنل",
        type    : "text",
        // type    : "render",
        // render  : (row) => `${row.firstName||''} ${row.lastName||''}`,
        style   : {width:"170px"}
    },{
        name    : "emplOrderCode",
        label   : "شماره حکم",
        type    : "text",
    },{
        name    : "statusId",
        label   : "وضعیت حکم",
        type    : "indicator",
    },{
        name    : "orderDate",
        label   : "تاریخ صدور حکم",
        type    : "date",
    },{
        name    : "thruDate",
        label   : "تاریخ اعتبار حکم",
        type    : "date",
    },{
        name    : "id7",
        label   : "نوع قرارداد",
        type    : "select",
        options : "Test1"
    },{
        name    : "employmentDate",
        label   : "تاریخ استخدام",
        type    : "date",
    },{
        name    : "id9",
        label   : "اعتبار قرارداد",
        type    : "date",
    },{
        name    : "id10",
        label   : "وضعیت قرارداد",
        type    : "indicator",
    },{
        name    : "payrollFactorTotalSum",
        label   : "جمع حقوق و مزایا",
        type    : "text",
    }]

    return (
        <React.Fragment>
            <CardHeader title="بررسی احکام کارگزینی"/>
            <TablePro
                rows={dataList.list}
                columns={tableColumns}
                showTitleBar={false}
            />
            <Divider variant="fullWidth"/>
        </React.Fragment>
    )
}
