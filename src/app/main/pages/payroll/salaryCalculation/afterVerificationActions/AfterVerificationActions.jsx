import React , {useState,useEffect} from "react";
import {Card,CardHeader,Step,Stepper,Divider,Box,StepLabel, CardContent,Button,CircularProgress} from "@material-ui/core";
import SalaryInformation from "./steps/SalaryInformation";
import PayslipPrint from "./steps/PayslipPrint";
import InsurancePayment from "./steps/InsurancePayment";
import Finish from "./steps/Finish";
import FinancialRegistration from "./steps/FinancialRegistration";
import TaxPayment from "./steps/TaxPayment";
import SalaryPayment from "./steps/SalaryPayment";
import axios from "../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import { ALERT_TYPES, setAlertContent} from "../../../../../store/actions/fadak";
import {SERVER_URL} from 'configs';
import useListState from "../../../../reducers/listState";
import ActionBox from "../../../../components/ActionBox";

export default function AfterVerificationActions({stepName , formVariables, submitCallback, set_formVariables,taskId,goToStep,scrollTop}){
    const [fieldsInfo, setFieldsInfo] = useState({
        payslipType: [],
        periodTime: [],
        paygroup: []
    });
    const dataList = useListState("levelId")
    const dispatch = useDispatch();
    const [waiting, set_waiting] = useState(null)
    const [step, set_step] = useState("salaryInformation");

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
      }

    const steps = [{
        name        : "salaryInformation",
        label       : "اطلاعات حقوق",
        component   : <SalaryInformation goToStep={goToStep} submitCallback={submitCallback} formVariables={formVariables} set_formVariables={set_formVariables} fieldsInfo={fieldsInfo}/>
    },{
        name        : "salaryPayment",
        label       : "پرداخت حقوق",
        component   : <SalaryPayment formVariables={formVariables} submitCallback={submitCallback} set_formVariables={set_formVariables} taskId={taskId}/>
    },{
        name        : "taxPayment",
        label       : "پرداخت مالیات",
        component   : <TaxPayment formVariables={formVariables} set_formVariables={set_formVariables} submitCallback={submitCallback} taskId={taskId} scrollTop={scrollTop}/>
    },{
        name        : "insurancePayment",
        label       : "پرداخت بیمه",
        component   : <InsurancePayment formVariables={formVariables} submitCallback={submitCallback} taskId={taskId} fieldsInfo={fieldsInfo}/>
    },{
        name        : "financialRegistration",
        label       : "ثبت سند مالی",
        component   : <FinancialRegistration  goToStep={goToStep} formVariables={formVariables} submitCallback={submitCallback} taskId={taskId} fieldsInfo={fieldsInfo}/>
    },{
        name        : "payslipPrint",
        label       : "چاپ فیش حقوقی",
        component   : <PayslipPrint formVariables={formVariables} set_formVariables={set_formVariables} submitCallback={submitCallback} taskId={taskId} fieldsInfo={fieldsInfo} dataList={dataList}/>
    },{
        name        : "finish",
        label       : "ارسال",
        component   : <Finish formVariables={formVariables} set_formVariables={set_formVariables} submitCallback={submitCallback} taskId={taskId} fieldsInfo={fieldsInfo} dataList={dataList}/>
    }];

    const activeStepIndex = steps.findIndex(i=>i.name===step)
    const activeStep = steps[activeStepIndex]

    useEffect(()=>{
        // getData()
        // if(stepName == "checking"){
            // get_dataList()
        // }
    },[])

    const getData = () => {
        axios.get(SERVER_URL + `/rest/s1/payroll/PaygroupData`, axiosKey).then(res => { /* todo: rest? */
            setFieldsInfo(res.data)
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING,"مشکلی در دریافت اطلاعات رخ داده است."));
        });
    }

    function get_dataList() {
        axios.get("/s1/payroll/verificationLevel?payGroupPartyClassificationId="+formVariables.partyClassificationId).then(res => {
            let actionsData = res.data.verificationLevelList.forEach(e => e.status = true);
            dataList.set(actionsData)
        }).catch(() => {
            dataList.set([])
        });
    }

    
    function handle_accept(action) {
        if(activeStepIndex != steps.length-1){
            let nextStep = steps[activeStepIndex+1]
            set_step(nextStep.name)
        }
        else{
            const packet = {
                ...formVariables,
                verifyerAccepted :action
            }
            console.log("packet",packet)
            set_waiting("accept")
            // setTimeout(()=>set_waiting(null),2000)
            submitCallback(packet)
        }
    }

    function handle_Prev() {
        let nextStep = steps[activeStepIndex-1]
        set_step(nextStep.name)
    }

    return(
        <React.Fragment>
            <Box my={2}>
                <Card >
                    <CardHeader title="ارسال حقوق و دستمزد برای تایید و پرداخت"/>
                    <CardContent>
                            <Stepper alternativeLabel activeStep={activeStepIndex}>
                                {steps.map((step,index) => (
                                    <Step key={index}>
                                        <StepLabel>{step.label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <Divider variant="fullWidth"/>
                            {activeStep.component}
                            <Box m={2}>
                                <ActionBox>
                                    <Button role="primary" disabled={waiting} onClick={()=>{handle_accept("confirmed")}} endIcon={waiting==="accept"?<CircularProgress size={20}/>:null}>
                                        {activeStepIndex == steps.length-1 ? "ارسال" : "مرحله بعد" }
                                    </Button>
                                    {activeStepIndex != 0 && <Button role="secondary" disabled={waiting} onClick={()=>{handle_Prev()}} >
                                        مرحله قبل
                                    </Button>}
                                </ActionBox>
                            </Box>
                    </CardContent>
                </Card>
            </Box>
        </React.Fragment>
    )
}
