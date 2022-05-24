import React from "react";
import TablePro from "../../../../../components/TablePro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Box} from "@material-ui/core";
import ModalPro from "../../../../../components/ModalPro";
import Typography from "@material-ui/core/Typography";
import {useDialogReducer} from "../../../../../components/ConfirmDialog";

export default function CheckingAction({rows,setRows}) {
    const tableColumns = [{
        name    : "title",
        label   : "عنوان",
        type    : "text",
        disabled: true
    },{
        name    : "emplDescription",
        label   : "مسئول",
        type    : "text",
        disabled: true
    },{
        name    : "actionTypeDescription",
        label   : "نوع اقدام",
        type    : "text",
        disabled: true
    },{
        name    : "emplFullName",
        label   : "پرسنل",
        type    : "text",
        disabled: true
    },{
        name    : "TotalDutyList",
        label   : "لیست وظایف",
        type    : "text",
        disabled: true
    },{
        name    : "status",
        label   : "وضعیت",
        type    : "indicator",
    }]

    return (
        <React.Fragment>
            <TablePro
                rows={rows}
                setRows={setRows}
                columns={tableColumns}
                showTitleBar={false}
                edit="inline"
                editCallback={() => new Promise(resolve => resolve() )}
            />
        </React.Fragment>
    )
}
