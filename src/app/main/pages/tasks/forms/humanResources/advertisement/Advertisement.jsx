import React from 'react';
import JobDescription from 'app/main/pages/humanResourcesPlanning/jobBoards/jobDescription/JobDescription';
import { SERVER_URL } from './../../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import axios from 'axios';
import {useDispatch, useSelector} from "react-redux";
import useListState from "../../../../../reducers/listState";
import {useState , useEffect , createRef} from 'react';
import checkPermis from "app/main/components/CheckPermision";


const Advertisement = (props) => {

    const {formVariables,taskId,submitCallback,setAction} = props

    const dispatch = useDispatch();

    function formatVariables(varObject) {
        let variables = {};
        Object.keys(varObject).map(key => {
            variables[key] = { value: varObject[key] }
        });
        return variables
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
        // submitCallback({})
        submitTask({} , taskId ).then(()=>{
            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
            setAction("TaskCompleted")
        }).catch(()=>{
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
        })
    }

    return (
        formVariables && <div>
            <JobDescription jobInformation={formVariables?.customJobRequistion?.value} closeIcon={false} submit={submit}/>
        </div>
    );
};

export default Advertisement;