import React , {useState,useEffect} from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import PersonnelSelection from "./steps/PersonnelSelection";
import {Box, CardContent} from "@material-ui/core";
import Settings from "./steps/Settings";
import Divider from "@material-ui/core/Divider";
import Actions from "./steps/Actions";
import Calculations from "./steps/Calculations";
import Checking from "./steps/Checking";
import Issuance from "./steps/Issuance";
import axios from "../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import useListState from "../../../reducers/listState";
import {FusePageSimple} from "../../../../../@fuse";



export default function ProgramEvaluationProcess({stepName, formVariables, submitCallback, set_formVariables,taskId,goToStep,scrollTop}){
    const [fieldsInfo, setFieldsInfo] = useState({
        payslipType: [],
        periodTime: [],
        paygroup: []
    });
    const dataList = useListState("levelId")
    const dispatch = useDispatch();

    // const axiosKey = {
    //     headers: {
    //         'api_key': localStorage.getItem('api_key')
    //     }
    //   }

    
    const [activeStep , setActiveStep] = useState({})
    const [activeStepIndex , setactiveStepIndex] = useState(0)

    
    useEffect(()=>{
        // const activeStepIndex = steps.findIndex(i=>i.name===stepName)
        // const activeStep = steps[activeStepIndex]
        setActiveStep(steps[activeStepIndex])
    },[])

    const nextStep = () => {
        setActiveStep((prevState)=>{
            let correntIndext = steps.findIndex(x=>x.name==prevState.name)
            let nextIndex = correntIndext+1
            return steps[nextIndex]

        })
        setactiveStepIndex((prevState)=>{
            return prevState + 1
        })
    }
    const steps = [{
        name        : "personnel",
        label       : "اطلاعات کلی برنامه",
        component   : <PersonnelSelection nextStep={nextStep} submitCallback={submitCallback} formVariables={formVariables} set_formVariables={set_formVariables} fieldsInfo={fieldsInfo}/>
    },{
        name        : "settings",
        label       : "پرسنل برنامه زیارت مشهد",
        component   : <Settings nextStep={nextStep} formVariables={formVariables} submitCallback={submitCallback} set_formVariables={set_formVariables} taskId={taskId}/>
    },{
        name        : "actions",
        label       : "بپرسنل برنامه دعایی امین الله",
        component   : <Actions nextStep={nextStep} formVariables={formVariables} set_formVariables={set_formVariables} submitCallback={submitCallback} taskId={taskId} scrollTop={scrollTop}/>
    },{
        name        : "calculation",
        label       : "ارسال ارزیابی",
        component   : <Calculations formVariables={formVariables} submitCallback={submitCallback} taskId={taskId} fieldsInfo={fieldsInfo}/>
    }];

    // const getData = () => {
    //     axios.get(SERVER_URL + `/rest/s1/payroll/PaygroupData`, axiosKey).then(res => { /* todo: rest? */
    //         setFieldsInfo(res.data)
    //     }).catch(() => {
    //         dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
    //     });
    // }

    // function get_dataList() {
    //     axios.get("/s1/payroll/verificationLevel?payGroupPartyClassificationId="+formVariables.partyClassificationId).then(res => {
    //         let actionsData = res.data.verificationLevelList.forEach(e => e.status = true);
    //         dataList.set(actionsData)
    //     }).catch(() => {
    //         dataList.set([])
    //     });
    // }


    return(
        <React.Fragment>
            <CardContent>
                <Stepper alternativeLabel activeStep={activeStepIndex}>
                    {steps.map((step,index) => (
                        <Step key={index}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </CardContent>
            <Divider variant="fullWidth"/>
            {activeStep.component}
        </React.Fragment>
    )
}
