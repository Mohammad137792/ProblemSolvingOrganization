import React, { useState, useEffect, useRef } from 'react';
import axios from "../../../../api/axiosRest";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { Button, CardContent, CardHeader, Collapse, Tooltip } from "@material-ui/core";
import ActionBox from 'app/main/components/ActionBox';
import TablePro from 'app/main/components/TablePro';
import { useDispatch } from "react-redux";
import { SERVER_URL } from 'configs';
import FormPro from 'app/main/components/formControls/FormPro';
import { setAlertContent, ALERT_TYPES } from 'app/store/actions';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { ToggleButton } from '@material-ui/lab';
import VisibilityIcon from "@material-ui/icons/Visibility";
import { FusePageSimple } from '@fuse';


const VerificationLevel = (props) => {

    const { verificationTitle, unit, infoChangeTypeId } = props
    const [initData, setInitData] = useState([]);
    const [verificationTableContent, setVerificationTableContent] = useState([]);
    const [formValuesV, setFormValuesV] = useState({});
    const dispatch = useDispatch();
    const [loading, setLoding] = useState(true)
    const [userPermissionId, setUserPermissionId] = useState([])
    const myRef = useRef(null)
    const scrollToRef = () => myRef.current.scrollIntoView()
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const verificationTableCols = [
        {
            name: "userPermissionIds",
            label: "تب اطلاعات مورد تغییر",
            type: "select",
            options: userPermissionId.filter(item => !item.description?.includes("ویرایش") && !item.description?.includes("حذف") && !item.description?.includes("افزودن")),
            optionLabelField: "description",
            optionIdField: "userPermissionId",
            col: 3,
        },
        {
            name: "userPermissionId",
            label: "تغییرات",
            type: "select",
            options: userPermissionId.filter(item => item.description?.includes("ویرایش") || item.description?.includes("حذف") || item.description?.includes("افزودن")),
            optionLabelField: "description",
            optionIdField: "userPermissionId",
            col: 3,
        },

    ];

    const getUserPermissionPersonInfo = () => {
        axios
            .get(
                SERVER_URL + "/rest/s1/communication/getUserPermissionPersonInfo",
                axiosKey
            )
            .then((res) => {
                setUserPermissionId(res.data.result);

            })
            .catch(() => { });

    }



    useEffect(() => {
        getUserPermissionPersonInfo()
        let data = {
            partyId: "",
        }
        axios.post(SERVER_URL + "/rest/s1/fadak/personLoginInfo", { data: data }, {
            headers: { 'api_key': localStorage.getItem('api_key') }
        }).then(response => {
            axios
                .get(
                    SERVER_URL + "/rest/s1/fadak/allCompaniesFilter?isLoggedInUserData=true",
                    axiosKey
                )
                .then((res) => {
                    const orgMap = {
                        units: res.data.data.units,
                        subOrgans: res.data.data.companies.filter(item => item.companyPartyId === response.data.result[0].companyPartyId),
                        positions: res.data.data.emplPositions.filter(item => item.companyPartyId === response.data.result[0].companyPartyId),
                        employees: res.data.data.persons.filter(item => item.companyPartyId === response.data.result[0].companyPartyId),
                    };
                    setInitData(orgMap);

                })
                .catch(() => { });
        }).catch(err => { });
    }, []);




    const handleRemove = (row) => {
console.log("row..........",row)
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + "/rest/s1/communication/deleteAllowedChange?allowedChangeId=" + row.allowedChangeId, axiosKey)
                .then((res) => {
                    setLoding(true)
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد'));
                }).catch((erro) => {
                    reject("حذف اطلاعات با خطا مواجه شد.")
                })
        })



    }

    useEffect(() => {
        scrollToRef()
    }, [])

    const getVerificationInfoChange = () => {
        axios
            .get(
                SERVER_URL + "/rest/s1/communication/getAllowedChange",
                axiosKey
            )
            .then((res) => {
                setVerificationTableContent(res.data.result);
                setLoding(false)

            })
            .catch(() => { });

    }

    useEffect(() => {
        getVerificationInfoChange()
    }, [loading])

    return (

        <Card ref={myRef}>
            <CardContent>
                <TablePro
                    title={verificationTitle}
                    columns={verificationTableCols}
                    rows={verificationTableContent}
                    setRows={setVerificationTableContent}
                    loading={loading}
                    add="external"
                    addForm={<Form unit={unit} infoChangeTypeId={infoChangeTypeId} formValues={formValuesV} setFormValues={setFormValuesV} setLoding={setLoding} userPermissionId={userPermissionId} />}
                    edit="external"
                    editForm={<Form editing={true} infoChangeTypeId={infoChangeTypeId} unit={unit} formValues={formValuesV} setFormValues={setFormValuesV} setLoding={setLoding} userPermissionId={userPermissionId} />}
                    removeCallback={handleRemove}
                />
            </CardContent>
        </Card>


    );
};

export default VerificationLevel;






function Form({ editing = false, ...restProps }) {

    const { formValues, setFormValues, handleClose, userPermissionId, infoChangeTypeId, setLoding } = restProps;
    const [formValidationVerif, setFormValidationVerif] = useState({});
    const dispatch = useDispatch();
    const formStructure = [
        {
            name: "userPermissionIds",
            label: "تب اطلاعات مورد تغییر",
            type: "select",
            options: userPermissionId.filter(item => !item.description?.includes("ویرایش") && !item.description?.includes("حذف") && !item.description?.includes("افزودن")),
            optionLabelField: "description",
            optionIdField: "userPermissionId",
            col: 3,
        },
        {
            name: "userPermissionId",
            label: "تغییرات",
            type: "select",
            options: userPermissionId.filter(item => item.description?.includes("ویرایش") || item.description?.includes("حذف") || item.description?.includes("افزودن")),
            optionLabelField: "description",
            optionIdField: "userPermissionId",
            col: 3,
            filterOptions: options => formValues["userPermissionIds"] ? options.filter(item => item.userPermissionId?.includes(formValues["userPermissionIds"])) :
                options,
        },
    ]



    const submit = () => {
        if (editing) {
            console.log("formValues.......", formValues)

            axios.put("/s1/communication/updateAllowedChange", { data: formValues }).then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
                setFormValues([])
                setLoding(true)
            }).catch((err) => {

                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ویرایش اطلاعات!'));
            })
        }
        else {
            formValues.infoChangeTypeId = infoChangeTypeId
            axios.post("/s1/communication/saveAllowedChange", { data: formValues }).then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                setFormValues([])
                setLoding(true)
            }).catch((err) => {

                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
            })
        }
    }

    const handleReset = () => {
        setFormValues({})
        handleClose()
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