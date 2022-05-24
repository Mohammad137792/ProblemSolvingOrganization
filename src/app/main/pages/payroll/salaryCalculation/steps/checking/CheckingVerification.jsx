import React from "react";
import TablePro from "../../../../../components/TablePro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Box} from "@material-ui/core";
import ModalPro from "../../../../../components/ModalPro";
import Typography from "@material-ui/core/Typography";
import {useDialogReducer} from "../../../../../components/ConfirmDialog";

export default function CheckingVerification({rows}) {
    const tableColumns = [{
        name    : "sequence",
        label   : "ترتیب",
        type    : "number",
    },{
        name    : "emplPosition",
        label   : "پست سازمانی",
        type    : "text",
    },{
        name    : "fullName",
        label   : "نام پرسنل",
        type    : "text",
    },{
        name    : "actionEnum",
        label   : "انواع دسترسی ها",
        type    : "text",
    }]

    console.log('rows',rows)

    return (
        <React.Fragment>
            <TablePro
                rows={rows}
                columns={tableColumns}
                showTitleBar={false}
                showRowNumber={false}
                defaultOrderBy="sequence"
            />
        </React.Fragment>
    )
}
