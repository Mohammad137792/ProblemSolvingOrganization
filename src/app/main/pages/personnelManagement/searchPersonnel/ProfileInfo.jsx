import React, { useEffect } from 'react';
import { FusePageSimple } from "@fuse";
import SearchPersonnelForm from "./SearchPersonnelForm";
import axios from "axios";
import { SERVER_URL } from "../../../../../configs";
import Card from "@material-ui/core/Card";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserId, getWorkEffotr } from "../../../../store/actions/fadak";
import { useHistory } from 'react-router-dom';
import TablePro from "../../../components/TablePro";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import EditIcon from "@material-ui/icons/Edit";
import MoneyIcon from '@material-ui/icons/Money';
import checkPermis from 'app/main/components/CheckPermision';
import VisibilityIcon from "@material-ui/icons/Visibility";
import ModalPro from "../../../components/ModalPro";
import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";
import { useState } from 'react';
import FormPro from 'app/main/components/formControls/FormPro';
import { Dialog } from '@material-ui/core';
import CircularProgress from "@material-ui/core/CircularProgress";

const formDefaultValues = {
    partyDisabled: "N",
}

const ProfileInfo = (props) => {
    const { loadData } = props
    const [formValues, setFormValues] = useState({})
    const [tableContent, setTableContent] = useState([])
    const [loadInfo, setLoadInfo] = useState(false)
    const tableCols = [
        { name: "pseudoId", label: "کد شعبه", type: "text", style: { width: "80px" } },
        { name: "firstName", label: "نام شعبه", type: "render" },
        { name: "nationalId", label: "نام مجتمع", type: "text" },
        { name: "birthDate", label: "سمت", type: "date" },
        { name: "maritalStatusEnumId", label: "شروع ابلاغ", type: "text" },
        { name: "residenceStatusEnumId", label: "پایان ابلاغ", type: "text" },
        { name: "organizationName", label: "وضعیت ابلاغ", type: "text" },
    ]
    const formStructure = [
        {
            name: "pseudoId",
            label: "کد پرسنلی",
            type: "text",
            readOnly:true,
            col: 4

        }, {
            name: "fullName",
            label: "نام و نام خانودگی",
            readOnly:true,
            type: "text",
            col: 4

        },
        {
            name: "FatherName",
            label: "نام پدر",
            readOnly:true,
            type: "text",
            col: 4

        }, {
            name: "nationalId",
            label: "کد ملی",
            readOnly:true,
            type: "number",
            col: 4

        }
        , {
            name: "employmentStatusEnumId",
            label: "نوع استخدام",
            readOnly:true,
            type: "select",
            options: "EmploymentStatus",
            col: 4

        }, {
            name: "idNumber",
            label: "شماره شناسنامه",
            readOnly:true,
            type: "text",
            col: 4

        }, {
            name: "gender",
            label: "جنسیت",
            readOnly:true,
            type: "select",
            options: "Gender",
            col: 4


        }, {
            name: "ReligionEnumID",
            label: "دین",
            readOnly:true,
            type: "select",
            options: "ReligionEnumId",
            col: 4
        }, {
            name: "maritalStatusEnumId",
            label: "وضعیت تأهل",
            readOnly:true,
            type: "select",
            options: "MaritalStatus",
            col: 4
        }, {
            name: "NumberofKids",
            label: " تعداد فرزند",
            readOnly:true,
            type: "number",
            col: 4
        }, {
            name: "qualificationTypeEnum",
            label: "مدرک تحصیلی",
            readOnly:true,
            type: "select",
            options: "QualificationType",
            col: 4
        }, {
            name: "fieldEnum",
            label: "رشته تحصیلی",
            readOnly:true,
            options:"UniversityFields",
            type: "select",
            col: 4
        }, {
            name: "educationplace",
            label: "محل تحصیل",
            readOnly:true,
            type: "text",
            col: 4
        }, {
            name: "baseInsuranceTypeEnumId",
            label: "نوع بیمه ",
            options:"BaseInsuranceType",
            readOnly:true,
            type: "select",
            col: 4
        }, {
            name: "baseInsurancenumber",
            label: "شماره بیمه",
            readOnly:true,
            type: "text",
            col: 4
        }, {
            name: "accountNumber",
            type: "text",
            readOnly:true,
            label: "شماره حساب پیش فرض",
            col: 4
        }, {
            name: "accountNumberSheba",
            label: "شماره شبای حساب پیش فرض",
            readOnly:true,
            type: "number",
            col: 8
        }, {
            name: "address",
            label: "آدرس منزل ",
            readOnly:true,
            type: "text",
            col: 8
        }, {
            name: "phoneNumber",
            label: "شماره تلفن منزل ",
            readOnly:true,
            type: "number",
            col: 4
        }, {
            name: "mobaile",
            label: "شماره همراه ",
            readOnly:true,
            type: "number",
            col: 4
        }, {
            name: "activityArea",
            label: "محل خدمت ",
            readOnly:true,
            type: "text",
            col: 4
        }, {
            name: "empPosition",
            label: "سمت ",
            readOnly:true,
            type: "text",
            col: 4
        },
    ]

    useEffect(() => {
        axios
            .get(SERVER_URL + "/rest/s1/fadak/infoOfEachPerson", {
                headers: { api_key: localStorage.getItem("api_key") },
                params: {
                    partyId: loadData.partyId,
                    partyRelationshipId: loadData.partyRelationshipId,
                },
            })
            .then((res) => {
                setLoadInfo(true)
                setFormValues(prevState => ({
                    ...prevState,
                    pseudoId: loadData?.pseudoId,
                    fullName: loadData?.firstName+" "+loadData?.lastName,
                    NumberofKids: res.data.BaseInfo?.personInfo?.NumberofKids,
                    ReligionEnumID: res.data.BaseInfo?.personInfo?.ReligionEnumID,
                    FatherName:res.data.BaseInfo?.personInfo?.FatherName,
                    fieldEnum: res.data.lastPartyQualification[0]?.fieldEnumId,
                    qualificationTypeEnum: res.data.lastPartyQualification[0]?.qualificationTypeEnumId,
                    maritalStatusEnumId: res.data.BaseInfo?.personInfo?.maritalStatusEnumId,
                    gender: res.data.BaseInfo?.personInfo?.gender,
                    employmentStatus: res.data.BaseInfo?.personInfo?.employmentStatusEnumId,
                    idNumber: res.data.BaseInfo?.PartyIden.find(element => element.partyIdTypeEnumId ==="idNumber")?.idValue,
                    nationalId: res.data.BaseInfo?.PartyIden.find(element => element.partyIdTypeEnumId ==="Nationalcode")?.idValue,
                    empPosition: res.data.BaseInfo?.empPosition,
                    address: res.data.address,
                    educationplace: res.data.lastPartyQualification[0]?.countryGeoName ,
                    activityArea: res.data.ActivityArea?.description,
                    accountNumber: res.data.bankInfo ? res.data.bankInfo[0]?.accountNumber : "",
                    accountNumberSheba: res.data.bankInfo ? res.data.bankInfo[0]?.shebaNumber : "",
                    baseInsurancenumber: res.data.BaseInfo?.personInfo?.baseInsurancenumber,
                    baseInsuranceTypeEnumId: res.data.BaseInfo?.personInfo?.baseInsuranceTypeEnumId,
                    phoneNumber: res.data.contactInfo.find(item => item.contactMechPurposeId === "PhoneHome")?.contactNumber,
                    mobaile: res.data.contactInfo.find(item => item.contactMechPurposeId === "PhoneMobile")?.contactNumber
                }))
            })
            .catch(() => {
            });
    }, [])


    return (
        <FusePageSimple
            content={
                <Box p={2}>
                    <FormPro prepend={formStructure}
                        formValues={formValues} setFormValues={setFormValues}
                    ></FormPro>
                    <TablePro
                        columns={tableCols}
                        rows={tableContent}

                    />
                    {!loadInfo ? <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                        <Dialog open={!loadInfo} PaperProps={{
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
            }
        />
    );
}

export default ProfileInfo;
