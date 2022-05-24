import React, { useState, useEffect, createRef } from 'react';
import { CardContent, Divider, Button } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from '@material-ui/core/CardHeader';
import TablePro from "../../../../../components/TablePro";
import Box from "@material-ui/core/Box";
import FormPro from "../../../../../components/formControls/FormPro";
import ActionBox from "../../../../../components/ActionBox";
import axios from "axios";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../../../configs";
import { ALERT_TYPES, setAlertContent } from "../../../../../../store/actions/fadak";
import { useDispatch } from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import CircularProgress from "@material-ui/core/CircularProgress";


const DefineNeedAssessment = (props) => {

    const { classes, initData, data, setData, setActiveAssessment, activeAssessment, needsContacts, setNeedsContacts, setContactList, setManagerList, waiting, set_waiting } = props

    const tableCols = [
        // { name: "pseudoId", label: "شماره پرسنلی", type: "text" },
        // { name: "firstName", label: "نام", type: "text" },
        // { name: "lastName", label: "نام خانوادگی", type: "text" },
        { name: "unitOrganization", label: "واحد سازمانی", type: "text" },
        { name: "emplPosition", label: "پست", type: "text" },
        { name: "organizationName", label: "شرکت", type: "text" },
    ]

    const [formValidation, setFormValidation] = useState({});

    const [tableContent, setTableContent] = useState([]);

    const [loading, setLoading] = useState(false);

    const [expanded, setExpanded] = useState(false);

    const formDefaultValues = [];

    const [responsibles, setResponsibles] = useState([])

    const [contact, setContact] = useState({ 'orgs': '', 'unit': '', 'positions': '', 'employees': '' })

    const [formValues, setFormValues] = useState(formDefaultValues);

    const [companyFormValues, setcompanyFormValues] = useState(formDefaultValues);

    const [byUnitformValues, setbyUnitformValues] = useState(formDefaultValues);

    const [byEmplformValues, setbyEmplformValues] = useState(formDefaultValues);

    const [byPersonnelformValues, setbyPersonnelformValues] = useState(formDefaultValues);
    const unitRef = createRef(0);
    const emplRef = createRef(0);
    const formStructure = [{
        label: "کد نیازسنجی",
        name: "code",
        type: "text",
        required: true,
    }, {
        label: "عنوان نیازسنجی",
        name: "title",
        type: "text",
        required: true,
    }, {
        label: "انتخاب مسئول نیازسنجی",
        name: "emplPositionId",
        type: "select",
        required: true,
        optionIdField: 'emplPositionId',
        options: responsibles,
    }, {
        label: "تاریخ شروع",
        name: "fromDate",
        type: "date",
        required: true,
    }, {
        label: "تاریخ پایان",
        name: "thruDate",
        type: "date",
        required: true,
    }, {
        label: "زمان نیازسنجی کارمندان (دقیقه)",
        name: "emplTime",
        type: "number",
        required: true,
    }]

    const companyFormStructure = [{
        label: "شرکت",
        name: "subOrg",
        type: "select",
        required: true,
        optionLabelField: 'organizationName',
        optionIdField: 'partyId',
        options: contact.subOrgans,
        filterOptions: options => (byUnitformValues["unit"] && byUnitformValues["unit"] != "") ? options.filter((item) => {
            let co = contact.units?.find(x => x.partyId == byUnitformValues["unit"])?.parentOrg
            return item.partyId == co
        }) : options
    }]

    const byUnitformStructure = [{
        label: "واحد سازمانی",
        name: "unit",
        type: "select",
        optionLabelField: 'organizationName',
        optionIdField: 'partyId',
        options: contact.units,
        required: true,
        filterOptions: options => byUnitformValues["positions"] && eval(byUnitformValues["positions"]).length > 0 ? options.filter((item) => {
            let exist = false,
                list = eval(byUnitformValues["positions"])
            for (let i = 0; i < list.length; i++) {
                if (item.positions?.indexOf(list[i]) >= 0) {
                    exist = true
                }
            }
            return exist
        }) :
            byUnitformValues["persons"] && eval(byUnitformValues["persons"]).length > 0 ? options.filter((item) => {
                let exist = false,
                    list = eval(byUnitformValues["persons"])
                for (let i = 0; i < list.length; i++) {
                    if (item.persons?.indexOf(list[i]) >= 0) {
                        exist = true
                    }
                }
                return exist
            }) :
                companyFormValues["subOrg"] ? options.filter(o => o["parentOrg"] == companyFormValues["subOrg"]) :
                    options
    }, 
    {
        label: "پست سازمانی",
        name: "positions",
        type: "multiselect",
        options: contact.posts,
        filterOptions: options => byUnitformValues["persons"] && eval(byUnitformValues["persons"]).length > 0 ? options.filter((item) => {
            let pers = contact.employees.party.slice(0)
            pers = pers.filter(x => eval(byUnitformValues["persons"]).indexOf(x.partyId) >= 0)
            return pers.find(x => x.emplPositionIds.indexOf(item.enumId) >= 0)
        }
        ) :
            byUnitformValues["unit"] ? options.filter((item) =>
                byUnitformValues["unit"] == item.parentEnumId
            ) :
                companyFormValues["subOrg"] && companyFormValues["subOrg"] != "" ? options.filter(o => o["parentOrgId"] == companyFormValues["subOrg"])
                    : options
    }, 
    // {
    //     label: "لیست کارمندان",
    //     name: "persons",
    //     type: "multiselect",
    //     optionLabelField: 'fullName',
    //     optionIdField: 'partyId',
    //     options: contact.employees.party,
    //     filterOptions: options => byUnitformValues["positions"] && eval(byUnitformValues["positions"]).length > 0 ? options.filter((item) => {
    //         let exist = false,
    //             list = eval(byUnitformValues["positions"])
    //         for (let i = 0; i < list.length; i++) {
    //             if (item.emplPositionIds.indexOf(list[i]) >= 0) {
    //                 exist = true
    //             }
    //         }
    //         return exist
    //     }) :
    //         byUnitformValues["unit"] ? options.filter((item) =>
    //             byUnitformValues["unit"] == item.unitOrganization
    //         ) :
    //             companyFormValues["subOrg"] && companyFormValues["subOrg"] != "" ? options.filter(o => o["ownerPartyId"] == companyFormValues["subOrg"])
    //                 : options
    // }
    ]

    const byEmplformStructure = [{
        label: "نقش های سازمانی",
        name: "roles",
        type: "multiselect",
        optionIdField: "roleTypeId",
        required: true,
        options: contact.roles,
    }]

    const byPersonnelformStructure = [{
        label: "گروه پرسنلی",
        name: "persongroup",
        type: "multiselect",
        required: true,
        optionIdField: 'partyClassificationId',
        options: contact.group,
        filterOptions: options => companyFormValues["subOrg"] ? options.filter(o => o["parentOrg"] == companyFormValues["subOrg"]) : options
    }]

    const dispatch = useDispatch();

    const config = {
        timeout: AXIOS_TIMEOUT,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: localStorage.getItem('api_key')
        }
    };

    function submitAssessment() {

        var codeUniqe = true
        let checkUniqeCode = new Promise(function (uniqeResolve, uniqeReject) {
            let arr = initData.assessments

            if (arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].code == formValues.code && arr[i].curriculumId != activeAssessment?.curriculumId)
                        codeUniqe = false

                    if (i == arr.length - 1)
                        uniqeResolve()
                }
            }
            else {
                uniqeResolve()
            }
        });

        checkUniqeCode.then(() => {
            if (codeUniqe) {
                set_waiting({ 'wait': true, 'target': 3 })

                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
                axios.post(SERVER_URL + "/rest/s1/training/addNeedsAssessment", { data: formValues }, {
                    headers: { 'api_key': localStorage.getItem('api_key') }
                })
                    .then(res => {
                        set_waiting({ 'wait': false, 'target': false })

                        let newNeeds = Object.assign(res.data.assessmentId, formValues)
                        setActiveAssessment(newNeeds)
                        setData(newNeeds)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                    }).catch(() => {
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
                    });
            } else {
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد نیازسنجی تکراری است.'));
            }
        })
    }

    function resetForm() {
        setFormValues('')
        setDefaultCompany()
    }

    function pageDefaultValues() {
        if (initData.responsibles) {

            let responsibles = initData.responsibles
            // units = initData.contacts.units
            // orgs = initData.contacts.subOrgans
            // positions = initData.contacts.positions
            setResponsibles(responsibles)
            setContact(initData.contacts)
            setDefaultCompany()
        }

    }

    function setDefaultCompany() {
        let defaultCompany = initData.contacts.subOrgans[0]?.partyId
        setcompanyFormValues({ "subOrg": defaultCompany })
    }

    function assessmentDefaultContacts() {
        setLoading(true)
        axios.get(SERVER_URL + "/rest/s1/training/getNeedsAssessmentContacts?curriculumId=" + activeAssessment.curriculumId, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            if (res.data.assessmentData.contacts)
                setTableContent(res.data.assessmentData.contacts)
            setContactList(res.data.assessmentData.contacts)
            setManagerList(res.data.ManagerData)

            setLoading(false)

        }).catch(() => {
            setLoading(false)
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در دریافت اطلاعات رخ داده است.'));
        });
    }

    function addContacts() {

        if (companyFormValues['subOrg']) {
            let entry = {},
                data = {},
                isValid = true,
                alrtText = "فیلد های اجباری را پر کنید."


            const checkContacts = new Promise((resolve, reject) => {
                if (contactType == 'empl') {
                    entry = byEmplformValues
                    if (!byEmplformValues['roles'] || eval(byEmplformValues.roles).length == 0) {
                        isValid = false

                    }
                    resolve()
                }

                else if (contactType == 'unit') {
                    if (byUnitformValues && !Array.isArray(byUnitformValues)) {
                        entry = JSON.parse(JSON.stringify(byUnitformValues))
                    }

                    if (!byUnitformValues || !byUnitformValues["unit"]) {
                        isValid = false
                        resolve()
                    }
                    else {
                        let org = byUnitformValues["unit"];

                        if (entry.persons && eval(entry.persons).length == 0) {
                            delete entry.persons;
                        }
                        if (entry.positions && eval(entry.positions).length == 0) {
                            delete entry.positions;
                        }

                        if (entry.persons) {
                            let pers = contact.employees.party.slice(0),
                                orgPers = contact.units.find(x => x.partyId == byUnitformValues["unit"])

                            pers = pers.filter(x => entry.persons?.indexOf(x.partyId) >= 0)

                            for (let i = 0; i < pers.length; i++) {
                                if (!pers[i].emplPositionId) {

                                    isValid = false
                                    alrtText = "حداقل یکی از افراد انتخاب شده پست سازمانی ندارد."
                                    resolve()
                                }
                                else if (orgPers.persons?.indexOf(pers[i].partyId) < 0) {
                                    isValid = false
                                    alrtText = "بر اساس واحد سازمانی، فیلد پرسنل به درستی انتخاب نشده است."
                                    resolve()
                                }
                                else {
                                    if (i == pers.length - 1) {
                                        resolve()
                                    }
                                }
                            }
                        }

                        if (entry.positions) {
                            let pers = eval(entry.positions),
                                orgPers = contact.units.find(x => x.partyId == byUnitformValues["unit"])

                            for (let i = 0; i < pers.length; i++) {
                                if (orgPers.positions?.indexOf(pers[i]) < 0) {
                                    isValid = false
                                    alrtText = "بر اساس واحد سازمانی، فیلد پست به درستی انتخاب نشده است."
                                    resolve()
                                }
                                if (i == pers.length - 1) {
                                    resolve()
                                }
                            }
                        }

                        if (!entry.persons && !entry.positions) {
                            let list = contact.posts?.filter((item) =>
                            byUnitformValues["unit"] == item.parentEnumId).map(x => x.enumId)
                            entry.positions = list
                            resolve()
                        }
                    }
                }

                else {
                    entry = byPersonnelformValues
                    if (!byPersonnelformValues.persongroup || eval(byPersonnelformValues.persongroup).length == 0) {
                        isValid = false
                    }
                    resolve()
                }

            });

            checkContacts.then(() => {
                if (isValid) {
                    data.curriculumId = activeAssessment.curriculumId
                    entry = { ...entry, companyFormStructure }
                    data.entry = entry
                    data.org = companyFormValues.subOrg
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'در حال ارسال اطلاعات'));
                    set_waiting({ 'wait': true, 'target': 1 })

                    axios.post(SERVER_URL + "/rest/s1/training/addContactNeedsAssessment", { data: data }, {
                        headers: { 'api_key': localStorage.getItem('api_key') }
                    })
                        .then(res => {
                            set_waiting({ 'wait': false, 'target': false })
                            setNeedsContacts(!needsContacts)
                            setcompanyFormValues({})
                            setbyUnitformValues({})
                            setbyEmplformValues({})
                            setbyPersonnelformValues({})
                            setDefaultCompany()
                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  ثبت شد'));
                        }).catch(() => {
                            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
                        });

                }
                else {
                    if(alrtText == 'فیلد های اجباری را پر کنید.')
                        if(contactType == 'unit')
                            unitRef.current.click();
                        if(contactType == 'empl')
                            emplRef.current.click();
                        
                    else
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, alrtText));
                }
            })


        }
        else {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'فیلد شرکت انتخاب نشده است.'));
        }
    }

    function deleteContact(row) {
        return axios.post(SERVER_URL + "/rest/s1/training/deleteContactNeedsAssessment", { contact: row }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {

        }).catch(() => {
            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'مشکلی در ارسال اطلاعات رخ داده است.'));
        });
    }

    const [contactType, setContactType] = useState("unit");

    const onRadioChange = event => {
        setContactType(event.target.value);
    };


    useEffect(() => {
        pageDefaultValues()
    }, [initData]);

    useEffect(() => {
        if (activeAssessment) {
            assessmentDefaultContacts()
        }
    }, [needsContacts]);

    useEffect(() => {
        if (activeAssessment) {
            assessmentDefaultContacts()
            setFormValues(activeAssessment)
            setExpanded(true)

        }
        else {
            setFormValues({})
            setcompanyFormValues({})
            setbyUnitformValues({})
            setbyEmplformValues({})
            setbyPersonnelformValues({})
            setExpanded(false)
        }
    }, [activeAssessment]);

    useEffect(() => {
        if(byUnitformValues?.positions !== undefined && byUnitformValues?.positions !== null && eval(byUnitformValues["positions"]).length === 1){
            setbyUnitformValues(prevState => ({
                    ...prevState,
                    unit: contact.posts.find(item => item.enumId === eval(byUnitformValues["positions"])[0])?.parentEnumId
                }))
        }
    }, [byUnitformValues?.positions]);


    return (
        <Box>
            <Card >
                <CardHeader title={"مشخصات نیازسنجی"} />
                <CardContent>
                    <FormPro
                        append={formStructure}
                        formValues={formValues}
                        formDefaultValues={formDefaultValues}
                        setFormValues={setFormValues}
                        submitCallback={submitAssessment}
                        resetCallback={resetForm}
                        formValidation={formValidation} setFormValidation={setFormValidation}
                        actionBox={<ActionBox>
                            <Button type="submit" disabled={waiting.wait} endIcon={waiting.target == 3 ? <CircularProgress size={20} /> : null} role="primary">{!activeAssessment ? "ایجاد" : "ویرایش"}</Button>
                        </ActionBox>}
                    />
                </CardContent>
            </Card>

            <Box mt={2}>
                <Card>

                    <CardHeader className={classes.headerCollapse} title={"مخاطبین نیازسنجی"}
                        action={
                            <Tooltip title="نمایش مخاطبین نیازسنجی">
                                <ToggleButton
                                    value="check"
                                    selected={expanded}
                                    onChange={() => setExpanded(prevState => !prevState)}
                                >
                                    <FilterListRoundedIcon />
                                </ToggleButton>
                            </Tooltip>
                        } />
                    <CardContent className={(activeAssessment ? '' : classes.DisableRow)}>
                        <Collapse in={expanded}>
                            <FormPro
                                append={companyFormStructure}
                                formValues={companyFormValues}
                                formDefaultValues={formDefaultValues}
                                setFormValues={setcompanyFormValues}
                                resetCallback={resetForm}
                            />

                            <div className={classes.centerFlux} >
                                <label htmlFor="rd-unit">  </label>
                                <input
                                    id="rd-unit"
                                    type="radio"
                                    value="unit"
                                    checked={contactType === "unit"}
                                    onChange={onRadioChange}
                                />
                                <div className={(contactType === "unit" ? '' : classes.DisableRow)} style={{ flexGrow: 1, margin: '14px 16px 0 0' }}>
                                    <FormPro
                                        append={byUnitformStructure}
                                        formValues={byUnitformValues}
                                        formDefaultValues={formDefaultValues}
                                        formValidation={formValidation}
                                        setFormValidation={setFormValidation}
                                        setFormValues={setbyUnitformValues}
                                        resetCallback={resetForm}
                                        actionBox={
                                            <ActionBox style={{display:"none"}}>
                                                <Button ref={unitRef} type="submit" role="primary">ثبت</Button>
                                            </ActionBox>
                                        }
                                    />
                                </div>

                            </div>

                            <div className={classes.centerFlux} >
                                <label htmlFor="rd-empl"> </label>
                                <input
                                    id="rd-empl"
                                    type="radio"
                                    value="empl"
                                    checked={contactType === "empl"}
                                    onChange={onRadioChange}
                                />
                                <div className={(contactType === "empl" ? '' : classes.DisableRow)} style={{ flexGrow: 1, margin: '14px 16px 0 0' }}>
                                    <FormPro
                                        append={byEmplformStructure}
                                        formValues={byEmplformValues}
                                        formDefaultValues={formDefaultValues}
                                        formValidation={formValidation}
                                        setFormValidation={setFormValidation}
                                        setFormValues={setbyEmplformValues}
                                        resetCallback={resetForm}
                                        actionBox={
                                            <ActionBox style={{display:"none"}}>
                                                <Button ref={emplRef} type="submit" role="primary">ثبت</Button>
                                            </ActionBox>
                                        }
                                    />
                                </div>
                            </div>

                            {/* <div className={classes.centerFlux} >
                                <label htmlFor="rd-person"></label>
                                <input
                                    id="rd-person"
                                    type="radio"
                                    value="person"
                                    checked={contactType === "person"}
                                    onChange={onRadioChange}
                                />
                                <div className={(contactType === "person" ? '' : classes.DisableRow)} style={{ flexGrow: 1, margin: '14px 16px 0 0' }}>
                                    <FormPro
                                        append={byPersonnelformStructure}
                                        formValues={byPersonnelformValues}
                                        formDefaultValues={formDefaultValues}
                                        setFormValues={setbyPersonnelformValues}
                                        formValidation={formValidation} setFormValidation={setFormValidation}

                                        resetCallback={resetForm}
                                    />
                                </div>
                            </div> */}

                            <ActionBox>
                                <Button type="submit" role="primary" disabled={waiting.wait} endIcon={waiting.target == 1 ? <CircularProgress size={20} /> : null} onClick={addContacts}>افزودن</Button>
                            </ActionBox>

                            <TablePro

                                columns={tableCols}
                                loading={loading}
                                rows={tableContent}
                                setRows={setTableContent}
                                removeCallback={deleteContact}
                            />
                        </Collapse>
                    </CardContent>

                </Card>
            </Box>
        </Box>
    )
}

export default DefineNeedAssessment