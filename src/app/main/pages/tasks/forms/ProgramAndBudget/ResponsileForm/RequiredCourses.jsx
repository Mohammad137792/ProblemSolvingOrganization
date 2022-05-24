import React , {useState,useEffect,createRef} from 'react';
import { Box,CardContent, Card, CardHeader ,Button} from '@material-ui/core';
import { FusePageSimple } from '@fuse'
import RequiredCoursesTable from "../../../../educationModule/BasicInformation/requiredCourses/RequiredCourseTable"
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios'
import { SERVER_URL } from "../../../../../../../configs";
import { useSelector } from "react-redux";
import {useDispatch} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../../../store/actions/fadak";

const RequiredCourses = (props) => {
    const partyRelationshipId = useSelector(({ auth }) => auth?.user?.data?.partyRelationshipId);
    const partyIdUser = useSelector(({ auth }) => auth?.user?.data?.partyId);
    const [processDefinitionId, setProcessDefinitionId] = React.useState('');
    const dispatch = useDispatch();
    const [state, setState] = React.useState('Default');
    let history = useHistory();
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const curriculumId = props.formVariables.assessment.value.curriculumId

    function submitProcessForm(){
        axios.post(SERVER_URL + "/rest/s1/training/submitProcessForm" , axiosKey).then(course=>{
          
        })
    }

    
function formatVariables(varObject) {
    let variables = {};
    Object.keys(varObject).map(key=>{
        variables[key] = {value: varObject[key]}
    });
    return variables
}

function startProcess(processDefinitionId) {
    return new Promise((resolve, reject) => {
        const packet = {
            processDefinitionId: processDefinitionId
        }
        axios.post(SERVER_URL+"/rest/s1/fadak/process/start",packet,{
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {basicToken: localStorage.getItem('Authorization')}
        }).then((res) => {
            resolve(res.data.id)
        }).catch(() => {
            reject()
        });
    })
}

function getTask(id) {
    return new Promise((resolve, reject) => {
        axios.get(SERVER_URL +"/rest/s1/fadak/process/task", {
            headers: {'api_key': localStorage.getItem('api_key')},
            params: {
                filterId:"7bbba147-5313-11eb-80ec-0050569142e7",
                firstResult:0,
                maxResults:15,
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
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(() => {
            resolve()
        }).catch(() => {
            reject()
        });
    })
}


const submitCallback = (formData) => {
    
    getTask(props.formVariables.processInstanceId.value).then(taskId =>
    submitTask(formData,taskId).then(()=>{
        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
        setState("StartAnother")

    }))
}

const newOrder = () => {
    history.push('/editEducationalProgramAndBudget')
}

    
    function sendtoVerification(){
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال انجام عملیات...'));

        const packet = {
            result: "accept",
            partyRelationshipId: partyRelationshipId,
            partyIdUser: partyIdUser,
            api_key: localStorage.getItem('Authorization')
        }
        submitCallback(packet)
    }

    React.useEffect(()=>{
        axios.get(SERVER_URL+"/rest/s1/fadak/process/list",{
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setProcessDefinitionId( res.data.outList.find(i=>i.key==="ProgramAndBudget").id )
        }).catch(() => {
        });
    },[])

    return (
        <React.Fragment>
            <FusePageSimple
                header={<CardHeader title={"تدوین برنامه آموزشی"} />}
                content={<>
                    <Card variant="outlined">
                        <CardContent>
                            {state=='Default' && <RequiredCoursesTable curriculumId={curriculumId} sendtoVerification={sendtoVerification} formVariables={props.formVariables.assessment}/>}
                            {state==='StartAnother' &&
                                <Box textAlign="center" py={5}>
                                    <Button onClick={newOrder} color="secondary" variant="contained">صدور برنامه جدید</Button>
                                </Box>
                            }
                        </CardContent>
                    </Card>
                </>}

            />

        </React.Fragment>
    )
};

export default RequiredCourses;