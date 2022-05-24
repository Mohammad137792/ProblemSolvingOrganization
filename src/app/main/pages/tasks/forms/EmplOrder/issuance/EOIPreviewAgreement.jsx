import React from "react";
import EmplOrderContractPrint from "../../../../emplOrder/contractsPrint/EmplOrderContractPrint";

export  default function EOIPreviewAgreement({formValues, rowData}) {
    const [data, setData] = React.useState({})

    React.useEffect(()=>{
        if (formValues.newAgreement==="Y"){
            setData({
                person: rowData,
                agreement: {
                    agreementDate: formValues.agreementDate,
                    fromDate: formValues.agreementFromDate,
                    thruDate: formValues.agreementThruDate,
                },
                agreementPayrollFactors: rowData.payrollFactors
            })
        }
    },[formValues, rowData])

    return (
        <EmplOrderContractPrint
            type={"AgreementPrintDefault"}
            agreementId={formValues.newAgreement==="Y" ? null : rowData.agreementId}
            agreementTypeId={formValues.AgreementTypeId}
            data={data}
        />
    )
}
