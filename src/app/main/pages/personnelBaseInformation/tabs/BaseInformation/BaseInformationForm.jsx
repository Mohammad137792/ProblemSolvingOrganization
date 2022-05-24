import React, { useEffect } from 'react';
import axios from "axios";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../../configs";
import checkPermis from 'app/main/components/CheckPermision';

import {
    Button,
    Card,
    CardContent, CardHeader, FormControl, FormControlLabel,
    Grid, MenuItem,
    TextField,
} from "@material-ui/core";
import { INPUT_TYPES } from "../../../../helpers/setFormDataHelper";
import { Paper } from '@material-ui/core';
import { Add } from "@material-ui/icons";
import { useSelector } from "react-redux";
import CTable from "../../../../components/CTable";
import DatePicker from "../../../../components/DatePicker";
import ModalDelete from "./ModalDelete";
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import PersonnelSignatureFile from "../../../../components/PersonnelSignatureFile";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { ALERT_TYPES, setAlertContent, submitPost } from "../../../../../store/actions/fadak";
import { KeyboardDatePicker, KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import ModelPassWord from "../../../../components/ChangePassWordModel"
import { useState } from 'react';
import FormPro from 'app/main/components/formControls/FormPro';

const useStyles = makeStyles((theme, theme1) => ({
    textarea: {
        resize: "vertical"
    },
    qw: {
        visibility: "hidden"
    },
    qw1: {
        visibility: "show"
    },
    qw2: {
        display: "none"
    },
    qw3: {
        display: "inline-block"
    },
    logo: {
        maxWidth: 160,
    },
    adornedStart: {
        display: "none"
    },
    buttonStyle: {
        disabled: true
    },
    formControl: {
        width: "100%",
        "& label span": {
            color: "red"
        }
    }, as: {
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        }
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },

    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

}));
const helperTextStyles = makeStyles(theme => ({
    root: {
        margin: 4,
        color: "red"
    },
    error: {
        "&.MuiFormHelperText-root.Mui-error": {
            color: theme.palette.common.white
        }
    }
}));

