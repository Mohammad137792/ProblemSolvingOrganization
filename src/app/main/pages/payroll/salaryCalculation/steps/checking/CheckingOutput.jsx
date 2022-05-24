import React from "react";
import TablePro from "../../../../../components/TablePro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Box} from "@material-ui/core";
import ModalPro from "../../../../../components/ModalPro";
import Typography from "@material-ui/core/Typography";
import {useDialogReducer} from "../../../../../components/ConfirmDialog";
import TaxPayment from "../../afterVerificationActions/steps/TaxPayment";
import InsurancePayment from "../../afterVerificationActions/steps/InsurancePayment";
import SalaryPayment from "../../afterVerificationActions/steps/SalaryPayment";

export default function CheckingOutput({rows,formVariables}) {
    const modalPreview = useDialogReducer()
    const tableColumns = [{
        name    : "title",
        label   : "عنوان خروجی",
        type    : "text",
    },{
        name    : "outputType",
        label   : "نوع خروجی",
        type    : "text",
    },{
        name    : "outputsetting",
        label   : "نسخه خروجی",
        type    : "text",
    }]

    function showModal (row){
        modalPreview.show({...row,...formVariables})
    }

    return (
        <React.Fragment>
            <TablePro
                rows={rows}
                columns={tableColumns}
                rowActions={[{
                    title: "پیش نمایش خروجی",
                    icon: VisibilityIcon,
                    onClick: (row)=>{showModal(row)},
                }]}
                showTitleBar={false}
            />
            {console.log("modalPreview",modalPreview.data)}
            <ModalPro
                title={`پیش نمایش خروجی ${modalPreview.data.title||""}`}
                open={modalPreview.display}
                setOpen={modalPreview.close}
                content={
                    <Box p={5}>
                        {modalPreview.data.outputTypeEnumId == "OutTyTax" ? 
                        <TaxPayment formVariables={modalPreview.data}/> :
                        modalPreview.data.outputTypeEnumId == "OutTyInsurance" ? 
                        <InsurancePayment formVariables={modalPreview.data}/>:
                        <SalaryPayment formVariables={modalPreview.data}/>
                        }
                    </Box>
                }
            />
        </React.Fragment>
    )
}
