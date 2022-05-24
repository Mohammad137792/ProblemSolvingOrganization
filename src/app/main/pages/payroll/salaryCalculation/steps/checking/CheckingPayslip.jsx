import React ,{useState}from "react";
import TablePro from "../../../../../components/TablePro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Box} from "@material-ui/core";
import ModalPro from "../../../../../components/ModalPro";
import Typography from "@material-ui/core/Typography";
import PayslipPrint from "../../../print/payslip/PayslipPrint";
import {useDialogReducer} from "../../../../../components/ConfirmDialog";
import PageviewIcon from '@material-ui/icons/Pageview';

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
    const [rowData,setRowData] = useState({})
    const [version,setVersion] = useState({})

    console.log("rows",rows)

    function openPayslip(row){
        console.log("row",row)
        let data = {
            person : {
                pseudoId:row.pseudoId,
                fullName:row.fullName,
                nationalId:row.nationalId,
                emplOrder:row.emplOrder,
                emplPosition:{"pseuduId":row.emplPositionId,"description":row.emplPosition}
            },
            factors:row.PayGroupFactor,
            worked:[],
            installments:[],
            payslip:{
                code:"",
                issuanceDate:"",
                value:row.FinalPayroll,
                accountNumber:row.accountNumber,
                bankName:row.bankName
            }
        }
        setVersion("PayslipPrintPreviewDefault")
        setRowData(data)
        modalPreview.show()
    }

    function openDetailsPayslip(row){
        console.log('row',row)
        setVersion("PayslipPrintPreviewSimple")
        let data = {
            person : {
                pseudoId:row.pseudoId,
                fullName:row.fullName,
                nationalId:row.nationalId,
                emplOrder:row.emplOrder,
                emplPosition:row.emplPositionId
            },
            factors:row.PayGroupFactor,
            legalDeducts:row.PayGroupLegalDeduct,
            worked:[],
            transactions:row.PayrollTransactionList,
            payback:row.payback || [],
            installments:[],
            payslip:{
                code:"",
                issuanceDate:"",
                value:row.FinalPayroll,
                accountNumber:row.accountNumber,
                bankName:row.bankName
            }
        }
        setRowData(data)
        modalPreview.show()
    }

    return (
        <React.Fragment>
            <TablePro
                rows={rows}
                columns={tableColumns}
                rowActions={[{
                    title: "پیش نمایش فیش حقوقی",
                    icon: VisibilityIcon,
                    onClick: (row)=>{openPayslip(row)},
                },{
                    title: "پیش نمایش جزییات فیش حقوقی",
                    icon: PageviewIcon,
                    onClick: (row)=>{openDetailsPayslip(row)},
                }]}
                showTitleBar={false}
            />
            <ModalPro
                title={`پیش نمایش فیش حقوقی ${rowData?.fullName||""}`}
                open={modalPreview.display}
                setOpen={modalPreview.close}
                content={
                    <Box p={5}>
                        {/* <Typography align="center" color="textSecondary">پیش نمایش فیش حقوقی</Typography>
                        <Typography align="center" color="textSecondary">به زودی...</Typography> */}
                        <PayslipPrint data={rowData} version={version}/>
                    </Box>
                }
            />
        </React.Fragment>
    )
}
