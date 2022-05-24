import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, Grid, Typography, Collapse } from "@material-ui/core";
import { SERVER_URL, AXIOS_TIMEOUT } from 'configs';
import FormPro from 'app/main/components/formControls/FormPro';
import ActionBox from 'app/main/components/ActionBox';
import TablePro from 'app/main/components/TablePro';
import { Image, TrendingUpRounded } from "@material-ui/icons"
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useDispatch, useSelector } from 'react-redux';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { use } from 'marked';
import CompensationProfile from 'app/main/pages/compensation/userProfile/CompensationProfile';
import checkPermis from 'app/main/components/CheckPermision';



const DefineSuggestForm = (props) => {
    const { formVariables, submitCallback } = props;
    const [basicInformationFormValues, setBasicInformationFormValues] = useState(formVariables?.Suggestion?.value ? formVariables?.Suggestion?.value : [])
    const [basicFormValidation, setBasicFormValidation] = useState([])
    const [discriptionFormValidation, setDiscriptionFormValidation] = useState([])
    const [performanceEnumId, setPerformanceEnumId] = useState([])
    const [suggestionImpactEnumId, setSuggestionImpactEnumId] = useState([])
    const [suggestionOriginEnumId, setSuggestionOriginEnumId] = useState([])
    const [suggestionScopeEnumID, setSuggestionScopeEnumID] = useState([])
    const [suggestionType, setSuggestionType] = useState([{ id: "Y", title: "کمی" }, { id: "N", title: "کیفی" }])
    const [rewardPreference, setrewardPreference] = useState([{ id: "Y", title: "نقدی" }, { id: "N", title: "غیر نقدی" }])
    const [organizationUnit, setOrganizationUnit] = useState({});
    const [keyWordTableContent, setKeyWordTableContent] = useState(formVariables?.SuggestionKeyWords?.value ? formVariables?.SuggestionKeyWords?.value : [])
    const [suggestingGroupTableContent, setSuggestingGroupTableContent] = useState([])
    const [groupInformationFormValues, setgroupInformationFormValues] = useState([])
    const [handleCheckBox, setHandleCheckBox] = useState({ individual: (formVariables?.Suggestion?.value?.suggestionPresentationType) ? (formVariables?.Suggestion?.value?.suggestionPresentationType === "Y" ? false : true) : true, group: (formVariables?.Suggestion?.value?.suggestionPresentationType) ? (formVariables?.Suggestion?.value?.suggestionPresentationType === "N" ? false : true) : false, })
    const userPartyId = useSelector(({ auth }) => auth.user.data?.partyId);
    const [location, setLocation] = useState(formVariables?.SuggestionContent?.value ? formVariables?.SuggestionContent?.value : []);
    const [company, setCompany] = useState([]);
    const [personInfo, setPersonInfo] = useState([]);
    const [communicationEventId, setSuggestionInvitationId] = useState([]);
    const [sumPercent, setSumPercent] = useState(0);
    const [nonOccationalGift, setNonOccationalGift] = useState([]);
    const [tableContent, setTableContent] = useState([])
    const myElement = React.createRef(0);
    const myElement1 = React.createRef(0);
    const datas = useSelector(({ fadak }) => fadak);

    const startCamunda = (type) => {
        type = "true"

        myElement.current.click();
        myElement1.current.click();

        if (suggestingGroupTableContent.length > 0) {
            const listTableContent = [...suggestingGroupTableContent];
            let indexM = listTableContent.findIndex(ele => ele.mainMember === "Y")
            listTableContent[indexM].rewardPreference = basicInformationFormValues.rewardPreference
            listTableContent[indexM].nonOccationalGift = basicInformationFormValues.nonOccationalGift ? basicInformationFormValues.nonOccationalGift : "[]"
            setSuggestingGroupTableContent(listTableContent)
        }
        let data = {

            Suggestion: {
                'api_key': localStorage.getItem('api_key'),
                suggestionCode: basicInformationFormValues.suggestionCode,
                companyPartyId: basicInformationFormValues.companyPartyId,
                suggestionCreationDate: basicInformationFormValues.suggestionCreationDate,
                suggestionScopeEnumId: basicInformationFormValues.suggestionScopeEnumId,
                communicationEventId: basicInformationFormValues.communicationEventId,
                performanceEnumId: basicInformationFormValues.performanceEnumId,
                suggestionImpactEnumId: basicInformationFormValues.suggestionImpactEnumId,
                suggestionOriginEnumId: basicInformationFormValues.suggestionOriginEnumId,
                suggestionType: basicInformationFormValues.suggestionType,
                rewardPreference: basicInformationFormValues.rewardPreference,
                nonOccationalGift: basicInformationFormValues.nonOccationalGift ? basicInformationFormValues.nonOccationalGift : "[]",
                suggestionTitle: formValuseDiscriptionStructure.suggestionTitle,
                suggestionDescription: formValuseDiscriptionStructure.suggestionDescription,
                currentMethodProblems: formValuseDiscriptionStructure.currentMethodProblems,
                suggestedMethod: formValuseDiscriptionStructure.suggestedMethod,
                suggestedMethodAdvantages: formValuseDiscriptionStructure.suggestedMethodAdvantages,
                requieredResources: formValuseDiscriptionStructure.requieredResources,
                description: formValuseDiscriptionStructure.description,
                estimatedExecutionCost: formValuseDiscriptionStructure.estimatedExecutionCost,
                estimatedAnnualSaving: formValuseDiscriptionStructure.estimatedAnnualSaving,
                suggestionPresentationType: suggestingGroupTableContent.length > 1 ? "Y" : "N"



            },
            SuggestionKeyWords: keyWordTableContent,

            SuggestionParticipant: suggestingGroupTableContent,
            SuggestionContent: location,

            Recommender: personInfo,
            groupList: suggestingGroupTableContent,
            // suggestionSystemCler: suggestionSystemCler[0]
            suggestionSystemCler: "ssc/" + basicInformationFormValues.companyPartyId,
            processType: "Suggestion",
            continue: type,





        }
        if ((basicInformationFormValues.companyPartyId === undefined || basicInformationFormValues.companyPartyId === null) ||
            (formValuseDiscriptionStructure.suggestionTitle === undefined || formValuseDiscriptionStructure.suggestionTitle === "") ||
            (formValuseDiscriptionStructure.suggestedMethod === undefined || formValuseDiscriptionStructure.suggestedMethod === ""))
            dispatch(setAlertContent(ALERT_TYPES.ERROR, "باید تمام فیلدهای ضروری وارد شوند!"));

        else {

            submitCallback(data)
            setBasicInformationFormValues([])
            setKeyWordTableContent([])
            setFormValuseDiscriptionStructure([])
            setSuggestingGroupTableContent([])
            setTableContent([])
            setHandleCheckBox({ individual: true, group: false })

        }

    }

    useEffect(() => {
        let data = {
            partyId: "",
        }
        axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setPersonInfo(res.data.result)
        }).catch(err => { });

        setBasicInformationFormValues(prevState => ({
            ...prevState,
            suggestionCode: formVariables?.trackingCode?.value

        }))
    }, []);


    useEffect(() => {
        if (!formVariables && personInfo.length > 0) {
            let individualElement = {}
            // individualElement.rewardPreference = basicInformationFormValues.rewardPreference
            // individualElement.nonOccationalGift = basicInformationFormValues.nonOccationalGift ? basicInformationFormValues.nonOccationalGift : "[]"
            individualElement.mainMember = "Y"
            individualElement.partyRelationshipId = personInfo[0].partyRelationshipId
            individualElement.emplPositionId = personInfo[0].empPosition
            individualElement.organizationUnit = personInfo[0].orgId
            individualElement.participationRate = 100

            let arrayIndividul = []
            arrayIndividul.push(individualElement)
            setSuggestingGroupTableContent(prevState => { return [...prevState, ...arrayIndividul] })
        }
    }, [personInfo]);





    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const dispatch = useDispatch()

    const basicInformationFormStructure = [
        {
            name: "suggestionCode",
            label: "کد پیشنهاد",
            type: "text",
            col: 6,
            // required: true,
            disabled: true
        }, {
            name: "companyPartyId",
            label: "شرکت",
            type: "select",
            options: company,
            optionLabelField: "companyName",
            optionIdField: "companyPartyId",
            required: true,
            col: 6,
        }, {
            label: "تاریخ ایجاد",
            name: "suggestionCreationDate",
            type: "date",
            col: 6,
            readOnly: true,
        }, {
            name: "suggestionScopeEnumId",
            label: "حوزه پیشنهاد",
            type: "select",
            options: suggestionScopeEnumID,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 6,
        }, {
            name: "communicationEventId",
            label: " اعلانات پیشنهاد",
            type: "select",
            options: communicationEventId,
            optionLabelField: "subject",
            optionIdField: "communicationEventId",
            col: 6,
        }, {
            name: "performanceEnumId",
            label: "نحوه اجرا پیشنهاد",
            type: "select",
            options: performanceEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 6,
        }, {
            name: "suggestionImpactEnumId",
            label: "تاثیر حاصل پیشنهاد",
            type: "select",
            options: suggestionImpactEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 6,
        }, {
            name: "suggestionOriginEnumId",
            label: "منشا پیشنهاد",
            type: "select",
            options: suggestionOriginEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 6,
        }, {
            name: "suggestionType",
            label: "نوع پیشنهاد",
            type: "select",
            options: suggestionType,
            optionLabelField: "title",
            optionIdField: "id",
            col: 6
        }, {
            name: "rewardPreference",
            label: "ترجیح در نحوه دریافت پاداش",
            type: "select",
            options: rewardPreference,
            optionLabelField: "title",
            optionIdField: "id",
            col: 6
        }
        , basicInformationFormValues?.rewardPreference === "N" ? {
            name: "nonOccationalGift",
            label: "    انواع پاداش غیرنقدی",
            type: "multiselect",
            options: nonOccationalGift,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 12
        } : {
            name: "empty",
            label: "",
            type: "text",
            disabled: true,
            style: { visibility: "hidden" },
            col: 12
        },
    ]


    const [formValuseDiscriptionStructure, setFormValuseDiscriptionStructure] = useState(formVariables?.Suggestion?.value ? formVariables?.Suggestion?.value : [])
    const discriptionStructure = [
        {
            name: "suggestionTitle",
            label: "عنوان پیشنهاد",
            type: "text",
            col: 6,
            required: true,
        },
        // {
        //     name: "relation",
        //     label: "ارتباط پیشنهاد با اهداف استراتژیک شرکت",
        //     type: "select",
        //     // options : parent,
        //     // optionLabelField :"workEffortName",
        //     // optionIdField:"workEffortId",
        //     col: 6,
        // }


        , {
            name: "suggestionDescription",
            label: "شرح پیشنهاد",
            type: "textarea",
            col: 6
        }
        , {
            name: "currentMethodProblems",
            label: " مشکلات روش فعلی",
            type: "textarea",
            col: 6
        }
        , {
            name: "suggestedMethod",
            label: "  روش پیشنهادی",
            type: "textarea",
            col: 6,
            required: true,

        }

        , {
            name: "suggestedMethodAdvantages",
            label: "  مزایای روش پیشنهادی",
            type: "textarea",
            col: 6
        }
        , {
            name: "requieredResources",
            label: "    امکانات و منابع مورد نیاز",
            type: "textarea",
            col: 6
        },
        {
            name: "description",
            label: "سایر توضیحات",
            type: "textarea",
            col: 6,
        },

        , {
            type: "component",
            component: <Attachments location={location} setLocation={setLocation} formVariables={formVariables} tableContent={tableContent} setTableContent={setTableContent} />,
            col: 6
        },
        , {
            type: "group",
            items: [{
                name: "estimatedExecutionCost",
                label: "برآورد تقریبی هزینه اجرا",
                type: "number",
            }, {
                type: "text",
                label: "ریال",
                disabled: true,
                disableClearable: true,
                style: { width: "30%" }
            }],
            col: 6
        }, {
            type: "group",
            items: [{
                name: "estimatedAnnualSaving",
                label: "برآورد صرفه جویی سالیانه",
                type: "number",
            }, {
                type: "text",
                label: "ریال",
                disabled: true,
                disableClearable: true,
                style: { width: "30%" }
            }],
            col: 6
        }
    ]

    const handleSubmit = (type) => {
        type = "false"
        if (suggestingGroupTableContent.length > 0) {
            const listTableContent = [...suggestingGroupTableContent];
            let indexM = listTableContent.findIndex(ele => ele.mainMember === "Y")
            listTableContent[indexM].rewardPreference = basicInformationFormValues.rewardPreference
            listTableContent[indexM].nonOccationalGift = basicInformationFormValues.nonOccationalGift ? basicInformationFormValues.nonOccationalGift : "[]"
            setSuggestingGroupTableContent(listTableContent)
        }

        let data = {

            Suggestion: {
                'api_key': localStorage.getItem('api_key'),
                suggestionCode: basicInformationFormValues.suggestionCode,
                companyPartyId: basicInformationFormValues.companyPartyId,
                suggestionCreationDate: basicInformationFormValues.suggestionCreationDate,
                suggestionScopeEnumId: basicInformationFormValues.suggestionScopeEnumId,
                communicationEventId: basicInformationFormValues.communicationEventId,
                performanceEnumId: basicInformationFormValues.performanceEnumId,
                suggestionImpactEnumId: basicInformationFormValues.suggestionImpactEnumId,
                suggestionOriginEnumId: basicInformationFormValues.suggestionOriginEnumId,
                suggestionType: basicInformationFormValues.suggestionType,
                rewardPreference: basicInformationFormValues.rewardPreference,
                nonOccationalGift: basicInformationFormValues.nonOccationalGift ? basicInformationFormValues.nonOccationalGift : "[]",
                suggestionTitle: formValuseDiscriptionStructure.suggestionTitle,
                suggestionDescription: formValuseDiscriptionStructure.suggestionDescription,
                currentMethodProblems: formValuseDiscriptionStructure.currentMethodProblems,
                suggestedMethod: formValuseDiscriptionStructure.suggestedMethod,
                suggestedMethodAdvantages: formValuseDiscriptionStructure.suggestedMethodAdvantages,
                requieredResources: formValuseDiscriptionStructure.requieredResources,
                description: formValuseDiscriptionStructure.description,
                estimatedExecutionCost: formValuseDiscriptionStructure.estimatedExecutionCost,
                estimatedAnnualSaving: formValuseDiscriptionStructure.estimatedAnnualSaving,
                suggestionPresentationType: suggestingGroupTableContent.length > 1 ? "Y" : "N"



            },
            SuggestionKeyWords: keyWordTableContent,

            SuggestionParticipant: suggestingGroupTableContent,
            SuggestionContent: location,

            Recommender: personInfo,
            groupList: suggestingGroupTableContent,
            // suggestionSystemCler: suggestionSystemCler[0]
            suggestionSystemCler: "ssc/" + basicInformationFormValues.companyPartyId,
            processType: "Suggestion",
            continue: type





        }
        submitCallback(data)
        setBasicInformationFormValues([])
        setKeyWordTableContent([])
        setFormValuseDiscriptionStructure([])
        setSuggestingGroupTableContent([])
        setTableContent([])
        setHandleCheckBox({ individual: true, group: false })
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
                setCompany(res.data.data.companies)
            })
            .catch(() => {
                dispatch(
                    setAlertContent(
                        ALERT_TYPES.WARNING,
                        "مشکلی در دریافت اطلاعات رخ داده است."
                    )
                );
            });
    }

    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=PerformanceType", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setPerformanceEnumId(res.data.result)

        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionImpact", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionImpactEnumId(res.data.result)

        }).catch(err => {
        });
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionOrigin", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionOriginEnumId(res.data.result)

        }).catch(err => {
        });
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionScope", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionScopeEnumID(res.data.result)

        }).catch(err => {
        });
        axios.get(SERVER_URL + "/rest/s1/Suggestion/userCpSuggestion", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionInvitationId(res.data.data)

        }).catch(err => {
        });
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=NonOccationalGift", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setNonOccationalGift(res.data.result)

        }).catch(err => {
        });


    }



    useEffect(() => {
        getEnum();
        getOrgInfo();
        if (!formVariables) {
            let moment = require('moment-jalaali')
            const formDefaultValues = {
                suggestionCreationDate: moment().format("Y-MM-DD"),
            }
            setBasicInformationFormValues(formDefaultValues)
        }
    }, []);






    const addGroup = () => {
        let add = 0

        suggestingGroupTableContent.map((item, i) => {
            if (item.partyRelationshipId === groupInformationFormValues.partyRelationshipId)
                add = add + 1

        })
        const listTableContentE = [...suggestingGroupTableContent];
        let oldItem = listTableContentE.filter(item => item.mainMember !== "Y")
        var index = suggestingGroupTableContent.findIndex(item => item.mainMember === "Y");

        let individualElement = {}
        individualElement.mainMember = "Y"
        individualElement.partyRelationshipId = personInfo[0].partyRelationshipId
        individualElement.emplPositionId = personInfo[0].empPosition
        individualElement.organizationUnit = personInfo[0].orgId
        individualElement.participationRate = parseInt(suggestingGroupTableContent[index]?.participationRate) - parseInt(groupInformationFormValues?.participationRate)
        groupInformationFormValues.mainMember = "N"
        let array = []

        array.push(individualElement)
        array.push(groupInformationFormValues)

        if (individualElement.participationRate >= 1 && add == 0) {
            setSuggestingGroupTableContent(oldItem)
            setSuggestingGroupTableContent(prevState => { return [...prevState, ...array] })
            setgroupInformationFormValues([])


        }
        if (add > 0) {
            dispatch(
                setAlertContent(
                    ALERT_TYPES.WARNING,
                    "فرد مورد نضر تکراری است"
                )
            );
        }

        if (add > 0 && individualElement.participationRate < 1) {
            dispatch(
                setAlertContent(
                    ALERT_TYPES.WARNING,
                    "جمع اعداد وارد شده باید کوچکتر از 100 باشد و فرد مورد نظر تکراری است  "
                )
            );
        }
        if (individualElement.participationRate < 1) {
            dispatch(
                setAlertContent(
                    ALERT_TYPES.WARNING,
                    "جمع اعداد وارد شده باید کمتر از 100 باشد"
                )
            );
        }



    }


    const handle_submit = () => {
    }
    const handle_submit1 = () => {
    }

    const handleReject = () => {
        if (formVariables) {

            let data = {
                continue: "reject",
                suggestionSystemCler: "ssc/" + basicInformationFormValues.companyPartyId,
            }
            submitCallback(data)
        }
        else {

            setBasicInformationFormValues([])
            setKeyWordTableContent([])
            setFormValuseDiscriptionStructure([])
            setSuggestingGroupTableContent([])
            setTableContent([])
            setHandleCheckBox({ individual: true, group: false })
        }
    }


    return (
        <Card>
            <CardContent>

                <Card>
                    <Grid container spacing={2}>

                        <Grid
                            container
                            direction="row"
                            justify="space-between">
                            <Grid items md={6} xs={6} container
                                direction="column"
                                alignItems="center"
                                justify="center">

                                <Box style={{ margin: 5, padding: 10 }}>
                                    <CardHeader title="اطلاعات اولیه پیشنهاد " />

                                    <FormPro
                                        prepend={basicInformationFormStructure}
                                        formValidation={basicFormValidation}
                                        setFormValidation={setBasicFormValidation}
                                        formValues={basicInformationFormValues}
                                        setFormValues={setBasicInformationFormValues}
                                        actionBox={<ActionBox style={{ display: "none" }}>
                                            <Button ref={myElement1} type="submit" role="primary">ثبت</Button>
                                            {/* <Button type="reset" role="secondary">لغو</Button> */}
                                        </ActionBox>}
                                        submitCallback={handle_submit}

                                    />
                                </Box>

                            </Grid>
                            <Grid items md={6} xs={6} container
                                direction="column"
                                alignItems="center"
                                justify="center">
                                <Box>
                                    <KeyWord setKeyWordTableContent={setKeyWordTableContent} keyWordTableContent={keyWordTableContent} />
                                </Box>
                            </Grid>



                        </Grid>
                    </Grid>
                    <Box>
                        {checkPermis("suggestions/definitionSuggestion/suggestionPresentationType", datas) ? <TitleComponent /> : ""}
                        <Box>

                            <HandleCheckBox handleCheckBox={handleCheckBox} setHandleCheckBox={setHandleCheckBox} organizationUnit={organizationUnit}
                                userPartyId={userPartyId} personInfo={personInfo}
                                addGroup={addGroup} groupInformationFormValues={groupInformationFormValues}
                                setgroupInformationFormValues={setgroupInformationFormValues}
                                company={company} setCompany={setCompany} sumPercent={sumPercent}
                                setSumPercent={setSumPercent} formVarible={formVariables}
                                setSuggestingGroupTableContent={setSuggestingGroupTableContent}
                                suggestingGroupTableContent={suggestingGroupTableContent} />
                        </Box>
                    </Box>


                </Card>

                <Card>
                    <CardContent>
                        <CardHeader title="تشریح پیشنهاد" />
                        <FormPro
                            prepend={discriptionStructure}
                            formValidation={discriptionFormValidation} setFormValidation={setDiscriptionFormValidation}
                            formValues={formValuseDiscriptionStructure}
                            setFormValues={setFormValuseDiscriptionStructure}
                            actionBox={<ActionBox style={{ display: "none" }}>
                                <Button ref={myElement} type="submit" role="primary">ثبت</Button>
                                {/* <Button type="reset" role="secondary">لغو</Button> */}
                            </ActionBox>}
                            submitCallback={handle_submit1}
                        />
                    </CardContent>
                </Card>
                <ActionBox>
                    <Button type="button" onClick={() => startCamunda()} role="primary">ثبت پیشنهاد</Button>
                    {!formVariables ? <Button type="button" onClick={() => handleSubmit()} role="secondary"> پیش نویس</Button> : ""}
                    <Button type="button" onClick={handleReject} role="secondary">{!formVariables ? "لغو" : "انصراف"} </Button>
                </ActionBox>
            </CardContent>
        </Card>
    )

}


