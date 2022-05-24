import React, {useEffect, useState} from "react";
import {CardContent} from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Divider from "@material-ui/core/Divider";
import IRPPersonnel from "./steps/IRPPersonnel";
import IRPCalculation from "./steps/IRPCalculation";
import axios from "../../../api/axiosRest";
import IRPSend from "./steps/IRPSend";

export default function IntegrationRequestProcess({stepName, formVariables, scrollTop}) {
    const moment = require("moment-jalaali");
    const [step, set_step] = useState("personnel");
    const [values, set_values] = useState({
        formValues: {createDate: moment().format("Y-MM-DD")},
    //    ***************************
    //     personnel: [
    //         {
    //             fullName: "علی خانی",
    //         },{
    //             fullName: "محمد حسینی",
    //             integrated: [
    //                 {id01: "حضور-100", id02: "اصلی شیفتی"},
    //             ]
    //         }
    //     ]
    //    ***************************
    })
    const [data, set_data] = useState({
        timePeriodTypes: [],
        timePeriods: [],
    });

    const handle_submit_personnel = (packet) => new Promise((resolve) => {
        //**************
        // packet.personnel.forEach(item => {
        //     item.status = "success"
        //     item.value = 1000
        // })
        // packet.personnel[0].status = "error"
        // packet.personnel[0].errorTitle = "خطا در محاسبه فرمول"
        // packet.personnel[0].description = "محاسبه فرمول \" عنوان فرمول\" برای این کاربر با خطا مواجه شد. مقدار عامل ورودی \"عنوان عامل ورودی \" برای این کاربر تعریف نشده است"
        //**************
        set_values(packet)
        set_step("calculation")
        resolve()
    })

    const handle_submit_calculation = (action) => new Promise((resolve, reject) => {
        switch (action) {
            case "confirmed":
                set_step("send")
                resolve()
                break
            case "reCalculate":
                resolve()
                break
            default:
                reject()
        }
    })

    const handle_submit_send = () => new Promise((resolve, reject) => {
        setTimeout(() => {
            handle_reset()
            resolve()
        },2000)
    })

    const handle_back = () => {
        if(step === "calculation")
            set_step("personnel")
        else if(step === "send")
            set_step("calculation")
    }

    const handle_reset = () => {
        set_step("personnel")
        set_values({
            formValues: {createDate: moment().format("Y-MM-DD")},
        })
    }

    const steps = [
        {
            name        : "personnel",
            label       : "انتخاب پرسنل",
            component   : <IRPPersonnel values={values} onSubmit={handle_submit_personnel} data={data}/>,
        },{
            name        : "calculation",
            label       : "محاسبه کارکرد",
            component   : <IRPCalculation values={values} onSubmit={handle_submit_calculation} goBack={handle_back} data={data}/>,
        },{
            name        : "send",
            label       : "ارسال کارکرد",
            component   : <IRPSend values={values} onSubmit={handle_submit_send} goBack={handle_back} data={data}/>,
        }
    ]

    const activeStepIndex = steps.findIndex(i=>i.name===step)
    const activeStep = steps[activeStepIndex]

    useEffect(()=>{
        if(scrollTop)
            scrollTop()
    },[step])

    useEffect(()=>{
        if(stepName)
            set_step(stepName)
    },[stepName])

    useEffect(()=>{
        if(formVariables)
            set_values(formVariables)
    },[formVariables])

    useEffect(() => {
        axios.get("/s1/payroll/entity/timePeriodType").then(res => {
            set_data(prevState => ({...prevState, timePeriodTypes: res.data.timePeriodTypeList}))
        }).catch(() => {});
        axios.get("/s1/payroll/timePeriodList").then(res => {
            set_data(prevState => ({...prevState, timePeriods: res.data.timePeriodList}))
        }).catch(() => {});
    },[])

    return (
        <React.Fragment>
            <CardContent>
                <Stepper alternativeLabel activeStep={activeStepIndex}>
                    {steps.map((item,index) => (
                        <Step key={index}>
                            <StepLabel>{item.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </CardContent>
            <Divider variant="fullWidth"/>
            {activeStep.component}
        </React.Fragment>
    )
}
