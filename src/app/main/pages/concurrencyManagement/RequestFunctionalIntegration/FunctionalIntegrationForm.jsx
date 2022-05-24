import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, Typography, IconButton, Tooltip } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import TransferList from 'app/main/components/TransferList'
import { CloudUpload, Visibility } from '@material-ui/icons';
import DeleteIcon from "@material-ui/icons/Delete";

import {useHistory} from 'react-router-dom'



export default function FunctionalIntegrationForm() {
    const [formValues, setFormValues] = useState()
    const formStructure =
        [

            {
                name: "a",
                label: " درخواست  ",
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

            , {
                type: "group",
                items: [{
                    name: "value",
                    label: "زمان پاسخ گویی",
                    type: "text",
                    group: "cost"
                }, {
                    name: "unit",
                    type: "select",
                    options: [{ enumId: "irs", description: "ساعت" }, { enumId: "prc", description: "روز" }],
                    // disableClearable: true,
                    group: "cost"
                }]
            }



        ]
        const historyPage = useHistory()
    return (
        <FusePageSimple
            header={<Box>
                <CardHeader title={' درخواست تجمیع کارکرد'} />
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
                            <TransferList
                                rightTitle="لیست پرسنل"
                                // rightContext={personnel}
                                // rightItemLabelPrimary={display_name}
                                // rightItemLabelSecondary={display_org_info}
                                leftTitle="پرسنل انتخاب شده"
                                // leftContext={audience}
                                // leftItemLabelPrimary={display_name}
                                // leftItemLabelSecondary={display_org_info}
                                // onMoveLeft={handle_add_participant}
                                // onMoveRight={handle_delete_participant}
                                rightFilterForm={
                                    <>
                                    </>
                                }
                            />
              
                            <Button onClick={()=>{historyPage.push('/staffPerformanceReviewForm')}} variant = "contained" color="secondary" style={{ marginTop:'1rem',marginRight : "1rem"}}>ثبت درخواست مدیر</Button>
                            <Button onClick={()=>{historyPage.push('/ReviewManagarForm')}} variant = "contained" color="secondary" style={{ marginTop:'1rem',marginRight : "1rem"}}> ثبت درخواست پرسنل</Button>
                            
                        </CardContent>
                        </Card>

                </Box>
            }
        />
    )
}



