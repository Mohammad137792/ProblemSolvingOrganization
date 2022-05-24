import React, { useState, useEffect, createRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Card from "@material-ui/core/Card";
import { Button, } from "@material-ui/core";
import FormPro from 'app/main/components/formControls/FormPro';
import { Image } from "@material-ui/icons"
import { AXIOS_TIMEOUT, SERVER_URL } from 'configs';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import RecommenderInfo from '../SuggestionPreliminaryReview/tabs/RecommenderInfo';
import TabPro from 'app/main/components/TabPro';
import CheckSuggestions from './tabs/CheckSuggestions';
import InfoSuggestion from '../resultSuggestions/tabs/InfoSuggestion';
import { isBuffer } from 'lodash-es';
import { yearsToMonths } from 'date-fns';




const RewierSuggestionForm = (props) => {


    const { formVariables, submitCallback = true } = props;
    const user = useSelector(({ auth }) => auth.user.data.username);
    // const index = formVariables.verificationList.value.findIndex(i => i.active === true)
    const index = formVariables.verificationList.value.findIndex(i => i.sequence === formVariables.item.value.sequence)
    const partyRelationship = useSelector(({ auth }) => auth.user.data?.partyRelationshipId);
    const [formValues, setFormValues] = useState({});
    const [formValuesSuggestion, setFormValuesSuggestion] = useState({});
    const [basicInformationFormValues, setBasicInformationFormValues] = useState({})
    const [keyWordTableContent, setKeyWordTableContent] = useState([]);
    const [tableContent, setTableContent] = useState([]);
    const [personGroupedBy, setPersonGroupedBy] = useState([])
    const [handleCheckBox, setHandleCheckBox] = useState({ group: false, individual: false })
    const [suggestingGroupTableContent, setSuggestingGroupTableContent] = useState([])
    const [formValuseDiscriptionStructure, setFormValuseDiscriptionStructure] = useState({})
    const [verificationTableContent, setVerificationTableContent] = useState([]);
    const [disableModify, setDisableModify] = useState("N");
    const [disableReject, setDisableReject] = useState("N");
    const [formValuesScore, setFormValuesScore] = useState([])
    const [oldVerificationTableContent, setOldVerificationTableContent] = useState([])
    const [answerId, setAnswerId] = useState("")
    const [tableAttach, setTableAttach] = useState([]);
    const [location, setLocation] = useState([]);
    const [required, setRequired] = useState(false);
    const [formValuesContect, setFormValuesContect] = useState([])
    const [formValuesRiview, setFormValuesRiview] = useState([])
    const [newZapasVerif, setNewZapasVerif] = useState([])
    const [expanded, setExpanded] = useState(false);
    const [SuggestionSystemCler, setSuggestionSystemCler] = useState([]);
    const userParty = useSelector(({ auth }) => auth.user.data.partyId);

    const dispatch = useDispatch();
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    }

    const handleCreate = (formData) => {
        setExpanded(false)
        return new Promise((resolve, reject) => {
            const attachFile = new FormData();
            attachFile.append("file", formValuesContect?.contentLocation);


            axios.post(SERVER_URL + "/rest/s1/fadak/getpersonnelfile", attachFile, config)
                .then(res => {
                    let contentLocation = []
                    contentLocation.push(res.data)
                    let tableData = []
                    let locatinData = []
                    let locatinElement = {}
                    if (contentLocation.length > 0) {
                        contentLocation.map((item, index) => {
                            let data = {
                                observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.name}
                                    target="_blank" >  <Image />  </Button>,
                                // welfareContentId: item.welfareContentId,
                                // attachmentsType: item.welfareContentTypeEnumId
                            }
                            locatinElement.suggestionContentLocation = item.name
                            locatinElement.contentTypeEnumId = "SuggestionReview"
                            locatinData.push(locatinElement)
                            setLocation(prevState => { return [...prevState, ...locatinData] })

                            tableData.push(data)
                            // if (index == contentLocation.length - 1) {
                            setTimeout(() => {
                                setTableAttach(prevState => { return [...prevState, ...tableData] })
                                setFormValuesContect(prevState => ({
                                    ...prevState,
                                    contentLocation: ""
                                }))
                                // setLoading(false)
                            }, 50)
                            // }
                        })
                    }
                    if (contentLocation.length == 0) {
                        setTableAttach(tableData)
                        // setLoading(false)
                        setFormValuesContect(prevState => ({
                            ...prevState,
                            contentLocation: ""
                        }))

                    }

                })
        })

    }

    useEffect(() => {
        axios.get(SERVER_URL + `/rest/s1/Suggestion/getSuggestionSystemClerkCompany?companyPartyId=${formVariables.Suggestion?.value?.companyPartyId}`, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionSystemCler(res.data.list)
        }).catch(err => {
        });

    }, [formVariables.Suggestion?.value?.companyPartyId]);

    const handleSubmitAccept = (type) => {

        ///////////////////////////////////افزودن به verif
        if (formVariables.suggestionSystemCler.value === user)
            type = "modify"


        let VerList = []

        {

            personGroupedBy[personGroupedBy.length - 1].map((item, index) => {
                item.active = index === 0 ? true : false

                item.VerficationItem.map((i, j) => {
                    let element = {}
                    element.modify = i.modify === undefined ? "N" : i.modify
                    element.reject = i.reject === undefined ? "N" : i.reject
                    element.sequence = i.sequence ?? i.sequence
                    element.questionnaireId = i.questionnaireId
                    element.questionnaireAppId = i.questionnaireAppId
                    element.reviewDeadLineDate = i.reviewDeadLineDate
                    element.verificationDate = i.verificationDate
                    element.emplPositionId = i.emplPositionId
                    element.assingType = i.assingType
                    element.organizationPartyId = i.organizationPartyId
                    element.companyPartyId = i.companyPartyId
                    element.reviewerTypeEnumId = i.reviewerTypeEnumId
                    element.psoudoId = i.psoudoId
                    element.username = i.username
                    VerList.push(element)

                })



                // setVeriList(VerList)
            }
            )
        }

        const verificationList = VerList.reduce((verificationGruop, { questionnaireAppId, sequence, emplPositionId, reject,
            modify, questionnaireId, assingType,
            organizationPartyId, companyPartyId, reviewerTypeEnumId, psoudoId, username,
            reviewDeadLineDate, active }) => {
            if (!verificationGruop[sequence]) verificationGruop[sequence] = [];
            let element = {}
            let element1 = {}
            let arry = []
            element.sequence = sequence
            element.reject = reject === undefined ? "N" : reject
            element.modify = modify === undefined ? "N" : modify
            element.questionnaireId = questionnaireId
            element.reviewDeadLineDate = reviewDeadLineDate
            element.questionnaireAppId = questionnaireAppId
            element.emplPositionId = emplPositionId
            element.assingType = assingType
            element.organizationPartyId = organizationPartyId
            element.companyPartyId = companyPartyId
            element.reviewerTypeEnumId = reviewerTypeEnumId
            element.psoudoId = psoudoId
            element.username = username



            arry.push(element)

            element1.item = arry
            element1.sequence = sequence

            verificationGruop[sequence].push(element);
            return verificationGruop;
        }, {});

        /////////////////////////////////////////////////////////Verrrrrrrrrrrrrrrrrrrrrrrrrrr
        let verificationResult = []

        for (let key in verificationList) {
            var obj = {}
            if (verificationList.hasOwnProperty(key)) {
                obj.VerficationItem = verificationList[key]



                obj.sequence = verificationList[key][0].sequence
                verificationResult.push(obj)

            }
        }
        /////////////////////////////////////////////////////////Verrrrrrrrrrrrrrrrrrrrrrrrrrr


        let VerifList = []

        {
            verificationResult.map((item, index) => {
                let element = {}

                element.VerficationItem = item.VerficationItem ?? item.VerficationItem
                element.sequence = item.sequence ?? item.sequence
                element.active = index == 0 ? true : false

                VerifList.push(element)
                // setVeriList(VerList)
            }
            )
        }
        setNewZapasVerif(VerifList)
        ///////////////////////////////////افزودن به verif




        // let accepted = formVariables.verificationList.value.filter(item => item.active === true)
        let accepted = []
        let verif = formVariables.verificationList.value[index]
        let objVer = {}
        accepted.push(verif)

        let accepter = []
        accepted.map((i, j) => {
            if (i.VerficationItem.length === 1) {

                objVer.emplPositionId = i.VerficationItem[0].emplPositionId
                objVer.reviewDeadLineDate = i.VerficationItem[0].reviewDeadLineDate
                objVer.questionnaireAppId = i.VerficationItem[0].questionnaireAppId
                objVer.questionnaireId = i.VerficationItem[0].questionnaireId
                objVer.organizationPartyId = i.VerficationItem[0].organizationPartyId
                objVer.companyPartyId = i.VerficationItem[0].companyPartyId
                objVer.psoudoId = i.VerficationItem[0].psoudoId
                objVer.reviewerTypeEnumId = i.VerficationItem[0].reviewerTypeEnumId
                objVer.assingType = i.VerficationItem[0].assingType
                objVer.VerficationItem = i.VerficationItem
                objVer.partyRelationshipId = partyRelationship
                objVer.discription = formValuesScore.discription
                objVer.otherRiviewer = formValuesScore.otherRiviewer
                objVer.actualReviewDate = formValuesRiview.actualReviewDate
                objVer.answerId = answerId
                objVer.attach = location
                objVer.finalReviewDecisionEnumId = formValuesScore.finalReviewDecisionEnumId
                objVer.modify = i.VerficationItem[0].modify
                objVer.reject = i.VerficationItem[0].reject
                objVer.sequence = i.VerficationItem[0].sequence




                accepter.push(objVer)
            }
            if (i.VerficationItem.length > 1) {

                let index = i.VerficationItem.findIndex(ele => ele.emplPositionId === formVariables.item.value.emplPositionId)


                objVer.emplPositionId = i.VerficationItem[index].emplPositionId
                objVer.questionnaireAppId = i.VerficationItem[index].questionnaireAppId
                objVer.reviewDeadLineDate = i.VerficationItem[index].reviewDeadLineDate
                objVer.questionnaireId = i.VerficationItem[index].questionnaireId
                objVer.organizationPartyId = i.VerficationItem[index].organizationPartyId
                objVer.companyPartyId = i.VerficationItem[index].companyPartyId
                objVer.psoudoId = i.VerficationItem[index].psoudoId
                objVer.reviewerTypeEnumId = i.VerficationItem[index].reviewerTypeEnumId
                objVer.assingType = i.VerficationItem[index].assingType
                objVer.VerficationItem = i.VerficationItem
                objVer.partyRelationshipId = partyRelationship
                objVer.discription = formValuesScore.discription
                objVer.otherRiviewer = formValues.otherRiviewer
                objVer.reviewerDate = formValuesScore.reviewerDate
                objVer.answerId = answerId
                objVer.actualReviewDate = formValuesRiview.actualReviewDate
                objVer.attach = location
                objVer.finalReviewDecisionEnumId = formValuesScore.finalReviewDecisionEnumId
                objVer.modify = i.VerficationItem[index].modify
                objVer.reject = i.VerficationItem[index].reject
                objVer.sequence = i.VerficationItem[index].sequence



                accepter.push(objVer)
            }
        })


        let accept = accepter.concat(formVariables?.accepterVerif?.value.filter(i => i.assingType !== accepter[0].assingType)).filter(item => item !== undefined)


        let notAccepted = formVariables.verificationList.value.filter(item => item.active !== true)
        if (notAccepted.length > 0)
            notAccepted[0].active = true

        formVariables.Suggestion.value.suggestionCode = formVariables.trackingCode?.value
        formVariables.Suggestion.value.suggestionStatusId = "SuggAccepted"


        let saveData = {
            Suggestion: formVariables.Suggestion.value,
            SuggestionKeyWords: formVariables.SuggestionKeyWords.value,
            SuggestionParticipant: formVariables.SuggestionParticipant.value,
            SuggestionContent: formVariables.SuggestionContent.value,
            VerificationLevel: accept,

        }
        formVariables.verificationList.value[index].active = false
        if (formVariables.verificationList.value[index + 1]) {
            formVariables.verificationList.value[index + 1].active = true
        }
        let newAddList = []
        if (formVariables?.accepterVerif?.value?.length > 0) {
            formVariables.accepterVerif.value.map((x, i) => {

                VerifList.map((y, j) => {
                    if (x.sequence !== y.sequence)
                        newAddList.push(y)

                })

            })
        }



        let lastList = formVariables?.accepterVerif?.value?.length > 0 ? newAddList.filter(item => item.sequence !== formVariables.item.value.sequence) : VerifList.filter(item => item.sequence !== formVariables.item.value.sequence)

        const packet = {
            "api_key": localStorage.getItem('Authorization'),
            // result: VerifList.length > formVariables.verificationListZapas?.value?.length ? type = "modify" : type = "accept",
            result: SuggestionSystemCler?.includes(userParty) ? type = "modify" : type = "accept",
            // verificationList: VerifList,
            verificationListZapas: VerifList,
            accepterVerif: accept,
            verificationTableContent: verificationTableContent.concat(oldVerificationTableContent).concat(formVariables.item.value),
            saveData: saveData,
            status: "تایید",
            modifyData: {
                verificationListAdded: VerifList,
                modifyItem: formVariables.item.value,


            }


        }
        if (formValuesScore.finalReviewDecisionEnumId === undefined || formValuesScore.finalReviewDecisionEnumId === null) {
            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' فیلد های اجباری را پر کنید   !'));
        }

        else {
            submitCallback(packet)


        }

    }


    const handleSubmitModify = (type) => {
        ///////////////////////////////////////////////////ارجاع به مدیر

        const packet = {
            result: "modify",
            modifyData: {
                verificationList: newZapasVerif.length > formVariables.verificationListZapas.value.length ? newZapasVerif : formVariables.verificationListZapas.value,
                modifyItem: formVariables.item.value,

            },
            // verificationListZapas: newZapasVerif.length > formVariables.verificationListZapas.value.length ? newZapasVerif : formVariables.verificationListZapas.value,





        }

        let currentSequenc = formVariables.item.value.sequence
        let verBack = newZapasVerif.length > formVariables.verificationListZapas?.value?.length ? newZapasVerif : formVariables.verificationListZapas?.value
        let goBack = 0
        verBack.map((item, index) => {
            if (item.sequence < currentSequenc) {
                goBack = goBack + 1

            }




        })


        if (goBack > 0)

            submitCallback(packet)
        else
            dispatch(
                setAlertContent(
                    ALERT_TYPES.WARNING,
                    "مدیر بالاتر وجود ندارد"
                )
            );




    }

    const handleSubmitReject = (type) => {
        setRequired(true)

        let accepted = []
        let verif = formVariables.verificationList.value[index]
        let objVer = {}
        accepted.push(verif)

        let accepter = []
        accepted.map((i, j) => {
            if (i.VerficationItem.length === 1) {

                objVer.emplPositionId = i.VerficationItem[0].emplPositionId
                objVer.reviewDeadLineDate = i.VerficationItem[0].reviewDeadLineDate
                objVer.questionnaireAppId = i.VerficationItem[0].questionnaireAppId
                objVer.questionnaireId = i.VerficationItem[0].questionnaireId
                objVer.organizationPartyId = i.VerficationItem[0].organizationPartyId
                objVer.companyPartyId = i.VerficationItem[0].companyPartyId
                objVer.psoudoId = i.VerficationItem[0].psoudoId
                objVer.reviewerTypeEnumId = i.VerficationItem[0].reviewerTypeEnumId
                objVer.assingType = i.VerficationItem[0].assingType
                objVer.VerficationItem = i.VerficationItem
                objVer.partyRelationshipId = partyRelationship
                objVer.discription = formValuesScore.discription
                objVer.otherRiviewer = formValuesScore.otherRiviewer
                objVer.actualReviewDate = formValuesRiview.actualReviewDate
                objVer.answerId = answerId
                objVer.attach = location
                objVer.finalReviewDecisionEnumId = formValuesScore.finalReviewDecisionEnumId
                objVer.modify = i.VerficationItem[0].modify
                objVer.reject = i.VerficationItem[0].reject
                objVer.sequence = i.VerficationItem[0].sequence
                objVer.rejectionReasonEnumID = formValuesScore.rejectionReasonEnumID
                objVer.other = formValuesScore.other
                objVer.status = "Y"




                accepter.push(objVer)
            }
            if (i.VerficationItem.length > 1) {

                let index = i.VerficationItem.findIndex(ele => ele.emplPositionId === formVariables.item.value.emplPositionId)


                objVer.emplPositionId = i.VerficationItem[index].emplPositionId
                objVer.questionnaireAppId = i.VerficationItem[index].questionnaireAppId
                objVer.reviewDeadLineDate = i.VerficationItem[index].reviewDeadLineDate
                objVer.questionnaireId = i.VerficationItem[index].questionnaireId
                objVer.organizationPartyId = i.VerficationItem[index].organizationPartyId
                objVer.companyPartyId = i.VerficationItem[index].companyPartyId
                objVer.psoudoId = i.VerficationItem[index].psoudoId
                objVer.reviewerTypeEnumId = i.VerficationItem[index].reviewerTypeEnumId
                objVer.assingType = i.VerficationItem[index].assingType
                objVer.VerficationItem = i.VerficationItem
                objVer.partyRelationshipId = partyRelationship
                objVer.discription = formValuesScore.discription
                objVer.otherRiviewer = formValues.otherRiviewer
                objVer.reviewerDate = formValuesScore.reviewerDate
                objVer.answerId = answerId
                objVer.actualReviewDate = formValuesRiview.actualReviewDate
                objVer.attach = location
                objVer.finalReviewDecisionEnumId = formValuesScore.finalReviewDecisionEnumId
                objVer.modify = i.VerficationItem[index].modify
                objVer.reject = i.VerficationItem[index].reject
                objVer.sequence = i.VerficationItem[index].sequence
                objVer.rejectionReasonEnumID = formValuesScore.rejectionReasonEnumID
                objVer.other = formValuesScore.other
                objVer.status = "Y"






                accepter.push(objVer)
            }
        })




        let accept = accepter.concat(formVariables?.accepterVerif?.value).filter(item => item !== undefined)






        let verListSave = []
        let element = {}

        verificationTableContent.map((y, j) => {
            formVariables.verificationList.value.map((x, j) => {
                if (x.partyRelationshipId === y.partyRelationshipId) {

                    y.status = x.active === true ? "Y" : "N"
                    y.attach = x.attach
                    y.answerId = x.answerId
                    y.finalReviewDecisionEnumId = x.finalReviewDecisionEnumId
                }

                verListSave.push(y)
            }
            )
        }
        )

        let uniqueVerList = verListSave.filter((c, index) => {
            return verListSave.indexOf(c) === index;
        });





        type = "reject"

        // if (type == "reject") {
        //     formVariables.verificationList.value[index].active = false
        //     formVariables.verificationList.value[0].active = true

        // }
        let data = {
            result: type,
            accepterVerif: accept,
            status: "رد",
            RejectionReasons: {
                rejectionReasonEnumID: formValuesScore.rejectionReasonEnumID,
                other: formValuesScore.other,

            }
        }

        if (formValuesScore.rejectionReasonEnumID === undefined || formValuesScore.rejectionReasonEnumID === null) {

            dispatch(setAlertContent(ALERT_TYPES.ERROR, ' فیلد های اجباری را پر کنید   !'));
        }

        else {

            // const Suggestion = Object.assign(formVariables.Suggestion?.value, formVariables.trackingCode?.value)
            formVariables.Suggestion.value.suggestionCode = formVariables.trackingCode?.value
            formVariables.Suggestion.value.suggestionStatusId = "SuggRejected"

            let saveData = {
                Suggestion: formVariables.Suggestion?.value,
                SuggestionKeyWords: formVariables.SuggestionKeyWords.value,
                SuggestionParticipant: formVariables.SuggestionParticipant.value,
                SuggestionContent: formVariables.SuggestionContent.value,
                RejectionReasons: {
                    rejectionReasonEnum: formValuesScore.rejectionReasonEnumID,
                    partyRelationshipId: partyRelationship,
                    other: formValuesScore.other


                },
                VerificationLevel: accept,

                // VerificationLevel1: uniqueVerList



            }
            axios.post(SERVER_URL + "/rest/s1/Suggestion/suggestionProcess", { data: saveData }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    submitCallback(data)


                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });


        }

    }
    const tabs = [
        {
            label: "اطلاعات پیشنهاد دهنده",
            panel: <RecommenderInfo formValues={formValues} setFormValues={setFormValues} />
        },
        {
            label: "       مشاهده پیشنهاد",
            panel: <InfoSuggestion basicInformationFormValues={basicInformationFormValues} handleCheckBox={handleCheckBox}
                setHandleCheckBox={setHandleCheckBox} suggestingGroupTableContent={suggestingGroupTableContent}
                setSuggestingGroupTableContent={setSuggestingGroupTableContent}
                setBasicInformationFormValues={setBasicInformationFormValues}
                keyWordTableContent={keyWordTableContent} setKeyWordTableContent={setKeyWordTableContent}
                tableContent={tableContent} setTableContent={setTableContent}
                formValuseDiscriptionStructure={formValuseDiscriptionStructure}
                setFormValuseDiscriptionStructure={setFormValuseDiscriptionStructure} />
        },

        {
            label: "   بررسی پیشنهاد",
            panel: <CheckSuggestions
                SuggestionSystemCler={SuggestionSystemCler} setSuggestionSystemCler={setSuggestionSystemCler}
                expanded={expanded} setExpanded={setExpanded}
                handleCreate={handleCreate}
                formValuesContect={formValuesContect} setFormValuesContect={setFormValuesContect}
                setPersonGroupedBy={setPersonGroupedBy}
                formValuesScore={formValuesScore}
                setFormValuesScore={setFormValuesScore}
                personGroupedBy={personGroupedBy}
                formValues={formValues}
                setFormValues={setFormValues}
                verificationTableContent={verificationTableContent}
                setVerificationTableContent={setVerificationTableContent}
                handleSubmitAccept={handleSubmitAccept}
                handleSubmitModify={handleSubmitModify}
                handleSubmitReject={handleSubmitReject}
                disableModify={disableModify}
                setDisableModify={setDisableModify}
                disableReject={disableReject}
                setDisableReject={setDisableReject}
                oldVerificationTableContent={oldVerificationTableContent}
                setOldVerificationTableContent={setOldVerificationTableContent} formValuesRiview={formValuesRiview} setFormValuesRiview={setFormValuesRiview}
                required={required} setRequired={setRequired}
                answerId={answerId} formVariables={formVariables} location={location} tableAttach={tableAttach} setTableAttach={setTableAttach} />
        },

    ]



    const formStructure = [
        {
            label: "   کد پیشنهاد",
            name: "suggestionCode",
            type: "text",
            col: 4,
            readOnly: true
        },
        // {
        //     label: "   وضعیت پیشنهاد",
        //     name: "status",
        //     type: "text",
        //     col: 4
        // }, 
        {
            label: "   تاریخ ارجاع",
            name: "backDate",
            type: "date",
            col: 4,
            readOnly: true

        }, {
            label: "   مهلت بررسی",
            name: "reviewDeadLineDate",
            type: "date",
            col: 4,
            readOnly: true

        }

    ]




    useEffect(() => {
        let questionnaireAppId = formVariables?.verificationList?.value[index]?.VerficationItem[0].questionnaireAppId

        axios.post(SERVER_URL + "/rest/s1/Suggestion/questionnaireAnswer", { partyRelationshipId: partyRelationship, questionnaireAppId: questionnaireAppId }, axiosKey)
            .then((res) => {
                setAnswerId(res.data.answerId)
            }).catch(() => {
            });





        let currentSequence = formVariables.item.value.sequence

        let oldVer = []
        if (formVariables.accepterVerif?.value.length > 0) {
            formVariables.accepterVerif.value.map((item, index) => {


                if (parseInt(item.sequence) < currentSequence)
                    oldVer.push(item)
            }
            )
        }

        setOldVerificationTableContent(prevState => { return [...prevState, ...oldVer] })

        let myArray = formVariables?.verificationTableContent?.value.filter(ar => !oldVer.find(rm => (rm.sequence === ar.sequence)))
        setVerificationTableContent(myArray.filter(item => item.sequence !== formVariables.item.value.sequence))



        setFormValuesSuggestion(prevState => ({
            ...prevState,
            reviewDeadLineDate: formVariables.verificationList?.value[index]?.VerficationItem[0]?.reviewDeadLineDate,
            backDate: formVariables.verificationList?.value[index].backDate ? formVariables.verificationList?.value[index].backDate : formVariables.accepterVerif?.value[0].actualReviewDate,
            // backDate:  formVariables.accepterVerif?.value[0].actualReviewDate,
            suggestionCode: formVariables?.trackingCode?.value


        }))




        if (formVariables.verificationList?.value[index]?.VerficationItem[0]?.reject === "Y")
            setDisableReject("Y")
        if (formVariables.verificationList?.value[index]?.VerficationItem[0]?.modify === "Y")
            setDisableModify("Y")


        setFormValues(formVariables?.Recommender?.value[0])
        setFormValuseDiscriptionStructure(formVariables?.Suggestion?.value)

        setBasicInformationFormValues(formVariables?.Suggestion?.value)
        setBasicInformationFormValues(prevState => ({
            ...prevState,
            suggestionCode: formVariables?.trackingCode?.value

        }))

        setKeyWordTableContent(formVariables.SuggestionKeyWords.value)

        setHandleCheckBox(prevState => ({
            ...prevState,
            individual: formVariables?.Suggestion?.value?.suggestionPresentationType === "Y" ? false : true,
            group: formVariables?.Suggestion?.value?.suggestionPresentationType === "N" ? false : true,

        }))

        setSuggestingGroupTableContent(formVariables?.groupList?.value)



        let tableData = []
        if (formVariables.SuggestionContent?.value.length > 0) {
            formVariables.SuggestionContent.value.map((item, index) => {
                let data = {
                    observeFile: <Button variant="outlined" color="primary" href={SERVER_URL + "/rest/s1/fadak/getpersonnelfile1?name=" + item.location}
                        target="_blank" >  <Image />  </Button>,
                }
                tableData.push(data)
                setTimeout(() => {
                }, 50)
            })

            setTableContent(prevState => { return [...prevState, ...tableData] })

        }



    }, []);


    return (
        <Card>
            <Card style={{ backgroundColor: "#dddd", display: "flex", alignItems: "center", justifyContent: "center", height: 150 }}>
                <Card style={{ width: "99%", height: "97%", display: "flex", alignItems: "center", justifyContent: "center", padding: 5 }}>
                    <FormPro
                        append={formStructure}
                        formValues={formValuesSuggestion}
                        setFormValues={setFormValuesSuggestion}

                    />
                </Card>
            </Card>
            <TabPro tabs={tabs} />
        </Card>
    )

}



export default RewierSuggestionForm;
