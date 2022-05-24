import FormPro from "../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import TabPro from 'app/main/components/TabPro';
import ActionBox from "../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import { useHistory } from "react-router-dom";
import HeaderPersonnelFile from "../../personnelBaseInformation/HeaderPersonnelFile";
import VolunteerList from "./tabs/VolunteerList"
import ResultVolunteerInterview from "./tabs/ResultVolunteerInterview"
import UserProfile from "../../userProfile/UserProfile"
import TalentProfile from "../talentProfile/TalentProfile"
import DefinePersonnel from "../../personnelManagement/definePersonnel/DefinePersonnel"

const VolunteerManagementForm = (props) => {

    const {formValues, setFormValues, submit=()=>{}, goBackWaiting, closeWaiting} = props

    const [fieldInfo , setFieldInfo] = useState({});

    const [pageStatus, setPageStatus] = useState("main")

    const [jobApplicantId, setJobApplicantId] = useState("")

    const [candidates, setCandidates] = useState([]);

    const [userPartyId, setUserPartyId] = useState("")

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    React.useEffect(()=>{
        getData()
    },[])

    const getData = () => {
        axios.post(`${SERVER_URL}/rest/s1/fadak/searchUsers` , {data : {}} , axiosKey).then((person)=>{
            fieldInfo.personnel = person.data.result.filter((i)=>i.username && i.username !== "")
            axios.get(`${SERVER_URL}/rest/s1/fadak/emplPosition`, axiosKey).then((pos)=>{
                fieldInfo.positions = pos.data?.position
                setFieldInfo(Object.assign({},fieldInfo))
                setFormValues(Object.assign({},formValues))
            })
        })
    }
    console.log("formValues" , formValues);
    const formStructure = [{
        name    : "trackingCode",
        label   : "کد نیازمندی شغلی",
        type    : "text",
        readOnly : true ,
        col     : 4
    },{
        name    : "requistionTitle",
        label   : "عنوان نیازمندی شغلی",
        type    : "text",
        readOnly : true ,
        col     : 4
    },{
        name    : "startDate",
        label   : "تاریخ ایجاد نیازمندی",
        type    : "date",
        readOnly : true ,
        col     : 4
    },{
        name    : "neededNum",
        label   : "تعداد مورد نیاز",
        type    : "number",
        readOnly : true ,
        col     : 4
    },{
        name    : "manegerPartyRelationShipId",
        label   : "مدیر متقاضی جذب",
        type    : "select",
        options : fieldInfo.personnel ,
        optionLabelField :"fullName",
        optionIdField:"partyRelationshipId",
        readOnly : true ,
        col     : 4
    },{
        name    : "manegerEmplePositionId",
        label   : "پست مدیر متقاضی جذب",
        type    : "select",
        options : fieldInfo.positions,
        optionLabelField :"description",
        optionIdField:"emplPositionId",
        readOnly : true ,
        col     : 4
    }]

    const tabs = [{
        label: "لیست داوطلبان",
        panel: <VolunteerList requistionPersonnel={formValues?.RequistionPersonnel} jobRequistionId={formValues?.jobRequistionId} pageStatus={pageStatus} setPageStatus={setPageStatus}
        setJobApplicantId={setJobApplicantId} setCandidates={setCandidates} setUserPartyId={setUserPartyId}/>
    },{
        label: "نتیجه مصاحبه داوطلبان",
        panel: <ResultVolunteerInterview jobRequistionId={formValues?.jobRequistionId} setPageStatus={setPageStatus} setCandidates={setCandidates} setUserPartyId={setUserPartyId}/>
    }]

    return ( 
        pageStatus=="main" ? <div>
            <Card>
                <CardContent>
                    <FormPro
                        prepend={formStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}
                    />
                </CardContent>
            </Card>
            <Box mb={2}/>
            <Card>
                <CardContent>
                    <TabPro tabs={tabs}/>
                </CardContent>
            </Card>
            <Box mb={2}/>
            <ActionBox>
                <Button type="submit" role="primary" onClick={()=>submit(true)}
                    disabled={closeWaiting}
                    endIcon={closeWaiting?<CircularProgress size={20}/>:null}
                >بستن نیازمندی شغلی</Button>
                <Button type="reset" role="secondary" onClick={()=>submit(false)}
                    disabled={goBackWaiting}
                    endIcon={goBackWaiting?<CircularProgress size={20}/>:null}
                >مدیریت نیازمندی شغلی</Button>
            </ActionBox>
            <Box mb={2}/>
        </div>
        : pageStatus == "personnelProfile" ? <UserProfile partyId={userPartyId} origin="userProfile" recruitmentProcess={setPageStatus} pageStatus={pageStatus}/>
        : pageStatus == "talentProfile" ? <TalentProfile volunteerProfile={true} recruitmentProcess={setPageStatus} jobApplicantId={jobApplicantId}/>
        : pageStatus == "createAccount" ? <DefinePersonnel recruitmentProcess={true} recruitmentProcessPageStatus={setPageStatus} candidates={candidates}/>
        : ""
    );
};

export default VolunteerManagementForm;
