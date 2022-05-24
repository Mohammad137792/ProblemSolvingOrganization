import React from "react";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import {Button} from "@material-ui/core";
import FilterHistory from "../../../../components/FilterHistory";

export default function PersonnelFilterForm({search, formValues, setFormValues, formDefaultValues={}, handleClose}) {
    const disableAccess = () => formValues.organizationPartyId!==formDefaultValues.organizationPartyId
    const formStructure = [{ /* todo: add role */
        name    : "pseudoId",
        label   : "کد پرسنلی",
        type    : "text"
    },{
        name    : "firstName",
        label   : "نام پرسنل",
        type    : "text"
    },{
        name    : "relationType", /* todo: name and options? */
        label   : "نوع ارتباط",
        type    : "select",
        options : [
            {enumId: "employee", description: "کارمند"},
            {enumId: "teacher", description: "مدرس"}
        ]
    },{
        name    : "organizationPartyId",
        label   : "شرکت",
        type    : "multiselect",
        options : "Organization",
        optionLabelField    : "organizationName",
        optionIdField       : "partyId",
    },{
        name    : "personnelArea",
        label   : "منطقه فعالیت",
        type    : "select",
        options : "ActivityArea",
        optionIdField   : "partyClassificationId",
        disabled: disableAccess()
    },{
        name    : "personnelSubArea",
        label   : "حوزه کاری",
        type    : "select",
        options : "ExpertiseArea",
        optionIdField   : "partyClassificationId",
        disabled: disableAccess()
    },{
        name    : "personnelGroupId",
        label   : "گروه پرسنلی",
        type    : "select",
        options : "EmployeeGroups",
        optionIdField   : "partyClassificationId",
        disabled: disableAccess(),
        changeCallback: () => {
            setFormValues(prevState => ({
                ...prevState,
                personnelSubGroup: null,
            }))
        }
    },{
        name    : "personnelSubGroup",
        label   : "زیرگروه پرسنلی",
        type    : "select",
        options : "EmployeeSubGroups",
        optionIdField   : "partyClassificationId",
        filterOptions   : options => options.filter(o=>o.parentClassificationId===formValues.personnelGroupId),
        disabled: disableAccess()
    },{
        name    : "costCenter",
        label   : "مرکز هزینه",
        type    : "select",
        options : "CostCenter",
        optionIdField   : "partyClassificationId",
        disabled: disableAccess()
    },{
        name    : "organizationUnit",
        label   : "واحد سازمانی",
        type    : "select",
        options : "OrganizationUnit",
        optionIdField       : "partyId",
        optionLabelField    : "organizationName",
        disabled: disableAccess()
    },{
        name    : "emplPositionId",
        label   : "پست سازمانی",
        type    : "select",
        options : "EmplPosition",
        optionIdField       : "emplPositionId",
        disabled: disableAccess()
    }]

    React.useEffect(()=>{
        if(disableAccess()){
            setFormValues(prevState => ({
                ...prevState,
                personnelArea: null,
                personnelSubArea: null,
                personnelGroup: null,
                personnelSubGroup: null,
                costCenter: null,
                organizationUnit: null,
                emplPositionId: null,
            }))
        }
    },[formValues.organizationPartyId])

    function handle_submit() {
        search(formValues)
        handleClose()
    }
    function handle_reset() {
        search(formDefaultValues)
        handleClose()
    }
    return(
        <FormPro prepend={formStructure} formDefaultValues={formDefaultValues}
                 formValues={formValues} setFormValues={setFormValues}
                 submitCallback={handle_submit} resetCallback={handle_reset}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">اعمال فیلتر</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                     <FilterHistory role="tertiary" formValues={formValues} setFormValues={setFormValues} filterType={"filter_search_personnel"} loadCallback={(val)=>search(val)}/>
                 </ActionBox>}
        />
    )
}
