import React from "react";
import axios from "app/main/api/axiosRest";
import {Button} from "@material-ui/core";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";

export default function FormProPersonnelFilter({
        formDef=["pseudoId","firstName","lastName","suffix","organizationPartyId","organizationUnit","role","position","activityArea","expertiseArea",
            "employeeGroups","employeeSubGroups","costCenter"],
        formValues, setFormValues=()=>{}, formDefaultValues={}, formValidation={}, setFormValidation=()=>{},
        handleClose=()=>{}, searchMethod=()=>{}
    }) {
    const [userCompanyPartyId, set_userCompanyPartyId] = React.useState(null)
    const [localFormValues, set_localFormValues] = React.useState(formDefaultValues)
    // const [formValidation, setFormValidation] = React.useState({});
    const formValuesPointer = formValues?? localFormValues
    const set_formValuesPointer = formValues? setFormValues : set_localFormValues
    const disableAccess = formValuesPointer["organizationPartyId"]!==userCompanyPartyId

    const formStructureDefault = [{
        name: "pseudoId",
        label: "کد پرسنلی",
        type: "text",
    },{
        name: "firstName",
        label: "نام پرسنل",
        type: "text",
    },{
        name: "lastName",
        label: "نام خانوادگی",
        type: "text",
    },{
        name: "suffix",
        label: "پسوند",
        type: "text",
    },{
        name    : "organizationPartyId",
        label   : "شرکت",
        type    : "multiselect",
        options : "Organization",
        optionIdField       : "partyId",
        optionLabelField    : "organizationName",
    },{
        name    : "organizationUnit",
        label   : "واحد سازمانی",
        type    : "multiselect",
        options : "OrganizationUnit",
        optionIdField       : "partyId",
        optionLabelField    : "organizationName",
        
    },{
        name    : "role",
        label   : "نقش سازمانی",
        type    : "multiselect",
        options : "Role",
        optionIdField    : "roleTypeId",
        
    },{
        name    : "position",
        label   : "پست سازمانی",
        type    : "multiselect",
        options : "EmplPosition",
        optionIdField    : "emplPositionId",
        
    },{
        name    : "activityArea",
        label   : "منطقه فعالیت",
        type    : "multiselect",
        options : "ActivityArea",
        optionIdField   : "partyClassificationId",
        
    },{
        name    : "expertiseArea",
        label   : "حوزه کاری",
        type    : "multiselect",
        options : "ExpertiseArea",
        optionIdField   : "partyClassificationId",
        
    },{
        name    : "employeeGroups",
        label   : "گروه پرسنلی",
        type    : "multiselect",
        options : "EmployeeGroups",
        optionIdField   : "partyClassificationId",
        changeCallback  : () => set_formValuesPointer(prevState => ({...prevState, employeeSubGroups: "[]"})),
        
    },{
        name    : "employeeSubGroups",
        label   : "زیرگروه پرسنلی",
        type    : "multiselect",
        options : "EmployeeSubGroups",
        optionIdField   : "partyClassificationId",
        filterOptions   : options => options.filter((item) => formValuesPointer["employeeGroups"]?.indexOf(item.parentClassificationId) >= 0),
        
    },{
        name    : "costCenter",
        label   : "مرکز هزینه",
        type    : "multiselect",
        options : "CostCenter",
        optionIdField   : "partyClassificationId",
        
    }]

    const formStructure = typeof formDef[0]==="string" ? formStructureDefault.filter(i=>formDef.indexOf(i.name)>-1)
        : formDef.map(obj=>({
            ...formStructureDefault.find(i=>i.name===obj.name)||null,
            ...obj,
        }))

    function handle_submit() {
        searchMethod(formValuesPointer);
        handleClose();
    }
    function handle_reset() {
        searchMethod(formDefaultValues);
        handleClose();
    }

    React.useEffect(()=>{
        axios.get("/s1/fadak/party/subOrganization").then((res) => {
            set_userCompanyPartyId(JSON.stringify([res.data.organization[0].partyId]));
        }).catch(() => {});
    },[])

    return <FormPro
        formValues={formValuesPointer}
        setFormValues={set_formValuesPointer}
        formDefaultValues={formDefaultValues}
        formValidation={formValidation}
        setFormValidation={setFormValidation}
        submitCallback={handle_submit}
        resetCallback={handle_reset}
        append={formStructure}
        actionBox={
            <ActionBox>
                <Button type="submit" role="primary">اعمال فیلتر</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>
        }
    />
}
