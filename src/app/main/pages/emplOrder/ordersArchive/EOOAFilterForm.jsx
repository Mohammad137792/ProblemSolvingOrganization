import ActionBox from "../../../components/ActionBox";
import {Button} from "@material-ui/core";
import React from "react";
import FormPro from "../../../components/formControls/FormPro";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {useSelector} from "react-redux";
import FilterHistory from "../../../components/FilterHistory";

export default function EOOAFilterForm ({search, formDefaultValues}){
    const [formValues, setFormValues] = React.useState(formDefaultValues);
    const [orders, setOrders] = React.useState([]);
    const employeeGroups = useSelector(({ fadak }) => fadak.constData.list.EmployeeGroups);
    const disableAccess = ()=>formValues.organizationPartyId!==formDefaultValues.organizationPartyId
    const userCompanyId = formDefaultValues.organizationPartyId ? JSON.parse(formDefaultValues.organizationPartyId)[0] : null

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
        name    : "statusId",
        label   : "وضعیت حکم",
        type    : "select",
        options : [
            {enumId: "ActiveEmplOrder", description: "فعال"},
            {enumId: "NotActiveEmplOrder", description: "غیر فعال"}
        ]
    },{
        name    : "emplOrderCode",
        label   : "شماره حکم",
        type    : "text"
    },{
        name    : "organizationPartyId",
        label   : "شرکت",
        type    : "multiselect",
        options : "Organization",
        optionLabelField    : "organizationName",
        optionIdField       : "partyId",
    },{
        name    : "EmplOrderType",
        label   : "نوع حکم کارگزینی",
        type    : "select",
        options : orders,
        optionIdField       : "title",
        optionLabelField    : "title",
        disabled: disableAccess()
    },{
        name    : "AgreementType",
        label   : "نوع قرارداد",
        type    : "select",
        options : "Agreement",
        optionIdField   : "description",
        disabled: disableAccess()
    },{
        name    : "personnelArea",
        label   : "منطقه فعالیت",
        type    : "select",
        options : "ActivityArea",
        optionIdField   : "description",
        disabled: disableAccess()
    },{
        name    : "personnelSubArea",
        label   : "حوزه کاری",
        type    : "select",
        options : "ExpertiseArea",
        optionIdField   : "description",
        disabled: disableAccess()
    },{
        name    : "personnelGroupId",
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
        optionIdField   : "description",
        filterOptions   : options => options.filter(o=>o.parentClassificationId===formValues.personnelGroupId),
        disabled: disableAccess()
    },{
        name    : "costCenter",
        label   : "مرکز هزینه",
        type    : "select",
        options : "CostCenter",
        optionIdField   : "description",
        disabled: disableAccess()
    },{
        name    : "organizationUnit",
        label   : "واحد سازمانی",
        type    : "select",
        options : "OrganizationUnit",
        optionIdField       : "organizationName",
        optionLabelField    : "organizationName",
        disabled: disableAccess()
    },{
        name    : "emplPositionTitle",
        label   : "پست سازمانی",
        type    : "select",
        options : "EmplPosition",
        optionIdField       : "description",
        disabled: disableAccess()
    },{
        name    : "jobTitle",
        label   : "شغل",
        type    : "select",
        options : "Job",
        optionIdField       : "jobTitle",
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
        name    : "thruDateFrom",
        label   : "تاریخ اعتبار حکم از",
        type    : "date",
    },{
        name    : "thruDateTo",
        label   : "تاریخ اعتبار حکم تا",
        type    : "date",
    },{
        name    : "fromDateFrom",
        label   : "تاریخ اجرای حکم از",
        type    : "date",
    },{
        name    : "fromDateTo",
        label   : "تاریخ اجرای حکم تا",
        type    : "date",
    }]

    React.useEffect(()=>{
        if(userCompanyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/EmplOrderSetting?companyPartyId=${userCompanyId}&typeEnumId=EostEmplOrder`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setOrders(res.data.result)
            }).catch(() => {
            });
        }
    },[formDefaultValues.organizationPartyId])

    React.useEffect(()=>{
        setFormValues(formDefaultValues)
    },[formDefaultValues])

    React.useEffect(()=>{
        if(disableAccess()){
            setFormValues(prevState => ({
                ...prevState,
                settingId: null,
                agreementId: null,
                personnelArea: null,
                personnelSubArea: null,
                personnelGroup: null,
                personnelGroupId: null,
                personnelSubGroup: null,
                costCenter: null,
                organizationUnit: null,
                emplPositionTitle: null,
                jobTitle: null,
            }))
        }
    },[formValues.organizationPartyId])

    React.useEffect(()=>{
        console.log("employeeGroups", employeeGroups)
        let personnelGroup = null
        if(formValues.personnelGroupId){
            let group = employeeGroups.find(i=>i.partyClassificationId===formValues.personnelGroupId)
            personnelGroup = group ? group.description : null
        }
        setFormValues(prevState => ({
            ...prevState,
            personnelGroup: personnelGroup,
            personnelSubGroup: null,
        }))
    },[formValues.personnelGroupId])

    return(
        <FormPro prepend={formStructure} formDefaultValues={formDefaultValues}
                 formValues={formValues} setFormValues={setFormValues}
                 submitCallback={()=>search(formValues)} resetCallback={()=>search(formDefaultValues)}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">اعمال فیلتر</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                     <FilterHistory role="tertiary" formValues={formValues} setFormValues={setFormValues} filterType={"filter_emplOrder_archive"} loadCallback={(val)=>search(val)}/>
                 </ActionBox>}
        />
    )
}
