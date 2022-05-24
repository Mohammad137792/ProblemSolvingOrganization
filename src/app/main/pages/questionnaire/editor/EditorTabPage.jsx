import React from "react";
import {ReactSortable} from "react-sortablejs";
import {CardHeader, Grid, IconButton} from "@material-ui/core";
import EditorPage from "./EditorPage";
import QueueIcon from '@material-ui/icons/Queue';
import ExploreIcon from '@material-ui/icons/Explore';
import ExploreOffIcon from '@material-ui/icons/ExploreOff';
import Tooltip from "@material-ui/core/Tooltip";

export function makeEmptyPage() {
   return {
       name: "",
       title: "",
       description: "",
       display: "Y",
       elementsArrangementEnumId: "ArrInherit",
       backButtonDisplayEnumId: "DispInherit",
       elements: []
   }
}

const PageGrid = React.forwardRef((props, ref) => {
    return <Grid container spacing={3} ref={ref}>{props.children}</Grid>;
});

export default function EditorTabPage({questionnaire, set_questionnaire, update_pages_question_numbers, add_removedObjects}) {
    const [showQuestions, set_showQuestions] =React.useState(false)
    const set_pages = (value) => {
        set_questionnaire(prevState => ({
            ...prevState,
            pages: value
        }))
    }
    const add_page = () => {
        let pages = Object.assign([], questionnaire.pages)
        const newPage = makeEmptyPage()
        pages.push(newPage)
        set_pages(pages)
    }
    const delete_page = (index) => () => {
        let pages = Object.assign([], questionnaire.pages)
        let removedPage = pages.splice(index,1)
        set_pages(pages)
        if(removedPage[0].pageId)
            add_removedObjects("page",removedPage[0].pageId)

        let removedElements = [];
        let removedItems = [];
        for(let i in removedPage[0].elements) {
            let element = removedPage[0].elements[i]
            if(element.elementId)
                removedElements.push(element.elementId)
            for(let j in element.items) {
                let item = element.items[j]
                if(item.itemId)
                    removedItems.push(item.itemId)
            }
        }
        if(removedElements.length)
            add_removedObjects("element",removedElements)
        if(removedItems.length)
            add_removedObjects("item",removedItems)
    }
    const set_page = (index) => (page) => {
        let pages = Object.assign([], questionnaire.pages)
        pages[index] = page
        set_pages(pages)
    }
    return (
        <React.Fragment>
            <CardHeader
                title="تنظیم صفحات پرسشنامه"
                action={
                    <>
                        <Tooltip title="افزودن صفحه">
                            <IconButton onClick={add_page}>
                                <QueueIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={showQuestions ? "عدم نمایش سوالات" : "نمایش سوالات"}>
                            <IconButton onClick={()=>set_showQuestions(prevState => !prevState)}>
                                {showQuestions ? <ExploreOffIcon/> : <ExploreIcon/>}
                            </IconButton>
                        </Tooltip>
                    </>
                }
            />
            <ReactSortable
                list={questionnaire.pages}
                setList={set_pages}
                handle={".page-handle"}
                group={{name: "pages"}}
                animation={200}
                delayOnTouchStart={true}
                delay={false}
                ghostClass="question-ghost"
                tag={PageGrid}
                onSort={update_pages_question_numbers}
            >
                {questionnaire.pages.map((page,index)=>(
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <EditorPage index={index} page={page} set_page={set_page(index)} delete_page={delete_page(index)} showQuestions={showQuestions} update_pages_question_numbers={update_pages_question_numbers}/>
                    </Grid>
                ))}
            </ReactSortable>
        </React.Fragment>
    )
}
