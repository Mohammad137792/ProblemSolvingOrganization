import React, { useState, useEffect, createRef } from 'react';
import { Box, Button, CardContent, CardHeader, Collapse, Tooltip, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import FormPro from 'app/main/components/formControls/FormPro';
import checkPermis from 'app/main/components/CheckPermision';
import { SERVER_URL } from 'configs';





export default function FoodReserveReportForm(props) {
    const { partyRelationshipId, salaryGroup, partyId } = props

    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [organizationUnit, setOrganizationUnit] = useState([]);
    const [foodMeal, setMeal] = useState([]);
    const datas = useSelector(({ fadak }) => fadak);
    const [foodType, setFoodType] = useState([]);
    const [facilityType, setFacilityType] = useState([]);
    const [facilityTable, setFacilityTable] = useState([]);
    const [foodName, setFoodName] = useState([]);
    const [schdul, setSchdul] = useState([]);
    const [formValues, setFormValues] = useState({})
    const [formValuesCost, setFormValuesCost] = useState({})
    const [foodGroup, setFoodGroup] = useState([]);
    const formStructureCost = [{
        label: " مجموع قیمت سهم کارفرما  ",
        name: "allEmployerCost",
        type: "text",
        col: 6

    },
    {
        label: " مجموع قیمت سهم کارگر ",
        name: "allEmployeeCost",
        type: "text",
        col: 6
    }
    ]
    const tableCols = [{
        label: " وعده ",
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
        options: foodType,
        optionLabelField: "description",
        optionIdField: "enumId",
        col: 3
    },
    {
        label: "  نام تغذیه ",
        name: "foodId",
        options: foodName,
        optionLabelField: "foodName",
        optionIdField: "foodId",
        type: "select",
        col: 3,
    }, {
        name: "companyName",
        label: "نام شرکت",
        type: "select",
        options: organizationUnit.subOrgans,
        optionLabelField: "companyName",
        optionIdField: "companyPartyId",
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
        name: "partyClassificationId",
        label: "نام گروه",
        options: foodGroup,
        type: "select",
        optionLabelField: "description",
        optionIdField: "partyClassificationId",
    },
        , {
        name: "toPartyRelationshipId",
        label: "نام پرسنل",
        options: organizationUnit.employees,
        optionLabelField: "name",
        optionIdField: "partyRelationshipId",
        type: "select",
    },
    {
        name: "reserveDate",
        label: "تاریخ رزرو",
        type: "date",
    },
        , {
        name: "recievingDate",
        label: "تاریخ تحویل",
        type: "date",
    },
    {
        name: "reservationNum",
        label: "تعداد کل رزرو شده",
        type: "number",
    }]
    const axiosKey = {
        headers: {
            api_key: localStorage.getItem("api_key"),
        },
    };



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

            })
            .catch(() => { });
    }

    useEffect(() => {
        getMealList()
        getEnum()
        getOrgInfo()
    }, [])
    const getGorupList = () => {
        axios.get(SERVER_URL + "/rest/s1/reservation/getFoodGroup", {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setFoodGroup(res.data.list)
        }).catch(err => {

        });
    }

    useEffect(() => {
        getGorupList()
    }, [])

    const getReserveList = (filterParam) => {
        axios.get(SERVER_URL + "/rest/s1/reservation/foodReserveReport", {
            headers: axiosKey.headers,
            params: {
                mealId: filterParam.mealId ? filterParam.mealId : "",
                foodId: filterParam.foodId ? filterParam.foodId : "",
                foodTypeEnumId: filterParam.foodTypeEnumId ? filterParam.foodTypeEnumId : "",
                restaurant: filterParam.restaurant ? filterParam.restaurant : "",
                thruReserveDate: filterParam.thruReserveDate ? filterParam.thruReserveDate : "",
                fromReserveDate: filterParam.fromReserveDate ? filterParam.fromReserveDate : "",
                thruRecievingDate: filterParam.thruRecievingDate ? filterParam.thruRecievingDate : "",
                fromRecievingDate: filterParam.fromRecievingDate ? filterParam.fromRecievingDate : "",
                facilityId: filterParam.facilityId ? filterParam.facilityId : "",
                reservationNum: filterParam.reservationNum ? filterParam.reservationNum : "",
                toPartyRelationshipId: filterParam.toPartyRelationshipId ? filterParam.toPartyRelationshipId : "",
                companyName: filterParam.companyName ? filterParam.companyName : "",
                partyClassificationId: filterParam.partyClassificationId ? filterParam.partyClassificationId : ""

            }
        }).then(res => {
            setTableContent(res.data.list)
            setFormValuesCost(res.data.allCostResult)
            setLoading(false)
        }).catch(err => {
        });
    }

    useEffect(() => {
        getReserveList([])
    }, [loading])


    const submitSearch = () => {
        getReserveList(formValues)

    }
    const handleReset = () => {
        getReserveList([])

    }
    return (
        <Box p={2}>
            <Card>
                <TablePro
                    title="لیست غذاهای رزرو شده"
                    columns={tableCols}
                    rows={tableContent}
                    loading={loading}
                    filter="external"
                    filterForm={
                        <SearchForm datas={datas} foodMeal={foodMeal} foodType={foodType} formValues={formValues} organizationUnit={organizationUnit} foodGroup={foodGroup}
                            setFormValues={setFormValues} facilityType={facilityType} schdul={schdul} submitSearch={submitSearch} handleReset={handleReset}
                            foodMeal={foodMeal} foodName={foodName} facilityTable={facilityTable} datas={datas} />
                    }
                    exportCsv={checkPermis("feedingAutomation/foodReserveReport/getExcel", datas) ? "لیست غذاهای رزرو شده" : false}
                />
                <FormPro formValues={formValuesCost}
                    setFormValues={setFormValuesCost}
                    prepend={formStructureCost}

                />
            </Card>
        </Box>
    )
}




