
import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
export default function BaseInfo() {
    const [formValues, setFormValues] = useState([])
    const formStructure = [
        {
            name: "a",
            label: " تقویم شیفتی ",
            type: "select",
            options: "TermType",
            required:true
        }
    ]


    return (
        <>
            <Box p={2}>
                {/* 
                <Card>
                    <CardContent> */}
                <FormPro
                    prepend={formStructure}
                    formValues={formValues}
                    setFormValues={setFormValues}
                />
                {/* </CardContent> */}
                {/* </Card> */}
            </Box >

        </>
    )
}