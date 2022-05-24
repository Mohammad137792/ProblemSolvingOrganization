import React from 'react';
import FormPro from "../../../../components/formControls/FormPro";
import {Button} from "@material-ui/core";

const PersonnelSelectionFilter = (props) => {

    const {formValues, setFormValues, handleClose, searchFunction=()=>{}} = props

    const filterFormStructure = [{
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
        // changeCallback  : () => set_formValuesPointer(prevState => ({...prevState, employeeSubGroups: "[]"})),
    },{
        name    : "employeeSubGroups",
        label   : "زیرگروه پرسنلی",
        type    : "multiselect",
        options : "EmployeeSubGroups",
        optionIdField   : "partyClassificationId",
        // filterOptions   : options => options.filter((item) => formValuesPointer["employeeGroups"]?.indexOf(item.parentClassificationId) >= 0),
    },{
        name    : "costCenter",
        label   : "مرکز هزینه",
        type    : "multiselect",
        options : "CostCenter",
        optionIdField   : "partyClassificationId",
    },{
        type    : "component",
        component : 
            <div style={{display: "flex" , flexDirection: "row" , justifyContent : "flex-end"}}>
                <Button style={{width: "70px", color: "secondary" }}  variant="outlined" onClick={()=>handleReset()} >لغو</Button>
                <Button style={{width: 120, color: "white", backgroundColor: "#039be5", marginRight: "8px"}} variant="outlined" onClick={()=>handleFilter()}>اعمال فیلتر</Button>
            </div>,
        col : 12
    }]

    const handleFilter = () =>{
        searchFunction(formValues)
        handleClose()
    }

    const handleReset = () => {
        searchFunction()
        setFormValues({})
        handleClose()
    }

    return (
        <FormPro
            formValues={formValues}
            setFormValues={setFormValues}
            append={filterFormStructure}
        />
    );
};

export default PersonnelSelectionFilter;