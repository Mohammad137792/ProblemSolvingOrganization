import React from "react";
import Box from "@material-ui/core/Box";
import {Grid, Tab, Tabs} from "@material-ui/core";
import FormInput from "../../../components/formControls/FormInput";
import axios from "../../../api/axiosRest";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";
import SurveyAnalysisByQuestions from "./SurveyAnalysisByQuestions";
import SurveyAnalysisByParticipants from "./SurveyAnalysisByParticipants";
import {useHistory} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() => ({
    tabs: {
        borderBottom: "1px solid #ddd",
        width: "100%"
    },
    cardDisplay: {
        padding: "16px",
        backgroundColor: blue[50]
    }
}));

export default function SurveyAnalysis({questionnaireAppId,code}) {
    const classes = useStyles()
    const [tabValue, setTabValue] = React.useState(0);
    const [survey, set_survey] = React.useState({})
    const [questionnaire, set_questionnaire] = React.useState(null)
    const [waiting, set_waiting] = React.useState(true)

    const formStructure = [
        {
            name    : "name",
            label   : "عنوان",
            type    : "display",
            variant : "display",
        },{
            name    : "code",
            label   : "کد رهگیری",
            type    : "display",
            variant : "display",
            value: code
        },{
            name    : "fromDate",
            label   : "تاریخ ارسال",
            type    : "display",
            variant : "display",
            options : "Date",
        },{
            name    : "statusId",
            label   : "وضعیت نظرسنجی",
            type    : "display",
            variant : "display",
            options : "StaQuestionnaireApplication",
            optionIdField: "statusId"
        },{
            name    : "totalParticipants",
            label   : "تعداد مخاطبان",
            type    : "display",
            variant : "display",
        },{
            name    : "numberOfParticipated",
            label   : "تعداد شرکت کننده ها",
            type    : "display",
            variant : "display",
            options : "Render",
            render  : (obj) => {
                const numberOfParticipated = obj.numberOfParticipated||0;
                const totalParticipants = obj.totalParticipants||1;
                return `${numberOfParticipated} (%${numberOfParticipated / totalParticipants * 100})`
            }
        }]

    React.useEffect(()=>{
        axios.get("/s1/survey/surveyAnalysis?questionnaireAppId="+questionnaireAppId).then(res => {
                set_survey({
                    ...res.data.survey,
                    totalParticipants: res.data.totalParticipants,
                    numberOfParticipated: res.data.answerStatusStat.find(i=>i.QstAnsCompleted)?.QstAnsCompleted||0
                })
                let updatedPages = res.data.questionnaireWithStat.pages
                let offset = 1
                for (let i in updatedPages) {
                    updatedPages[i].startNumber = offset
                    offset += updatedPages[i].elements?.length
                }
                set_waiting(false)
                set_questionnaire(res.data?.questionnaireWithStat)
            
        }).catch(() => {
            set_survey({})
            set_questionnaire(null)
        });
    },[questionnaireAppId])

    return (
        <Box>
            <Box p={2}>
                <Card variant="outlined" className={classes.cardDisplay}>
                    <Grid container spacing={2} >
                        {formStructure.map((input,index)=>(
                            <Grid key={index} item xs={input.col || 4}>
                                <FormInput {...input} emptyContext={"─"} grid={false} valueObject={survey}/>
                            </Grid>
                        ))}
                    </Grid>
                </Card>
            </Box>
            <Tabs indicatorColor="secondary" textColor="secondary"
                  variant="scrollable" scrollButtons="on"
                  value={tabValue} onChange={(e,newValue)=>setTabValue(newValue)}
                  className={classes.tabs}
            >
                <Tab label="به تفکیک سوالات" />
                <Tab  disabled={waiting} endIcon={waiting?<CircularProgress size={20}/>:null}  label="به تفکیک شرکت کنندگان"/>
            </Tabs>
            <Box p={2}>
                <Card>
                    {tabValue===0 &&
                    <SurveyAnalysisByQuestions questionnaire={questionnaire} data={{
                        totalParticipants: survey.totalParticipants,
                        numberOfParticipated: survey.numberOfParticipated,
                        questionnaireAppId: questionnaireAppId
                    }}/>
                    }
                    {tabValue===1 &&
                    <SurveyAnalysisByParticipants  questionnaire={questionnaire} data={{
                        questionnaireAppId: questionnaireAppId
                    }}/>
                    }
                </Card>
            </Box>
        </Box>
    )
}
