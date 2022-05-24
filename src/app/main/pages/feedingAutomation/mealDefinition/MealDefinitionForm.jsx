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
import CircularProgress from "@material-ui/core/CircularProgress";

const MealDefinitionForm = (props) => {

    const scrollToRef1 = () => myRef.current.scrollIntoView()
    const [formValidation, setFormValidation] = useState({});
    const [tableContentFood, setTableContentFood] = useState([]);
    const [loading, setLoading] = useState(true)
    const [buttonName, setButtonName] = useState("افزودن")
    const [formValues, setFormValues] = useState([]);
    const [waiting, setwaiting] = useState(false)
    const dispatch = useDispatch()
    const myRef = useRef(null)
    const datas = useSelector(({ fadak }) => fadak);

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }



    const tableColsFood = [
        { name: "mealName", label: " نام وعده ", type: "text", style: { minWidth: "130px" } },
        { name: "fromDate", label: "  زمان سرو از ", type: "time", style: { minWidth: "130px" } },
        { name: "thruDate", label: "  زمان سرو تا ", type: "time", style: { minWidth: "130px" } },
        { name: "mealStatusId", label: "  وضعیت  ", type: "indicator", style: { minWidth: "130px" }, indicator: { false: "MSNotActive", true: "MSActive" } },

    ]


    const formStructure = [{
        label: "نام وعده ",
        name: "mealName",
        type: "text",
        required: true,
        col: 3
    }, {
        label: "  زمان سرو از  ",
        name: "fromDate",
        type: "time",
        required: true,
        col: 3
    }, {
        label: "  زمان سرو تا   ",
        name: "thruDate",
        type: "time",
        required: true,
        col: 3

    }
        , {
        label: " وضعیت ",
        name: "mealStatusId",
        type: "indicator",
        col: 3,
        indicator: { false: "MSNotActive", true: "MSActive" }

    }
    ]


    const getMealList = () => {

        axios.get(SERVER_URL + "/rest/s1/reservation/meal", {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setTableContentFood(res.data.list)
            setLoading(false)
            setwaiting(false)
        }).catch(err => {

        });

    }



    useEffect(() => {
        getMealList([]);
    }, [loading]);


    // const submit = () => {
    //     setwaiting(true)
    //     function toTimestamp(strDate) {
    //         var datum = Date.parse(strDate);
    //         return datum / 1000;
    //     }

    //     let fromD = new Date(formValues.fromDate).toISOString()
    //     let fromT = new Date(formValues.fromDate).toLocaleTimeString('en-IR').split(" ")[0]
    //     let pAT = new Date(formValues.fromDate).toLocaleTimeString('en-IR').split(" ")[1]
    //     let thruD = new Date(formValues.thruDate).toISOString()
    //     let thruT = new Date(formValues.thruDate).toLocaleTimeString('en-IR').split(" ")[0]
    //     let pAT2 = new Date(formValues.thruDate).toLocaleTimeString('en-IR').split(" ")[1]
    //     let fromTime = pAT === "PM" && parseInt(fromT.split(":")[0]) !== 12 ? ((parseInt(fromT.split(":")[0]) + 12) + ":" + fromT.split(":")[1] + ":" + fromT.split(":")[2]) : pAT === "AM" && parseInt(fromT.split(":")[0]) === 12 ? ("00" + ":" + fromT.split(":")[1] + ":" + fromT.split(":")[2]) : fromT
    //     let thruTime = pAT2 === "PM" && parseInt(thruT.split(":")[0]) !== 12 ? ((parseInt(thruT.split(":")[0]) + 12) + ":" + thruT.split(":")[1] + ":" + thruT.split(":")[2]) : pAT2 === "AM" && parseInt(thruT.split(":")[0]) === 12 ? ("00" + ":" + thruT.split(":")[1] + ":" + thruT.split(":")[2]) : thruT
    //     let fromDate = fromD.split("T")[0] + " " + fromTime
    //     let thruDate = thruD.split("T")[0] + " " + thruTime

    //     if (buttonName === "افزودن") {
    //         axios.post(SERVER_URL + "/rest/s1/reservation/meal", { fromDate: fromDate, thruDate: thruDate, mealName: formValues.mealName, mealStatusId: formValues.mealStatusId ? formValues.mealStatusId : "MSNotActive" }, axiosKey)
    //             .then((res) => {
    //                 dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
    //                 setLoading(true)
    //                 setwaiting(false)
    //                 setFormValues([])

    //             }).catch(() => {
    //                 dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
    //                 setwaiting(false)
    //             });
    //     }
    //     else {
    //         axios.put(SERVER_URL + "/rest/s1/reservation/meal", { mealId: formValues.mealId, fromDate: fromDate, thruDate: thruDate, mealName: formValues.mealName, mealStatusId: formValues.mealStatusId }, axiosKey)
    //             .then((res) => {
    //                 dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
    //                 setLoading(true)
    //                 setwaiting(false)
    //                 setFormValues([])

    //             }).catch(() => {
    //                 dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
    //                 setwaiting(false)
    //                 setButtonName("افزودن")
    //             });
    //         setButtonName("افزودن")

    //     }

    // }

    const submit = () => {
        setwaiting(true)
        if (buttonName === "افزودن") {
            axios.post(SERVER_URL + "/rest/s1/reservation/meal", { data: formValues }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setLoading(true)
                    setFormValues([])
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setwaiting(false)

                });
        }
        else {
            axios.put(SERVER_URL + "/rest/s1/reservation/meal", { data: formValues }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
                    setLoading(true)
                    setFormValues([])
                }).catch(() => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setwaiting(false)
                });
            setButtonName("افزودن")

        }

    }

    const handleRemoveFood = (oldData) => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/reservation/meal?mealId=" + oldData.mealId, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                }).catch((erro) => {
                    reject("حذف اطلاعات با خطا مواجه شد.")
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
        formValues.foodId = row.foodId

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
                                {checkPermis("feedingAutomation/mealDefinition/addMeal", datas) ? <Button type="submit" role="primary" disabled={waiting} endIcon={waiting ? <CircularProgress size={20} /> : null}>{buttonName}</Button> : ""}
                                <Button type="reset" role="secondary">لغو</Button>
                            </ActionBox>}

                        />
                        <TablePro
                            title="   لیست  غذاها   "
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
            </Box>
        </Card>
    )
}


export default MealDefinitionForm;











