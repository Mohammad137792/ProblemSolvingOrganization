import React, {useEffect, useState} from "react";
import {Button, CardContent, CardHeader} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import Box from "@material-ui/core/Box";
import ActionBox from "../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import TabPro from "../../../../components/TabPro";
import IRPSendIntegrated from "./tabs/IRPSendIntegrated";
import IRPSendDetails from "./tabs/IRPSendDetails";
import IRPSendVerification from "./tabs/IRPSendVerification";

export default function IRPSend({values, onSubmit, goBack, data}) {
    const [waiting, set_waiting] = useState(false)

    const formStructure = [
        {
            name    : "trackingCode",
            label   : "کد رهگیری",
            type    : "display",
        },{
            name    : "createDate",
            label   : "تاریخ درخواست",
            type    : "display",
            options : "Date",
        },{
            name    : "producerFullName",
            label   : "تهیه کننده",
            type    : "display",
        },{
            name    : "producerEmplPositionId",
            label   : "پست سازمانی تهیه کننده",
            type    : "display",
            options : "EmplPosition",
            optionIdField: "emplPositionId",
        },{
            name    : "timePeriodTypeId",
            label   : "نوع دوره زمانی",
            type    : "display",
            options : data.timePeriodTypes,
            optionIdField   : "timePeriodTypeId",
        },{
            name    : "timePeriodId",
            label   : "دوره زمانی",
            type    : "display",
            options : data.timePeriods,
            optionIdField   : "timePeriodId",
            optionLabelField: "periodName",
        },{
            name    : "periodFromDate",
            label   : "از تاریخ",
            type    : "display",
            options : "Date",
        },{
            name    : "periodThruDate",
            label   : "تا تاریخ",
            type    : "display",
            options : "Date",
        }
    ]

    const handle_submit = () => {
        set_waiting(true)
        onSubmit().finally(()=>{
            set_waiting(null)
        })
    }

    return (
        <React.Fragment>
            <CardHeader title="ارسال کارکرد تجمیع شده"/>
            <CardContent>
                <FormPro
                    formValues={values.formValues||{}}
                    prepend={formStructure}
                />
                <Box m={2}/>
                <Card variant="outlined">
                    <TabPro
                        tabs={[
                            {
                                label: "کارکرد تجمیعی",
                                panel: <IRPSendIntegrated personnel={values.personnel}/>
                            },{
                                label: "جزئیات کارکرد",
                                panel: <IRPSendDetails list={values.details}/>
                            },{
                                label: "مراحل تایید",
                                panel: <IRPSendVerification list={values.verification}/>
                            }
                        ]}
                    />
                </Card>
                <Box mt={2}>
                    <ActionBox>
                        <Button role="primary" disabled={waiting} onClick={handle_submit} endIcon={waiting?<CircularProgress size={20}/>:null}>
                            تایید
                        </Button>
                        <Button role="secondary" disabled={waiting} onClick={goBack} >
                            بازگشت
                        </Button>
                    </ActionBox>
                </Box>
            </CardContent>
        </React.Fragment>
    )
}
