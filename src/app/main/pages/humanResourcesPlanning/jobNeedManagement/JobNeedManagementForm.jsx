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
import NeedingInformation from "./tabs/NeedingInformation"
import AddVolunteer from "./tabs/AddVolunteer"
import Advertising from "./tabs/Advertising"


const JobNeedManagementForm = (props) => {

    const {submit=()=>{}, formValues, setFormValues, contentsName, setContentsName, jobAdvantages, setJobAdvantages, personnel, audience, waiting, set_waiting  } = props

    const [fieldInfo , setFieldInfo] = useState({});

    const datas =  useSelector(({ fadak }) => fadak);

    const [submitClicked, setSubmitClicked] = useState(0);
    const [draftClicked, setDraftClicked] = useState(0);

    const submitRef = createRef(0);
    const draftRef = createRef(0);

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
            })
        })
    }

    const formStructure=[{
        name    : "trackingCode",
        label   : "کد رهگیری نیازمندی شغلی",
        type    : "text",
        col     : 3 ,
        readOnly : true
    },{
        name    : "startDate",
        label   : "تاریخ ایجاد نیازمندی",
        type    : "date",
        col     : 3,
        readOnly : true
    },{
        name    : "manegerEmplePositionId",
        label   : "پست مدیر متقاضی جذب",
        type    : "select",
        options : fieldInfo.positions,
        optionLabelField :"description",
        optionIdField:"emplPositionId",
        col     : 3,
        readOnly : true
    },{
        name    : "manegerPartyRelationShipId",
        label   : "مدیر متقاضی جذب",
        type    : "select",
        options : fieldInfo.personnel ,
        optionLabelField :"fullName",
        optionIdField:"partyRelationshipId",
        col     : 3,
        readOnly : true
    }]

    let tabsPermision = []

    if(checkPermis("humanResourcesPlanning/jobNeedManagement/needingInformation", datas)){
        tabsPermision.push({
            label: "اطلاعات نیازمندی",
            panel: <NeedingInformation formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName}
                                        jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages} submitRef={submitRef} submit={submit} />
        })
    }

    if(checkPermis("humanResourcesPlanning/jobNeedManagement/addVolunteer", datas)){
        tabsPermision.push({
            label: "افزودن داوطلب",
            panel: <AddVolunteer personnel={personnel} audience={audience} formValues={formValues} setFormValues={setFormValues} submitRef={submitRef} submit={submit}/>
        })
    }

    if(checkPermis("humanResourcesPlanning/jobNeedManagement/advertising", datas)){
        tabsPermision.push({
            label: "آگهی و پست",
            panel: <Advertising jobRequistionId={formValues?.jobRequistionId}  submitRef={submitRef} submit={submit}/>
        })
    }

    const draft = () => {

    }

    function trigerHiddenSubmitBtn() {
        if(audience.list.length > 0){setSubmitClicked(submitClicked + 1)}
        if(audience.list.length === 0){submit()}
    }

    // function trigerHiddenDraftBtn() {
    //     setDraftClicked(draftClicked + 1);
    // }

    React.useEffect(() => {
        if (submitRef.current && submitClicked > 0) {
            submitRef.current.click();
        }
    }, [submitClicked]);

    // React.useEffect(() => {
    //     if (draftRef.current && draftClicked > 0) {
    //         draftRef.current.click();
    //     }
    // }, [draftClicked]);

    return (
        formValues &&  <Card>
            <CardContent>
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
                        <TabPro tabs={tabsPermision}/>
                    </CardContent>
                </Card>
                <Box mb={2}/>
                <div style={{display: "flex", justifyContent: "flex-end" }}>
                    {/* <Button
                        style={{
                            width: "120px",
                            color: "secondary",
                        }}
                        variant="outlined"
                        type="reset"
                        role="secondary"
                        onClick={draft}
                    >
                    پیش نویس
                    </Button> */}
                    <Button
                        style={{
                            width: 120,
                            color: "white",
                            backgroundColor: "#039be5",
                            marginRight: "8px",
                        }}
                        variant="outlined"
                        type="submit"
                        role="primary"
                        onClick={trigerHiddenSubmitBtn}
                        disabled={waiting}
                        endIcon={waiting?<CircularProgress size={20}/>:null}
                    >
                        تایید       
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default JobNeedManagementForm;
