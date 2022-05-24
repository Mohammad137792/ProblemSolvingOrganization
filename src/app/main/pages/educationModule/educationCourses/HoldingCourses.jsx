
import React, { useState, useEffect } from 'react';
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ActionBox from "../../../components/ActionBox";
import Typography from "@material-ui/core/Typography";
import { SERVER_URL } from "../../../../../configs";
import { Box, Button, Card, Grid } from '@material-ui/core';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import CheckListCourse from './CheckListCourse'
import Certificate from './Certificate'
import CreatAssessment from './CreatAssessment'
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
const steps = [{
    label: "    مشخصات دوره ",
}, {
    label: " ارزیابی دوره",
}, {
    label: "  مدیریت گواهینامه و شایستگی",
}
]
    ;
const HoldingCourses = (props) => {
    const { curriculumCourseIdValue, selectedRows } = props
    const [curriculumCourseId, setCurriculumCourseId] = useState([]);
    const [activeStep, setActiveStep] = React.useState(0);
    const [tableContentList, setTableContentList] = useState([]);
    const [checkCertificate, setcheckCertificate] = useState(false)
    const [checkProfile, setCheckProfile] = useState(false)
    const [checkSkill, setCheckSkill] = useState(false)
    const [checkCertificateA, setcheckCertificateA] = useState(false)
    const [checkProfileA, setCheckProfileA] = useState(false)
    const [checkSkillA, setCheckSkillA] = useState(false)
    const [formValues, setFormValues] = useState({});
    const [formValuesAssessmenet, setFormValuesAssessmenet] = useState({});
    const [display, setdisplay] = useState(false);
    const [closeDialog, setcloseDialog] = useState(false);
    const [display1, setdisplay1] = useState(false);
    const [closeDialog1, setcloseDialog1] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const dispatch = useDispatch()
    console.log(selectedRows, "selectedRowsHHHHHHHHHHHHHHHHHH")
    console.log(formValuesAssessmenet,"formValuesAssessmenetqqqqqqqqqqqqqqqq")
    console.log(formValues,"formValuesqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")
    const axiosKey = {
        headers: {
            api_key: localStorage.getItem("api_key"),
        },
    };
    const saveDate = () => {
        console.log(checkCertificateA, "checkCertificateA..................")
        if (
             formValuesAssessmenet.profileDate ? formValuesAssessmenet.profileDate === undefined || null : true
                && formValuesAssessmenet.competenciesAssigneeDate ? formValuesAssessmenet.competenciesAssigneeDate === undefined || null : true
                    && formValuesAssessmenet.skillAssigneeDate ? formValuesAssessmenet.skillAssigneeDate === undefined || null : true

                        && formValues.profileDate ? formValues.profileDate === undefined || null : true
                            && formValues.competenciesAssigneeDate ? formValues.competenciesAssigneeDate === undefined || null : true
                                && formValues.skillAssigneeDate ? formValues.skillAssigneeDate === undefined || null : true)
            dispatch(setAlertContent(ALERT_TYPES.WARNING, ' حداقل یکی از فیلدهای فرم را پر کنید '));

        else
            setdisplay1(true)


    }
    const setClose1 = () => {
        setdisplay1(false)

    }
    const saveCertificate = () => {

        let data = {
            curriculumCourseId: curriculumCourseId[0]?.curriculumCourseId,
            profileDate: formValuesAssessmenet.profileDate,
            competenciesAssigneeDate: formValuesAssessmenet.competenciesAssigneeDate,
            skillAssigneeDate: formValuesAssessmenet.skillAssigneeDate


        }
        let dataByDatepiker = {
            curriculumCourseId: curriculumCourseId[0]?.curriculumCourseId,
            profileDate: formValues.profileDate,
            competenciesAssigneeDate: formValues.competenciesAssigneeDate,
            skillAssigneeDate: formValues.skillAssigneeDate


        }

        if ( formValuesAssessmenet.profileDate ? formValuesAssessmenet.profileDate === undefined || null : true
                && formValuesAssessmenet.competenciesAssigneeDate ? formValuesAssessmenet.competenciesAssigneeDate === undefined || null : true
                    && formValuesAssessmenet.skillAssigneeDate ? formValuesAssessmenet.skillAssigneeDate === undefined || null : true

                        && formValues.profileDate ? formValues.profileDate === undefined || null : true
                            && formValues.competenciesAssigneeDate ? formValues.competenciesAssigneeDate === undefined || null : true
                                && formValues.skillAssigneeDate ? formValues.skillAssigneeDate === undefined || null : true)
            dispatch(setAlertContent(ALERT_TYPES.WARNING, ' حداقل یکی از فیلدهای فرم را پر کنید '));

        else
        {

        if (checkCertificateA || checkSkillA || checkProfileA) {
            axios.post(SERVER_URL + "/rest/s1/training/saveDateCurriculum", { data: data }, axiosKey)
                .then(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setFormValues([])
                    setFormValuesAssessmenet([])
                    setdisplay1(false)
                    setDisableBtn(true)

                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });
        }
        if (checkCertificate || checkSkill || checkProfile) {


            axios.post(SERVER_URL + "/rest/s1/training/saveDateCurriculumByDatePiker", { data: dataByDatepiker }, axiosKey)
                .then(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setFormValues([])
                    setFormValuesAssessmenet([])
                    setdisplay1(false)
                    setDisableBtn(true)

                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });
        }
    }
    }

    const startLearningImpactProcess = () => {
        let processData = {
            basicToken: localStorage.getItem('Authorization'),
            id: 'learningImpactProcess',
            assessments: tableContentList,
            curriculumId: curriculumCourseId[0]?.curriculumId,
            courseTitle : selectedRows && selectedRows.length>0 ? selectedRows[0]?.title : '',
        }
        axios.post(SERVER_URL + "/rest/s1/training/startLearningProcess", processData, axiosKey)
            .then(() => {

            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            });
    }


    const handleNext = () => {
        if (activeStep == 1) {
            setdisplay(true)

        }
        if (activeStep === 0)
            setActiveStep((prevActiveStep) => prevActiveStep + 1);


        if (activeStep == 2)
            saveDate()

    }
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    }
    useEffect(() => {

        setCurriculumCourseId(curriculumCourseIdValue)

    }, [curriculumCourseIdValue]);

    const setClose = () => {
        setdisplay(false)

    }
    const start = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        startLearningImpactProcess()
        setdisplay(false)

        // setdisplay(false)



    }
    return (
        <Box >

            <Card style={{ padding: 10 }}>
                <Stepper alternativeLabel activeStep={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {/* {activeStep === steps.length ? (
                <Box>
                    <Typography variant={"caption"}>
                        تمام مراحل پایان یافت؛ در حال ارسال اطلاعات...
                    </Typography>
                </Box>
            ) : ( */}
                {selectedRows[0]?.status !== "Assessment" ? <Box>
                    {activeStep == 0 ? <Box >
                        <CheckListCourse curriculumCourseId={curriculumCourseId} />
                    </Box> : ""}
                    {activeStep == 1 ? <Box >
                        <CreatAssessment CurriculumCourseId={curriculumCourseId} tableContentList={tableContentList} setTableContentList={setTableContentList} />
                    </Box> : ""}
                    {activeStep == 2 ? <Box >
                        <Certificate curriculumCourseId={curriculumCourseId} checkCertificateA={checkCertificateA}
                            checkSkillA={checkSkillA} checkProfileA={checkProfileA} checkCertificate={checkCertificate} checkSkill={checkSkill}
                            setcheckCertificate={setcheckCertificate} setCheckProfile={setCheckProfile} setCheckProfileA={setCheckProfileA}
                            checkProfile={checkProfile} setCheckSkill={setCheckSkill} setcheckCertificateA={setcheckCertificateA} setCheckSkillA={setCheckSkillA}
                            saveDate={saveDate} formValuesAssessmenet={formValuesAssessmenet} formValues={formValues} setFormValuesAssessmenet={setFormValuesAssessmenet}
                            setFormValues={setFormValues} />
                    </Box> : ""}
                    <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "95%" }}>
                        {activeStep === 1 ? <Button type="button" role="secondary" disabled={activeStep <= 0} onClick={handleBack} variant="contained" style={{ background: "white", color: "black", height: "36px", width: 74 }} className="ml-10  mt-5">
                            بازگشت
                        </Button> : ""}
                        <Button type="button" role="primary" disabled={disableBtn} onClick={handleNext} style={{ width: 120, height: 36, backgroundColor: disableBtn ? "#ddd" : "#039be5", color: disableBtn ? "gray" : 'white' }} variant="contained" className="ml-10  mt-5">
                            {activeStep === 2 ? "تایید نهایی" : "مرحله بعد"}
                        </Button>

                    </Box>


                    <Dialog open={display}
                        onClose={closeDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">توجه</DialogTitle>
                        <DialogContent>"در صورت تایید  دیگر امکان مشاهده و ایجاد تغییر در رکورد وجود نداشته و فرایند ارزیابی آغاز می شود "</DialogContent>
                        <DialogActions>
                            <Button onClick={setClose} color="primary">انصراف</Button>
                            <Button onClick={start} color="primary" autoFocus>تایید</Button>
                        </DialogActions>
                    </Dialog>


                    <Dialog open={display1}
                        onClose={closeDialog1}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">توجه</DialogTitle>
                        <DialogContent>"در صورت تایید  نهایی دیگر امکان بازگشت به این مرحله وجود ندارد "</DialogContent>
                        <DialogActions>
                            <Button onClick={setClose1} color="primary">انصراف</Button>
                            <Button onClick={saveCertificate} color="primary" autoFocus>تایید</Button>
                        </DialogActions>
                    </Dialog>

                </Box> :
                    <Box>
                        <Certificate curriculumCourseId={curriculumCourseId} checkCertificateA={checkCertificateA}
                            checkSkillA={checkSkillA} checkProfileA={checkProfileA} checkCertificate={checkCertificate} checkSkill={checkSkill}
                            setcheckCertificate={setcheckCertificate} setCheckProfile={setCheckProfile} setCheckProfileA={setCheckProfileA}
                            checkProfile={checkProfile} setCheckSkill={setCheckSkill} setcheckCertificateA={setcheckCertificateA} setCheckSkillA={setCheckSkillA}
                            saveDate={saveDate} formValuesAssessmenet={formValuesAssessmenet} formValues={formValues} setFormValuesAssessmenet={setFormValuesAssessmenet}
                            setFormValues={setFormValues} />
                        <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "95%" }}>
                            <Button type="button" role="primary" onClick={saveCertificate} disabled={disableBtn} style={{ width: 120, height: 36, backgroundColor: disableBtn ? "#ddd" : "#039be5", color: disableBtn ? "gray" : 'white' }} variant="contained" className="ml-10  mt-5">
                                تایید نهایی
                            </Button>
                        </Box>
                    </Box>
                }

            </Card>



        </Box>
    )
}


export default HoldingCourses;


