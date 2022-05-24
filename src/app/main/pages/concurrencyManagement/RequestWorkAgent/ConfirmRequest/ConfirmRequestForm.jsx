
import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, Tab, Tabs } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple, FusePageCarded } from '@fuse';
import TabPro from "app/main/components/TabPro";
import { makeStyles } from "@material-ui/core/styles";


export default function ConfirmRequestForm() {
    const [formValues, setFormValues] = useState([])
    const formStructure =
        [

            {
                name: "a",
                label: " درخواست دهنده ",
                type: "display",
            },
            {
                name: "a",
                label: " سمت ",
                type: "display",

            },

            {
                name: "a",
                label: " تاریخ درخواست   ",
                type: "display",

            },

            {
                name: "a",
                label: "  عامل کاری",
                type: "display",

            },

            {
                name: "a",
                label: "  از تاریخ",
                type: "display",

            },

            {
                name: "a",
                label: " تا تاریخ ",
                type: "display",

            },

            {
                name: "a",
                label: "  پروژه ها",
                type: "display",
            },
            {
                name: "a",
                label: "  توضیحات ",
                type: "display",
                col: 12
            },


        ]
    return (
        <FusePageSimple
            header={<Box>
                <CardHeader title={'  '} />
            </Box>}
            content={
                <Card>
                    <CardContent>
                        <FormPro
                            prepend={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}

                        />
                        <Button  variant="contained" color="secondary" style={{ marginTop: '1rem', marginRight: "1rem" }}>  تایید</Button>
                        <Button  variant="contained"  style={{ color:"black",background:"#FFF",marginTop: '1rem', marginRight: "1rem" }}>نمایش تقویم </Button>
                        <Button  variant="contained"  style={{ color:"#FFF",background:"red",marginTop: '1rem', marginRight: "1rem" }}> رد درخواست</Button>
                        <Button  variant="contained"  style={{ color:"#FFF",background:"green",marginTop: '1rem', marginRight: "1rem" }}> درخواست صلاحیت</Button>


                    </CardContent>
                </Card>
            }
        />
    )
}