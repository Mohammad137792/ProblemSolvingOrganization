import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormLabel, FormControlLabel, RadioGroup, Collapse } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ModalPro from "../../../../components/ModalPro";
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AXIOS_TIMEOUT, SERVER_URL } from 'configs';
import QuestionnaireResponder from 'app/main/pages/questionnaire/responder/QuestionnaireResponder';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import AddBoxIcon from '@material-ui/icons/AddBox';
import InfoSuggestion from "../../../tasks/forms/suggestion/resultSuggestions/tabs/InfoSuggestion"



const SuggestionHistory = (props) => {
    
    const {
        tableContent, setTableContent, loading
    } = props

    const [expanded, setExpanded] = useState(false);
    const [suggestionStatus, SetSuggestionStatus] = useState([]);
    const [infoTableContent, setInfoTableContent] = useState([]);
    const [formValuseDiscriptionStructure, setFormValuseDiscriptionStructure] = useState([]);
    const [basicInformationFormValues, setBasicInformationFormValues] = useState([]);
    const [keyWordTableContent, setKeyWordTableContent] = useState([]);
    const [handleCheckBox, setHandleCheckBox] = useState([]);
    const [suggestingGroupTableContent, setSuggestingGroupTableContent] = useState([]);
   



    
    
    const tableCols = [
        { name: "suggestionCode", label: " کد رهگیری پیشنهاد ", type: "text", style: { minWidth: "100px" , "text-align": "center"} },
        { name: "suggestionTitle", label: " عنوان پیشنهاد ", type: "text", style: { minWidth: "100px" , "text-align": "center"} },
        { name: "suggestionStatusId", label: " وضعیت پیشنهاد ", type: "select", style: { minWidth: "100px" , "text-align": "center"}, options: suggestionStatus, optionLabelField: "description", optionIdField: "statusId"},
        { name: "suggestionCreationDate", label: "  تاریخ ایجاد پیشنهاد  ", type: "date", style: { minWidth: "160px" , "text-align": "center"} }
    ]





    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=SuggestionStatus", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            SetSuggestionStatus(res.data.status)
        }).catch(err => {
        });

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


    useEffect(() => {
        getEnum();
    }, []);

    



    return (
        <Card>
            <CardContent>
                    <TablePro
                        title="   لیست  پیشنهادات ارائه شده   "
                        columns={tableCols}
                        rows = {tableContent}
                        setTableContent={setTableContent}
                        loading={loading}
                        rowActions={[
                            {
                                title: "مشاهده",
                                icon: VisibilityIcon,
                                onClick: (row)=> {
                                    setExpanded(prevState => !prevState)
                                    console.log("rowwwwwwwwwwww", row)
                                    getSuggestionInfo(row.suggestionId)
                                }
                            }
                        ]}
                    />
                </CardContent>

                {expanded ?
                    <CardContent style={{margin: "100px"}}>
                        <ModalPro
                            title="اطلاعات اولیه پیشنهاد"
                            titleBgColor={"#3C4252"}
                            titleColor={"#dddddd"}
                            open={[]}
                            setOpen={() => setExpanded(false)}
                            content={
                                <Box p={2}>
                                    <Card>
                                        <CardContent>
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
                                        </CardContent>
                                    </Card>
                                </Box>
                            }
                        />
                    </CardContent>
                : ""}
        </Card>
    )
}








export default SuggestionHistory;












