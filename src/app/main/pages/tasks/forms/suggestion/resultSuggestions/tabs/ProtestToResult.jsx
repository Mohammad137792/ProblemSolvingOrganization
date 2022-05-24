import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";


import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AXIOS_TIMEOUT, SERVER_URL } from 'configs';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import AddBoxIcon from '@material-ui/icons/AddBox';

const ProtestToResult = (props) => {
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = useState([]);
    const [reviewer, setReviewer] = useState([{ id: "1", description: "کمیته" }, { id: "2", description: "کارشناس" }, { id: "3", description: "سایر" }]);
    const dispatch = useDispatch()

    const [verificationTableContent, setVerificationTableContent] = useState([]);
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [expertFormValues, setExpertFormValues] = useState([]);
    const [OtherFormValues, setOtherFormValues] = useState([]);




    const formStructure = [
        {
        label: "   شماره دفعات اعتراض",
        name: "sequenceNumber",
        type: "text",
        col: 6
    },
    {
        label: "   تاریخ اعتراض",
        name: "ObjectionDate",
        type: "date",
        col: 6
    },
    {
        label: "   دلایل اعتراض به نتیجه",
        name: "ObjectionReason",
        type: "textarea",
        col: 6
    },
    , {
        type: "component",
        component: <Attachments />,
        col: 6
    },

    ]




    const verificationTableCols = [
        { name: "sequenceNumber", label: "    شماره دفعات اعتراض", type: "text", style: { minWidth: "130px" } },
        { name: "ObjectionDate", label: "     تاریخ ثبت اعتراض ", type: "text", style: { minWidth: "130px" } },
    ]








    return (
        <Box>

            <Card >
                <Card style={{ backgroundColor: "#dddd", padding: 1, margin: 5 }}>
                    <Card>
                        <CardContent>
                            <FormPro
                                append={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                setFormValidation={setFormValidation}
                                formValidation={formValidation}
                                actionBox={ <ActionBox>
                                    <Button type="submit" role="primary">  ثبت اعتراض</Button>
                                    <Button type="reset" role="secondary">لغو</Button>
                                </ActionBox>
                                }
                            />
                        </CardContent>
                    
                        <CardContent>
                            <TablePro
                                fixedLayout={false}
                                title="لیست  اعتراضات گذشته "
                                columns={verificationTableCols}
                                rows={verificationTableContent}
                                setRows={setVerificationTableContent}
                                // loading={verificationLoading}
                                edit={"callback"}
                            // removeCallback={handleRemove}

                            // addCallback={handleAdd}
                            // edit="inline"
                            // editCallback={handleEdit}
                            // removeCallback={handleRemoveResidence}
                            // loading={loading}
                            />
                        </CardContent>

                    </Card>
                </Card>
                <Card >
                </Card>
            </Card>
        </Box>
    )
}

function Attachments() {
    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = useState(true)
    const [formValues, setFormValues] = useState([])
    const [expanded, setExpanded] = useState(false);


    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const tableCols = [

        { name: "observeFile", label: "دانلود فایل", style: { width: "40%" } }
    ]

    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    }


    const formStructure = [

        {
            label: "پیوست",
            name: "contentLocation",
            type: "inputFile",
            col: 6
        }]




    const handleCreate = (formData) => {
        return new Promise((resolve, reject) => {
            const attachFile = new FormData();
            attachFile.append("file", formValues?.contentLocation);


            axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", attachFile, config)
                .then(res => {
                    let contentLocation = []
                    contentLocation.push(res.data)




                    let tableData = []
                    if (contentLocation.length > 0) {
                        contentLocation.map((item, index) => {
                            let data = {
                                observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.name}
                                    target="_blank" >  <Image />  </Button>,
                            }

                            tableData.push(data)
                            setTimeout(() => {
                                setTableContent(prevState => { return [...prevState, ...tableData] })

                                setLoading(false)
                            }, 50)
                        })
                    }
                    if (contentLocation.length == 0) {
                        setTableContent(tableData)
                        setLoading(false)
                    }

                })
        })
    }


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
        <Card>

            <CardContent>
                <CardHeader style={{ justifyContent: "center", textAlign: "center", color: "gray", marginBottom: -60, }}
                    action={
                        <Tooltip title="    جستجوی اهداف    ">
                            <ToggleButton
                                value="check"
                                selected={expanded}
                                onChange={() => setExpanded(prevState => !prevState)}
                            >
                                <AddBoxIcon style={{ color: 'gray' }} />
                            </ToggleButton>
                        </Tooltip>
                    } />
                {expanded ?
                    <CardContent >
                        <Collapse in={expanded}>
                            <CardContent style={{ marginTop: 25 }} >

                                <FormPro
                                    prepend={formStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                    submitCallback={() => {
                                        handleCreate(formValues).then((data) => {
                                            // successCallback(data)
                                        })
                                    }}
                                    resetCallback={() => {
                                        setFormValues({})
                                        // handleClose()
                                    }}
                                    actionBox={<ActionBox>
                                        <Button type="submit" role="primary">افزودن</Button>
                                        <Button type="reset" role="secondary">لغو</Button>
                                    </ActionBox>}
                                />
                            </CardContent>


                        </Collapse>
                    </CardContent>
                    : ""}
            </CardContent>

            <TablePro
                title="پیوست"
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                removeCallback={handleRemove}
                // loading={loading}
                fixedLayout
            />
        </Card>

    )
}


export default ProtestToResult;












