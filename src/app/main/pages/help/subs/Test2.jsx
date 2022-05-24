import React from "react";
import {FusePageSimple} from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {CardContent} from "@material-ui/core";
import EmplOrderChecking from "../../tasks/forms/EmplOrder/checking/EmplOrderChecking";

export default function Test2() {
    const formVariables = {};
    const submitCallback = (formData)=>{ console.log('task complete;',formData)}

    return <FusePageSimple
        header={
            <CardHeader title="تست یک"/>
        }
        content={
            <Box p={2}>
                <Card>
                    <CardContent>
                        <EmplOrderChecking submitCallback={submitCallback} formVariables={formVariables}/>
                    </CardContent>
                </Card>
            </Box>
        }
    />
}