function TitleComponent() {
    return (
        <Typography variant="h6" style={{ padding: '14px 8px 0px 8px' }}>نحوه ارائه پیشنهاد</Typography>
    )
}


function KeyWord(props) {
    const { setKeyWordTableContent, keyWordTableContent } = props
    const [keyWordLoading, setKeyWordLoading] = useState(false);

    const keyWordTableCols = [
        { name: "description", label: "کلید واژه", type: "text" },
    ]



    const handleAdd = (formData) => {
        let add = 0
        keyWordTableContent.map((item, i) => {
            if (item.description === formData.description)
                add = add + 1

        })

        return new Promise((resolve, reject) => {
            setKeyWordLoading(true)
            let array = []
            array.push(formData)
            if (add === 0)
                setKeyWordTableContent(prevState => { return [...prevState, ...array] })
            setKeyWordLoading(false)

        })
    }


    const handleEdit = (newData, oldData) => {
        return new Promise((resolve, reject) => {
            const listTableContentE = [...keyWordTableContent];
            let fList = listTableContentE.findIndex(ele => ele === oldData)
            let reduser = listTableContentE.splice(fList, 1)
            setKeyWordTableContent(listTableContentE)
            let array = []
            array.push(newData)
            setKeyWordTableContent(prevState => { return [...prevState, ...array] })

        })

    }


    const handleRemove = (row) => {

        return new Promise((resolve, reject) => {


            const listTableContent = [...keyWordTableContent];
            let fList = listTableContent.findIndex(ele => ele.description === row.description)
            let reduser = listTableContent.splice(fList, 1)
            setKeyWordTableContent(listTableContent)


        })

    }

    return (
        <TablePro
            title="کلید واژه پیشنهاد"
            columns={keyWordTableCols}
            rows={keyWordTableContent}
            setRows={setKeyWordTableContent}
            loading={keyWordLoading}
            add="inline"
            addCallback={handleAdd}
            // edit="inline"
            // editCallback={handleEdit}
            removeCallback={handleRemove}
        />
    )
}


