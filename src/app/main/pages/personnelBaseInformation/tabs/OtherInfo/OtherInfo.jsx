import React, { useState, useEffect, createRef } from 'react'
import FormPro from 'app/main/components/formControls/FormPro';
import { Box, Button, } from "@material-ui/core";
import ActionBox from "../../../../components/ActionBox";
import { SERVER_URL } from './../../../../../../configs'
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import TablePro from 'app/main/components/TablePro';
import { Card, CardContent, CardHeader, Grid, TextField } from "@material-ui/core"
import { ALERT_TYPES, setAlertContent } from "../../../../../store/actions/fadak";
import checkPermis from 'app/main/components/CheckPermision';
import { thru } from 'lodash';


const OtherInfo = (props) => {
    const { userP, settingTypeEnumId, origin, oraganUnit = false, externalPartyId } = props
    const [formValues, setFormValues] = useState({});
    const [formValidation, set_formValidation] = useState({});
    const [tableContent, setTableContent] = useState([]);
    const [loading, setLoading] = useState(true)
    const [btnName, setBtnName] = useState("افزودن")
    const [settingTypeEnumIdList, setSettingTypeEnumId] = useState([]);
    const [settingType, setSettingType] = useState([]);
    const [oldData, setOldData] = useState([]);
    const dispatch = useDispatch()
    const partyIdLogin = useSelector(({ auth }) => auth.user.data);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const partyId = settingTypeEnumId === "OtherPersonalInf" ? ((partyIdUser !== null) ? partyIdUser : partyIdLogin.partyId) : externalPartyId
    const axiosKey = {
        headers: {
            api_key: localStorage.getItem("api_key"),
        },
    };
    const datas = useSelector(({ fadak }) => fadak);
    const forOther = origin === "search"
    const forUser = origin === "userProfile"
    const forNew = origin === "register"
    const formStructure = [{
        name: "partySettingTypeId",
        label: "نوع اطلاعات",
        options: settingTypeEnumIdList,
        optionLabelField: "description",
        optionIdField: "enumId",
        type: "select",
        required: true

    }, {
        name: "settingValue",
        label: settingTypeEnumIdList.find(element => element.enumId === formValues.partySettingTypeId)?.description,
        type: settingTypeEnumIdList.find(element => element.enumId === formValues.partySettingTypeId)?.enumTypeId ? "select" : "text",
        options: settingType,
        optionLabelField: "description",
        required: true,
        optionIdField: "enumId",
        validator: !settingTypeEnumIdList.find(element => element.enumId === formValues.partySettingTypeId)?.enumTypeId && settingTypeEnumIdList.find(element => element.enumId === formValues.partySettingTypeId)?.validRegexp ? values => {
            const rule1 = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
            let regex = new RegExp('[a-z0-9]+@stackabuse.com')
            const rule = settingTypeEnumIdList.find(element => element.enumId === formValues.partySettingTypeId)?.validRegexp
            let pattern = new RegExp(rule)
            const settingType = values.settingValue;
            const message = " مقدار ورودی را با فرمت مناسب وارد کنید!";
            return new Promise(resolve => {
                if (settingType?.match(pattern)) {
                    resolve({ error: false, helper: "" })
                } else {
                    resolve({ error: true, helper: message })
                }
            })
        } : "",
    }, {
        name: "fromDate",
        label: "ازتاریخ",
        type: "date",
        maxDate: formValues.thruDate ?? "",
        required: true

    }, {
        name: "thruDate",
        label: "تا تاریخ",
        minDate: formValues.fromDate ?? "",
        type: "date",
    }
    ]

    const getSettingTypeEnumId = () => {
        axios.get(SERVER_URL + "/rest/s1/fadak/getTypeOfPartySetting?settingTypeEnumId=" + settingTypeEnumId, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(res => {
            setSettingTypeEnumId(res.data.result)
        }).catch(() => {
        });
    }

    useEffect(() => {
        getSettingTypeEnumId()
    }, [])

    useEffect(() => {
        let enumTypeId = settingTypeEnumIdList.find(element => element.enumId === formValues.partySettingTypeId)?.enumTypeId
        axios.get(SERVER_URL + "/rest/s1/fadak/entity/Enumeration?enumTypeId=" + enumTypeId, axiosKey).then(response => {
            setSettingType(response.data.result)
        }).catch(err => {
        });
        if (oldData.length === 0)
            setFormValues(prevState => ({ ...prevState, settingValue: settingTypeEnumIdList.find(element => element.enumId === formValues.partySettingTypeId)?.defaultValue }))

    }, [formValues.partySettingTypeId])


    const tableCols = [
        {
            name: "partySettingTypeId",
            label: "نوع اطلاعات",
            options: settingTypeEnumIdList,
            optionLabelField: "description",
            optionIdField: "enumId",
            type: "select",
        }, {
            name: "description",
            label: "عنوان اطلاعات",
            // options: settingType,
            // optionLabelField: "description",
            // optionIdField: "enumId",
            type: "text",
        }, {
            name: "fromDate",
            label: "ازتاریخ",
            type: "date",
        }, {
            name: "thruDate",
            label: "تا تاریخ",
            type: "date",
        }

    ]
    const handleEditFood = (row) => {
        setOldData(row)
        setFormValues(row)
        setBtnName("ویرایش")
    }

    const handlerSubmit = () => {
        if (btnName === "افزودن") {
            formValues.partyId = partyId
            axios.post(SERVER_URL + "/rest/s1/fadak/savePartySetting", { data: formValues }, axiosKey)
                .then((res) => {
                    if (res.data.result === "noSave")
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, "در این باز زمانی این اطلاعات برای این فرد پر شده است"));
                    else {
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                        setFormValues({})
                    }
                    setLoading(true)

                })
                .catch((err) => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                });
        }

        else {
            let updateDta = {
                oldFromDate: oldData.fromDate,
                oldPartySettingTypeId: oldData.partySettingTypeId,
                oldThruDate: oldData.thruDate,
                partyId: partyId,
                fromDate: formValues.fromDate,
                partySettingTypeId: formValues.partySettingTypeId,
                settingValue: formValues.settingValue,
                thruDate: formValues.thruDate

            }
            axios.put(SERVER_URL + "/rest/s1/fadak/updatePartySetting", { data: updateDta }, axiosKey)
                .then((res) => {
                    if (res.data.result === "noSave")
                        dispatch(setAlertContent(ALERT_TYPES.WARNING, "در این باز زمانی این اطلاعات برای این فرد پر شده است"));
                    else
                        dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setFormValues({})
                    setLoading(true)
                    setBtnName("افزودن")
                })
                .catch((err) => {
                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                    setBtnName("افزودن")

                });
        }




    }

    useEffect(() => {
        axios.get(SERVER_URL + "/rest/s1/fadak/getPartySetting?partyId=" + partyId, axiosKey).then(response => {
            setTableContent(response.data.result)
            setLoading(false)
        }).catch(err => {
        });

    }, [loading])



    const handleRemove = (oldData) => {
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + "/rest/s1/fadak/deletePartySetting", { data: oldData }, axiosKey)
                .then((res) => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                    setLoading(true)
                    setBtnName("افزودن")
                    setFormValues({})
                })
                .catch((err) => {
                    reject("خطا در خذف اطلاعات!.")

                });

        })


    }

    return (
        <Box style={{ padding: 12, margin: 10, border: "1px solid #ddd", borderRadius: 3 }} >
            <FormPro
                prepend={formStructure}
                formValues={formValues} setFormValues={setFormValues}
                formValidation={formValidation}
                setFormValidation={set_formValidation}
                submitCallback={handlerSubmit}
                actionBox={<ActionBox>
                    {oraganUnit ? checkPermis("organizationChartManagement/organizationalUnit/otherInfo/add", datas) :
                        (forOther && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/OtherInfo/save", datas)) || (forUser && checkPermis("personnelManagement/personnelBaseInformation/OtherInfo/save", datas)) ? <Button type="submit" role="primary" >{btnName}</Button> : ""}
                    <Button type="reset" role="secondary">لغو</Button>
                </ActionBox>}
            />
            <TablePro
                columns={tableCols}
                rows={tableContent}
                editCallback={handleEditFood}
                setRows={setTableContent}
                edit={oraganUnit ? checkPermis("organizationChartManagement/organizationalUnit/otherInfo/update", datas) : (forOther && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/OtherInfo/edit", datas)) || (forUser && checkPermis("personnelManagement/personnelBaseInformation/OtherInfo/edit", datas)) ? "callback" : ""}
                removeCallback={oraganUnit ? checkPermis("organizationChartManagement/organizationalUnit/otherInfo/delete", datas) : (forOther && checkPermis("personnelInformationManagement/searchPersonnelList/editPersonnel/OtherInfo/delete", datas)) || (forUser && checkPermis("personnelManagement/personnelBaseInformation/OtherInfo/delete", datas)) ? handleRemove : ""}
                loading={loading}
            />


        </Box>

    );
};

export default OtherInfo;
