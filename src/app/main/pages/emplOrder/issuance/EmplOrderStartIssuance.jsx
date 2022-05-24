import React from "react";
import axios from "axios";
import {SERVER_URL} from "../../../../../configs";
import {Box, Button, CardContent} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import {ALERT_TYPES, setAlertContent} from "../../../../store/actions/fadak";
import {useDispatch} from "react-redux";
import EmplOrderIssuance from "../../tasks/forms/EmplOrder/issuance/EmplOrderIssuance";

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

export default function EmplOrderStartIssuance(){
    const [state, setState] = React.useState('Default');
    const [processDefinitionId, setProcessDefinitionId] = React.useState('');
    const dispatch = useDispatch();

    const submitCallback = (formData) => {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
        startProcess(processDefinitionId).then(processId =>
        getTask(processId).then(taskId =>
        submitTask(formData,taskId).then(()=>{
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
            setState("StartAnother")
        }))).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
        })
    }

    const newOrder = () => {
        setState('Default')
    }

    React.useEffect(()=>{
        axios.get(SERVER_URL+"/rest/s1/fadak/process/list",{
            headers: {'api_key': localStorage.getItem('api_key')}
        }).then(res => {
            setProcessDefinitionId( res.data.outList.find(i=>i.key==="EmplOrder").id )
        }).catch(() => {
        });
    },[])

    return(
        <Card>
            <CardContent>
                {state==='Default' &&
                <EmplOrderIssuance submitCallback={submitCallback}/>
                }
                {state==='StartAnother' &&
                <Box textAlign="center" py={5}>
                    <Button onClick={newOrder} color="secondary" variant="contained">صدور حکم جدید</Button>
                </Box>
                }
            </CardContent>
        </Card>
    )
}
