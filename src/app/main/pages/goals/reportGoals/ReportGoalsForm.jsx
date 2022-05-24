import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from 'configs';
import { useHistory } from "react-router-dom";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { Box, Button, Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, getWorkEffotr, setAlertContent } from 'app/store/actions';

const ReportGoalsForm = (props) => {
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const [expanded, setExpanded] = useState(false);
    const [formValues, setFormValues] = useState([]);
    const [formValidation, setFormValidation] = useState([]);
    const [employee, setEmployee] = useState([])
    const [loading, setloading] = useState(true);
    const [statusIds, SetstatusIds] = useState([]);
    const [Category, setWorkEffortCategory] = useState([]);
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [tableContent, setTableContent] = useState([]);
    const [unitNme, setUnitName] = useState([]);
    const [emplPositionId, setEmplPositionIds] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [roleTypeId, setRoleTypeId] = useState([]);
    let history = useHistory();
    const dispatch = useDispatch()


    const tableCols = [
        { name: "universalId", label: "  کد هدف ", type: "text", style: { minWidth: "130px" } },
        { name: "workEffortName", label: "  عنوان هدف ", type: "text", style: { minWidth: "130px" } },
        { name: "ownerPartyName", label: "  تدوینگر هدف  ", type: "text", style: { minWidth: "130px" } },
        // { name: "category", label: "  دسته بندی هدف ", type: "select",  options: Category,  optionLabelField: "description",   optionIdField: "workEffortCategoryId",  style: { minWidth: "130px" } },
        { name: "statusId", label: "   وضعیت ", type: "select", options: statusIds, optionLabelField: "description", optionIdField: "statusId", style: { minWidth: "130px" } },
        { name: "actualStartDate", label: " تاریخ ثبت ", type: "date", style: { minWidth: "130px" } },
        { name: "actualCompletionDate", label: "   تاریخ سررسید", type: "date", style: { minWidth: "130px" } },
        { name: "priority", label: "  وزن هدف", type: "text", style: { minWidth: "130px" } },
        { name: "percentComplete", label: "     درصد پیشرفت ", type: "text", style: { minWidth: "130px" } },
        { name: "description", label: " توضیحات ", type: "text", style: { minWidth: "130px" } },

    ]



    const formStructure = [{
        label: "   کد هدف",
        name: "universalId",
        type: "text",
        col: 4
    }, {
        label: "     عنوان هدف ",
        name: "workEffortName",
        type: "text",
        col: 4
    },
    {
        label: "    دسته بندی هدف",
        name: "category",
        type: "multiselect",
        options: Category,
        optionLabelField: "description",
        optionIdField: "workEffortCategoryId",
        col: 4
    }
        , {
        name: "statusId",
        label: "وضعیت",
        type: "select",
        options: statusIds,
        optionLabelField: "description",
        optionIdField: "statusId",
        col: 4

    },

    {
        label: "  وزن هدف",
        name: "priority",
        type: "number",
        col: 4
    },
    {
        label: "درصد پیشرفت",
        name: "percentComplete",
        type: "number",

        col: 4
    },

    {
        label: "  تدوین گر هدف ",
        name: "ownerPartyId",
        options: organizationUnit.employees
            ? organizationUnit.employees.filter((a) => a.name)
            : [],
        optionLabelField: "name",
        optionIdField: "partyId",
        type: "select",
        rows: 4,
        col: 4
    },
    {
        label: "   تاریخ ثبت  ",
        name: "actualStartDate",
        type: "date",
        rows: 4,
        col: 4
    },
    {
        label: "   تاریخ سررسید  ",
        name: "actualCompletionDate",
        type: "date",
        rows: 4,
        col: 4
    },
    {
        name: "company",
        label: "شرکت",
        type: "select",
        options: organizationUnit.subOrgans,
        optionLabelField: "organizationName",
        optionIdField: "partyId",
        col: 4,
        filterOptions: (options) =>
        
           
        formValues["organizationUnit"] && eval(formValues["organizationUnit"]).length > 0
        ? options.filter((item) =>
            item?.unitPartyId?.some((r) => formValues["organizationUnit"].indexOf(r) >= 0)
          ) : options,
    },
    {
        name: "organizationUnit",
        label: "واحد سازمانی",
        type: "multiselect",
        options: organizationUnit.units,
        optionLabelField: "organizationName",
        optionIdField: "partyId",
        col: 4,
        filterOptions: (options) =>
            formValues["company"]
                ? options.filter((o) => o["parentOrgId"] == formValues["company"])
                : options,
    },
    {
        name: "role",
        label: "نقش سازمانی",
        type: "multiselect",
        options: organizationUnit.roles,
        optionLabelField: "description",
        optionIdField: "roleTypeId",
        col: 4,

    },
    {
        name: "position",
        label: "پست سازمانی",
        type: "multiselect",
        options: organizationUnit.positions,
        optionLabelField: "description",
        optionIdField: "emplPositionId",
        col: 4,
        filterOptions: (options) =>
           
                formValues["role"] && eval(formValues["role"]).length > 0
                ? options.filter((item) =>
                    item.roleTypeId.some((r) => formValues["role"].indexOf(r) >= 0)
                  )
                : formValues["organizationUnit"] &&
                    eval(formValues["organizationUnit"]).length > 0
                    ? options.filter(
                        (item) =>
                            formValues["organizationUnit"].indexOf(
                                item.organizationPartyId
                            ) >= 0
                    )
                    : formValues["company"] && formValues["company"] != ""
                        ? options.filter((o) => o["parentOrgId"] == formValues["company"])
                        : options,


    },
    {
        name: "personnel",
        label: " پرسنل",
        type: "multiselect",
        options: organizationUnit.employees
            ? organizationUnit.employees.filter((a) => a.name)
            : [],
        optionLabelField: "name",
        optionIdField: "partyId",

        // options: personnel ? personnel.filter((a) => a.name) : [],
        // long: true,
        // urlLong : "/rest/s1/fadak/long",
        // changeCallback: (newOption) => {
        //   setPersonnel([newOption]);
        // },
        col: 4,
        filterOptions: (options) =>
            formValues["position"] && eval(formValues["position"]).length > 0
                ? options.filter((item) =>
                    item.emplPositionIds.some(
                        (r) => formValues["position"].indexOf(r) >= 0
                    )
                )
                : formValues["organizationUnit"] &&
                    eval(formValues["organizationUnit"]).length > 0
                    ? options.filter((item) =>
                        item.unitPartyId.some(
                            (r) => formValues["organizationUnit"].indexOf(r) >= 0
                        )
                    )
                    : formValues["company"] && formValues["company"] != ""
                        ? options.filter((item) =>
                            item.subOrgPartyId.some(
                                (org) => formValues["company"].indexOf(org) >= 0
                            )
                        )
                        : options,
    },
    ]


    useEffect(() => {
        let str = formValues.personnel?.slice(0, -1);
        var s2 = str?.substring(1)
        var s4 = s2?.replaceAll('"', "")
        var array = s4?.split(',')
        setEmployee(array)

    }, [formValues.personnel]);

    useEffect(() => {
        let str = formValues.role?.slice(0, -1);
        var s2 = str?.substring(1)
        var s4 = s2?.replaceAll('"', "")
        var array = s4?.split(',')
        setRoleTypeId(array)

    }, [formValues.role]);

    useEffect(() => {
        getOrgInfo();
        getAllWorkEffort();
    }, []);


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



    const getAllWorkEffort = () => {
        axios
            .get(
                SERVER_URL + "/rest/s1/workEffort/getAllWorkEffort",
                axiosKey
            )
            .then((res) => {
                setTableContent(res.data.result);
                setloading(false)

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


    useEffect(() => {


        let str = formValues.organizationUnit?.slice(0, -1);
        var s2 = str?.substring(1)
        var s4 = s2?.replaceAll('"', "")
        var array = s4?.split(',')
        setUnitName(array)

    }, [formValues.organizationUnit])




    useEffect(() => {


        let str = formValues.position?.slice(0, -1);
        var s2 = str?.substring(1)
        var s4 = s2?.replaceAll('"', "")
        var array = s4?.split(',')
        setEmplPositionIds(array)
    }, [formValues.position])


    useEffect(() => {

        if (emplPositionId && emplPositionId[0] === "")
            setEmplPositionIds([])

    }, [formValues.position, emplPositionId])




    useEffect(() => {


        let str = formValues.category?.slice(0, -1);
        var s2 = str?.substring(1)
        var s4 = s2?.replaceAll('"', "")
        var array = s4?.split(',')
        setCategoryList(array)
    }, [formValues.category])


    useEffect(() => {

        if (categoryList && categoryList[0] === "")
        setCategoryList([])

    }, [formValues.category, categoryList])

    useEffect(() => {


        if (unitNme && unitNme[0] === "")
            setUnitName([])

    }, [formValues.organizationUnit, unitNme])
    useEffect(() => {


        if (employee && employee[0] === "")
            setEmployee([])

    }, [formValues.personnel, employee])
    useEffect(() => {


        if (roleTypeId && roleTypeId[0] === "")
            setRoleTypeId([])

    }, [formValues.role, roleTypeId])

    const submit = () => {
        setloading(true)

        // setTableContent([])

        let data = {
            selectData: {
                universalId: formValues?.universalId ? formValues?.universalId : "",
                partyId: formValues?.partyId ? formValues?.partyId : "",
                workEffortName: formValues?.workEffortName ? formValues?.workEffortName : "",
                priority: formValues?.priority ? formValues?.priority : '',
                statusId: formValues?.statusId ? formValues?.statusId : '',
                percentComplete: formValues?.percentComplete ? formValues?.percentComplete : '',
                // category: formValues?.category ? formValues.category : '',
                category: (categoryList ? categoryList : []) || (categoryList && categoryList[0] === "" ? [] : categoryList),
                actualStartDate: formValues?.actualStartDate ? formValues.actualStartDate : '',
                actualCompletionDate: formValues?.actualCompletionDate ? formValues.actualCompletionDate : '',
                unitName: (unitNme ? unitNme : []) || (unitNme && unitNme[0] === "" ? [] : unitNme),
                emplPositionIds: (emplPositionId ? emplPositionId : []) || (emplPositionId && emplPositionId[0] === "" ? [] : emplPositionId),
                roleTypeId: (roleTypeId ? roleTypeId : []) || (roleTypeId && roleTypeId[0] === "" ? [] : roleTypeId),
                ownerPartyId: formValues.ownerPartyId ? formValues.ownerPartyId : ''


            },
            listMap: ["employees"],
            personPartyId: (employee ? employee : []) || (employee && employee[0] === "" ? [] : employee),
            partyIdCompany: formValues?.company

        }



            if(data.partyIdCompany===undefined&&data.personPartyId.length===0&&data.selectData.actualCompletionDate===""&&data.selectData.actualStartDate===""&&data.selectData.category.length===0&&data.selectData.emplPositionIds.length===0&&data.selectData.ownerPartyId===""&&data.selectData.partyId===""&&data.selectData.percentComplete===""&&data.selectData.priority===""&&data.selectData.roleTypeId.length===0&&data.selectData.statusId===""&&data.selectData.unitName.length===0&&data.selectData.universalId===""&&data.selectData.workEffortName==="")
{
    axios
    .get(
        SERVER_URL + "/rest/s1/workEffort/getAllWorkEffort",
        axiosKey
    )
    .then((res) => {
        setTableContent(res.data.result);
        setloading(false)

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
else{


    axios
    .post(
        SERVER_URL + "/rest/s1/workEffort/searchWorkEffort", { data: data },
        axiosKey
    )
    .then((res) => {
        setTableContent(res.data.result);
        setloading(false)
        if(res.data.result.length>0)
        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت دریافت شد'));
        else
        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'موردی یافت نشد '));



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
      





    }

    useEffect(() => {
        GetStatusId();
        GetSCategory();


    }, [])


    const GetStatusId = () => {
        axios
            .get(
                SERVER_URL +
                "/rest/s1/fadak/entity/StatusItem?statusTypeId=WorkEffort",
                axiosKey
            )
            .then((res) => {
                SetstatusIds(res.data.status)
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

    const GetSCategory = () => {
        axios
            .get(
                SERVER_URL +
                "/rest/s1/workEffort/entity/WorkEffortCategory",
                axiosKey
            )
            .then((res) => {
                setWorkEffortCategory(res.data.WorkEffortCategory)
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
    const handleEdit = (row) => {
        dispatch(getWorkEffotr(row))
        history.push(`/goals`);
    }


    const handleReset = () => {
        setFormValues([])
        axios
    .get(
        SERVER_URL + "/rest/s1/workEffort/getAllWorkEffort",
        axiosKey
    )
    .then((res) => {
        setTableContent(res.data.result);
        setloading(false)

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


    return (
        <Box style={{ padding: 10 }}>
            <Card style={{ padding: 2, backgroundColor: "#dddd" }}>
                <Card >

                    <CardContent>



                        <CardHeader style={{ justifyContent: "center", textAlign: "center", color: "gray", marginBottom: -60, }}
                            action={
                                <Tooltip title="    جستجوی اهداف    ">
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
                                                submit
                                            }
                                            resetCallback={handleReset}
                                            actionBox={<ActionBox>

                                                <Button type="submit" role="primary">جستجو</Button>
                                                <Button type="reset" role="secondary">لغو</Button>

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

                            columns={tableCols}
                            rows={tableContent}
                            editCallback={handleEdit}
                            edit={"callback"}
                            // removeCallback={handleRemove}

                            //={setTableContent}
                            // addCallback={handleAdd}
                            // edit="inline"
                            // editCallback={handleEdit}
                            // removeCallback={handleRemoveResidence}
                            loading={loading}
                        />
                    </CardContent>

                </Card>

            </Card>
        </Box>
    )
}


export default ReportGoalsForm;











