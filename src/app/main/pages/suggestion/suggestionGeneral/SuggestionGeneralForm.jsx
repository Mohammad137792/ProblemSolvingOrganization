import React, {useState, useEffect} from 'react';
import axios from "axios";
import { useSelector } from "react-redux";
import {Button, Card} from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TabPro from 'app/main/components/TabPro';
import { Image } from "@material-ui/icons"
import { SERVER_URL } from 'configs';
import RecommenderInfo from "../../tasks/forms/suggestion/SuggestionPreliminaryReview/tabs/RecommenderInfo"
import InfoSuggestion from "../../tasks/forms/suggestion/resultSuggestions/tabs/InfoSuggestion"
import SuggestionHistory from './tabs/SuggestionHistory';
import ReviewResult from './tabs/ReviewResults'



const SuggestionGeneralForm = (props) => {
    const sendSuggestion = useSelector(({ fadak }) => fadak.workEffort);

    const [formValues, setFormValues] = useState([])
    const [suggestionStatus,SetSuggestionStatus] = useState([])
    const [reviewResultsTableContent, setReviewResultsTableContent] = useState([])
    const [suggestionHistoryTableContent, setSuggestionHistoryTableContent] = useState([])
    const [reviewResultsLoading, setReviewResultsLoading] = useState(true)
    const [suggestionHistoryLoading, setSuggestionHistoryLoading] = useState(true)
    const [infoTableContent, setInfoTableContent] = useState([]);
    const [formValuseDiscriptionStructure, setFormValuseDiscriptionStructure] = useState([]);
    const [basicInformationFormValues, setBasicInformationFormValues] = useState([]);
    const [keyWordTableContent, setKeyWordTableContent] = useState([]);
    const [handleCheckBox, setHandleCheckBox] = useState([]);
    const [suggestingGroupTableContent, setSuggestingGroupTableContent] = useState([]);
    const [recommenderInfoFormValues, setRecommenderInfoFormValues] = useState([]);
    const [primaryRejected, setPrimaryRejected] = useState(true);
    const [primaryRejectionReviewResult, setPrimaryRejectionReviewResult] = useState({});
    const [otherReasonVisibility, SetOtherReasonVisibility] = useState(false)
    const [rejectionReason, setRejectionReason] = useState([]);

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
            label: "   اطلاعات پیشنهاد دهنده",
            panel:  
                <RecommenderInfo
                    formValues={recommenderInfoFormValues}
                    setFormValues={setRecommenderInfoFormValues}
                />
        },
        {
            label: "       مشاهده پیشنهاد",
            panel: 
                <InfoSuggestion
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
            label: "    سابقه پیشنهادات گذشته",
            panel: <SuggestionHistory
                    tableContent={suggestionHistoryTableContent} 
                    setTableContent={setSuggestionHistoryTableContent}
                    loading={suggestionHistoryLoading}/>
        },
        {
            label: "       نتایج بررسی های صورت گرفته بر پیشنهاد",
            panel: 
                    <Card>
                    {primaryRejected ?
                        <ReviewResult 
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
        //     label: "   نتایج پاداش دهی به پیشنهاد",
        //     panel: <SuggestionInfoForm />
        // },
        // {
        //     label: "   مشاهده جزییات اجرا",
        //     panel: <SuggestionInfoForm />
        // },

    ]



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

    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=SuggestionStatus", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            SetSuggestionStatus(res.data.status)
        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=RejectionReason", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setRejectionReason(res.data.result)
        }).catch(err => {
        });

    }

    const getData = () => {
        axios.get(SERVER_URL + "/rest/s1/Suggestion/suggestionReviewerList", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: {"suggestionId": sendSuggestion.suggestionId}
        }).then(res => {
            const itemlen = res?.data?.data?.verificationLevel?.length
            if (itemlen > 0) {
                setReviewResultsTableContent(res.data.data.verificationLevel)
                setPrimaryRejected(true)
            }
            else {
                console.log("ahdha", res.data.data.verificationLevel)
                setPrimaryRejectionReviewResult(res.data.data.RejectionReason)
                setPrimaryRejected(false)
            }

            setReviewResultsLoading(false)
        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/Suggestion/mainMemberSuggestionHistory", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: {"suggestionId": sendSuggestion.suggestionId}
        }).then(res => {
            console.log("aaaaa",res.data.data )
            setSuggestionHistoryTableContent(res.data.data.filter((o) => o.suggestionId !== sendSuggestion.suggestionId))
            setSuggestionHistoryLoading(false)
        }).catch(err => {
        });
        getSuggestionInfo(sendSuggestion.suggestionId)
        getMainMemberInfo(sendSuggestion.suggestionId)
    }

    const getSuggestionInfo = (suggestionId) => {
        axios.get(SERVER_URL + "/rest/s1/Suggestion/suggestionDetail", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: {suggestionId: suggestionId}
        }).then(res => {
            let data = res.data.data
            setInfoTableContent(data)
            setFormValuseDiscriptionStructure(data)
            setBasicInformationFormValues(data)
            setKeyWordTableContent(data.keyWords)
            setHandleCheckBox(data.suggestionPresentationType === "Y"?{individual: false, group: true}: {individual: true, group: false})
            setSuggestingGroupTableContent(data.participants)
            let tableData = []
            if (data.contents?.length > 0) {
                data.contents.map((item, index) => {
                    let tdata = {
                        observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.location}
                            target="_blank" >  <Image />  </Button>,
                
                    }                    
                    tableData.push(tdata)
                    setTimeout(() => {}, 50)
                })

                setInfoTableContent(tableData)

            }
        }).catch(err => {
        });
    }

    const getMainMemberInfo = (suggestionId) => {
        axios.get(SERVER_URL + "/rest/s1/Suggestion/suggestionMainMemberInfo", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: {suggestionId: suggestionId}
        }).then(res => {
            console.log("setRecommenderInfoFormValues",res.data.data.result[0])
            setRecommenderInfoFormValues(res.data.data.result[0])
        }).catch(err => {
        });
    }


    useEffect(() => {
        setFormValues(sendSuggestion)
        getData()
    },[sendSuggestion])

    useEffect(() => {
        SetOtherReasonVisibility(primaryRejectionReviewResult?.RejectionReason?.includes("other") ? true : false)
    }, [primaryRejectionReviewResult])

    useEffect(() => {
        getEnum()
    },[])

    return (
        <Card>
            <Card style={{ backgroundColor: "#dddd",display:"flex",alignItems:"center",justifyContent:"center", padding:"0.5%" }}>
                <Card style={{width:"99%",height:"97%", padding:"2%"}}>
                    <FormPro
                        append={formStructure}
                        formValues={formValues}
                        setFormValues={setFormValues}

                    />
                </Card>
            </Card>
            <TabPro tabs={tabs} />
        </Card>
    )
}


export default SuggestionGeneralForm;