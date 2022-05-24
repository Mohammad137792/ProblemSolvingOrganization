import React, { useState } from 'react'
import { Card, CardContent, Button, CardHeader, Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from 'app/main/components/ActionBox';
import { CardSignature } from '../ProvidingloansForm'
export default function DirectorOfAdministration() {
    const [formValues, setFormValues] = useState()

    const formStructure = [
        {
            name: "number3",
            label: "پست سازمانی",
            type: "text",
        },
        {
            name: "text3",
            label: "نام و نام خانوادگی",
            type: "text",

        },
        {
            name: "text3",
            label: "تاریخ تایید",
            type: "date",

        },
        {
            name: "text3",
            label: "توضیحات",
            type: "textarea",
            col: 12

        },
    ]

    return (
        <>



            <CardHeader title={'تعریف گروه خدمات رفاهی'} />
            <CardContent>
                <Grid container spacing={2}  >
                    <Grid item xs={12} sm={8}>
                        <FormPro
                            append={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}

                        />

                    </Grid>

                    <Grid item xs={12} sm={4}>
                        < CardSignature />
                    </Grid>
                </Grid>
                <Box p={2} />

            </CardContent>

        </>
    )
}