function HandleCheckBox(props) {
    const datas = useSelector(({ fadak }) => fadak);

    const { personInfo, userPartyId, formVarible, sumPercent, setSumPercent, company, setCompany, groupInformationFormValues, setgroupInformationFormValues, handleCheckBox, setHandleCheckBox, organizationUnit, setSuggestingGroupTableContent, suggestingGroupTableContent, addGroup } = props


    const checkBoxStructure = checkPermis("suggestions/definitionSuggestion/suggestionPresentationType", datas) ? [
        {
            name: "individual",
            label: "فردی",
            type: "check",
            col: 3,
        },
        {
            name: "group",
            label: "گروهی",
            type: "check",
            col: 3,
        },
        handleCheckBox?.group ? {
            type: "component",
            component: <SuggestingGroup personInfo={personInfo} setCompany={setCompany} company={company} setSuggestingGroupTableContent={setSuggestingGroupTableContent} suggestingGroupTableContent={suggestingGroupTableContent}
                sumPercent={sumPercent} setSumPercent={setSumPercent} userPartyId={userPartyId}
                organizationUnit={organizationUnit} formVarible={formVarible}
                addGroup={addGroup} groupInformationFormValues={groupInformationFormValues} setgroupInformationFormValues={setgroupInformationFormValues} />,
            col: 12
        } : {
            type: "component",
            component: <div />,
            col: 12
        }
    ] : []

    useEffect(() => {
        if (handleCheckBox?.individual) {
            handleCheckBox.individual = true
            handleCheckBox.group = false
            setHandleCheckBox(Object.assign({}, handleCheckBox))
        }
    }, [handleCheckBox?.individual])

    useEffect(() => {
        if (handleCheckBox?.group) {
            handleCheckBox.individual = false
            handleCheckBox.group = true
            setHandleCheckBox(Object.assign({}, handleCheckBox))
        }
    }, [handleCheckBox?.group])

    return (
        <FormPro
            prepend={checkBoxStructure}
            formValues={handleCheckBox}
            setFormValues={setHandleCheckBox}
        />
    )
}

