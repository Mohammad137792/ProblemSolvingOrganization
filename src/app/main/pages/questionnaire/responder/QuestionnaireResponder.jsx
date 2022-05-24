import React, { forwardRef } from "react";
import QuestionnaireView from "../view/QuestionnaireView";
import axios from "../../../api/axiosRest";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import ReportProblemRoundedIcon from "@material-ui/icons/ReportProblemRounded";
import { red } from "@material-ui/core/colors";

 const QuestionnaireResponder = forwardRef((props , ref)=> {
    const { answerId, processConfirmation, readOnly, loadAnswer, parentCallback,errorCallback, btnShow = true }=props
    const [questionnaire, set_questionnaire] = React.useState(null);
    const [loading, set_loading] = React.useState(true);

    const completedCallback = (answer) => {
        return new Promise((resolve, reject) => {
            axios.post("/s1/questionnaire/answer", {
                answerId,
                answerItems: answer,
                questionnaireId: questionnaire.questionnaireId
            }).then(res => {
                if(parentCallback)
                    parentCallback(res.data.score)
                resolve()
                if (processConfirmation)
                    processConfirmation()
            }).catch((err) => {
                if(errorCallback)
                errorCallback(err.response.status)
                reject()
            })
        })
    }

    React.useEffect(() => {
        set_loading(true)
        axios.get("/s1/questionnaire/responder?answerId=" + answerId).then(res => {
            set_questionnaire(res.data.questionnaire)
            set_loading(false)
        }).catch(() => {
            set_questionnaire(null)
            set_loading(false)
        })
    }, [answerId])

    if (loading) return (
        <Box textAlign="center" color="text.secondary" p={4}>
            <CircularProgress />
            <Typography variant={"body1"}>در حال دریافت اطلاعات</Typography>
        </Box>
    )
    if (questionnaire) return (
        <QuestionnaireView questionnaire={questionnaire} completedCallback={completedCallback} answerId={answerId} readOnly={readOnly} loadAnswer={loadAnswer} ref={ref} btnShow={btnShow} />
    )
    return (
        <Box textAlign="center" p={4}>
            <Box textAlign="center">
                <ReportProblemRoundedIcon style={{ fontSize: 100, color: red[50] }} />
            </Box>
            <Box mb={1} style={{ color: red[700] }}>
                <Typography variant="body1"><b>خطا در نمایش پرسشنامه</b></Typography>
            </Box>
            <Typography variant="body1" color="textSecondary">پرسشنامه مورد نظر یافت نشد!</Typography>
        </Box>
    )
})
export default QuestionnaireResponder;
