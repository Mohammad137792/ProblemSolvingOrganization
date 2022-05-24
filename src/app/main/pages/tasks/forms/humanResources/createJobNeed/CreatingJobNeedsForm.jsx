
import React from 'react';
import CreatingJobNeeds from 'app/main/pages/humanResourcesPlanning/creatingJobNeeds/CreatingJobNeedsForm';
import {useDispatch, useSelector} from "react-redux";
import { SERVER_URL } from './../../../../../../../configs'
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import axios from 'axios';
import {useState , useEffect , createRef} from 'react';


const CreatingJobNeedsForm = (props) => {

    const {formVariables,taskId,setAction} = props

    const [formValues, setFormValues] = React.useState({});
    const [contentsName, setContentsName] = React.useState([]);
    const [jobAdvantages, setJobAdvantages] = React.useState([]);

    const [display,setDisplay] = React.useState(false)

    const [managemenWaiting, setManagemenWaiting] = useState(false) 

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

    return (
        display && <div>
            <CreatingJobNeeds  draftMode={true} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName} 
             jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages} managemenWaiting={managemenWaiting} setManagemenWaiting={setManagemenWaiting}
             taskId={taskId} setAction={setAction} />
        </div>
    );
};

export default CreatingJobNeedsForm;