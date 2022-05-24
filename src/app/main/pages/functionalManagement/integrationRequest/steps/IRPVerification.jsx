import React, {useState} from "react";
import {Box, Button, CardContent, CardHeader} from "@material-ui/core";
import IRPGeneralSettings from "./components/IRPGeneralSettings";
import Divider from "@material-ui/core/Divider";
import ActionBox from "../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import IRPSendIntegrated from "./tabs/IRPSendIntegrated";
import VerificationComment from "../../../../components/VerificationComment";
import Card from "@material-ui/core/Card";

export default function IRPVerification({values={}, onSubmit}) {
    const [waiting, set_waiting] = useState(null)
    const [formValues, set_formValues] = useState({});

    const handle_submit = (action) => () => {
        set_waiting(action)
        const packet = {
            action,
            comment: formValues.action
        }
        onSubmit(packet).finally(()=>{
            set_waiting(null)
        })
    }

    return (
        <React.Fragment>
            <CardHeader title={`بررسی کارکرد ${" "}`}/>
            <CardContent>
                <IRPGeneralSettings formValues={values.formValues}/>
                <Box m={2}/>
                <Card variant="outlined">
                    <CardHeader title="کارکرد تجمیعی پرسنل"/>
                    <IRPSendIntegrated personnel={values.personnel}/>
                </Card>
                <Box m={2}/>
                <Card variant="outlined">
                    <VerificationComment steps={values.verificationList} formValues={formValues} setFormValues={set_formValues}/>
                </Card>
                <Box m={2}/>
                <ActionBox>
                    <Button role="primary" disabled={!!waiting} onClick={handle_submit("confirmed")} endIcon={waiting==="confirmed"?<CircularProgress size={20}/>:null}>
                        تایید
                    </Button>
                    <Button role="secondary" disabled={!!waiting} onClick={handle_submit("rejected")} endIcon={waiting==="rejected"?<CircularProgress size={20}/>:null} >
                        رد
                    </Button>
                </ActionBox>
            </CardContent>
        </React.Fragment>
    )
}
