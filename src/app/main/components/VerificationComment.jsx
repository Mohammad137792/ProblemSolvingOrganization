import React from "react";
import TabPro from "./TabPro";
import DisplayField from "./DisplayField";
import {useSelector} from "react-redux";
import Grid from "@material-ui/core/Grid";
import FormInput from "./formControls/FormInput";
import Box from "@material-ui/core/Box";
import {Typography} from "@material-ui/core";
import {SERVER_URL} from "../../../configs";

export default function VerificationComment({steps=[],formValues,setFormValues}) {
    let moment = require('moment-jalaali')
    const username = useSelector(({ auth }) => auth.user.data.username);
    const currentStepIndex = steps.findIndex(i => i.username===username)

    const tabs = steps.map((step) => ({
        label: <DisplayField value={step.emplPositionId} options="EmplPosition" optionIdField="emplPositionId"/>,
        panel: step.username === username ? (
            <Box p={2}>
                <Grid container spacing={2}>
                    <FormInput col={12} name="comment" label="توضیحات" type="textarea" valueObject={formValues} valueHandler={setFormValues}/>
                </Grid>
                <Box m={2}/>
                <Grid container direction="row-reverse">
                    <Grid item xs={4} style={{textAlign:"center"}}>
                        <div>{`${step.firstName || ''} ${step.lastName || ''} ${step.suffix || ''}`}</div>
                        <DisplayField value={step.emplPositionId} variant="raw" options="EmplPosition" optionIdField="emplPositionId"/>
                        <div>{moment().format('jYYYY/jM/jD')}</div>
                    </Grid>
                </Grid>
            </Box>
        ): step.verificationDate ? (
            <Box p={2}>
                {step.comment &&
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DisplayField value={step.comment} variant="raw"/>
                    </Grid>
                </Grid>
                }
                <Grid container direction="row-reverse">
                    <Grid item xs={4} style={{textAlign:"center"}}>
                        <img src={(SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + step.signatureLocation)} alt="Signature" style={{maxHeight:'3cm',maxWidth:'4cm'}}/>
                        <div>{`${step.firstName || ''} ${step.lastName || ''} ${step.suffix || ''}`}</div>
                        <DisplayField value={step.emplPositionId} variant="raw" options="EmplPosition" optionIdField="emplPositionId"/>
                        <div>{step.verificationDate ? moment(step.verificationDate).format('jYYYY/jM/jD') : "-"}</div>
                    </Grid>
                </Grid>
            </Box>
        ):(
            <Box p={2}>
                <Typography>
                    هنوز به کارتابل&nbsp;
                    {`${step.firstName || ''} ${step.lastName || ''} ${step.suffix || ''}`}
                    ،&nbsp;
                    {<DisplayField value={step.emplPositionId} variant="raw" options="EmplPosition" optionIdField="emplPositionId"/>}
                    ، ارسال نشده است.
                    <br />
                    {step.comment}
                </Typography>
            </Box>
        )
    }))

    return (
        <TabPro
            tabs={tabs}
            orientation="vertical"
            initialValue={currentStepIndex}
        />
    )
}
