import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import CTable from "../../../../components/CTable";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { createMuiTheme } from "@material-ui/core/styles";
import ModalDelete from "./ModalDelete";
import checkPermis from "../../../../components/CheckPermision";
import { useSelector } from "react-redux";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
const theme1 = createMuiTheme({
  typography: {
    body1: {
      fontFamily: "'Open Sans', sans-serif",
      fontWeight: 400,
      fontSize: 16,
      color: "red",
    },
  },
});
const useStyles = makeStyles((theme, theme1) => ({
  label: {
    display: "block",
  },
  input: {
    width: 1000,
  },
  listbox: {
    width: 1000,
    margin: 0,
    padding: 0,
    zIndex: 1,
    position: "absolute",
    listStyle: "none",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    maxHeight: 200,
    border: "1px solid rgba(0,0,0,.25)",
    '& li[data-focus="true"]': {
      backgroundColor: "#4a8df6",
      color: "white",
      cursor: "pointer",
    },
    "& li:active": {
      backgroundColor: "#2977f5",
      color: "white",
    },
  },
  theme1: {},
  //     &.MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary {
  //   display : "none"
  // },
  adornedStart: {
    // paddingRight:0,
    display: "none",
  },
  buttonStyle: {
    disabled: true,
  },
  formControl: {
    width: "100%",
    "& label span": {
      color: "red",
    },
  },
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  // textField: {
  //     width: 200,
  //     "&:hover .MuiInputLabel-root": {
  //         color: theme.palette.text.primary
  //     },
  //     "& .Mui-focused.MuiInputLabel-root": {
  //         color: theme.palette.primary.main
  //     }
  // },
  as: {
    "&  .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
  },
  div: {
    // "&:hover .MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary": {
    //     color: theme.palette.text.primary
    // },
    // "&.MuiTypography-root MuiTypography-body1 MuiTypography-colorTextSecondary": {
    "&.MuiInputAdornment-root MuiInputAdornment-positionStart": {
      // display : "none"
    },
  },
}));
const helperTextStyles = makeStyles((theme) => ({
  root: {
    margin: 4,
    color: "red",
  },
  error: {
    "&.MuiFormHelperText-root.Mui-error": {
      color: theme.palette.common.white,
    },
  },
}));
const AddressInfoForm = ({
  addressToEdit,
  setFormData,
  formData,
  data,
  tableContent,
  setTableContent,
  currentData,
  setCurrentData,
  activeStep,
  countryGeoId,
  setdisplay1,
  partyIdOrg,
  setStyle,
  style,
  CmtOrgPostalAddress,
  idDelete,
  open,
  handleClose,
  enableDisableCreate,
  enablecancel,
  cancelUpdate,
  addRow,
  updateRow,
  cancelAdd,
}) => {
  const datas = useSelector(({ fadak }) => fadak);
  const classes = useStyles();
  const helperTestClasses = helperTextStyles();

  const handleChangeAutoComplete = (newValue, field, tableName, filedName) => {
    if (newValue !== null) {
      formData[tableName] = {
        ...formData[tableName],
        [filedName]: newValue[field],
      };
      const newFormdata = Object.assign({}, formData);
      setFormData(newFormdata);
      return null;
    }

    formData[tableName] = { ...formData[tableName], [filedName]: "" };
    const newFormdata = Object.assign({}, formData);
    setFormData(newFormdata);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <CardHeader title="آدرس" />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Autocomplete
              style={{ marginTop: -16 }}
              id="contactMechPurposeId"
              name="contactMechPurposeId"
              options={data.postalAddress}
              getOptionLabel={(option) => option.description || ""}
              onChange={(event, newValue) => {
                handleChangeAutoComplete(
                  newValue,
                  "contactMechPurposeId",
                  "postalAddress",
                  "contactMechPurposeId"
                );
              }}
              defaultValue={() => {
                let current = null;
                if (
                  addressToEdit !== -1 &&
                  currentData &&
                  currentData.postalList[addressToEdit]
                ) {
                  data.postalAddress.map((item, index) => {
                    if (
                      item.description ===
                      currentData.postalList[addressToEdit].contactMechPurposeId
                    ) {
                      current = item;
                      return null;
                    }
                  });
                }

                return current;
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    required
                    {...params}
                    className={
                      style.contactMechPurposeId
                        ? classes.as
                        : classes.formControl
                    }
                    helperText={
                      style.contactMechPurposeId
                        ? "پر کردن این فیلد الزامی است"
                        : ""
                    }
                    FormHelperTextProps={{ classes: helperTestClasses }}
                    variant="outlined"
                    label="نوع آدرس"
                    margin="normal"
                    fullWidth
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={12} md={4} style={{ marginTop: -16 }}>
            <Autocomplete
              id="countryGeoId"
              name="countryGeoId"
              options={data.data.geos.GEOT_COUNTRY}
              getOptionLabel={(option) => option.geoName || ""}
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["countryGeoId"]: newValue.geoId,
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                  return null;
                }
                formData.postalAddress = {
                  ...formData.postalAddress,
                  ["countryGeoId"]: "",
                };
                const newFormdata = Object.assign({}, formData);
                setFormData(newFormdata);
              }}
              defaultValue={() => {
                let current = null;

                if (
                  addressToEdit !== -1 &&
                  typeof currentData.postalList[addressToEdit] != "undefined"
                ) {
                  data.data.geos.GEOT_COUNTRY.map((item, index) => {
                    if (
                      item.geoId ===
                      currentData.postalList[addressToEdit].countryGeoId
                    ) {
                      current = item;
                    }
                  });
                }
                if (countryGeoId === false) {
                  data.data.geos.GEOT_COUNTRY.map((item, index) => {
                    if (item.geoId === "IRN") {
                      current = item;
                    }
                  });
                }

                return current;
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    required
                    className={
                      style.countryGeoId ? classes.as : classes.formControl
                    }
                    helperText={
                      style.countryGeoId ? "پر کردن این فیلد الزامی است" : ""
                    }
                    FormHelperTextProps={{ classes: helperTestClasses }}
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
              id="stateProvinceGeoId"
              name="countryGeoId"
              options={data.data.geos.GEOT_PROVINCE}
              getOptionLabel={(option) => option.geoName || ""}
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["stateProvinceGeoId"]: newValue.geoId,
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                  return null;
                }
                formData.postalAddress = {
                  ...formData.postalAddress,
                  ["stateProvinceGeoId"]: "",
                };
                const newFormdata = Object.assign({}, formData);
                setFormData(newFormdata);
              }}
              defaultValue={() => {
                let current = null;

                if (
                  addressToEdit !== -1 &&
                  typeof currentData.postalList[addressToEdit] != "undefined"
                ) {
                  data.data.geos.GEOT_PROVINCE.map((item, index) => {
                    if (
                      item.geoId ===
                      currentData.postalList[addressToEdit].stateProvinceGeoId
                    ) {
                      current = item;
                    }
                  });
                }
                return current;
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    required
                    {...params}
                    className={
                      style.stateProvinceGeoId
                        ? classes.as
                        : classes.formControl
                    }
                    helperText={
                      style.stateProvinceGeoId
                        ? "پر کردن این فیلد الزامی است"
                        : ""
                    }
                    FormHelperTextProps={{ classes: helperTestClasses }}
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
              id="countyGeoId"
              name="countyGeoId"
              options={data.data.geos.GEOT_COUNTY}
              getOptionLabel={(option) => option.geoName || ""}
              onChange={(event, newValue) => {
                handleChangeAutoComplete(
                  newValue,
                  "geoId",
                  "postalAddress",
                  "countyGeoId"
                );
              }}
              defaultValue={() => {
                let current = null;

                if (
                  addressToEdit !== -1 &&
                  typeof currentData.postalList[addressToEdit] != "undefined"
                ) {
                  data.data.geos.GEOT_COUNTY.map((item, index) => {
                    if (
                      item.geoId ===
                      currentData.postalList[addressToEdit].countyGeoId
                    ) {
                      current = item;
                    }
                  });
                }

                return current;
              }}
              renderInput={(params) => {
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
            <TextField
              fullWidth
              variant="outlined"
              id="district"
              name="district"
              label="محله"
              onChange={(e) => {
                if (e.target.value === "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["district"]: "",
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                } else if (e.target.value !== "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["district"]: e.target.value,
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                }
              }}
              defaultValue={
                addressToEdit !== -1 &&
                currentData.postalList[addressToEdit] !== undefined &&
                currentData.postalList[addressToEdit].district !== undefined
                  ? currentData.postalList[addressToEdit].district
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              id="street"
              name="street"
              label="خیابان"
              required
              className={style.street ? classes.as : classes.formControl}
              helperText={style.street ? "پر کردن این فیلد الزامی است" : ""}
              FormHelperTextProps={{ classes: helperTestClasses }}
              onChange={(e) => {
                if (e.target.value === "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["street"]: "",
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                } else if (e.target.value !== "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["street"]: e.target.value,
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                }
              }}
              defaultValue={
                addressToEdit !== -1 &&
                currentData.postalList[addressToEdit] !== undefined &&
                currentData.postalList[addressToEdit].street !== undefined
                  ? currentData.postalList[addressToEdit].street
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              id="alley"
              name="alley"
              label="کوچه"
              defaultValue={
                addressToEdit !== -1 &&
                currentData.postalList[addressToEdit] !== undefined &&
                currentData.postalList[addressToEdit].alley !== undefined
                  ? currentData.postalList[addressToEdit].alley
                  : ""
              }
              onChange={(e) => {
                if (e.target.value === "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["alley"]: "",
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                } else if (e.target.value !== "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["alley"]: e.target.value,
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              id="plate"
              name="plate"
              label="پلاک"
              required
              className={style.plate ? classes.as : classes.formControl}
              helperText={style.plate ? "پر کردن این فیلد الزامی است" : ""}
              FormHelperTextProps={{ classes: helperTestClasses }}
              defaultValue={
                addressToEdit !== -1 &&
                currentData.postalList[addressToEdit] !== undefined &&
                currentData.postalList[addressToEdit].plate !== undefined
                  ? currentData.postalList[addressToEdit].plate
                  : ""
              }
              onChange={(e) => {
                if (e.target.value === "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["plate"]: "",
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                } else if (e.target.value !== "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["plate"]: e.target.value,
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                }
                //                                 // addFormData("","postalAddress")
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              id="floor"
              name="floor"
              label="طبقه"
              defaultValue={
                addressToEdit !== -1 &&
                currentData.postalList[addressToEdit] !== undefined &&
                currentData.postalList[addressToEdit].floor !== undefined
                  ? currentData.postalList[addressToEdit].floor
                  : ""
              }
              onChange={(e) => {
                if (e.target.value === "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["floor"]: "",
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                } else if (e.target.value !== "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["floor"]: e.target.value,
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                }
                // addFormData("","postalAddress")
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              id="unitNumber"
              name="unitNumber"
              label="واحد"
              defaultValue={
                addressToEdit !== -1 &&
                currentData.postalList[addressToEdit] !== undefined &&
                currentData.postalList[addressToEdit].unitNumber !== undefined
                  ? currentData.postalList[addressToEdit].unitNumber
                  : ""
              }
              onChange={(e) => {
                if (e.target.value === "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["unitNumber"]: "",
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                } else if (e.target.value !== "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["unitNumber"]: e.target.value,
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                }
                // addFormData("","postalAddress")
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {}
            <TextField
              fullWidth
              required
              className={style.postalCode ? classes.as : classes.formControl}
              helperText={style.postalCode ? "پر کردن این فیلد الزامی است" : ""}
              FormHelperTextProps={{ classes: helperTestClasses }}
              variant="outlined"
              id="postalCode"
              name="postalCode"
              label="کدپستی"
              defaultValue={
                addressToEdit !== -1 &&
                currentData.postalList[addressToEdit] !== undefined &&
                currentData.postalList[addressToEdit].postalCode !== undefined
                  ? currentData.postalList[addressToEdit].postalCode
                  : ""
              }
              onChange={(e) => {
                if (e.target.value === "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["postalCode"]: "",
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                } else if (e.target.value !== "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["postalCode"]: e.target.value,
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                }
                if (currentData.postalList[addressToEdit] !== undefined) {
                  if (
                    currentData.postalList[addressToEdit].postalCode !==
                    undefined
                  ) {
                    if (e.target.value === "") {
                    }
                  }
                }

                // addFormData("","postalAddress")
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              // className={missingcheckPostal("contactNumber") ?  classes.as :classes.formControl }
              // helperText={missingcheckPostal("contactNumber")  ? "پر کردن این فیلد الزامی است" : ""}
              // FormHelperTextProps={{ classes: helperTestClasses }}
              variant="outlined"
              id="contactNumber"
              name="contactNumber"
              label="شماره تماس ثابت"
              defaultValue={
                addressToEdit !== -1 &&
                currentData.postalList[addressToEdit] !== undefined &&
                currentData.postalList[addressToEdit].contactNumber !==
                  undefined
                  ? currentData.postalList[addressToEdit].contactNumber
                  : ""
              }
              onChange={(e) => {
                if (e.target.value === "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["contactNumber"]: "",
                  };
                  const newFormdata = Object.assign({}, formData);
                } else if (e.target.value !== "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["contactNumber"]: e.target.value,
                  };
                  const newFormdata = Object.assign({}, formData);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              variant="outlined"
              id="areaCode"
              name="areaCode"
              label="پیش شماره"
              defaultValue={
                addressToEdit !== -1 &&
                currentData.postalList[addressToEdit] !== undefined &&
                currentData.postalList[addressToEdit].areaCode !== undefined
                  ? currentData.postalList[addressToEdit].areaCode
                  : ""
              }
              onChange={(e) => {
                if (e.target.value === "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["areaCode"]: "",
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                } else if (e.target.value !== "") {
                  formData.postalAddress = {
                    ...formData.postalAddress,
                    ["areaCode"]: e.target.value,
                  };
                  const newFormdata = Object.assign({}, formData);
                  setFormData(newFormdata);
                }
              }}
            />
          </Grid>
        </Grid>
        <ModalDelete
          currentData={currentData}
          partyIdOrg={partyIdOrg}
          setCurrentData={setCurrentData}
          open={open}
          id={idDelete}
          handleClose={handleClose}
          setTableContent={setTableContent}
          addressToEdit={addressToEdit}
          setdisplay1={setdisplay1}
        />
        <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
          {!enableDisableCreate ? (
            <Button
              variant="outlined"
              id="add"
              variant="contained"
              color="primary"
              startIcon={<Add />}
              className="mt-5"
              onClick={addRow}
            >
              افزودن
            </Button>
          ) : null}
          {!enableDisableCreate ? (
            <Button
              variant="outlined"
              style={{ marginLeft: "20px" }}
              variant="contained"
              className="mt-5"
              onClick={cancelAdd}
            >
              لغو
            </Button>
          ) : null}
        </Grid>
        <br />
        <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
          {enableDisableCreate ? (
            <Button
              id="modify"
              variant="contained"
              color="red"
              style={{ backgroundColor: "red" }}
              className="mt-5"
              disabled={!enableDisableCreate}
              onClick={() => updateRow()}
            >
              ثبت
            </Button>
          ) : null}
          {enableDisableCreate ? (
            <Button
              id="modify"
              disabled={enablecancel}
              variant="outlined"
              style={{ marginLeft: "20px" }}
              variant="contained"
              className="mt-5"
              onClick={cancelUpdate}
            >
              لغو
            </Button>
          ) : null}
        </Grid>
        {activeStep === false && !CmtOrgPostalAddress && (
          <p
            style={{ color: "red" }}
            id={"IdContact"}
            className={
              typeof formData.postalAddress != "undefined" &&
              typeof formData.postalAddress.contactMechPurposeId !=
                "undefined" &&
              formData.postalAddress.contactMechPurposeId === "PostalHome"
                ? classes.qw
                : classes.qw1
            }
          >
            وارد کردن آدرس محل سکونت الزامی است
          </p>
        )}

        <CTable
          headers={[
            {
              id: "contactMechPurposeId",
              label: "نوع آدرس ",
            },
            {
              id: "address",
              label: "آدرس ",
            },
            {
              id: "contactNumber",
              label: "تلفن ثابت ",
            },
            ...((checkPermis(
              "reports/personnelReport/addressReport/address/delete",
              datas
            ) && [
              {
                id: "delete",
                label: " حذف",
              },
            ]) ||
              []),
            ...((checkPermis(
              "reports/personnelReport/addressReport/address/edit",
              datas
            ) && [
              {
                id: "modify",
                label: " ویرایش",
              },
            ]) ||
              []),
          ]}
          rows={tableContent}
        />
      </CardContent>
    </Card>
  );
};

export default AddressInfoForm;