const BaseInformationForm = ({ addFormData, setStyle, setFormData, style, formData, currentData, data, tableContent, updateRow, addTableRow, setCurrentData,missingcheckIdentification,
    setaddrowFile1, setaddrowFile, openPassModel, setOpenPassModel, DataMilitary, fromDateState,fromDate,truDate,savedata,setFromDate,setTruDate,fromDateInter,setfromDateInter,
    addrowFile1, addrowFile, statusIdState, setTableContent, setOpen, setId, idDelete, open, handleClose, missingcheckPerson,setfromDateState }) => {



    const partyRelationshipId = useSelector(({ auth }) => auth?.user?.data?.partyRelationshipId);


    const datas = useSelector(({ fadak }) => fadak);

    const classes = useStyles();
    const helperTestClasses = helperTextStyles();


    const handleDateChangDateFromDate = (date1) => {
        if (date1 !== null) {
        setfromDateState(false)

            setStyle(prev => ({
                ...prev,
                fromDate: false
            }))
            formData.fromDate = date1._d.getTime();
            setFromDate(date1._d.getTime())
            setfromDateInter(date1?.format("Y-MM-DD"))
            const newFormdata = Object.assign({}, formData)
            setFormData(newFormdata)
        } else if (date1 === null) {
        setfromDateState(true)

            formData.fromDate = "";
            setFromDate("")
            const newFormdata = Object.assign({}, formData)
            setFormData(newFormdata)
        }
    }

    const handleDateChangDateThruDate = (date1) => {

        setStyle(prev => ({
            ...prev,
            thruDate: false
        }))
        setTruDate(date1?.format("Y-MM-DD"))
        formData.thruDate = date1?.format("Y-MM-DD");
        formData.person = { ...formData?.person, ["thruDate"]: formData?.thruDate }
        const newFormdata = Object.assign({}, formData)
        setFormData(newFormdata)



       

    }


    const handleDateChangDate = (date1) => {
        if (date1 !== null) {
            setStyle(prev => ({
                ...prev,
                birthDate: false
            }))
            formData.birthDate = date1.format("Y-MM-DD");
            formData.person = { ...formData.person, ["birthDate"]: formData.birthDate }
            const newFormdata = Object.assign({}, formData)
            setFormData(newFormdata)
        } else if (date1 === null) {
            formData.person = { ...formData.person, ["birthDate"]: "" }
            const newFormdata = Object.assign({}, formData)
            setFormData(newFormdata)
        }
    }

    const handleDateChangDatePassport = (date1) => {
        if (date1 !== null) {
            formData.expireDate = date1.format("Y-MM-DD");
            formData.partyIdentification = { ...formData.partyIdentification, ["expireDate"]: formData.expireDate }
            const newFormdata = Object.assign({}, formData)
            setFormData(newFormdata)
        }
        else if (date1 === null) {
            formData.partyIdentification = { ...formData.partyIdentification, ["expireDate"]: "" }
            const newFormdata = Object.assign({}, formData)
            setFormData(newFormdata)
        }

    }



    const axiosConfig = {
        headers: {
            'api_key': localStorage.getItem('api_key')
        },
    };

    const partyIdLogin = useSelector(({ auth }) => auth.user.data);
    const partyIdUser = useSelector(({ fadak }) => fadak.baseInformationInisial.user);
    const UserId = useSelector(({ fadak }) => fadak.baseInformationInisial);
    const partyId = (partyIdUser !== null) ? partyIdUser : partyIdLogin.partyId
    const [partyClassification, setPartyClassification] = useState([])
    const usernameValue = (partyIdUser !== null) ? UserId.username : partyIdLogin.username
    const accountDisabled = (partyIdUser !== null) ? UserId.accountDisabled : currentData.disabled
    const [formValues, setFormValues] = useState([]);
  

    const [lastMilitary, setlastMilitary] = useState([]);
    const autoCompleteDefaultValue = (items, field, currentValue) => {
        let current = false;
        items.map((item, index) => {
            if (item[field] === currentValue) {
                current = item
            }

        })
        return current;
    }



    const autoCompleteNationalValue = (items, field, currentValue) => {
        let current = null;
        if (formData?.person?.gender === "N") {
            current = items.find(o => o.partyClassificationId === "NotIncluded")

            return current;
        }
        if (formData?.partyClassification?.partyClassificationId) {
            current = items.find(o => o.partyClassificationId == formData?.partyClassification?.partyClassificationId)
            return current;
        }
        items && items.map((item, index) => {
            if (item[field] === currentValue) {
                current = item
            }
        })

        return current;
    }

    const defaulValueTextField = (field, tableName) => {
        if (typeof formData[tableName] != "undefined" && typeof formData[tableName][field] != "undefined") {
            return formData[tableName][field];
        }
        else return currentData[field]
    }

    const handleChangeAutoComplete = (newValue, field, tableName, filedName) => {
        if (newValue !== null) {
            formData[tableName] = { ...formData[tableName], [filedName]: newValue[field] }
            const newFormdata = Object.assign({}, formData)
            setFormData(newFormdata)
        }
    }

    const genderTypes = [
        { title: "مذکر", content: "Y" },
        { title: "مونث", content: "N" }
    ]
    const [seviseDate, setseviseDate] = useState("")
    const [state1, setState1] = React.useState({
        criminalRecord: ""
    });
    const handleChange = name => event => {
        setState1({ ...state1, [name]: event.target.checked });
        if (event.target.checked === true) {
            formData.criminalRecord = event.target.checked;
            formData.person = { ...formData.person, ["criminalRecord"]: formData.criminalRecord };
            const newFormdata = Object.assign({}, formData);
            setFormData(newFormdata)
        } else if (event.target.checked === false) {
            formData.criminalRecord = event.target.checked;
            formData.person = { ...formData.person, ["criminalRecord"]: formData.criminalRecord };
            const newFormdata = Object.assign({}, formData);
            setFormData(newFormdata)
        }
    };


    const validatorNationalcode = (e) => {
        let txt = e.target.value
        formData.partyIdentification = { ...formData.partyIdentification, ["Nationalcode"]: "" };
        const newFormdata = Object.assign({}, formData);
        setFormData(newFormdata)

        setStyle(prevState => ({
            ...prevState,
            NationalcodeId: true,
            Nationalcode: true

        }))


        if (txt.length === 10) {

            formData.partyIdentification = { ...formData.partyIdentification, ["Nationalcode"]: e.target.value };
            const newFormdata = Object.assign({}, formData);
            setFormData(newFormdata)
            setStyle(prevState => ({
                ...prevState,
                NationalcodeId: false,
                Nationalcode: false

            }))
            return null
        }


    }
    const dispatch = useDispatch();

    useEffect(() => {
        formData.fromDate = { ...formData.fromDate, ["fromDate"]: formValues.fromDate };
        formData.thruDate = { ...formData.thruDate, ["thruDate"]: formValues.thruDate };


    }, [formValues])
    const PartyClassificationData = {
        partyId: partyId
    }
    useEffect(() => {

        axios.post(SERVER_URL + "/rest/s1/fadak/getLastPartyClassification", { data: PartyClassificationData }, axiosConfig).then(responsePty => {
            setPartyClassification(responsePty.data.result[0]?.description)

            // dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت  به روزرسانی شد'));
        })




    }, []);




    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} md={6}>

                                <TextField fullWidth className={classes.formControl} required
                                    variant="outlined" id="username" name="username" disabled={true}
                                    label="نام کاربری"
                                    value={usernameValue}
                                    onChange={addFormData()}

                                />
                            </Grid>

                            <Grid item xs={12} md={6}>

                                <ModelPassWord open={openPassModel} handleClose={handleClose} setOpen={setOpenPassModel} />

                                <Button variant="contained" color="primary" onClick={() => setOpenPassModel(true)} fullWidth style={{ height: "53px" }}>
                                    تغییر رمز عبور
                                </Button>

                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField fullWidth
                                    variant="outlined" id="emailAddress" name="emailAddress"
                                    label="ایمیل بازیابی" type={"email"}
                                    defaultValue={currentData.emailAddress}

                                    value={formData.emailAddress}
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            formData.userAccount = { ...formData.userAccount, ["emailAddress"]: "" };
                                            const newFormdata = Object.assign({}, formData);
                                            setFormData(newFormdata)
                                        } else if (e.target.value !== '') {
                                            formData.userAccount = { ...formData.userAccount, ["emailAddress"]: e.target.value };
                                            const newFormdata = Object.assign({}, formData);
                                            setFormData(newFormdata)
                                        }
                                    }}

                                />

                            </Grid>



                            <Grid item xs={12} md={6}>
                                <TextField variant="outlined" id="disabled2" name="disabled2"
                                    disabled={true}
                                    label="وضعیت حساب کاربری"
                                    defaultValue={accountDisabled && accountDisabled === "Y" ? "غیرفعال" : "فعال"}
                                    fullWidth>

                                </TextField>

                            </Grid>

                            <Grid  container direction="row" spacing={2} >
                                {/* <FormPro prepend={formStructure}
                                    formValues={formValues}
                                    setFormValues={setFormValues}

                                /> */}
                                <Grid item xs={6} md={6} style={{paddingRight:15}} >

                                
                                    <DatePicker variant="outlined" id="fromDate"
                                    
                                        // value={formData.fromDate ?? fromDate ?? null}
                                        // defaultValue={fromDate ? fromDate : ""}
                                        value={fromDate ?? fromDate ?? null}
                                        defaultValue={currentData.fromDate ? currentData.fromDate : ""}
                                        // className={missingcheckPerson("fromDate") ? classes.as : classes.formControl}
                                        // helperText={missingcheckPerson("fromDate") ? "پر کردن این فیلد الزامی است" : ""}
                                        setValue={handleDateChangDateFromDate}
                                        required={true}
                                        FormHelperTextProps={{ classes: helperTestClasses }}
                                        disabled={!checkPermis("personnelManagement/personnelBaseInformation/base/hireDate" ,datas)}
                                        errorState={style.fromDate}
                                        format={"jYYYY/jMMMM/jDD"}
                                        label="تاریخ استخدام " fullWidth />
                                     {fromDateState?  <span style={{ color: "red", margin: 4,fontSize:"1.2rem",fontWeight:400 }}>پر کردن این فیلد الزامی است</span>:""}
                                </Grid>
                                <Grid item xs={6} md={6} style={{paddingLeft:15}}>
                                    <DatePicker variant="outlined" id="thruDate"
                                    
                                        value={truDate ?? truDate ?? null}
                                        defaultValue={truDate ? truDate : ""}
                                        setValue={handleDateChangDateThruDate}
                                        // required={true}
                                        FormHelperTextProps={{ classes: helperTestClasses }}
                                        disabled={!checkPermis("personnelManagement/personnelBaseInformation/base/hireDate" ,datas)}

                                        className={style.birthDate ? classes.as : classes.formControl}
                                        errorState={style.birthDate}
                                        format={"jYYYY/jMMMM/jDD"}
                                        label="تاریخ پایان کار " fullWidth />
                                </Grid>

                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PersonnelSignatureFile />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper />
                    </Grid>
                </Grid>
                <hr />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>

                        <Autocomplete style={{ marginTop: -16 }}
                            id="personalTitle" name="personalTitle"
                            options={data.enums.PersonalTitleType}
                            getOptionLabel={option => option.description || option}
                            defaultValue={() => {
                                return autoCompleteDefaultValue(data.enums.PersonalTitleType, "enumId", currentData.personalTitle);

                            }}
                            onChange={(event, newValue) => {
                                handleChangeAutoComplete(newValue, "enumId", "person", "personalTitle")
                                if (newValue === null) {
                                    if (typeof currentData.personalTitle != "undefined") {
                                        formData.person = { ...formData.person, ["personalTitle"]: "" };
                                        const newFormdata = Object.assign({}, formData);
                                        setFormData(newFormdata)
                                    }
                                }
                            }}
                            value={formData.personalTitle}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="عنوان"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete style={{ marginTop: -16 }}
                            id="gender" name="gender"
                            options={genderTypes}
                            getOptionLabel={option => option.title || ""}
                            defaultValue={() => {
                                let current = null;
                                genderTypes.map((item, index) => {
                                    if (item.content === currentData.gender) {
                                        current = item
                                    }

                                });
                                return current;
                            }
                            }

                            onChange={(event, newValue) => {
                                handleChangeAutoComplete(newValue, "enumId", "person", "gender")
                                if (newValue !== null) {
                                    formData.person = { ...formData.person, ["gender"]: newValue.content }
                                    const newFormdata = Object.assign({}, formData)
                                    setFormData(newFormdata)
                                    if (newValue.content === "Y") {
                                        currentData.gender = "Y"
                                        setCurrentData(Object.assign({}, currentData))
                                    }
                                    if (newValue.content === "N") {
                                        currentData.gender = "N"
                                        setCurrentData(Object.assign({}, currentData))
                                    }
                                }
                                if (newValue === null) {
                                    if (typeof currentData.gender != "undefined") {
                                        formData.person = { ...formData.person, ["gender"]: "" };
                                        const newFormdata = Object.assign({}, formData);
                                        setFormData(newFormdata)
                                    }
                                }
                            }}

                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="جنسیت"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField variant="outlined" id="disabled" name="disabled"
                            value={statusIdState.statusIdDescription} disabled={true}
                            label="وضعیت  پرسنل"
                            onChange={addFormData("", "person")}
                            fullWidth>


                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField fullWidth required
                            variant="outlined" id="firstName" name="firstName"
                            label=" نام"
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            className={missingcheckPerson("firstName") ? classes.as : classes.formControl}
                            helperText={missingcheckPerson("firstName") ? "پر کردن این فیلد الزامی است" : ""}
                            defaultValue={defaulValueTextField("firstName", "person")}


                            onChange={(e) => {

                                if ((e.target.value) === '') {
                                    if (typeof currentData.firstName == "undefined") {
                                    } else {
                                    }
                                    formData.person = { ...formData.person, ["firstName"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {
                                    formData.person = { ...formData.person, ["firstName"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}


                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth required
                            variant="outlined" id="lastName" name="lastName"
                            label=" نام خانوادگی"
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            className={missingcheckPerson("lastName") ? classes.as : classes.formControl}
                            helperText={missingcheckPerson("lastName") ? "پر کردن این فیلد الزامی است" : ""}
                            onChange={(e) => {

                                if ((e.target.value) === '') {
                                    if (typeof currentData.lastName == "undefined") {

                                    } else {
                                    }
                                    formData.person = { ...formData.person, ["lastName"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {
                                    formData.person = { ...formData.person, ["lastName"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}

                            defaultValue={defaulValueTextField("lastName", "person")}

                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth
                            variant="outlined" id="suffix" name="suffix"
                            label=" پسوند"
                            value={formData.suffix}
                            defaultValue={defaulValueTextField("suffix", "person")}
                            onChange={(e) => {

                                if (e.target.value === '') {
                                    formData.person = { ...formData.person, ["suffix"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if (e.target.value !== '') {
                                    formData.person = { ...formData.person, ["suffix"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>

                        <TextField fullWidth required
                            variant="outlined" id="FatherName" name="FatherName"
                            label="نام پدر"
                            FormHelperTextProps={{ classes: helperTestClasses }}

                            className={missingcheckPerson("FatherName") ? classes.as : classes.formControl}
                            helperText={missingcheckPerson("FatherName") ? "پر کردن این فیلد الزامی است" : ""}
             
                            defaultValue={defaulValueTextField("FatherName", "person")}
                            onChange={(e) => {
                                if ((e.target.value) === '') {
                                    formData.person = { ...formData.person, ["FatherName"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {
                                    setStyle(prev => ({
                                        ...prev,
                                        FatherName: false
                                    }))
                                    formData.person = { ...formData.person, ["FatherName"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}

                        />

                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField fullWidth required
                            variant="outlined" id="PlaceOfBirthGeoID" name="PlaceOfBirthGeoID"
                            label="محل تولد"
                            FormHelperTextProps={{ classes: helperTestClasses }}        
                            className={missingcheckPerson("PlaceOfBirthGeoID") ? classes.as : classes.formControl}
                            helperText={missingcheckPerson("PlaceOfBirthGeoID") ? "پر کردن این فیلد الزامی است" : ""}
                            value={formData.PlaceOfBirthGeoID}
                            defaultValue={defaulValueTextField("PlaceOfBirthGeoID", "person")}
                            onChange={(e) => {

                                if ((e.target.value) === '') {
                                    formData.person = { ...formData.person, ["PlaceOfBirthGeoID"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {
                                    setStyle(prev => ({
                                        ...prev,
                                        PlaceOfBirthGeoID: false
                                    }))
                                    formData.person = { ...formData.person, ["PlaceOfBirthGeoID"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
               

                        <DatePicker variant="outlined" id="birthDate"
                            value={formData.birthDate ?? currentData.birthDate ?? null}
                            defaultValue={currentData.birthDate ? currentData.birthDate : ""}
                            setValue={handleDateChangDate}
                            required={true}
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            className={missingcheckPerson("birthDate") ? classes.as : classes.formControl}
                            helperText={missingcheckPerson("birthDate") ? "پر کردن این فیلد الزامی است" : ""}
                         
                            errorState={style.birthDate}
                            format={"jYYYY/jMMMM/jDD"}
                            label="تاریخ تولد " fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4}>

                        <TextField fullWidth required
                            variant="outlined" id="Nationalcode" name="Nationalcode"
                            label=" کد ملی"
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            type={"number"}
                            className={(style.Nationalcode || style.NationalcodeId) ? classes.as : classes.formControl}
                            helperText={style.Nationalcode ? "کد ملی باید ۱۰ رقمی باشد" : (style.NationalcodeId) ? "کدملی وارد شده تکرای میباشید" : ""}

                            onChange={validatorNationalcode}
                            defaultValue={defaulValueTextField("Nationalcode", "partyIdentification")}

                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth required
                            variant="outlined" id="idNumber" name="idNumber"
                            label="شماره شناسنامه"
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            // className={style.idNumber ? classes.as : classes.formControl}
                            // helperText={style.idNumber ? "پر کردن این فیلد الزامی است" : ""}

                            className={missingcheckIdentification("idNumber") ? classes.as : classes.formControl}
                            helperText={missingcheckIdentification("idNumber") ? "پر کردن این فیلد الزامی است" : ""}
                            
                            onChange={(e) => {
                                if ((e.target.value) === '') {
                                    formData.partyIdentification = { ...formData.partyIdentification, ["idNumber"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {
                                    setStyle(prev => ({
                                        ...prev,
                                        idNumber: false
                                    }))
                                    formData.partyIdentification = { ...formData.partyIdentification, ["idNumber"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}
                            defaultValue={defaulValueTextField("idNumber", "partyIdentification")}

                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth required
                            variant="outlined" id="serialnumber" name="serialnumber"
                            label="سری شناسنامه"
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            // className={style.serialnumber ? classes.as : classes.formControl}
                            // helperText={style.serialnumber ? "پر کردن این فیلد الزامی است" : ""}
                            className={missingcheckIdentification("serialnumber") ? classes.as : classes.formControl}
                            helperText={missingcheckIdentification("serialnumber") ? "پر کردن این فیلد الزامی است" : ""}
                            onChange={(e) => {
                                if ((e.target.value) === '') {
                                    formData.partyIdentification = { ...formData.partyIdentification, ["serialnumber"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {
                                    setStyle(prev => ({
                                        ...prev,
                                        serialnumber: false
                                    }))
                                    formData.partyIdentification = { ...formData.partyIdentification, ["serialnumber"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}
                            defaultValue={defaulValueTextField("serialnumber", "partyIdentification")}

                        />
                    </Grid>

                    <Grid item xs={12} md={4} style={{ marginTop: "-16px" }}>
                        <Autocomplete
                            id="CountryGeoId" name="CountryGeoId"
                            options={data.geos.GEOT_COUNTRY}
                            getOptionLabel={option => option.geoName || ""}
                            onChange={(event, newValue) => {
                                if (newValue !== null) {
                                    setStyle(prev => ({
                                        ...prev,
                                        CountryGeoId: false
                                    }))
                                    handleChangeAutoComplete(newValue, "geoId", "person", "CountryGeoId")
                                }
                                if (newValue === null) {
                                    formData.person = { ...formData.person, ["CountryGeoId"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                    if (typeof currentData.CountryGeoId != "undefined") {
                                        formData.person = { ...formData.person, ["CountryGeoId"]: "" };
                                        const newFormdata = Object.assign({}, formData);
                                        setFormData(newFormdata)
                                    }
                                }
                            }
                            }
                            defaultValue={() => {
                                let current = false;
                                data.geos.GEOT_COUNTRY.map((item, index) => {
                                    if (item.geoId === currentData.CountryGeoId) {
                                        current = item
                                    }

                                });
                                return current;
                            }
                            }
                            renderInput={params => {
                                return (
                                    <TextField required
                                        {...params}
                                        FormHelperTextProps={{ classes: helperTestClasses }}
                                        className={style.CountryGeoId ? classes.as : classes.formControl}
                                        helperText={style.CountryGeoId ? "پر کردن این فیلد الزامی است" : ""}
                                        variant="outlined"
                                        label="ملیت"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />

                    </Grid>
                    <Grid item xs={12} md={4}>
                      
                        <Autocomplete style={{ marginTop: -16 }}
                            id="Cityplaceofissue" name="Cityplaceofissue"
                            options={data.geos.GEOT_PROVINCE}
                            getOptionLabel={option => option?.geoName || ''}
                            onChange={(event, newValue) => {
                                handleChangeAutoComplete(newValue, "geoId", "person", "Cityplaceofissue")
                                if (newValue === null) {
                                    if (typeof currentData.Cityplaceofissue != "undefined") {
                                        formData.person = { ...formData.person, ["Cityplaceofissue"]: "" };
                                        const newFormdata = Object.assign({}, formData);
                                        setFormData(newFormdata)
                                    }
                                }
                            }}
                            defaultValue={() => {
                                return autoCompleteDefaultValue(data.geos.GEOT_PROVINCE, "geoId", currentData.Cityplaceofissue);
                            }}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="استان محل صدور"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />
                        <ModalDelete open={open} id={idDelete} handleClose={handleClose} setTableContent={setTableContent} setOpen={setOpen} setId={setId} />

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth
                            variant="outlined" id="Regionplaceofissue" name="Regionplaceofissue"
                            label="بخش محل صدور"
                            value={formData.Regionplaceofissue}
                            defaultValue={defaulValueTextField("Regionplaceofissue", "person")}
                            onChange={(e) => {
                                if (e.target.value === null) {
                                    formData.person = { ...formData.person, ["Regionplaceofissue"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if (e.target.value !== null) {
                                    formData.person = { ...formData.person, ["Regionplaceofissue"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete style={{ marginTop: -16 }}
                            id="ReligionEnumID" name="ReligionEnumID"
                            options={data.enums.ReligionEnumId}
                            getOptionLabel={option => option?.description || ''}
                            onChange={(event, newValue) => {
                                handleChangeAutoComplete(newValue, "enumId", "person", "ReligionEnumID")
                                if (newValue === null) {
                                    if (typeof currentData.ReligionEnumID != "undefined") {
                                        formData.person = { ...formData.person, ["ReligionEnumID"]: "" };
                                        const newFormdata = Object.assign({}, formData);
                                        setFormData(newFormdata)
                                    }
                                }
                            }}
                            defaultValue={() => {
                                return autoCompleteDefaultValue(data.enums.ReligionEnumId, "enumId", currentData.ReligionEnumID);
                            }}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="دین"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete style={{ marginTop: -16 }}
                            id="sectEnumID" name="sectEnumID"
                            options={data.enums.SectEnumId}
                            getOptionLabel={option => option?.description || ''}

                            onChange={(event, newValue) => {
                                handleChangeAutoComplete(newValue, "enumId", "person", "sectEnumID")
                                if (newValue === null) {
                                    if (typeof currentData.sectEnumID != "undefined") {
                                        formData.person = { ...formData.person, ["sectEnumID"]: "" };
                                        const newFormdata = Object.assign({}, formData);
                                        setFormData(newFormdata)
                                    }
                                }
                            }}
                            defaultValue={() => {
                                return autoCompleteDefaultValue(data.enums.SectEnumId, "enumId", currentData.sectEnumID);
                            }}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="مذهب"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />

                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete style={{ marginTop: -16 }}
                            id="residenceStatusEnumId" name="residenceStatusEnumId"
                            options={data.enums.ResidenceStatus}
                            getOptionLabel={option => option.description || option}
                            onChange={(event, newValue) => {
                                if (newValue !== null) {
                                    setStyle(prev => ({
                                        ...prev,
                                        residenceStatusEnumId: false
                                    }))
                                    handleChangeAutoComplete(newValue, "enumId", "person", "residenceStatusEnumId")
                                }
                                if (newValue === null) {
                                    formData.person = { ...formData.person, ["residenceStatusEnumId"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                    if (typeof currentData.residenceStatusEnumId != "undefined") {
                                        formData.person = { ...formData.person, ["residenceStatusEnumId"]: "" };
                                        const newFormdata = Object.assign({}, formData);
                                        setFormData(newFormdata)
                                    }
                                }
                            }}
                            defaultValue={() => {
                                return autoCompleteDefaultValue(data.enums.ResidenceStatus, "enumId", currentData.residenceStatusEnumId);
                            }}
                            renderInput={params => {
                                return (
                                    <TextField required
                                        {...params}
                                        FormHelperTextProps={{ classes: helperTestClasses }}
                                        className={missingcheckPerson("residenceStatusEnumId") ? classes.as : classes.formControl}
                                        helperText={missingcheckPerson("residenceStatusEnumId") ? "پر کردن این فیلد الزامی است" : ""}
                                        variant="outlined"
                                        label="وضعیت اسکان"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Autocomplete style={{ marginTop: -16 }}
                            id="maritalStatusEnumId" name="maritalStatusEnumId"
                            options={data.enums.MaritalStatus}
                            getOptionLabel={option => option.description || option}
                            onChange={(event, newValue) => {
                                if (newValue !== null) {
                                    setStyle(prev => ({
                                        ...prev,
                                        maritalStatusEnumId: false
                                    }))
                                    handleChangeAutoComplete(newValue, "enumId", "person", "maritalStatusEnumId")
                                }
                                if (newValue === null) {
                                    formData.person = { ...formData.person, ["maritalStatusEnumId"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                    if (typeof currentData.maritalStatusEnumId != "undefined") {
                                        formData.person = { ...formData.person, ["maritalStatusEnumId"]: "" };
                                        const newFormdata = Object.assign({}, formData);
                                        setFormData(newFormdata)
                                    }
                                }
                            }
                            }
                            defaultValue={() => {
                                return autoCompleteDefaultValue(data.enums.MaritalStatus, "enumId", currentData.maritalStatusEnumId);
                            }}
                            renderInput={params => {
                                return (
                                    <TextField required
                                        {...params}
                                        FormHelperTextProps={{ classes: helperTestClasses }}
                                        className={missingcheckPerson("maritalStatusEnumId") ? classes.as : classes.formControl}
                                        helperText={missingcheckPerson("maritalStatusEnumId") ? "پر کردن این فیلد الزامی است" : ""}
                                        variant="outlined"
                                        label="وضعیت تاهل"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField fullWidth
                            // disabled={((currentData.maritalStatusEnumId === "MarsSingle" || ( formData?.person?.maritalStatusEnumId === "MarsSingle")) ? true : false)}
                            disabled={(!formData?.person?.maritalStatusEnumId) ? ((currentData.maritalStatusEnumId === "MarsSingle") ? true : false) : ((formData?.person?.maritalStatusEnumId === "MarsSingle") ? true : false)}
                            variant="outlined" id="NumberofKids" name="NumberofKids"
                            label="تعداد فرزندان" type="number"
                            value={formData.NumberofKids}
                            defaultValue={defaulValueTextField("NumberofKids", "person")}
                            onChange={(e) => {
                                if (e.target.value === null) {
                                    formData.person = { ...formData.person, ["NumberofKids"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if (e.target.value !== null) {
                                    formData.person = { ...formData.person, ["NumberofKids"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}


                        />
                    </Grid>
                    <Grid item xs={12} md={4}>

                        <TextField fullWidth
                            variant="outlined" id="boorsCode" name="boorsCode"
                            label="کدبورسی "
                            value={formData.boorsCode}
                            defaultValue={defaulValueTextField("boorsCode", "partyIdentification")}
                            onChange={(e) => {
                                if (e.target.value === null) {
                                    formData.partyIdentification = { ...formData.partyIdentification, ["boorsCode"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if (e.target.value !== null) {
                                    formData.partyIdentification = { ...formData.partyIdentification, ["boorsCode"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}


                        />
                    </Grid>

                    <Grid>

                    </Grid>
                    <Grid item xs={12} md={4} >
                        <Autocomplete style={{ marginTop: -16 }}
                            disabled={(formData.person && formData.person.gender === "N") ||
                                (currentData.gender === "N") ? true : false
                            }
                            id="partyClassificationId" name="partyClassificationId"
                            options={data.classifications.Militarystate}
                            getOptionLabel={option => option.description || option}
                            onChange={(event, newValue) => {
                                handleChangeAutoComplete(newValue, "partyClassificationId", "partyClassification", "partyClassificationId")
                                setPartyClassification(newValue?.description)
                                if (newValue === null) {
                                    if (typeof currentData.partyClassificationId != "undefined") {
                                        formData.partyClassification = { ...formData.partyClassification, ["partyClassificationId"]: "" };
                                        const newFormdata = Object.assign({}, formData);
                                        setFormData(newFormdata)
                                    }
                                }
                            }}
                            // value={autoCompleteNationalValue(data.classifications.Militarystate, "partyClassificationId", currentData.partyClassificationId)}
                            value={partyClassification}
                            // defaultValue={() => {
                            //     console.log(DataMilitary.partyClassificationList,"kkkk")
                            //     console.log(data.classifications.Militarystate,"kkkk1")
                            //     console.log(currentData,"kkkk2")
                            //     return autoCompleteNationalValue(DataMilitary.partyClassificationList, "partyClassificationId", DataMilitary.partyClassificationList.partyClassificationId)
                            // }}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="وضعیت نظام وظیفه"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth
                            disabled={(formData && typeof formData.person != 'undefined' &&
                                formData.person.gender === "N") ? true : false}
                            variant="outlined" id="MilitaryCode" name="MilitaryCode"
                            label="کد نظام وظیفه"
                            // value={formData.MilitaryCode}
                            defaultValue={defaulValueTextField("MilitaryCode", "person")}
                            onChange={(e) => {
                                if (e.target.value === null) {
                                    formData.person = { ...formData.person, ["MilitaryCode"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if (e.target.value !== null) {
                                    formData.person = { ...formData.person, ["MilitaryCode"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                                addFormData("", "person")
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl>
                            <FormControlLabel
                                control={<Checkbox name="criminalRecord"
                                    value={formData.criminalRecord}
                                    defaultChecked={((currentData.criminalRecord === "Y") ? true : false)}
                                    onChange={handleChange('criminalRecord')}
                                />}
                                label="آیا دارای سوابق کیفری است؟" />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth
                            variant="outlined" id="PtidPassport" name="PtidPassport"
                            label="شماره پاسپورت  "
                            value={formData.PtidPassport}
                            defaultValue={defaulValueTextField("PtidPassport", "partyIdentification")}
                            onChange={(e) => {
                                if (e.target.value === null) {
                                    formData.partyIdentification = { ...formData.partyIdentification, ["PtidPassport"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if (e.target.value !== null) {
                                    formData.partyIdentification = { ...formData.partyIdentification, ["PtidPassport"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}

                        />

                    </Grid>
                    <Grid item xs={12} md={4}>

                        <DatePicker variant="outlined" id="expireDate"
                            value={formData.expireDate ?? currentData.expireDate ?? null}
                            defaultValue={currentData.expireDate ? currentData.expireDate : ""}
                            setValue={handleDateChangDatePassport}
                            format={"jYYYY/jMMMM/jDD"}
                            label="تاریخ پاسپورت " fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>

                                <TextField fullWidth multiline rows={3}
                                    variant="outlined" id="noteText" name="noteText"
                                    label="توضیحات"
                                    value={formData.noteText}
                                    defaultValue={defaulValueTextField("noteText", "partyNote")}
                                    inputProps={{ className: classes.textarea }}
                                    onChange={(e) => {
                                        if (e.target.value === null) {
                                            formData.partyNote = { ...formData.partyNote, ["noteText"]: "" };
                                            const newFormdata = Object.assign({}, formData);
                                            setFormData(newFormdata)
                                        } else if (e.target.value !== null) {
                                            formData.partyNote = { ...formData.partyNote, ["noteText"]: e.target.value };
                                            const newFormdata = Object.assign({}, formData);
                                            setFormData(newFormdata)
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Card variant="outlined" className="mt-20" style={{ width: 1500 }}>
                        <CardHeader title="پیوست" />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>

                                <Autocomplete
                                    id="partyContentTypeEnumId" name="partyContentTypeEnumId"
                                    options={data.peyvasts.Attachment}
                                    value={formData.partyContentTypeEnumId && formData.partyContentTypeEnumId}
                                    getOptionLabel={option => option.description || option}
                                    onChange={(event, newValue) => {
                                        if (newValue !== null) {
                                            setaddrowFile(false)
                                            setFormData({ ...formData, ["partyContentTypeEnumId"]: newValue.enumId });

                                        } else {
                                            setaddrowFile(true)
                                        }
                                    }}


                                    renderInput={params => {
                                        return (
                                            <TextField
                                                {...params}
                                                FormHelperTextProps={{ classes: helperTestClasses }}
                                                className={addrowFile === true ? classes.as : classes.formControl}
                                                helperText={addrowFile === true ? "پر کردن این فیلد الزامی است" : ""}

                                                variant="outlined"
                                                label="نوع پیوست"
                                                margin="normal"
                                                fullWidth
                                            />
                                        );
                                    }}
                                />

                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Button
                                    className="mt-5" >

                                    <input type="file" id="contentLocation" name="contentLocation" filename={currentData.contentLocation ?? ""}
                                        onChange={(event) => {

                                            if (event) {
                                                let { id, value, name } = event.target;
                                                value = event.target.files[0];
                                                setaddrowFile1(false)
                                                formData.partyContent = { ...formData.partyContent, ["contentLocation"]: value };
                                                const newFormdata = Object.assign({}, formData);
                                                setFormData(newFormdata)
                                            }
                                        }}
                                    />

                                </Button>
                                <p style={{ color: "red" }} className={addrowFile1 === true ?
                                    classes.qw3 : classes.qw2}>انتخاب فایل اجباری است</p>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Paper />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button style={{ "marginRight": 10, "marginButtom": 100 }} variant="contained"
                                    color="secondary" startIcon={<Add />} id="add"
                                    className="mt-5"
                                    onClick={addTableRow}
                                >
                                    افزودن
                                </Button>
                            </Grid>



                        </Grid>
                        <CTable headers={[{
                            id: "partyContentTypeEnumId",
                            label: "نوع پیوست"
                        },
                        {
                            id: "contentDate",
                            label: "تاریخ آپلود"
                        },
                        {
                            id: "viewFile",
                            label: "مشاهده فایل"
                        },
                        {
                            id: "delete",
                            label: "حذف"
                        },]} rows={tableContent} />
                    </Card>
                </Grid>
                <Button id="modifydata" variant="contained"
                    className="mt-5" style={{ color: "white", backgroundColor: "green" }}
                    onClick={() => { updateRow(partyId) }}

                >ثبت</Button>
            
            </CardContent>
        </Card>
    );
}

export default BaseInformationForm;
