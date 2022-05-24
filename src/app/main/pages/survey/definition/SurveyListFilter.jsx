import React from "react";
import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";

export default function SurveyListFilter ({handle_search, formDefaultValues, questionnaires}){
    const [formValues, setFormValues] = React.useState(formDefaultValues);
    const formStructure = [{
        name    : "code",
        label   : "کد",
        type    : "text"
    },{
        name    : "name",
        label   : "عنوان",
        type    : "text"
    },{
        name    : "fromDateFrom",
        label   : "تاریخ ارسال از",
        type    : "date",
    },{
        name    : "fromDateTo",
        label   : "تاریخ ارسال تا",
        type    : "date",
    },{
        name    : "questionnaireId",
        label   : "فرم نظرسنجی",
        type    : "select",
        options : questionnaires,
        optionIdField: "questionnaireId",
        optionLabelField: "name"
    },{
        name    : "statusId",
        label   : "وضعیت",
        type    : "select",
        options : "StaQuestionnaireApplication",
        optionIdField: "statusId"
    }]

    React.useEffect(()=>{
        setFormValues(formDefaultValues)
    },[formDefaultValues])

    return(
        <FormPro prepend={formStructure} formDefaultValues={formDefaultValues}
                 formValues={formValues} setFormValues={setFormValues}
                 submitCallback={()=>handle_search(formValues)} resetCallback={()=>handle_search(formDefaultValues)}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">اعمال فیلتر</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                 </ActionBox>}
        />
    )
}
