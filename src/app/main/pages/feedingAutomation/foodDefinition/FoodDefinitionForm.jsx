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

const CommitteeForm = (props) => {

    const scrollToRef1 = () => myRef.current.scrollIntoView()
    const [formValidation, setFormValidation] = useState({});
    const [tableContentFood, setTableContentFood] = useState([]);
    const [loading, setLoading] = useState(true)
    const [buttonName, setButtonName] = useState("افزودن")
    const [foodType, setFoodType] = useState([]);
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





    const tableColsFood = [{
        label: " کد ",
        name: "foodCode",
        type: "text",
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
    },
    {
        label: " نام تغذیه ",
        name: "foodName",
        type: "text",
        required: true,
        col: 3
    },
    {
        label: " مواد تشکیل دهنده ",
        name: "ingredients",
        type: "text",
        col: 3
    },
    {
        label: " میزان کالری ",
        name: "caloryRate",
        type: "number",
        col: 3
    }, {
        label: "   فعال از تاریخ ",
        name: "fromDate",
        type: "date",
        col: 3
    }, {
        label: "  فعال تا تاریخ  ",
        name: "thruDate",
        type: "date",
        col: 3

    }

    ]


    const formStructure = [{
        label: " کد ",
        name: "foodCode",
        type: "text",
        required: true,
        validator: values => {
            const rule = "^(^[A-Za-z0-9]*$)"
            const foodCode = values.foodCode;
            const message = " کد وارد شده باید شامل حروف لاتین و اعداد باشد!";
            return new Promise(resolve => {
                if (foodCode.match(rule)) {
                    resolve({ error: false, helper: "" })
                } else {
                    resolve({ error: true, helper: message })
                }
            })
        },
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
        label: " نام تغذیه ",
        name: "foodName",
        type: "text",
        required: true,
        col: 3
    }, 
    {
        type: "group",
        items: [{
            label: " میزان کالری ",
            name: "caloryRate",
            type: "number",
            // changeCallback: () => setFormValues(prevState => ({ ...prevState, caloryRate:formValues.caloryRate+"kcal" })),
       
        }, {
            type: "text",
            label: "kcal",
            disabled: true,
            disableClearable: true,
            style: { width: "30%" }
        }],
        col: 3
    },{
        label: "   فعال از تاریخ ",
        name: "fromDate",
        type: "date",
        required: true,
        // maxDate: formValues.thruDate ?? "",
        col: 3
    }, {
        label: "  فعال تا تاریخ  ",
        name: "thruDate",
        type: "date",
        // minDate: formValues.fromDate ?? "",
        col: 3

    },
    {
        label: " مواد تشکیل دهنده ",
        name: "ingredients",
        type: "textarea",
        col: 6
    },

    ]


    const getEnum = () => {

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=FoodType", axiosKey
        ).then(res => {
            setFoodType(res.data.result)

        }).catch(err => {
        });



    }

    useEffect(() => {
        getEnum();

    }, []);

    const getFoodList = () => {

        axios.get(SERVER_URL + "/rest/s1/reservation/food", {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setTableContentFood(res.data.list)
            setLoading(false)
        }).catch(err => {

        });

    }



    useEffect(() => {
        getFoodList([]);
    }, [loading]);





    const submit = () => {
        setLoading(true)
        setwaiting(true)
        if (buttonName === "افزودن") {
            axios.post(SERVER_URL + "/rest/s1/reservation/food", { data: formValues }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setwaiting(false)
                    setFormValues({})

                })
                .catch((err) => {
                    if (err.response.status === 400) {

                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'کد غذا تکراری است!'));
                    }
                    else
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setwaiting(false)


                });
        }
        else {
            axios.put(SERVER_URL + "/rest/s1/reservation/food", { data: formValues }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
                    setwaiting(false)
                    setFormValues({})
                }).catch((err) => {
                    if (err.response.status === 400) {

                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'کد وارد شده تکراری است!'));
                    }
                    else
                        dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setwaiting(false)

                });
            setButtonName("افزودن")

        }

    }



    const handleRemoveFood = (oldData) => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/reservation/food?foodId=" + oldData.foodId, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));

                    setLoading(false)

                }).catch((erro) => {
                    reject("امکان حذف این غذا وجود ندارد.")
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
                                {checkPermis("feedingAutomation/foodDefinition/save", datas) ? <Button type="submit" role="primary" disabled={waiting} endIcon={waiting ? <CircularProgress size={20} /> : null}>{buttonName}</Button> : ""}

                                <Button type="reset" role="secondary">لغو</Button>


                            </ActionBox>}

                        />
                        <TablePro
                            title="   لیست  غذاها   "
                            columns={tableColsFood}
                            rows={tableContentFood}
                            editCallback={handleEditFood}
                            edit={checkPermis("feedingAutomation/foodDefinition/edit", datas) ? "callback" : false}
                            removeCallback={checkPermis("feedingAutomation/foodDefinition/delete", datas) ? handleRemoveFood : ""}
                            setTableContent={setTableContentFood}
                            loading={loading}
                        />
                    </CardContent>



                </Card>
            </Box>
        </Card>
    )
}


export default CommitteeForm;











