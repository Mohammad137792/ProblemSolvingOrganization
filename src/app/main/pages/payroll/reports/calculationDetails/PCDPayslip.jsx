import React from "react";
import TablePro from "../../../../components/TablePro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Box} from "@material-ui/core";
import ModalPro from "../../../../components/ModalPro";
import {useDialogReducer} from "../../../../components/ConfirmDialog";
import PayslipPrint from "../../print/payslip/PayslipPrint";

export default function PCDPayslip({rows=[]}) {
    const modalPreview = useDialogReducer()
    const tableColumns = [{
        name    : "code",
        label   : "کد فیش",
        type    : "text",
    },{
        name    : "fullName",
        label   : "نام پرسنل",
        type    : "text",
    // },{
    //     name    : "emplPositionId",
    //     label   : "پست سازمانی",
    //     type    : "select",
    //     options : "EmplPosition",
    //     optionIdField: "emplPositionId"
    // },{
    //     name    : "xx2",
    //     label   : "شماره حکم کارگزینی",
    //     type    : "text",
    },{
        name    : "xx3",
        label   : "مجموع مزایا",
        type    : "text",
    },{
        name    : "xx5",
        label   : "مجموع کسورات",
        type    : "text",
    },{
        name    : "xx6",
        label   : "خالص دریافتی",
        type    : "text",
    }]

    return (
        <React.Fragment>
            <TablePro
                rows={rows}
                columns={tableColumns}
                rowActions={[{
                    title: "جزئیات فیش حقوقی",
                    icon: VisibilityIcon,
                    onClick: modalPreview.show,
                }]}
                showTitleBar={false}
            />
            {console.log("modalPreview",modalPreview.data)}
            <ModalPro
                title={`جزئیات فیش حقوقی ${modalPreview.data.fullName||""}`}
                open={modalPreview.display}
                setOpen={modalPreview.close}
                content={
                    <Box p={2}>
                        <PayslipPrint
                            version="PayslipPrintPreviewSimple"
                            data={{
                                // *******************************
                                // test data:
                                person: {
                                    pseudoId: modalPreview.data.pseudoId,
                                    fullName: modalPreview.data.fullName,
                                    nationalId: modalPreview.data.nationalId,
                                    emplPosition: {"pseudoId":modalPreview.data.emplPosition,"description":modalPreview.data.emplPositionId},
                                    emplPositionCode: modalPreview.data.emplPositionCode,
                                },
                                factors: modalPreview.data.factors || []
                                // [{
                                //     description: "عامل شماره یک",
                                //     debtor: 1100,
                                // },{
                                //     description: "عامل شماره دو",
                                //     creditor: 800,
                                // },{
                                //     description: "عامل شماره سه",
                                //     debtor: 420,
                                // }]
                                // *******************************
                            }}
                        />
                    </Box>
                }
            />
        </React.Fragment>
    )
}
