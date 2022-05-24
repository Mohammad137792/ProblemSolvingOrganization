import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Grid, Divider, CardHeader, Button } from "@material-ui/core";
import FormInput from 'app/main/components/formControls/FormInput';



const EvaluationInfo = (props) => {
    const { profileValues, setPartyRelationshipId, setPartyId } = props
    
    const formStructure = [{
        name: "code",
        label: "کد رهگیری دوره ارزیابی",
    }, {
        name: "evaluationPeriodTitle",
        label: "عنوان دوره ارزیابی",
    }, {
        name: "evaluationMethodEnumIdDis",
        label: "روش ارزیابی",
    }, {
        name: "fromDate",
        label: "تاریخ شروع ارزیابی",
    }, {
        name: "thruDate",
        label: "تاریخ پایان ارزیابی",
    }, {
        name: "description",
        label: "توضیحات",
    }]
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

   


    return (
        <Box>
            <Box p={4} className="card-display">
                <Grid container spacing={2} style={{ width: "auto" }}>
                    {formStructure.map((input, index) => (
                        <Grid key={index} item xs={input.col || 6}>
                            <FormInput {...input} emptyContext={"─"} type="display" variant="display" grid={false} valueObject={profileValues} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Divider />
        </Box>
    )
}

export default EvaluationInfo;