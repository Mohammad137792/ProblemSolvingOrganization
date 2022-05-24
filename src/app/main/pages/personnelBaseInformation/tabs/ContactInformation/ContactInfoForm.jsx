import React from 'react';
import { Button, Card, CardContent, Grid, MenuItem, TextField, Typography } from "@material-ui/core";
import DatePicker from "../../../../components/DatePicker";
import { Add, DeleteOutlined } from "@material-ui/icons";
import CTable from "../../../../components/CTable";
import { INPUT_TYPES, setFormDataHelper } from "../../../../helpers/setFormDataHelper";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ALERT_TYPES, fetchFailed, fetchSucceed, setAlertContent, submitPost } from "../../../../../store/actions/fadak";
import Modal from "@material-ui/core/Modal";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../../configs";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from '@material-ui/core/InputAdornment';
import CardHeader from '@material-ui/core/CardHeader';
import ModalDelete from "./ModalDelete"
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import moment from "moment";

const useStyles = makeStyles((theme, theme1) => ({
    qw: {
        visibility: "hidden"
    },
    qw1: {
        visibility: "show"
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

    as: {
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        }
    },
    div: {

        "&.MuiInputAdornment-root MuiInputAdornment-positionStart": {
        }
    }

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
const ContactInfoForm = ({ addFormData, setFormData, formData, data, tableContent, setTableContent, currentData, setCurrentData, partyId, activeStep, addrow, currentData2,
    addressToEdit1, setStyle, style, idDelete, currentData1, open, handleClose, CmtOrgPostalPhone, enableDisableCreate, cancelUpdate, addRow, enablecancel,
    addressEdit, cancelAdd, addressToEdit, contactMechId, tel, settel, fromDate,
    updateRow }) => {
    const classes = useStyles();
    const helperTestClasses = helperTextStyles();
    const [afteradd, setafteradd] = React.useState(false);
    const [afteradd1, setafteradd1] = React.useState(false);



    return (
        <Card variant="outlined">
            <CardHeader title="شماره تماس" />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>

                        <Autocomplete style={{ marginTop: -16 }}
                            id="descriptionTel" name="descriptionTel"
                            options={data}
                            disabled={addressToEdit1 === true ? true : false}
                            getOptionLabel={option => option.description || option}
                            onChange={(event, newValue) => {
                                if (newValue !== null) {
                                    setafteradd1(true)
                                    formData.postalAddress = { ...formData.postalAddress, ["descriptionTel"]: newValue.contactMechPurposeId };
                                    setStyle(prevState => ({
                                        ...prevState,
                                        descriptionTel: false
                                    }))
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                                if (newValue === null) {
                                    setafteradd1(false)
                                    formData.postalAddress = { ...formData.postalAddress, ["descriptionTel"]: "" };
                                    const newFormdata = Object.assign({}, formData)
                                    setFormData(newFormdata)
                                    if (typeof currentData[addressToEdit] != "undefined") {
                                        if (typeof currentData[addressToEdit].contactMechPurposeId != "undefined") {
                                            formData.postalAddress = { ...formData.postalAddress, ["descriptionTel"]: "" };
                                            const newFormdata = Object.assign({}, formData);
                                            setFormData(newFormdata)
                                        }
                                    }
                                }
                            }
                            }
                            defaultValue={

                                () => {
                                    let current = null;
                                    if (addressEdit === -1 && typeof currentData[addressToEdit] != 'undefined') {
                                        data.map((item, index) => {
                                            if (item.contactMechPurposeId === currentData[addressToEdit].contactMechPurposeId) {
                                                current = item
                                            }
                                        });
                                    } else if (addressEdit === 100 && typeof currentData2 != 'undefined') {
                                        if (typeof currentData2[addressToEdit] != 'undefined') {
                                            // data.map((item, index) => {
                                            //     if (item.contactMechPurposeId === currentData2[addressToEdit].contactMechPurposeId) {
                                            current = currentData2[addressToEdit].descriptionTel
                                            //     }
                                            // });
                                        }
                                    }
                                    return current;

                                }


                            }

                            renderInput={params => {
                                return (
                                    <TextField
                                        // value={formData.descriptionTel}
                                        {...params} required
                                        className={(style.descriptionTel === true && afteradd1 === false) ? classes.as : classes.formControl}
                                        helperText={(style.descriptionTel === true && afteradd1 === false) ? "پر کردن این فیلد الزامی است" : ""}
                                        FormHelperTextProps={{ classes: helperTestClasses }}
                                        variant="outlined"
                                        label=" نوع شماره تماس"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />

                    </Grid>
                    <Grid item xs={12} md={5}>

                        <TextField required fullWidth
                            variant="outlined" id="contactNumber" name="contactNumber"
                            label="شماره تلفن ثابت"
                            className={(style.contactNumber === true || afteradd === true) ? classes.as : classes.formControl}
                            helperText={(style.contactNumber === true || afteradd === true) ? "پر کردن این فیلد الزامی است" : ""}
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            value={formData.contactNumber}
                            onChange={(e) => {
                                if ((e.target.value) === '') {
                                    setafteradd(true)
                                    settel(true)
                                    formData.postalAddress = { ...formData.postalAddress, ["contactNumber"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {
                                    setafteradd(false)
                                    settel(false)
                                    setStyle(prevState => ({
                                        ...prevState,
                                        contactNumber: false
                                    }))
                                    formData.postalAddress = { ...formData.postalAddress, ["contactNumber"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                                // addFormData("","payment")
                            }}
                            // onChange={()=>{
                            //     setafteradd(true)
                            //     addFormData("","postalAddress")
                            // }}
                            defaultValue={(addressEdit === -1 && typeof currentData[addressToEdit] != 'undefined' && currentData[addressToEdit]
                                && currentData[addressToEdit].contactNumber !== '') ? currentData[addressToEdit].contactNumber :
                                (addressEdit === 100 && typeof currentData2 != 'undefined' && typeof currentData2[addressToEdit] != 'undefined'
                                    && currentData2[addressToEdit].contactNumber !== ''
                                    ?
                                    currentData2[addressToEdit].contactNumber : ""
                                )
                            }
                        />

                    </Grid>
                    <Grid item xs={12} md={1}>

                        <TextField fullWidth

                            variant="outlined" id="areaCode" name="areaCode"
                            label="پیش شماره" value={formData.areaCode}
                            onChange={(e) => {
                                if (e.target.value === null) {
                                    formData.postalAddress = { ...formData.postalAddress, ["areaCode"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if (e.target.value !== null) {
                                    formData.postalAddress = { ...formData.postalAddress, ["areaCode"]: e.target.value };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                                // addFormData("","payment")
                            }}
                            defaultValue={addressEdit === -1 && typeof currentData[addressToEdit] != 'undefined' && typeof currentData[addressToEdit] != 'undefined'
                                && currentData[addressToEdit].areaCode !== ''
                                ? currentData[addressToEdit].areaCode :

                                (addressEdit === 100 && typeof currentData2 != 'undefined' && typeof currentData2[addressToEdit] != 'undefined'
                                    && currentData2[addressToEdit].areaCode !== ''
                                    ?
                                    currentData2[addressToEdit].areaCode : ""
                                )}


                        />
                    </Grid>

                </Grid>
                <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                    {!enableDisableCreate ? <Button variant="outlined" id="add" variant="contained" color="primary" startIcon={<Add />}
                        className="mt-5" onClick={addRow}>افزودن</Button> : null}
                    <br />
                    {!enableDisableCreate ? <Button disabled={enablecancel}
                        variant="outlined" style={{ marginLeft: "20px" }} variant="contained"
                        className="mt-5" onClick={cancelAdd}>لغو</Button> : null}
                </Grid>

                <br />
                <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                    {enableDisableCreate ? <Button id="modify" variant="outlined" variant="contained" color="primary" startIcon={<Add />}
                        className="mt-5" disabled={!enableDisableCreate}
                        onClick={() => updateRow(contactMechId, data, addressEdit)}>ثبت</Button> : null}
                    {(enableDisableCreate) ? <Button id="modify" disabled={enablecancel} variant="outlined" style={{ marginLeft: "20px" }} variant="contained"
                        className="mt-5"
                        onClick={cancelUpdate}>لغو</Button> : null}
                </Grid>
                <ModalDelete open={open} id={idDelete} tableContent={tableContent} handleClose={handleClose} setTableContent={setTableContent} partyId={partyId} fromDate={fromDate} />


                {activeStep === false && !CmtOrgPostalPhone&& <p style={{ color: "red" }} id={"IdContact"} className={((formData.descriptionTel === "PhoneMobile") ? classes.qw : classes.qw1)} >وارد کردن شماره موبایل الزامی است</p>}
                <CTable style={{ marginTop: "-32px" }} headers={[{
                    id: "descriptionTel",
                    label: "نوع اطلاعات تماس"
                }, {
                    id: "contactNumber",
                    label: "شماره تماس ثابت "
                }, {
                    id: "delete",
                    label: "حذف"
                }, {
                    id: "modify",
                    label: "ویرایش"
                },]} rows={tableContent} />



            </CardContent>
        </Card>
    );
};

export default ContactInfoForm;
