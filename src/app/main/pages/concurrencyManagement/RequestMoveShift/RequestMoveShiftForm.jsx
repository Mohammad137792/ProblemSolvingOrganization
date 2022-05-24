import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, Typography, IconButton, Tooltip } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import CommentBox from 'app/main/components/CommentBox';
import useListState from 'app/main/reducers/listState';


export default function RequestMoveShiftForm() {
    const [formValues, setFormValues] = useState()
    const formStructure =
        [

            {
                name: "a",
                label: " درخواست دهنده  ",
                type: "text",
                col: 4
            },
            {
                name: "a",
                label: " سمت ",
                type: "text",
                col: 4

            },
            {
                name: "a",
                label: " تاریخ درخواست   ",
                type: "date",
                col: 4
            },
            {
                name: "a",
                label: " انتخاب شیفیت موردنظر ",
                type: "select",
                options: [],
                col: 4


            },
            {
                name: "a",
                label: " انتخاب متقاظی ",
                type: "select",
                options: [],
                col: 4


            },
            {
                name: "a",
                label: " انتخاب پرسنل ",
                type: "select",
                options: [],
                col: 4

            },
            {
                name: "decription",
                label: " شرح  درخواست",
                type: "textarea",
                col: 12

            },

        ]
        const comments = useListState("id",[])

    return (
        <FusePageSimple
            header={<CardHeader title={'درخواست جابجایی شیفت '} />}
            content={
                <Box p={2}>
                    <Card>
                        <CardContent>
                            <FormPro
                                prepend={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}

                            />
                            <CommentBox context={comments}/>

                        </CardContent>
                    </Card>

                </Box>
            }
        />
    )
}



