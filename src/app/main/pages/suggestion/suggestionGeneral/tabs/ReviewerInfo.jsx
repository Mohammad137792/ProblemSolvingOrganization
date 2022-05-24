import axios from "axios";
import { AXIOS_TIMEOUT, SERVER_URL } from 'configs';

import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardHeader, CardContent, Tooltip, Collapse} from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import { ArrowDownwardTwoTone, Attachment, Image } from "@material-ui/icons"
import ActionBox from 'app/main/components/ActionBox';
import ToggleButton from "@material-ui/lab/ToggleButton";
import AddBoxIcon from '@material-ui/icons/AddBox';

import QuestionnaireResponder from 'app/main/pages/questionnaire/responder/QuestionnaireResponder';





const ReviewerInfo = (props) => {
    const {
        formsData
    } = props

    const [rejectionReason, setRejectionReason] = useState([]);
    const [reviewDecision, setReviewDecision] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const [formValuesScore, setFormValuesScore] = useState([]);
    const [otherReasonVisibility, SetOtherReasonVisibility] = useState(false)


    const formStructure = [{
        label: "   تاریخ بررسی",
        name: "actualReviewDate",
        type: "date",
        readOnly:true,
        col: 3
    }

    ]

    const formStructureScore = [
 
        {
            label: " نتیجه پیشنهاد",
            name: "finalReviewDecisionEnumId",
            type: "select",
            readOnly: true,
            options: reviewDecision,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 6
        },
        {
            label: " امتیاز",
            name: "score",
            type: "text",
            readOnly: true,
            col: 6,
            style: { visibility: formsData.answerId? "" : "hidden"}
            
        },
        formsData.rejectionReason !=="[]" ? {
            label: "  دلایل رد ",
            name: "rejectionReason",
            type: "multiselect",
            readOnly: true,
            col: 12,
            options: rejectionReason,
            optionLabelField: "description",
            optionIdField: "enumId",
        } : {
            name: "empty",
            label: "",
            type: "text",
            disabled: true,
            style: { visibility: "hidden" }
        },
        
        {
            label: "سایر دلایل",
            name: "other",
            readOnly: true,
            type: "textarea",
            col: 12,
            rows:5,
            style: { visibility: otherReasonVisibility? "" : "hidden"}
        },
      
        
    ]


    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=RejectionReason", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setRejectionReason(res.data.result)
        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionReviewDecision", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setReviewDecision(res.data.result)
        }).catch(err => {
        });

    }



    useEffect(() =>{
        SetOtherReasonVisibility(formValuesScore.rejectionReason?.includes("other")? true: false)
    },[formValuesScore.rejectionReason])

    useEffect(() => {
            // getOrgInfo();
            getEnum();
            setFormValues(formsData)
            setFormValuesScore(formsData)

        }, []);

    return (
        <Card>

            <Box style={{ margin: 10 }}>
                <FormPro
                    append={formStructure}
                    formValues={formValues}
                    setFormValues={setFormValues}

                />
            </Box>


            <Card >
                {formsData.answerId != undefined? <QuestionnaireResponder answerId={formsData.answerId} readOnly/>:<Card/>}
            </Card>

            <Box style={{ margin: 10 }}>
                <FormPro
                    append={[
                        {
                            type: "component",
                            component: <FormPro
                                            append={formStructureScore}
                                            formValues={formValuesScore}
                                            setFormValues={setFormValuesScore}
                        
                                        />,
                            col: 6
                        },
                        {
                            type: "component",
                            component: <Attachments Data={formsData}/>,
                            col: 6,
                        }
                    ]}
                
                />
            </Box>
        </Card>
    )
}


function Attachments(Data) {
    const [tableContent, setTableContent] = React.useState([]);
    const [loading, setLoading] = useState(true)


    const tableCols = [
        { name: "format", label: "فرمت فایل", style: { width: "20%", "text-align": "center" } },
        { name: "observeFile", label: "دانلود فایل", style: { width: "40%", "text-align": "center"} }
    ]

    useEffect(() => {

        let formVariables = Data.Data
        let tableData = []
            if (formVariables.SuggestionContent?.length > 0) {
                formVariables.SuggestionContent.map((item, index) => {
                    let data = {
                        observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.location}
                            target="_blank" >  <Image />  </Button>,
                        format: item.location.split(".")[1]
                        }

                    tableData.push(data)
                    setTimeout(() => {

                        
                    }, 50)
                })

                setTableContent(prevState => { return [...prevState, ...tableData] })

            }
            setLoading(false)
    }, []);

    return (
        <Card>
            <TablePro
                title="پیوست"
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                loading={loading}
                fixedLayout
            />
        </Card>

    )
}

export default ReviewerInfo