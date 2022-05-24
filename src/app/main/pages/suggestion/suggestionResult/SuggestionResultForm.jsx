import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useSelector } from "react-redux";
import { Box, Button, Card } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import { SERVER_URL } from 'configs';
import { Image } from "@material-ui/icons"
import TabPro from 'app/main/components/TabPro';
import InfoSuggestion from "../../tasks/forms/suggestion/resultSuggestions/tabs/InfoSuggestion"
import ReviewResults from "../suggestionGeneral/tabs/ReviewResults"
import checkPermis from 'app/main/components/CheckPermision';


const SuggestionResultForm = (props) => {
    const sendSuggestion = useSelector(({ fadak }) => fadak.workEffort);
    const [formValues, setFormValues] = useState([])
    const [reviewResultsTableContent, setReviewResultsTableContent] = useState([])
    const [reviewResultsLoading, setReviewResultsLoading] = useState(true)
    const [suggestionStatus, setSuggestionStatus] = useState([])
    const [infoTableContent, setInfoTableContent] = useState([]);
    const [formValuseDiscriptionStructure, setFormValuseDiscriptionStructure] = useState([]);
    const [basicInformationFormValues, setBasicInformationFormValues] = useState([]);
    const [keyWordTableContent, setKeyWordTableContent] = useState([]);
    const [handleCheckBox, setHandleCheckBox] = useState([]);
    const [suggestingGroupTableContent, setSuggestingGroupTableContent] = useState([]);
    const [primaryRejected, setPrimaryRejected] = useState(true);
    const [primaryRejectionReviewResult, setPrimaryRejectionReviewResult] = useState({});
    const [otherReasonVisibility, SetOtherReasonVisibility] = useState(false)
    const [rejectionReason, setRejectionReason] = useState([]);
    const datas = useSelector(({ fadak }) => fadak);

    const formStructure = [
        {
            label: "   کد پیشنهاد",
            name: "suggestionCode",
            type: "text",
            readOnly: true,
            col: 4
        },
        {
            label: "   وضعیت پیشنهاد",
            name: "suggestionStatusId",
            type: "select",
            options: suggestionStatus,
            optionLabelField: "description",
            optionIdField: "statusId",
            readOnly: true,
            col: 4
        },
        {
            label: "   تاریخ ایجاد",
            name: "suggestionCreationDate",
            type: "date",
            readOnly: true,
            col: 4
        }

    ]

    const formStructureScore = [
        {
            label: "  دلایل رد ",
            name: "RejectionReason",
            type: "multiselect",
            readOnly: true,
            col: 6,
            options: rejectionReason,
            optionLabelField: "description",
            optionIdField: "enumId",
        },
        {
            label: "سایر دلایل",
            name: "other",
            readOnly: true,
            type: "textarea",
            col: 6,
            rows: 5,
            style: { visibility: otherReasonVisibility ? "" : "hidden" }
        }

    ]

    const tabs = [
        {
            label: "   اطلاعات پیشنهاد",
            panel: <InfoSuggestion
                        tableContent={infoTableContent}
                        setTableContent={setInfoTableContent}
                        formValuseDiscriptionStructure={formValuseDiscriptionStructure}
                        setFormValuseDiscriptionStructure={setFormValuseDiscriptionStructure}
                        basicInformationFormValues={basicInformationFormValues}
                        setBasicInformationFormValues={setBasicInformationFormValues}
                        keyWordTableContent={keyWordTableContent}
                        setKeyWordTableContent={setKeyWordTableContent}
                        handleCheckBox={handleCheckBox}
                        setHandleCheckBox={setHandleCheckBox}
                        suggestingGroupTableContent={suggestingGroupTableContent}
                        setSuggestingGroupTableContent={setSuggestingGroupTableContent}
                    />
        }
       
     
    ]
    const tabs1 = [
        {
            label: "   اطلاعات پیشنهاد",
            panel: <InfoSuggestion
                        tableContent={infoTableContent}
                        setTableContent={setInfoTableContent}
                        formValuseDiscriptionStructure={formValuseDiscriptionStructure}
                        setFormValuseDiscriptionStructure={setFormValuseDiscriptionStructure}
                        basicInformationFormValues={basicInformationFormValues}
                        setBasicInformationFormValues={setBasicInformationFormValues}
                        keyWordTableContent={keyWordTableContent}
                        setKeyWordTableContent={setKeyWordTableContent}
                        handleCheckBox={handleCheckBox}
                        setHandleCheckBox={setHandleCheckBox}
                        suggestingGroupTableContent={suggestingGroupTableContent}
                        setSuggestingGroupTableContent={setSuggestingGroupTableContent}
                    />
        },
          {
            label: "نتایج بررسی های صورت گرفته بر پیشنهاد",
            panel:
                <Card>
                    {primaryRejected ?
                        <ReviewResults
                            tableContent={reviewResultsTableContent}
                            setTableContent={setReviewResultsTableContent}
                            loading={reviewResultsLoading}
                        />
                        :
                        <Card style={{margin: 5}}>
                            <FormPro
                                style={{margin: 30}}
                                append={formStructureScore}
                                formValues={primaryRejectionReviewResult}
                                setFormValues={setPrimaryRejectionReviewResult}
                            />
                        </Card>
                    }
                </Card>

        },

        // {
        //     label: "   اعتراض به نتیجه",
        //     panel: []
        // },
    ]

    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=SuggestionStatus", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionStatus(res.data.status)
        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=RejectionReason", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setRejectionReason(res.data.result)
        }).catch(err => {
        });

    }

    const getReviwerData = () => {
        axios.get(SERVER_URL + "/rest/s1/Suggestion/suggestionReviewerList", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: { "suggestionId": sendSuggestion.suggestionId }
        }).then(res => {
            const itemlen = res?.data?.data?.verificationLevel?.length
            if (itemlen > 0) {
                setReviewResultsTableContent(res.data.data.verificationLevel)
                setPrimaryRejected(true)
            }
            else {
                setPrimaryRejectionReviewResult(res.data.data.RejectionReason)
                setPrimaryRejected(false)
            }

            setReviewResultsLoading(false)
        }).catch(err => {
        });
    }

    const getSuggestionInfo = (suggestionId) => {
        axios.get(SERVER_URL + "/rest/s1/Suggestion/suggestionDetail", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: { suggestionId: suggestionId }
        }).then(res => {
            let data = res.data.data
            setInfoTableContent(data)
            setFormValuseDiscriptionStructure(data)
            setBasicInformationFormValues(data)
            setKeyWordTableContent(data.keyWords)
            setHandleCheckBox(data.suggestionPresentationType === "Y" ? { individual: false, group: true } : { individual: true, group: false })
            setSuggestingGroupTableContent(data.participants)
            let tableData = []
            if (data.contents?.length > 0) {
                data.contents.map((item, index) => {
                    let tdata = {
                        observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.location}
                            target="_blank" >  <Image />  </Button>,

                    }
                    tableData.push(tdata)
                    setTimeout(() => { }, 50)
                })

                setInfoTableContent(tableData)

            }
        }).catch(err => {
        });
    }

    useEffect(() => {
        getEnum()
        getReviwerData()
        setFormValues(sendSuggestion)
        getSuggestionInfo(sendSuggestion.suggestionId)
    }, [])

    useEffect(() => {
        SetOtherReasonVisibility(primaryRejectionReviewResult?.RejectionReason?.includes("other") ? true : false)
    }, [primaryRejectionReviewResult])


    return (
        <Box>
            <Card style={{ backgroundColor: "#dddd", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5%" }}>
                <Card style={{ width: "99%", height: "97%", padding: "2%" }}>
                    <FormPro
                        append={formStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}

                    />
                </Card>
            </Card>
            <TabPro tabs={checkPermis("personnelManagement/porofileSuggestion/viewBtn/reviewResultsTab", datas)?tabs1:tabs} />
        </Box>
    )
}


export default SuggestionResultForm;