function SearchForm(props) {
    const { datas, foodMeal, foodType, facilityType, schdul, foodName, formValues, setFormValues, submitSearch, organizationUnit, handleReset, foodGroup } = props
    const [formValidation, setFormValidation] = useState({});
    const formStructure = [
        , {
            label: " وعده ",
            name: "mealId",
            type: "select",
            options: foodMeal,
            optionLabelField: "mealName",
            optionIdField: "mealId",
            col: 4

        },
        {
            label: " نوع تغذیه ",
            name: "foodTypeEnumId",
            type: "select",
            options: foodType,
            optionLabelField: "description",
            optionIdField: "enumId",
            changeCallback: () => setFormValues(prevState => ({ ...prevState, foodId: "" })),
            filterOptions: options => formValues["mealId"] ? options.filter(o => schdul.filter(o1 => o1.mealId === formValues["mealId"]).find(o1 => (o1.foodTypeEnumId === o.enumId))) : options,
            col: 4
        },
        {
            label: "  نام تغذیه ",
            name: "foodId",
            options: foodName,
            optionLabelField: "foodName",
            optionIdField: "foodId",
            type: "select",
            col: 4,
            filterOptions: options => formValues["foodTypeEnumId"] ? options.filter(o => o["foodTypeEnumId"]?.indexOf(formValues["foodTypeEnumId"]) >= 0) : options,
        },
        , {
            name: "companyName",
            label: "نام شرکت",
            type: "select",
            options: organizationUnit.subOrgans,
            optionLabelField: "companyName",
            optionIdField: "companyPartyId",
            changeCallback: () => setFormValues(prevState => ({ ...prevState, restaurant: "" })),
            col: 4
        },
        {
            label: "  رستوران  ",
            name: "restaurant",
            options: facilityType,
            type: "select",
            optionLabelField: "facilityName",
            optionIdField: "facilityId",
            filterOptions: options => formValues["companyName"] ? options.filter(o => o["ownerPartyId"]?.indexOf(formValues["companyName"]) >= 0) : options,
            col: 4

        }

        , {
            name: "partyClassificationId",
            label: "نام گروه",
            options: foodGroup,
            type: "select",
            optionLabelField: "description",
            optionIdField: "partyClassificationId",
            col: 4
        }, {
            name: "toPartyRelationshipId",
            label: "نام پرسنل",
            options: organizationUnit.employees,
            optionLabelField: "name",
            optionIdField: "partyRelationshipId",
            type: "select",
            col: 4
        }, {
            name: "fromReserveDate",
            label: "تاریخ رزرو از",
            type: "date",
            col: 4
        }
        , {
            name: "thruReserveDate",
            label: "تاریخ رزرو تا",
            type: "date",
            col: 4
        }
        , {
            name: "fromRecievingDate",
            label: "تاریخ تحویل از",
            type: "date",
            col: 4
        }, {
            name: "thruRecievingDate",
            label: "تاریخ تحویل تا",
            type: "date",
            col: 4
        }, {
            name: "reservationNum",
            label: "تعداد کل رزرو شده",
            type: "number",
            col: 4
        }]



    return (
        <FormPro formValues={formValues} setFormValues={setFormValues}
            formValidation={formValidation} setFormValidation={setFormValidation}
            prepend={formStructure}
            actionBox={<ActionBox>

                {checkPermis("feedingAutomation/foodReserveReport/filter", datas) ? <Button type="submit" role="primary">جستجو</Button> : ""}
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}
            submitCallback={submitSearch} resetCallback={handleReset}
        />
    )
}