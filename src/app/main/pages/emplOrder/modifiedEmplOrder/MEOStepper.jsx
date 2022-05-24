import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
// import EOIAgreement from "./EOIAgreement";
// import EOIFinalizeOrder from "./EOIFinalizeOrder";
import {Box, Button,Card, CardContent} from "@material-ui/core";
import {SERVER_URL} from "../../../../../configs";

import MEOOrders from "./MEOOrders";
import MEOAdjustment from "./MEOAdjustment";
import MEOFinalize from "./MEOSubmitModifications";
// import Box from "@material-ui/core/Box";
import ActionBox from "../../../components/ActionBox";
import { useDispatch, useSelector } from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";

const steps = [{
    label: "انتخاب حکم",
    component: 'MEOOrders'
},{
    label: "تنظیم حکم اصلاحی",
    component: 'MEOAdjustment'
},{
    label: "ارسال احکام",
    component: 'MEOFinalize'
}];

export default function MEOStepper(props){
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = React.useState(0);
    const [initData, setInitData] = React.useState({});
    const [selectedEmpl, setSelectedEmpls] = React.useState(null);
    // const [selectedEmpl, setSelectedEmplp] = React.useState(null);
    const [selectedPerson, setSelectedPerson] = React.useState(null);
    // const {finishCallback, ...restProps} = props;
    const [agreementTableContent, setAgreementTableContent] = React.useState([]);
    const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin


    React.useEffect(()=>{
        if(activeStep===steps.length){
            // finishCallback()
        }
    },[activeStep])

    React.useEffect(()=>{
        getInitData()
    },[])

    function getInitData(){
        let params = {
            "partyId":partyId,
            "partyClassificationTypeList":['EmployeeGroups','EmployeeSubGroups',
            'ActivityArea','ExpertiseArea','CostCenter','Militarystate' ],
            "geoTypeList":["GEOT_COUNTRY","GEOT_COUNTY","GEOT_PROVINCE"],
            "enumTypeList" :['AgreementType','InputFactor','SacrificeType','ConstantType','MaritalStatus','ResidenceStatus','QualificationType','UniversityFields','AcademicDepartmentType','RelationDegree']
        }
        axios.post(SERVER_URL + "/rest/s1/emplOrder/stepOneInfo",{info : params}, {
            headers: {
                'api_key': localStorage.getItem('api_key')
            },
        }).then(async res=> {
            setInitData(res.data.enums)
            console.log('sssssssssssss',res.data)
        })
    }



    const handleNext = () => {
        // if(activeStep===0 && props.personnel.length===0){
        //     dispatch(setAlertContent(ALERT_TYPES.WARNING, 'پرسنلی برای ادامه فرآیند انتخاب نشده است!'));
        //     return
        // }
        // if(activeStep===1){
        //     if(!props.formValues.settingId){
        //         dispatch(setAlertContent(ALERT_TYPES.WARNING, 'نوع حکم کارگزینی انتخاب نشده است!'));
        //         return
        //     }
        //     if(!props.formValues.AgreementTypeId && props.formValues.newAgreement==="Y"){
        //         dispatch(setAlertContent(ALERT_TYPES.WARNING, 'نوع قرارداد انتخاب نشده است!'));
        //         return
        //     }
        //     if(props.formValues.newAgreement==="N" && props.personnel.filter(i=>!i.agreementId).length>0){
        //         dispatch(setAlertContent(ALERT_TYPES.WARNING, 'حداقل یک نفر از پرسنل انتخابی قرارداد ندارد!'));
        //         return
        //     }
        // }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return(
        <Card>
        <CardContent>
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
                        <MEOOrders 
                            initData ={initData}
                            selectedEmpl={selectedEmpl}
                            setSelectedEmpls={setSelectedEmpls}
                            selectedPerson={selectedPerson}
                            setSelectedPerson={setSelectedPerson}
                        />
                    </Box>
                    <Box hidden={activeStep!==1}>
                        <MEOAdjustment initData ={initData}/>
                        {/* <EOIAgreement {...restProps} tableContent={agreementTableContent} setTableContent={setAgreementTableContent} /> */}
                    </Box>
                    <Box hidden={activeStep!==2}>
                        <MEOFinalize/>
                        {/* <EOIFinalizeOrder {...restProps} agreementTableContent={agreementTableContent}/> */}
                    </Box>

                    <ActionBox mt={2}>
                        {activeStep<2 ? (
                            <Button type="button" role="primary" onClick={handleNext}>
                                مرحله بعد
                            </Button>
                        ):(
                            <Button type="button" role="primary" >
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
        
        </CardContent>
        </Card>
    )
}
