import React from 'react';
import {setFormDataHelper} from "../../../../helpers/setFormDataHelper";
import ContractInformationForm from "./ContractInformationForm";

const ContractInformation = props => {
    const [formData, setFormData] = React.useState({});
    const addFormData = setFormDataHelper(setFormData);

    return (
        <ContractInformationForm formValues={formData} addFormValue={addFormData}/>
    );
}

export default ContractInformation;