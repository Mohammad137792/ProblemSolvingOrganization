import React from "react";
import TablePro from "../../../../../components/TablePro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Box} from "@material-ui/core";
import ModalPro from "../../../../../components/ModalPro";
import Typography from "@material-ui/core/Typography";
import {useDialogReducer} from "../../../../../components/ConfirmDialog";

export default function CheckingOutput({rows}) {
    const modalPreview = useDialogReducer()
    const tableColumns = [{
        name    : "xx1",
        label   : "عنوان خروجی",
        type    : "text",
    },{
        name    : "xx2",
        label   : "نوع خروجی",
        type    : "text",
    },{
        name    : "xx3",
        label   : "نسخه خروجی",
        type    : "text",
    }]

    return (
        <React.Fragment>
            <TablePro
                rows={rows}
                columns={tableColumns}
                rowActions={[{
                    title: "پیش نمایش خروجی",
                    icon: VisibilityIcon,
                    onClick: modalPreview.show,
                }]}
                showTitleBar={false}
            />
            <ModalPro
                title={`پیش نمایش خروجی ${modalPreview.data.xx1||""}`}
                open={modalPreview.display}
                setOpen={modalPreview.close}
                content={
                    <Box p={5}>
                        <Typography align="center" color="textSecondary">پیش نمایش خروجی</Typography>
                        <Typography align="center" color="textSecondary">به زودی...</Typography>
                    </Box>
                }
            />
        </React.Fragment>
    )
}
