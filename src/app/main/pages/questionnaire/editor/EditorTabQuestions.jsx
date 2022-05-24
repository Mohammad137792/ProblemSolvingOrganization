import React from "react";
import {CardHeader, Tab, Tabs, Typography} from "@material-ui/core";
import {ReactSortable} from "react-sortablejs";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import EditorQuestion from "./EditorQuestion";

const useStyles = makeStyles((theme) => ({
    tabs: {
        width: "100%",
        borderBottom: "1px solid #ddd"
    },
    tabItem: {
        minWidth: "100px"
    }
}));

function QuestionToolBox({questionTypes, add_question}) {
    return (
        <Card variant="outlined" className="question-toolbox">
            <Typography color="textSecondary" className="header">جعبه سوال</Typography>
            <ReactSortable
                list={questionTypes}
                setList={()=>{}}
                sort={false}
                group={{name: "QuestionToolBox", pull: "clone"}}
                animation={200}
                delayOnTouchStart={true}
                delay={false}
            >
                {questionTypes.map((item,ind) => (
                    <Box className="question-toolbox-item" key={ind} onClick={add_question(ind)}>
                        {item.name}
                    </Box>
                ))}
            </ReactSortable>
        </Card>
    )
}

function PageQuestions({pageQuestions, set_pageQuestions, set_question, delete_question, startNumber, add_removedObjects}) {
    return (
        <React.Fragment>
            <ReactSortable
                list={pageQuestions}
                setList={set_pageQuestions}
                handle={".question-handle"}
                group={{name: "page", put: ["QuestionToolBox"]}}
                animation={200}
                delayOnTouchStart={true}
                delay={false}
                ghostClass="question-ghost"
                className="questionnaire-page-edit"
            >
                {pageQuestions?.length && pageQuestions.map((item,ind) => (
                    <EditorQuestion key={ind} number={ind+startNumber} question={item} set_question={set_question(ind)} delete_question={delete_question(ind)} add_removedObjects={add_removedObjects}/>
                ))}
            </ReactSortable>
            {!pageQuestions?.length &&
            <Box className="questionnaire-page-edit-empty">
                <Typography component="div" align="center" color="textSecondary">
                    از جعبه سوال، سوالی در اینجا قرار دهید
                </Typography>
            </Box>
            }
        </React.Fragment>
    )
}

const defaultOptions = {
    display: "Y",
    required: "N",
    weight: 1,
    title: "",
    items: []
}
const defaultItems = {
    items: [
        {value: "", label: "گزینه یک"},
        {value: "", label: "گزینه دو"},
        {value: "", label: "گزینه سه"},
    ]
}

export default function EditorTabQuestions({questionnaire, set_questionnaire, update_pages_question_numbers, add_removedObjects}) {
    const classes = useStyles();
    const [page, set_page] = React.useState(0);
    const [questionTypes, set_questionTypes] = React.useState([
        { ...defaultOptions, type: "text", name: "کوتاه پاسخ" },
        { ...defaultOptions, type: "textarea", name: "تشریحی" },
        { ...defaultOptions, type: "number", name: "عددی" },
        { ...defaultOptions, type: "check", name: "چند انتخابی", ...defaultItems},
        { ...defaultOptions, type: "radio", name: "چند گزینه ای", ...defaultItems},
    ]);

    const set_pageQuestions = (value) => {
        let updatedPages = questionnaire.pages
        updatedPages[page].elements = JSON.parse(JSON.stringify(value))
        set_questionnaire(prevState=>({
            ...prevState,
            pages: updatedPages
        }))
    }

    const set_question = (index) => (name, value) => {
        let updatedPages = questionnaire.pages
        updatedPages[page].elements[index][name] = value
        set_questionnaire(prevState=>({
            ...prevState,
            pages: updatedPages
        }))
    }

    const delete_question = (index) => () => {
        let updatedPages = questionnaire.pages
        let questionList = Object.assign([], updatedPages[page].elements)
        let removedQuestion = questionList.splice(index,1)
        updatedPages[page].elements = questionList
        set_questionnaire(prevState=>({
            ...prevState,
            pages: updatedPages
        }))
        if(removedQuestion[0].elementId)
            add_removedObjects("element",removedQuestion[0].elementId)
        let removedItems = []
        for(let i in removedQuestion[0].items) {
            let item = removedQuestion[0].items[i]
            if(item.itemId)
                removedItems.push(item.itemId)
        }
        if(removedItems.length)
            add_removedObjects("item",removedItems)
    }

    const add_question = (questionTypeIndex) => () => {
        let updatedPages = questionnaire.pages
        updatedPages[page].elements.push(JSON.parse(JSON.stringify(questionTypes[questionTypeIndex])))
        set_questionnaire(prevState=>({
            ...prevState,
            pages: updatedPages
        }))
    }

    React.useEffect(()=>{
        update_pages_question_numbers()
    },[questionnaire.pages[page].elements.length])

    return (
        <React.Fragment>
            <CardHeader title="سوالات پرسشنامه"/>
            <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                    <Card variant="outlined">
                        <Tabs indicatorColor="secondary" textColor="secondary"
                              variant="scrollable" scrollButtons="on"
                              value={page} onChange={(e,newValue)=>set_page(newValue)}
                              className={classes.tabs}
                        >
                            {questionnaire.pages.map((page,index)=>(
                                <Tab key={index} className={classes.tabItem} label={page.name||"صفحه بدون نام"} />
                            ))}
                        </Tabs>
                        <PageQuestions startNumber={questionnaire.pages[page].startNumber} pageQuestions={questionnaire.pages[page].elements} delete_question={delete_question} set_pageQuestions={set_pageQuestions} set_question={set_question} add_removedObjects={add_removedObjects}/>
                    </Card>

                </Grid>
                <Grid item xs={12} md={3}>
                    <QuestionToolBox questionTypes={questionTypes} add_question={add_question}/>
                </Grid>
            </Grid>

        </React.Fragment>
    )
}
