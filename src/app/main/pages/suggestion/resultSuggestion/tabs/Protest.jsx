import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";


import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AXIOS_TIMEOUT, SERVER_URL } from 'configs';

const Protest = (props) => {
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = useState([]);
    const [showDetail, setShowDetail] = useState(false);


    const [tableContent, setTableContent] = useState([]);
    const dispatch = useDispatch()




    const formStructure = [{
        label: " شماره دفعات اعتراض",
        name: "category",
        type: "text",
        col: 6
    }, {
        label: "  تاریخ اعتراض ",
        name: "name",
        type: "text",
        col: 6
    }, {
        label: "   دلایل اعتراض به نتیجه ",
        name: "status",
        type: "textarea",
        col: 6,

    }
        , {
        name: "attach1",
        type: "component",
        component: <Attachments />,
        col: 6

    },
    ]


    const tableCols = [
        { name: "unit", label: " شماره دفعات اعتراض", type: "text", style: { minWidth: "130px" } },
        { name: "post", label: "   تاریخ اعترض", type: "text", style: { minWidth: "130px" } }
    ]

    const handle_submit = () => { }
    const handle_reset = () => { }
    return (
        <Box>
            <Card >
                <Card >
                    <Card style={{ backgroundColor: "#dddd",padding:1,margin:5 }}>
                        <Card>
                            <CardContent>
                                <FormPro
                                    append={formStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                    setFormValidation={setFormValidation}
                                    formValidation={formValidation}
                                    actionBox={<ActionBox>
                                        <Button type="submit" role="primary">ثبت اعتراض</Button>
                                        <Button type="reset" role="secondary">لغو</Button>
                                    </ActionBox>}
                                    submitCallback={handle_submit} resetCallback={handle_reset}
                                />
                            </CardContent>
                        </Card>
                    </Card>
                    <Card >
                        <CardContent>
                            <TablePro
                                title="    لیست اعتراضات گذشته"
                                columns={tableCols}
                                rows={tableContent}
                                setRows={setTableContent}
                                rowActions={[
                                    {
                                        title: "مشاهده نتیجه بررسی اعتراض",
                                        icon: VisibilityIcon,
                                        onClick: (row) => {
                                            setShowDetail(true)
                                        }
                                    },


                                ]}
                            />
                        </CardContent>

                    </Card>

                    {showDetail ? <Card>
                        <h1>hgugfyyttyyuuy</h1>
                    </Card> : ""}

                </Card>





            </Card>
        </Box>
    )
}


export default Protest;



function AttachmentsForm({ welfareId, loading, setLoading, ...restProps }) {
    const { formValues, setFormValues, successCallback, failedCallback, handleClose } = restProps;
    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    }
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [{
        label: "نوع پیوست",
        name: "attachmentsType",
        type: "select",
        options: "WelfareContent",
        col: 6
    }, {
        label: "پیوست",
        name: "contentLocation",
        type: "inputFile",
        col: 6
    }]

    const handleCreate = (formData) => {
        return new Promise((resolve, reject) => {
            const attachFile = new FormData();
            attachFile.append("file", formValues.contentLocation);
            axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", attachFile, config)
                .then(res => {
                    const postData = {
                        welfareId: welfareId,
                        contentLocation: res.data.name,
                        welfareContentTypeEnumId: formValues.attachmentsType
                    }
                    axios.post(SERVER_URL + "/rest/s1/welfare/entity/WelfareContent", postData, axiosKey)
                        .then(() => {
                            setLoading(true)
                            handleClose()
                            resolve(formData)
                        })
                })
        })
    }
    return (
        <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={() => {
                handleCreate(formValues).then((data) => {
                    successCallback(data)
                })
            }}
            resetCallback={() => {
                setFormValues({})
                handleClose()
            }}
            actionBox={<ActionBox>
                <Button type="submit" role="primary">افزودن</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
        />
    )
}


function Attachments({ formValues, setFormValues, welfareId }) {
    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = useState(true)
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableCols = [
        { name: "attachmentsType", label: "نوع پیوست", type: "select", options: "WelfareContent", style: { width: "40%" } },
        { name: "observeFile", label: "دانلود فایل", style: { width: "40%" } }
    ]
    React.useEffect(() => {
        if (loading) {
            axios.get(SERVER_URL + `/rest/s1/welfare/entity/WelfareContent?welfareId=${welfareId}`, axiosKey)
                .then((getData) => {
                    let tableData = []
                    if (getData.data.length > 0) {
                        getData.data.map((item, index) => {
                            console.log("item.contentLocation", item.contentLocation);
                            let data = {
                                observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.contentLocation}
                                    target="_blank" >  <Image />  </Button>,
                                welfareContentId: item.welfareContentId,
                                attachmentsType: item.welfareContentTypeEnumId
                            }
                            tableData.push(data)
                            if (index == getData.data.length - 1) {
                                setTimeout(() => {
                                    setTableContent(tableData)
                                    setLoading(false)
                                }, 50)
                            }
                        })
                    }
                    if (getData.data.length == 0) {
                        setTableContent(tableData)
                        setLoading(false)
                    }
                })
        }
    }, [loading])
    const handleRemove = (data) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/welfare/entity/WelfareContent?welfareContentId=" + data.welfareContentId, axiosKey)
                .then(() => {
                    setLoading(true)
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    }
    return (
        <TablePro
            title="پیوست"
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            add="external"
            addForm={<AttachmentsForm welfareId={welfareId} loading={loading} setLoading={setLoading} />}
            removeCallback={handleRemove}
            loading={loading}
            fixedLayout
        />
    )
}











