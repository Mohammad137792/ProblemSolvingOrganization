import { Card, CardContent, CardHeader } from '@material-ui/core';
import React, { useState, useEffect , createRef} from 'react';
import TransferList from "../../../../components/TransferList";
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import axios from 'axios';
import {Button, Grid, Typography, Box} from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from "../../../../components/ActionBox";
import UserCompany from "../../../../components/formControls/UserCompany";
import checkPermis from "app/main/components/CheckPermision";

const AddVolunteer = (props) => {

    const { personnel, audience, formValues, setFormValues, submitRef, submit=()=>{}} = props

    const [filterFormValues,setFilterFormValues] = useState ({})
    const [fieldsInfo,setFieldsInfo] = useState ({})

    const [resetData,setResetData] = useState(false)

    const [formValidation, setFormValidation] = React.useState({});

    const datas =  useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const dateStructure = [{
        label   :  "مهلت پاسخ",
        name    :   "responseTime",
        type    :   "date",
        required : true ,
        col     : 3
    }]

    const filter_audience = (parties) => {

        if(audience.list.length !== 0) {
            console.log("audience.list" , audience.list);
            return parties.filter(i => i?.username  && i?.username !== "" && (audience.list.findIndex(j => j.username === i.username) < 0))
        }
        else {
            return parties.filter(i => i?.username  && i?.username !== "")
        }
    }

    React.useEffect(()=>{
        getData() 
        filterData()
    },[])

    React.useEffect(()=>{
        console.log("resetData" , resetData);
        if(resetData ){
            filterData()
        }
    },[resetData])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/humanres/companyInfo` , axiosKey).then((info)=>{
            setFieldsInfo(info.data)
        }).catch(()=>{
                
        })
    }

    const filterData = () => {
        axios.post(`${SERVER_URL}/rest/s1/humanres/requistionAudience` , {data : filterFormValues} , axiosKey).then((pers)=>{
            personnel.set(filter_audience(pers.data?.audience))
            setResetData(false)
        }).catch(()=>{

        })
    }

    const display_name = (item) => `${item?.fullName != "" ? item?.fullName : "-"} `;

    const display_org_info = (item) => {
        let info = []
        if(item?.partyRelationshipId) info.push(item?.emplPosition)
        if(item?.partyRelationshipId) info.push(item?.unitOrganization)
        if(item?.partyRelationshipId) info.push(item?.organizationName)
        return info.join("، ") || "─"
    }

    const handle_add_participant = (parties) => new Promise((resolve, reject) => { 
        resolve(parties)
     })

    const handle_delete_participant = (parties) => new Promise((resolve, reject) => {
        resolve(parties)
    })

    return (
        <Card>
            <CardContent>
                <FormPro
                    prepend={dateStructure}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formValidation={formValidation}
                    setFormValidation={setFormValidation}
                    submitCallback={submit}
                    actionBox={
                        <ActionBox>
                            <Button
                                ref={submitRef}
                                type="submit"
                                role="primary"
                                style={{ display: "none" }}
                            />
                        </ActionBox>
                    }
                />
                <CardHeader title = "افزودن داوطلب به نیازمندی شغلی" />
                <TransferList
                    rightTitle={"لیست پرسنل"}
                    rightContext={personnel}
                    rightItemLabelPrimary={display_name}
                    rightItemLabelSecondary={display_org_info}
                    leftTitle={<Typography style={{fontSize : "16px"}}>لیست داوطلبان افزوده شده به نیازمندی شغلی</Typography>}
                    leftContext={audience}
                    leftItemLabelPrimary={display_name}
                    leftItemLabelSecondary={display_org_info}
                    onMoveLeft={checkPermis("humanResourcesPlanning/jobNeedManagement/addVolunteer/add", datas) ? handle_add_participant : ""}
                    onMoveRight={checkPermis("humanResourcesPlanning/jobNeedManagement/addVolunteer/delete", datas) ? handle_delete_participant : ""}
                    rightFilterForm={
                        <FilterForm formValues={filterFormValues} setFormValues={setFilterFormValues} fieldsInfo={fieldsInfo} setResetData={setResetData}/>
                    }
                />
            </CardContent>
        </Card>
    );
};

export default AddVolunteer;

function FilterForm (props) {

    const {formValues, setFormValues, handleClose, fieldsInfo, setResetData} = props

    const [filterFields,setFilterFields] = useState({});

    const filterStructure = [{
        type    : "component",
        component: <UserCompany setValue={setFormValues}/>,
        display : false
    },{
        name    : "organizationPartyId",
        label   : "شرکت",
        type    : "multiselect",
        options : fieldsInfo.companies ,
        optionLabelField :"organizationName",
        optionIdField:"partyId",
        col     : 3,
    },{
        name    : "organizationUnit",
        label   : "واحد سازمانی",
        type    : "multiselect",
        options : fieldsInfo.organizationUnit ,
        optionLabelField :"organizationName",
        optionIdField:"partyId",
        filterOptions: (options) =>
        filterFields.positions.length != 0 
          ? options.filter(
                (item) => filterFields.positions.indexOf(item.partyId) >= 0
          ): options,
        disabled : (formValues?.organizationUnit && eval(formValues?.organizationUnit).indexOf(formValues?.userCompanyId) >= 0) ,
        col     : 3,
    },{
        name    : "position",
        label   : "پست سازمانی",
        type    : "multiselect",
        options : fieldsInfo.emplPosition ,
        optionLabelField :"description",
        optionIdField:"emplPositionId",
        filterOptions: (options) =>
          (formValues["organizationUnit"] && eval(formValues["organizationUnit"]).length > 0 )
          ? options.filter(
            (item) => eval(formValues["organizationUnit"]).indexOf(item.organizationPartyId) >= 0
          ):options,
        disabled : formValues?.organizationUnit && eval(formValues?.organizationUnit).indexOf(formValues?.userCompanyId) >= 0 ,
        col     : 3,
    },{
        name    : "employeeGroups",
        label   : "گروه پرسنلی",
        type    : "multiselect",
        options : fieldsInfo.employeeGroups ,
        optionLabelField :"description",
        optionIdField:"partyClassificationId",
        filterOptions: (options) =>
        filterFields.group.length != 0 
          ? options.filter(
                (item) => filterFields.group.indexOf(item.partyClassificationId) >= 0
          ): options,
        disabled : formValues?.organizationUnit && eval(formValues?.organizationUnit).indexOf(formValues?.userCompanyId) >= 0 ,
        col     : 3,
    },{
        name    : "employeeSubGroups",
        label   : "زیر گروه پرسنلی",
        type    : "multiselect",
        options : fieldsInfo.employeeSubGroups ,
        optionLabelField :"description",
        optionIdField:"partyClassificationId",
        filterOptions: (options) =>
         (formValues["employeeGroups"] && eval(formValues["employeeGroups"]).length > 0 )
          ? options.filter(
            (item) => eval(formValues["employeeGroups"]).indexOf(item.parentClassificationId) >= 0
          ): options,
        disabled : formValues?.organizationUnit && eval(formValues?.organizationUnit).indexOf(formValues?.userCompanyId) >= 0 ,
        col     : 3,
    }]

    useEffect(() => {
        if (formValues.position && formValues.position != "[]" && fieldsInfo?.emplPosition){
            let selectedPositionsInfo = fieldsInfo?.emplPosition.filter((item) => eval(formValues["position"]).indexOf(item?.emplPositionId) >= 0)
            let unit = selectedPositionsInfo.map(a => a?.organizationPartyId);
            filterFields.positions = Array.from(new Set(unit))
            setFilterFields(Object.assign({},filterFields))
        }
        else {
            filterFields.positions = []
            setFilterFields(Object.assign({},filterFields))
        }
    }, [formValues?.position,fieldsInfo?.emplPosition])

    useEffect(() => {
        if (formValues.employeeSubGroups && formValues.employeeSubGroups != "[]" && fieldsInfo?.employeeSubGroups){
            let selectedSubGroupInfo = fieldsInfo?.employeeSubGroups.filter((item) => eval(formValues["employeeSubGroups"]).indexOf(item?.partyClassificationId) >= 0)
            let group = selectedSubGroupInfo.map(a => a?.parentClassificationId);
            filterFields.group = Array.from(new Set(group))
            setFilterFields(Object.assign({},filterFields))
        }
        else {
            filterFields.group = []
            setFilterFields(Object.assign({},filterFields))
        }
    }, [formValues?.employeeSubGroups,fieldsInfo?.employeeSubGroups])
    
    const handle_filter = () => {
        setResetData(true)
        handleClose()
    }

    const resetCallback = () => {
        setResetData(true)
        setFormValues({})
        handleClose()
    }
    console.log("formValues" , formValues);
    return (
        <div>
            <FormPro
                formValues = {formValues}
                setFormValues = {setFormValues}
                append={filterStructure}
                submitCallback = {handle_filter}
                resetCallback={resetCallback}
                actionBox={
                    <ActionBox>
                        <Button type="submit" role="primary">جستجو</Button>
                        <Button type="reset" role="secondary">لغو</Button>
                    </ActionBox>
                }
            />
        </div>
    );
}