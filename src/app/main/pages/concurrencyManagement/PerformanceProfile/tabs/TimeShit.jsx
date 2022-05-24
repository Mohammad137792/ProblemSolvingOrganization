
import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';







export default function TimeShit() {
    const [formValues, setFormValues] = useState([])
    const formStructure = [
        {
            name: "d",
            label: "  نام و نام خانوادگی  ",
            type: "text",
        },
        {
            name: "d",
            label: "   شماره پرسنلی ",
            type: "text",
        },
        {
            name: "d",
            label: "   شماره کارت ",
            type: "text",
        },
        {
            name: "d",
            label: "   عامل کاری ",
            type: "select",
            options:[]
        },
        {
            name: "d",
            label: "  ازتاریخ  ",
            type: "date",
        },
        {
            name: "d",
            label: "  تا تاریخ  ",
            type: "date",
        },
    ]
    
    const handleSubmit = () => { }
    const handleReset = () => { }
    const [tableContent, setTableContent] = useState([])
    const handleEdit = () => { }
    const handlerRemove = () => { }
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
        label: "  ورود   ",
        type: "text",
    },
    {
        name: "d",
        label: "   خروچ  ",
        type: "text",
    },
    {
        name: "d",
        label: "  عامل کاری  ",
        type: "text",
    },
    {
        name: "d",
        label: "   مجموعه  ",
        type: "text",
    },
    {
        name: "d",
        label: "پروژه ها",
        type: "text",
    },
]
    return (
        <>
            <Card>
                <CardContent>
                    <FormPro
                        prepend={formStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        actionBox={<ActionBox>
                            <Button type="submit" role="primary">افزودن</Button>
                            <Button type="reset" role="secondary">لغو</Button>
                        </ActionBox>}
                        submitCallback={handleSubmit}
                        resetCallback={handleReset}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardContent>
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
                </CardContent>
            </Card>
        </>
    )
}