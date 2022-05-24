import React, {useState,useEffect} from 'react';
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {Button , Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ActionBox from "../../../../components/ActionBox";
import PayslipPrint from "../../../payroll/print/payslip/PayslipPrint"
import FormInput from "../../../../components/formControls/FormInput";



export default function PayslipPreview (props) {
    const [initData, setInitData] = useState({});


    useEffect(()=>{
        if(props.formVariables){
            let row = props.formVariables?.person || {}
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
            setInitData(data)
        }
    },[props.formVariables])

    return(
        <>
            <PayslipPrint version={"PayslipPrintPreviewDefault"} data={initData} submitCallback={props.submitCallback}/>
        </>
    )
}
