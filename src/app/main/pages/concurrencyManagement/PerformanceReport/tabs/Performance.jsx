import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, Tab, Tabs } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple, FusePageCarded } from '@fuse';
import TabPro from "app/main/components/TabPro";
import { makeStyles } from "@material-ui/core/styles";
export default function Performance() {
    const [tableContent, setTableContent] = useState([])

    const [formValues, setFormValues] = useState()
    const handleEdit = () => { }
    const handlerRemove = () => { }
    const formStructure =
        [
            {
                name: "a",
                label: "نام و نام خانوادگی",
                type: "text",
                col: 4
            },
            {
                name: "a",
                label: "  شماره پرسنلی",
                type: "text",
                col: 4
            },
            {
                name: "a",
                label: " شماره کارت ",
                type: "text",
                col: 4
            },
            {
                name: "a",
                label: " عامل کاری ",
                type: "select",
                options: [],
                required: true,
                col: 4
            },
            {
                name: "a",
                label: " از تاریخ ",
                type: "date",
                col: 4
            },
            {
                name: "a",
                label: "  تا تاریخ",
                type: "date",
                options: [],
                required: true,
                col: 4
            },
            {
                name: "a",
                label: " انتخاب شیفت ",
                type: "select",
                options: [],
                required: true,
                col: 4
            },

        ]
        const tableCols = [
            {
                name: "d",
                label: "  روز ",
                type: "text",
            },
            {
                name: "d",
                label: "   تاریخ  ",
                type: "text",
            },
            {
                name: "d",
                label: "   شروع  ",
                type: "text",
            },
            {
                name: "d",
                label: "   پایان  ",
                type: "text",
            },
            {
                name: "d",
                label: "   تاخیر  ",
                type: "text",
            },
            {
                name: "d",
                label: "   تعجیل  ",
                type: "text",
            },
            {
                name: "d",
                label: "   مجموع  ",
                type: "text",
            },
            {
                name: "d",
                label: "   کسر کار  ",
                type: "text",
            },
            {
                name: "d",
                label: "   اضافه کار  ",
                type: "text",
            },
            {
                name: "d",
                label: "  مقدار  ",
                type: "text",
            },
            {
                name: "d",
                label: "   شیفت  ",
                type: "text",
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