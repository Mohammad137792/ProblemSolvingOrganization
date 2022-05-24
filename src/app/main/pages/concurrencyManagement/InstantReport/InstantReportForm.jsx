import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';



export default function InstantReportForm() {

    const [formValues, setFormValues] = useState()
    const formStructure =
        [
            {
                name: "a",
                label: " فیلتر ",
                type: "select",
                options: [],
                required: true,
                col: 4
            },


        ]
    const handleSubmit = () => { }
    const handleReset = () => { }
    return (
        <FusePageSimple
            header={<CardHeader title={' گزارش لحظه ای کارکنان  '} />}
            content={
                <Box p={2}>
                    {/* <Card> */}
                        {/* < */}
                        <FormPro
                            prepend={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                     
                        />
                    {/* </Card> */}
                </Box>


            }
        />
    )
}



