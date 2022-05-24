import React, {useState,useEffect} from 'react';
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {Button , Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ActionBox from "../../../../components/ActionBox";
import Calculations from "../../../payroll/salaryCalculation/steps/Calculations"
import FormInput from "../../../../components/formControls/FormInput";
import SalaryCalculation from "../../../payroll/salaryCalculation/SalaryCalculation"



export default function CalculationValidation (props) {
    const [initData, setInitData] = useState({});


    useEffect(()=>{
        let newFormVariables = {}
        Object.entries(props.formVariables).forEach(([key, value]) => newFormVariables[key] = value?.value)

        setInitData(newFormVariables)
    },[props.formVariables])

    return(
        <>
            <SalaryCalculation stepName={"calculation"} taskId={props.taskId} processFormVariables={initData} scrollTop={props.scrollTop} submitCallback={props.submitCallback}/>
            {/* <Calculations formVariables={props.formVariables} submitCallback={props.submitCallback} taskId={props.taskId}/> */}
        </>
    )
}
