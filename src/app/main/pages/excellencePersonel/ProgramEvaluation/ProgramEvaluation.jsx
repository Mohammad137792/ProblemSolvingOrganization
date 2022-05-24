import React, {useEffect, useState} from "react";
import ProgramEvaluationProcess from "./ProgramEvaluationProcess";
import {FusePageSimple} from "../../../../../@fuse";


export default function SalaryCalculation({stepName,processFormVariables,taskId,submitCallback,scrollTop}) {
    const [step, set_step] = useState("personnel");
    const [formVariables, set_formVariables] = useState({})

    function goToStep(packet) {
        if(step==="personnel") {
            // *********************************
            // todo: just for test; should be changed.
            // let newFormVariables = formVariables
            // Object.entries(packet).forEach(([key, value]) => newFormVariables[key] = {value: value})
            set_formVariables({...formVariables,...packet})
            // *********************************
            set_step("settings")
        } else if(step==="settings") {
            // set_formVariables({})
            set_step("actions")
        } else if(step==="issuance") {
            // set_formVariables({})
            set_step("checking")
        }
    }

    // useEffect(()=>{
    //     scrollTop()
    // },[step])

    useEffect(()=>{
        set_formVariables(processFormVariables)
            // {
            //     // *********************************
            //     trackingCode: "12004",
            //     createDate: "2021-09-26",
            //     personnel:  [{
            //         pseudoId: "1014",
            //         partyRelationshipId: "101839",
            //         fullName: "مرتضی  فتح آبادی",
            //     },{
            //         pseudoId: "1057",
            //         partyRelationshipId: "101851",
            //         fullName: "پژمان  چائی چی ",
            //     }],
            //     producerFullName:  "علی  نقد علی",
            //     producerPartyId: "100319",
            //     timePeriodId: "100630",
            //     registryWorkedFactorId: "100000"
            //     // *********************************
            // })
    },[processFormVariables])

    useEffect(()=>{
        if(stepName)
        set_step(stepName)
    },[stepName])

    return (
        <ProgramEvaluationProcess stepName={step} taskId={taskId} formVariables={formVariables} submitCallback={submitCallback} goToStep={goToStep} set_formVariables={set_formVariables} scrollTop={scrollTop}/>
    )
}
