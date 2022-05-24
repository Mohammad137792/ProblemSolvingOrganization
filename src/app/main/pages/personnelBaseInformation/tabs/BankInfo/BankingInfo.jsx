import React from 'react';
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import CTable from "../../../../components/CTable";
import { makeStyles } from "@material-ui/core/styles";
import ModalDelete from "./ModalDelete";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme, theme1) => ({
    logo: {
        maxWidth: 160,
    },
    adornedStart: {
        display: "none"
    },
    buttonStyle: {
        disabled: true
    },
    as: {
        "&  .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        }
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


const BankingInfo = ({ addFormData, setFormData, formData, data, tableContent, setTableContent, style,
    setStyle, cancelAdd, setDisplay,
    idDelete, open, handleClose, currentData, cancelUpdate, enablecancel, BankToEdit, display,
    setCurrentData, enableDisableCreate, addRow, updateRow
    


}) => {
    const classes = useStyles();
    const helperTestClasses = helperTextStyles();




    const [expanded, setExpanded] = React.useState(false);

    const handleChangeAutoComplete = (newValue, field, tableName, filedName) => {
        if (newValue !== null) {
            formData[tableName] = { ...formData[tableName], [filedName]: newValue[field] }
            const newFormdata = Object.assign({}, formData)
            setFormData(newFormdata)
        }
    }

    return (
        <Card variant="outlined" className="mt-20">
            <CardHeader title="اطلاعات بانکی" />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>

                        <Autocomplete style={{ marginTop: -16 }}
                            id="paymentMethodTypeEnumId" name="paymentMethodTypeEnumId"
                            options={data.enums.PaymentMethodPurpose}
                            getOptionLabel={option => option.description || option}
                            onChange={(event, newValue) => {
                                if (newValue !== null) {

                                    setStyle(prevState => ({
                                        ...prevState,
                                        paymentMethodTypeEnumId: false
                                    }))
                                    formData.payment = {
                                        ...formData.payment,
                                        ["paymentMethodTypeEnumId"]: newValue.enumId
                                    }
                                    const newFormdata = Object.assign({}, formData)
                                    setFormData(newFormdata)
                                } else {

                                    formData.payment = {
                                        ...formData.payment,
                                        ["paymentMethodTypeEnumId"]: ""
                                    };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)

                                }
                            }}
                            defaultValue={() => {
                                let current = null
                                if (display !== false && typeof currentData.PersonPaymentDetails != 'undefined'
                                    && typeof currentData.PersonPaymentDetails[BankToEdit] != "undefined") {
                                    if (typeof currentData.PersonPaymentDetails[BankToEdit].purposeEnumId != "undefined") {
                                        current = currentData.PersonPaymentDetails[BankToEdit].purposeEnumId;
                                        
                                    }
                                }
                                return current;
                            }
                            }

                            renderInput={params => {
                                return (
                                    <TextField required
                                        {...params}

                                        className={(style.paymentMethodTypeEnumId === true ) ? classes.as : classes.formControl}
                                        FormHelperTextProps={{ classes: helperTestClasses }}
                                        helperText={(style.paymentMethodTypeEnumId === true ) ? "پر کردن این فیلد الزامی است" : ""}
                                        variant="outlined"
                                        label="نوع اطلاعات بانکی"
                                        margin="normal"
                                        fullWidth
                                    />
                                );
                            }}
                        />

                    </Grid>
                    <Grid item xs={12} md={4}>

                        <TextField fullWidth required
                            variant="outlined" id="bankName" name="bankName"
                            className={ style.bankName === true ? classes.as : classes.formControl}
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            helperText={ style.bankName === true ? "پر کردن این فیلد الزامی است" : ""}
                            label="عنوان بانک  "
                            onChange={(e) => {
                                if ((e.target.value) === '') {

                                    formData.Bankaccount = { ...formData.Bankaccount, ["bankName"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {

                                    setStyle(prevState => ({
                                        ...prevState,
                                        bankName: false
                                    }))
                                    formData.Bankaccount = {
                                        ...formData.Bankaccount,
                                        ["bankName"]: e.target.value
                                    };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}
                    
                            defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails
                                && currentData.PersonPaymentDetails[BankToEdit]) ? currentData.PersonPaymentDetails[BankToEdit].bankName : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>

                        <TextField fullWidth required
                            variant="outlined" id="routingNumber" name="routingNumber"
                            label="کد شعبه " type="number"
                            className={ style.routingNumber === true ? classes.as : classes.formControl}
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            helperText={ style.routingNumber === true ? "پر کردن این فیلد الزامی است" : ""}
                            onChange={(e) => {
                                if ((e.target.value) === '') {

                                    formData.Bankaccount = { ...formData.Bankaccount, ["routingNumber"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {

                                    setStyle(prevState => ({
                                        ...prevState,
                                        routingNumber: false
                                    }))
                                    formData.Bankaccount = {
                                        ...formData.Bankaccount,
                                        ["routingNumber"]: e.target.value
                                    };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}
                            defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails &&
                                currentData.PersonPaymentDetails[BankToEdit]) ? currentData.PersonPaymentDetails[BankToEdit].routingNumber : ""}


                        />
                    </Grid>
                    <Grid item xs={12} md={4}>

                        <TextField fullWidth
                            required
                            variant="outlined" id="firstNameOnAccount" name="firstNameOnAccount"
                            label="نام مالک حساب "
                            className={ style.firstNameOnAccount === true ? classes.as : classes.formControl}
                            helperText={ style.firstNameOnAccount === true ? "پر کردن این فیلد الزامی است" : ""}
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            onChange={(e) => {
                                if ((e.target.value) === '') {

                                    formData.payment = { ...formData.payment, ["firstNameOnAccount"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {

                                    setStyle(prevState => ({
                                        ...prevState,
                                        firstNameOnAccount: false
                                    }))
                                    formData.payment = {
                                        ...formData.payment,
                                        ["firstNameOnAccount"]: e.target.value
                                    };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}
                            defaultValue={BankToEdit !== -1 && typeof currentData.PersonPaymentDetails[BankToEdit] != 'undefined'
                                && typeof currentData.PersonPaymentDetails[BankToEdit] != "undefined"
                                && typeof currentData.PersonPaymentDetails[BankToEdit].firstNameOnAccount != "undefined" ?
                                currentData.PersonPaymentDetails[BankToEdit].firstNameOnAccount : ''
                            }

                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth required
                            variant="outlined" id="lastNameOnAccount" name="lastNameOnAccount"
                            label=" نام خانوادگی مالک حساب"
                            className={style.lastNameOnAccount === true ? classes.as : classes.formControl}
                            helperText={style.lastNameOnAccount === true ? "پر کردن این فیلد الزامی است" : ""}
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            onChange={(e) => {
                                if ((e.target.value) === '') {
                                    formData.payment = { ...formData.payment, ["lastNameOnAccount"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {

                                    setStyle(prevState => ({
                                        ...prevState,
                                        lastNameOnAccount: false
                                    }))
                                    formData.payment = {
                                        ...formData.payment,
                                        ["lastNameOnAccount"]: e.target.value
                                    };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }
                            }}
                            defaultValue={BankToEdit !== -1 && typeof currentData.PersonPaymentDetails[BankToEdit] != 'undefined'
                                && typeof currentData.PersonPaymentDetails[BankToEdit] != "undefined"
                                && typeof currentData.PersonPaymentDetails[BankToEdit].lastNameOnAccount != "undefined" ?
                                currentData.PersonPaymentDetails[BankToEdit].lastNameOnAccount : ''
                            }

                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth
                            variant="outlined" id="suffixOnAccount" name="suffixOnAccount"
                            label="پسوند"
                            onChange={addFormData("", "payment")}
                            defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails && currentData.PersonPaymentDetails[BankToEdit]) ?
                                currentData.PersonPaymentDetails[BankToEdit].suffixOnAccount : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth
                            variant="outlined" id="accountNumber" name="accountNumber"
                            label="شماره حساب"
                            onChange={addFormData("", "Bankaccount")}
                            defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails && currentData.PersonPaymentDetails[BankToEdit])
                                ? currentData.PersonPaymentDetails[BankToEdit].accountNumber : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth required
                            variant="outlined" id="shebaNumber" name="shebaNumber"
                            label="شماره شبا"
                            className={style.shebaNumber === true ? classes.as : classes.formControl}
                            helperText={style.shebaNumber === true ? "پر کردن این فیلد الزامی است" : ""}
                            FormHelperTextProps={{ classes: helperTestClasses }}
                            onChange={(e) => {
                                if ((e.target.value) === '') {
                                    formData.Bankaccount = { ...formData.Bankaccount, ["shebaNumber"]: "" };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                } else if ((e.target.value) !== '') {

                                    setStyle(prevState => ({
                                        ...prevState,
                                        shebaNumber: false
                                    }))
                                    formData.Bankaccount = {
                                        ...formData.Bankaccount,
                                        ["shebaNumber"]: e.target.value
                                    };
                                    const newFormdata = Object.assign({}, formData);
                                    setFormData(newFormdata)
                                }

                            }}
                            defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails && currentData.PersonPaymentDetails[BankToEdit])
                                ? currentData.PersonPaymentDetails[BankToEdit].shebaNumber : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>

                        <TextField fullWidth
                            variant="outlined" id="cardNumber" name="cardNumber"
                            label="شماره کارت" type="number"
                            onChange={addFormData("", "credit")}
                            defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails && currentData.PersonPaymentDetails[BankToEdit]) ?
                                currentData.PersonPaymentDetails[BankToEdit].cardNumber : ""}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth
                                    variant="outlined" id="description" name="description"
                                    label="توضیحات"
                                    defaultValue={BankToEdit !== -1 && typeof currentData.PersonPaymentDetails[BankToEdit] != 'undefined'
                                        && typeof currentData.PersonPaymentDetails[BankToEdit] != "undefined"
                                        && typeof currentData.PersonPaymentDetails[BankToEdit].description != "undefined" ?
                                        currentData.PersonPaymentDetails[BankToEdit].description : ''
                                    }
                                    onChange={addFormData("", "payment")}
                                />
                            </Grid>
                        </Grid>

                    </Grid>
                    <Card variant="outlined" className="mt-20">
                        <Grid item xs={12} md={12}>
                            <Box p={2}>
                                <Card>
                                    <CardHeader title="آدرس"
                                        action={
                                            <Tooltip title="نمایش ادرس">
                                                <ToggleButton
                                                    value="check"
                                                    selected={expanded}
                                                    onChange={() => setExpanded(prevState => !prevState)}
                                                >
                                                    <FilterListRoundedIcon />
                                                </ToggleButton>
                                            </Tooltip>
                                        }
                                    />
                                    <Collapse in={expanded}>
                                        <Box p={2}>
                                            <Grid container spacing={2}>

                                                <Grid item xs={12} md={4} style={{ marginTop: -16 }}>
                                                    <Autocomplete
                                                        id="countryGeoId" name="countryGeoId"
                                                        options={data.geos.GEOT_COUNTRY}
                                                        getOptionLabel={option => option.geoName || ""}
                                                        onChange={(event, newValue) => {
                                                            handleChangeAutoComplete(newValue, "geoId", "postalAddress", "countryGeoId")
                                                            if (newValue === null) {
                                                                if (display !== false) {
                                                                    if (typeof currentData.PersonPaymentDetails[BankToEdit] != "undefined") {
                                                                        if (typeof currentData.PersonPaymentDetails[BankToEdit].postalCountryGeoId != "undefined") {
                                                                            formData.postalAddress = {
                                                                                ...formData.postalAddress,
                                                                                ["countryGeoId"]: ""
                                                                            };
                                                                            const newFormdata = Object.assign({}, formData);
                                                                            setFormData(newFormdata)
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }}

                                                        defaultValue={() => {

                                                            let current = null;
                                                            data.geos.GEOT_COUNTRY.map((item, index) => {
                                                                if (typeof currentData.PersonPaymentDetails != 'undefined'
                                                                    && typeof currentData.PersonPaymentDetails[BankToEdit] != "undefined"
                                                                    && item.geoId === currentData.PersonPaymentDetails[BankToEdit].postalCountryGeoId) {
                                                                    current = item
                                                                }

                                                            });

                                                            return current;
                                                        }
                                                        }
                                                        renderInput={params => {
                                                            return (
                                                                <TextField
                                                                    {...params}
                                                                    variant="outlined"
                                                                    label="کشور"
                                                                    margin="normal"
                                                                    fullWidth
                                                                />
                                                            );
                                                        }}
                                                    />

                                                </Grid>
                                                <Grid item xs={12} md={4} style={{ marginTop: -16 }}>
                                                    <Autocomplete
                                                        id="stateProvinceGeoId" name="stateProvinceGeoId"
                                                        options={data.geos.GEOT_PROVINCE}
                                                        getOptionLabel={option => option.geoName || ""}
                                                        onChange={(event, newValue) => {
                                                            handleChangeAutoComplete(newValue, "geoId", "postalAddress", "stateProvinceGeoId")
                                                            if (newValue === null) {
                                                                if (display !== false) {
                                                                    if (typeof currentData.PersonPaymentDetails[BankToEdit] != "undefined") {
                                                                        if (typeof currentData.PersonPaymentDetails[BankToEdit].postalStateProvinceGeoId != "undefined") {
                                                                            formData.postalAddress = {
                                                                                ...formData.postalAddress,
                                                                                ["stateProvinceGeoId"]: ""
                                                                            };
                                                                            const newFormdata = Object.assign({}, formData);
                                                                            setFormData(newFormdata)
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        }
                                                        defaultValue={() => {
                                                            let current = null;
                                                            data.geos.GEOT_PROVINCE.map((item, index) => {
                                                                if (typeof currentData.PersonPaymentDetails != 'undefined'
                                                                    && typeof currentData.PersonPaymentDetails[BankToEdit] != "undefined"
                                                                    && item.geoId === currentData.PersonPaymentDetails[BankToEdit].postalStateProvinceGeoId) {
                                                                    current = item
                                                                }
                                                            });
                                                            return current;
                                                        }
                                                        }

                                                        renderInput={params => {
                                                            return (
                                                                <TextField
                                                                    {...params}
                                                                    variant="outlined"
                                                                    label="استان"
                                                                    margin="normal"
                                                                    fullWidth
                                                                />
                                                            );
                                                        }}
                                                    />

                                                </Grid>
                                                <Grid item xs={12} md={4} style={{ marginTop: -16 }}>
                                                    <Autocomplete
                                                        id="countyGeoId" name="countyGeoId"
                                                        options={data.geos.GEOT_COUNTY}
                                                        getOptionLabel={option => option.geoName || ""}
                                                        onChange={(event, newValue) => {
                                                            handleChangeAutoComplete(newValue, "geoId", "postalAddress", "countyGeoId")
                                                            if (newValue === null) {
                                                                if (display !== false) {
                                                                    if (typeof currentData.PersonPaymentDetails[BankToEdit] != "undefined") {
                                                                        if (typeof currentData.PersonPaymentDetails[BankToEdit].postalCountyGeoId != "undefined") {
                                                                            formData.postalAddress = {
                                                                                ...formData.postalAddress,
                                                                                ["countyGeoId"]: ""
                                                                            };
                                                                            const newFormdata = Object.assign({}, formData);
                                                                            setFormData(newFormdata)
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        }
                                                        defaultValue={() => {

                                                            let current = null;
                                                            data.geos.GEOT_COUNTY.map((item, index) => {
                                                                if (typeof currentData.PersonPaymentDetails != 'undefined'
                                                                    && typeof currentData.PersonPaymentDetails[BankToEdit] != "undefined"
                                                                    && item.geoId === currentData.PersonPaymentDetails[BankToEdit].postalCountyGeoId) {
                                                                    current = item
                                                                }

                                                            });
                                                            return current;
                                                        }
                                                        }
                                                        renderInput={params => {
                                                            return (
                                                                <TextField
                                                                    {...params}
                                                                    variant="outlined"
                                                                    label="شهرستان"
                                                                    margin="normal"
                                                                    fullWidth
                                                                />
                                                            );
                                                        }}
                                                    />

                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth
                                                        variant="outlined" id="district" name="district"
                                                        label="محله"
                                                        defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails
                                                            && currentData.PersonPaymentDetails[BankToEdit]) ?
                                                            currentData.PersonPaymentDetails[BankToEdit].postalDistrict : ""}

                                                        onChange={addFormData("", "postalAddress")}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth
                                                        variant="outlined" id="street" name="street"
                                                        label="خیابان"
                                                        onChange={addFormData("", "postalAddress")}
                                                        defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails
                                                            && currentData.PersonPaymentDetails[BankToEdit]) ?
                                                            currentData.PersonPaymentDetails[BankToEdit].postalStreet : ""}

                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth
                                                        variant="outlined" id="alley" name="alley"
                                                        label="کوچه"
                                                        onChange={addFormData("", "postalAddress")}
                                                        defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails && currentData.PersonPaymentDetails[BankToEdit]) ?
                                                            currentData.PersonPaymentDetails[BankToEdit].postalAlley : ""}


                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth
                                                        variant="outlined" id="plate" name="plate"
                                                        label="پلاک"
                                                        defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails && currentData.PersonPaymentDetails[BankToEdit]) ?
                                                            currentData.PersonPaymentDetails[BankToEdit].postalPlate : ""}

                                                        onChange={addFormData("", "postalAddress")}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth
                                                        variant="outlined" id="floor" name="floor"
                                                        label="طبقه"
                                                        defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails && currentData.PersonPaymentDetails[BankToEdit]) ?
                                                            currentData.PersonPaymentDetails[BankToEdit].postalFloor : ""}

                                                        onChange={addFormData("", "postalAddress")}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth
                                                        variant="outlined" id="unitNumber" name="unitNumber"
                                                        label="واحد"
                                                        defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails && currentData.PersonPaymentDetails[BankToEdit]) ?
                                                            currentData.PersonPaymentDetails[BankToEdit].postalUnitNumber : ""}

                                                        onChange={addFormData("", "postalAddress")}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth
                                                        variant="outlined" id="postalCode" name="postalCode"
                                                        label="کدپستی"
                                                        defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails && currentData.PersonPaymentDetails[BankToEdit]) ?
                                                            currentData.PersonPaymentDetails[BankToEdit].postalPostalCode : ""}

                                                        onChange={addFormData("", "postalAddress")}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <TextField fullWidth
                                                        variant="outlined" id="contactNumber" name="contactNumber"
                                                        label="شماره تماس ثابت "
                                                        defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails
                                                            && currentData.PersonPaymentDetails[BankToEdit]) ?
                                                            currentData.PersonPaymentDetails[BankToEdit].contactNumber : ""}

                                                        onChange={addFormData("", "telecom")}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={1}>
                                                    <TextField fullWidth
                                                        variant="outlined" id="areaCode" name="areaCode"
                                                        label="پیش شماره"
                                                        defaultValue={(BankToEdit !== -1 && currentData.PersonPaymentDetails
                                                            && currentData.PersonPaymentDetails[BankToEdit]) ?
                                                            currentData.PersonPaymentDetails[BankToEdit].areaCode : ""}

                                                        onChange={addFormData("", "telecom")}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Collapse>
                                </Card>
                            </Box>
                        </Grid>
                    </Card>
                </Grid>





                <ModalDelete currentData={currentData}
                    setCurrentData={setCurrentData} open={open} id={idDelete} handleClose={handleClose}
                    setTableContent={setTableContent} BankToEdit={BankToEdit} setDisplay={setDisplay} />
                <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                    {!enableDisableCreate ?
                        <Button variant="outlined" id="add" variant="contained" color="primary" startIcon={<Add />}
                            className="mt-5"
                            onClick={addRow}
                        >افزودن</Button> : null}
                    {!enableDisableCreate ? <Button variant="outlined" style={{ marginLeft: "20px" }} variant="contained"
                        className="mt-5"
                        onClick={cancelAdd}
                    >لغو</Button> : null}
                </Grid>
                <br />
                <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                    {enableDisableCreate ? <Button id="modify" variant="contained" style={{ backgroundColor: "green" }}
                        className="mt-5" disabled={(!enableDisableCreate)}

                        onClick={() => updateRow()}
                    >ثبت</Button> : null}
                    {(enableDisableCreate) ? <Button id="modify" disabled={enablecancel}
                        variant="outlined" style={{ marginLeft: "20px" }} variant="contained"
                        className="mt-5"
                        onClick={cancelUpdate}>لغو</Button> : null}
                </Grid>
                {console.log(tableContent,"jjjjjjjjj")}
                

                
                <CTable headers={[
                    {
                        id: "paymentMethodTypeEnumId",
                        label: "نوع اطلاعات بانکی"
                    }, {
                        id: "bankingInformationAccountOwnerName",
                        label: "مالک حساب"
                    }, {
                        id: "bankName",
                        label: "عنوان بانک"
                    }, {
                        id: "routingNumber",
                        label: "کد شعبه"
                    }, {
                        id: "accountNumber",
                        label: "شماره حساب"
                    }, {

                        id: "shebaNumber",
                        label: " شماره شبا"
                    }, {

                        id: "cardNumber",
                        label: "شماره کارت"
                    }, {
                        id: "delete",
                        label: " حذف"
                    },

                    {
                        id: "modify",
                        label: " ویرایش"
                    }]
                } rows={tableContent[0]?.bankName===undefined?tableContent.shift():tableContent} />
            </CardContent>
        </Card>
    );
}

export default BankingInfo;
