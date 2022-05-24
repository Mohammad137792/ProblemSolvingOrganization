import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, Typography, IconButton, Tooltip } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import TransferList from 'app/main/components/TransferList'
import { CloudUpload, Visibility } from '@material-ui/icons';
import DeleteIcon from "@material-ui/icons/Delete";





export default function FunctionalIntegrationForm() {
    const [formValues, setFormValues] = useState()
    const formStructure =
        [

            {
                name: "a",
                label: " درخواست دهنده ",
                type: "text",
            },
            {
                name: "a",
                label: " سمت ",
                type: "text",

            },

            {
                name: "a",
                label: " دوره زمانی",
                type: "select",

            },




            {
                name: "a",
                label: "  از تاریخ",
                type: "date",

            },

            {
                name: "a",
                label: " تا تاریخ ",
                type: "date",

            },
            {
                name: "a",
                label: " تاریخ درخواست   ",
                type: "date",

            },
        ]
    const [tableContent, setTableContent] = useState([])
    const tableCols = [
        {
            name: "a",
            label: " سمت ",
            type: "text",
        },
        {
            name: "b",
            label: " نام و نام خانوادگی ",
            type: "text",
        },
    ]


    return (
        <FusePageSimple
            header={<Box>
                <CardHeader title={' کارکرد مدیر'} />
            کد رهگیری
        </Box>}
            content={
                <Box p={2}>
                    <Card>
                        <CardContent>
                            <FormPro
                                prepend={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}

                            />
                            <Box m={2} />

                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <TablePro
                                exportCsv="خروجی اکسل"
                                // title=" کارکرد پرسنل  "
                                columns={tableCols}
                                rows={tableContent}
                                setRows={setTableContent}


                            />
                        </CardContent>
                    </Card>

                </Box>
            }
        />
    )
}



