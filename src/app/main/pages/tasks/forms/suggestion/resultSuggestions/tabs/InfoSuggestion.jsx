import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { CardContent, CardHeader, Grid, Typography, Dialog } from "@material-ui/core";
import { SERVER_URL, AXIOS_TIMEOUT } from 'configs';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import { useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';




const InfoSuggestion = (props) => {
    const {opendialog, setOpenDialog, tableContent, setTableContent, formValuseDiscriptionStructure, setFormValuseDiscriptionStructure, basicInformationFormValues, setBasicInformationFormValues, keyWordTableContent, setKeyWordTableContent, handleCheckBox, setHandleCheckBox, suggestingGroupTableContent, setSuggestingGroupTableContent } = props
    const [suggestingGroupLoading, setSuggestingGroupLoading] = useState(true);

    const [performanceEnumId, setPerformanceEnumId] = useState([])
    const [suggestionImpactEnumId, setSuggestionImpactEnumId] = useState([])
    const [suggestionOriginEnumId, setSuggestionOriginEnumId] = useState([])
    const [suggestionScopeEnumID, setSuggestionScopeEnumID] = useState([])
    const [suggestionType, setSuggestionType] = useState([{ id: "Y", title: "کمی" }, { id: "N", title: "کیفی" }])
    const [rewardPreference, setrewardPreference] = useState([{ id: "Y", title: "نقدی" }, { id: "N", title: "غیر نقدی" }])
    const [communicationEventId, setSuggestionInvitationId] = useState([]);
    const [nonOccationalGift, setNonOccationalGift] = useState([]);

    const [organizationUnit, setOrganizationUnit] = useState([]);


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
            readOnly: true

        }, {
            name: "companyPartyId",
            label: "شرکت",
            type: "select",
            options: organizationUnit.subOrgans,
            optionLabelField: "companyName",
            optionIdField: "companyPartyId",
            col: 6,
            readOnly: true,

        }, {
            label: "تاریخ ایجاد",
            name: "suggestionCreationDate",
            type: "date",
            col: 6,
            readOnly: true

        }, {
            name: "suggestionScopeEnumId",
            label: "حوزه پیشنهاد",
            type: "select",
            options: suggestionScopeEnumID,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 6,
            readOnly: true


        }, {
            name: "communicationEventId",
            label: " اعلانات پیشنهاد",
            type: "select",
            options: communicationEventId,
            optionLabelField: "subject",
            optionIdField: "communicationEventId",
            col: 6,
            readOnly: true

        }, {
            name: "performanceEnumId",
            label: "نحوه اجرا پیشنهاد",
            type: "select",
            options: performanceEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 6,
            readOnly: true

        }, {
            name: "suggestionImpactEnumId",
            label: "تاثیر حاصل پیشنهاد",
            type: "select",
            options: suggestionImpactEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 6,
            readOnly: true

        }, {
            name: "suggestionOriginEnumId",
            label: "منشا پیشنهاد",
            type: "select",
            options: suggestionOriginEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 6,
            readOnly: true

        }, {
            name: "suggestionType",
            label: "نوع پیشنهاد",
            type: "select",
            options: suggestionType,
            optionLabelField: "title",
            optionIdField: "id",
            col: 6,
            readOnly: true

        }, {
            name: "rewardPreference",
            label: "ترجیح در نحوه دریافت پاداش",
            type: "select",
            options: rewardPreference,
            optionLabelField: "title",
            optionIdField: "id",
            col: 6,
            readOnly: true

        }
        , basicInformationFormValues.rewardPreference === "N" ? {
            name: "nonOccationalGift",
            label: "    انواع پاداش غیرنقدی",
            type: "multiselect",
            options: nonOccationalGift,
            optionLabelField: "description",
            optionIdField: "enumId",
            readOnly: true,
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


    const discriptionStructure = [
        {
            name: "suggestionTitle",
            label: "عنوان پیشنهاد",
            type: "text",
            col: 6,
            readOnly: true

        },

        , {
            name: "suggestionDescription",
            label: "شرح پیشنهاد",
            type: "textarea",
            col: 6,
            readOnly: true

        }
        , {
            name: "currentMethodProblems",
            label: " مشکلات روش فعلی",
            type: "textarea",
            col: 6,
            readOnly: true

        }
        , {
            name: "suggestedMethod",
            label: "  روش پیشنهادی",
            type: "textarea",
            col: 6,
            readOnly: true


        }

        , {
            name: "suggestedMethodAdvantages",
            label: "  مزایای روش پیشنهادی",
            type: "textarea",
            col: 6,
            readOnly: true

        }
        , {
            name: "requieredResources",
            label: "    امکانات و منابع مورد نیاز",
            type: "textarea",
            col: 6,
            readOnly: true

        },
        {
            name: "description",
            label: "سایر توضیحات",
            type: "textarea",
            col: 6,
            readOnly: true

        },

        , {
            type: "component",
            component: <Attachments tableContent={tableContent} setTableContent={setTableContent} />,
            col: 6,
            readOnly: true

        },
        , {
            type: "group",
            items: [{
                name: "estimatedExecutionCost",
                label: "برآورد تقریبی هزینه اجرا",
                type: "number",
                readOnly: true

            }, {
                type: "text",
                label: "ریال",
                disableClearable: true,
                style: { width: "30%" },
                readOnly: true,
            }],
            col: 6
        }, {
            type: "group",
            items: [{
                name: "estimatedAnnualSaving",
                label: "برآورد صرفه جویی سالیانه",
                type: "number",
                readOnly: true

            }, {
                type: "text",
                label: "ریال",
                disableClearable: true,
                style: { width: "30%" },
                readOnly: true,
            }],
            col: 6
        }
    ]





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
                setSuggestingGroupLoading(false)

            })
            .catch(() => {
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

    }, []);

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
                                        formValues={basicInformationFormValues}
                                        setFormValues={setBasicInformationFormValues}
                                    />
                                </Box>

                            </Grid>
                            <Grid items md={6} xs={6} container
                                direction="column"
                                alignItems="center"
                                justify="center">
                                <Box style={{ margin: 5 }}>

                                    <KeyWord keyWordTableContent={keyWordTableContent} setKeyWordTableContent={setKeyWordTableContent} />
                                </Box>
                            </Grid>



                        </Grid>
                    </Grid>
                    <Box>
                        <TitleComponent />
                        <Box>
                            <HandleCheckBox handleCheckBox={handleCheckBox} setHandleCheckBox={setHandleCheckBox} 
                            organizationUnit={organizationUnit} suggestingGroupLoading={suggestingGroupLoading} nonOccationalGift={nonOccationalGift}
                                setSuggestingGroupTableContent={setSuggestingGroupTableContent} suggestingGroupTableContent={suggestingGroupTableContent} />
                        </Box>
                    </Box>


                </Card>

                <Card>
                    <CardContent>
                        <CardHeader title="تشریح پیشنهاد" />
                        <FormPro
                            prepend={discriptionStructure}
                            formValues={formValuseDiscriptionStructure}
                            setFormValues={setFormValuseDiscriptionStructure}
                        />
                    </CardContent>
                </Card>

            </CardContent>
            {/* <Dialog open={opendialog} PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    width: 100,
                    height: 100,
                    borderWidth: 0
                },
            }} >
                <CircularProgress />
            </Dialog> */}
        </Card>
    )

}


