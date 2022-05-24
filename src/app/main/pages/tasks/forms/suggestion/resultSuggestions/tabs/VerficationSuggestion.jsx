import React, { useState, useEffect } from 'react';
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import { Image } from "@material-ui/icons"
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import TablePro from 'app/main/components/TablePro';
import VisibilityIcon from '@material-ui/icons/Visibility';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import QuestionnaireResponder from 'app/main/pages/questionnaire/responder/QuestionnaireResponder';
import { SERVER_URL } from 'configs';
import FormPro from 'app/main/components/formControls/FormPro';
import OldVerifInfo from '../../rewierSuggestion/tabs/OldVerifInfo';
import ModalPro from "app/main/components/ModalPro";


const VerficationSuggestion = (props) => {
    const { formVariables, endAccept } = props
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const dispatch = useDispatch()

    const [verificationTableContent, setVerificationTableContent] = useState([]);
    const [oldVerifInfo, setOldVerifInfo] = useState({});

    const [rejectionReason, setRejectionReason] = useState([]);
    const [FinalReviewDecisionEnumID, setFinalReviewDecisionEnumID] = useState([]);

    const [reviewer, setReviewer] = useState([]);
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [applicationType, setApplicationType] = useState([])
    const [showDependentTable, setShowDependentTable] = useState(false);
    const [otherOption, setOtherOption] = useState([]);

    let mergList = organizationUnit?.employees?.concat(otherOption?.employees)

    const verificationTableCols = [
        { name: "sequence", label: "   ترتیب تایید", type: "text", style: { minWidth: "130px" } },
        { name: "reviewerTypeEnumId", label: "   عنوان بررسی کننده ", type: "select", style: { minWidth: "130px" }, options: reviewer, optionLabelField: "description", optionIdField: "enumId", },
        { name: "companyPartyId", label: "   شرکت ", type: "select", style: { minWidth: "90px" }, options: organizationUnit?.subOrgans, optionLabelField: "companyName", optionIdField: "companyPartyId" },
        { name: "psoudoId", label: "  کد پرسنلی  ", type: "text", style: { minWidth: "130px" } },
        { name: "partyRelationshipId", label: "  نام و نام خانوادگی  ", type: "select", style: { minWidth: "130px" }, options: mergList ? mergList : [], optionLabelField: "name", optionIdField: "partyRelationshipId", },
        { name: "organizationPartyId", label: "   واحد سازمانی ", type: "select", style: { minWidth: "90px" }, options: organizationUnit?.units, optionLabelField: "unitOrganizationName", optionIdField: "unitPartyId", },
        { name: "emplPositionId", label: "  پست سازمانی  ", type: "select", style: { minWidth: "90px" }, options: organizationUnit?.positions, optionLabelField: "description", optionIdField: "emplPositionId", },
        { name: "questionnaireId", label: "  فرم ارزیابی  ", type: "select", style: { minWidth: "90px" }, options: applicationType, optionLabelField: "name", optionIdField: "questionnaireId", },
        { name: "reviewDeadLineDate", label: "   مهلت بررسی ", type: "date", style: { minWidth: "130px" } },
        { name: "actualReviewDate", label: "   تاریخ بررسی ", type: "date", style: { minWidth: "130px" } },
    ]

    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionReviewer", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setReviewer(res.data.result)

        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=RejectionReason", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            let array = []
            let obj = { enumId: 'other', enumTypeId: 'RejectionReason', description: 'سایر' }
            res.data.result.map((item, index) => {
                array.push(item)
            })
            array.push(obj)

            setRejectionReason(array)

        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionReviewDecision", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {


            setFinalReviewDecisionEnumID(res.data.result)

        }).catch(err => {
        });


        axios.post(SERVER_URL + "/rest/s1/evaluation/getApplicationType", { categoryEnumId: "QcSuggestionModule", subCategoryEnumId: "QcSuggestionReview" }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setApplicationType(res.data.result)

        }).catch(err => {
        });

    }


    const getOrgInfo = () => {
        axios
            .get(
                SERVER_URL + "/rest/s1/fadak/allCompaniesFilter",
                axiosKey
            )
            .then((res) => {
                const orgMap = {
                    units: res.data.data.units,
                    subOrgans: res.data.data.companies,
                    positions: res.data.data.emplPositions,
                    employees: res.data.data.persons,
                };
                setOrganizationUnit(orgMap);
            })
            .catch(() => {
            });

        axios
            .get(
                SERVER_URL + "/rest/s1/Suggestion/getPrtSuggReviewers",
                axiosKey
            )
            .then((res) => {

                const otherOP = {
                    subOrgans: res.data.data.companiees,
                    employees: res.data.data.persons,
                };
                setOtherOption(otherOP)
            })
            .catch(() => {
            });



    }


    useEffect(() => {
        getEnum();
        getOrgInfo()

        // let oldVer = []
        // formVariables.verificationTableContent.value.map((item, index) => {

        //         oldVer.push(item)
        // }
        // )
        // setVerificationTableContent(prevState => { return [...prevState, ...oldVer] })


        if (formVariables.accepterVerif?.value.length > 0) {
            setVerificationTableContent(formVariables.accepterVerif?.value)

        }

    }, []);



    return (
        <Box>

            <Card >
                <Card style={{ backgroundColor: "#dddd", padding: 1, margin: 5 }}>
                    {/* {showQuestionnaire ? <Card>
                        <HighlightOffIcon onClick={closeForm}/>
                        <QuestionnaireResponder answerId={100103} />
                        <FormPro
                                append={formStructure}
                                formValues={formValues}
                                setFormValues={setFormValues}
                            
                            />
                    </Card>
                        :  */}
                    <Card>
                        <CardContent>
                            <TablePro
                                fixedLayout={false}
                                title="   جدول نتایج بررسی کنندگان پیشنهاد"
                                columns={verificationTableCols}
                                rows={verificationTableContent}
                                setRows={setVerificationTableContent}
                                // loading={verificationLoading}

                                rowActions={[
                                    {
                                        title: "مشاهده",
                                        icon: VisibilityIcon,
                                        onClick: (row) => {
                                            setOldVerifInfo(row)
                                            setShowDependentTable(true)
                                        }
                                    },


                                ]}
                            />
                            <Card style={{ padding: 10 }}>
                                {formVariables?.status?.value == "رد" ? <h3>

                                    با تشکر از شما بابت ارائه این پیشنهاد، با توجه به بررسی های صورت گرفته متاسفانه با پیشنهاد شما موافقت نشد. در انتظار دریافت پیشنهادات دیگری از شما هستیم
                                    .با تشکر
                                </h3> : ""}
                            </Card>
                            <Box style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", width: "95%", marginTop: 5 }}>
                                <Button onClick={endAccept} type="submit" style={{ width: 120, height: 40, backgroundColor: "#24a0ed ", color: "white" }} >
                                    تایید
                                </Button>
                            </Box>
                        </CardContent>

                    </Card>
                    {/* } */}
                </Card>
                <Card >
                </Card>

                <ModalPro
                    title="مشاهده نتیجه ارزیابی بررسی کنندکان قبلی"
                    titleBgColor={"#3C4252"}
                    titleColor={"#dddddd"}
                    open={showDependentTable}
                    setOpen={setShowDependentTable}
                    content={
                        <Box>

                            <OldVerifInfo oldeVerifInfo={oldVerifInfo} />
                        </Box>

                    }
                />
            </Card>
        </Box>
    )
}



export default VerficationSuggestion;












