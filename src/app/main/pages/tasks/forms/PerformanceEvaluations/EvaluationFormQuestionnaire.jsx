import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, Grid, makeStyles, Typography } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import { SERVER_URL } from 'configs';
import QuestionnaireResponder from 'app/main/pages/questionnaire/responder/QuestionnaireResponder';
import { useDispatch } from 'react-redux';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import CircularProgress from "@material-ui/core/CircularProgress";
import ActionBox from 'app/main/components/ActionBox';
import DoneIcon from '@material-ui/icons/Done';
import CloudDoneRoundedIcon from '@material-ui/icons/CloudDoneRounded';
import { green, red } from '@material-ui/core/colors';
import EvaluationInfo from './EvaluatorSuugstion/EvaluationInfo';

const useStyles = makeStyles((theme) => ({
    completedIcon: {
        color: green[100],
        fontSize: 100
    },
    completedDialog: {
        color: "#58805a"
    },
    failedIcon: {
        color: red[50],
        fontSize: 100
    },
    failedDialog: {
        color: red[700]
    }
}));


const EvaluationFormQuestionnaire = (props) => {
    const { formVariables, submitCallback = true, setAction } = props;
    const completedRef = useRef();
    const [formValuesDefineEvaluation, setFormValuesDefineEvaluation] = useState([])
    const [formValuesEvaluator, setFormValuesEvaluator] = useState([])
    const [formValuesAppraisee, setFormValuesAppraisee] = useState([])
    const [EvaluationMethodEnumId, setEvaluationMethodEnumId] = useState([])
    const [answerId, setAnswerId] = useState([])
    const [applicationType, setApplicationType] = useState([])
    const [btnShow, setBtnShow] = useState(false)
    const dispatch = useDispatch();
    const [childAnswer, setChildAnswer] = useState("dontSubmit")
    const [childError, setChildError] = useState("dontError")
    const [waiting, setwaiting] = useState(false)
    const [waiting1, setwaiting1] = useState(false)
    const classes = useStyles();
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructureEvaluation = [
        {
            name: "code",
            label: "کد رهگیری دوره ارزیابی",
            type: "text",
            readOnly: true,
            col: 4
        }, {
            name: "evaluationPeriodTitle",
            label: " عنوان دوره ارزیابی",
            type: "text",
            col: 4,
            readOnly: true,


        }, {
            name: "evaluationMethodEnumId",
            label: "روش ارزیابی",
            type: "select",
            options: EvaluationMethodEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            readOnly: true,
            col: 4
        }, {
            name: "fromDate",
            label: "تاریخ شروع ارزیابی",
            type: "date",
            readOnly: true,
            col: 4
        }, {
            name: "thruDate",
            label: "تاریخ پایان ارزیابی",
            type: "date",
            readOnly: true,
            col: 4
        },
        , {
            name: "description",
            label: "  توضیحات",
            type: "textarea",
            readOnly: true,
            col: 4
        }
    ]

    const formStructureAppraisee = [
        {
            name: "pseudoId",
            label: "کد  پرسنلی",
            type: "text",
            readOnly: true,
            col: 3
        }, {
            name: "fullName",
            label: "نام و نام خانوادگی",
            type: "text",
            col: 3,
            readOnly: true,


        }, {
            name: "organizationName",
            label: " واحد سازمانی",
            type: "text",
            readOnly: true,
            col: 3
        }, {
            name: "emplPosition",
            label: "پست سازمانی",
            type: "text",
            readOnly: true,
            col: 3
        }


    ]
    const formStructureEvalutor = [
        {
            name: "pseudoId",
            label: "کد  پرسنلی",
            type: "text",
            readOnly: true,
            col: 3
        }, {
            name: "fullName",
            label: "نام و نام خانوادگی",
            type: "text",
            col: 3,
            readOnly: true,


        }, {
            name: "organizationName",
            label: " واحد سازمانی",
            type: "text",
            readOnly: true,
            col: 3
        }, {
            name: "emplPosition",
            label: "پست سازمانی",
            type: "text",
            readOnly: true,
            col: 3
        },
        {
            name: "type",
            label: " دسته بندی  ",
            type: "select", style: { minWidth: "90px" },
            options: applicationType,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 3,
            readOnly: true,
        }


    ]
    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluationMethod", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setEvaluationMethodEnumId(res.data.result)

        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluatorLevel", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setApplicationType(res.data.result)
        }).catch(err => {
        });
    }



    useEffect(() => {
        getEnum();


    }, []);

    useEffect(() => {
        setFormValuesDefineEvaluation(prevState => ({
            ...prevState,
            code: formVariables?.trackingCode?.value,
            evaluationPeriodTitle: formVariables?.EvaluationPeriod?.value.evaluationPeriodTitle,
            evaluationMethodEnumIdDis: formVariables?.EvaluationPeriod?.value.evaluationMethodEnumIdDis,
            fromDate: new Date(formVariables?.EvaluationPeriod?.value.fromDate).toLocaleDateString('fa-IR'),
            thruDate: new Date(formVariables?.EvaluationPeriod?.value.thruDate).toLocaleDateString('fa-IR'),
            description: formVariables?.EvaluationPeriod?.value.description,
        }))

        if (formVariables?.evaluator?.value) {

            setAnswerId(formVariables?.evaluator?.value?.participator.answerId)
            setFormValuesAppraisee(prevstate => ({
                ...prevstate,
                fullName: formVariables?.evaluator?.value?.appraisee?.fullName,
                emplPosition: formVariables?.evaluator?.value?.appraisee?.emplPosition,
                organizationName: formVariables?.evaluator?.value?.appraisee?.unit,
                pseudoId: formVariables?.evaluator?.value?.appraisee?.pseudoId,
            }))
            setFormValuesEvaluator(prevstate => ({
                ...prevstate,
                fullName: formVariables?.evaluator?.value?.participator?.fullName,
                emplPosition: formVariables?.evaluator?.value?.participator?.emplPosition,
                organizationName: formVariables?.evaluator?.value?.participator?.unit,
                pseudoId: formVariables?.evaluator?.value?.participator?.pseudoId,
                type: formVariables?.evaluator?.value?.participator?.appraisalTypeEnumId,
            }))
        }

        else {
            // let partyRelationshipId = formVariables.evaluation.value.partyRelationshipId
            // let questionnaireAppId = formVariables.evaluation.value.questionnaireAppId
            // axios.post(SERVER_URL + "/rest/s1/Suggestion/questionnaireAnswer", { partyRelationshipId: partyRelationshipId, questionnaireAppId: questionnaireAppId }, axiosKey)
            //     .then((res) => {
            //         setAnswerId(res.data.answerId)
            //     }).catch(() => {
            //     });
            setAnswerId(formVariables?.evaluation?.value?.answerId)
            setFormValuesAppraisee(formVariables?.evaluation?.value)
            setFormValuesEvaluator(formVariables?.evaluation?.value)
        }


    }, [formVariables]);

    const parentCallback = (childAnswer) => {
        setChildAnswer(childAnswer)
    }
    const errorCallback = (childError) => {
        setChildError(childError)


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



    // var todayDate = new Date();
    // var formValuesDate = formVariables?.deadLineTimeM?.value;
    // const endDate = new Date(formValuesDate);
    // var diffMs = (endDate - todayDate);
    // var diffDays = Math.floor(diffMs / 86400000); // days
    // var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    // var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    // var startDate = diffDays * 24 * 60 + diffHrs * 60 + diffMins

    const handleEnd = () => {
        getNowDateTime().then(res => {
            var todayDate = new Date(res);
            var formValuesDate = formVariables?.deadLineTimeM?.value;
            const endDate = new Date(formValuesDate);
            var diffMs = (endDate - todayDate);
            var diffDays = Math.floor(diffMs / 86400000); // days
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            var startDate = diffDays * 24 * 60 + diffHrs * 60 + diffMins
            if (formVariables?.deadLineTimeM?.value) {
                if (startDate <= 0) {
                    setwaiting(false)

                    dispatch(setAlertContent(ALERT_TYPES.ERROR, '  مهلت پاسخ گویی به پایان رسیده است. !'));

                }
                else {
                    if (completedRef?.current) {
                        setwaiting(true)
                        completedRef.current.completed();

                    }
                }
            }

            else {

                if (completedRef?.current) {
                    setwaiting(true)
                    completedRef.current.completed();
                }
            }



        }).catch(err => { })
    }



    const handleSave = () => {
        getNowDateTime().then(res => {
            var todayDate = new Date(res);
            var formValuesDate = formVariables?.deadLineTimeM?.value;
            const endDate = new Date(formValuesDate);
            var diffMs = (endDate - todayDate);
            var diffDays = Math.floor(diffMs / 86400000); // days
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            var startDate = diffDays * 24 * 60 + diffHrs * 60 + diffMins



            if (formVariables?.deadLineTimeM?.value) {
                if (startDate <= 0) {
                    setwaiting1(false)

                    dispatch(setAlertContent(ALERT_TYPES.ERROR, '  مهلت پاسخ گویی به پایان رسیده است. !'));

                }
                else {
                    if (completedRef?.current) {
                        setwaiting1(true)

                        completedRef.current.completed();
                    }
                }
            }

            else {

                if (completedRef?.current) {
                    setwaiting1(true)
                    completedRef.current.completed();
                }
            }

        }).catch(err => { })

    }

    useEffect(() => {
        let data = {
            resultForm: waiting ? true : false
        }
        if (childAnswer !== "dontSubmit") {
            submitCallback(data)
        }


    }, [childAnswer])

    useEffect(() => {
        if (childError !== "dontError") {

            setwaiting(false)
            setwaiting1(false)
            setChildError("dontError")
        }

    }, [childError])

    const QuestionnaireResponderForm = (answerId) => {
        if (answerId && childAnswer === "dontSubmit")
            return <QuestionnaireResponder answerId={answerId} ref={completedRef} btnShow={btnShow} parentCallback={parentCallback} errorCallback={errorCallback} loadAnswer={formVariables?.resultForm?.value === false ? true : false} />
        if (answerId && childAnswer !== "dontSubmit")
            return <CardContent>
                <Box textAlign="center" p={10}>
                    <Box mb={3}>
                        <CloudDoneRoundedIcon className={classes.completedIcon} />
                    </Box>
                    <Typography variant={"body1"} className={classes.completedDialog}>{"از وقتی که برای پاسخ گویی به پرسشنامه گذاشتید، صمیمانه سپاسگزاریم!"}</Typography>
                </Box>
            </CardContent>
        if (!answerId)
            return <Box></Box>

    }

    return (
        <Box >
            <Card >
                <CardHeader title="  فرم ارزیابی عملکرد" />
                <Card style={{ margin: 5 }}>
                    <EvaluationInfo profileValues={formValuesDefineEvaluation} />
                </Card>
                <Card style={{ padding: 5, margin: 5 }}>
                    <CardHeader title="مشخصات ارزیابی شونده" />
                    <FormPro
                        formValues={formValuesAppraisee}
                        setFormValues={setFormValuesAppraisee}
                        append={formStructureAppraisee}
                    />

                </Card>
                {formVariables?.EvaluationPeriod?.value.evaluationMethodEnumId !== 'EMTest' ? <Card style={{ padding: 5, margin: 5 }}>
                    <CardHeader title="مشخصات ارزیابی کننده" />
                    <FormPro
                        formValues={formValuesEvaluator}
                        setFormValues={setFormValuesEvaluator}
                        append={formStructureEvalutor}

                    />

                </Card> : ""}
                <Card>
                    {QuestionnaireResponderForm(answerId)}
                    {/* {answerId?<QuestionnaireResponder answerId={answerId} ref={completedRef} btnShow={btnShow} parentCallback={parentCallback} loadAnswer />: ""} */}
                </Card>



                <Grid item xs={12} style={{ margin: 10 }}>
                    <ActionBox>
                        <Button type="button" onClick={handleEnd} role="primary" disabled={waiting1 ? waiting1 : waiting} endIcon={waiting ? <CircularProgress size={20} /> : null}> تکمیل</Button>

                        {/* <Button type="button" onClick={handleSave} role="secondary" disabled={waiting ? waiting : waiting1} endIcon={waiting1 ? <CircularProgress size={20} /> : null}>ثبت موقت</Button> */}

                    </ActionBox>
                </Grid>
            </Card>
        </Box>
    );
};

export default EvaluationFormQuestionnaire;