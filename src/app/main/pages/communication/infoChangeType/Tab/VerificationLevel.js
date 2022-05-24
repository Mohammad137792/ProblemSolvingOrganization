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
    const myRef = useRef(null)
    const scrollToRef = () => myRef.current.scrollIntoView()
    const axiosKey = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        }
    }

    const verificationTableCols = [
        {
            name: "sequence",
            label: " اولویت ",
            type: "number",
            style: { minWidth: "130px" },
        },
        {
            name: "verificationTypeEnumId",
            label: "نوع رده تایید",
            type: "select",
            options: "VerificationType",
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 3,
        },

        {
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "select",
            options: initData.positions,
            optionLabelField: "description",
            optionIdField: "emplPositionId",
            style: { minWidth: "130px" },

        },
        {
            name: "partyId",
            label: "واحد سازمانی",
            type: "select",
            options: unit.units,
            optionIdField: "unitPartyId",
            required: true,
            optionLabelField: "unitOrganizationName",
            col: 3,

        },
        {
            name: "roleTypeId",
            label: " نقش",
            type: "select",
            options: "Role",
            optionIdField: "roleTypeId",
            required: true,
            col: 3,

        },
        {
            name: "roleInProcessEnumId",
            label: " نقش کاربر در فرایند",
            type: "select",
            options: "RolrInProcess",
            optionLabelField: "description",
            optionIdField: "enumId",
            required: true,
            col: 3,

        },
        {
            name: "actionEnumId",
            label: "دسترسی رده تایید",
            type: "multiselect",
            options: "Action",
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 3,

        },

    ];





    useEffect(() => {
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

        return new Promise((resolve, reject) => {
            axios.post("/s1/communication/deleteVerificationInfoChangeType", { data: row }).then(() => {
                dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت حذف شد شد'));
                setLoding(true)

            }).catch((err) => {

                dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در حذف اطلاعات!'));
            })


        })

    }

    useEffect(() => {
        scrollToRef()
    }, [])

    const getVerificationInfoChange = () => {
        axios
            .get(
                SERVER_URL + "/rest/s1/communication/getVerificationInfoChange?infoChangeTypeId=" + infoChangeTypeId,
                axiosKey
            )
            .then((res) => {
                setVerificationTableContent(res.data.resultVer);
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
                    addForm={<Form unit={unit} infoChangeTypeId={infoChangeTypeId} formValues={formValuesV} setFormValues={setFormValuesV} setLoding={setLoding} verificationTableContent={verificationTableContent} />}
                    edit="external"
                    editForm={<Form editing={true} infoChangeTypeId={infoChangeTypeId} unit={unit} formValues={formValuesV} setFormValues={setFormValuesV} setLoding={setLoding} verificationTableContent={verificationTableContent} />}
                    removeCallback={handleRemove}
                />
            </CardContent>
        </Card>


    );
};

export default VerificationLevel;






function Form({ editing = false, ...restProps }) {

    const { formValues, setFormValues, handleClose, initData, verificationTableContent, unit, infoChangeTypeId, setLoding } = restProps;
    const [formValidationVerif, setFormValidationVerif] = useState({});
    const dispatch = useDispatch();
    const formStructure = [
        {
            name: "actionEnumId",
            label: "دسترسی رده تایید",
            type: "multiselect",
            options: "Action",
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 3,
        },
        {
            name: "verLevelCriteriaEnumId",
            label: "معیار تعیین رده تایید",
            type: "select",
            options: "VerLevelCriteria",
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 3,
        },
        {
            name: "verificationTypeEnumId",
            label: "نوع رده تایید",
            type: "select",
            options: "VerificationType",
            optionLabelField: "description",
            optionIdField: "enumId",
            col: 3,
        },
        {
            name: "sequence",
            label: "اولویت",
            required: true,
            type: "number",
            col: 3,
        },
        //////////////////////////////////////
        {
            name: "partyId",
            label: "واحد سازمانی",
            type: "select",
            options: unit.units,
            optionIdField: "unitPartyId",
            required: formValues.verLevelCriteriaEnumId === "VLCEP" ? true : false,
            optionLabelField: "unitOrganizationName",
            col: 3,
            display: formValues.verLevelCriteriaEnumId === "VLCEP" ? true : false,

        },
        {
            name: "roleTypeId",
            label: " نقش",
            type: "select",
            options: "Role",
            optionIdField: "roleTypeId",
            required: formValues.verLevelCriteriaEnumId === "VLCGrade" || formValues.verLevelCriteriaEnumId === "VLCRoleInUnit" ? true : false,
            col: 3,
            display: formValues.verLevelCriteriaEnumId === "VLCGrade" || formValues.verLevelCriteriaEnumId === "VLCRoleInUnit" ? true : false,

        },
        {
            name: "roleInProcessEnumId",
            label: " نقش کاربر در فرایند",
            type: "select",
            options: "RolrInProcess",
            optionLabelField: "description",
            optionIdField: "enumId",
            required: formValues.verLevelCriteriaEnumId === "VLCRoleInProcess" ? true : false,
            col: 3,
            display: formValues.verLevelCriteriaEnumId === "VLCRoleInProcess" ? true : false,

        },

        {
            name: "emplPositionId",
            label: "پست سازمانی",
            type: "select",
            options: unit.positions,
            optionIdField: "emplPositionId",
            required: formValues.verLevelCriteriaEnumId === "VLCEP" ? true : false,
            optionLabelField: "description",
            col: 3,
            display: formValues.verLevelCriteriaEnumId === "VLCEP" ? true : false,

        },
        {
            name: "partyId",
            label: "واحد سازمانی",
            type: "select",
            options: unit.units,
            optionIdField: "unitPartyId",
            required: formValues.verLevelCriteriaEnumId === "VLCRoleInUnit" ? true : false,
            optionLabelField: "unitOrganizationName",
            col: 3,
            display: formValues.verLevelCriteriaEnumId === "VLCRoleInUnit" ? true : false,

        },
        {
            name: "roleLevel",
            label: " رده سازمانی",
            type: "number",
            required: formValues.verLevelCriteriaEnumId === "VLCGrade" ? true : false,
            col: 3,
            display: formValues.verLevelCriteriaEnumId === "VLCGrade" ? true : false,

        },





    ]



    const submitVerificationLevel = () => {
        if (verificationTableContent?.findIndex(i => parseInt(i?.sequence) === parseInt(formValues?.sequence)) > -1)
            dispatch(setAlertContent(ALERT_TYPES.WARNING, "شماره ترتیب انتخاب شده تکراری است!"));
        else {
            if (editing) {
                axios.put("/s1/communication/updateVerificationInfoChangeType", { data: formValues }).then(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ویرایش شد'));
                    setFormValues([])
                    setLoding(true)

                }).catch((err) => {

                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ویرایش اطلاعات!'));
                })
            }
            else {
                formValues.infoChangeTypeId = infoChangeTypeId
                axios.post("/s1/communication/SaveVerificationInfoChangeType", { data: formValues }).then(() => {
                    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ذخیره شد'));
                    setFormValues([])
                    setLoding(true)

                }).catch((err) => {

                    dispatch(setAlertContent(ALERT_TYPES.ERROR, 'خطا در ثبت اطلاعات!'));
                })

            }
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

                submitVerificationLevel()


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