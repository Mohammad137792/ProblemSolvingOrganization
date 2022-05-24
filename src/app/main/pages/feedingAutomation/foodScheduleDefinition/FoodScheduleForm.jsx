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
import CircularProgress from "@material-ui/core/CircularProgress";

const FoodScheduleForm = (props) => {

    const scrollToRef1 = () => myRef.current.scrollIntoView()
    const [formValidation, setFormValidation] = useState({});
    const [tableContentFood, setTableContentFood] = useState([]);
    const [loading, setLoading] = useState(true)
    const [buttonName, setButtonName] = useState("افزودن")
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [foodType, setFoodType] = useState([]);
    const [foodName, setFoodName] = useState([]);
    const [foodAttribute, setFoodAttribute] = useState([]);
    const [facilityType, setFacilityType] = useState([]);
    const [foodMeal, setMeal] = useState([]);
    const [facilityTable, setFacilityTable] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch()
    const myRef = useRef(null)
    const [waiting, setwaiting] = useState(false)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [
        , {
            label: "   تاریخ سرو ",
            name: "serveDate",
            type: "date",
            required: true,
            col: 3
        },
        {
            label: " نوع تغذیه ",
            name: "foodTypeEnumId",
            type: "select",
            required: true,
            options: foodType,
            optionLabelField: "description",
            changeCallback: () => setFormValues(prevState => ({ ...prevState, foodId: "" })),
            optionIdField: "enumId",
            col: 3
        }, {
            label: "  نام تغذیه ",
            required: true,
            name: "foodId",
            options: foodName,
            optionLabelField: "foodName",
            optionIdField: "foodId",
            type: "select",
            col: 3,
            filterOptions: options => formValues["foodTypeEnumId"] ? options.filter(o => o["foodTypeEnumId"]?.indexOf(formValues["foodTypeEnumId"]) >= 0) : options,
        },
        {
            label: "  تعداد  ",
            name: "foodNum",
            type: "number",
            col: 3

        }
        , {
            label: "  نام شرکت  ",
            required: true,
            options: organizationUnit.subOrgans,
            optionLabelField: "companyName",
            optionIdField: "companyPartyId",
            name: "companyName",
            changeCallback: () => setFormValues(prevState => ({ ...prevState, facilityId: "" })),
            type: "select",
            col: 3

        }
        , {
            label: " رستوران ",
            required: true,
            name: "facilityId",
            type: "select",
            options: facilityType,
            optionLabelField: "facilityName",
            optionIdField: "facilityId",
            filterOptions: options => formValues["companyName"] ? options.filter(o => o["ownerPartyId"]?.indexOf(formValues["companyName"]) >= 0) : options,
            col: 3

        }
        , {
            label: " وعده ",
            required: true,
            name: "mealId",
            type: "select",
            options: foodMeal,
            optionLabelField: "mealName",
            optionIdField: "mealId",
            col: 3

        }

        , {
            label: " رزرو غذا از ساعت ",
            name: "fromDate",
            type: "time",
            col: 3

        }
        , {
            label: " رزرو غذا تا ساعت ",
            name: "thruDate",
            type: "time",
            col: 3

        }
        , {
            label: " ویژگی های برنامه غذایی ",
            name: "foodAttributeEumId",
            type: "multiselect",
            col: 3,
            options: foodAttribute,
            optionLabelField: "description",
            optionIdField: "enumId",

        }
    ]

    const tableColsFood = [
        , {
            label: "   تاریخ سرو ",
            name: "serveDate",
            type: "date",
            required: true,
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
        }, {
            label: "  نام تغذیه ",
            required: true,
            name: "foodId",
            options: foodName,
            optionLabelField: "foodName",
            optionIdField: "foodId",
            type: "select",
            col: 3
        }, {
            label: "  تعداد   ",
            required: true,
            name: "foodNum",
            type: "number",
            col: 3

        }, {
            label: "  نام شرکت  ",
            required: true,
            name: "companyName",
            type: "select",
            options: organizationUnit.subOrgans,
            optionLabelField: "companyName",
            optionIdField: "companyPartyId",
            col: 3

        }
        , {
            label: " رستوران ",
            required: true,
            name: "facilityId",
            type: "select",
            options: facilityType,
            optionLabelField: "description",
            optionIdField: "facilityId",
            col: 3

        }
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
        , {
            label: " رزرو غذا از ساعت ",
            name: "fromDate",
            type: "time",
            col: 3

        }
        , {
            label: " رزرو غذا تا ساعت ",
            name: "thruDate",
            type: "time",
            col: 3

        }
        , {
            label: " ویژگی های برنامه غذایی ",
            name: "foodAttributeEumId",
            type: "multiselect",
            col: 3,
            options: foodAttribute,
            optionLabelField: "description",
            optionIdField: "enumId",

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
                    subOrgans: res.data.data.companies,
                };
                setOrganizationUnit(orgMap);

            })
            .catch(() => { });
    }

    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=FoodType", axiosKey
        ).then(res => {
            setFoodType(res.data.result)
        }).catch(err => {
        });



        axios.get(SERVER_URL + "/rest/s1/reservation/facilityType?facilityTypeEnumId=FTRestoran", axiosKey
        ).then(res => {
            setFacilityType(res.data.list)
        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/reservation/facilityType?facilityTypeEnumId=FTTable", axiosKey
        ).then(res => {
            setFacilityTable(res.data.list)
        }).catch(err => {
        });


    }
    const getFoodList = () => {

        axios.get(SERVER_URL + "/rest/s1/reservation/food", {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setFoodName(res.data.list)
        }).catch(err => {

        });

    }

    const getMealList = () => {

        axios.get(SERVER_URL + "/rest/s1/reservation/meal", {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setMeal(res.data.list)

        }).catch(err => {

        });
    }

    useEffect(() => {
        getOrgInfo()
        getEnum()
        getFoodList()
        getMealList()

    }, [])


    const getFoodScheduleList = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=FoodAttribute", axiosKey
        ).then(resE => {
            setFoodAttribute(resE.data.result)

            axios.get(SERVER_URL + "/rest/s1/reservation/FoodSchedule", {
                headers: { 'api_key': localStorage.getItem('api_key') },

            }).then(res => {
                setTableContentFood(res.data.list)
                setLoading(false)
                setwaiting(false)
            }).catch(err => {

            });

        }).catch(err => {
        });
    }


    useEffect(() => {
        getFoodScheduleList()
    }, [loading])


    const submit = () => {
        setwaiting(true)
        if (buttonName === "افزودن") {
            axios.post(SERVER_URL + "/rest/s1/reservation/FoodSchedule", { data: formValues }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setLoading(true)
                    setFormValues([])
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setwaiting(false)
                    setFormValues([])


                });
        }
        else {
            axios.put(SERVER_URL + "/rest/s1/reservation/FoodSchedule", { data: formValues }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
                    setLoading(true)
                    setFormValues([])

                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setFormValues([])
                    setwaiting(false)

                });
            setButtonName("افزودن")

        }

    }

    const handleRemoveFood = (oldData) => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/reservation/FoodSchedule?foodScheduleId=" + oldData.foodScheduleId, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                }).catch((erro) => {
                    reject("امکان حذف این برنامه غذایی وجود ندارد.")

                })
                setButtonName("افزودن")
                setFormValues([])

        })
        
    }


    const handleReset = () => {
        setFormValues([])
        setButtonName("افزودن")
    }

    const handleEditFood = (row) => {
        setFormValues(row)
        setButtonName("ویرایش")
        formValues.foodScheduleId = row.foodScheduleId

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
                                {checkPermis("feedingAutomation/foodScheduleDefinition/save", datas) ? <Button type="submit" role="primary">{buttonName}</Button> : ""}
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}

                        />
                        <TablePro
                            title="   لیست  برنامه های غذایی   "
                            columns={tableColsFood}
                            rows={tableContentFood}
                            editCallback={handleEditFood}
                            edit={checkPermis("feedingAutomation/foodScheduleDefinition/edit", datas) ? "callback" : false}
                            removeCallback={checkPermis("feedingAutomation/foodScheduleDefinition/delete", datas) ? handleRemoveFood : ""}
                            setTableContent={setTableContentFood}
                            loading={loading}
                        />
                    </CardContent>



                </Card>
            </Box>
        </Card>
    )
}


export default FoodScheduleForm;











