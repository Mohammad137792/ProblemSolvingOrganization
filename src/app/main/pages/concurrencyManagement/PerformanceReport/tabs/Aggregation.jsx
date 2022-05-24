import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, Tab, Tabs } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple, FusePageCarded } from '@fuse';
import TabPro from "app/main/components/TabPro";
import { makeStyles } from "@material-ui/core/styles";

export default function Aggregation() {
    const handleSubmit = () => { }
    const handleReset = () => { }
    const [tableContent, setTableContent] = useState([])
    const handleEdit = () => { }
    const handlerRemove = () => { }
    const [formValues, setFormValues] = useState()
    const formStructure =
        [
            {
                name: "a",
                label: "نام و نام خانوادگی",
                type: "text",
            },
            {
                name: "a",
                label: "  شماره پرسنلی",
                type: "text",
               
            },
       
            {
                name: "a",
                label: " از تاریخ ",
                type: "date",
               
            },
            {
                name: "a",
                label: "  تا تاریخ",
                type: "date",
                options: [],
               
            },
            {
                name: "a",
                label: " انتخاب شیفت ",
                type: "select",
                options: [],
               
            },

        ]


    const tableCols = [
        {
            name: "a",
            label: "  عامل های کاری ",
            type: "text",
            col: 4
        },
        {
            name: "a",
            label: "  تاخیر ",
            type: "text",
            col: 4
        },
        {
            name: "a",
            label: " تعجیل  ",
            type: "text",
            col: 4
        },
        {
            name: "a",
            label: "   کسری",
            type: "text",
            col: 4
        },
        {
            name: "a",
            label: "  جمع کل ",
            type: "text",
            col: 4
        },
       

    ]



    return (
        <>
            <Box p={2}>
                {/* <Card> */}
                {/* < */}
                <FormPro
                    prepend={formStructure}
                    formValues={formValues}
                    setFormValues={setFormValues}

                />
                  <TablePro
                    exportCsv="خروجی اکسل"
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    edit="callback"
                    editCallback={handleEdit}
                    delete="inline"
                    removeCallback={handlerRemove}

                />
                {/* </Card> */}
            </Box>

        </>
    )
}