import FormPro from "../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import ActionBox from "../../../components/ActionBox";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Divider } from '@material-ui/core';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import axios from 'axios';
import checkPermis from "app/main/components/CheckPermision";
import BaseInformation from "./steps/BaseInformation"
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import JobAndPositionInformation from "./steps/JobAndPositionInformation"
import FurtherInformation from "./steps/FurtherInformation"
import TeamAndPathOfRecruitment from "./steps/TeamAndPathOfRecruitment"
import JobDescription from "./steps/JobDescription"
import Attachment from "./steps/Attachment"
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";



const CreatingJobNeedsForm = (props) => {

    const {managementMode = false , formValues, setFormValues, contentsName, setContentsName, jobAdvantages, setJobAdvantages, confirmManager=()=>{}, confirmation = false,
     managemenWaiting, setManagemenWaiting, draftMode = false , taskId, setAction} = props

    const [processDefinitionId,setProcessDefinitionId] = useState('')

    const [formValidation, setFormValidation] = React.useState({});

    const partyRelationshipId =  useSelector(({ auth }) => auth.user.data.partyRelationshipId);

    const [fieldInfo , setFieldInfo] = useState({});

    const [step, set_step] = useState("baseInformation");

    const [permissionList, setPermissionList ] = useState([])

    const [initialSettings, setInitialSettings] = useState(true);

    const [draftWaiting, setDraftWaiting] = useState(false);

    const dispatch = useDispatch();

    const history = useHistory();

    const [clicked, setClicked] = useState(0);
    const submitRef = createRef(0);

    const [creatorInfo,setCreatorInfo] = useState({})

    const [waiting, set_waiting] = useState(false) 

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure=[{
            name    : "jobRequistionId",
            label   : "فراخوانی از نیازمندی های شغلی قبلی",
            type    : "select",
            options : fieldInfo.jobRequistions ,
            optionLabelField :"requistionTitle",
            optionIdField:"jobRequistionId",
            col     : 4
        }
        // ,{
        //     name    : "partyId",
        //     label   : "واحد سازمانی موقعیت شغلی مورد نیاز",
        //     type    : "select",
        //     options : fieldInfo.org ,
        //     optionLabelField :"organizationName",
        //     optionIdField:"partyId",
        //     col     : 4
        // },{
        //     name    : "emplPositionId",
        //     label   : "پست مورد نیاز",
        //     type    : "select",
        //     options : fieldInfo.positions,
        //     optionLabelField :"description",
        //     optionIdField:"emplPositionId",
        //     col     : 4
        // }
    ]
    
    React.useEffect(()=>{
        if(formValues?.jobRequistionId && formValues?.jobRequistionId !== ""){
            axios.get(`${SERVER_URL}/rest/s1/humanres/oneJobRequistion?jobRequistionId=${formValues?.jobRequistionId}`, axiosKey).then((info)=>{
                setFormValues({...info.data?.jobRequistion , userPosition : creatorInfo?.userPosition , fullName : creatorInfo?.fullName , creationDate : new Date() })
                setJobAdvantages(info.data?.jobRequistion?.jobAdvantages)
                setContentsName(info.data?.jobRequistion?.requistionContent)
            })
        }
        else if(!managementMode && !confirmation && !draftMode) {
            setFormValues({ userPosition : creatorInfo?.userPosition , fullName : creatorInfo?.fullName , creationDate : new Date() })
            setJobAdvantages([])
            setContentsName([])
        }
    },[formValues?.jobRequistionId,creatorInfo])

    const creatingFormStructure = [{
        name    : "creationDate",
        label   : "تاریخ ایجاد",
        type    : "date",
        readOnly : true ,
        col     : 4
    },{
        name    : "userPosition",
        label   : "پست سازمانی ایجاد کننده",
        type    : "text",
        col     : 4 ,
        readOnly : true ,
    },{
        name    : "fullName",
        label   : "نام و نام خانوادگی ایجاد کننده",
        type    : "text",
        col     : 4 ,
        readOnly : true ,
    }]

    const nextStep = () => {
        permissionList.map((item,index)=>{
            if(step === item){
                set_step(permissionList[index+1])
            }
        })
    }

    React.useEffect(()=>{
        getData()
        formValues.creationDate = new Date()
        setFormValues(Object.assign({},formValues))
    },[])

    const getData = () => {
        axios.get(`${SERVER_URL}/rest/s1/fadak/party/subOrganization`, axiosKey).then((org)=>{
            fieldInfo.org = org.data?.organizationUnit
            axios.get(`${SERVER_URL}/rest/s1/fadak/emplPosition`, axiosKey).then((pos)=>{
                fieldInfo.positions = pos.data?.position
                axios.get(`${SERVER_URL}/rest/s1/humanres/jobRequistion`, axiosKey).then((res)=>{
                    axios.get(`${SERVER_URL}/rest/s1/humanres/getCurrentUser`, axiosKey).then((user)=>{
                        fieldInfo.jobRequistions = res.data?.jobRequistions
                        formValues.partyId = res.data?.jobRequistions?.organizationPartyId
                        formValues.emplPositionId = res.data?.jobRequistions?.emplPositionId
                        formValues.userEmplPositionId = user.data?.emplPositionId
                        formValues.userPosition = user.data?.emplPosition
                        formValues.fullName = user.data?.fullName
                        formValues.partyRelationshipId = partyRelationshipId
                        setCreatorInfo({fullName : user.data?.fullName , userPosition : user.data?.emplPosition , emplPositionId : user.data?.emplPositionId})
                        setFormValues(Object.assign({},formValues))
                        setFieldInfo(Object.assign({},fieldInfo))
                    })
                })
            })
        })
    }

    React.useEffect(()=>{
        if(!managementMode && !confirmation){
            formValues.creatorPartyRelationshipId = partyRelationshipId
            formValues.creatorEmplPositionId = creatorInfo?.emplPositionId
            formValues.userPosition = creatorInfo?.userPosition
            formValues.fullName = creatorInfo?.fullName
            setFormValues(Object.assign({},formValues))
        }
    },[creatorInfo,partyRelationshipId])
    
    const handleCancel = () => {
        history.push('/dashboard')
    }

    const priviousStep = () => {
        permissionList.map((item,index)=>{
            if(step === item){
                set_step(permissionList[index-1])
            }
        })
    }

    function trigerHiddenSubmitBtn() {
        if(step == "teamAndPathOfRecruitment" && (formValues?.personnel?.length == 0 || !formValues?.personnel)){
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'پرسنلی انتخاب نشده است !'));
        }
        else{
            setClicked(clicked + 1);
        }
    }

    React.useEffect(() => {
        if (submitRef.current && clicked > 0 ) {
            submitRef.current.click();
        }
    }, [clicked]);

    // Camunda Config .............................

    React.useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/fadak/process/list", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setProcessDefinitionId(res.data.outList.find(i => i.key === "RecruitmentAndEmployment").id)

        }).catch(() => {});
    }, [])

    function formatVariables(varObject) {
        let variables = {};
        Object.keys(varObject).map(key => {
            variables[key] = { value: varObject[key] }
        });
        return variables
    }

    function startProcess(processVariables,processDefinitionId) {
        return new Promise((resolve, reject) => {
            
            let variables = formatVariables(processVariables);

            const packet = {
                processDefinitionId: processDefinitionId,
                variables: variables
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/process/start", packet, {
                headers: { 'api_key': localStorage.getItem('api_key') },
                params: { basicToken: localStorage.getItem('Authorization') }
            }).then((res) => {
                resolve(res.data.id)
            }).catch(() => {
                reject()
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
                set_waiting(false)
                setDraftWaiting(false)
            });
        })
    }
    
    function getTask(id) {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + "/rest/s1/fadak/process/task", {
                headers: { 'api_key': localStorage.getItem('api_key') },
                params: {
                    filterId: "7bbba147-5313-11eb-80ec-0050569142e7",
                    firstResult: 0,
                    maxResults: 15,
                    processInstanceId: id
                },
            }).then(res => {
                resolve(res.data._embedded.task[0].id)
            }).catch(err => {
                reject(err)
            });
        })
    }
    
    function submitTask(formData, taskId) {
        return new Promise((resolve, reject) => {
            let variables = formatVariables(formData);
            const packet = {
                taskId: taskId,
                variables: variables
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/process/form", packet, {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }

    const submit = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
        set_waiting(true)
        if(formValues?.jobRequistionId !== undefined && formValues?.jobRequistionId !== null){delete formValues.jobRequistionId}
        const processVariables = {
            ...formValues ,
            WorkForceContact : {partyRelationShipId : formValues?.manegerEmplePositionId , emplPositionId : formValues?.manegerEmplePositionId } ,
            jobAdvantages : jobAdvantages ,
            contentsName : contentsName ,
            processType: "HumanresWorkforce",
            closeJob : "notImportant" ,
            RequistionPersonnel : [] ,
            draft : false
        }
        if(draftMode){
            submitTask(processVariables, taskId).then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'))
                setDraftWaiting(false)
                setAction("TaskCompleted")
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'))
                setDraftWaiting(false)
            })
        }
        if(!draftMode){
            startProcess(processVariables,processDefinitionId).then(processId =>
                getTask(processId).then(taskId =>
                    submitTask(processVariables, taskId).then(() => {
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                        history.push('/dashboard')
                        set_waiting(false)
                    })
                )).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!')
                )}
            )
        }
    }
    console.log("draftMode" , draftMode);
    console.log("taskId", taskId);
    const draftHandler = () => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
        setDraftWaiting(true)
        if(formValues?.jobRequistionId !== undefined && formValues?.jobRequistionId !== null){delete formValues.jobRequistionId}
        const processVariables = {
            ...formValues ,
            WorkForceContact : {partyRelationShipId : formValues?.manegerEmplePositionId , emplPositionId : formValues?.manegerEmplePositionId } ,
            jobAdvantages : jobAdvantages ,
            contentsName : contentsName ,
            processType: "HumanresWorkforce",
            closeJob : "notImportant" ,
            RequistionPersonnel : [] ,
            draft : true
        } 
        if(draftMode){
            submitTask(processVariables, taskId).then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'))
                setAction("TaskCompleted")
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'))
                setDraftWaiting(false)
            })
        }
        if(!draftMode){
            startProcess(processVariables,processDefinitionId).then(processId =>
                getTask(processId).then(taskId =>
                    submitTask(processVariables, taskId).then(() => {
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                        history.push('/dashboard')
                        setDraftWaiting(false)
                    })
                )).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'))
                    setDraftWaiting(false)
                }
            )
        }
    }

    // initial configs 

    const datas = useSelector(({ fadak }) => fadak);

    const getPermissions = () => {
        return new Promise((resolve, reject) => {
            const fullList = ["baseInformation" , "jobAndPositionInformation" , "furtherInformation" , "teamAndPathOfRecruitment" , "jobDescription" , "attachment" ]
            fullList.map((item,index)=>{
                if(item == "baseInformation" && checkPermis("humanResourcesPlanning/creatingJobNeeds/baseInformation", datas)){
                    permissionList.push("baseInformation")
                }
                if(item == "jobAndPositionInformation" && checkPermis("humanResourcesPlanning/creatingJobNeeds/jobAndPositionInformation", datas)){
                    permissionList.push("jobAndPositionInformation")
                }
                if(item == "furtherInformation" && checkPermis("humanResourcesPlanning/creatingJobNeeds/furtherInformation", datas)){
                    permissionList.push("furtherInformation")
                }
                if(item == "teamAndPathOfRecruitment" && checkPermis("humanResourcesPlanning/creatingJobNeeds/teamAndPathOfRecruitment", datas)){
                    permissionList.push("teamAndPathOfRecruitment")
                }
                if(item == "jobDescription" && checkPermis("humanResourcesPlanning/creatingJobNeeds/jobDescription", datas) && !managementMode){
                    permissionList.push("jobDescription")
                }
                if(item == "attachment" && checkPermis("humanResourcesPlanning/creatingJobNeeds/attachment", datas)){
                    permissionList.push("attachment")
                }
                if(index == 5) {
                    setPermissionList(Object.assign([],permissionList))
                    resolve()
                }
            })
        })
    }

    const defineInitialStep = () => {
        return new Promise((resolve, reject) => {
            set_step(permissionList[0])
            resolve()
        })
    }

    useEffect(()=>{
        if(datas && initialSettings){
            getPermissions().then(()=>{
                defineInitialStep().then(()=>{
                    // setInitialStates().then(()=>{
                        setInitialSettings(false)
                    // })
                })
            })
        }
    },[datas])
    
    return (
        !initialSettings && <Card>
            <CardContent>
                {!managementMode ? 
                    <Card>
                        <CardContent>
                            {/* <CardHeader title="امکان انتخاب نیازمندی های شغلی قبلی برای ساخت نیازمندی شغلی جدید" /> */}
                            <FormPro
                                prepend={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                formValidation={formValidation}
                                setFormValidation={setFormValidation}
                            />
                        </CardContent>
                        <CardContent>
                            <CardHeader title="اطلاعات ایجاد کننده" />
                            <FormPro
                                prepend={creatingFormStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                formValidation={formValidation}
                                setFormValidation={setFormValidation}
                            />
                        </CardContent>
                    </Card>
                :""}
                { permissionList.length > 0 ?
                <div>
                    <Box mb={2}/>
                    <Card>
                        <CardContent>
                            {managementMode ? <CardHeader title="بررسی نیازمندی شغلی توسط مدیر متقاضی"/> : ""}
                            <HandleStep stepName={step} nextStep={nextStep} submitRef={submitRef} managementMode={managementMode}  jobAdvantages={jobAdvantages}
                            setJobAdvantages={setJobAdvantages} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName}
                            jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages} permissionList={permissionList} draftMode={draftMode}/>
                        </CardContent>
                    </Card>
                    <Box mb={2}/>
                    <ActionBox>
                        {step == permissionList[permissionList.length-1] ? <Button type="submit" role="primary" onClick={managementMode ? confirmManager : submit } 
                            disabled={!managementMode ? waiting : managemenWaiting}
                            endIcon={!managementMode ? (waiting?<CircularProgress size={20}/>:null) : (managemenWaiting?<CircularProgress size={20}/>:null)}
                        >{managementMode ? "تایید" : "تایید و ارسال"}</Button> : "" }
                        {step != permissionList[permissionList.length-1] ? <Button type="submit" role="primary" onClick={(step !=="furtherInformation") ? trigerHiddenSubmitBtn : nextStep}>گام بعدی </Button> : "" }
                        {step != permissionList[0] ? <Button type="reset" role="secondary" onClick={priviousStep}>گام قبلی</Button> : ""}
                        {!managementMode ? <Button type="reset" role="secondary" onClick={handleCancel}>لغو</Button> : "" }
                        {!managementMode ? <Button type="reset" role="secondary" onClick={draftHandler}
                            disabled={draftWaiting}
                            endIcon={draftWaiting?<CircularProgress size={20}/>:null}
                        >پیش نویس</Button> : ""}
                    </ActionBox>
                </div>
                :""}
            </CardContent>
        </Card>
    );
};

