import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Dialog } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';
import ActionBox from 'app/main/components/ActionBox';
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from 'app/main/components/CheckPermision';
import { SERVER_URL } from 'configs';
import { SET_ALERT_CONTENT } from 'app/store/actions';
import DeleteIcon from "@material-ui/icons/Delete";

const FoodReserveForm = (props) => {

    const scrollToRef1 = () => myRef.current.scrollIntoView()
    const [formValidation, setFormValidation] = useState({});
    const [tableContentFood, setTableContentFood] = useState([]);
    const [loading, setLoading] = useState(true)
    const [buttonName, setButtonName] = useState("افزودن")
    const [formValues, setFormValues] = useState([]);
    const [waiting, setwaiting] = useState(false)
    const [foodName, setFoodName] = useState([]);
    const [schdul, setSchdul] = useState([]);
    const dispatch = useDispatch()
    const [foodMeal, setMeal] = useState([]);
    const myRef = useRef(null)
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const datas = useSelector(({ fadak }) => fadak);
    const [facilityType, setFacilityType] = useState([]);
    const [partyClassDetail, setPartyClassDetail] = useState({});
    const [facilityTable, setFacilityTable] = useState([]);
    const [foodType, setFoodType] = useState([]);
    const partyRelationshipId = useSelector(({ auth }) => auth.user.data.partyRelationshipId);
    const [formDefaultValues, setFormDefaultValues] = useState({});
    const [loadPersone, setLoadPersone] = useState(true);
    const [row, setRow] = useState({});
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }





    const tableColsFood = [
        //     {
        //     label: " تاریخ رزرو ",
        //     name: "reserveDate",
        //     type: "date",
        //     required: true,
        //     col: 3
        // },
        {
            label: " تاریخ دریافت غذا  ",
            name: "recievingDate",
            type: "date",
            required: true,
            col: 3
        },
        , {
            label: " وعده ",
            required: true,
            name: "mealId",
            type: "select",
            options: foodMeal,
            optionLabelField: "mealName",
            optionIdField: "mealId",
            col: 3

        },
        {
            label: " نوع تغذیه ",
            name: "foodTypeEnumId",
            type: "select",
            required: true,
            options: foodType,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 3
        },
        {
            label: " نام تغذیه  ",
            name: "foodName",
            type: "select",
            required: true,
            col: 3
        }, {
            label: "   تعداد ",
            name: "reservationNum",
            type: "number",
            required: true,
            col: 3
        }, {
            label: "  رستوران  ",
            name: "restaurant",
            options: facilityType,
            type: "select",
            optionLabelField: "facilityName",
            optionIdField: "facilityId",
            col: 3

        }
        , {
            label: "  شماره میز  ",
            name: "facilityId",
            options: facilityTable,
            optionLabelField: "description",
            optionIdField: "facilityId",
            required: true,
            type: "select",
            col: 3

        }
        //     , {
        //     label: "  موجودی  ",
        //     name: "creditAmount",
        //     type: "number",
        //     col: 3

        // }
        //     , {
        //     label: "  رزرو کننده  ",
        //     name: "fromPartyRelationshipId",
        //     options: organizationUnit.employees,
        //     optionLabelField: "name",
        //     optionIdField: "partyRelationshipId",
        //     type: "select",
        //     col: 3

        // }, {
        //     label: "  دریافت کننده  ",
        //     name: "toPartyRelationshipId",
        //     options: organizationUnit.employees,
        //     optionLabelField: "name",
        //     optionIdField: "partyRelationshipId",
        //     type: "select",
        //     col: 3
        // }

    ]

    const formStructure = [{
        label: " تاریخ رزرو ",
        name: "reserveDate",
        type: "date",
        readOnly: true,
        col: 3
    },
    {
        label: " تاریخ دریافت غذا  ",
        name: "recievingDate",
        type: "date",
        required: true,
        col: 3
    },
        , {
        label: " وعده ",
        required: true,
        name: "mealId",
        type: "select",
        options: foodMeal,
        changeCallback: () => setFormValues(prevState => ({ ...prevState, foodTypeEnumId: "", foodId: "", restaurant: "", facilityId: "" })),
        optionLabelField: "mealName",
        optionIdField: "mealId",
        col: 3

    },
    {
        label: " نوع تغذیه ",
        name: "foodTypeEnumId",
        type: "select",
        required: true,
        options: foodType,
        disabled: formValues["mealId"] ? false : true,
        optionLabelField: "description",
        optionIdField: "enumId",
        changeCallback: () => setFormValues(prevState => ({ ...prevState, foodId: "", restaurant: "", facilityId: "" })),
        filterOptions: options => formValues["mealId"] ? options.filter(o => schdul.filter(o1 => o1.mealId === formValues["mealId"]).find(o1 => (o1.foodTypeEnumId === o.enumId))) : options,
        col: 3
    },
    {
        label: "  نام تغذیه ",
        required: true,
        name: "foodId",
        options: foodName,
        optionLabelField: "foodName",
        optionIdField: "foodId",
        disabled: formValues["foodTypeEnumId"] ? false : true,
        type: "select",
        col: 3,
        changeCallback: () => setFormValues(prevState => ({ ...prevState, restaurant: "", facilityId: "" })),
        filterOptions: options => formValues["foodTypeEnumId"] ? options.filter(o => o["foodTypeEnumId"]?.indexOf(formValues["foodTypeEnumId"]) >= 0) : options,
    }, {
        label: "  رستوران  ",
        name: "restaurant",
        options: facilityType,
        required: true,
        disabled: formValues["foodId"] ? false : true,
        type: "select",
        optionLabelField: "facilityName",
        changeCallback: () => setFormValues(prevState => ({ ...prevState, facilityId: "" })),
        optionIdField: "facilityId",
        filterOptions: options => formValues["mealId"] ? options.filter(o => schdul.filter(o1 => o1.mealId === formValues["mealId"] && o1.foodTypeEnumId === formValues["foodTypeEnumId"] && o1.foodId === formValues["foodId"]).find(o1 => (o1.facilityId === o.facilityId))) : options,
        changeCallback: () => setFormValues(prevState => ({ ...prevState, facilityId: "" })),
        col: 3

    }
        , {
        label: "  شماره میز  ",
        name: "facilityId",
        options: facilityTable,
        optionLabelField: "facilityName",
        disabled: formValues["restaurant"] ? false : true,
        optionIdField: "facilityId",
        required: true,
        type: "select",
        filterOptions: options => formValues["restaurant"] ? options.filter(o => o["parentFacilityId"]?.indexOf(formValues["restaurant"]) >= 0) : options,
        col: 3

    }, {
        label: "   تعداد ",
        name: "reservationNum",
        required: true,
        type: "number",
        col: 3
    },
        , {
        label: "  موجودی  ",
        name: "creditAmount",
        type: "number",
        readOnly: true,
        col: 3

    }
        , {
        label: "  رزرو کننده  ",
        name: "fromPartyRelationshipId",
        type: "text",
        readOnly: true,
        col: 3

    }, {
        label: "  دریافت کننده  ",
        name: "toPartyRelationshipId",
        options: organizationUnit.employees,
        required: true,
        optionLabelField: "name",
        optionIdField: "partyRelationshipId",
        type: "select",
        col: 3
    }

    ]



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

    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=FoodType", axiosKey
        ).then(res => {
            setFoodType(res.data.result)
        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/reservation/facilityType", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: {
                facilityTypeEnumId: "FTRestoran",
                isTable: false
            },
        }).then(res => {
            setFacilityType(res.data.list)
        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/reservation/facilityType", {
            headers: { 'api_key': localStorage.getItem('api_key') },
            params: {
                facilityTypeEnumId: "FTTable",
                isTable: true
            },
        }).then(res => {
            setFacilityTable(res.data.list)
        }).catch(err => {
        });


    }

    const getNowDate = () => {
        axios.get(SERVER_URL + "/rest/s1/evaluation/getNowDateTime", {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(resD => {

            let data = {
                partyId: "",
            }
            axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
                headers: { 'api_key': localStorage.getItem('api_key') }
            }).then(response => {
                const formDefaultValues = {
                    reserveDate: resD.data.nowDateTime,
                    fromPartyRelationshipId: response.data.result[0]?.name,
                    toPartyRelationshipId: response.data.result[0]?.partyRelationshipId
                }
                const DefaultValues = {
                    reserveDate: resD.data.nowDateTime,
                    fromPartyRelationshipId: response.data.result[0]?.name,
                }
                setFormValues(formDefaultValues)
                setFormDefaultValues(formDefaultValues)

            }).catch(err => {
            });

        }).catch(err => {
        });
    }

    const getMealList = () => {
        axios.get(SERVER_URL + "/rest/s1/reservation/FoodSchedule", {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            const mealId = 'mealId';
            const arrayUniqueByMealId = [...new Map(res.data.list.map(item =>
                [item[mealId], item])).values()];
            setMeal(arrayUniqueByMealId)

            const foodId = 'foodId';
            const arrayUniqueByFoodId = [...new Map(res.data.list.map(item =>
                [item[foodId], item])).values()];
            setFoodName(arrayUniqueByFoodId)

            setSchdul(res.data.list)

        }).catch(err => {

        });
    }

    useEffect(() => {
        getNowDate()
        getOrgInfo()
        getEnum()
        getMealList()
    }, [])



    const handleRemoveFood = (oldData) => {

        setLoading(true)
        return new Promise((resolve, reject) => {
            let sendData = {
                foodScheduleId: oldData.foodScheduleId,
                toPartyRelationshipId: oldData.toPartyRelationshipId
            }

            axios.post(SERVER_URL + "/rest/s1/reservation/deleteReservation", { data: sendData }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));


                }).catch(() => {
                    // dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در خذف اطلاعات!'));
                    // dispatch(SET_ALERT_CONTENT(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                    // dispatch(SET_ALERT_CONTENT(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                    reject('خطا در خذف اطلاعات!')
                });
        })

    }




    const handleReset = () => {
        setFormValues(formDefaultValues)
        setButtonName("افزودن")
    }

    const handleEditFood = (row) => {
        row.fromPartyRelationshipId = formDefaultValues.fromPartyRelationshipId
        setFormValues((prevState) => ({
            ...prevState,
            creditChargeId: row.creditChargeId,
            facilityId: row.facilityId,
            foodId: row.foodId,
            foodScheduleId: row.foodScheduleId,
            foodTypeEnumId: row.foodTypeEnumId,
            fromPartyRelationshipId: row.fromPartyRelationshipId,
            mealId: row.mealId,
            recievingDate: row.recievingDate,
            reservationNum: row.reservationNum,
            reserveDate: row.reserveDate,
            restaurant: row.restaurant,
            serveDate: row.serveDate,
            toPartyRelationshipId: row.toPartyRelationshipId
        }));
        setButtonName("ویرایش")

    }

    const getReserveList = () => {
        axios.get(SERVER_URL + "/rest/s1/reservation/Reservation", {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setTableContentFood(res.data.list)
            setLoading(false)
            setwaiting(false)
        }).catch(err => {

        });
    }

    useEffect(() => {
        getReserveList()
    }, [loading])


    useEffect(() => {
        let sendData = {
            toPartyRelationshipId: formValues.toPartyRelationshipId,
            reserveD: formValues.reserveDate,
            foodId: formValues.foodId
        }
        if (formValues.toPartyRelationshipId !== null && formValues.toPartyRelationshipId !== undefined) {
            axios.post(SERVER_URL + "/rest/s1/reservation/EmpClassForFood", { data: sendData }, axiosKey)
                .then((res) => {
                    let obj = {
                        FoodGroupResult: res.data.FoodGroupResult,
                        FoodCostResult: res.data.FoodCostResult,
                        creditAmountResult: res.data.creditAmountResult,
                    }
                    setFormValues((prevState) => ({
                        ...prevState,
                        creditAmount: res?.data?.creditAmountResult[0] ? res.data.creditAmountResult[0]?.creditAmount : ""
                    }));
                    setPartyClassDetail(obj)
                    setFormDefaultValues((prevState) => ({
                        ...prevState,
                        creditAmount: res?.data?.creditAmountResult[0] ? res.data.creditAmountResult[0]?.creditAmount : ""
                    }));

                }).catch(() => {
                    setFormValues((prevState) => ({
                        ...prevState,
                        creditAmount: ""
                    }));
                });
        }
    }, [formValues.toPartyRelationshipId])

    const submit = () => {
        let EmpClassData = {
            toPartyRelationshipId: formValues.toPartyRelationshipId,
            reserveD: formValues.reserveDate,
            foodId: formValues.foodId
        }

        setwaiting(true)
        axios.post(SERVER_URL + "/rest/s1/reservation/EmpClassForFood", { data: EmpClassData }, axiosKey)
            .then((res) => {

                let sendData = {
                    reserveDate: formValues.reserveDate,
                    recievingDate: formValues.recievingDate,
                    reservationNum: formValues.reservationNum,
                    facilityIdS: formValues.restaurant,
                    facilityIdR: formValues.facilityId,
                    fromPartyRelationshipId: partyRelationshipId,
                    toPartyRelationshipId: formValues.toPartyRelationshipId,
                    creditAmount: formValues.creditAmount,
                    mealId: formValues.mealId,
                    foodId: formValues.foodId,
                    pricingTypeEnumId: res.data.FoodGroupResult[0].pricingTypeEnumId,
                    employeeCost: res.data.FoodCostResult[0]?.employeeCost,
                    employerCost: res.data.FoodCostResult[0]?.employerCost,
                    payslipTypeId: res.data.FoodGroupResult[0]?.payslipTypeId,
                    edit: buttonName === "افزودن" ? false : true,
                    // title: "کسر از حقوق بابت رزرو غذا در تاریخ" + new Date(formValues.reserveDate).toISOString()
                }
                if (res.data.FoodGroupResult[0].pricingTypeEnumId === "PTCharge" || res.data.FoodGroupResult[0].pricingTypeEnumId === "PTSalary") {
                    if (res.data.FoodGroupResult[0].orderNum && res.data.FoodCostResult[0]?.employeeCost && res.data.FoodCostResult[0]?.employerCost) {
                        setwaiting(false)
                        if ((res.data.FoodGroupResult[0]?.minimumCredit <= formValues.creditAmount && formValues.reservationNum <= res.data.FoodGroupResult[0]?.orderNum) || (formValues.reservationNum <= res.data.FoodGroupResult[0]?.orderNum && res.data.FoodGroupResult[0].pricingTypeEnumId === "PTSalary")) {
                            axios.post(SERVER_URL + "/rest/s1/reservation/Reservation", { data: sendData }, axiosKey)
                                .then((res) => {
                                    if (res.data.result === "foodIsNotActive") {
                                        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'غذای انتخاب شده فعال نمی باشد'));

                                    }
                                    else {
                                        if (res.data.result === "Done")
                                            dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                                        else if (res.data.result === "anyMoney")
                                            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'موجودی حساب کافی نیست!'));
                                        else
                                            dispatch(setAlertContent(ALERT_TYPES.WARNING, 'تعداد غذای درخواستی موجود نمی باشد'));
                                    }
                                    setFormValues(formDefaultValues)
                                    setButtonName("افزودن")
                                    setwaiting(false)
                                    setLoading(true)

                                }).catch(() => {
                                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                                    setwaiting(false)
                                    setFormValues(formDefaultValues)
                                });
                        }
                        else {

                            if (res.data.FoodGroupResult[0].minimumCredit > formValues.creditAmount)
                                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'موجودی حساب کافی نیست!'));
                            if (formValues.reservationNum > res.data.FoodGroupResult[0].orderNum)
                                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'تعداد درخواستی غذا مجاز نمی باشد!'));
                            if (formValues.reservationNum > res.data.FoodGroupResult[0].orderNum && res.data.FoodGroupResult[0].minimumCredit > formValues.creditAmount)
                                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'تعداد درخواستی غذا مجاز نمی باشد و موجودی حساب کافی نیست!'));


                            setwaiting(false)

                        }
                    }
                    else if (!res.data.FoodCostResult[0]?.employeeCost && !res.data.FoodCostResult[0]?.employerCost) {
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, 'این غذا در برنامه غذایی دریافت کننده تعریف نشده است!'));
                        setwaiting(false)
                        setButtonName("افزودن")
                        setFormValues(formDefaultValues)


                    }
                }
                else {
                    dispatch(setAlertContent(ALERT_TYPES.WARNING, 'نحوه کسر هزینه این غذا مشخص نشده است!'));
                    setwaiting(false)
                }

            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.WARNING, 'فرد دریافت کننده  عضو گروه غذایی نیست!'));

                setFormValues(formDefaultValues)
                setwaiting(false)
                setButtonName("افزودن")


            });

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
                                {checkPermis("feedingAutomation/foodReserve/add", datas) ? <Button type="submit" role="primary" endIcon={waiting ? <CircularProgress size={20} /> : null}>{buttonName}</Button> : ""}
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}

                        />
                        <TablePro
                            title="   لیست  رزروها   "
                            columns={tableColsFood}
                            rows={tableContentFood}
                            editCallback={handleEditFood}
                            edit={checkPermis("feedingAutomation/foodReserve/edit", datas) ? "callback" : false}
                            removeCallback={checkPermis("feedingAutomation/foodReserve/delete", datas) ? handleRemoveFood : ""}
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


export default FoodReserveForm;











