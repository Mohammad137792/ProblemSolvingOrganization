import React, {useState} from "react";
import ActionBox from "../../../../components/ActionBox";
import {Button} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";

export default function PayrollCalculationsFilterForm({handle_search}) {
    const [formValues, set_formValues] = useState({})
    const [formValidation, set_formValidation] = useState({});
    const formStructure = [{
        name    : "id1",
        label   : "کد رهگیری",
        type    : "text",
    },{
        name    : "id2",
        label   : "گروه حقوق و دستمزد",
        type    : "multiselect",
        options : "Test1",
    },{
        name    : "id3",
        label   : "نوع فیش حقوق و دستمزد",
        type    : "multiselect",
        options : "Test1",
    },{
        name    : "id4",
        label   : "نوع دوره زمانی",
        type    : "multiselect",
        options : "Test1",
    },{
        name    : "id9",
        label   : "پرسنل",
        type    : "multiselect",
        options : "Test1",
    },{
        name    : "id5",
        label   : "تهیه کننده",
        type    : "multiselect",
        options : "Test1",
    },{
        name    : "id6a",
        label   : "تاریخ صدور از",
        type    : "date",
    },{
        name    : "id6b",
        label   : "تاریخ صدور تا",
        type    : "date",
    },{
        name    : "id10",
        label   : "کد فیش حقوقی",
        type    : "text",
    },{
        name    : "id11",
        label   : "شرح",
        type    : "text",
        col     : {sm: 12, md:6}
    }]

    return <FormPro
        formValues={formValues}
        setFormValues={set_formValues}
        formValidation={formValidation}
        setFormValidation={set_formValidation}
        prepend={formStructure}
        actionBox={
            <ActionBox>
                <Button type="submit" role="primary">اعمال فیلتر</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>
        }
        submitCallback={()=>handle_search(formValues)}
        resetCallback={()=>handle_search()}
    />
}
