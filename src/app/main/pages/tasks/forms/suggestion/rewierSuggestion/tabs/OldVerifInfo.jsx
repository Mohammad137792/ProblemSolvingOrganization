import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormLabel, FormControlLabel, Grid, Collapse } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AXIOS_TIMEOUT, SERVER_URL } from 'configs';
import QuestionnaireResponder from 'app/main/pages/questionnaire/responder/QuestionnaireResponder';


const OldVerifInfo = (props) => {
    const {
        oldeVerifInfo
    } = props

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const [formValues, setFormValues] = useState({});
    const [formValuesScore, setFormValuesScore] = useState([]);
    const dispatch = useDispatch()
    const [rejectionReason, setRejectionReason] = useState([]);
    const [tableContent, setTableContent] = useState([]);
    const [answerId, setAnswerId] = useState("");
    const [SuggestionReviewDecision, setSuggestionReviewDecision] = useState([]);
    const formStructure = [{
        label: "   تاریخ بررسی",
        name: "actualReviewDate",
        type: "date",
        readOnly: true,
        col: 4
    }

    ]
    const formStructureScore = [
        {
            label: " وضعیت پیشنهاد",
            name: "finalReviewDecisionEnumId",
            options: SuggestionReviewDecision,
            optionLabelField: "description",
            optionIdField: "enumId",
            type: "select",
            readOnly: true,
            col: 4
        },
        oldeVerifInfo.otherRiviewer==="Y"? {
            label: " احتیاج به بررسی کننده دیگر",
            name: "otherRiviewer",
            type: "indicator",
            readOnly: true,
            col: 4,
        }: {
            name: "empty",
            label: "",
            type: "text",
            readOnly: true,
            style: { visibility: "hidden" }
        },
        {
            label: " امتیاز",
            name: "score",
            type: "text",
            col: 4,
            disabled: true,
            style: { visibility: answerId ? "" : "hidden" }
        },
        {
            label: " توضیحات",
            name: "discription",
            type: "textarea",
            readOnly: true,
            col: 4
        },
        oldeVerifInfo?.rejectionReasonEnumID ? {
            label: "  دلایل رد ",
            name: "rejectionReasonEnumID",
            type: "multiselect",
            col: 4,
            options: rejectionReason,
            optionLabelField: "description",
            optionIdField: "enumId",
            readOnly: true,


        } : {
            name: "empty",
            label: "",
            type: "text",
            readOnly: true,
            style: { visibility: "hidden" }
        },

        oldeVerifInfo?.other ? {
            label: "سایر دلایل",
            name: "other",
            type: "textarea",
            readOnly: true,
            col: 4
        } : {
            name: "empty",
            label: "",
            type: "text",
            disabled: true,
            style: { visibility: "hidden" }
        },
        , {
            type: "component",
            component: <Attachments tableContent={tableContent} setTableContent={setTableContent} />,
            col: 12
        },
    ]







    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionReviewDecision", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionReviewDecision(res.data.result)

        }).catch(err => {
        });


        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=RejectionReason", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setRejectionReason(res.data.result)

        }).catch(err => {
        });



    }



    useEffect(() => {
        getEnum();

        setFormValuesScore(oldeVerifInfo)
        setFormValues(prevState => ({
            ...prevState,
            actualReviewDate: oldeVerifInfo.actualReviewDate

        }))
        setAnswerId(oldeVerifInfo.answerId)


        axios.get(SERVER_URL + "/rest/s1/Suggestion/getScore?answerId=" + oldeVerifInfo.answerId).then(res => {
            setFormValuesScore(prevState => ({
                ...prevState,
                score: res.data.score
            }))
        }).catch(() => {
        })


        let tableData = []
        if (oldeVerifInfo?.attach?.length > 0) {
            oldeVerifInfo.attach.map((item, index) => {
                let data = {
                    observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.suggestionContentLocation}
                        target="_blank" >  <Image />  </Button>,
                    // welfareContentId: item.welfareContentId,
                    // attachmentsType: item.welfareContentTypeEnumId
                }

                tableData.push(data)
                // if (index == contentLocation.length - 1) {
                setTimeout(() => {

                    // setLoading(false)
                }, 50)
                // }
            })

            setTableContent(prevState => { return [...prevState, ...tableData] })

        }


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
                {answerId ? <QuestionnaireResponder answerId={answerId} readOnly /> : ""}
            </Card>

            <Box style={{ margin: 10 }}>
                <FormPro
                    append={formStructureScore}
                    formValues={formValuesScore}
                    setFormValues={setFormValuesScore}

                />
            </Box>




        </Card>


    )
}




function Attachments(props) {
    const { tableContent, setTableContent } = props


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



    return (
        <Card>


            <TablePro
                title="پیوست"
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                // loading={loading}
                fixedLayout
            />
        </Card>

    )
}




export default OldVerifInfo;












