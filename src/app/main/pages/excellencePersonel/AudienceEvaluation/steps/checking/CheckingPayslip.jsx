import React from "react";
import TablePro from "../../../../../components/TablePro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Box} from "@material-ui/core";
import ModalPro from "../../../../../components/ModalPro";
import Typography from "@material-ui/core/Typography";
import {useDialogReducer} from "../../../../../components/ConfirmDialog";

export default function CheckingPayslip({rows}) {
    const modalPreview = useDialogReducer()
    const tableColumns = [{
        name    : "xx1",
        label   : "کد فیش",
        type    : "text",
    },{
        name    : "pseudoId",
        label   : "کد پرسنلی",
        type    : "text",
    },{
        name    : "fullName",
        label   : "نام پرسنل",
        type    : "text",
    },{
        name    : "FinalPayroll",
        label   : "حقوق و مزایا",
        type    : "text",
    },{
        name    : "finalLegalDeductExemptionEmployee",
        label   : "کسورات",
        type    : "text",
    },{
        name    : "xx6",
        label   : "خالص پرداختی",
        type    : "text",
    }]

    console.log('rows',rows)

    return (
        <React.Fragment>
            <TablePro
                rows={rows}
                columns={tableColumns}
                rowActions={[{
                    title: "پیش نمایش فیش حقوقی",
                    icon: VisibilityIcon,
                    onClick: modalPreview.show,
                }]}
                showTitleBar={false}
            />
            <ModalPro
                title={`پیش نمایش فیش حقوقی ${modalPreview.data.fullName||""}`}
                open={modalPreview.display}
                setOpen={modalPreview.close}
                content={
                    <Box p={5}>
                        <Typography align="center" color="textSecondary">پیش نمایش فیش حقوقی</Typography>
                        <Typography align="center" color="textSecondary">به زودی...</Typography>
                    </Box>
                }
            />
        </React.Fragment>
    )
}
