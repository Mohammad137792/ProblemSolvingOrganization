import React from 'react';
import CreatingJobNeedsForm from "../../../../humanResourcesPlanning/creatingJobNeeds/CreatingJobNeedsForm"
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import axios from 'axios';
import {useState , useEffect , createRef} from 'react';


const CheckApplicantManager = (props) => {

    const {formVariables,taskId,submitCallback,setAction} = props

    const [formValues, setFormValues] = React.useState({});
    const [contentsName, setContentsName] = React.useState([]);
    const [jobAdvantages, setJobAdvantages] = React.useState([]);

    const [display,setDisplay] = React.useState(false)

    const [managemenWaiting, setManagemenWaiting] = useState(false) 

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
                    setContentsName(formVariables?.contentsName?.value)
                    setJobAdvantages(formVariables?.jobAdvantages?.value)
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

    const confirmManager = () => {
        setManagemenWaiting(true)
        const packet = {
            JobRequistion : {...formValues , creationDate : formValues?.startDate.slice(0,10) , trackingCodeId : formValues?.trackingCode , creatorPartyRelationshipId : formValues?.creatorPartyRelationshipId , creatorEmplPositionId : formValues?.creatorEmplPositionId} ,
            WorkForceContact : {partyRelationshipId : formValues?.manegerPartyRelationShipId , emplPositionId : formValues?.manegerEmplePositionId } ,
            JobAdvantages : jobAdvantages ,
            RequistionRecruiters : formValues?.personnel,
            RequistionContent : contentsName ,
            confirmRecruiter  : false
        }

        axios.post(SERVER_URL + "/rest/s1/humanres/jobRequistion", {data : packet} , axiosKey).then(res => { 
            submitTask({...packet , jobRequistionId : res.data?.jobRequistionId , ...formValues} , taskId ).then(()=>{
                setManagemenWaiting(false)
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'عملیات با موفقیت انجام شد.'));
                setAction("TaskCompleted")
            }).catch(()=>{
                setManagemenWaiting(false)
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
            })
        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در انجام عملیات!'));
            setManagemenWaiting(false)
        });

    }

    return (
        display &&
        <div>
            <CreatingJobNeedsForm managementMode={true} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName} 
             jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages} confirmManager={confirmManager} managemenWaiting={managemenWaiting} setManagemenWaiting={setManagemenWaiting}/>
        </div>
    );
};

export default CheckApplicantManager;