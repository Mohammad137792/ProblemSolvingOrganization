import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Tooltip } from '@material-ui/core';
import FormPro from 'app/main/components/formControls/FormPro';
import TablePro from 'app/main/components/TablePro';
import ActionBox from 'app/main/components/ActionBox';
import { SERVER_URL } from 'configs';
import { ALERT_TYPES, setAlertContent } from 'app/store/actions';


const FoodSeting = (props) => {
    const { partyClassificationId, setLoading } = props
    const [tableContent, setTableContent] = useState([]);
    const [loadingFoodSeting, setLoadingFoodSeting] = useState(false)
    const [formValues, setFormValues] = useState([]);
    const [reservationType, setReservationType] = useState([]);
    const [foodType, setFoodType] = useState([]);
    const [foodName, setFoodName] = useState([]);
    const datas = useSelector(({ fadak }) => fadak);
    const dispatch = useDispatch()
    const myRef = useRef(null)

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }



    const tableCols = [
        {
            label: " نوع تغذیه ",
            name: "foodTypeEnumId",
            type: "select",
            required: true,
            options: foodType,
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 4
        }, {
            label: "    نام تغذیه ",
            required: true,
            name: "foodId",
            options: foodName,
            optionLabelField: "foodName",
            optionIdField: "foodId",
            type: "select",
            filterOptions: options => formValues["foodTypeEnumId"] ? options.filter(o => o["foodTypeEnumId"]?.indexOf(formValues["foodTypeEnumId"]) >= 0) : options,
            col: 4
        }, {
            label: "  نوع رزرو  ",
            name: "reservingtypeEnumId",
            required: true,
            options: reservationType,
            optionLabelField: "description",
            optionIdField: "enumId",
            type: "select",
            col: 4

        }
        , {
            label: "  قیمت سهم کارفرما  ",
            name: "employerCost",
            type: "number",
            required: true,
            col: 4

        }
        , {
            label: "  قیمت سهم کارگر  ",
            name: "employeeCost",
            type: "number",
            required: true,
            col: 4

        }

        , {
            label: "    از تاریخ  ",
            name: "fromDate",
            type: "date",
            required: true,
            col: 4

        }
        , {
            label: "     تا تاریخ  ",
            name: "thruDate",
            type: "date",
            col: 4

        }

    ]

    const getEnum = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=FoodType", axiosKey
        ).then(res => {
            setFoodType(res.data.result)
        }).catch(err => {
        });

        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=ReservationType", axiosKey
        ).then(res => {
            setReservationType(res.data.result)
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

    useEffect(() => {
        getEnum()
        getFoodList()
    }, [])

    const handleRemove = (oldData) => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/rest/s1/reservation/deleteFoodSet?foodId=${oldData?.foodId}&partyClassificationId=${oldData?.partyClassificationId}&fromDate=${oldData?.fromDate}`, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                    setLoading(true)
                    setLoadingFoodSeting(true)
                }).catch(() => {
                    reject('خطا در خذف اطلاعات!')
                });
            setFormValues([])

        })

    }

    const getfoodList = () => {
        axios.get(SERVER_URL + "/rest/s1/reservation/getFood?partyClassificationId=" + partyClassificationId, {
            headers: { 'api_key': localStorage.getItem('api_key') },

        }).then(res => {
            setTableContent(res.data.result)
            setLoadingFoodSeting(false)
        }).catch(err => {

        });
    }

    useEffect(() => {
        getfoodList()
    }, [loadingFoodSeting, partyClassificationId])


    return (
        <Card >
            <CardContent>
                <TablePro
                    title="   لیست  تنظیمات   "
                    columns={tableCols}
                    rows={tableContent}
                    setRows={setTableContent}
                    loading={loadingFoodSeting}
                    add="external"
                    addForm={<Form formValues={formValues} setFormValues={setFormValues} foodName={foodName} foodType={foodType} partyClassificationId={partyClassificationId} reservationType={reservationType} loadingFoodSeting={loadingFoodSeting} setLoadingFoodSeting={setLoadingFoodSeting} setLoading={setLoading} />}
                    edit="external"
                    editForm={<Form formValues={formValues} setFormValues={setFormValues} editing={true} foodName={foodName} foodType={foodType} partyClassificationId={partyClassificationId} reservationType={reservationType} loadingFoodSeting={loadingFoodSeting} setLoadingFoodSeting={setLoadingFoodSeting} setLoading={setLoading} />}
                    removeCallback={handleRemove}
                />
            </CardContent>
        </Card>
    )
}


export default FoodSeting;


function Form({ editing = false, ...restProps }) {
    const { formValues, setFormValues, handleClose, foodType, foodName, partyClassificationId, reservationType, loading, setLoading, loadingFoodSeting, setLoadingFoodSeting } = restProps;
    const [formValidationVerif, setFormValidationVerif] = useState({});
    const dispatch = useDispatch();

    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }
    const formStructure = [{
        label: " نوع تغذیه ",
        name: "foodTypeEnumId",
        type: "select",
        required: true,
        options: foodType,
        optionLabelField: "description",
        optionIdField: "enumId",
        changeCallback: () => setFormValues(prevState => ({ ...prevState, foodId: "" })),
        col: 4
    }, {
        label: "    نام تغذیه ",
        required: true,
        name: "foodId",
        options: foodName,
        optionLabelField: "foodName",
        optionIdField: "foodId",
        disabled: formValues["foodTypeEnumId"] ? false : true,
        type: "select",
        filterOptions: options => formValues["foodTypeEnumId"] ? options.filter(o => o["foodTypeEnumId"]?.indexOf(formValues["foodTypeEnumId"]) >= 0) : options,
        col: 4
    }, {
        label: "  نوع رزرو  ",
        name: "reservingtypeEnumId",
        required: true,
        name: "reservingtypeEnumId",
        options: reservationType,
        optionLabelField: "description",
        optionIdField: "enumId",
        type: "select",
        col: 4

    }
        , {
        label: "  قیمت سهم کارفرما  ",
        name: "employerCost",
        type: "number",
        required: true,
        col: 4

    }
        , {
        label: "  قیمت سهم کارگر  ",
        name: "employeeCost",
        type: "number",
        required: true,
        col: 4

    }

        , {
        label: "  محدوده زمانی فعالیت از تاریخ  ",
        name: "fromDate",
        type: "date",
        required: true,
        maxDate: formValues.thruDate ?? "",
        col: 4

    }
        , {
        label: "  محدوده زمانی فعالیت تا تاریخ  ",
        name: "thruDate",
        minDate: formValues.fromDate ?? "",
        type: "date",
        col: 4

    }

    ]


    const handleReset = () => {
        setFormValues({})
        handleClose()
    }

    const submit = () => {
        formValues.partyClassificationId = partyClassificationId
        axios.post(SERVER_URL + "/rest/s1/reservation/foodSet", { data: formValues }, axiosKey)
            .then((res) => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ثبت شد.!'));
                setLoadingFoodSeting(true)
                setLoading(true)
                setFormValues([])
            }).catch(() => {
                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            })
        handleReset()

    }


    return (


        <FormPro
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidationVerif}
            setFormValidation={setFormValidationVerif}
            append={formStructure}
            submitCallback={() => {
                submit()
            }}

            resetCallback={handleReset}
            actionBox={<ActionBox>
                <Button type="submit" role="primary"

                >{editing ? "ویرایش" : "افزودن"}</Button>
                <Button type="reset" role="secondary">لغو</Button>
            </ActionBox>}

        />
    )
}









