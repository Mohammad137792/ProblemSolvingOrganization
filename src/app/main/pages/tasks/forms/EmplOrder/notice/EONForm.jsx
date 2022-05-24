import React from "react";
import CardContent from "@material-ui/core/CardContent";
import {CardHeader} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import PrintIcon from "@material-ui/icons/Print";
import {useReactToPrint} from "react-to-print";
import EmplOrderPrint from "../../../../emplOrder/ordersPrint/EmplOrderPrint";
import AssignmentIcon from "@material-ui/icons/Assignment";
import EmplOrderContractPrint from "../../../../emplOrder/contractsPrint/EmplOrderContractPrint";

export default function EONForm({emplOrderData}) {
    const componentRef = React.useRef();
    const agreementRef = React.useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handlePrintAgreement = useReactToPrint({
        content: () => agreementRef.current,
    });

    return(
        <React.Fragment>
            <CardHeader
                title="حکم کارگزینی"
                action={
                    <ToggleButtonGroup size="small" >
                        <Tooltip title="چاپ قرارداد">
                            <ToggleButton onClick={handlePrintAgreement} size={"small"}>
                                <AssignmentIcon/>
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="چاپ حکم">
                            <ToggleButton onClick={handlePrint} size={"small"}>
                                <PrintIcon/>
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>
                }
            />
            <CardContent>
                <div ref={componentRef}>
                    <EmplOrderPrint type="EmplOrderPrintDefault" data={{
                        printSettingTitle: "کارمند",
                        ...emplOrderData,
                        verificationList: [],
                    }}/>
                </div>
                <div ref={agreementRef} className="print-visible">
                    <EmplOrderContractPrint
                        type={"AgreementPrintDefault"}
                        agreementId={emplOrderData.agreementId}
                    />
                </div>
            </CardContent>
        </React.Fragment>
    )
}
