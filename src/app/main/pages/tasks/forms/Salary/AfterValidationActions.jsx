import React, {useState,useEffect} from 'react';
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {Button , Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ActionBox from "../../../../components/ActionBox";
import AfterVerificationActions from "../../../payroll/salaryCalculation/afterVerificationActions/AfterVerificationActions"
import FormInput from "../../../../components/formControls/FormInput";



export default function AfterValidationActions (props) {
    const [initData, setInitData] = useState({});


    useEffect(()=>{
        let newFormVariables = {}
        Object.entries(props.formVariables).forEach(([key, value]) => newFormVariables[key] = value?.value)

        setInitData(newFormVariables)
    },[props.formVariables])

    return(
        <>
            <AfterVerificationActions stepName={"actions"} taskId={props.taskId} processFormVariables={initData} scrollTop={props.scrollTop} submitCallback={props.submitCallback}/>
        </>
    )
}
