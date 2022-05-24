import React from "react";
import FormPro from "../../../components/formControls/FormPro";
import {CardHeader} from "@material-ui/core";

export default function EditorTabSettings({questionnaire, set_questionnaire}) {
    // const [formValidation, set_formValidation] = useState({});
    const formStructure = [
        {
            name    : "name",
            label   : "نام پرسشنامه",
            type    : "text",
            required: true,
            // col     : {sm:12, md:6}
        },{
            name    : "categoryEnumId",
            label   : "گروه پرسشنامه",
            type    : "select",
            options : "QuestionnaireCategory",
            filterOptions: options => options.filter(o=>!o["parentEnumId"]),
            disableClearable: true,
            required: true,
            changeCallback: () => {
                set_questionnaire(prevState => ({
                    ...prevState,
                    subCategoryEnumId: null
                }))
            }
        },{
            name    : "subCategoryEnumId",
            label   : "زیرگروه",
            type    : "select",
            options : "QuestionnaireCategory",
            filterOptions: options => options.filter(o=>o["parentEnumId"]===questionnaire["categoryEnumId"]),
            disabled: !questionnaire["categoryEnumId"]
        },{
            name    : "scoringMethodEnumId",
            label   : "روش محاسبه امتیاز",
            type    : "select",
            options : "QuestionnaireScoring",
        },{
            name    : "pagesArrangementEnumId",
            label   : "چیدمان صفحات",
            type    : "select",
            options : "ArrangementType",
            filterOptions: options => options.filter(o=>o["enumId"]!=="ArrInherit"),
            disableClearable: true
        },{
            name    : "elementsArrangementEnumId",
            label   : "چیدمان سوالات",
            type    : "select",
            options : "ArrangementType",
            filterOptions: options => options.filter(o=>o["enumId"]!=="ArrInherit"),
            disableClearable: true
        },{
            name    : "itemsArrangementEnumId",
            label   : "چیدمان گزینه های سوالات",
            type    : "select",
            options : "ArrangementType",
            filterOptions: options => options.filter(o=>o["enumId"]!=="ArrInherit"),
            disableClearable: true
        },{
            name    : "backButtonDisplayEnumId",
            label   : "دکمه بازگشت",
            type    : "select",
            options : "DisplayState",
            filterOptions: options => options.filter(o=>o["enumId"]!=="DispInherit"),
            disableClearable: true
        },{
            name    : "title",
            label   : "عنوان پرسشنامه",
            type    : "text",
            col     : 12,
        },{
            name    : "description",
            label   : "توضیحات",
            type    : "textarea",
            col     : 12,
        },{
            name    : "completedDialog",
            label   : "عبارت پایانی",
            type    : "textarea",
            col     : 12,
        }]

    // React.useEffect(()=>{
    //     let buffer = Object.assign({}, formValidation)
    //     buffer.name = !questionnaire.name ? {error: true} : {}
    //     buffer.categoryEnumId = !questionnaire.categoryEnumId ? {error: true} : {}
    //     set_formValidation(buffer)
    // },[questionnaire.name, questionnaire.categoryEnumId])

    return (
        <React.Fragment>
            <CardHeader title="تنظیمات عمومی پرسشنامه"/>
            <FormPro formValues={questionnaire} setFormValues={set_questionnaire}
                     // formValidation={formValidation} setFormValidation={set_formValidation}
                     append={formStructure}
            />
        </React.Fragment>
    )
}
