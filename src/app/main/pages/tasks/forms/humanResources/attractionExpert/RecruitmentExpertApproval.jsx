import React from 'react';
import JobNeedManagementForm from './../../../../humanResourcesPlanning/jobNeedManagement/JobNeedManagementForm';
import { SERVER_URL } from './../../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import axios from 'axios';
import {useDispatch, useSelector} from "react-redux";
import useListState from "../../../../../reducers/listState";
import {useState , useEffect , createRef} from 'react';
import checkPermis from "app/main/components/CheckPermision";


const RecruitmentExpertApproval = (props) => {

    const {formVariables,taskId,submitCallback,setAction} = props

    const datas =  useSelector(({ fadak }) => fadak);

    const [formValues, setFormValues] = React.useState({});
    const [contentsName, setContentsName] = React.useState([]);
    const [jobAdvantages, setJobAdvantages] = React.useState([]);
    const personnel = useListState("partyId")
    const audience = useListState("partyId")
    
    const [display,setDisplay] = React.useState(false)

    const [waiting, set_waiting] = useState(false) 

    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    React.useEffect(()=>{
        if(Object.keys(formVariables).length > 0){
            let variables = {};
            Object.keys(formVariables).map((key,index) => {
                variables[key] = formVariables[key]?.value
                if(Object.keys(formVariables).length-1 == index){
                    setFormValues(Object.assign({},variables))
                }
            });
        }
    },[formVariables])

    React.useEffect(()=>{
        axios.get(`${SERVER_URL}/rest/s1/humanres/oneJobRequistion?jobRequistionId=${formVariables?.jobRequistionId?.value}`, axiosKey).then((info)=>{
            setContentsName(info.data?.jobRequistion?.requistionContent)
            setJobAdvantages(info.data?.jobRequistion?.jobAdvantages)
            setDisplay(true)
        });
    },[])

    React.useEffect(()=>{
        if(formValues?.RequistionPersonnel !== undefined && formValues?.RequistionPersonnel !== null){
            audience.set(formValues?.RequistionPersonnel)
        }
    },[formValues?.RequistionPersonnel])

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
        set_waiting(true)
        const packet = {
            RequistionPersonnel : audience.list ,
            confirmRecruiter : "true" ,
            responseTime : formValues?.responseTime , 
            closeJob : "notImportant" ,
        }

        axios.put(`${SERVER_URL}/rest/s1/humanres/changeJobStatus`, {jobRequistionId : formVariables?.jobRequistionId?.value , statusId : "Posting"} ,axiosKey).then((info)=>{
            submitTask({...packet , ...info.data} , taskId ).then(()=>{
                set_waiting(false)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                setAction("TaskCompleted")
            }).catch(()=>{
                set_waiting(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
            })
            // submitCallback({...packet , ...info.data})
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
            set_waiting(false)
        });
    }

    return (
        Object.keys(formValues).length !== 0 && checkPermis("humanResourcesPlanning/jobNeedManagement", datas) && display &&
        <div>
            <JobNeedManagementForm submit={submit} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName} 
             jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages} personnel={personnel} audience={audience} waiting={waiting} set_waiting={set_waiting}/>
        </div>
    );
};

export default RecruitmentExpertApproval;