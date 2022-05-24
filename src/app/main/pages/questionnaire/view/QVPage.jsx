import React from "react";
import {Typography} from "@material-ui/core";
import QVElement from "./QVElement";
import {shuffle} from "./QuestionnaireView";

export default function QVPage({page, defaultElementsArrangement, defaultItemsArrangement, answer, setQuestionAnswer, readOnly}) {
    const [elements, setElements] = React.useState([])

    React.useEffect(()=>{
        let elms = page.elements.filter(i=>i.display==="Y")
        let arrangement = page.elementsArrangementEnumId
        if (arrangement==="ArrInherit")
            arrangement = defaultElementsArrangement
        switch (arrangement) {
            case "ArrSequence":
                elms = elms.sort((a,b)=>a.sequenceNum-b.sequenceNum)
                break
            case "ArrRandom":
                elms = shuffle(elms)
                break
            default:
        }
        setElements(elms)
    }, [page])
    return (
        <div>
            <Typography><b>{page.title}</b></Typography>
            <Typography align="justify" color="textSecondary">{page.description}</Typography>
            {elements.map((elm,ind)=>(
                <QVElement key={ind} number={ind+page.startNumber} element={elm} answer={answer} setQuestionAnswer={setQuestionAnswer} defaultItemsArrangement={defaultItemsArrangement} readOnly={readOnly}/>
            ))}
        </div>
    )
}