export default CreatingJobNeedsForm;

function HandleStep (props) {

    const {stepName, nextStep = () => { }, submitRef, managementMode , formValues , setFormValues , jobAdvantages , setJobAdvantages, contentsName, setContentsName, permissionList,
     draftMode} = props
 
    const steps = [{
        name        : "baseInformation",
        label       : "اطلاعات پایه",
        component   : <BaseInformation submitCallback={nextStep} submitRef={submitRef} managementMode={managementMode} formValues={formValues} setFormValues={setFormValues} draftMode={draftMode} />
    },{
        name        : "jobAndPositionInformation",
        label       : "اطلاعات شغل و پست",
        component   : <JobAndPositionInformation submitCallback={nextStep} submitRef={submitRef} managementMode={managementMode} formValues={formValues} setFormValues={setFormValues} draftMode={draftMode}/>
    },{
        name        : "furtherInformation",
        label       : "اطلاعات تکمیلی",
        component   : <FurtherInformation submitCallback={nextStep} managementMode={managementMode}  jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages}
                        formValues={formValues} setFormValues={setFormValues} draftMode={draftMode}/>
    },{
        name        : "teamAndPathOfRecruitment",
        label       : "تیم جذب",
        component   : <TeamAndPathOfRecruitment submitCallback={nextStep} submitRef={submitRef} managementMode={managementMode} formValues={formValues} setFormValues={setFormValues} draftMode={draftMode}/>
    },{
        name        : "jobDescription",
        label       : "شرح شغل",
        component   : <JobDescription submitCallback={nextStep} formValues={formValues} setFormValues={setFormValues} submitRef={submitRef} draftMode={draftMode}/>
    },{
        name        : "attachment",
        label       : "پیوست ها",
        component   : <Attachment managementMode={managementMode} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName} draftMode={draftMode}/>
    }]

    const permissionSteps = steps.filter((item) => permissionList.indexOf(item.name) >= 0)

    const activeStepIndex = permissionSteps.findIndex(i=>i.name===stepName)
    const activeStep = permissionSteps[activeStepIndex]

    return(
        <div>
            <Stepper alternativeLabel activeStep={activeStepIndex}>
                {permissionSteps.map((step,index) => (
                    <Step key={index}>
                        <StepLabel>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Divider variant="fullWidth"/>
            {activeStep?.component}
        </div>
    )
}