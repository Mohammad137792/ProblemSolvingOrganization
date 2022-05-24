
import React from 'react';
import { FusePageSimple } from "@fuse";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";

import { Box, Card, Button, CardContent } from '@material-ui/core'


const DefinitionOfNotification = (props) => {
    const formStructure = [
        {
            name: "insuranceNumberEnumId",
            label: "عنوان فرم ابلاغ",
            type: "text",
            required: true

        }, {
            name: "insuranceNumberEnumId",
            label: " نوع ابلاغ ",
            type: "select",
            options: [],

            required: true,
        },
        {
            name: "insuranceNumberEnumId",
            label: "نوع نسخه فرم",
            type: "select",
            options: [],

            required: true,
        },

        {
            name: "insuranceNumberEnumId",
            label: " وضعیت  فرم ابلاغ",
            type: "select",
            options: [],

            required: true,
        },
        {
            name: "decription",
            label: "شرح ابلاغ  ",
            type: "textarea",
            col: 6
        },
        {
            name: "decription",
            label: "علت صدور ابلاغ  ",
            type: "select",
            options: [],
            required: true,
        }

    ]
    const tableCols = [
        {
            name: "insuranceNumberEnumId",
            label: "عنوان فرم ابلاغ",
            type: "select",
            options: [],
        }, {
            name: "insuranceNumberEnumId",
            label: " نوع ابلاغ ",
            type: "select",
            options: [],

        },
        {
            name: "insuranceNumberEnumId",
            label: "نوع نسخه فرم",
            type: "select",
            options: [],

        },

        {
            name: "insuranceNumberEnumId",
            label: " وضعیت  فرم ابلاغ",
            type: "select",
            options: [],

        },
    ]
    const [formValues, setFormValues] = React.useState({})
    const [tableContent, setTableContent] = React.useState([])

    return (
        <FusePageSimple
            header={
                <h1>
                    تعریف فرم ابلاغ
                </h1>
            }
            content={
                <>
                    <Box p={2}>
                        <Card variant="outlined">
                            <CardContent>
                                <FormPro formValues={formValues} setFormValues={setFormValues}
                                    append={formStructure}
                                    filter="external"
                                />

                            </CardContent>
                        <Box p={2} />
sss
                        </Card>
                        <Card variant="outlined">
                            <TablePro
                                title="لیست انواع درخواست "
                                columns={tableCols}
                                rows={tableContent}
                                filter="external"
                                filterForm={<FilterForm tableCols={tableCols} />}

                            />
                        </Card>

                    </Box>

                </>
            } />
    )
}


const FilterForm = (props) => {
    const [formValues, setFormValues] = React.useState({})

    const formStructure = [
        ...props.tableCols,
    ]
    return (
        <FormPro formValues={formValues} setFormValues={setFormValues}
            append={formStructure}
        />
    )
}
export default DefinitionOfNotification;