import React from 'react';
import {setFormDataHelper} from "../../../../helpers/setFormDataHelper";
import LeavingOrganizationForm from "./LeavingOrganizationForm";

const LeavingOrganization = props => {
    const [formData, setFormData] = React.useState({});
    const addFormData = setFormDataHelper(setFormData);

    return (
        <LeavingOrganizationForm formValues={formData} addFormValue={addFormData}/>
    );
}

export default LeavingOrganization;