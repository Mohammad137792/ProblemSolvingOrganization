
import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
const Exfilter = ({ formStructure }) => {
    const [formValues, setFormValues] = useState([])

    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}

        />
    )
}


export default function MoveShift() {


    /* ####################################################        table    ########################################################## */


    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)
    const tableCols = [

        {
            name: "b",
            label: " کارمند پذیرنده  ",
            type: "text",
        },
        {
            name: "d",
            label: "  نتیجه بررسی  ",
            type: "text",
        },
        {
            name: "d",
            label: " مسئول اعلام نتیجه ",
            type: "text",
        },
        {
            name: "a",
            label: " جزییات ",
            type: "text",
        },
    ]
    const handleEdit = () => { }
    const handlerRemove = () => { }


    return (
        <Card>
            <CardContent>
                <TablePro
                    exportCsv="خروجی اکسل"
                    title="  لیست درخواست های جابجایی شیفت "
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loading}
                    edit="callback"
                    editCallback={handleEdit}
                    delete="inline"
                    removeCallback={handlerRemove}
                    filter="external"
                    filterForm={
                        <>
                            <Exfilter formStructure={tableCols} />
                        </>
                    }
                />
            </CardContent>
        </Card>
    )
}