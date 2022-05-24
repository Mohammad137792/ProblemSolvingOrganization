import React from "react";
import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";

export default function EOCAFilterForm ({search, formDefaultValues}){
    const [formValues, setFormValues] = React.useState(formDefaultValues);
    const disableAccess = ()=>formValues.ownerPartyId!==formDefaultValues.ownerPartyId
    const formStructure = [{
        name    : "pseudoId",
        label   : "کد پرسنلی",
        type    : "text"
    },{
        name    : "firstName",
        label   : "نام پرسنل",
        type    : "text"
    },{
        name    : "nationalId",
        label   : "کد ملی",
        type    : "number",
    },{
        name    : "agrStatusId",
        label   : "وضعیت قرارداد",
        type    : "select",
        options : [
            {enumId: "ActiveAgr", description: "فعال"},
            {enumId: "NotActiveAgr", description: "غیر فعال"}
        ]
    },{
        name    : "organizationPartyId",
        label   : "شرکت",
        type    : "multiselect",
        options : "Organization",
        optionLabelField    : "organizationName",
        optionIdField       : "partyId",
    },{
        name    : "agreementParentId",
        label   : "نوع قرارداد",
        type    : "select",
        options : "Agreement",
        optionIdField   : "agreementId",
        disabled: disableAccess()
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
        name    : "personnelGroup",
        label   : "گروه پرسنلی",
        type    : "select",
        options : "EmployeeGroups",
        optionIdField   : "partyClassificationId",
        disabled: disableAccess()
    },{
        name    : "personnelSubGroup",
        label   : "زیرگروه پرسنلی",
        type    : "select",
        options : "EmployeeSubGroups",
        optionIdField   : "partyClassificationId",
        filterOptions   : options => options.filter(o=>o.parentClassificationId===formValues.personnelGroup),
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
    },{
        name    : "jobId",
        label   : "شغل",
        type    : "select",
        options : "Job",
        optionIdField       : "jobId",
        optionLabelField    : "jobTitle",
        disabled: disableAccess()
    },{
        name    : "employmentDateFrom",
        label   : "تاریخ استخدام از",
        type    : "date",
    },{
        name    : "employmentDateTo",
        label   : "تاریخ استخدام تا",
        type    : "date",
    },{
        name    : "agreementDateFrom",
        label   : "تاریخ عقد قرارداد از",
        type    : "date",
    },{
        name    : "agreementDateTo",
        label   : "تاریخ عقد قرارداد تا",
        type    : "date",
    },{
        name    : "agrFromDateFrom",
        label   : "تاریخ شروع اعتبار قرارداد از",
        type    : "date",
    },{
        name    : "agrFromDateTo",
        label   : "تاریخ شروع اعتبار قرارداد تا",
        type    : "date",
    },{
        name    : "agrThruDateFrom",
        label   : "تاریخ پایان اعتبار قرارداد از",
        type    : "date",
    },{
        name    : "agrThruDateTo",
        label   : "تاریخ پایان اعتبار قرارداد تا",
        type    : "date",
    }]

    React.useEffect(()=>{
        setFormValues(formDefaultValues)
    },[formDefaultValues])
    React.useEffect(()=>{
        if(disableAccess()){
            setFormValues(prevState => ({
                ...prevState,
                agreementParentId: null,
                personnelArea: null,
                personnelSubArea: null,
                personnelGroup: null,
                personnelSubGroup: null,
                costCenter: null,
                organizationUnit: null,
                emplPositionId: null,
                jobId: null,
            }))
        }
    },[formValues.ownerPartyId])
    React.useEffect(()=>{
        if(!formValues.personnelGroup){
            setFormValues(prevState => ({
                ...prevState,
                personnelSubGroup: null,
            }))
        }
    },[formValues.personnelGroup])

    return(
        <FormPro prepend={formStructure} formDefaultValues={formDefaultValues}
                 formValues={formValues} setFormValues={setFormValues}
                 submitCallback={()=>search(formValues)} resetCallback={()=>search(formDefaultValues)}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">اعمال فیلتر</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                     {/*<FilterHistory role="tertiary" formValues={formValues} setFormValues={setFormValues}/>*/}
                 </ActionBox>}
        />
    )
}
