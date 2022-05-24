import React, {useState,useEffect} from 'react';
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {Button , Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ActionBox from "../../../../components/ActionBox";
import SalaryVerification from "../../../payroll/salaryCalculation/SalaryVerification"
import FormInput from "../../../../components/formControls/FormInput";



export default function SalarySetup (props) {
    const [initData, setInitData] = useState({});


    useEffect(()=>{
        let newFormVariables = {}
        Object.entries(props.formVariables).forEach(([key, value]) => newFormVariables[key] = value?.value)

        setInitData(newFormVariables)
    },[props.formVariables])

    return(
        <>
            <SalaryVerification taskId={props.taskId} formVariables={initData} scrollTop={props.scrollTop} submitCallback={props.submitCallback}/>
        </>
    )
}
