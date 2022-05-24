import React, { useState } from 'react'
import { CardContent, CardHeader, Box, Button, Card, Typography, IconButton, Tooltip } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from 'app/main/components/ActionBox';
import { FusePageSimple } from '@fuse';
import TransferList from 'app/main/components/TransferList'
import { CloudUpload, Visibility } from '@material-ui/icons';
import DeleteIcon from "@material-ui/icons/Delete";
import CommentBox from 'app/main/components/CommentBox';
import useListState from 'app/main/reducers/listState';

import {useHistory} from 'react-router-dom'

export default function RequestWorkAgentForm() {
    const [formValues, setFormValues] = useState()
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
                type: "date",

            },

            {
                name: "a",
                label: "  عامل کاری",
                type: "select",
                options: [],
                required: true,
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
                label: "  پروژه ها",
                type: "select",
                options: [],
            },



        ]
        const historyPage = useHistory()

    const UpLoadFormStructure = [
        {
            name: "a",
            label: "  توضیحات ",
            type: "textarea",
        },
        {
            type: "component",
            col: { sm: 8, md: 6 },
            component: (
                <Box display="flex" className="outlined-input" >
                    <Box flexGrow={1} style={{ padding: "18px 14px" }}>
                        <Typography color="textSecondary">پیوست</Typography>
                    </Box>
                    <Box style={{ padding: "3px 14px" }}>
                        <input type="file" style={{ display: "none" }} />
                        <Tooltip title="آپلود فایل" >
                            <IconButton >
                                <CloudUpload />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="حذف فایل پیوست شده" >
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="دانلود فایل پیوست شده" >
                            <IconButton>
                                <Visibility />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            )
        }
    ]
    /* ##############################################         table          ################################################### */


    const tableCols = [
        {
            name: "a",
            label: "نوع نیازمندی",
            type: "text",

        },

        {
            name: "a",
            label: " عنوان نیازمندی ",
            type: "text",

        },
        {
            name: "a",
            label: "هزینه  ",
            type: "text",

        }

    ]
    const [tableContent, setTableContent] = useState([])
    const [loading, setLoading] = useState(true)
    const handleEdit = () => { }
    const handlerRemove = () => { }
    const comments = useListState("id",[])
    return (
        <FusePageSimple
            header={<Box>
                <CardHeader title={' درخواست عامل کاری  '} />
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
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <TablePro
                                title="لیست دستگاه ها"
                                columns={tableCols}
                                rows={tableContent}
                                setRows={setTableContent}
                                loading={loading}
                                edit="callback"
                                editCallback={handleEdit}
                                delete="inline"
                                removeCallback={handlerRemove}
                                exportCsv="خروجی اکسل"
                                filter="external"
                                filterForm={<></>}
                            />

                            <FormPro
                                prepend={UpLoadFormStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}

                            />
                            <CommentBox context={comments}/>
                        </CardContent>
                    </Card>
                    <Button onClick={()=>{historyPage.push('/confirmRequestForm')}} variant = "contained" color="secondary" style={{ marginTop:'1rem',marginRight : "1rem"}}> ثبت درخواست </Button>

                </Box>

            }
        />
    )
}
