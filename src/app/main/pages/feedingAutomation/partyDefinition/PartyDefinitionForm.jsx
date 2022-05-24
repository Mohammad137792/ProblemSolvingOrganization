import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader, Collapse } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import { SERVER_URL } from 'configs';
import checkPermis from 'app/main/components/CheckPermision';
import TabPro from 'app/main/components/TabPro';
import SelectMember from './tabs/SelectMember';
import FoodSeting from './tabs/FoodSeting';
import CircularProgress from "@material-ui/core/CircularProgress";

const PartyDefinitionForm = (props) => {

    const scrollToRef1 = () => myRef.current.scrollIntoView()
    const [formValidation, setFormValidation] = useState({});
    const [tableContentFood, setTableContentFood] = useState([]);
    const [loading, setLoading] = useState(true)
    const [buttonName, setButtonName] = useState("افزودن")
    const [formValues, setFormValues] = useState([]);
    const [waiting, setwaiting] = useState(false)
    const [showTab, setShowTab] = useState(false)
    const datas = useSelector(({ fadak }) => fadak);
    const [foodType, setFoodType] = useState([]);
    const [foodName, setFoodName] = useState([]);
    const [facilityType, setFacilityType] = useState([]);
    const [payslipType, setPayslipType] = useState([]);
    const [partyClassificationId, setPartyClassificationId] = useState("");
    const [pricingTypeEnumId, setPricingTypeEnumId] = useState([]);
    const dispatch = useDispatch()
    const myRef = useRef(null)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }



    const tableColsFood = [


        {
            label: "کد ",
            name: "standardCode",
            type: "text",
            required: true,
            style: { minWidth: "130px" }
        }, {
            label: "  نام گروه ",
            name: "description",
            required: true,
            type: "text",
            style: { minWidth: "130px" }
        }, {
            label: "  رستوران های مجاز  ",
            name: "restaurant",
            options: facilityType,
            type: "multiselect",
            optionLabelField: "facilityName",
            optionIdField: "facilityId",
            style: { minWidth: "130px" }

        }
        , {
            label: "   فعال از تاریخ ",
            name: "fromDate",
            type: "date",
            style: { minWidth: "130px" }
        },
        , {
            label: "  فعال  تا تاریخ ",
            name: "thruDate",
            type: "date",
            style: { minWidth: "130px" }
        },
        , {
            label: "  نحوه محاسبه هزینه تغذیه  ",
            required: true,
            name: "pricingTypeEnumId",
            type: "select",
            options: pricingTypeEnumId,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 4

        }
        , {
            label: "  نوع فیش کسر هزینه تغذیه  ",
            required: true,
            name: "payslipTypeId",
            options: payslipType,
            optionLabelField: "title",
            optionIdField: "payslipTypeId",
            type: "select",
            col: 4

        },
        {
            label: "  حداکثر تعداد مجاز رزرو  هر وعده برای هر نفر  ",
            name: "orderNum",
            type: "number",
            style: { minWidth: "130px" }
        },

        {
            label: "  حداقل اعتبار ",
            name: "minimumCredit",
            type: "text",
            style: { minWidth: "130px" }

        },
        {
            label: "  نوع تغذیه ",
            name: "foodTypeEnumId",
            type: "multiselect",
            required: true,
            options: foodType,
            optionLabelField: "description",
            optionIdField: "enumId",
            style: { minWidth: "130px" }

        },
        {
            label: "  نام تغذیه ",
            name: "foodId",
            options: foodName,
            optionLabelField: "foodName",
            optionIdField: "foodId",
            type: "multiselect",
            style: { minWidth: "130px" }

        }, {
            label: "  قیمت سهم کارفرما ",
            name: "employerCost",
            type: "text",
            style: { minWidth: "130px" }

        }, {
            label: "  قیمت سهم کارگر ",
            name: "employeeCost",
            type: "text",
            style: { minWidth: "130px" }

        }

    ]


    const formStructure = [{
        label: "کد ",
        name: "standardCode",
        type: "text",
        required: true,
        validator: values => {
            const rule = "^(^[A-Za-z0-9]*$)"
            const standardCode = values.standardCode;
            const message = " کد وارد شده باید شامل حروف لاتین و اعداد باشد!";
            return new Promise(resolve => {
                if (standardCode.match(rule)) {
                    resolve({ error: false, helper: "" })
                } else {
                    resolve({ error: true, helper: message })
                }
            })
        },
        col: 4
    }, {
        label: "  نام گروه ",
        name: "description",
        required: true,
        type: "text",
        col: 4
    }, {
        label: "  رستوران های مجاز  ",
        required: true,
        name: "restaurant",
        options: facilityType,
        type: "multiselect",
        optionLabelField: "facilityName",
        optionIdField: "facilityId",
        col: 4

    }

        , {
        label: "  محدوده زمانی فعالیت گروه از تاریخ ",
        name: "fromDate",
        required: true,
        maxDate: formValues.thruDate ?? "",
        type: "date",
        col: 4
    },
        , {
        label: "  محدوده زمانی فعالیت گروه تا تاریخ ",
        name: "thruDate",
        minDate: formValues.fromDate ?? "",
        required: true,
        type: "date",
        col: 4
    },
    {
        label: "  حداکثر تعداد مجاز رزرو هر وعده برای هر نفر  ",
        name: "orderNum",
        required: true,
        type: "number",
        col: 4
    },
        , {
        label: "  نحوه محاسبه هزینه تغذیه  ",
        required: true,
        name: "pricingTypeEnumId",
        type: "select",
        options: pricingTypeEnumId,
        optionLabelField: "description",
        optionIdField: "enumId",
        type: "select",
        col: 4

    },
    formValues.pricingTypeEnumId == "PTSalary" ? {
        label: "  نوع فیش کسر هزینه تغذیه  ",
        required: true,
        name: "payslipTypeId",
        options: payslipType,
        optionLabelField: "title",
        optionIdField: "payslipTypeId",
        type: "select",
        col: 4

    } : formValues.pricingTypeEnumId == "PTCharge" ? {
        label: "  حداقل اعتبار  ",
        required: true,
        name: "minimumCredit",
        type: "number",
        col: 4

    }
        : {
            label: "    ",
            name: "temp",
            type: "text",
            style: { visibility: "hidden" },
            col: 4
        }

    ]



    const tabs = [
        {
            label: "انتخاب اعضا",
            panel: <SelectMember partyClassificationId={partyClassificationId} setLoading={setLoading} />
        },
        {
            label: " تنظیمات غذا",
            panel: <FoodSeting partyClassificationId={partyClassificationId} setLoading={setLoading} />
        },

        // {
        //     label: "   نحوه محاسبه هزینه غذا",
        //     panel: <CalculateCostOfFood />
        // },

    ]


    const submit = () => {
        setwaiting(true)
        if (buttonName === "افزودن") {
            axios.post(SERVER_URL + "/rest/s1/reservation/defineGroup", { data: formValues }, axiosKey)
                .then((res) => {
                    if (res.data.result === "noGroup") {
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'برای این شرکت گروهی تعریف نشده است!'));
                    }
                    if (res.data.result === "repetitive") {
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد وارد شده تکراری است!'));

                    }
                    else if (res.data.result !== "noGroup" && res.data.result !== "repetitive") {
                        setShowTab(true)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد.ا!'));
                        setLoading(true)
                        setPartyClassificationId(res.data.result)

                    }
                    setwaiting(false)
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setwaiting(false)
                    setFormValues([])
                });
        }
        else {
            axios.put(SERVER_URL + "/rest/s1/reservation/updateGroup", { data: formValues }, axiosKey)
                .then((res) => {
                    if (res.data.result === "noGroup") {
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'برای این شرکت گروهی تعریف نشده است!'));
                    }
                    if (res.data.result === "repetitive") {
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'کد وارد شده تکراری است!'));

                    }
                    else if (res.data.result !== "noGroup" && res.data.result !== "repetitive") {
                        setShowTab(true)
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد.ا!'));
                        setLoading(true)
                        setPartyClassificationId(res.data.result)
                        setButtonName("افزودن")

                    }
                    setwaiting(false)

                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setwaiting(false)
                    setFormValues([])
                    setButtonName("افزودن")

                });
        }

    }

    const getGorupList = () => {
        axios.get(SERVER_URL + "/rest/s1/reservation/getFoodGroup", {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setTableContentFood(res.data.list)
            setLoading(false)
            setwaiting(false)
        }).catch(err => {

        });
    }

    useEffect(() => {
        getGorupList()
    }, [loading])



    const handleRemoveFood = (oldData) => {

        setLoading(true)
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/reservation/deleteGroup", { data: oldData }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                    setLoading(true)
                    setShowTab(false)
                    setFormValues([])
                    setButtonName("افزودن")
                }).catch(() => {
                    reject('خطا در خذف اطلاعات!')
                });
        })

    }


    const handleReset = () => {
        setShowTab(false)
        setFormValues([])
        setButtonName("افزودن")

    }


    const handleEditFood = (row) => {
        setFormValues(row)
        setPartyClassificationId(row.partyClassificationId)
        setShowTab(true)
        setButtonName("ویرایش")

    }

    const getFoodList = () => {

        axios.get(SERVER_URL + "/rest/s1/reservation/food", {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setFoodName(res.data.list)
        }).catch(err => {

        });

    }


    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=FoodType", axiosKey
        ).then(res => {
            setFoodType(res.data.result)
        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=PricingType", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setPricingTypeEnumId(res.data.result)

        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/reservation/getPayslipType", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setPayslipType(res.data.list)

        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/reservation/facilityType?facilityTypeEnumId=FTRestoran", axiosKey
        ).then(res => {
            setFacilityType(res.data.list)
        }).catch(err => {
        });

    }

    useEffect(() => {
        getEnum()
        getFoodList()
    }, [])




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
                                {checkPermis("feedingAutomation/partyDefinition/save", datas) ? <Button type="submit" role="primary" disabled={waiting} endIcon={waiting ? <CircularProgress size={20} /> : null}>{buttonName}</Button> : ""}
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}

                        />
                        <Card>
                            {showTab ? <TabPro tabs={tabs} /> : ""}
                        </Card>
                        <TablePro
                            title="   لیست  گروه ها   "
                            columns={tableColsFood}
                            rows={tableContentFood}
                            editCallback={handleEditFood}
                            edit={checkPermis("feedingAutomation/partyDefinition/edit", datas) ? "callback" : false}
                            removeCallback={handleRemoveFood}
                            setTableContent={setTableContentFood}
                            loading={loading}
                        />
                    </CardContent>



                </Card>
            </Box>
        </Card>
    )
}


export default PartyDefinitionForm;











