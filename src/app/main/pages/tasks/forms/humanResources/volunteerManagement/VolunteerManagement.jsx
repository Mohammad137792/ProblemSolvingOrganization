import React from 'react';
import VolunteerManagementForm from './../../../../humanResourcesPlanning/volunteerManagement/VolunteerManagementForm';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import axios from 'axios';



const VolunteerManagement = (props) => {

    const {formVariables,taskId,submitCallback,setAction} = props

    const [formValues, setFormValues] = React.useState({});

    const [display,setDisplay] = React.useState(false)

    const [closeWaiting, setCloseWaiting] =  React.useState(false) 

    const [goBackWaiting, setGoBackWaiting] =  React.useState(false) 
    
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
                    setDisplay(true)
                }
            });
        }
    },[formVariables])

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

    const submit = (closeJob) => {
        if(closeJob){
            setCloseWaiting(true)
            axios.get(`${SERVER_URL}/rest/s1/humanres/closeJobRequistion?jobRequistionId=${formVariables?.jobRequistionId?.value}` , axiosKey).then((info)=>{
                // submitCallback({closeJob : "close"})
                submitTask({closeJob : "close"} , taskId ).then(()=>{
                    setCloseWaiting(false)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                    setAction("TaskCompleted")
                }).catch(()=>{
                    setCloseWaiting(false)
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
                })
            }).catch(() => {
                setCloseWaiting(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
            });
        }
        if(!closeJob){
            setGoBackWaiting(true)
            submitTask({closeJob : "management" , confirmRecruiter : false } , taskId ).then(()=>{
                setGoBackWaiting(false)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                setAction("TaskCompleted")
            }).catch(()=>{
                setGoBackWaiting(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
            })
            // submitCallback({closeJob : "management" , confirmRecruiter : false })
        }
    }

    return (
        display && <div>
            <VolunteerManagementForm submit={submit} formValues={formValues} setFormValues={setFormValues} closeWaiting={closeWaiting} goBackWaiting={goBackWaiting}/>
        </div>
    );
};

export default VolunteerManagement;