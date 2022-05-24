import React, { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, Grid, Typography, Collapse } from "@material-ui/core";
import { SERVER_URL, AXIOS_TIMEOUT } from 'configs';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import { useDispatch } from 'react-redux';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';



const DefineSuggestForm = (props) => {
const {tableContent, setTableContent,formValuseDiscriptionStructure, setFormValuseDiscriptionStructure,basicInformationFormValues,setBasicInformationFormValues,keyWordTableContent, setKeyWordTableContent,handleCheckBox, setHandleCheckBox,suggestingGroupTableContent, setSuggestingGroupTableContent}=props
const [suggestingGroupLoading, setSuggestingGroupLoading] = useState(true);

    const [performanceEnumId, setPerformanceEnumId] = useState([])
    const [suggestionImpactEnumId, setSuggestionImpactEnumId] = useState([])
    const [suggestionOriginEnumId, setSuggestionOriginEnumId] = useState([])
    const [suggestionScopeEnumID, setSuggestionScopeEnumID] = useState([])
    const [suggestionType, setSuggestionType] = useState([{ id: "Y", title: "کمی" }, { id: "N", title: "کیفی" }])
    const [rewardPerferance, setRewardPerferance] = useState([{ id: "Y", title: "نقدی" }, { id: "N", title: "غیر نقدی" }])


    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [processDefinitionId, setProcessDefinitionId] = React.useState('');
    const [state, setState] = React.useState('Default');

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
        }, {
            name: "companyPartyID",
            label: "شرکت",
            type: "select",
            options: organizationUnit.subOrgans,
            optionLabelField: "organizationName",
            optionIdField: "partyId",
            col: 6,
        }, {
            label: "تاریخ ایجاد",
            name: "suggestionCreationDate",
            type: "date",
            col: 6,
        }, {
            name: "suggestionScopeEnumID",
            label: "حوزه پیشنهاد",
            type: "select",
            options : suggestionScopeEnumID,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 6,
        }, {
            name: "suggestionInvitationId",
            label: "کد فراخوان",
            type: "text",
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
            name    : "rewardPerferance",
            label   : "ترجیح در نحوه دریافت پاداش",
            type    : "select",
            options : rewardPerferance,
            optionLabelField :"title",
            optionIdField:"id",
            col: 6
        }
    ]


    const discriptionStructure = [
        {
            name: "suggestionTitle",
            label: "عنوان پیشنهاد",
            type: "text",
            col: 6,
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
            component: <Attachments  tableContent={tableContent} setTableContent={setTableContent}/>,
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
                disableClearable: true,
                style: { width: "30%" }
            }],
            col: 6
        }
    ]

    




    const getOrgInfo = () => {
        let listMap = ["unit", "positions", "employees", "roles"]
        axios
            .get(
                SERVER_URL + "/rest/s1/fadak/getKindOfParties?listMap=" + listMap,
                axiosKey
            )
            .then((res) => {
                const orgMap = {
                    units: res.data.contacts.unit,
                    subOrgans: res.data.contacts.orgs,
                    roles: res.data.contacts.roles,
                    positions: res.data.contacts.positions,
                    employees: res.data.contacts.employees,
                };
                setOrganizationUnit(orgMap);
                setSuggestingGroupLoading(false)
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

                                <Box>
                                    <CardHeader title="اطلاعات اولیه پیشنهاد پیشنهاد" />

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
                                <Box>

                                    <KeyWord keyWordTableContent={keyWordTableContent} setKeyWordTableContent={setKeyWordTableContent} />
                                </Box>
                            </Grid>



                        </Grid>
                    </Grid>
                    <Box>
                        <TitleComponent />
                        <Box>
                        <HandleCheckBox handleCheckBox={handleCheckBox} setHandleCheckBox={setHandleCheckBox} organizationUnit={organizationUnit} suggestingGroupLoading={suggestingGroupLoading}
                          
                                 setSuggestingGroupTableContent={setSuggestingGroupTableContent} suggestingGroupTableContent={suggestingGroupTableContent}/>
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
        </Card>
    )

}


function TitleComponent() {
    return (
        <Typography variant="h6" style={{ padding: '14px 8px 0px 8px' }}>نحوه ارائه پیشنهاد</Typography>
    )
}


function KeyWord(props) {
    const {keyWordTableContent, setKeyWordTableContent}=props

    const [keyWordLoading, setKeyWordLoading] = useState(false);

    const keyWordTableCols = [
        { name: "description", label: "کلید واژه", type: "text" },
    ]




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


    const {   handleCheckBox  ,setHandleCheckBox,organizationUnit,setSuggestingGroupTableContent, suggestingGroupTableContent,suggestingGroupLoading } = props

    // const [handleCheckBox, setHandleCheckBox] = useState({ group: false, individual: false })

    const checkBoxStructure = [
        {
            name: "individual",
            label: "فردی",
            type: "check",
            col: 3,
        }, {
            name: "group",
            label: "گروهی",
            type: "check",
            col: 3,
        }, handleCheckBox?.group ? {
            type: "component",
            component: <SuggestingGroup setSuggestingGroupTableContent={setSuggestingGroupTableContent} suggestingGroupTableContent={suggestingGroupTableContent}
             organizationUnit={organizationUnit} suggestingGroupLoading={suggestingGroupLoading} />,
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
    const {organizationUnit,setSuggestingGroupTableContent,suggestingGroupTableContent,suggestingGroupLoading}=props
    const [rewardPerferance, setRewardPerferance] = useState([{ id: "Y", title: "نقدی" }, { id: "N", title: "غیر نقدی" }])
    

        const suggestingTableCols=[
            {
                name: "company",
                label: "شرکت",
                type: "select",
                options: organizationUnit.subOrgans,
                optionLabelField: "organizationName",
                optionIdField: "partyId",
            },{
                name: "partyRelationshipId",
                label: " پرسنل",
                type: "select",
                options: organizationUnit.employees
                    ? organizationUnit.employees.filter((a) => a.name)
                    : [],
                optionLabelField: "name",
                optionIdField: "partyRelationshipId",
            },{
                name: "organizationUnit",
                label: "واحد سازمانی",
                type: "select",
                options: organizationUnit.units,
                optionLabelField: "organizationName",
                optionIdField: "partyId",
               
            },{
                name: "emplPositionId",
                label: "پست سازمانی",
                type: "select",
                options: organizationUnit.positions,
                optionLabelField: "description",
                optionIdField: "emplPositionId",
            },{
                name    : "participationRate",
                label   : "درصد مشارکت",
                type    : "number",
                col     : 3,
            },{
                name    : "rewardPreference",
                label   : "ترجیح در نحوه دریافت پاداش",
                type    : "select",
                options : rewardPerferance,
                optionLabelField :"title",
                optionIdField:"id",
                col     : 3,
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
    const {tableContent, setTableContent}=props
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

export default DefineSuggestForm;
