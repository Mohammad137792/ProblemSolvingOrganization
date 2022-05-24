import React, { forwardRef, useImperativeHandle } from "react";
import { CardContent, Typography } from "@material-ui/core";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import QVPage from "./QVPage";
import Box from "@material-ui/core/Box";
import DoneIcon from '@material-ui/icons/Done';
import CloudDoneRoundedIcon from '@material-ui/icons/CloudDoneRounded';
import { green, red } from '@material-ui/core/colors';
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import axios from "../../../api/axiosRest";

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

export const shuffle = function (inArray) {
    let array = Object.assign([], inArray)
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

const QuestionnaireView = forwardRef((props, ref) => {
    const { btnShow=true, questionnaire, answerId, readOnly, loadAnswer, completedCallback = (ans) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 1000)
        })
    } } = props


    const classes = useStyles();
    const [waiting, set_waiting] = React.useState(false);
    const [failed, set_failed] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [pages, setPages] = React.useState([]);
    const [displayBack, setDisplayBack] = React.useState(false);
    const [disabledNext, setDisabledNext] = React.useState(true);
    const [answer, setAnswer] = React.useState({});

    useImperativeHandle(ref, () => ({
        completed() {
            finalization()
        }
    }));

    const setQuestionAnswer = (elementId, elementAnswer) => {
        setAnswer(prevState => ({
            ...prevState,
            [elementId]: elementAnswer
        }))
    }

    const finalization = () => {
        set_waiting(true)
        completedCallback(answer).then(() => {
            set_waiting(false)
            set_failed(false)
        }).catch(() => {
            set_waiting(false)
            if(btnShow) {
                set_failed(true)
            } else {
                setActiveStep(pages.length-1)
            }
        })
    }

    React.useEffect(() => {
        let pgs = JSON.parse(JSON.stringify(questionnaire.pages.filter(i => i.display === "Y")))
        switch (questionnaire.pagesArrangementEnumId) {
            case "ArrSequence":
                pgs = pgs.sort((a, b) => a.sequenceNum - b.sequenceNum)
                break
            case "ArrRandom":
                pgs = shuffle(pgs)
                break
            default:
        }
        let offset = 1
        for (let i in pgs) {
            pgs[i].startNumber = offset
            for (let j in pgs[i].elements) {
                if (!pgs[i].elements[j].elementId) {
                    const number = offset + Number(j)
                    pgs[i].elements[j].elementId = `preview-q#${number}`
                }
            }
            offset += pgs[i].elements.filter(i => i.display === "Y").length
        }
        setPages(pgs)
        setAnswer({})
    }, [questionnaire])

    React.useEffect(() => {
        if (activeStep > 0 && activeStep === pages.length) {
            finalization()
        } else if (activeStep) {
            let backButton = pages[activeStep].backButtonDisplayEnumId
            if (backButton === "DispInherit")
                backButton = questionnaire.backButtonDisplayEnumId
            setDisplayBack(backButton === "DispShow" || readOnly)
        } else {
            setDisplayBack(false)
        }
    }, [activeStep])

    React.useEffect(() => {
        let isAllAnswered = true
        pages[activeStep] && pages[activeStep].elements.filter(i => i.display === "Y" && i.required === "Y").forEach(elem => {
            if (elem.type === "check") {
                const checks = answer[elem.elementId]?.value || []
                let isElemAnswered = false
                for (let i in checks) {
                    isElemAnswered = isElemAnswered || checks[i].checked
                }
                isAllAnswered = isAllAnswered && isElemAnswered
            } else {
                const ans = answer[elem.elementId]?.value || ""
                isAllAnswered = isAllAnswered && (ans.trim().length > 0)
            }
            return !isAllAnswered
        })
        setDisabledNext(!isAllAnswered)
    }, [pages, answer, activeStep])

    React.useEffect(() => {
        if ((readOnly || loadAnswer) && answerId) {
            axios.get("/s1/questionnaire/responder/answer?answerId=" + answerId).then(res => {
                setAnswer(res.data.answer)
            }).catch(() => { })
        }
    }, [readOnly, loadAnswer, answerId])

    const handleNext = () => {
        if (activeStep + 1 === pages.length) {
            set_waiting(true)
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    if (waiting) return (
        <CardContent>
            <Box textAlign="center" color="text.secondary" p={10}>
                <CircularProgress />
                <Typography variant={"body1"}>در حال ارسال اطلاعات</Typography>
            </Box>
        </CardContent>
    )
    if (failed) return (
        <CardContent>
            <Box textAlign="center" p={10}>
                <Box mb={3}>
                    <WarningRoundedIcon className={classes.failedIcon} />
                </Box>
                <Typography variant={"body1"} className={classes.failedDialog}>خطا در ارسال اطلاعات! لطفا مجددا تلاش کنید.</Typography>
                <Box mt={3}>
                    <Button onClick={finalization}>ارسال مجدد</Button>
                </Box>
            </Box>
        </CardContent>
    )
    if (activeStep === pages.length) return (
        <CardContent>
            <Box textAlign="center" p={10}>
                <Box mb={3}>
                    <CloudDoneRoundedIcon className={classes.completedIcon} />
                </Box>
                <Typography variant={"body1"} className={classes.completedDialog}>{questionnaire.completedDialog}</Typography>
            </Box>
        </CardContent>
    )
    return (
        <div>
            <CardContent>
                <Box my={2}>
                    <Typography align="center" variant="h6">{questionnaire.title}</Typography>
                </Box>
                <Box mb={3}>
                    <Typography align="justify" color="textSecondary">{questionnaire.description}</Typography>
                </Box>
                {pages[activeStep] && <QVPage page={pages[activeStep]} defaultElementsArrangement={questionnaire.elementsArrangementEnumId} defaultItemsArrangement={questionnaire.itemsArrangementEnumId} answer={answer} setQuestionAnswer={setQuestionAnswer} readOnly={readOnly} />}
                <MobileStepper
                    steps={pages.length}
                    position="static"
                    activeStep={activeStep}
                    nextButton={(readOnly || !btnShow) && activeStep === pages.length - 1 ?
                        <div style={{ width: "88px" }} /> :
                        <Button size="small" onClick={handleNext} disabled={disabledNext}>
                            {activeStep === pages.length - 1 ? (
                                <>&nbsp;تکمیل&nbsp;&nbsp;<DoneIcon fontSize="small"/></>
                            ) : (
                                <>صفحه بعد<KeyboardArrowLeft /></>
                            )}
                        </Button>
                    }
                    backButton={displayBack ?
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            <KeyboardArrowRight />
                            صفحه قبل
                        </Button> : <div style={{ width: "88px" }} />
                    }
                />
            </CardContent>
        </div>
    )
})
export default QuestionnaireView;
