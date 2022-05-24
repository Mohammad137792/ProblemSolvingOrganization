import FormPro from "../../../components/formControls/FormPro";
import {useState , useEffect , createRef} from 'react';
import React from 'react'
import CreatingJobNeedsForm from "../creatingJobNeeds/CreatingJobNeedsForm";


const SessionPageForm = (props) => {

    const {managementMode = false , formValues, setFormValues, contentsName, setContentsName, jobAdvantages, setJobAdvantages} = props
    
    return (
        <CreatingJobNeedsForm managementMode={true} formValues={formValues} setFormValues={setFormValues} contentsName={contentsName} setContentsName={setContentsName} 
        jobAdvantages={jobAdvantages} setJobAdvantages={setJobAdvantages}/>
    );
};

export default SessionPageForm;

