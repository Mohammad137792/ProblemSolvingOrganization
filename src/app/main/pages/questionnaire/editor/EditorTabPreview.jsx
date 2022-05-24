import React from "react";
import QuestionnaireView from "../view/QuestionnaireView";

export default function EditorTabPreview({questionnaire, set_questionnaire}) {
    return (
        <React.Fragment>
            <QuestionnaireView questionnaire={questionnaire}/>
        </React.Fragment>
    )
}
