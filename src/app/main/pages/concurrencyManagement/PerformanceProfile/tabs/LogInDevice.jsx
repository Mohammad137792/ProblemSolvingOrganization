
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




export default function LoginDevice() {
    const [formValues, setFormValues] = useState()
    const formStructure =
        [
            {
                name: "a",
                label: " انتخاب دستگاه",
                type: "select",
                options: [],
                required: true,
                col: 4
            },
            {
                name: "a",
                label: " تاریح شروع ",
                type: "date",
                col: 4
            },
            {
                name: "a",
                label: "  تاریخ پایان",
                type: "date",
                col: 4
            },
            {
                name: "a",
                label: " شماره کارت  ",
                type: "text",
                col: 4

            },
            {
                name: "a",
                label: "  نوع کارت ",
                type: "select",
                options: [],
                col: 4

            },


        ]
    const handleSubmit = () => { }
    const handleReset = () => { }


    /* ####################################################        table    ########################################################## */


    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)
    const tableCols = [
        {
            name: "a",
            label: " دستگاه ",
            type: "text",
        },
        {
            name: "b",
            label: " کد ",
            type: "text",
        },
        {
            name: "d",
            label: "  فعال",
            type: "indicator",
        },
    ]
    const handleEdit = () => { }
    const handlerRemove = () => { }









    return (
        <Box p={2}>

            <Card>
                <CardHeader title={"تخصیص جدید"} />
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
            <Box m={2} />
            <Card>
                <CardContent>
                    <TablePro
                        exportCsv="خروجی اکسل"
                        title=" لیست موارد تخصیص یافته"
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
        </Box>
    )
}