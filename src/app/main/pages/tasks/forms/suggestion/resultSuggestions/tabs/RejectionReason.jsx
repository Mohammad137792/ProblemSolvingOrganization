import React, { useState, useEffect } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent } from "@material-ui/core";
import { SERVER_URL } from 'configs';
import FormPro from 'app/main/components/formControls/FormPro';
import { useDispatch } from 'react-redux';
import ActionBox from 'app/main/components/ActionBox';



const RejectionReason = (props) => {
    const { fomVarables, endTask } = props
    const [formValues, setFormValues] = useState([])
    const [rejectionReason, setRejectionReason] = useState([]);



    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const dispatch = useDispatch()

    const rejectionResonStructure = [
        , {
            label: "  دلایل رد ",
            name: "rejectionReasonEnumID",
            type: "multiselect",
            col: 6,
            options: rejectionReason,
            optionLabelField: "description",
            optionIdField: "enumId",
            // required: "true",
            disabled: true

        },

        formValues?.rejectionReasonEnumID?.includes("other") ? {
            label: "سایر دلایل",
            name: "other",
            type: "textarea",
            col: 6,
            disabled: true

        } : {
            name: "empty",
            label: "",
            type: "text",
            disabled: true,
            style: { visibility: "hidden" }

        },
        , {
            label: "  دلایل رد ",
            name: "rejectionReasonEnumID",
            type: "component",
            component: (<Card style={{ padding: 10 }}>
                 <h3>
                    با تشکر از شما بابت ارائه این پیشنهاد، با توجه به بررسی های صورت گرفته متاسفانه با پیشنهاد شما موافقت نشد. در انتظار دریافت پیشنهادات دیگری از شما هستیم
                    .با تشکر
                </h3> 
            </Card>),

            col: 12,
            options: rejectionReason,
            optionLabelField: "description",
            optionIdField: "enumId",
            // required: "true",
            disabled: true

        },
    ]



    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=RejectionReason", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setRejectionReason(res.data.result)

        }).catch(err => {
        });


    }

    useEffect(() => {
        setFormValues(prevState => ({
            ...prevState,
            rejectionReasonEnumID: JSON.stringify(fomVarables.RejectionReasons.value.rejectionReasonEnumID?.toString()),
            other: fomVarables.RejectionReasons.value.other ? fomVarables.RejectionReasons.value.other : ""
        }))
        getEnum();

    }, []);



    return (
        <Card>
            <CardContent>
                <FormPro
                    prepend={rejectionResonStructure}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    submitCallback={endTask}
                    actionBox={
                        <ActionBox>
                            <Button type="submit" role="primary">تایید</Button>
                        </ActionBox>}
                />
            </CardContent>

        </Card>
    )

}













export default RejectionReason;
