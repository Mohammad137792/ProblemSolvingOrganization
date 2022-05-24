import React, { useState, useEffect, createRef } from 'react';
import Card from "@material-ui/core/Card";
import { useDispatch } from 'react-redux';
import FormPro from 'app/main/components/formControls/FormPro';



const VerifDescription = (props) => {
    const { formValuesDiscription,setFormValuesDiscription} = props;
   

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const dispatch = useDispatch()

    const formStructureDiscription = [
        {
            name: "discription",
            label: "  ",
            type: "textarea",
            col:12,
        }
    ]



    return (
        <Card>
            <FormPro
                prepend={formStructureDiscription}
                formValues={formValuesDiscription}
                setFormValues={setFormValuesDiscription}
             
            
            />
        </Card>
    )

}




export default VerifDescription;