function SuggestingGroup(props) {
    const { personInfo, formVarible, userPartyId, organizationUnit, setSuggestingGroupTableContent, suggestingGroupTableContent, addGroup, groupInformationFormValues, setgroupInformationFormValues } = props
    const dispatch = useDispatch()
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [rewardPreference, setrewardPreference] = useState([{ id: "Y", title: "نقدی" }, { id: "N", title: "غیر نقدی" }])
    const [formSuggestingValidation, setuggestingFormValidation] = useState()
    const [nonOccationalGift, setNonOccationalGift] = useState([])
    const [loading, setLoding] = useState(true)
    const datas = useSelector(({ fadak }) => fadak);

    useEffect(() => {


        if (organizationUnit?.employees?.length > 0)
            setLoding(false)


    }, [organizationUnit])

    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=NonOccationalGift", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setNonOccationalGift(res.data.result)
        }).catch(err => {
        });
        setgroupInformationFormValues(prevState => ({
            ...prevState,
            company: organizationUnit.subOrgans?.filter(item => item.companyPartyId == personInfo[0].companyPartyId)[0].companyPartyId


        }))


    }, [])

    useEffect(() => {
        if (formVarible) {
            setSuggestingGroupTableContent(formVarible?.SuggestionParticipant?.value ? formVarible?.SuggestionParticipant?.value : [])

        }

    }, [formVarible?.SuggestionParticipant?.value])


    const suggestingTableCols = [
        {
            name: "company",
            label: "شرکت",
            type: "select",
            options: organizationUnit.subOrgans,
            optionLabelField: "companyName",
            optionIdField: "companyPartyId",
            col: 6,
        }, {
            name: "partyRelationshipId",
            label: "پرسنل",
            type: "select",
            options: organizationUnit.employees
                ? organizationUnit.employees.filter((a) => a.name)
                : [],
            optionLabelField: "name",
            optionIdField: "partyRelationshipId",
        }, {
            name: "organizationUnit",
            label: "واحد سازمانی",
            type: "select",
            options: organizationUnit.units,
            optionLabelField: "unitOrganizationName",
            optionIdField: "unitPartyId",

        }, {
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "select",
            options: organizationUnit.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
        }, {
            name: "participationRate",
            label: "درصد مشارکت",
            type: "number",
        }, {
            name: "rewardPreference",
            label: "ترجیح در نحوه دریافت پاداش",
            type: "select",
            options: rewardPreference,
            optionLabelField: "title",
            optionIdField: "id",
        },
        {
            name: "nonOccationalGift",
            label: "    انواع پاداش غیرنقدی",
            type: "multiselect",
            options: nonOccationalGift,
            optionLabelField: "description",
            optionIdField: "enumId",
        },
        {
            name: "mainMember",
            label: " نفر اصلی ",
            type: "text",

        },

    ]
    // useEffect(() => {
    //     if (groupInformationFormValues.emplPositionId !== undefined && groupInformationFormValues.emplPositionId !== null) {
    //         setgroupInformationFormValues(prevState => ({
    //             ...prevState,
    //             companyPartyID: organizationUnit?.positions?.find(item => item?.emplPositionId === groupInformationFormValues["emplPositionId"])?.companyPartyId,
    //             organizationUnit: organizationUnit.positions?.find(item => item?.emplPositionId === groupInformationFormValues["emplPositionId"]).unitPartyId,

    //         }))
    //     }
    // }, [groupInformationFormValues.emplPositionId])
    const suggestingGroupStructure = [
        {
            name: "company",
            label: "شرکت",
            type: "select",
            options: checkPermis("suggestions/definitionSuggestion/suggestionPresentationType/company", datas) ? organizationUnit.subOrgans : organizationUnit.subOrgans?.filter(item => item.companyPartyId == personInfo[0].companyPartyId),
            optionLabelField: "companyName",
            optionIdField: "companyPartyId",
            col: 4,

            filterOptions: options =>

                groupInformationFormValues["organizationUnit"] ? options.filter((o) => {
                    let list = organizationUnit.units.find(x => x.unitPartyId == groupInformationFormValues["organizationUnit"])


                    return list.companyPartyId.indexOf(o["companyPartyId"]) >= 0
                }) : options

        },
        {
            name: "organizationUnit",
            label: "واحد سازمانی",
            type: "select",
            options: organizationUnit.units,
            optionLabelField: "unitOrganizationName",
            optionIdField: "unitPartyId",
            col: 4,


            filterOptions: options => groupInformationFormValues["company"] ? options.filter((o) => {
                let list = organizationUnit.subOrgans.find(x => x.companyPartyId == groupInformationFormValues["company"])


                // list.units.indexOf(o["units"]) >= 0
                return list?.units.indexOf(o["unitPartyId"]) >= 0
            }) : options,

        },



        {
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "select",
            options: organizationUnit.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            col: 4,


            filterOptions: options => groupInformationFormValues["organizationUnit"] ? options.filter((o) => {
                let list = organizationUnit.units.find(x => x.unitPartyId == groupInformationFormValues["organizationUnit"])


                return list.emplPosition.indexOf(o["emplPositionId"]) >= 0
            }) :

                groupInformationFormValues["company"] ? options.filter((o) => {
                    let list = organizationUnit.subOrgans.find(x => x.companyPartyId == groupInformationFormValues["company"])


                    return list?.emplPosition?.indexOf(o["emplPositionId"]) >= 0
                }) :


                    options,
            required: true,

        },
        {
            name: "partyRelationshipId",
            label: " پرسنل",
            type: "select",
            options: organizationUnit.employees
                ? organizationUnit.employees.filter((a) => a.name)
                : [],
            optionLabelField: "name",
            optionIdField: "partyRelationshipId",
            required: true,
            col: 4,

            filterOptions: options =>

                groupInformationFormValues["emplPositionId"] ? options.filter((o) => {
                    let list = organizationUnit.positions.find(x => x.emplPositionId == groupInformationFormValues["emplPositionId"])


                    return list.person.indexOf(o["fromPartyId"]) >= 0
                }) :


                    groupInformationFormValues["organizationUnit"] ? options.filter((o) => {
                        let list = organizationUnit.units.find(x => x.unitPartyId == groupInformationFormValues["organizationUnit"])


                        return list.person.indexOf(o["fromPartyId"]) >= 0
                    }) :

                        groupInformationFormValues["company"] ? options.filter((o) => {
                            let list = organizationUnit.subOrgans.find(x => x.companyPartyId == groupInformationFormValues["company"])


                            return list.person.indexOf(o["fromPartyId"]) >= 0
                        }) :


                            options,
        }

        , {
            name: "participationRate",
            label: "درصد مشارکت",
            type: "number",
            required: true,
            col: 4,
        }, {
            name: "rewardPreference",
            label: "ترجیح در نحوه دریافت پاداش",
            type: "select",
            options: rewardPreference,
            optionLabelField: "title",
            optionIdField: "id",
            col: 4,
        }
        , groupInformationFormValues.rewardPreference === "N" ? {
            name: "nonOccationalGift",
            label: "    انواع پاداش غیرنقدی",
            type: "multiselect",
            options: nonOccationalGift,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 4
        } : {
            name: "empty",
            label: "",
            type: "text",
            disabled: true,
            style: { visibility: "hidden" },
            col: 4
        },
    ]
    const handleRemove = (row) => {
        return new Promise((resolve, reject) => {
            if (row.mainMember === "Y")
                dispatch(
                    setAlertContent(
                        ALERT_TYPES.WARNING,
                        "نفر اصلی قابل حذف نمی باشد"
                    )
                );
            else {
                const listTableContent = [...suggestingGroupTableContent];
                let index = listTableContent.findIndex(ele => ele.partyRelationshipId === row.partyRelationshipId)
                let indexM = listTableContent.findIndex(ele => ele.mainMember === "Y")
                let participationRateD = listTableContent[index].participationRate
                listTableContent[indexM].participationRate = parseInt(listTableContent[indexM].participationRate) + parseInt(participationRateD)
                let reduser = listTableContent.splice(index, 1)
                setSuggestingGroupTableContent(listTableContent)
            }

        })

    }
    const resetGroup = () => {
        setgroupInformationFormValues([])
    }


    return (
        <Box>
            <Card >
                <CardContent>
                    <CardHeader style={{ justifyContent: "center", textAlign: "center", color: "gray", marginBottom: -60, }}
                        action={
                            <Tooltip title="     افزودن    ">
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
                                        prepend={suggestingGroupStructure}
                                        formValues={groupInformationFormValues}
                                        setFormValues={setgroupInformationFormValues}
                                        formValidation={formSuggestingValidation}
                                        setFormValidation={setuggestingFormValidation}
                                        submitCallback={addGroup}
                                        // resetCallback={resetGroup}
                                        actionBox={
                                            <ActionBox>
                                                <Button type="submit" role="primary">{editing ? "ویرایش" : "افزودن"}</Button>
                                                <Button onClick={resetGroup} role="secondary">لغو</Button>
                                            </ActionBox>}
                                    />
                                </CardContent>


                            </Collapse>
                        </CardContent>
                        : ""}
                </CardContent>
                <CardContent>
                    <TablePro
                        fixedLayout={false}
                        title="گروه پیشنهاد دهنده"
                        columns={suggestingTableCols}
                        rows={suggestingGroupTableContent}
                        setRows={setSuggestingGroupTableContent}
                        // loading={suggestingGroupLoading}
                        // edit={"callback"}
                        removeCallback={handleRemove}
                        // removeCallback={handleRemove}

                        // addCallback={handleAdd}
                        // edit="inline"
                        // editCallback={handleEdit}
                        // removeCallback={handleRemoveResidence}
                        loading={loading}
                    />
                </CardContent>
            </Card>
        </Box>
    )
}







