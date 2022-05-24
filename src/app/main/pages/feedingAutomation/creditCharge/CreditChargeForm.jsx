import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Dialog } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { SERVER_URL } from 'configs';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import checkPermis from 'app/main/components/CheckPermision';
import CircularProgress from "@material-ui/core/CircularProgress";

const CreditChargeForm = (props) => {

    const scrollToRef1 = () => myRef.current.scrollIntoView()
    const [formValidation, setFormValidation] = useState({});
    const [tableContentFood, setTableContentFood] = useState([]);
    const [loading, setLoading] = useState(true)
    const [buttonName, setButtonName] = useState("افزودن")
    const [formValues, setFormValues] = useState([]);
    const [waiting, setwaiting] = useState(false)
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [formDefaultValues, setFormDefaultValues] = useState({});
    const [loadPersone, setLoadPersone] = useState(true);
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch()
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const myRef = useRef(null)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }





    const tableColsFood = [
        , {
            label: "  نام و نام خانوادگی  ",
            name: "toPartyRelationshipId",
            options: organizationUnit.employees,
            optionLabelField: "name",
            optionIdField: "partyRelationshipId",
            type: "select",
            col: 3
        }
        , {
            label: " مبلغ شارژ   ",
            name: "creditAmount",
            type: "number",
            required: true,
            col: 3
        },
        {
            label: " تاریخ تراکنش   ",
            name: "creditDate",
            type: "date",
            required: true,
            col: 3
        },

    ]


    const formStructure = [
        {
            label: "  موجودی ",
            name: "userCreditAmount",
            readOnly: true,
            type: "text",
            col: 3
        },
        {
            label: " مبلغ شارژ   ",
            name: "creditAmount",
            type: "number",
            required: true,
            col: 3
        },
        {
            label: " شارژ کننده ",
            name: "fromPartyRelationshipId",
            options: organizationUnit.employees,
            required: true,
            optionLabelField: "name",
            optionIdField: "partyRelationshipId",
            type: "select",
            readOnly: true,
            col: 3
        },
        , {
            label: " دریافت کننده ",
            name: "toPartyRelationshipId",
            options: organizationUnit.employees,
            required: true,
            optionLabelField: "name",
            optionIdField: "partyRelationshipId",
            type: "select",
            col: 3
        },

    ]

    useEffect(() => {
        let sendData = {
            toPartyRelationshipId: partyRelationshipId
        }
        axios.post(SERVER_URL + "/rest/s1/reservation/EmpClassForFood", { data: sendData }, axiosKey)
            .then((res) => {
                const formDefaultValues = {
                    userCreditAmount: res?.data?.creditAmountResult[0] ? res.data.creditAmountResult[0]?.creditAmount : "",
                    fromPartyRelationshipId: partyRelationshipId
                }

                setFormValues(formDefaultValues)
                setFormDefaultValues(formDefaultValues)
            }).catch(() => {
                setFormValues((prevState) => ({
                    ...prevState,
                    userCreditAmount: ""
                }));
            });
    }, [])

    const getOrgInfo = () => {
        axios
            .get(
                SERVER_URL + "/rest/s1/fadak/allCompaniesFilter?isLoggedInUserData=true",
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
                setLoadPersone(false)

            })
            .catch(() => { });
    }

    useEffect(() => {
        // getpersonLoginInfo()
        getOrgInfo()
    }, [])


    const getCreditChargeList = () => {
        axios.get(SERVER_URL + "/rest/s1/reservation/creditAmount", {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setTableContentFood(res.data.list)
            setLoading(false)
            setwaiting(false)
        }).catch(err => {

        });
    }

    useEffect(() => {
        getCreditChargeList()
    }, [loading])

    const submit = () => {
        let sendData = {

            fromPartyRelationshipId: partyRelationshipId,
            toPartyRelationshipId: formValues.toPartyRelationshipId,
            creditAmount: formValues.creditAmount,

        }
        setLoading(true)
        setwaiting(true)
        if (buttonName === "افزودن") {
            axios.post(SERVER_URL + "/rest/s1/reservation/creditAmount", { data: sendData }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setLoading(false)
                    setFormValues(formDefaultValues)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setwaiting(false)
                    setFormValues(formDefaultValues)
                });
        }
        else {
            axios.post(SERVER_URL + "/rest/s1/reservation/creditAmount", { data: formValues }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
                    setLoading(false)
                    setFormValues(formDefaultValues)

                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setFormValues(formDefaultValues)
                    setwaiting(false)

                });
            setButtonName("افزودن")

        }

    }

    const handleRemoveFood = (oldData) => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/reservation/creditAmount?creditChargeId=" + oldData.creditChargeId, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                }).catch(() => {
                    reject('خطا در خذف اطلاعات!')
                });
        })

    }


    const handleReset = () => {
        setButtonName("افزودن")
        setFormValues(formDefaultValues)

    }

    const handleEditFood = (row) => {
        row.userCreditAmount = formDefaultValues.userCreditAmount
        setFormValues(row)
        setButtonName("ویرایش")
        formValues.creditChargeId = row.creditChargeId
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
                                submit
                            }
                            resetCallback={handleReset}
                            actionBox={<ActionBox>

                                {checkPermis("feedingAutomation/creditCharge/save", datas) ? <Button type="submit" role="primary" endIcon={waiting ? <CircularProgress size={20} /> : null}>{buttonName}</Button> : ""}

                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}

                        />
                        <TablePro
                            title="        "
                            columns={tableColsFood}
                            rows={tableContentFood}
                            editCallback={handleEditFood}
                            edit="callback"
                            removeCallback={handleRemoveFood}
                            setTableContent={setTableContentFood}
                            loading={loading}
                        />
                    </CardContent>
                </Card>
                {loadPersone ? <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <Dialog open={loadPersone} PaperProps={{
                        style: {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            width: 100,
                            height: 100,
                            borderWidth: 0
                        },
                    }} >
                        <CircularProgress />
                    </Dialog>
                </Box> : ""}
            </Box>
        </Card>
    )
}


export default CreditChargeForm;











