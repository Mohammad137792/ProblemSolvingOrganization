import React, {useState} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import {Button,Box} from "@material-ui/core";
import {FusePageSimple} from "../../../../../@fuse";
import SurveyDefinitionForm from "../../tasks/forms/Survey/SurveyCreation/SurveyCreation";
import axios from "../../../api/axiosRest";
import {useDispatch} from "react-redux";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {SERVER_URL} from "../../../../../configs";

export default function SurveyDefinition() {
    const [objectId, set_objectId] = React.useState(null); //questionnaireAppId
    const [questionnaires, set_questionnaires] = React.useState([]);
    const [processDefinitionId, setProcessDefinitionId] = React.useState('');
    const dispatch = useDispatch();
    const [state, setState] = React.useState('Default');

        
        
    function formatVariables(varObject) {
        let variables = {};
        Object.keys(varObject).map(key=>{
            variables[key] = {value: varObject[key]}
        });
        return variables
    }

    function startProcess(processDefinitionId,formData) {
        return new Promise((resolve, reject) => {
            let variables = formatVariables(formData);
            const packet = {
                processDefinitionId: processDefinitionId,
                variables:variables,
                basicToken: localStorage.getItem('Authorization')
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

    function submitVariables(formData,processInstanceId) {
        return new Promise((resolve, reject) => {
            let variables = formatVariables(formData);
            const packet = {
                variables: variables,
                processInstanceId:processInstanceId
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/process/variables", packet, {
                headers: {'api_key': localStorage.getItem('api_key')}
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            });
        })
    }


    const submitCallback = (formData,isSubmited) => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
        const moment = require('moment-jalaali')
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        let startingData = {...formData , 'procStartTime':moment(tomorrow).format("Y-MM-DD")}
        startProcess(processDefinitionId,startingData).then(processId =>{
            // if(!isSubmited){
                getTask(processId).then(taskId =>{
                    submitTask(formData,taskId).then(()=>{
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                        setState("StartAnother")
                    })
                })
            // }
            // else{
                
            //     submitVariables(formData,processId).then(()=>{
            //         dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
            //         setState("StartAnother")
            //     })
            // }
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
        })
    }

    React.useEffect(()=>{
        axios.get(SERVER_URL+"/rest/s1/fadak/process/list",{
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setProcessDefinitionId( res.data.outList.find(i=>i.key==="SurveyProcess").id )
        }).catch(() => {
        });
    },[])


    const newOrder = () => {
        setState('Default')
    }

    const handle_edit = (row) => {
        set_objectId(row.questionnaireAppId)
    }

    React.useEffect(()=>{
        axios.get("/s1/questionnaire/archive").then(res => {
            set_questionnaires(res.data.questionnaires)
        }).catch(() => {
            set_questionnaires([])
        });
    },[])

    return <FusePageSimple
        header={<CardHeader title={"نظرسنجی"}/>}
        content={
            <Box p={2}>
                {state==='Default' &&
                    <SurveyDefinitionForm  submitCallback={submitCallback}/>
                }
                {state==='StartAnother' &&
                <Box textAlign="center" py={5}>
                    <Button onClick={newOrder} color="secondary" variant="contained">ایجاد نظرسنجی جدید</Button>
                </Box>
                }
            </Box>
        }
    />
}
