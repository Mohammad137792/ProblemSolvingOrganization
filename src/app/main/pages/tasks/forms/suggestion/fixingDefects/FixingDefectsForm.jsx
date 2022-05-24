import React, { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import { Button } from "@material-ui/core";
import { SERVER_URL } from 'configs';
import { Image } from "@material-ui/icons"
import { useDispatch } from 'react-redux';
import TabPro from 'app/main/components/TabPro';
import EditSuggestion from './tabs/EditSuggestion';
import VerifDescription from './tabs/VerifDescription'



const FixingDefectsForm = (props) => {

    const { formVariables, submitCallback = () =>{}  } = props;



    const [formValuesDiscription, setFormValuesDiscription] = useState([])


    const [allFormVariables, setFormVariables] = useState([]);

    const dispatch = useDispatch();

    const tabs = [

        {
            label: "       مشاهده پیشنهاد",
            panel: <EditSuggestion

                allFormVariables={allFormVariables}
                setFormVariables={setFormVariables}
                submitCallback={submitCallback}
   
            />
        },
        {
            label: " نتایج بررسی های صورت گرفته بر پیشنهاد",
            panel: <VerifDescription formValuesDiscription={formValuesDiscription}
                setFormValuesDiscription={setFormValuesDiscription} />
        },



    ]



    useEffect(() => {

        setFormValuesDiscription(formVariables?.fixingDefects?.value)
        setFormVariables(formVariables)

    }, []);


    return (
        <Card>
            <TabPro tabs={tabs} />
        </Card>
    )

}



export default FixingDefectsForm;
