import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, Grid } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from 'app/main/components/ActionBox';
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from 'configs';
import { setAlertContent, ALERT_TYPES } from 'app/store/actions';
import ConfirmDialog, { useDialogReducer } from 'app/main/components/ConfirmDialog';
import TabPro from 'app/main/components/TabPro';
import TablePro from 'app/main/components/TablePro';
import EvaluationParticipants from './EvaluationParticipants';




const DefineEvaluationStep = (props) => {
    const { formVariables, submitCallback, formValuesDefineEvaluation, setFormValuesDefineEvaluation, participants, setParticipants, myElement1 } = props
    const [partyRelationshipIds, setPartyRelationshipIds] = React.useState(formVariables ? formVariables.partyRelationshipIds?.value : []);
    const [formValidationDefineEvaluation, setFormValidationDefineEvaluation] = useState({});
    const [EvaluationMethodEnumId, setEvaluationMethodEnumId] = useState([]);
    const myRef = useRef(null)
    const scrollToRef = () => myRef.current.scrollIntoView()
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const formStructure = [
        {
            name: "code",
            label: "کد رهگیری دوره ارزیابی",
            type: "text",
            readOnly: true,
            col: 4
        }, {
            name: "name",
            label: " عنوان دوره ارزیابی",
            type: "text",
            col: 4,
            required: true,

        }, {
            name: "evaluationMethodEnumId",
            label: "روش ارزیابی",
            type: "select",
            options: EvaluationMethodEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            required: true,
            col: 4
        }, {
            name: "startDate",
            label: "تاریخ شروع ارزیابی",
            type: "date",
            required: true,
            col: 4
        }, {
            name: "thruDate",
            label: "تاریخ پایان ارزیابی",
            type: "date",
            required: true,
            col: 4
        },
        , {
            name: "discription",
            label: "  توضیحات",
            type: "textarea",
            col: 4
        }
    ]

  

    const handle_submit = () => {}

    useEffect(() => {
        scrollToRef()
        getEnum()
    }, [])

    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=EvaluationMethod", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setEvaluationMethodEnumId(res.data.result)

        }).catch(err => {
        });


    }

    return (
        <>
            <Card ref={myRef}>
                <CardHeader title="تعریف دوره ارزیابی" />
                <CardContent>
                    <FormPro
                        formValues={formValuesDefineEvaluation}
                        setFormValues={setFormValuesDefineEvaluation}
                        append={formStructure}
                        formValidation={formValidationDefineEvaluation}
                        setFormValidation={setFormValidationDefineEvaluation}
                        actionBox={<ActionBox style={{ display: "none" }}>
                            <Button ref={myElement1} type="submit" role="primary">ثبت</Button>
                            {/* <Button type="reset" role="secondary">لغو</Button> */}
                        </ActionBox>}
                        submitCallback={handle_submit}
                    />
                </CardContent>
            </Card>
            <Box m={2} />
            <Card>
                <CardHeader title="انتخاب ارزیابی شوندگان" />
                <CardContent>
                    <EvaluationParticipants participantss={participants} setParticipants={setParticipants} partyRelationshipIds={partyRelationshipIds} setPartyRelationshipIds={setPartyRelationshipIds} />
                </CardContent>
            </Card>


        </>
    );
};

export default DefineEvaluationStep;