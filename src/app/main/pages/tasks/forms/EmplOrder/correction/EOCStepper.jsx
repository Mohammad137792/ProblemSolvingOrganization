import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import EOIFinalizeOrder from "../issuance/EOIFinalizeOrder";
import ActionBox from "../../../../../components/ActionBox";
import {Button} from "@material-ui/core";
import EOCAgreement from "./EOCAgreement";
import {requiredAlert, requiredHelper} from "../../../../../components/formControls/FormPro";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import {useDispatch} from "react-redux";

const steps = [{
    label: "تنظیم حکم و قرارداد",
},{
    label: "ارسال احکام",
}];

export default function EOCStepper(props) {
    const dispatch = useDispatch();
    const [readyToSubmit, setReadyToSubmit] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [formValidation, setFormValidation] = React.useState({});
    const {finishCallback, ...restProps} = props;
    React.useEffect(()=>{
        if(activeStep===steps.length){
            setReadyToSubmit(false)
            finishCallback()
        }
    },[activeStep])

    const handleNext = () => {
        if(activeStep===0){
            const requiredFields = ["settingId","orderDate","fromDate","thruDate"]
            const agreementRequiredFields = ["AgreementTypeId","agreementDate","agreementFromDate","agreementThruDate"]
            let requiredError = false
            let validationBuffer = {}
            const validateField = (fieldName) => {
                if (!props.formValues[fieldName]) {
                    validationBuffer[fieldName] = {
                        helper: requiredHelper,
                        error: true
                    }
                    requiredError = true
                }
            }
            for (let i in requiredFields){
                validateField(requiredFields[i])
            }
            if (props.formValues.newAgreement==="Y") {
                for (let i in agreementRequiredFields){
                    validateField(agreementRequiredFields[i])
                }
            }
            setFormValidation(validationBuffer)
            if(requiredError){
                dispatch(setAlertContent(ALERT_TYPES.ERROR, requiredAlert));
                return
            }
            if(props.formValues.newAgreement==="N" && props.personnel.filter(i=>!i.agreementId).length>0){
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'حداقل یک نفر از پرسنل انتخابی قرارداد ندارد!'));
                return
            }
            const packet = {
                persons: props.personnel.map(per=>(per.partyId)),
                orderDef: {...props.formValues,
                    description: (props.formValues.emplOrderDescription??"") + "\n\n" + (props.formValues.description??"")
                }
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/emplOrder/issuance", packet,{
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                if (res.data.error && res.data.error.code==="ERROR_FORMULA") {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'اجرای فرمول با مشکل مواجه شده است!'));
                    setActiveStep(0)
                    return
                }
                setReadyToSubmit(true)
                props.setFormValues(prevState => ({
                    ...prevState,
                    personnelList: res.data.orders.map(ord => ({
                        agreementId: null,
                        statusId: "Y",
                        pseudoId: null,
                        firstName: null,
                        lastName: null,
                        FatherName: null,
                        idNumber: null,
                        nationalId: null,
                        cityPlaceOfIssue: null,
                        PlaceOfBirthGeoID: null,
                        birthDate: null,
                        militaryState: null,
                        sacrificeId: null,
                        sacrificeDuration: null,
                        sacrificeOperationArea: null,
                        qualificationType: null,
                        field: null,
                        personnelGroup: null,
                        personnelSubGroup: null,
                        personnelArea: null,
                        personnelSubArea: null,
                        costCenter: null,
                        martialStatus: null,
                        numberOfKids: null,
                        organizationPartyId: null,
                        organizationUnit: null,
                        emplPositionCode: null,
                        emplPositionTitle: null,
                        jobCode: null,
                        jobTitle: null,
                        jobGradeTitle: null,
                        jobGradeEnumId: null,
                        payGradeId: null,
                        employmentDate: null,
                        orderDate: null,
                        fromDate: null,
                        thruDate: null,
                        description: null,
                        ...ord
                    }))
                }))
                if (res.data.warnings.findIndex(i=>i.code==="INCOMPLETE_PERSONNEL_INFO")>-1){
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'برخی از اطلاعات پرسنل ناقص است!'));
                }
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در فرآیند آماده سازی احکام!'));
                setActiveStep(0)
            });
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setReadyToSubmit(false)
    };

    return(
        <React.Fragment>
            <Stepper alternativeLabel activeStep={activeStep}>
                {steps.map((step,index) => (
                    <Step key={index}>
                        <StepLabel>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === steps.length ? (
                <Box>
                    <Typography variant={"caption"}>
                        تمام مراحل پایان یافت؛ در حال ارسال اطلاعات...
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box hidden={activeStep!==0}>
                        <EOCAgreement {...restProps} formValidation={formValidation} setFormValidation={setFormValidation}/>
                    </Box>
                    <Box hidden={activeStep!==1 && activeStep!==2}>
                        <EOIFinalizeOrder {...restProps}/>
                    </Box>

                    <ActionBox mt={2}>
                        {activeStep<1 ? (
                            <Button type="button" role="primary" onClick={handleNext}>
                                مرحله بعد
                            </Button>
                        ):(
                            <Button type="button" role="primary" disabled={!readyToSubmit} onClick={handleNext}>
                                ارسال حکم
                            </Button>
                        )}
                        <Button type="button" role="secondary" disabled={activeStep<=0} onClick={handleBack}>
                            بازگشت
                        </Button>

                        {/*<Button type="button" role="tertiary" onClick={()=>{*/}
                        {/*    console.log("formValues:",restProps.formValues)*/}
                        {/*    console.log("personnel:",restProps.personnel)*/}
                        {/*}}>Log formValues</Button>*/}

                    </ActionBox>
                </>
            )}
        </React.Fragment>
    )
}
