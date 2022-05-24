import React from "react";
import {CardContent, CardHeader} from "@material-ui/core";
import useListState from "../../../../../reducers/listState";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../../components/TablePro";

export default function ActionsVerification({formVariables}) {
    const primaryKey = "id0"
    const dataList = useListState(primaryKey,[])

    const tableColumns = [{
        name    : "id1",
        label   : "عنوان",
        type    : "text",
    },{
        name    : "id2",
        label   : "مسئول",
        type    : "select",
        options : "Test1",
    },{
        name    : "id3",
        label   : "نوع اقدام",
        type    : "select",
        options : "Test1",
    },{
        name    : "id4",
        label   : "پرسنل",
        type    : "text",
    },{
        name    : "id5",
        label   : "لیست وظایف",
        type    : "multiselect",
        options : "Test1",
    },{
        name    : "id6",
        label   : "وضعیت",
        type    : "indicator",
    }]

    return (
        <React.Fragment>
            <CardHeader title="تایید اقدامات"/>
            <CardContent>
                <Card variant="outlined">
                    <TablePro
                        rows={dataList.list}
                        columns={tableColumns}
                        showTitleBar={false}
                    />
                </Card>
            </CardContent>
        </React.Fragment>
    )
}
