import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import FormInput from "../../../../../components/formControls/FormInput";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import TablePro from "../../../../../components/TablePro";
import PostAddIcon from "@material-ui/icons/PostAdd";
import {useHistory} from "react-router-dom";
import {PREV_ORDER, PREV_ORDER_TEXT, PROFILE, PROFILE_TEXT} from "./EmplOrderIssuance";


export default function EOIAgreement(props){
    const history = useHistory();
    const {formValues, setFormValues, correction=false, formValidation, setFormValidation} = props;
    const [loading, setLoading] = React.useState(false);
    const [orders, setOrders] = React.useState([]);
    const [jobGrades, setJobGrades] = React.useState([{jobGradeId:0, jobTitle:"نخست شغل انتخاب شود!", disabled:true}]);
    const [jobGradesLoading, setJobGradesLoading] = React.useState(false);
    const [tableContent, setTableContent] = React.useState([]);
    const [scoreFormulas, setScoreFormulas] = React.useState([]);
    const [currencyFormulas, setCurrencyFormulas] = React.useState([]);
    const tableCols = [
        {name: "calcSequence", label: "ترتیب محاسبه", type: "text"},
        {name: "title", label: "عنوان عامل حکمی", type: "text"},
        {name: "groupEnumId", label: "گروه عامل حکمی", type: "select", options: "PayrollFactorGroup"},
        {name: "scoreFormulaId", label: "فرمول امتیاز", type: "select", options: scoreFormulas, optionIdField: "formulaId", optionLabelField: "title" },
        {name: "currencyFormulaId", label: "فرمول مقدار ریالی", type: "select", options: currencyFormulas, optionIdField: "formulaId", optionLabelField: "title" },
    ]
    const is_personnel_group_prev_or_profile = formValues.personnelGroupId===PREV_ORDER || formValues.personnelGroupId===PROFILE
    const formStructure = [{
        name    : "settingId",
        label   : "نوع حکم کارگزینی",
        type    : "select",
        options : orders,
        optionIdField       : "settingId",
        optionLabelField    : "title",
        otherOutputs: [{name: "EmplOrderType", optionIdField: "title"},
                       {name: "emplOrderDescription", optionIdField: "description"}],
        disableClearable: true,
        required: true
    },{
        name    : "orderDate",
        label   : "تاریخ صدور حکم",
        type    : "date",
        required: true
    },{
        name    : "fromDate",
        label   : "تاریخ اجرای حکم",
        type    : "date",
        required: true
    },{
        name    : "thruDate",
        label   : "تاریخ پایان اعتبار حکم",
        type    : "date",
        required: true
    },{
        name    : "newAgreement",
        label   : "قرارداد",
        type    : "indicator",
        display : !correction
    },{
        name    : "AgreementTypeId",
        label   : "نوع قرارداد",
        type    : "select",
        options : "Agreement",
        optionIdField       : "agreementId",
        filterOptions       : options => options.filter(o=>o.statusId==='ActiveAgr'),
        disabled: formValues.newAgreement==='N',
        display : formValues.newAgreement!=='N',
        otherOutputs: [{name: "AgreementType", optionIdField: "description"}],
        disableClearable: true,
        required: true
    },{
        name    : "agreementDate",
        label   : "تاریخ عقد قرارداد",
        type    : "date",
        disabled: formValues.newAgreement==='N',
        display : formValues.newAgreement!=='N',
        required: true
    },{
        name    : "agreementFromDate",
        label   : "تاریخ شروع قرارداد",
        type    : "date",
        disabled: formValues.newAgreement==='N',
        display : formValues.newAgreement!=='N',
        required: true
    },{
        name    : "agreementThruDate",
        label   : "تاریخ پایان قرارداد",
        type    : "date",
        disabled: formValues.newAgreement==='N',
        display : formValues.newAgreement!=='N',
        required: true
    },{
        name    : "employmentDate",
        label   : "تاریخ استخدام",
        type    : "date",
        disabled: formValues.newAgreement==='N',
        display : formValues.newAgreement!=='N',
    },{
        name    : "description",
        label   : "شرح حکم",
        type    : "textarea",
        col     : 12,
    },{
        name    : "organizationUnitId",
        label   : "واحد سازمانی",
        type    : "select",
        options : [],//"OrganizationUnit",
        optionIdField       : "partyId",
        optionLabelField    : "organizationName",
        filterOptions       : options => options.filter(o=>o.disabled!=='Y'),
        otherOutputs        : [{name: "organizationUnit", optionIdField: "organizationName"}],
        appendOptions       : [{partyId: PREV_ORDER, organizationName: PREV_ORDER_TEXT, disabled: true},
                               {partyId: PROFILE,    organizationName: PROFILE_TEXT}],
        disableClearable    : true
    },{
        name    : "emplPositionId",
        label   : "پست سازمانی",
        type    : "select",
        options : [],//"EmplPosition",
        optionIdField       : "emplPositionId",
        filterOptions       : options => options.filter(o=>!o.thruDate),
        getOptionLabel      : opt => opt ? opt.emplPositionId===PREV_ORDER||opt.emplPositionId===PROFILE ? opt.description : (`${opt.pseudoId} ─ ${opt.description}` || "؟") : "",
        otherOutputs        : [{name: "emplPositionCode", optionIdField: "pseudoId"},
                               {name: "emplPositionTitle", optionIdField: "description"}],
        appendOptions       : [{emplPositionId: PREV_ORDER, description: PREV_ORDER_TEXT, disabled: true},
                               {emplPositionId: PROFILE,    description: PROFILE_TEXT}],
        disableClearable    : true
    },{
        name    : "jobId",
        label   : "شغل",
        type    : "select",
        options : [],//"Job",
        optionIdField       : "jobId",
        optionLabelField    : "jobTitle",
        otherOutputs        : [{name: "jobCode", optionIdField: "jobCode"},
                               {name: "jobTitle", optionIdField: "jobTitle"}],
        appendOptions       : [{jobId: PREV_ORDER, jobTitle: PREV_ORDER_TEXT, jobCode: null, disabled: true},
                               {jobId: PROFILE,    jobTitle: PROFILE_TEXT,    jobCode: null}],
        disableClearable    : true
    },{
        name    : "jobGradeId",
        label   : "طبقه شغلی",
        type    : "select",
        options : jobGrades,
        loading : jobGradesLoading,
        optionIdField       : "jobGradeId",
        optionLabelField    : "jobTitle",
        otherOutputs        : [{name: "jobGradeTitle", optionIdField: "jobTitle"},
                               {name: "jobGradeEnumId", optionIdField: "jobGradeEnumId"}],
        disabled: formValues.jobId===PREV_ORDER || formValues.jobId===PROFILE
    },{
        name    : "personnelAreaId",
        label   : "منطقه فعالیت",
        type    : "select",
        options : [],//"ActivityArea",
        optionIdField   : "partyClassificationId",
        otherOutputs    : [{name: "personnelArea", optionIdField: "description"}],
        appendOptions       : [{partyClassificationId: PREV_ORDER, description: PREV_ORDER_TEXT, disabled: true},
                               {partyClassificationId: PROFILE,    description: PROFILE_TEXT}],
        disableClearable    : true
    },{
        name    : "personnelSubAreaId",
        label   : "حوزه کاری",
        type    : "select",
        options : [],//"ExpertiseArea",
        optionIdField   : "partyClassificationId",
        otherOutputs    : [{name: "personnelSubArea", optionIdField: "description"}],
        appendOptions       : [{partyClassificationId: PREV_ORDER, description: PREV_ORDER_TEXT, disabled: true},
                               {partyClassificationId: PROFILE,    description: PROFILE_TEXT}],
        disableClearable    : true
    },{
        name    : "personnelGroupId",
        label   : "گروه پرسنلی",
        type    : "select",
        options : [],//"EmployeeGroups",
        optionIdField   : "partyClassificationId",
        otherOutputs    : [{name: "personnelGroup", optionIdField: "description"}],
        appendOptions       : [{partyClassificationId: PREV_ORDER, description: PREV_ORDER_TEXT, disabled: true},
                               {partyClassificationId: PROFILE,    description: PROFILE_TEXT}],
        disableClearable    : true
    },{
        name    : "personnelSubGroupId",
        label   : "زیرگروه پرسنلی",
        type    : "select",
        options : is_personnel_group_prev_or_profile ?
            [{partyClassificationId: PREV_ORDER, description: PREV_ORDER_TEXT, disabled: true}, {partyClassificationId: PROFILE, description: PROFILE_TEXT}]
            : "EmployeeSubGroups",
        optionIdField   : "partyClassificationId",
        filterOptions   : options => is_personnel_group_prev_or_profile ?
            options : options.filter(o=>o.parentClassificationId===formValues.personnelGroupId),
        otherOutputs    : [{name: "personnelSubGroup", optionIdField: "description"}],
        disabled: is_personnel_group_prev_or_profile
    },{
        name    : "payGradeId",
        label   : "رتبه شغلی",
        type    : "select",
        options : [],//"EntPayGrade",
        optionIdField   : "payGradeId",
        appendOptions   : [{payGradeId: PREV_ORDER, description: PREV_ORDER_TEXT, disabled: true},
                           {payGradeId: PROFILE,    description: PROFILE_TEXT}],
        disableClearable: true
    }]

    React.useEffect(()=>{
        if (is_personnel_group_prev_or_profile) {
            setFormValues(prevState=>({
                ...prevState,
                personnelSubGroupId: formValues.personnelGroupId,
                personnelSubGroup: null
            }))
        } else {
            setFormValues(prevState=>({
                ...prevState,
                personnelSubGroupId: null,
                personnelSubGroup: null
            }))
        }

    },[formValues.personnelGroupId])

    React.useEffect(()=>{
        if(formValues.userCompanyId) {
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/EmplOrderSetting?companyPartyId=${formValues.userCompanyId}&typeEnumId=EostEmplOrder&statusId=Y`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setOrders(res.data.result)
            }).catch(() => {
            });
            axios.get(SERVER_URL + `/rest/s1/fadak/entity/Formula?companyPartyId=${formValues.userCompanyId}`, {
                headers: {'api_key': localStorage.getItem('api_key')},
            }).then(res => {
                setScoreFormulas(res.data.result.filter(i=>i.formulaTypeEnumId==="FrmlScore"))
                setCurrencyFormulas(res.data.result.filter(i=>i.formulaTypeEnumId==="FrmlCurrency"))
            }).catch(() => {
            });
        }
    },[formValues.userCompanyId])

    React.useEffect(()=>{
        if(formValues.settingId) {
            setLoading(true)
            axios.get(SERVER_URL + "/rest/s1/emplOrder/emplOrderFactor", {
                headers: {'api_key': localStorage.getItem('api_key')},
                params: {
                    settingId: formValues.settingId,
                    agreementId: formValues.AgreementTypeId
                }
            }).then(res => {
                setTableContent(res.data.emplOrderFactors)
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            });
        }
    },[formValues.settingId, formValues.AgreementTypeId])

    React.useEffect(()=>{
        if (formValues.jobId===PREV_ORDER || formValues.jobId===PROFILE) {
            setJobGrades([
                {jobGradeId: PREV_ORDER, jobTitle: PREV_ORDER_TEXT, jobGradeEnumId: null, disabled: true},
                {jobGradeId: PROFILE,    jobTitle: PROFILE_TEXT,    jobGradeEnumId: null}
            ])
            setJobGradesLoading(false)
            setFormValues(prevState => ({...prevState, jobGradeId: formValues.jobId, jobGradeTitle: null, jobGradeEnumId: null}))
        } else {
            setJobGradesLoading(true)
            setFormValues(prevState => ({...prevState, jobGradeId: null, jobGradeTitle: null, jobGradeEnumId: null}))
            axios.get(SERVER_URL + "/rest/s1/orgStructure/job/grade", {
                headers: {'api_key': localStorage.getItem('api_key')},
                params: {
                    jobId: formValues.jobId,
                }
            }).then(res => {
                setJobGrades(res.data.jobGrades)
                setJobGradesLoading(false)
            }).catch(() => {
                setJobGrades([])
                setJobGradesLoading(false)
            });
        }
    },[formValues.jobId]);

    return(
        <Grid container spacing={2}>
            {formStructure.map((input,index)=>(
                <FormInput key={index} {...input} valueObject={formValues} valueHandler={setFormValues} validationObject={formValidation} validationHandler={setFormValidation}/>
            ))}
            {formValues.newAgreement==="Y" &&
            <Grid item xs={12}>
                <Card variant="outlined">
                    <TablePro
                        title="لیست عوامل حکمی"
                        columns={tableCols}
                        rows={tableContent}
                        setRows={setTableContent}
                        loading={loading}
                        defaultOrderBy="calcSequence"
                        showRowNumber={false}
                        actions={[
                            {
                                title: "تعریف عامل حکمی",
                                icon: PostAddIcon,
                                onClick: ()=> {
                                    history.push(`/emplOrder/factors`);
                                },
                                disabled: true
                            }
                        ]}
                    />
                </Card>
            </Grid>
            }
        </Grid>
    )
}
