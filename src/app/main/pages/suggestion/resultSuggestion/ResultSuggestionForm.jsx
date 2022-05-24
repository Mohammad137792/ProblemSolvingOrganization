import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import TabPro from "../../../components/TabPro";
import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import SuggestionInfoForm from "./tabs/SuggestionInfoForm"
import ResultReviews from "./tabs/ResultReviews"
import Protest from "./tabs/Protest"



const ResultSuggestionForm = (props) => {
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = React.useState({});


    const dispatch = useDispatch()

    const tabs = [
        {
            label: "اطلاعات   پیشنهاد",
            panel: <SuggestionInfoForm />
        },
        {
            label: "   نتایج بررسی های صورت گرفته بر پیشنهاد",
            panel: <ResultReviews />
        },
        {
            label: "اعتراض به نتیجه بررسی پیشنهاد",
            panel: <Protest />
        },

    ]



    const formStructure = [{
        label: "کد پیشنهاد",
        name: "category",
        type: "text",
        col: 4
    }, {
        label: "  تاریخ ایجاد ",
        name: "name",
        type: "text",
        col: 4
    }, {
        label: "  وضعیت پیشنهاد ",
        name: "status",
        type: "text",
        col: 4

    }
    ]








    return (
        <Box>
            <Card >
                <Card >
                    <CardContent>
                        <FormPro
                            append={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            setFormValidation={setFormValidation}
                            formValidation={formValidation}
                        />
                    </CardContent>

                </Card>
                <TabPro tabs={tabs} />






            </Card>
        </Box>
    )
}


export default ResultSuggestionForm;