function TitleComponent() {
    return (
        <Typography variant="h6" style={{ padding: '14px 8px 0px 8px' }}>نحوه ارائه پیشنهاد</Typography>
    )
}


function KeyWord(props) {
    const { keyWordTableContent, setKeyWordTableContent } = props

    const [keyWordLoading, setKeyWordLoading] = useState(false);

    const keyWordTableCols = [
        { name: "description", label: "کلید واژه", type: "text" },
    ]



    const handleAdd = (formData) => {

        return new Promise((resolve, reject) => {
            setKeyWordLoading(true)
            let array = []
            array.push(formData)
            setKeyWordTableContent(prevState => { return [...prevState, ...array] })
            setKeyWordLoading(false)

        })
    }


    const handleEdit = (row) => {


        return new Promise((resolve, reject) => {
            setKeyWordLoading(true)


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
        />
    )
}


function HandleCheckBox(props) {


    const {nonOccationalGift, handleCheckBox, setHandleCheckBox, organizationUnit, setSuggestingGroupTableContent, suggestingGroupTableContent, suggestingGroupLoading } = props


    const checkBoxStructure = [
        {
            name: "individual",
            label: "فردی",
            type: "check",
            col: 3,
            disabled:true
        }, {
            name: "group",
            label: "گروهی",
            type: "check",
            col: 3,
            disabled:true

        }, handleCheckBox?.group ? {
            type: "component",
            component: <SuggestingGroup setSuggestingGroupTableContent={setSuggestingGroupTableContent} suggestingGroupTableContent={suggestingGroupTableContent}
                organizationUnit={organizationUnit} suggestingGroupLoading={suggestingGroupLoading} nonOccationalGift={nonOccationalGift} />,
            col: 12
        } : {
            type: "component",
            component: <div />,
            col: 12
        }
    ]

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
    const {nonOccationalGift, organizationUnit, setSuggestingGroupTableContent, suggestingGroupTableContent, suggestingGroupLoading } = props
    const [rewardPreference, setrewardPreference] = useState([{ id: "Y", title: "نقدی" }, { id: "N", title: "غیر نقدی" }])


    const suggestingTableCols = [
        {
            name: "company",
            label: "شرکت",
            type: "select",
            options: organizationUnit.subOrgans,
            optionLabelField: "companyName",
            optionIdField: "companyPartyId",
        }, {
            name: "partyRelationshipId",
            label: " پرسنل",
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
        }
       
    ]
    return (
        <Box>


            <Card >
                <CardContent>
                    <TablePro
                        fixedLayout={false}
                        title="گروه پیشنهاد دهنده"
                        columns={suggestingTableCols}
                        rows={suggestingGroupTableContent}
                        setRows={setSuggestingGroupTableContent}
                        loading={suggestingGroupLoading}
                    />
                </CardContent>

            </Card>



        </Box>
    )
}







function Attachments(props) {
    const { tableContent, setTableContent } = props
    const [loading, setLoading] = useState(true)
    const [formValues, setFormValues] = useState([])


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

export default InfoSuggestion;