function Attachments(props) {
    const { location, setLocation, formVariables, tableContent, setTableContent } = props

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

    useEffect(() => {
        let tableData = []
        if (formVariables?.SuggestionContent?.value.length > 0) {
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

    }, [formVariables?.SuggestionContent?.value])


    const handleCreate = (formData) => {
        return new Promise((resolve, reject) => {
            const attachFile = new FormData();
            attachFile.append("file", formValues?.contentLocation);

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
                            locatinElement.location = item.name
                            locatinElement.contentTypeEnumId = "SuggestionPresentation"
                            locatinData.push(locatinElement)
                            setLocation(prevState => { return [...prevState, ...locatinData] })

                            tableData.push(data)
                            // if (index == contentLocation.length - 1) {
                            setTimeout(() => {
                                setTableContent(prevState => { return [...prevState, ...tableData] })
                                setFormValues(prevState => ({
                                    ...prevState,
                                    contentLocation: ""
                                }))
                                setLoading(false)
                                setExpanded(false)
                            }, 50)
                            // }
                        })
                    }
                    if (contentLocation.length == 0) {
                        setTableContent(tableData)
                        setLoading(false)
                        setFormValues(prevState => ({
                            ...prevState,
                            contentLocation: ""
                        }))

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
                        <Tooltip title="     پیوست    ">
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

export default DefineSuggestForm;
