import React from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../../../configs";
import {Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import TablePro from "../../../../../components/TablePro";
import UserFullName from "../../../../../components/formControls/UserFullName";
import UserCompany from "../../../../../components/formControls/UserCompany";
import UserEmplPosition from "../../../../../components/formControls/UserEmplPosition";
import FormButton from "../../../../../components/formControls/FormButton";
import ActionBox from "../../../../../components/ActionBox";
import FormPro from "../../../../../components/formControls/FormPro";

const formDefaultValues = {
    partyDisabled: "N",
}

function SearchPersonnelForm({submitCallback, userCompanyId}) {
    const [orders, setOrders] = React.useState([]);
    const [formValues, setFormValues] = React.useState(formDefaultValues);
    const [moreFilter, setMoreFilter] = React.useState(false);
    const formStructure = [{
        name    : "pseudoId",
        label   : "کد پرسنلی",
        type    : "text",
    },{
        name    : "firstName",
        label   : "نام پرسنل",
        type    : "text",
    },{
        name    : "AgreementType",
        label   : "نوع قرارداد",
        type    : "select",
        options : "Agreement",
        optionIdField   : "description",
    },{
        name    : "EmplOrderType",
        label   : "نوع حکم کارگزینی",
        type    : "select",
        options : orders,
        optionIdField       : "title",
        optionLabelField    : "title",
        display : moreFilter,
    },{
        name    : "employmentDateFrom",
        label   : "تاریخ استخدام از",
        type    : "date",
        display : moreFilter,
    },{
        name    : "employmentDateTo",
        label   : "تاریخ استخدام تا",
        type    : "date",
        display : moreFilter,
    },{
        name    : "organizationUnit",
        label   : "واحد سازمانی",
        type    : "select",
        options : "OrganizationUnit",
        optionIdField       : "organizationName",
        optionLabelField    : "organizationName",
        display : moreFilter,
    },{
        name    : "jobTitle",
        label   : "شغل",
        type    : "select",
        options : "Job",
        optionIdField       : "jobTitle",
        optionLabelField    : "jobTitle",
        display : moreFilter,
    },{
        name    : "personnelArea",
        label   : "منطقه فعالیت",
        type    : "select",
        options : "ActivityArea",
        optionIdField   : "description",
        display : moreFilter,
    },{
        name    : "personnelSubArea",
        label   : "حوزه کاری",
        type    : "select",
        options : "ExpertiseArea",
        optionIdField   : "description",
        display : moreFilter,
    },{
        name    : "personnelGroupId",
        label   : "گروه پرسنلی",
        type    : "select",
        options : "EmployeeGroups",
        optionIdField   : "description",
        otherOutputs    : [{name: "personnelGroup", optionIdField: "description"}],
        display : moreFilter,
    },{
        name    : "personnelSubGroup",
        label   : "زیرگروه پرسنلی",
        type    : "select",
        options : "EmployeeSubGroups",
        optionIdField   : "partyClassificationId",
        filterOptions   : options => options.filter(o=>o.parentClassificationId===formValues.personnelGroupId),
        display : moreFilter,
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
    },[userCompanyId])

    return(
        <FormPro prepend={formStructure} formDefaultValues={formDefaultValues}
                 formValues={formValues} setFormValues={setFormValues}
                 submitCallback={()=>submitCallback(formValues)} resetCallback={()=>submitCallback(formDefaultValues)}
                 actionBox={<ActionBox>
                     <Button type="submit" role="primary">اعمال فیلتر</Button>
                     <Button type="reset" role="secondary">لغو</Button>
                 </ActionBox>}
        >
            <FormButton onClick={()=>setMoreFilter(!moreFilter)}
                        startIcon={moreFilter && <ChevronRightIcon/>}
                        endIcon={!moreFilter &&<ChevronLeftIcon/>} >
                {moreFilter?"فیلترهای کمتر":"فیلترهای بیشتر"}
            </FormButton>
        </FormPro>
    )
}

const EOIPersonnel = (props)=>{
    const {formValues, setFormValues, personnel, selectPersonnel} = props;
    const [loading, setLoading] = React.useState(true);
    const [tableContent, setTableContent] = React.useState([]);
    const tableCols = [
        {name: "pseudoId", label: "کد پرسنلی", type: "text", style: {width:"80px"}},
        {name: "firstName", label: "نام", type: "render", render: (row)=>{return `${row.firstName||''} ${row.lastName||''}`;}, style: {width:"170px"}},
        {name: "nationalId", label: "کد ملی", type: "text"},
        {name: "emplPositionTitle", label: "پست سازمانی", type: "text"},
        {name: "organizationUnit", label: "واحد سازمانی", type: "text"},
        {name: "EmplOrderType", label: "نوع حکم", type: "text"},
        {name: "thruDate", label: "تاریخ اعتبار", type: "date"},
        {name: "statusId", label: "وضعیت حکم", type: "indicator" ,indicator:{"true":"ActiveEmplOrder"}},
    ]

    function getPersons(params=formDefaultValues) {
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/fadak/searchPersonnelAndEmplOrder", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params : {...params, ownerPartyId: JSON.stringify([formValues.userCompanyId.trim()])}
        }).then(res => {
            console.log('person',res)
            setLoading(false)
            setTableContent(res.data.result)
        }).catch(err => {
            setLoading(false)
            console.log('get personnel error..', err);
        });
    }

    React.useEffect(()=>{
        if(formValues.userCompanyId){
            getPersons()
        }
    },[formValues.userCompanyId])

    return(
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={3}>
                    <UserFullName label="نام و نام خانوادگی تنظیم کننده" name="producerPartyId" name2="producerFullName" setValue={setFormValues}/>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <UserCompany setValue={setFormValues}/>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <UserEmplPosition label="پست سازمانی تهیه کننده" name="producerEmplPositionId" valueObject={formValues} valueHandler={setFormValues}
                                      getOptionLabel={opt => opt ? (`${opt.pseudoId} ─ ${opt.description}` || "؟") : ""}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Card variant="outlined">
                        <TablePro
                            title="لیست پرسنل"
                            columns={tableCols}
                            rows={tableContent}
                            loading={loading}
                            defaultOrderBy="firstName"
                            selectable
                            selectedRows={personnel}
                            setSelectedRows={selectPersonnel}
                            isSelected={(row,selectedRows) => selectedRows.map(i=>i.partyId).indexOf(row.partyId)!==-1 }
                            filter="external"
                            filterForm={
                                <SearchPersonnelForm submitCallback={getPersons} userCompanyId={formValues.userCompanyId}/>
                            }
                        />
                    </Card>
                </Grid>

            </Grid>
        </React.Fragment>
    )
}
export default EOIPersonnel
