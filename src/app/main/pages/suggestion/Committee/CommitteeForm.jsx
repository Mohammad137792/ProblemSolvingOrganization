import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { SERVER_URL } from 'configs';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import checkPermis from 'app/main/components/CheckPermision';

const CommitteeForm = (props) => {

    const scrollToRef1 = () => myRef.current.scrollIntoView()
    const [formValuesMember, setFormValuesMember] = useState([]);
    const [formValidationMember, setFormValidationMember] = useState({});
    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = useState({});
    const [tableContent, setTableContent] = useState([]);
    const [tableContentCommitee, setTableContentCommitee] = useState([]);
    const [loading, setLoading] = useState(true)
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [showMember, setShowMember] = useState(false)
    const [suggestionScope, setSuggestionScope] = useState([]);
    const [committeeRole, setCommitteeRole] = useState([]);
    const [committeeId, seCommitteeId] = useState([]);
    const [committeeMemberId, setCommitteeMemberId] = useState([]);
    const [lodingCommiteeList, setLoadingCommiteeList] = useState(false);
    const [deiable, setDeiable] = useState(false);
    const [buttonName, setButtonName] = useState("افزودن")
    const [buttonNameComm, setButtonNameComm] = useState("افزودن")
    const [formValueCommitteeFilter, setFormValueCommitteeFilter] = useState([])
    const [expanded, setExpanded] = useState(false)
    const userPartyId = useSelector(({ auth }) => auth.user.data?.partyId);
    const datas = useSelector(({ fadak }) => fadak);
    const [personInfo, setPersonInfo] = useState([]);

    const dispatch = useDispatch()
    const myRef = useRef(null)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }


    const tableCols = [
        { name: "companyName", label: " شرکت ", type: "text", style: { minWidth: "130px" } },
        { name: "organizationName", label: "واحد سازمانی", type: "text", style: { minWidth: "130px" } },
        { name: "emplPosition", label: " پست سازمانی", type: "text", style: { minWidth: "130px" }, options: organizationUnit.positions, optionLabelField: "description", optionIdField: "emplPositionId" },
        { name: "committeeRoleEnumId", label: "نقش در کمیته ", type: "select", style: { minWidth: "130px" }, options: committeeRole, optionLabelField: "description", optionIdField: "enumId" },
        // { name: "emplPositionId", type: "text",  style: { visibility: "hidden",minWidth:5}},

    ]
    const tableColsCommitee = [
        { name: "committeeCode", label: " کد کمیته ", type: "text", style: { minWidth: "130px" } },
        { name: "committeeName", label: " عنوان کمیته", type: "text", style: { minWidth: "130px" } },
        { name: "scopeTypeEnumId", label: "  حوزه", type: "select", style: { minWidth: "130px" }, options: suggestionScope, optionLabelField: "description", optionIdField: "enumId", },
        { name: "committeeStatus", label: "  فعال  ", type: "indicator", style: { minWidth: "130px" } },

    ]


    const formStructure = [{
        label: "کد کمیته",
        name: "committeeCode",
        type: "text",
        required: true,
        col: 3
    }, {
        label: " عنوان کمیته ",
        name: "committeeName",
        type: "text",
        required: true,
        col: 3
    }, {
        label: "  حوزه پیشنهاد ",
        name: "scopeTypeEnumId",
        options: suggestionScope,
        optionLabelField: "description",
        optionIdField: "enumId",
        type: "select",
        col: 3

    }
        , {
        label: " فعال ",
        name: "committeeStatus",
        type: "indicator",
        col: 3

    }
    ]


    const formStructureMember = [
        {

            name: "company",
            label: "شرکت",
            type: "select",
            // options: organizationUnit.subOrgans,
            options: checkPermis("suggestions/submitSuggestions/committee/addBtn/company", datas) ? organizationUnit.subOrgans : organizationUnit.subOrgans?.filter(item => item.companyPartyId == personInfo[0].companyPartyId),

            optionLabelField: "companyName",
            optionIdField: "companyPartyId",
            col: 3,
            disabled: deiable
        }, {
            name: "organizationUnit",
            label: "واحد سازمانی",
            type: "select",
            options: organizationUnit.units,
            optionLabelField: "unitOrganizationName",
            optionIdField: "unitPartyId",
            col: 3,
            filterOptions: options => formValuesMember["company"] ? options.filter((o) => {
                let list = organizationUnit.subOrgans.find(x => x.companyPartyId == formValuesMember["company"])
                return list?.units.indexOf(o["unitPartyId"]) >= 0
            }) : options,
            disabled: deiable

        },
        {
            name: "position",
            label: "پست سازمانی",
            type: "select",
            options: organizationUnit.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            col: 3,
            required: true,
            filterOptions: options => formValuesMember["organizationUnit"] ? options.filter((o) => {
                let list = organizationUnit.units.find(x => x.unitPartyId == formValuesMember["organizationUnit"])


                return list.emplPosition.indexOf(o["emplPositionId"]) >= 0
            }) :

                formValuesMember["company"] ? options.filter((o) => {
                    let list = organizationUnit.subOrgans.find(x => x.companyPartyId == formValuesMember["company"])


                    return list.emplPosition.indexOf(o["emplPositionId"]) >= 0
                }) :

                    options,

        }
        , {
            label: " نقش در کمیته ",
            name: "committeeRoleEnumId",
            options: committeeRole,
            optionLabelField: "description",
            optionIdField: "enumId",
            type: "select",
            col: 3

        }
    ]

    const formStructureCommitteeFilter = [
        {
            label: "کد کمیته",
            name: "committeeCode",
            type: "text",
            col: 3
        },
        {
            label: " عنوان کمیته ",
            name: "committeeName",
            type: "text",
            col: 3
        },
        {
            label: "  حوزه پیشنهاد ",
            name: "scopeTypeEnumId",
            options: suggestionScope,
            optionLabelField: "description",
            optionIdField: "enumId",
            type: "select",
            col: 3
        },
        {
            label: " فعال ",
            name: "committeeStatus",
            type: "indicator",
            col: 3
        }
    ]

    useEffect(() => {
        let data = {
            partyId: "",
        }
        axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setPersonInfo(res.data.result)
        }).catch(err => { });


    }, []);
    useEffect(() => {
        if (formValuesMember.position !== undefined && formValuesMember.position !== null) {
            setFormValuesMember(prevState => ({
                ...prevState,
                company: organizationUnit.positions?.find(item => item.emplPositionId === formValuesMember["position"]).companyPartyId,
                organizationUnit: organizationUnit.positions?.find(item => item?.emplPositionId === formValuesMember["position"]).unitPartyId,
            }))
        }
    }, [formValuesMember.position]);
    useEffect(() => {
        const formDefaultValues = {
            committeeStatus: "Y"
        }
        setFormValues(formDefaultValues)
        setFormValueCommitteeFilter(formDefaultValues)

    }, []);

    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=SuggestionScope", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSuggestionScope(res.data.result)

        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=CommitteeRole", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setCommitteeRole(res.data.result)

        }).catch(err => {
        });

    }


    const getCommiteeList = (filterParam) => {

        axios.get(SERVER_URL + "/rest/s1/Suggestion/Committee", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: {
                committeeName: filterParam.committeeName ? filterParam.committeeName : "",
                committeeCode: filterParam.committeeCode ? filterParam.committeeCode : "",
                scopeTypeEnumId: filterParam.scopeTypeEnumId ? filterParam.scopeTypeEnumId : "",
                committeeStatus: filterParam.committeeStatus ? filterParam.committeeStatus : ""
            }
        }).then(res => {
            setTableContentCommitee(res.data.list)
            setLoading(false)


        }).catch(err => {
        });

    }



    useEffect(() => {
        getCommiteeList([]);
    }, [lodingCommiteeList]);


    useEffect(() => {
        getEnum();
        getOrgInfo();

    }, []);

    useEffect(() => {
        setFormValuesMember(prevState => ({
            ...prevState,
            company: organizationUnit.subOrgans?.filter(item => item.companyPartyId == personInfo[0].companyPartyId)[0].companyPartyId

        }))

    }, [organizationUnit])


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
    }

    const handleResetMember = () => {
        setDeiable(false)
        setButtonName("افزودن")
        setFormValidationMember([])

    }


    const submitCommitee = () => {
        setLoading(true)
        if (buttonNameComm === "افزودن") {

            axios.post(SERVER_URL + "/rest/s1/Suggestion/Committee", { data: formValues }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setShowMember(true)
                    setLoadingCommiteeList(!lodingCommiteeList)
                    seCommitteeId(res.data.committeeId)
                    setLoading(false)
                    setButtonNameComm("ویرایش")
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });
        }
        else {

            if (!formValues.committeeId)
                formValues.committeeId = committeeId


            axios.put(SERVER_URL + "/rest/s1/Suggestion/Committee", { data: formValues }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setShowMember(true)
                    setLoadingCommiteeList(!lodingCommiteeList)
                    // seCommitteeId(res.data.committeeId)
                    setButtonNameComm("افزودن")
                    setLoading(false)
                    setFormValues([])
                    setFormValues([])
                    setTableContent([])
                    setFormValuesMember([])
                    setShowMember(false)
                    const formDefaultValues = {
                        committeeStatus: "Y"
                    }
                    setFormValues(formDefaultValues)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });
        }

    }



    const submitCommiteeMember = () => {
        setDeiable(false)
        let add = 0
        if (buttonName === "افزودن") {
            let memberData = {
                committeeId: committeeId,
                emplPositionId: formValuesMember.position,
                committeeRoleEnumId: formValuesMember.committeeRoleEnumId

            }
            tableContent.map((item, i) => {
                if (item.emplPositionId === formValuesMember.position)
                    add = add + 1

            })


            if (add === 0) {
                axios.post(SERVER_URL + "/rest/s1/Suggestion/CommitteeMember", { data: memberData }, axiosKey)
                    .then((res) => {
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                        setFormValuesMember([])

                        axios.get(SERVER_URL + `/rest/s1/Suggestion/CommitteeMember?committeeId=${committeeId}`, axiosKey)
                            .then((res) => {

                                setTableContent(res.data.list)


                            })
                    }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    });
            }
            else {
                dispatch(setAlertContent(ALERT_TYPES.WARNING, ' این پست قبلا اضافه شده  !'));
                setFormValuesMember([])

            }

        }
        else {

            let memberData = {
                committeeMemberId: committeeMemberId,
                emplPositionId: formValuesMember.position,
                committeeRoleEnumId: formValuesMember.committeeRoleEnumId

            }
            axios.put(SERVER_URL + "/rest/s1/Suggestion/CommitteeMember", { data: memberData }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setFormValuesMember([])

                    axios.get(SERVER_URL + `/rest/s1/Suggestion/CommitteeMember?committeeId=${committeeId}`, axiosKey)
                        .then((res) => {

                            setTableContent(res.data.list)
                            setButtonName("افزودن")
                        })
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });

        }

    }


    const handleEditCommiteeMember = (row) => {
        setDeiable(true)
        setButtonName("ویرایش")
        setCommitteeMemberId(row.committeeMemberId)
        setFormValuesMember(prevState => ({
            ...prevState,
            organizationUnit: row.organizationPartyId,
            company: row.companyPartyId,
            position: row.emplPositionId,
            committeeRoleEnumId: row.committeeRoleEnumId

        }))

    }

    const handleRemoveCommitee = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/Suggestion/Committee?committeeId=" + oldData.committeeId, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));

                    setLoadingCommiteeList(!lodingCommiteeList)


                }).catch((erro) => {
                    reject("حذف اطلاعات با خطا مواجه شد.")
                })
        })
    }

    const handleRemoveCommiteeMember = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/Suggestion/CommitteeMember?committeeMemberId=" + oldData.committeeMemberId, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));

                    // setLoadingCommiteeList(!lodingCommiteeList)

                    setTableContent(tableContent.filter(word => word.committeeMemberId !== oldData.committeeMemberId))



                }).catch((erro) => {
                    reject("حذف اطلاعات با خطا مواجه شد.")
                })
        })
    }


    const handleReset = () => {
        const formDefaultValues = {
            committeeStatus: "Y"
        }
        setFormValues(formDefaultValues)
        setButtonNameComm("افزودن")
        setShowMember(false)
        setTableContent([])


    }

    const handleResetFilter = () => {
        setFormValueCommitteeFilter({
            committeeStatus: "Y"
        })
    }


    const handleEditCommitee = (row) => {
        setTableContent([])
        scrollToRef1()
        setShowMember(true)
        setButtonNameComm("ویرایش")
        setFormValues(row)
        seCommitteeId(row.committeeId)
        axios.get(SERVER_URL + `/rest/s1/Suggestion/CommitteeMember?committeeId=${row.committeeId}`, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setTableContent(res.data.list)


        }).catch(err => {
        });

    }

    const submitFilter = () => {
        getCommiteeList(formValueCommitteeFilter)
    }

    return (
        <Card style={{ padding: "1vw" }}>
            <Box>
                <Card >
                    <CardContent ref={myRef}>
                        <FormPro
                            append={formStructure}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            setFormValidation={setFormValidation}
                            formValidation={formValidation}
                            submitCallback={
                                submitCommitee
                            }
                            resetCallback={handleReset}
                            actionBox={<ActionBox>
                                {checkPermis("suggestions/submitSuggestions/committee/addBtn", datas) ? <Button type="submit" role="primary">{buttonNameComm}</Button> : ""}

                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}

                        />
                    </CardContent>


                    {showMember ? <Card style={{ backgroundColor: "#dddd", padding: 1, margin: 5 }} >
                        <Card style={{ padding: 5 }}>
                            <CardHeader title=" تعیین اعضای کمیته" />
                            <FormPro
                                append={formStructureMember}
                                formValues={formValuesMember}
                                setFormValues={setFormValuesMember}
                                setFormValidation={setFormValidationMember}
                                formValidation={formValidationMember}
                                submitCallback={
                                    submitCommiteeMember
                                }
                                resetCallback={handleResetMember}
                                actionBox={<ActionBox>
                                    <Button type="submit" role="primary">{buttonName}</Button>

                                    <Button type="reset" role="secondary">لغو</Button>
                                </ActionBox>}

                            />
                            <TablePro
                                title="   لیست اعضای کمیته   "
                                columns={tableCols}
                                rows={tableContent}
                                editCallback={handleEditCommiteeMember}
                                edit={"callback"}
                                removeCallback={handleRemoveCommiteeMember}
                            />
                        </Card>

                    </Card> : ""}

                    {checkPermis("suggestions/submitSuggestions/committee/committeeList", datas) ? <Card style={{ backgroundColor: "gray" }}>
                        <Card style={{ margin: 1 }}>
                            <CardContent>
                                <CardHeader style={{ justifyContent: "center", textAlign: "center", color: "gray", marginBottom: -40, }}
                                    action={
                                        <Tooltip title="    فیلتر کمیته ها    ">
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
                                    <Collapse in={expanded}>
                                        <CardContent style={{ marginTop: 15 }} >
                                            <FormPro
                                                append={formStructureCommitteeFilter}
                                                formValues={formValueCommitteeFilter}
                                                setFormValues={setFormValueCommitteeFilter}
                                                submitCallback={
                                                    submitFilter
                                                }
                                                resetCallback={handleResetFilter}
                                                actionBox={<ActionBox>
                                                    <Button type="submit" role="primary">اعمال فیلتر</Button>

                                                    <Button type="reset" role="secondary">لغو</Button>
                                                </ActionBox>}

                                            />
                                        </CardContent>
                                    </Collapse>
                                    : ""}
                                <TablePro
                                    title="   لیست  کمیته ها   "
                                    columns={tableColsCommitee}
                                    rows={tableContentCommitee}
                                    editCallback={handleEditCommitee}
                                    edit={checkPermis("suggestions/submitSuggestions/committee/committeeList/updateBtn", datas) ? "callback" : false}
                                    removeCallback={checkPermis("suggestions/submitSuggestions/committee/committeeList/deletBtne", datas) ? handleRemoveCommitee : ""}
                                    setTableContent={setTableContentCommitee}
                                    loading={loading}
                                />
                            </CardContent>

                        </Card>

                    </Card> : ""}
                </Card>
            </Box>
        </Card>
    )
}


export default CommitteeForm;











