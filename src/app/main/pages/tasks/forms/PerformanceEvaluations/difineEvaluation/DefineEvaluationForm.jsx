import React, { useState, useEffect, createRef, useRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, Grid } from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from 'configs';
import { setAlertContent, ALERT_TYPES } from 'app/store/actions';
import { useDialogReducer } from 'app/main/components/ConfirmDialog';
import DefineEvaluationStep from './steps/DefineEvaluationStep'
import EvaluatorDeterminationTest from './steps/evaluatorDetermination/EvaluatorDeterminationTest'
import DetermineTestTime from './steps/step3/DetermineTestTime';
import EvaluatorDeterminationDeegre from './steps/evaluatorDetermination/EvaluatorDeterminationDeegre';
import VerificatinLevel from './steps/evaluatorDetermination/VerificatinLevel';
import { toInteger } from 'lodash';
import CircularProgress from "@material-ui/core/CircularProgress";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';

const DefineEvaluationForm = () => {
    const [formValuesDefineEvaluation, setFormValuesDefineEvaluation] = useState([]);
    const [formValuesDifineEvaluator, setFormValuesDifineEvaluator] = useState({});
    const [formValuesDegreeEvaluation, setFormValuesDegreeEvaluation] = useState({});
    const [participants, setParticipants] = useState([]);
    const [evaluatingTableContent, setEvaluatingTableContent] = useState([]);
    const [processDefinitionId, setProcessDefinitionId] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useDispatch();
    const conformDialog = useDialogReducer(handle_nextStep)
    const [state, setState] = useState('Default');
    const [degreeEvaluationTableContent, setDegreeEvaluationTableContent] = useState([{ applicationType: undefined, questionnaireId: undefined, fullName: undefined, unit: undefined, position: undefined, appraiserRate: 1, psoudoId: undefined }])
    const [verificationTableContent, setVerificationTableContent] = useState([])
    const [oldDegreeEvaluationTableContent, setOldDegreeEvaluationTableContent] = useState([])
    const [formValuesDefineTestTime, setFormValuesDefineTestTime] = useState([]);
    const [verificationSeniorManager, setVerificationSeniorManager] = useState([]);
    const [degree, setDegree] = useState(90);
    const [showWarning, setShowWarning] = useState(false);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const myElement1 = createRef(0);
    const myElement = createRef(0);
    const myElement2 = React.createRef(0);
    const [bcolor, setBcolor] = useState("white")
    const [deadLineTime, setDeadLineDate] = useState({})
    const [waiting, setWaiting] = useState(false);
    const [EvaluationMethodEnumId, setEvaluationMethodEnumId] = useState([]);

    const steps = [{
        label: "     تعریف دوره ارزیابی ",
    }, {
        label: formValuesDefineEvaluation.evaluationMethodEnumId === "EM360Evaluation" ? " ارزیابی 360" : formValuesDefineEvaluation.evaluationMethodEnumId === "EMTest" ? "  تعیین فرم آزمون" : formValuesDefineEvaluation.evaluationMethodEnumId === "EMAssessmentCenter" ? "  کانون ارزیابی" : ""
    }, {
        label: formValuesDefineEvaluation.evaluationMethodEnumId === "EM360Evaluation" ? "تنظیم ساختار اعتراض" : formValuesDefineEvaluation.evaluationMethodEnumId === "EMTest" ? "  تعیین زمان آزمون" : "",
    }
    ]

    ////////////////camuda Config///////////////////

    function formatVariables(varObject) {
        let variables = {};
        Object.keys(varObject).map(key => {
            variables[key] = { value: varObject[key] }
        });
        return variables
    }

    function startProcess(processDefinitionId, formData) {
        return new Promise((resolve, reject) => {
            let variables = formatVariables(formData);

            const packet = {
                processDefinitionId: processDefinitionId,
                variables: variables
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/process/start", packet, {
                headers: { 'api_key': localStorage.getItem('api_key') },
                params: { basicToken: localStorage.getItem('Authorization') }
            }).then((res) => {
                resolve(res.data.id)
            }).catch(() => {
                reject()
            });
        })
    }

    function getTask(id) {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/fadak/process/task", {
                headers: { 'api_key': localStorage.getItem('api_key') },
                params: {
                    filterId: "7bbba147-5313-11eb-80ec-0050569142e7",
                    firstResult: 0,
                    maxResults: 15,
                    processInstanceId: id
                },
            }).then(res => {
                resolve(res.data._embedded.task[0].id)
            }).catch(err => {
                reject(err)
            });
        })
    }

    function submitTask(formData, taskId) {
        return new Promise((resolve, reject) => {
            let variables = formatVariables(formData);
            const packet = {
                taskId: taskId,
                variables: variables
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/process/form", packet, {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }


    const submitCallback = (formData) => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
        startProcess(processDefinitionId, formData).then(processId =>
            getTask(processId).then(taskId =>
                submitTask(formData, taskId).then(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                    setState("StartAnother")
                    setActiveStep(0);
                    setDegree(90)
                    let array = []
                    let obj = { applicationType: undefined, questionnaireId: undefined, fullName: undefined, unit: undefined, position: undefined, appraiserRate: 1, psoudoId: undefined, }
                    array.push(obj)
                    setDegreeEvaluationTableContent(array)
                    setFormValuesDefineEvaluation([])
                    setVerificationSeniorManager([])
                    setVerificationTableContent([])
                    setFormValuesDifineEvaluator([])
                    setFormValuesDefineEvaluation([])
                    setFormValuesDefineTestTime([])
                    setWaiting(false)
                }))).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
                    setWaiting(false)
                })
    }


    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/fadak/process/list", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setProcessDefinitionId(res.data.outList.find(i => i.key === "Evaluations").id)

        }).catch(() => {
        });
    }, [])



    ////////////////camunda Config////////////////////




    useEffect(() => {
        let filterparticipants = participants.filter(ar => !evaluatingTableContent.find(rm => (rm.partyRelationshipId === ar.partyRelationshipId)))
        let filterTableContent = evaluatingTableContent.filter(ar => participants.find(rm => (rm.partyRelationshipId === ar.partyRelationshipId)))
        // setEvaluatingTableContent(prevState => { return [...prevState, ...filterparticipants] })
        setEvaluatingTableContent(filterTableContent.concat(filterparticipants))
    }, [participants])

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }


    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluationMethod", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setEvaluationMethodEnumId(res.data.result)

        }).catch(err => {
        });


    }



    useEffect(() => {
        getEnum();

    }, []);

    const handle_nextStep = () => {

    }


    const parentCallBack = (childeValue) => {
        setDeadLineDate(childeValue)
    }


    function getNowDateTime() {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/evaluation/getNowDateTime", {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(res => {
                resolve(res.data.nowDateTime)
            }).catch(err => {
                reject(err)
            });
        })
    }


    const handleNext = () => {
        if (activeStep === 0 && formValuesDefineEvaluation.evaluationMethodEnumId !== "EMAssessmentCenter") {
            if ((formValuesDefineEvaluation.evaluationMethodEnumId === null || formValuesDefineEvaluation.evaluationMethodEnumId === undefined) || (formValuesDefineEvaluation.name === undefined || formValuesDefineEvaluation.name === null)
                || (formValuesDefineEvaluation.startDate === undefined || formValuesDefineEvaluation.startDate === null) || (formValuesDefineEvaluation.thruDate == undefined || formValuesDefineEvaluation.thruDate === null) || participants.length === 0) {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, '     ارزیابی شوندگان را انتخاب کنید   !'));
                myElement1.current.click();
            }
            else
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }


        if (activeStep === 1 && formValuesDefineEvaluation.evaluationMethodEnumId === "EM360Evaluation") {
            setOldDegreeEvaluationTableContent(degreeEvaluationTableContent)
            let add = 0
            degreeEvaluationTableContent.map((item, index) => {
                if (item.applicationType !== undefined || null || "")
                    add = add + 1

            })

            if ((formValuesDifineEvaluator.emplPositionId === undefined || null) || (add < degreeEvaluationTableContent.length) ||
                (formValuesDifineEvaluator.staff === true ? formValuesDifineEvaluator.daysOfDefineEvaluator === null || undefined || "" || !formValuesDifineEvaluator.daysOfDefineEvaluator : false) ||
                (formValuesDifineEvaluator.confirmationManager === true ? formValuesDifineEvaluator.numsOfManager === null || undefined || "" || !formValuesDifineEvaluator.numsOfManager : false)
                || (formValuesDifineEvaluator.confirmationManager === true ? formValuesDifineEvaluator.daysOfDefineEvaluatorByManager === null || undefined || "" || !formValuesDifineEvaluator?.daysOfDefineEvaluatorByManager : false)) {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'فیلد های اجباری را پر کنید   !'));
                myElement.current.click();
            }
            if (add < degreeEvaluationTableContent.length) {

                setShowWarning(true)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'با توجه به درجه ارزیابی جدول را  پر کنید   !'));

            }
            if (add >= 0 && !((formValuesDifineEvaluator.emplPositionId === undefined || null) || (add < degreeEvaluationTableContent.length) ||
                (formValuesDifineEvaluator.staff === true ? formValuesDifineEvaluator.daysOfDefineEvaluator === null || undefined || "" || !formValuesDifineEvaluator.daysOfDefineEvaluator : false) ||
                (formValuesDifineEvaluator.confirmationManager === true ? formValuesDifineEvaluator.numsOfManager === null || undefined || "" || !formValuesDifineEvaluator.numsOfManager : false)
                || (formValuesDifineEvaluator.confirmationManager === true ? formValuesDifineEvaluator.daysOfDefineEvaluatorByManager === null || undefined || "" || !formValuesDifineEvaluator?.daysOfDefineEvaluatorByManager : false))) {
                setShowWarning(false)
                setActiveStep((prevActiveStep) => prevActiveStep + 1);


            }
        }


        if (activeStep === 1 && formValuesDefineEvaluation.evaluationMethodEnumId === "EMTest") {
            let add = 0
            evaluatingTableContent.map((item, index) => {
                if (!item.questionnaireId)
                    add = add + 1

            })

            if (add > 0)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, '  به تمام ارزیابی شوندگان فرم ارزیابی را اختصاص دهید !'));
            else
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }



        if (activeStep == 2 && formValuesDefineEvaluation.evaluationMethodEnumId === "EMTest") {

            getNowDateTime().then(res => {


                let nowD = res.split(" ")[0]
                let nowT = res.split(" ")[1]




                let amPm = new Date(formValuesDefineTestTime.startDate).toLocaleTimeString('en-IR').split(" ")[1]
                let startTime = new Date(formValuesDefineTestTime.startDate).toLocaleTimeString('en-IR').split(":")
                let h = amPm === "PM" && toInteger(startTime[0]) !== 12 ? toInteger(startTime[0]) + 12 : startTime[0]



                let startEvaluation = 0
                if (formValuesDefineTestTime.startDate?.format("Y-MM-DD") === nowD && toInteger(h) < toInteger(nowT.split(":")[0]) || (toInteger(h) === toInteger(nowT.split(":")[0]) && toInteger(startTime[1]) < toInteger(nowT.split(":")[1]))) {
                    startEvaluation = startEvaluation + 1
                }



                let startDate1 = formValuesDefineTestTime.startDate?.format("Y-MM-DD") + "T" + h + ":" + startTime[1] + "+03:30"


                let corectAnswer = Math.floor((toInteger(deadLineTime.floatingTime?.split(":")[1]) + toInteger(startTime[1])) / 60)
                let redmine = (toInteger(deadLineTime.floatingTime?.split(":")[1]) + toInteger(startTime[1])) % 60
                let mT = corectAnswer > 0 ? redmine : (toInteger(deadLineTime.floatingTime?.split(":")[1]) + toInteger(startTime[1]))
                let hT = corectAnswer > 0 ? toInteger(h) + toInteger(corectAnswer) + toInteger(deadLineTime.floatingTime?.split(":")[0]) : toInteger(h) + toInteger(deadLineTime.floatingTime?.split(":")[0])
                let appFromDate = formValuesDefineTestTime.startDate?.format("Y-MM-DD") + " " + h + ":" + startTime[1] + ":" + "00"
                let appThruDate = formValuesDefineTestTime.startDate?.format("Y-MM-DD") + " " + hT + ":" + mT + ":" + "00"

                const answerTime = formValuesDefineTestTime.startDate?.format("Y-MM-DD") + "T" + hT + ":" + mT + ":" + "00" + "+03:30"
                const answerTimeM = formValuesDefineTestTime.startDate?.format("Y-MM-DD") + " " + hT + ":" + mT + ":" + "00"

                let inMap = {
                    fromDate: appFromDate,
                    thruDate: appThruDate
                }

                let answerData = {
                    statusId: "QstAnsIncompleted",
                    score: 0

                }
                evaluatingTableContent.map((item, index) => {
                    let questionnaireId = item.questionnaireId
                    axios.post(SERVER_URL + "/rest/s1/Suggestion/questionnaireApplication", { questionnaireId, inMap: inMap }, axiosKey)
                        .then((res) => {
                            item.questionnaireAppId = res.data.questionnaireAppId
                            axios.post(SERVER_URL + "/rest/s1/Suggestion/questionnaireAnswer", { partyRelationshipId: item.partyRelationshipId, questionnaireAppId: res.data.questionnaireAppId, inMap: answerData }, axiosKey)
                                .then((resAnswer) => {
                                    item.answerId = resAnswer.data.answerId
                                }).catch(() => {
                                });

                        }).catch(() => {
                        });

                })



                // var formValuesDate = formValuesDefineTestTime.startDate;
                // const endDate = new Date(formValuesDate);
                // var diffMs = (endDate - todayDate);
                // var diffDays = Math.floor(diffMs / 86400000); // days
                // var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                // var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                // var startDate = diffDays * 24 * 60 + diffHrs * 60 + diffMins






                let data = {
                    appFromDate: appFromDate,
                    appThruDate: appThruDate,
                    processType: "Evaluation",
                    result: "modify",
                    name: formValuesDefineEvaluation.name,

                    EvaluationPeriod: {
                        evaluationPeriodTitle: formValuesDefineEvaluation.name,
                        evaluationMethodEnumId: formValuesDefineEvaluation.evaluationMethodEnumId,
                        fromDate: formValuesDefineEvaluation.startDate,
                        thruDate: formValuesDefineEvaluation.thruDate,
                        description: formValuesDefineEvaluation.discription,
                        evaluationMethodEnumIdDis: EvaluationMethodEnumId.filter(item => item.enumId === formValuesDefineEvaluation.evaluationMethodEnumId)[0]?.description,
                    },
                    Appraisee: evaluatingTableContent,
                    deadLineTime: answerTime,
                    deadLineTimeM: answerTimeM,
                    evaluationList: evaluatingTableContent,
                    startEvaluationDateF: formValuesDefineTestTime.startDate,
                    // startEvaluationDateTime: startDate,
                    startEvaluationDateTime: startDate1,
                    updateData: {
                        evaluationPeriodStatusId: "EvPerCompleted"
                    },
                    saveData: {
                        EvaluationPeriod: {
                            evaluationPeriodTitle: formValuesDefineEvaluation.name,
                            evaluationPeriodTypeEnumId: formValuesDefineEvaluation.evaluationMethodEnumId,
                            fromDate: formValuesDefineEvaluation.startDate,
                            thruDate: formValuesDefineEvaluation.thruDate,
                            description: formValuesDefineEvaluation.discription,
                            creatorPartyRelationshipId: partyRelationshipId,
                            // evaluationPeriodStatusId: evalAccepted,
                        },
                        Appraisee: evaluatingTableContent,
                    }



                }
                if (deadLineTime.floatingTime === undefined || deadLineTime.floatingTime === null || deadLineTime.floatingTime === "" || formValuesDefineTestTime.startDate === undefined || formValuesDefineTestTime.startDate === null) {
                    myElement2.current.click();
                    setBcolor("#ff0007")
                }
                else {


                    if (deadLineTime.floatingTime === undefined || deadLineTime.floatingTime === null || deadLineTime.floatingTime === "") { setBcolor("#ff0007") }

                    if (toInteger(deadLineTime.floatingTime?.split(":")[1]) >= 60) {
                        // setBcolor("#ff0007")
                        setWaiting(false)

                        dispatch(setAlertContent(ALERT_TYPES.ERROR, '  مهلت پاسخ گویی معتبر نمی باشد !'));

                    }

                    if (toInteger(deadLineTime.floatingTime?.split(":")[1]) < 60 && deadLineTime.floatingTime !== undefined && deadLineTime.floatingTime !== null && deadLineTime.floatingTime !== "" && formValuesDefineTestTime.startDate !== undefined && formValuesDefineTestTime.startDate !== null) {
                        setBcolor("white")
                        if (startEvaluation > 0) {
                            dispatch(setAlertContent(ALERT_TYPES.ERROR, '  زمان شروع آزمون معتبر نمی باشد !'));
                            setWaiting(false)
                        }

                        else {
                            setWaiting(true)
                            submitCallback(data)
                            setParticipants([])


                        }


                        // if (startDate < 0)
                        //     dispatch(setAlertContent(ALERT_TYPES.ERROR, '  ساعت شروع آزمون باید بعد ساعت اکنون باشد !'));
                        // else {
                        //     // submitCallback(data)
                        //     // setParticipants([])

                        // }


                    }
                }



            }).catch(err => { })

        }

        if (activeStep == 2 && formValuesDefineEvaluation.evaluationMethodEnumId === "EM360Evaluation") {
            getNowDateTime().then(res => {
                let nowD = res.split(" ")[0]
                let nowT = res.split(" ")[1]

                setWaiting(true)
                participants.map((item, i) => {

                    item.Evaluater = degreeEvaluationTableContent
                })



                let VerList = []



                {
                    verificationSeniorManager.map((item, index) => {
                        let element = {}

                        element.emplPositionId = item.emplPositionId ?? item.emplPositionId
                        element.modify = item.modify ?? item.modify
                        element.reject = item.reject ?? item.reject
                        element.sequence = item.sequence ?? item.sequence
                        element.typeAccess = item.typeAccess ?? item.typeAccess
                        element.active = index == 0 ? true : false
                        VerList.push(element)
                    }
                    )
                }

                var today = new Date();
                var nowTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                var EvaluatorDate = new Date(res);
                var EvaluatorDaysToAdd = toInteger(formValuesDifineEvaluator.daysOfDefineEvaluator);
                EvaluatorDate.setDate(EvaluatorDate.getDate() + EvaluatorDaysToAdd);
                var dd = EvaluatorDate.getDate();
                var mm = EvaluatorDate.getMonth() + 1;
                var y = EvaluatorDate.getFullYear();
                var EvaluatorDate = y + '-' + mm + '-' + dd + "T" + nowT + "+03:30";


                var mansgerDate = new Date(res);
                var managerDaysToAdd = toInteger(formValuesDifineEvaluator.daysOfDefineEvaluatorByManager);
                mansgerDate.setDate(mansgerDate.getDate() + managerDaysToAdd);
                var dd = mansgerDate.getDate();
                var mm = mansgerDate.getMonth() + 1;
                var y = mansgerDate.getFullYear();
                var mansgerDate = y + '-' + mm + '-' + dd + "T" + nowT + "+03:30";



                var nextDate = new Date(res);
                nextDate.setDate(nextDate.getDate() + 1000);
                var ddN = nextDate.getDate();
                var mmN = nextDate.getMonth() + 1;
                var yN = nextDate.getFullYear();

                let data = {
                    updateData: {
                        evaluationPeriodStatusId: "EvPerCompleted"
                    },
                    nowTime: nowTime,
                    name: formValuesDefineEvaluation.name,
                    startEvaluationDate: yN + '-' + mmN + '-' + ddN + "T" + nowT + "+03:30",
                    difineEvaluator: formValuesDifineEvaluator.staff ? true : false,
                    resultAp: toInteger(formValuesDifineEvaluator?.numsOfManager) > 0 ? true : false,
                    result: "reject",
                    degree: degree,
                    processType: "Evaluation",
                    type: formValuesDifineEvaluator.staff ? true : false,
                    evaluationMethodEnumId: formValuesDefineEvaluation.evaluationMethodEnumId,
                    EvaluationPeriod: {
                        evaluationPeriodTitle: formValuesDefineEvaluation.name,
                        evaluationMethodEnumId: formValuesDefineEvaluation.evaluationMethodEnumId,
                        fromDate: formValuesDefineEvaluation.startDate,
                        thruDate: formValuesDefineEvaluation.thruDate,
                        description: formValuesDefineEvaluation.discription,
                        evaluationMethodEnumIdDis: EvaluationMethodEnumId.filter(item => item.enumId === formValuesDefineEvaluation.evaluationMethodEnumId)[0]?.description,
                    },
                    Appraisee: participants,
                    AppraiseeList: participants,
                    degreeEvaluationTableContent: degreeEvaluationTableContent,
                    responsibleExpertEmplPositionId: formValuesDifineEvaluator.emplPositionId,
                    confirmationByAppraisee: formValuesDifineEvaluator.staff,
                    // daysOfDefineEvaluator: toInteger(formValuesDifineEvaluator.daysOfDefineEvaluator),
                    daysOfDefineEvaluator: EvaluatorDate,
                    confirmationByManager: formValuesDifineEvaluator.confirmationManager,
                    numsOfManager: formValuesDifineEvaluator.numsOfManager ? formValuesDifineEvaluator.numsOfManager : 0,
                    // daysOfDefineEvaluatorByManager: toInteger(formValuesDifineEvaluator.daysOfDefineEvaluatorByManager),
                    daysOfDefineEvaluatorByManager: mansgerDate,
                    VerificationListOfSeniorManager: VerList?.length > 0 ? VerList.sort(function (a, b) {
                        return a.sequence - b.sequence
                    }) : [],
                    creatorPartyRelationshipId: partyRelationshipId,
                    ObjectionVerificationLevel: verificationTableContent?.length > 0 ? verificationTableContent.sort(function (a, b) {
                        return a.sequence - b.sequence
                    }) : []



                }
                submitCallback(data)
                setParticipants([])
            }).catch(err => { })

        }


    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    }





    return (
        <FusePageSimple
            content={
                <Box p={2}>

                    <Stepper alternativeLabel activeStep={activeStep}>
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel>{step.label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {/* <Box> */}
                    {activeStep == 0 ?
                        <DefineEvaluationStep myElement1={myElement1} formValuesDefineEvaluation={formValuesDefineEvaluation} setFormValuesDefineEvaluation={setFormValuesDefineEvaluation} participants={participants} setParticipants={setParticipants} />
                        : ""}
                    {activeStep == 1 ?
                        formValuesDefineEvaluation.evaluationMethodEnumId === "EMTest" ? <EvaluatorDeterminationTest evaluatingTableContent={evaluatingTableContent} setEvaluatingTableContent={setEvaluatingTableContent} /> : formValuesDefineEvaluation.evaluationMethodEnumId === "EM360Evaluation" ?
                            <EvaluatorDeterminationDeegre
                                degreeEvaluationTableContent={degreeEvaluationTableContent}
                                setDegreeEvaluationTableContent={setDegreeEvaluationTableContent}
                                formValuesDegreeEvaluation={formValuesDegreeEvaluation}
                                setFormValuesDegreeEvaluation={setFormValuesDegreeEvaluation}
                                degree={degree} setDegree={setDegree}
                                formValuesDifineEvaluator={formValuesDifineEvaluator}
                                verificationSeniorManager={verificationSeniorManager}
                                setVerificationSeniorManager={setVerificationSeniorManager}
                                setShowWarning={setShowWarning}
                                setFormValuesDifineEvaluator={setFormValuesDifineEvaluator} myElement={myElement} showWarning={showWarning} /> : ""
                        : ""}
                    {activeStep == 2 ?
                        formValuesDefineEvaluation.evaluationMethodEnumId === "EMTest" ? <DetermineTestTime myElement={myElement2}
                            formValuesDefineTestTime={formValuesDefineTestTime} bcolor={bcolor} parentCallBack={parentCallBack} setBcolor={setBcolor}
                            setFormValuesDefineTestTime={setFormValuesDefineTestTime}
                        /> : <Card style={{ paddingBottom: "30%" }}>

                            <CardContent ><VerificatinLevel
                                verificationTitle="تنظیم سلسله مراتب بررسی اعتراضات"
                                verificationTableContent={verificationTableContent} setVerificationTableContent={setVerificationTableContent} />
                            </CardContent>
                        </Card>
                        : ""}

                    <Grid item xs={12} >
                        <ActionBox>
                            <Button type="button" role="primary" onClick={handleNext}
                                variant="contained" className="ml-10  mt-5" disabled={activeStep === 2 ? waiting : false} endIcon={waiting && activeStep === 2 ? <CircularProgress size={20} /> : null}>
                                {activeStep === 2 ? " ایجاد دوره ارزیابی" : "مرحله بعد"}
                            </Button>
                            {activeStep > 0 ? <Button type="button" role="secondary" disabled={activeStep <= 0 || waiting} onClick={handleBack} variant="contained" className="ml-10  mt-5">
                                بازگشت
                            </Button> : ""}
                        </ActionBox>
                    </Grid>


                    {/* </Box> */}

                </Box>
            }
        />
    );
};

export default DefineEvaluationForm;
