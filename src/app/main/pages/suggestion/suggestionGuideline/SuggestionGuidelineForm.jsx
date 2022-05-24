import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import VisibilityIcon from "@material-ui/icons/Visibility";
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { SERVER_URL } from 'configs';
import { useHistory } from 'react-router-dom';
import { getWorkEffotr } from "../../../../store/actions/fadak";
// import { CompareArrowsOutlined } from '@material-ui/icons';
import checkPermis from 'app/main/components/CheckPermision';

const SuggestionGuideline = (props) => {
    const history = useHistory();
    const scrollToRef1 = () => myRef.current.scrollIntoView()
    const [expanded, setExpanded] = useState(false);
    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = useState({});
    const [tableContent, setTableContent] = useState([]);
    const [selectTable, setSelectTable] = useState([]);
    const [loading, setLoading] = useState(true)
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [suggestionScope, setSuggestionScope] = useState([]);
    const [suggestionType, setSuggestionType] = useState([{ id: "Y", title: "کمی" }, { id: "N", title: "کیفی" }])
    const [suggestionStatus, SetSuggestionStatus] = useState([])
    const dispatch = useDispatch()
    const myRef = useRef(null)
    const datas = useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }


    const tableCols = [
        { name: "suggestionCode", label: " کد رهگیری پیشنهاد ", type: "text", style: { minWidth: "100px" , "text-align": "center"} },
        { name: "suggestionTitle", label: " عنوان پیشنهاد ", type: "text", style: { minWidth: "100px" , "text-align": "center"} },
        { name: "keywordList", label: " کلیدواژه پیشنهاد ", type: "text", style: { minWidth: "100px" , "text-align": "center"}},
        { name: "suggestionType", label: " نوع پیشنهاد ", type: "select", style: { minWidth: "100px" , "text-align": "center"}, options: suggestionType, optionLabelField: "title", optionIdField: "id"  },
        { name: "suggestionScopeEnumId", label: "  حوزه ", type: "select", style: { minWidth: "100px" , "text-align": "center"}, options: suggestionScope, optionLabelField: "description", optionIdField: "enumId", },
        { name: "suggestionStatusId", label: " وضعیت پیشنهاد ", type: "select", style: { minWidth: "100px" , "text-align": "center"}, options: suggestionStatus, optionLabelField: "description", optionIdField: "statusId" },
        { name: "companyIdList", label: " شرکت ارائه دهنده پیشنهاد ", type: "multiselect", style: { minWidth: "140px" , "text-align": "center"}, options: organizationUnit.companies, optionLabelField: "companyName", optionIdField: "companyPartyId"},
        { name: "organizationPartyIdList", label: " واحد سازمانی ", type: "multiselect", style: { minWidth: "100px" , "text-align": "center"}, options: organizationUnit.units, optionLabelField: "unitOrganizationName", optionIdField: "unitPartyId"},
        { name: "emplPositionIdList", label: " پست سازمانی ", type: "multiselect", style: { minWidth: "100px" , "text-align": "center"}, options: organizationUnit.emplPositions, optionLabelField: "description", optionIdField: "emplPositionId" },
        { name: "suggestionCreationDate", label: "  تاریخ ایجاد پیشنهاد  ", type: "date", style: { minWidth: "160px" , "text-align": "center"} },

    ]


    const formStructure = [
        {
            label: " کد رهگیری پیشنهاد ",
            name: "suggestionCode",
            type: "text",
            col: 3
        }, 
        {
            label: " عنوان پیشنهاد ",
            name: "suggestionTitle",
            type: "text",
            col: 3
        }, 
        {
            label: "  کلمه کلیدی ",
            name: "keyWord",
            type: "text",
            col: 3
    
        },
        {
            label: "  حوزه پیشنهاد ",
            name: "suggestionScopeEnumId",
            options: suggestionScope,
            optionLabelField: "description",
            optionIdField: "enumId",
            type: "select",
            col: 3
        },
        {
            label: "  وضعیت پیشنهاد ",
            name: "suggestionStatusId",
            type: "select",
            col: 3,
            options: suggestionStatus,
            optionLabelField: "description",
            optionIdField: "statusId",
    
        },
        {
            label: " شرکت ارائه دهنده پیشنهاد ",
            name: "toPartyId",
            type: "select",
            col: 3,
            options: organizationUnit.companies,
            optionLabelField: "companyName",
            optionIdField: "companyPartyId",
            filterOptions: (options) =>
                formValues["emplPositionId"]
                ? options.filter((o) => o["companyPartyId"] === organizationUnit.emplPositions.find(item => item.emplPositionId === formValues["emplPositionId"])?.companyPartyId)
                : options
            
        },
        {
            label: " واحد سازمانی ",
            name: "organizationPartyId",
            type: "select",
            col: 3,
            options: organizationUnit.units,
            optionLabelField: "unitOrganizationName",
            optionIdField: "unitPartyId",
            filterOptions: (options) =>
                formValues["toPartyId"]
                    ? options.filter((o) => o["companyPartyId"] === formValues["toPartyId"])
                    : options
        },
        {
            label: " پست سازمانی ",
            name: "emplPositionId",
            type: "select",
            col: 3,
            options: organizationUnit.emplPositions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            filterOptions: (options) =>{
                var filteredOption = formValues["toPartyId"]
                    ? options.filter((o) => organizationUnit.companies.find(item => item.companyPartyId === formValues["toPartyId"])?.emplPosition.includes(o["emplPositionId"]))
                    : options

                filteredOption = formValues["organizationPartyId"]
                    ? filteredOption.filter((o) => organizationUnit.units.find(item => item.unitPartyId === formValues["organizationPartyId"])?.emplPosition.includes(o["emplPositionId"]))
                    : filteredOption

                return filteredOption
            }
        },
        {
            label: " نوع پیشنهاد ",
            name: "suggestionType",
            type: "select",
            options: suggestionType,
            optionLabelField: "title",
            optionIdField: "id",
            col: 3
        },
        {
            label: " از تاریخ ",
            name: "creationDateStart",
            type: "date",
            col: 2
        },
        {
            label: "  تا تاریخ ",
            name: "creationDateEnd",
            type: "date",
            col: 2
        }
    ]

    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionScope", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionScope(res.data.result)

        }).catch(err => {
        });
    }


    const getSuggestionList = (filterParam) => {

        axios.get(SERVER_URL + "/rest/s1/Suggestion/suggestionsInfoList", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: filterParam
        }).then(res => {
            setTableContent(res.data.suggestionsInfo)
            setLoading(false)
        }).catch(err => {
        });

    }

    const getSuggestionStatus = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=SuggestionStatus", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            SetSuggestionStatus(res.data.status)
        }).catch(err => {
        });
    }

    useEffect(() => {
        if(formValues.organizationPartyId !== undefined && formValues.organizationPartyId !== null){
            setFormValues(prevState => ({
                ...prevState,
                toPartyId: organizationUnit.units.find(item => item.unitPartyId === formValues["organizationPartyId"])?.companyPartyId,
            }) )
        }
    }, [formValues.organizationPartyId])

    useEffect(() => {
        if(formValues.emplPositionId !== undefined && formValues.emplPositionId !== null){
            setFormValues(prevState => ({
                ...prevState,
                toPartyId: organizationUnit.emplPositions.find(item => item.emplPositionId === formValues["emplPositionId"])?.companyPartyId,
                organizationPartyId: organizationUnit.emplPositions.find(item => item.emplPositionId === formValues["emplPositionId"])?.unitPartyId,
            }) )
        }
    }, [formValues.emplPositionId])

  

    useEffect(() => {
        getEnum();
        getOrgInfo();
        getSuggestionStatus();
    }, []);


    const getOrgInfo = () => {
        axios
            .get(
                SERVER_URL + "/rest/s1/fadak/allCompaniesFilter",
                axiosKey
            )
            .then((res) => {
                setOrganizationUnit(res.data.data);
                getSuggestionList({})
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


    const submitFilter = () => {
        getSuggestionList(formValues)
    }



    const handleReset = () => {
        setFormValues([])
    }

    return (
        <Box>
            <Card style={{padding:"1vw"}}>
                <Card>
                    <CardContent>
                        <CardHeader style={{ justifyContent: "center", textAlign: "center", color: "gray", marginBottom: -40, }}
                                action={
                                    <Tooltip title="    فیلتر پیشنهادات    ">
                                        <ToggleButton
                                            value="check"
                                            selected={expanded}
                                            onChange={() => setExpanded(prevState => !prevState)}
                                        >
                                            <FilterListRoundedIcon style={{ color: 'gray' }} />
                                        </ToggleButton>
                                    </Tooltip>
                                } />
                        {expanded ?
                            <CardContent >
                                <Collapse in={expanded}>
                                    <CardContent style={{ marginTop: 25 }} >
                                    <FormPro
                                        append={formStructure}
                                        formValues={formValues}
                                        setFormValues={setFormValues}
                                        setFormValidation={setFormValidation}
                                        formValidation={formValidation}
                                        submitCallback={
                                            submitFilter
                                        }
                                        resetCallback={handleReset}
                                        actionBox={<ActionBox>
                                            <Button type="submit" role="primary">اعمال فیلتر</Button>

                                            <Button type="reset" role="secondary">لغو</Button>
                                        </ActionBox>}

                                    />
                                    </CardContent>


                                </Collapse>
                            </CardContent>
                            : ""}
                        <TablePro
                            title="   لیست  پیشنهادات   "
                            columns={tableCols}
                            rows={tableContent}
                            // selectable
                            selectedRows={selectTable}
                            setSelectedRows={setSelectTable}
                            setTableContent={setTableContent}
                            loading={loading}
                            rowActions={checkPermis("suggestions/suggestionGuideline/viewBtb", datas) ? [
                                 {
                                    title: "مشاهده",
                                    icon: VisibilityIcon,
                                    onClick: (row)=>{
                                        dispatch(getWorkEffotr(row))
                                        history.push(`/suggestionGeneral`);
                                    }
                                }
                            ]:[]}
                        />
                    </CardContent>
                    <CardContent ref={myRef}>
                        {/* <FormPro
                            submitCallback={submitFilter}
                            resetCallback={handleReset}
                            actionBox={<ActionBox>
                                <Button type="submit" role="primary">افزودن به بانک پیشنهادات</Button>

                                <Button type="reset" role="secondary">پاداش</Button>
                            </ActionBox>}

                        /> */}
                    </CardContent>

                </Card>


            </Card>
        </Box>
    )
}


export default SuggestionGuideline;











