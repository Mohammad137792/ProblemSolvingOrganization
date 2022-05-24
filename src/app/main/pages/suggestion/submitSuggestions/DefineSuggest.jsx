import React, { useState } from 'react';
import { FusePageSimple } from "@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import DefineSuggestForm from '../../tasks/forms/suggestion/submitSuggestions/DefineSuggestForm'
import axios from "axios";
import { SERVER_URL } from 'configs';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { useDispatch } from 'react-redux';

const DefineSuggest=()=>{
  const [processDefinitionId, setProcessDefinitionId] = useState('');
  const [state, setState] = useState('Default');
  
  const axiosKey = {
    headers: {
        'api_key': localStorage.getItem('api_key')
    }
}
const dispatch = useDispatch()


React.useEffect(() => {
  axios.get(SERVER_URL + "/rest/s1/fadak/process/list", {
      headers: { 'api_key': localStorage.getItem('api_key') }
  }).then(res => {
      setProcessDefinitionId(res.data.outList.find(i => i.key === "Suggestion").id)

  }).catch(() => {
  });
}, [])

  function formatVariables(varObject) {
    let variables = {};
    Object.keys(varObject).map(key => {
        variables[key] = { value: varObject[key] }
    });
    return variables
}

  function startProcess(processDefinitionId, formData) {
    return new Promise((resolve, reject) => {
        let variables = formatVariables(formData);

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


const submitCallback = (formData) => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
    startProcess(processDefinitionId, formData).then(processId =>
        getTask(processId).then(taskId =>
            submitTask(formData, taskId).then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                setState("StartAnother")
            }))).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
            })
}
    return (
        <React.Fragment>
          <FusePageSimple 
            header={<CardHeader title={"تعریف پیشنهاد"} />}
            content=
            {
                <DefineSuggestForm  submitCallback={submitCallback}/>

            }
            />
        </React.Fragment>
      );
}
export default DefineSuggest;