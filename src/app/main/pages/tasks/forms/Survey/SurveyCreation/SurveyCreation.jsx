import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import {Box, Button, CardContent} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import ActionBox from "../../../../../components/ActionBox";
import FormPro from "../../../../../components/formControls/FormPro";
import axios from "../../../../../api/axiosRest";
import Divider from "@material-ui/core/Divider";
import SurveyParticipants from "../../../../survey/definition/SurveyParticipants";
import {useDispatch} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";

const formDefaultValues = {}

export default function SurveyCreation({formVariables,submitCallback}) {
    const [formValues, set_formValues] = React.useState(formDefaultValues)
    const [formValidation, setFormValidation] = React.useState({});
    const [participants, setParticipants] = React.useState(formVariables?.contactList ? formVariables?.contactList?.value : []);
    const [partyRelationshipIds, setPartyRelationshipIds] = React.useState(formVariables ? formVariables.partyRelationshipIds?.value : []);
    const [questionnaires, setQuestionnaires] = React.useState([]);
    const dispatch = useDispatch();
    const [waiting, set_waiting] = React.useState(false)
    const [waiting1, set_waiting1] = React.useState(false)
    const [waiting2, set_waiting2] = React.useState(false)
    const myElement =  React.createRef(0);


    const formStructure = [{
        name    : "code",
        label   : "کد رهگیری",
        type    : "text",
        value   : formVariables?.trackingCode?.value,
        disabled: true,
    },{
        name    : "name",
        label   : "عنوان",
        type    : "text",
        required: true,
    },{
        name    : "fromDate",
        label   : "تاریخ ارسال",
        required: true,
        type    : "date",
        disablePast:true
    },{
        name    : "thruDate",
        label   : "مهلت پاسخ",
        required: true,
        type    : "date",
        disablePast:true
    },{
        name    : "questionnaireId",
        label   : "فرم نظرسنجی",
        required: true,
        type    : "select",
        options : questionnaires,
        optionIdField: "questionnaireId",
        optionLabelField: "name",
        otherOutputs: [{name: "questionnaireName", optionIdField: "name"}]
    },{
        name    : "description",
        label   : "توضیحات",
        type    : "textarea",
        col     : 12,
    }]


    const checkFormValues = () => {
        myElement.current.click();
        let isValid = true
        if( !formValues.name || formValues.name == "" || !formValues.fromDate || formValues.fromDate == "" || !formValues.thruDate || formValues.thruDate == "" || !formValues.questionnaireId || formValues.questionnaireId == ""){
            isValid = false
        }
        return isValid
    }

    const initiateProcess = () => {
        if(checkFormValues()){
            if(checkPersonnel()){
                if(new Date(formValues.fromDate) >= new Date(formValues.thruDate)){
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'تاریخ ارسال باید قبل از مهلت پاسخ باشد.'));
                }
                else{
                    const moment = require('moment-jalaali')
                    set_waiting(true)
                    formValues.fromDate = moment(new Date(new Date().getTime())).format("Y-MM-DD")
                    let fdata = {
                        "procStartTime":formValues.fromDate,
                        "name":formValues.name,
                        "continue":'true',
                        "processType":'survey',
                        "questionaire":formValues,
                        "partyRelationshipIds":partyRelationshipIds,
                        "contactList":participants,
                        "api_key": localStorage.getItem('Authorization')
                    }
                    submitCallback(fdata,false,formVariables?.processInstanceId?.value)
                }
            }
            else{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'حداقل یک فرد برای نظر سنجی انتخاب کنید.'));
            }
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'تمامی فیلد های ضروری را پر کنید.'));
        }
    }

    const confirmData = () => {
        if(checkFormValues()){
            if(checkPersonnel()){
                if(new Date(formValues.fromDate) >= new Date(formValues.thruDate)){
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'تاریخ ارسال باید قبل از مهلت پاسخ باشد.'));
                }
                else{
                    set_waiting1(true)
                    let fdata = {
                        "procStartTime":formValues.fromDate,
                        "name":formValues.name,
                        "continue":'false',
                        "processType":'survey',
                        "questionaire":formValues,
                        "partyRelationshipIds":partyRelationshipIds,
                        "contactList":participants,
                        "api_key": localStorage.getItem('Authorization')
                    }
                    submitCallback(fdata,false,formVariables?.processInstanceId?.value)
                }
            }
            else{
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'حداقل یک فرد برای نظر سنجی انتخاب کنید.'));
            }
        }
        else{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'تمامی فیلد های ضروری را پر کنید.'));
        }
    }

    const checkPersonnel = () => {
        let isValid = partyRelationshipIds.length > 0 
        return isValid
    }

    const cancelProcess = () => {
        set_waiting2(true)
        let fdata = {
            "continue":'cancel',
            "api_key": localStorage.getItem('Authorization')
        }
        submitCallback(fdata)
    }

    const handle_submit = ()=>{
        // set_formValues(formDefaultValues)
    }

    React.useEffect(()=>{
        axios.get("/s1/questionnaire/archive?subCategoryEnumId=QcSurvey").then(res => {
            setQuestionnaires(res.data.questionnaires)
        }).catch(() => {
            setQuestionnaires([])
        });
        if(formVariables?.questionaire) {
            set_formValues(formVariables.questionaire.value)
        } else {
            set_formValues(formDefaultValues)
        }
    },[])

    return (
    // <FusePageSimple
    //     header={<CardHeader title={"نظرسنجی"}/>}
    //     content={
    //         <Box p={2}>
                <Card>
                    <CardHeader title="تعریف نظرسنجی"/>
                    <CardContent>
                        <FormPro formValues={formValues} setFormValues={set_formValues} formDefaultValues={formDefaultValues}
                                formValidation={formValidation} setFormValidation={setFormValidation}
                                prepend={formStructure}
                                actionBox={<ActionBox style={{display:"none"}}>
                                    <Button ref={myElement} type="submit" role="primary">ثبت</Button>
                                    {/* <Button type="reset" role="secondary">لغو</Button> */}
                                </ActionBox>}
                                submitCallback={handle_submit}
                        />
                        {/* {objectId && */}
                        <React.Fragment>
                            <Box my={2}>
                                <Divider variant="fullWidth"/>
                            </Box>
                            <SurveyParticipants participantss={participants} setParticipants={setParticipants} partyRelationshipIds={partyRelationshipIds} setPartyRelationshipIds={setPartyRelationshipIds}/>
                        </React.Fragment>
                        {/* } */}
                        <Box my={2}>
                            <Divider variant="fullWidth"/>
                        </Box>
                        <ActionBox>
                             <Button type="submit" disabled={waiting || waiting1 || waiting2} endIcon={waiting?<CircularProgress size={20}/>:null} onClick={initiateProcess} role="primary">شروع نظر سنجی</Button>
                             <Button type="submit" disabled={waiting || waiting1 || waiting2} endIcon={waiting1?<CircularProgress size={20}/>:null} onClick={confirmData} role="primary">ثبت نظر سنجی</Button>
                             <Button type="reset" style={{display: formVariables ? "" : 'none'}} disabled={waiting || waiting1 || waiting2} endIcon={waiting2?<CircularProgress size={20}/>:null} onClick={cancelProcess} role="secondary">لغو نظرسنجی</Button>
                         </ActionBox>
                    </CardContent>
                </Card>
        //     </Box>
        // }
    // />

    )
}
