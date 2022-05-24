import React from "react";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import FilterHistory from "../../../components/FilterHistory";

export default function QAFilter({search, formDefaultValues}) {
    const [formValues, setFormValues] = React.useState(formDefaultValues);
    const formStructure = [{
        name    : "name",
        label   : "نام پرسشنامه",
        type    : "text",
        col     : 6
    },{
        name    : "categoryEnumId",
        label   : "گروه",
        type    : "select",
        options : "QuestionnaireCategory",
        filterOptions: options => options.filter(o=>!o["parentEnumId"]),
        changeCallback: () => {
            setFormValues(prevState => ({
                ...prevState,
                subCategoryEnumId: null
            }))
        }
    },{
        name    : "subCategoryEnumId",
        label   : "زیرگروه",
        type    : "select",
        options : "QuestionnaireCategory",
        filterOptions: options => options.filter(o=>o["parentEnumId"]===formValues["categoryEnumId"]),
        disabled: !formValues["categoryEnumId"]
    }]

    React.useEffect(()=>{
        setFormValues(formDefaultValues)
    },[formDefaultValues])

    return(
        <FormPro prepend={formStructure} formDefaultValues={formDefaultValues}
                 formValues={formValues} setFormValues={setFormValues}
                 submitCallback={()=>search(formValues)} resetCallback={()=>search(formDefaultValues)}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">اعمال فیلتر</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                     <FilterHistory role="tertiary" formValues={formValues} setFormValues={setFormValues} filterType={"filter_questionnaire_archive"} loadCallback={(val)=>search(val)}/>
                 </ActionBox>}
        />
    )
}
