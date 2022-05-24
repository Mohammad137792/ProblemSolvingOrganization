import React from 'react';
import {Button,} from "@material-ui/core";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ActionBox from "../../../../components/ActionBox";
import FormPro from "../../../../components/formControls/FormPro";
import FormButton from "../../../../components/formControls/FormButton";
import FilterHistory from "../../../../components/FilterHistory";

const formDefaultValues = {
    partyDisabled: "N",
}

export default function SearchPersonnelForm({getPersonnel}){
    const [formValues, setFormValues] = React.useState(formDefaultValues);
    const [moreFilter, setMoreFilter] = React.useState(false);
    const formStructure = [
        {
        name:   "pseudoId",
        label:  "عنوان",
        type:   "text"
    },{
        name:   "firstName",
        label:  "نوع پرسشنامه",
        type:   "select"
    },{
        name:   "nationalId",
        label:  "تاریخ سررسید",
        type:   "date",
    }]

    return (
        <FormPro prepend={formStructure} formDefaultValues={formDefaultValues}
                 formValues={formValues} setFormValues={setFormValues}
                 submitCallback={()=>getPersonnel(formValues)} resetCallback={()=>getPersonnel(formDefaultValues)}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">اعمال فیلتر</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                     {/* <FilterHistory role="tertiary" formValues={formValues} setFormValues={setFormValues} filterType={"filter_personnel"} loadCallback={(val)=>getPersonnel(val)}/> */}
                 </ActionBox>}
        >

        </FormPro>
    );
}
