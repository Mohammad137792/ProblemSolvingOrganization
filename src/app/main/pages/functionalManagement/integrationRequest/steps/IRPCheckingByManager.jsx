import React, {useState} from "react";
import {Box, Button, CardContent, CardHeader} from "@material-ui/core";
import IRPGeneralSettings from "./components/IRPGeneralSettings";
import Divider from "@material-ui/core/Divider";
import TabPro from "../../../../components/TabPro";
import IRPSendDetails from "./tabs/IRPSendDetails";
import ActionBox from "../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import IRPSendIntegrated from "./tabs/IRPSendIntegrated";

export default function IRPCheckingByManager({values={}, onSubmit}) {
    const [waiting, set_waiting] = useState(false)

    const handle_submit = (action) => () => {
        set_waiting(action)
        onSubmit(action).finally(()=>{
            set_waiting(null)
        })
    }

    return (
        <React.Fragment>
            <CardHeader title={`بررسی کارکرد ${" "}`}/>
            <CardContent>
                <IRPGeneralSettings formValues={values.formValues}/>
            </CardContent>
            <Divider variant="fullWidth"/>
            <TabPro tabs={[
                {
                    label: "کارکرد تجمیعی",
                    panel: <IRPSendIntegrated personnel={values.personnel}/>
                },{
                    label: "جزئیات کارکرد",
                    panel: <IRPSendDetails list={values.details}/>
                }
            ]}/>
            <Divider variant="fullWidth"/>
            <Box p={2}>
                <ActionBox>
                    <Button role="primary" disabled={waiting} onClick={handle_submit} endIcon={waiting?<CircularProgress size={20}/>:null}>
                        تکمیل
                    </Button>
                </ActionBox>
            </Box>
        </React.Fragment>
    )
}
