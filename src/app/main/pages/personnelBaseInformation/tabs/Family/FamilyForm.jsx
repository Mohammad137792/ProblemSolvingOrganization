import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";
import { Add, Image } from "@material-ui/icons";
import DatePicker from "../../../../components/DatePicker";
import CTable from "../../../../components/CTable";
import { SERVER_URL } from "../../../../../../configs";
import Checkbox from "@material-ui/core/Checkbox";
import ModalDelete from "../Family/ModalDelete";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import Tooltip from "@material-ui/core/Tooltip";
import ToggleButton from "@material-ui/lab/ToggleButton";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import { eventListeners } from "@popperjs/core";

const useStyles = makeStyles((theme) => ({
  as: {
    "&  .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
  },
  qw: {
    display: "block",
    "&  .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
  },
  qw1: {
    display: "none",
  },
  logo: {
    maxWidth: 160,
  },
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
  adornedStart: {
    display: "none",
  },
  buttonStyle: {
    disabled: true,
  },
  formControl: {
    width: "tableContent.length%",
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

  div: {
    "&.MuiInputAdornment-root MuiInputAdornment-positionStart": {},
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    backgroundImage: "blue",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundColor: "gray",
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    backgroundColor: "#ebf1f5",
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
    },
  },

  spiner: {
    height: "100%",
    width: "100%",
    position: "fixed",
    zIndex: 1,
    top: 0,
    left: 0,
    backgroundColor: "rgb(0,0,0)",
    backgroundColor: "rgba(0,0,0, 0.4)",
    overflow: "hidden",
    transition: " 0.5s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // background-color: rgb(234 231 231);
  },
  divTest: {
    color: "black",
    fontWeight: "bold",
    marginLeft: "20px",
    fontSize: "20px",
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

const FamilyForm = ({
  addFormData,
  setFormData,
  formData,
  data,
  tableContent,
  setTableContent,
  currentData,
  setCurrentData,
  display,
  familyToEdit,
  idDelete,
  open,
  handleClose,
  enableDisableCreate,
  updateRow,
  addRow,
  enablecancel,
  cancelUpdate,
  setNationalCode,
  cancelAdd,
  setupdaterow,
  nationalCodeIdStatus,
  setNationalCodeId,
  setaddrowfirst,
  setaddrowlast,
  setaddrowbirth,
  setaddrow,
  style,
  setStayle,
  setaddrowspouse,
  setDisplay,
  giveNational,
  support,
  chengeIcon,
  suportValue,
  chengeIcon1,
  emergencycallState,
  chengeIconE,
  chengeIconE1,
}) => {
  console.log("oavlkavavkaklvadvadvav", formData);

  const disabledNumberOfKids = () => {
    if (
      formData?.partyIdentification?.Nationalcode !== undefined &&
      disable == true
    ) {
      return true;
    } else if (
      formData?.partyIdentification?.Nationalcode !== undefined &&
      disable == false
    ) {
      return false;
    } else {
      if (nationalCodeIdStatus.defualtValueId !== -1) {
        return true;
      }

      if (familyToEdit !== -1) {
        console.log(
          "Vjaksacavjvavjav",
          currentData.result?.[familyToEdit]?.PartyList[0]?.maritalStatusEnumId
        );
      }
      if (
        familyToEdit !== -1 &&
        !formData?.person?.maritalStatusEnumId &&
        currentData.result?.[familyToEdit]?.PartyList[0]
          ?.maritalStatusEnumId === "MarsSingle"
      ) {
        return true;
      }
      if (formData?.person?.maritalStatusEnumId === "MarsSingle") return true;
      return false;
    }
  };

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
    }
  };
  const [expanded, setExpanded] = React.useState(false);
  const [genderNow, setgenderNow] = React.useState(true);
  const [maritalNow, setmaritalNow] = React.useState(false);
  const [disable, setDisable] = React.useState(false);

  useEffect(() => {
    formData.suportValue = {
      ...formData.suportValue,
      ["suportValue"]: suportValue,
    };
    console.log(formData.suportValue, "rrr");
  }, [suportValue]);
  const handleDateChangeFromDate = (date1) => {
    if (date1 !== null) {
      setaddrowspouse(false);

      setStayle((prevState) => ({
        ...prevState,
        fromDate: false,
      }));
      formData.fromDate = date1.format("Y-MM-DD");
      formData.partyRelationship = {
        ...formData.partyRelationship,
        ["fromDate"]: formData.fromDate,
      };
      const newFormdata = Object.assign({}, formData);
      setFormData(newFormdata);
      return;
    } else if (date1 === null) {
      formData.partyRelationship = {
        ...formData.partyRelationship,
        ["fromDate"]: "",
      };
      const newFormdata = Object.assign({}, formData);
      setFormData(newFormdata);
    }
  };

  const handleDateChangethruDate = (date1) => {
    if (date1 !== null) {
      formData.thruDate = date1.format("Y-MM-DD");
      formData.partyRelationship = {
        ...formData.partyRelationship,
        ["thruDate"]: formData.thruDate,
      };
      const newFormdata = Object.assign({}, formData);
      setFormData(newFormdata);
    } else if (date1 === null) {
      formData.partyRelationship = {
        ...formData.partyRelationship,
        ["thruDate"]: "",
      };
      const newFormdata = Object.assign({}, formData);
      setFormData(newFormdata);
    }
  };

  const handleDateChangDate = (date1) => {
    if (date1 !== null) {
      setaddrowbirth(false);
      setStayle((prevState) => ({
        ...prevState,
        birthDate: false,
      }));
      formData.birthDate = date1.format("Y-MM-DD");
      formData.person = {
        ...formData.person,
        ["birthDate"]: formData.birthDate,
      };
      const newFormdata = Object.assign({}, formData);
      setFormData(newFormdata);
    } else if (date1 === null) {
      setaddrowbirth(true);
      formData.person = { ...formData.person, ["birthDate"]: "" };
      const newFormdata = Object.assign({}, formData);
      setFormData(newFormdata);
    }
  };
  const [state1, setState1] = React.useState({
    Emergencycall: "",
  });
  const handleChange = (name) => (event) => {
    setState1({ ...state1, [name]: event.target.checked });

    if (event.target.checked === true) {
      formData.Emergencycall = event.target.checked;
      formData.person = {
        ...formData.person,
        ["Emergencycall"]: formData.Emergencycall,
      };
      const newFormdata = Object.assign({}, formData);
      setFormData(newFormdata);
    } else if (event.target.checked === false) {
      formData.Emergencycall = event.target.checked;
      formData.person = {
        ...formData.person,
        ["Emergencycall"]: formData.Emergencycall,
      };
      const newFormdata = Object.assign({}, formData);
      setFormData(newFormdata);
    }
  };
  const handleChangeCheckBox = (e) => {
    formData.person = {
      ...formData.person,
      ["Emergencycall"]: e.target.checked,
    };
    const newFormdata = Object.assign({}, formData);
    setFormData(newFormdata);
  };

  const setDefaultValue = (value) => {
    if (value) {
      return value;
    } else {
      return "";
    }
  };

  const genderTypes = [
    { title: "مذکر", content: "Y" },
    { title: "مونث", content: "N" },
  ];

  /**
   * handlerNationalCode for set national code  and set state after 300ms
   */

  const handlerNationalCode = (e) => {
    let nationalId = e.target.value;

    setStayle((prevState) => ({
      ...prevState,
      Nationalcode: true,
      NationalcodeId: true,
    }));

    formData.partyIdentification = {
      ...formData.partyIdentification,
      ["Nationalcode"]: nationalId,
    };
    const newFormdata = Object.assign({}, formData);
    setFormData(newFormdata);

    if (formData?.partyIdentification?.Nationalcode.length === 10) {
      setStayle((prevState) => ({
        ...prevState,
        Nationalcode: false,
        NationalcodeId: false,
      }));
      giveNational().then((res) => {
        if (res?.length) {
          res.map((item, index) => {
            if (item.idValue === formData.partyIdentification.Nationalcode) {
              setNationalCodeId((prevState) => ({
                ...prevState,
                nationalCodeStatus: true,
                defualtValueId: -1,
                nationalCodeId: res.data,
                setNationalCodeId: -1,
              }));
              setNationalCode(res);
            }
          });
          return null;
        }

        setNationalCodeId((prevState) => ({
          ...prevState,
          defualtValueId: -1,
          setNationalCodeId: -1,
        }));
      });
    }
  };

  const handler = (
    options,
    optionsObj,
    frmData,
    frmDataObj,
    currentDataOej,
    idForFind
  ) => {
    let current = null;
    if (
      familyToEdit !== -1 &&
      currentData.result[familyToEdit]?.[currentDataOej]
    ) {
      if (formData[frmData]?.[frmDataObj]) {
        current =
          options?.[optionsObj].find(
            (o) => o[idForFind] == formData[frmData]?.[frmDataObj]
          ) ?? null;
        return current;
      }
      current =
        options?.[optionsObj].find(
          (o) =>
            o.description ==
            currentData.result[familyToEdit]?.[currentDataOej]?.[frmDataObj]
        ) ?? null;
    }
    return current;
  };

  const setMilitaryStatus = () => {
    let value = true;
    // if (!genderNow || nationalCodeIdStatus.defualtValueId !== -1) return true;

    if (
      formData?.partyIdentification?.Nationalcode !== undefined &&
      disable == true
    ) {
      return true;
    } else if (
      formData?.partyIdentification?.Nationalcode !== undefined &&
      disable == false
    ) {
      return false;
    } else {
      if (familyToEdit !== -1) {
        let currentDataCheck =
          formData?.person?.gender ??
          currentData.result[familyToEdit]?.PartyList?.[0]?.gender;
        value =
          currentDataCheck === "N" || currentDataCheck == null ? true : false;
      }
      if (nationalCodeIdStatus.defualtValueId !== -1) {
        value = true;
      }

      if (formData?.person?.gender) {
        let currentDataCheck = formData?.person?.gender;
        value = currentDataCheck === "N" ? true : false;
      }

      return value;
    }
  };
  const handlerMilitaryStatusAutoComp = () => {
    let current = null;
    if (familyToEdit !== -1) {
      data.classifications.Militarystate.map((item, index) => {
        if (
          nationalCodeIdStatus.respondePersonFamliy &&
          nationalCodeIdStatus.respondePersonFamliy.length &&
          item.partyClassificationId ===
            nationalCodeIdStatus.respondePersonFamliy[0].partyClassificationId
        ) {
          current = item;
        }
        if (
          item.partyClassificationId ===
          currentData.result[familyToEdit]?.PartyList[
            currentData.result[familyToEdit].PartyList.length - 1
          ].partyClassificationId
        ) {
          current = item;
        }
      });
    }

    if (formData?.person?.partyClassificationId) {
      current = data.classifications?.Militarystate.find(
        (o) =>
          o.partyClassificationId == formData?.person?.partyClassificationId
      );
    }
    if (formData?.person?.gender && formData.person.gender == "N") {
      current = data.classifications?.Militarystate.find(
        (o) => o.description === "عدم مشمول"
      );
    }
    return current;
  };

  // const chengeIcon=()=>{
  //     setsupport(false)
  // }

  useEffect(() => {
    let Nationalcode = formData?.partyIdentification?.Nationalcode
      ? formData?.partyIdentification?.Nationalcode
      : currentData.result[familyToEdit]?.IdentificationList?.Nationalcode
      ? currentData.result[familyToEdit]?.IdentificationList?.Nationalcode
      : "";
    if (Nationalcode.length === 10) {
      axios
        .get(
          SERVER_URL +
            "/rest/s1/fadak/checkRelationNationalCode?nationalCode=" +
            Nationalcode,
          {
            headers: { api_key: localStorage.getItem("api_key") },
          }
        )
        .then((res) => {
          // console.log(res.data.result, "WWWWR")
          // console.log(res.data.result.length, "WWWWL")
          if (res.data.result.length > 0) setDisable(true);
          else setDisable(false);
        })
        .catch(() => {});
    }
    // console.log(formData?.partyIdentification?.Nationalcode, "WWWWN")
    // console.log(currentData.result[familyToEdit]?.IdentificationList?.Nationalcode, "WWWWG")
  }, [
    formData?.partyIdentification?.Nationalcode,
    currentData.result[familyToEdit]?.IdentificationList?.Nationalcode,
  ]);

  return (
    <>
      <Card>
        <CardContent>
          {display && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    style={{ marginTop: "-16px" }}
                    id="relationshipTypeEnumId"
                    name="relationshipTypeEnumId"
                    options={data.relationShips.PartyRelationshipType}
                    // disabled={formData?.partyIdentification?.Nationalcode ? disable : (familyToEdit !== -1 && currentData?.result?.[familyToEdit]?.relationship?.relationshipTypeEnumId === "همسر") ? true : false}
                    getOptionLabel={(option) => option.description || ""}
                    value={
                      familyToEdit !== -1 &&
                      currentData.result[familyToEdit]?.relationship
                        ? handler(
                            data.relationShips,
                            "PartyRelationshipType",
                            "partyRelationship",
                            "relationshipTypeEnumId",
                            "relationship",
                            "enumId"
                          )
                        : data.relationShips?.PartyRelationshipType.find(
                            (o) =>
                              o.enumId ==
                              formData.partyRelationship?.relationshipTypeEnumId
                          ) ?? null
                    }
                    onChange={(event, newValue) => {
                      if (newValue !== null) {
                        setaddrow(false);
                        setupdaterow(false);

                        if (newValue.enumId === "Spouse") {
                          setaddrowspouse(true);
                          setStayle((prevState) => ({
                            ...prevState,
                            relationshipTypeEnumId: false,
                            fromDate: false,
                          }));
                        } else {
                          setStayle((prevState) => ({
                            ...prevState,
                            relationshipTypeEnumId: false,
                            fromDate: false,
                          }));

                          setaddrowspouse(false);
                        }
                      }
                      handleChangeAutoComplete(
                        newValue,
                        "enumId",
                        "partyRelationship",
                        "relationshipTypeEnumId"
                      );
                      if (newValue === null) {
                        setaddrow(true);
                        setupdaterow(true);
                        setaddrowspouse(false);
                        if (familyToEdit !== -1 && display !== false) {
                          if (
                            typeof currentData.result[familyToEdit]
                              .relationship != "undefined"
                          ) {
                            if (
                              typeof currentData.result[familyToEdit]
                                .relationship.relationshipTypeEnumId !=
                              "undefined"
                            ) {
                              formData.partyRelationship = {
                                ...formData.partyRelationship,
                                ["relationshipTypeEnumId"]: "",
                              };
                              const newFormdata = Object.assign({}, formData);
                              setFormData(newFormdata);
                            }
                          }
                        }
                      }
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          required
                          // value={formData.relationshipTypeEnumId}

                          {...params}
                          FormHelperTextProps={{ classes: helperTestClasses }}
                          className={
                            style.relationshipTypeEnumId
                              ? classes.as
                              : classes.formControl
                          }
                          helperText={
                            style.relationshipTypeEnumId
                              ? "پر کردن این فیلد الزامی است"
                              : ""
                          }
                          variant="outlined"
                          label="نسبت "
                          margin="normal"
                          fullWidth
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DatePicker
                    variant="outlined"
                    id="fromDate"
                    value={
                      formData.partyRelationship?.fromDate &&
                      formData?.partyRelationship?.relationshipTypeEnumId ===
                        "Spouse"
                        ? formData.partyRelationship.fromDate
                        : (familyToEdit != -1 &&
                            !formData?.partyRelationship
                              ?.relationshipTypeEnumId &&
                            currentData.result[familyToEdit]?.relationship
                              ?.fromDate) ||
                          (currentData.result[familyToEdit]?.relationship
                            ?.relationshipTypeEnumId == "همسر" &&
                            formData?.partyRelationship
                              ?.relationshipTypeEnumId === "Spouse")
                        ? currentData.result[familyToEdit].relationship.fromDate
                        : null
                    }
                    disabled={
                      (formData.partyRelationship?.relationshipTypeEnumId &&
                        formData.partyRelationship?.relationshipTypeEnumId !==
                          "Spouse") ||
                      (!formData.partyRelationship?.relationshipTypeEnumId &&
                        familyToEdit != -1 &&
                        currentData.result[familyToEdit]?.relationship
                          ?.relationshipTypeEnumId != "همسر") ||
                      (!formData.partyRelationship?.relationshipTypeEnumId &&
                        familyToEdit == -1)
                    }
                    setValue={handleDateChangeFromDate}
                    format={"jYYYY/jMMMM/jDD"}
                    required
                    FormHelperTextProps={{ classes: helperTestClasses }}
                    className={
                      style.fromDate ? classes.as : classes.formControl
                    }
                    helperText={
                      style.fromDate ? "پر کردن این فیلد الزامی است" : ""
                    }
                    errorState={style.fromDate}
                    // disabled={formData?.partyIdentification?.Nationalcode ? disable : (formData.partyRelationship &&
                    //     formData.partyRelationship.relationshipTypeEnumId === "Spouse") ||
                    //     (familyToEdit !== -1 && currentData.result[familyToEdit]
                    //         && typeof currentData.result[familyToEdit].relationship != "undefined"
                    //         && currentData.result[familyToEdit].relationship.relationshipTypeEnumId === "همسر") ? (false) : true}
                    label="تاریخ  ازدواج "
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DatePicker
                    variant="outlined"
                    id="thruDate"
                    value={
                      formData.partyRelationship?.thruDate &&
                      formData?.partyRelationship?.relationshipTypeEnumId ===
                        "Spouse"
                        ? formData.partyRelationship.thruDate
                        : (familyToEdit != -1 &&
                            !formData?.partyRelationship
                              ?.relationshipTypeEnumId &&
                            currentData.result[familyToEdit]?.relationship
                              ?.thruDate) ||
                          (currentData.result[familyToEdit]?.relationship
                            ?.relationshipTypeEnumId == "همسر" &&
                            formData?.partyRelationship
                              ?.relationshipTypeEnumId === "Spouse")
                        ? currentData.result[familyToEdit].relationship.thruDate
                        : null
                    }
                    disabled={
                      (formData.partyRelationship?.relationshipTypeEnumId &&
                        formData.partyRelationship?.relationshipTypeEnumId !==
                          "Spouse") ||
                      (!formData.partyRelationship?.relationshipTypeEnumId &&
                        familyToEdit != -1 &&
                        currentData.result[familyToEdit]?.relationship
                          ?.relationshipTypeEnumId != "همسر") ||
                      (!formData.partyRelationship?.relationshipTypeEnumId &&
                        familyToEdit == -1)
                    }
                    // disabled={formData?.partyIdentification?.Nationalcode ? disable : (
                    //     formData?.partyRelationship?.relationshipTypeEnumId === "Spouse") ||
                    //     (familyToEdit !== -1 && currentData?.result?.[familyToEdit]?.relationship && currentData.result[familyToEdit].relationship?.relationshipTypeEnumId === "همسر") ? (false) : true}

                    // disabled={(
                    //     formData?.partyRelationship?.relationshipTypeEnumId === "Spouse") ||
                    //     (familyToEdit !== -1 && currentData?.result?.[familyToEdit]?.relationship && currentData.result[familyToEdit].relationship?.relationshipTypeEnumId === "همسر") ? (false) : true}
                    setValue={handleDateChangethruDate}
                    format={"jYYYY/jMMMM/jDD"}
                    label="تاریخ طلاق  "
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    // disabled={nationalCodeIdStatus.setNationalCodeId !== -1 ? true : false}
                    // disabled={formData?.partyIdentification?.Nationalcode ? disable : nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    variant="outlined"
                    id="Nationalcode"
                    name="Nationalcode"
                    label=" کد ملی"
                    FormHelperTextProps={{ classes: helperTestClasses }}
                    type="number"
                    className={
                      style.Nationalcode ? classes.as : classes.formControl
                    }
                    helperText={
                      style.Nationalcode
                        ? "پر کردن این فیلد الزامی است"
                        : style.NationalcodeId
                        ? " کد ملی درست نمی باشد"
                        : ""
                    }
                    value={
                      formData?.partyIdentification?.Nationalcode ??
                      currentData.result[familyToEdit]?.IdentificationList
                        ?.Nationalcode ??
                      ""
                    }
                    onChange={(e) => handlerNationalCode(e)}
                    // Nationalcode

                    // value={setDefaultValueTxtFileds}
                    // value={formData?.partyIdentification?.Nationalcode}
                    // setDefaultValue((nationalCodeIdStatus.Nationalcode && nationalCodeIdStatus.Nationalcode.length) ? nationalCodeIdStatus.Nationalcode[0].idValue : '')
                    // defaultValue={
                    //     (nationalCodeIdStatus.defualtValueId !== -1 && nationalCodeIdStatus.Nationalcode) ?
                    //         setDefaultValue((nationalCodeIdStatus.Nationalcode && nationalCodeIdStatus.Nationalcode.length) ? nationalCodeIdStatus.Nationalcode[0].idValue : '')
                    //         : familyToEdit !== -1
                    //             && typeof currentData.result[familyToEdit] != 'undefined' && currentData.result[familyToEdit].IdentificationList ?
                    //             setDefaultValue(currentData.result[familyToEdit].IdentificationList.Nationalcode) :
                    //             ''
                    // }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    // disabled={nationalCodeIdStatus && nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    variant="outlined"
                    id="idNumber"
                    name="idNumber"
                    label="شماره شناسنامه"
                    // value={formData.idNumber}
                    onChange={addFormData("", "partyIdentification")}
                    defaultValue={
                      nationalCodeIdStatus.defualtValueId != -1 &&
                      nationalCodeIdStatus?.idNumber?.[0]
                        ? setDefaultValue(
                            nationalCodeIdStatus?.idNumber?.length
                              ? nationalCodeIdStatus.idNumber[0].idValue
                              : "null"
                          )
                        : familyToEdit !== -1 &&
                          typeof currentData.result[familyToEdit] !=
                            "undefined" &&
                          currentData.result[familyToEdit].IdentificationList
                        ? setDefaultValue(
                            currentData.result[familyToEdit].IdentificationList
                              .idNumber
                          )
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="serialnumber"
                    name="serialnumber"
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    label="سری شناسنامه"
                    // value={formData.serialnumber}
                    onChange={addFormData("", "partyIdentification")}
                    defaultValue={
                      nationalCodeIdStatus.defualtValueId != -1 &&
                      nationalCodeIdStatus?.serialnumber?.[0]?.idValue
                        ? setDefaultValue(
                            nationalCodeIdStatus.serialnumber &&
                              nationalCodeIdStatus.serialnumber.length
                              ? nationalCodeIdStatus.serialnumber[0].idValue
                              : ""
                          )
                        : familyToEdit !== -1 &&
                          typeof currentData.result[familyToEdit] !=
                            "undefined" &&
                          currentData.result[familyToEdit].IdentificationList
                        ? setDefaultValue(
                            currentData.result[familyToEdit].IdentificationList
                              .serialnumber
                          )
                        : ""
                    }
                  />
                </Grid>
              </Grid>

              <hr style={{ marginTop: "10px" }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    style={{ marginTop: -16 }}
                    id="personalTitle"
                    name="personalTitle"
                    options={data.enums.PersonalTitleType}
                    getOptionLabel={(option) => option.description || ""}
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    onChange={(event, newValue) => {
                      handleChangeAutoComplete(
                        newValue,
                        "enumId",
                        "person",
                        "personalTitle"
                      );
                      if (newValue === null) {
                        if (familyToEdit !== -1 && display !== false) {
                          if (
                            typeof currentData.result[familyToEdit].PartyList !=
                            "undefined"
                          ) {
                            if (
                              typeof currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].personalTitle != "undefined"
                            ) {
                              formData.person = {
                                ...formData.person,
                                ["personalTitle"]: "",
                              };
                              const newFormdata = Object.assign({}, formData);
                              setFormData(newFormdata);
                            }
                          }
                        }
                      }
                    }}
                    defaultValue={() => {
                      if (nationalCodeIdStatus.defualtValueId !== -1) {
                        let current = null;
                        data.enums.PersonalTitleType.map((item, index) => {
                          if (
                            nationalCodeIdStatus.defualtValueId !== -1 &&
                            nationalCodeIdStatus.respondePersonFamliy &&
                            nationalCodeIdStatus.respondePersonFamliy.length &&
                            item.enumId ===
                              nationalCodeIdStatus.respondePersonFamliy[0]
                                .personalTitle
                          ) {
                            current = item;
                          }
                        });
                        return current;
                      }
                      if (familyToEdit !== -1) {
                        let current = null;
                        data.enums.PersonalTitleType.map((item, index) => {
                          if (
                            familyToEdit !== -1 &&
                            item.enumId ===
                              currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].personalTitle
                          ) {
                            current = item;
                          }
                        });
                        return current;
                      }
                    }}
                    renderInput={(params) => {
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
                  <Autocomplete
                    style={{ marginTop: -16 }}
                    id="gender"
                    name="gender"
                    options={genderTypes}
                    getOptionLabel={(option) => option.title || ""}
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    onChange={(event, newValue) => {
                      if (newValue !== null) {
                        if (newValue.content === "N") {
                          setgenderNow(false);
                        } else if (newValue.content === "Y") {
                          setgenderNow(true);
                        }
                        formData.person = {
                          ...formData.person,
                          ["gender"]: newValue.content,
                        };
                        const newFormdata = Object.assign({}, formData);
                        setFormData(newFormdata);
                      }
                      if (newValue === null) {
                        if (familyToEdit !== -1 && display !== false) {
                          if (
                            typeof currentData.result[familyToEdit].PartyList !=
                            "undefined"
                          ) {
                            if (
                              typeof currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].gender != "undefined"
                            ) {
                              formData.person = {
                                ...formData.person,
                                ["gender"]: "",
                              };
                              const newFormdata = Object.assign({}, formData);
                              setFormData(newFormdata);
                            }
                          }
                        }
                      }
                    }}
                    defaultValue={() => {
                      if (nationalCodeIdStatus.defualtValueId !== -1) {
                        let current = null;
                        genderTypes.map((item, index) => {
                          if (
                            nationalCodeIdStatus.defualtValueId !== -1 &&
                            nationalCodeIdStatus.respondePersonFamliy &&
                            nationalCodeIdStatus.respondePersonFamliy.length &&
                            item.content ===
                              nationalCodeIdStatus.respondePersonFamliy[0]
                                .gender
                          ) {
                            current = item;
                          }
                        });
                        return current;
                      }
                      if (familyToEdit !== -1) {
                        let current = null;

                        genderTypes.map((item, index) => {
                          if (
                            familyToEdit !== -1 &&
                            item.content ===
                              currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].gender
                          ) {
                            current = item;
                          }
                        });
                        return current;
                      }
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          // value={formData.gender}
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
                  <Autocomplete
                    style={{ marginTop: -16 }}
                    id="employmentStatusEnumId"
                    name="employmentStatusEnumId"
                    options={data.enums.EmploymentStatus}
                    getOptionLabel={(option) => option.description || ""}
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    onChange={(event, newValue) => {
                      handleChangeAutoComplete(
                        newValue,
                        "enumId",
                        "person",
                        "employmentStatusEnumId"
                      );
                      if (newValue === null) {
                        if (familyToEdit !== -1 && display !== false) {
                          if (
                            typeof currentData.result[familyToEdit].PartyList !=
                            "undefined"
                          ) {
                            if (
                              typeof currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].employmentStatusEnumId != "undefined"
                            ) {
                              formData.person = {
                                ...formData.person,
                                ["employmentStatusEnumId"]: "",
                              };
                              const newFormdata = Object.assign({}, formData);
                              setFormData(newFormdata);
                            }
                          }
                        }
                      }
                    }}
                    defaultValue={() => {
                      if (nationalCodeIdStatus.defualtValueId !== -1) {
                        let current = null;
                        data.enums.EmploymentStatus.map((item, index) => {
                          if (
                            nationalCodeIdStatus.defualtValueId !== -1 &&
                            nationalCodeIdStatus.respondePersonFamliy &&
                            nationalCodeIdStatus.respondePersonFamliy.length &&
                            item.enumId ===
                              nationalCodeIdStatus.respondePersonFamliy[0]
                                .employmentStatusEnumId
                          ) {
                            current = item;
                          }
                        });

                        return current;
                      }

                      if (familyToEdit !== -1) {
                        let current = null;
                        data.enums.EmploymentStatus.map((item, index) => {
                          if (
                            familyToEdit !== -1 &&
                            item.enumId ===
                              currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].employmentStatusEnumId
                          ) {
                            current = item;
                          }
                        });
                        return current;
                      }
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          // value={formData.employmentStatusEnumId}
                          {...params}
                          variant="outlined"
                          label="وضعیت اشتغال"
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
                    required
                    variant="outlined"
                    id="firstName"
                    name="firstName"
                    label=" نام"
                    value={formData.firstName}
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setaddrowfirst(true);
                        formData.person = {
                          ...formData.person,
                          ["firstName"]: "",
                        };
                        const newFormdata = Object.assign({}, formData);
                        setFormData(newFormdata);
                      } else if (e.target.value !== "") {
                        setaddrowfirst(false);
                        setStayle((prevState) => ({
                          ...prevState,
                          firstName: false,
                        }));
                        formData.person = {
                          ...formData.person,
                          ["firstName"]: e.target.value,
                        };
                        const newFormdata = Object.assign({}, formData);
                        setFormData(newFormdata);
                      }
                    }}
                    // onChange={addFormData("","person")}
                    FormHelperTextProps={{ classes: helperTestClasses }}
                    className={
                      style.firstName ? classes.as : classes.formControl
                    }
                    helperText={
                      style.firstName ? "پر کردن این فیلد الزامی است" : ""
                    }
                    defaultValue={
                      nationalCodeIdStatus.defualtValueId != -1 &&
                      nationalCodeIdStatus?.respondePersonFamliy?.[0]?.firstName
                        ? setDefaultValue(
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .firstName
                          )
                        : familyToEdit !== -1
                        ? setDefaultValue(
                            currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ].firstName
                          )
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    id="lastName"
                    name="lastName"
                    label=" نام خانوادگی"
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setaddrowlast(true);
                        formData.person = {
                          ...formData.person,
                          ["lastName"]: "",
                        };
                        const newFormdata = Object.assign({}, formData);
                        setFormData(newFormdata);
                      } else if (e.target.value !== "") {
                        setaddrowlast(false);
                        setStayle((prevState) => ({
                          ...prevState,
                          lastName: false,
                        }));
                        formData.person = {
                          ...formData.person,
                          ["lastName"]: e.target.value,
                        };
                        const newFormdata = Object.assign({}, formData);
                        setFormData(newFormdata);
                      }
                    }}
                    // onChange={addFormData("","person")}
                    FormHelperTextProps={{ classes: helperTestClasses }}
                    className={
                      style.lastName ? classes.as : classes.formControl
                    }
                    helperText={
                      style.lastName ? "پر کردن این فیلد الزامی است" : ""
                    }
                    value={formData.lastName}
                    defaultValue={
                      nationalCodeIdStatus.defualtValueId != -1 &&
                      nationalCodeIdStatus?.respondePersonFamliy?.[0]?.lastName
                        ? setDefaultValue(
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .lastName
                          )
                        : familyToEdit !== -1
                        ? setDefaultValue(
                            currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ].lastName
                          )
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="suffix"
                    name="suffix"
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    label=" پسوند"
                    value={formData.suffix}
                    onChange={addFormData("", "person")}
                    defaultValue={
                      nationalCodeIdStatus.defualtValueId != -1 &&
                      nationalCodeIdStatus?.respondePersonFamliy?.[0]?.suffix
                        ? setDefaultValue(
                            nationalCodeIdStatus.respondePersonFamliy[0].suffix
                          )
                        : familyToEdit !== -1
                        ? setDefaultValue(
                            currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ].suffix
                          )
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  {console.log(disable, "hhhhhhh")}
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="FatherName"
                    name="FatherName"
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    label="نام پدر"
                    value={formData.FatherName}
                    onChange={addFormData("", "person")}
                    defaultValue={
                      nationalCodeIdStatus.defualtValueId != -1 &&
                      nationalCodeIdStatus?.respondePersonFamliy?.[0]
                        ?.FatherName
                        ? setDefaultValue(
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .FatherName
                          )
                        : familyToEdit !== -1
                        ? setDefaultValue(
                            currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ].FatherName
                          )
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="PlaceOfBirthGeoID"
                    name="PlaceOfBirthGeoID"
                    label="محل تولد"
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    value={formData.PlaceOfBirthGeoID}
                    onChange={addFormData("", "person")}
                    defaultValue={
                      nationalCodeIdStatus.defualtValueId != -1 &&
                      nationalCodeIdStatus?.respondePersonFamliy?.[0]
                        ?.PlaceOfBirthGeoID
                        ? setDefaultValue(
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .PlaceOfBirthGeoID
                          )
                        : familyToEdit !== -1
                        ? setDefaultValue(
                            currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ].PlaceOfBirthGeoID
                          )
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DatePicker
                    variant="outlined"
                    id="birthDate"
                    value={
                      nationalCodeIdStatus.defualtValueId != -1 &&
                      nationalCodeIdStatus?.respondePersonFamliy?.[0]?.birthDate
                        ? nationalCodeIdStatus.respondePersonFamliy[0]
                            .birthDate ?? null
                        : formData.birthDate ??
                          (familyToEdit !== -1 &&
                          currentData.result[familyToEdit]
                            ? currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].birthDate
                            : currentData.result[familyToEdit] &&
                              typeof currentData.PartyList != "undefined" &&
                              currentData.PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].birthDate !== ""
                            ? currentData.PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].birthDate
                            : null)
                    }
                    FormHelperTextProps={{ classes: helperTestClasses }}
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    className={
                      style.birthDate ? classes.as : classes.formControl
                    }
                    helperText={
                      style.birthDate ? "پر کردن این فیلد الزامی است" : ""
                    }
                    errorState={style.birthDate}
                    required={true}
                    setValue={handleDateChangDate}
                    format={"jYYYY/jMMMM/jDD"}
                    label="تاریخ تولد "
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4} style={{ marginTop: "-16px" }}>
                  <Autocomplete
                    id="CountryGeoId"
                    name="CountryGeoId"
                    options={data.geos.GEOT_COUNTRY}
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    getOptionLabel={(option) => option.geoName || ""}
                    onChange={(event, newValue) => {
                      handleChangeAutoComplete(
                        newValue,
                        "geoId",
                        "person",
                        "CountryGeoId"
                      );
                      if (newValue === null) {
                        if (familyToEdit !== -1 && display !== false) {
                          if (
                            typeof currentData.result[familyToEdit].PartyList !=
                            "undefined"
                          ) {
                            if (
                              typeof currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].CountryGeoId != "undefined"
                            ) {
                              formData.person = {
                                ...formData.person,
                                ["CountryGeoId"]: "",
                              };
                              const newFormdata = Object.assign({}, formData);
                              setFormData(newFormdata);
                            }
                          }
                        }
                      }
                    }}
                    defaultValue={() => {
                      let current = {};
                      let IRN = {};

                      data.geos.GEOT_COUNTRY.map((geo, index) => {
                        if (geo.geoId === "IRN") {
                          IRN = geo;
                        }

                        if (
                          nationalCodeIdStatus.defualtValueId !== -1 &&
                          nationalCodeIdStatus.respondePersonFamliy &&
                          nationalCodeIdStatus.respondePersonFamliy.length &&
                          geo.geoId ===
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .CountryGeoId
                        ) {
                          current = geo;
                        }

                        if (
                          familyToEdit !== -1 &&
                          geo.geoId ===
                            currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ].CountryGeoId
                        ) {
                          current = geo;
                        }
                      });
                      return Object.keys(current).length === 0 ? IRN : current;
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          // value={formData.CountryGeoId}
                          {...params}
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
                  <Autocomplete
                    style={{ marginTop: -16 }}
                    id="stateProvinceGeoId"
                    name="stateProvinceGeoId"
                    options={data.geos.GEOT_PROVINCE}
                    getOptionLabel={(option) => option.geoName || ""}
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    onChange={(event, newValue) => {
                      handleChangeAutoComplete(
                        newValue,
                        "geoId",
                        "person",
                        "stateProvinceGeoId"
                      );
                      if (newValue === null) {
                        if (familyToEdit !== -1 && display !== false) {
                          if (
                            typeof currentData.result[familyToEdit].PartyList !=
                            "undefined"
                          ) {
                            if (
                              typeof currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].stateProvinceGeoId != "undefined"
                            ) {
                              formData.person = {
                                ...formData.person,
                                ["stateProvinceGeoId"]: "",
                              };
                              const newFormdata = Object.assign({}, formData);
                              setFormData(newFormdata);
                            }
                          }
                        }
                      }
                    }}
                    defaultValue={() => {
                      let current = null;
                      data.geos.GEOT_PROVINCE.map((item, index) => {
                        if (
                          nationalCodeIdStatus.defualtValueId !== -1 &&
                          nationalCodeIdStatus.respondePersonFamliy &&
                          nationalCodeIdStatus.respondePersonFamliy.length &&
                          item.geoId ===
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .Cityplaceofissue
                        ) {
                          current = item;
                        }
                        if (
                          familyToEdit !== -1 &&
                          // && familyToEdit !== tableContent.length
                          item.geoId ===
                            currentData.result[familyToEdit].PartyList[0]
                              .Cityplaceofissue
                        ) {
                          current = item;
                        }
                      });
                      return current;
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          // value={formData.stateProvinceGeoIdplaceofissue}
                          {...params}
                          variant="outlined"
                          label="استان محل صدور"
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
                    id="Regionplaceofissue"
                    name="Regionplaceofissue"
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    label="بخش محل صدور"
                    value={formData.Regionplaceofissue}
                    onChange={addFormData("", "person")}
                    defaultValue={
                      nationalCodeIdStatus.defualtValueId != -1 &&
                      nationalCodeIdStatus?.respondePersonFamliy?.[0]
                        ?.Regionplaceofissue
                        ? setDefaultValue(
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .Regionplaceofissue
                          )
                        : familyToEdit !== -1
                        ? setDefaultValue(
                            currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ].Regionplaceofissue
                          )
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    style={{ marginTop: -16 }}
                    id="ReligionEnumID"
                    name="ReligionEnumID"
                    options={data.enums.ReligionEnumId || ""}
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    getOptionLabel={(option) => option.description || option}
                    // getOptionSelected={(option, value) => option.enumId === value.enumId}
                    onChange={(event, newValue) => {
                      handleChangeAutoComplete(
                        newValue,
                        "enumId",
                        "person",
                        "ReligionEnumID"
                      );
                      if (newValue === null) {
                        if (familyToEdit !== -1 && display !== false) {
                          if (
                            typeof currentData.result[familyToEdit].PartyList !=
                            "undefined"
                          ) {
                            if (
                              typeof currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].ReligionEnumID != "undefined"
                            ) {
                              formData.person = {
                                ...formData.person,
                                ["ReligionEnumID"]: "",
                              };
                              const newFormdata = Object.assign({}, formData);
                              setFormData(newFormdata);
                            }
                          }
                        }
                      }
                    }}
                    defaultValue={() => {
                      let current = null;
                      data.enums.ReligionEnumId.map((item, index) => {
                        if (
                          nationalCodeIdStatus.defualtValueId !== -1 &&
                          nationalCodeIdStatus.respondePersonFamliy &&
                          nationalCodeIdStatus.respondePersonFamliy.length &&
                          item.enumId ===
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .ReligionEnumID
                        ) {
                          current = item;
                        }

                        if (
                          familyToEdit !== -1 &&
                          item.enumId ===
                            currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ].ReligionEnumID
                        ) {
                          current = item;
                        }
                      });
                      return current;
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          // value={formData.ReligionEnumID}
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
                  <Autocomplete
                    style={{ marginTop: -16 }}
                    id="sectEnumID"
                    name="sectEnumID"
                    options={data.enums.SectEnumId}
                    getOptionLabel={(option) => option.description || ""}
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    onChange={(event, newValue) => {
                      if (newValue !== null) {
                        formData.person = {
                          ...formData.person,
                          ["sectEnumID"]: newValue.enumId,
                        };
                        const newFormdata = Object.assign({}, formData);
                        setFormData(newFormdata);
                      }
                      if (newValue === null) {
                        if (familyToEdit !== -1 && display !== false) {
                          if (
                            typeof currentData.result[familyToEdit].PartyList !=
                            "undefined"
                          ) {
                            if (
                              typeof currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].sectEnumID != "undefined"
                            ) {
                              formData.person = {
                                ...formData.person,
                                ["sectEnumID"]: "",
                              };
                              const newFormdata = Object.assign({}, formData);
                              setFormData(newFormdata);
                            }
                          }
                        }
                      }
                    }}
                    defaultValue={() => {
                      let current = null;
                      data.enums.SectEnumId.map((item, index) => {
                        if (
                          nationalCodeIdStatus.defualtValueId !== -1 &&
                          nationalCodeIdStatus.respondePersonFamliy &&
                          nationalCodeIdStatus.respondePersonFamliy.length &&
                          item.enumId ===
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .sectEnumID
                        ) {
                          current = item;
                        }

                        if (
                          familyToEdit !== -1 &&
                          typeof currentData.result[familyToEdit].PartyList !=
                            "undefined"
                        ) {
                          if (
                            typeof currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ] != "undefined"
                          ) {
                            if (
                              item.enumId ===
                                currentData.result[familyToEdit].PartyList[
                                  currentData.result[familyToEdit].PartyList
                                    .length - 1
                                ].sectEnumID &&
                              display === true
                            ) {
                              current = item;
                            }
                          }
                        }
                      });
                      return current;
                    }}
                    renderInput={(params) => {
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
                  <label htmlFor="contentLocation">پیوست</label>
                  <br />

                  <input
                    type="file"
                    id="contentLocation"
                    name="contentLocation"
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    onChange={(event) => {
                      if (event) {
                        let { id, value, name } = event.target;
                        value = event.target.files[0];

                        formData.partyContent = {
                          ...formData.partyContent,
                          ["contentLocation"]: value,
                        };
                        const newFormdata = Object.assign({}, formData);
                        setFormData(newFormdata);
                        // }
                      }
                    }}
                  />

                  {familyToEdit !== -1 &&
                  currentData.result[familyToEdit]?.Familydetails &&
                  currentData.result[familyToEdit].Familydetails.length !==
                    0 ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={
                        SERVER_URL +
                        "/rest/s1/fadak/getpersonnelfile1?name=" +
                        currentData.result[familyToEdit]?.Familydetails?.[0]
                          .content
                      }
                      target="_blank"
                    >
                      <Image />
                    </Button>
                  ) : null}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    style={{ marginTop: -16 }}
                    id="maritalStatusEnumId"
                    name="maritalStatusEnumId"
                    options={data.enums.MaritalStatus}
                    getOptionLabel={(option) => option.description || ""}
                    // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                    disabled={
                      formData?.partyIdentification?.Nationalcode
                        ? disable
                        : nationalCodeIdStatus.defualtValueId !== -1
                        ? true
                        : false
                    }
                    onChange={(event, newValue) => {
                      if (newValue !== null) {
                        handleChangeAutoComplete(
                          newValue,
                          "enumId",
                          "person",
                          "maritalStatusEnumId"
                        );
                        if (newValue.enumId === "MarsSingle") {
                          setmaritalNow(true);
                        } else if (newValue.enumId !== "MarsSingle") {
                          setmaritalNow(false);
                        }
                      }
                      if (newValue === null) {
                        if (familyToEdit !== -1 && display !== false) {
                          if (
                            typeof currentData.result[familyToEdit].PartyList !=
                            "undefined"
                          ) {
                            if (
                              typeof currentData.result[familyToEdit].PartyList[
                                currentData.result[familyToEdit].PartyList
                                  .length - 1
                              ].maritalStatusEnumId != "undefined"
                            ) {
                              formData.person = {
                                ...formData.person,
                                ["maritalStatusEnumId"]: "",
                              };
                              const newFormdata = Object.assign({}, formData);
                              setFormData(newFormdata);
                            }
                          }
                        }
                      }
                    }}
                    defaultValue={() => {
                      let current = null;
                      data.enums.MaritalStatus.map((item, index) => {
                        if (
                          nationalCodeIdStatus.defualtValueId !== -1 &&
                          nationalCodeIdStatus.respondePersonFamliy &&
                          nationalCodeIdStatus.respondePersonFamliy.length &&
                          item.enumId ===
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .maritalStatusEnumId
                        ) {
                          current = item;
                        }
                        if (
                          familyToEdit !== -1 &&
                          item.enumId ===
                            currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ].maritalStatusEnumId
                        ) {
                          current = item;
                        }
                      });
                      return current;
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          // value={formData.maritalStatusEnumId}
                          {...params}
                          variant="outlined"
                          label="وضعیت تاهل"
                          margin="normal"
                          fullWidth
                        />
                      );
                    }}
                  />
                </Grid>
                {
                  // PartyList
                  console.log("vajvkajvav", formData)
                }
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    disabled={disabledNumberOfKids()}
                    variant="outlined"
                    id="NumberofKids"
                    name="NumberofKids"
                    label="تعداد فرزندان"
                    value={formData.NumberofKids}
                    onChange={addFormData("", "person")}
                    defaultValue={
                      nationalCodeIdStatus.defualtValueId != -1 &&
                      nationalCodeIdStatus?.respondePersonFamliy?.[0]
                        ?.NumberofKids
                        ? setDefaultValue(
                            nationalCodeIdStatus.respondePersonFamliy[0]
                              .NumberofKids
                          )
                        : familyToEdit !== -1
                        ? setDefaultValue(
                            currentData.result[familyToEdit].PartyList[
                              currentData.result[familyToEdit].PartyList
                                .length - 1
                            ].NumberofKids
                          )
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl>
                    <FormControlLabel
                      // control={<Checkbox name="Emergencycall"
                      //     // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                      //     defaultChecked={
                      //         (familyToEdit !== -1
                      //             && (currentData.result[familyToEdit]?.Familydetails[0]?.emergencycall === "Y")) ? true : false

                      //     }
                      //     onChange={handleChange('Emergencycall')}
                      // />}
                      control={
                        emergencycallState ? (
                          <CheckBoxIcon onClick={chengeIconE} />
                        ) : (
                          <CheckBoxOutlineBlankIcon onClick={chengeIconE1} />
                        )
                      }
                      label="در مواقع اضطراری با این فرد تماس گرفته شود؟"
                    />
                  </FormControl>
                  <FormControl>
                    <FormControlLabel
                      // control={<Checkbox name="suport"
                      // value={support}
                      // onChange={e => {
                      //     console.log(e.target.checked,"ggggg");
                      //     if(e.target.checked)
                      //     setSuportvaue("Y")
                      //     else
                      //     setSuportvaue("N")

                      //   }}
                      // />}
                      control={
                        support ? (
                          <CheckBoxIcon onClick={chengeIcon} />
                        ) : (
                          <CheckBoxOutlineBlankIcon onClick={chengeIcon1} />
                        )
                      }
                      label="تحت تکفل"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        style={{ marginTop: -16 }}
                        id="qualificationTypeEnumId"
                        name="qualificationTypeEnumId"
                        options={data.QualificationTypeList}
                        getOptionLabel={(option) => option.description || ""}
                        // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                        disabled={
                          formData?.partyIdentification?.Nationalcode
                            ? disable
                            : nationalCodeIdStatus.defualtValueId !== -1
                            ? true
                            : false
                        }
                        onChange={(event, newValue) => {
                          if (newValue !== null) {
                            formData.PartyQualification = {
                              ...formData.PartyQualification,
                              ["qualificationTypeEnumId"]: newValue.enumId,
                            };
                            const newFormdata = Object.assign({}, formData);
                            setFormData(newFormdata);
                          }
                          if (newValue === null) {
                            if (familyToEdit !== -1 && display !== false) {
                              if (
                                currentData?.result?.[familyToEdit]
                                  ?.PartyQualificationList?.[0]
                                  ?.qualificationTypeEnumId
                              ) {
                                formData.PartyQualification = {
                                  ...formData.PartyQualification,
                                  ["qualificationTypeEnumId"]: "",
                                };
                                const newFormdata = Object.assign({}, formData);
                                setFormData(newFormdata);
                              }
                            }
                          }
                        }}
                        defaultValue={() => {
                          let current = null;
                          data.QualificationTypeList.map((item, index) => {
                            if (
                              nationalCodeIdStatus.defualtValueId !== -1 &&
                              nationalCodeIdStatus.respondePersonFamliy &&
                              nationalCodeIdStatus.respondePersonFamliy
                                .length &&
                              item.enumId ===
                                nationalCodeIdStatus.respondePersonFamliy[0]
                                  .qualificationTypeEnumId
                            ) {
                              current = item;
                            }
                            if (
                              currentData?.result?.[familyToEdit]?.qualifiBySeq
                                ?.qualificationTypeEnumId == item.enumId
                            ) {
                              current = item;
                            }

                            // if (typeof currentData.result[familyToEdit] != "undefined") {
                            //     if (typeof currentData.result[familyToEdit].PartyQualificationList != "undefined") {
                            //         if (typeof currentData.result[familyToEdit].PartyQualificationList[0] != "undefined") {
                            //             if (typeof currentData.result[familyToEdit].PartyQualificationList[0].qualificationTypeEnumId != "undefined") {
                            //                 if (familyToEdit !== -1 && item.enumId === currentData.result[familyToEdit].PartyQualificationList[0].qualificationTypeEnumId) {
                            //                     current = item
                            //                 }
                            //             }
                            //         }
                            //     }
                            // }
                          });
                          return current;
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              // value={formData.qualificationTypeEnumId}
                              {...params}
                              variant="outlined"
                              label="مقطع تحصیلی"
                              margin="normal"
                              fullWidth
                            />
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        style={{ marginTop: -16 }}
                        id="fieldEnumId"
                        name="fieldEnumId"
                        // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                        disabled={
                          formData?.partyIdentification?.Nationalcode
                            ? disable
                            : nationalCodeIdStatus.defualtValueId !== -1
                            ? true
                            : false
                        }
                        options={data.enums.UniversityFields}
                        getOptionLabel={(option) => option.description || ""}
                        onChange={(event, newValue) => {
                          if (newValue !== null) {
                            formData.PartyQualification = {
                              ...formData.PartyQualification,
                              ["fieldEnumId"]: newValue.enumId,
                            };
                            const newFormdata = Object.assign({}, formData);
                            setFormData(newFormdata);
                          }
                          if (newValue === null) {
                            if (familyToEdit !== -1 && display !== false) {
                              if (
                                typeof currentData.result[familyToEdit]
                                  .PartyQualificationList != "undefined"
                              ) {
                                if (
                                  typeof currentData.result[familyToEdit]
                                    .PartyQualificationList[0].fieldEnumId !=
                                  "undefined"
                                ) {
                                  formData.PartyQualification = {
                                    ...formData.PartyQualification,
                                    ["fieldEnumId"]: "",
                                  };
                                  const newFormdata = Object.assign(
                                    {},
                                    formData
                                  );
                                  setFormData(newFormdata);
                                }
                              }
                            }
                          }
                        }}
                        defaultValue={() => {
                          let current = null;
                          data.enums.UniversityFields.map((item, index) => {
                            if (
                              nationalCodeIdStatus.defualtValueId !== -1 &&
                              nationalCodeIdStatus.respondePersonFamliy &&
                              nationalCodeIdStatus.respondePersonFamliy
                                .length &&
                              item.enumId ===
                                nationalCodeIdStatus.respondePersonFamliy[0]
                                  .fieldEnumId
                            ) {
                              current = item;
                            }

                            if (
                              familyToEdit !== -1 &&
                              currentData?.result[familyToEdit]?.qualifiBySeq
                                ?.fieldEnumId
                            ) {
                              if (
                                item.enumId ===
                                currentData.result[familyToEdit].qualifiBySeq
                                  .fieldEnumId
                              ) {
                                current = item;
                              }
                            }

                            // if (typeof currentData.result[familyToEdit] != "undefined") {
                            //     if (typeof currentData.result[familyToEdit].PartyQualificationList != "undefined") {
                            //         if (typeof currentData.result[familyToEdit].PartyQualificationList[0] != "undefined") {
                            //             if (typeof currentData.result[familyToEdit].PartyQualificationList[0].fieldEnumId != "undefined") {
                            //                 if ( item.enumId === currentData.result[familyToEdit].PartyQualificationList[0].fieldEnumId) {
                            //                     current = item
                            //                 }
                            //             }
                            //         }
                            //     }
                            // }
                          });
                          return current;
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              // value={formData.fieldEnumId}
                              {...params}
                              variant="outlined"
                              label="رشته تحصیلی"
                              margin="normal"
                              fullWidth
                            />
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        style={{ marginTop: -16 }}
                        // disabled={(!genderNow || nationalCodeIdStatus.defualtValueId !== -1)
                        //     ? true : setMilitaryStatus()}

                        // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                        disabled={setMilitaryStatus()}
                        id="partyClassificationId"
                        name="partyClassificationId"
                        options={data.classifications.Militarystate}
                        getOptionLabel={(option) => option.description || ""}
                        onChange={(event, newValue) => {
                          handleChangeAutoComplete(
                            newValue,
                            "partyClassificationId",
                            "person",
                            "partyClassificationId"
                          );
                          if (newValue === null) {
                            if (familyToEdit !== -1 && display !== false) {
                              if (
                                typeof currentData.result[familyToEdit]
                                  .PartyList != "undefined"
                              ) {
                                if (
                                  typeof currentData.result[familyToEdit]
                                    .PartyList[
                                    currentData.result[familyToEdit].PartyList
                                      .length - 1
                                  ].partyClassificationId != "undefined"
                                ) {
                                  formData.person = {
                                    ...formData.person,
                                    ["partyClassificationId"]: "",
                                  };
                                  const newFormdata = Object.assign(
                                    {},
                                    formData
                                  );
                                  setFormData(newFormdata);
                                }
                              }
                            }
                          }
                        }}
                        value={handlerMilitaryStatusAutoComp()}
                        // defaultValue={() => {

                        //     let current = null;

                        //     data.classifications.Militarystate.map((item, index) => {
                        //         if (genderNow ) {
                        //             console.log("adokavkldavkavd" , item)
                        //             // current = item
                        //         }

                        //         if (nationalCodeIdStatus.defualtValueId !== -1 && nationalCodeIdStatus.respondePersonFamliy && nationalCodeIdStatus.respondePersonFamliy.length &&
                        //             item.partyClassificationId === nationalCodeIdStatus.respondePersonFamliy[0].partyClassificationId) {
                        //             current = item
                        //         }

                        //         if (familyToEdit !== -1
                        //             && item.partyClassificationId === currentData.result[familyToEdit].PartyList[currentData.result[familyToEdit].PartyList.length - 1].partyClassificationId) {
                        //             current = item
                        //         }

                        //     });
                        //     return current;

                        // }}

                        renderInput={(params) => {
                          return (
                            <TextField
                              // value={formData.partyClassificationId}
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        disabled={
                          formData?.partyIdentification?.Nationalcode
                            ? disable
                            : (formData.person && !genderNow) ||
                              nationalCodeIdStatus.defualtValueId !== -1
                            ? true
                            : setMilitaryStatus()
                        }
                        // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                        variant="outlined"
                        id="MilitaryCode"
                        name="MilitaryCode"
                        label="کد نظام وظیفه"
                        defaultValue={
                          nationalCodeIdStatus.defualtValueId != -1 &&
                          nationalCodeIdStatus?.respondePersonFamliy?.[0]
                            ?.MilitaryCode
                            ? setDefaultValue(
                                nationalCodeIdStatus.respondePersonFamliy[0]
                                  .MilitaryCode
                              )
                            : familyToEdit !== -1
                            ? setDefaultValue(
                                currentData.result[familyToEdit].PartyList[
                                  currentData.result[familyToEdit].PartyList
                                    .length - 1
                                ].MilitaryCode
                              )
                            : ""
                        }
                        value={formData.MilitaryCode}
                        onChange={addFormData("", "person")}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        style={{ marginTop: -16 }}
                        // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                        disabled={
                          formData?.partyIdentification?.Nationalcode
                            ? disable
                            : nationalCodeIdStatus.defualtValueId !== -1
                            ? true
                            : false
                        }
                        id="baseInsuranceTypeEnumId"
                        name="baseInsuranceTypeEnumId"
                        options={data.enums.BaseInsuranceType}
                        getOptionLabel={(option) => option.description || ""}
                        disabled={
                          nationalCodeIdStatus.defualtValueId !== -1
                            ? true
                            : false
                        }
                        onChange={(event, newValue) => {
                          if (newValue !== null) {
                            formData.person = {
                              ...formData.person,
                              ["baseInsuranceTypeEnumId"]: newValue.enumId,
                            };
                            const newFormdata = Object.assign({}, formData);
                            setFormData(newFormdata);
                          }
                          if (newValue === null) {
                            if (familyToEdit !== -1 && display !== false) {
                              if (
                                typeof currentData.result[familyToEdit]
                                  .PartyList != "undefined"
                              ) {
                                if (
                                  typeof currentData.result[familyToEdit]
                                    .PartyList[
                                    currentData.result[familyToEdit].PartyList
                                      .length - 1
                                  ].baseInsuranceTypeEnumId != "undefined"
                                ) {
                                  formData.person = {
                                    ...formData.person,
                                    ["baseInsuranceTypeEnumId"]: "",
                                  };
                                  const newFormdata = Object.assign(
                                    {},
                                    formData
                                  );
                                  setFormData(newFormdata);
                                }
                              }
                            }
                          }
                        }}
                        defaultValue={() => {
                          let current = null;
                          data.enums.BaseInsuranceType.map((item, index) => {
                            if (
                              nationalCodeIdStatus.defualtValueId !== -1 &&
                              nationalCodeIdStatus.respondePersonFamliy &&
                              nationalCodeIdStatus.respondePersonFamliy
                                .length &&
                              item.enumId ===
                                nationalCodeIdStatus.respondePersonFamliy[0]
                                  .baseInsuranceTypeEnumId
                            ) {
                              current = item;
                            }
                            if (
                              familyToEdit !== -1 &&
                              item.enumId ===
                                currentData.result[familyToEdit].PartyList[
                                  currentData.result[familyToEdit].PartyList
                                    .length - 1
                                ].baseInsuranceTypeEnumId
                            ) {
                              current = item;
                            }
                          });
                          return current;
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              // value={formData.baseInsuranceTypeEnumId}
                              {...params}
                              variant="outlined"
                              label="نوع دفترچه بیمه پایه"
                              margin="normal"
                              fullWidth
                            />
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                        disabled={
                          formData?.partyIdentification?.Nationalcode
                            ? disable
                            : nationalCodeIdStatus.defualtValueId !== -1
                            ? true
                            : false
                        }
                        variant="outlined"
                        id="baseInsurancenumber"
                        name="baseInsurancenumber"
                        label="شماره بیمه اصلی  "
                        value={formData.baseInsurancenumber}
                        onChange={addFormData("", "person")}
                        defaultValue={
                          nationalCodeIdStatus.defualtValueId != -1 &&
                          nationalCodeIdStatus?.respondePersonFamliy?.[0]
                            ?.baseInsurancenumber
                            ? setDefaultValue(
                                nationalCodeIdStatus.respondePersonFamliy[0]
                                  .baseInsurancenumber
                              )
                            : familyToEdit !== -1
                            ? setDefaultValue(
                                currentData.result[familyToEdit].PartyList[
                                  currentData.result[familyToEdit].PartyList
                                    .length - 1
                                ].baseInsurancenumber
                              )
                            : ""
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={11}
                        variant="outlined"
                        id="noteText"
                        name="noteText"
                        label="توضیحات"
                        value={formData.noteText}
                        onChange={addFormData("", "partyNote")}
                        defaultValue={
                          familyToEdit !== -1 &&
                          currentData.result[familyToEdit]?.Familydetails
                            ? setDefaultValue(
                                currentData.result[familyToEdit]
                                  .Familydetails[0]?.description
                              )
                            : ""
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Card variant="outlined" className="mt-20">
                <Grid item xs={12} md={12}>
                  <Box p={2}>
                    <Card>
                      <CardHeader
                        title=" آدرس محل سکونت"
                        action={
                          <Tooltip title="نمایش ادرس">
                            <ToggleButton
                              value="check"
                              selected={expanded}
                              onChange={() =>
                                setExpanded((prevState) => !prevState)
                              }
                            >
                              <FilterListRoundedIcon />
                            </ToggleButton>
                          </Tooltip>
                        }
                      />

                      <Collapse in={expanded}>
                        <Box p={2}>
                          <Grid container spacing={2}>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ marginTop: -16 }}
                            >
                              <Autocomplete
                                id="countryGeoId"
                                name="countryGeoId"
                                disabled={
                                  nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                options={data.geos.GEOT_COUNTRY}
                                getOptionLabel={(option) =>
                                  option.geoName || ""
                                }
                                onChange={(event, newValue) => {
                                  handleChangeAutoComplete(
                                    newValue,
                                    "geoId",
                                    "postalAddress",
                                    "countryGeoId"
                                  );
                                  if (newValue === null) {
                                    if (
                                      familyToEdit !== -1 &&
                                      display !== false
                                    ) {
                                      if (
                                        typeof currentData.result[familyToEdit]
                                          .postaltelecomList != "undefined"
                                      ) {
                                        if (
                                          typeof currentData.result[
                                            familyToEdit
                                          ].postaltelecomList[0].countryGeoId !=
                                          "undefined"
                                        ) {
                                          formData.postalAddress = {
                                            ...formData.postalAddress,
                                            ["countryGeoId"]: "",
                                          };
                                          const newFormdata = Object.assign(
                                            {},
                                            formData
                                          );
                                          setFormData(newFormdata);
                                        }
                                      }
                                    }
                                  }
                                }}
                                defaultValue={() => {
                                  let current = null;

                                  data.geos.GEOT_COUNTRY.map((item, index) => {
                                    if (
                                      nationalCodeIdStatus.defualtValueId !==
                                        -1 &&
                                      nationalCodeIdStatus?.postalHomeData
                                        ?.length &&
                                      item.geoId ===
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .countryGeoId
                                    ) {
                                      current = item;
                                    }

                                    if (
                                      familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].countryGeoId !=
                                        "undefined"
                                    ) {
                                      if (
                                        item.geoId ===
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].countryGeoId
                                      ) {
                                        current = item;
                                      }
                                    }
                                  });

                                  return current;
                                }}
                                renderInput={(params) => {
                                  return (
                                    <TextField
                                      // value={formData.countryGeoId}
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
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ marginTop: -16 }}
                            >
                              <Autocomplete
                                id="stateProvinceGeoId1"
                                name="stateProvinceGeoId"
                                options={data.geos.GEOT_PROVINCE}
                                getOptionLabel={(option) =>
                                  option.geoName || ""
                                }
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                onChange={(event, newValue) => {
                                  handleChangeAutoComplete(
                                    newValue,
                                    "geoId",
                                    "postalAddress",
                                    "stateProvinceGeoId"
                                  );
                                  if (newValue === null) {
                                    if (
                                      familyToEdit !== -1 &&
                                      display !== false
                                    ) {
                                      if (
                                        typeof currentData.result[familyToEdit]
                                          .postaltelecomList != "undefined"
                                      ) {
                                        if (
                                          typeof currentData.result[
                                            familyToEdit
                                          ].postaltelecomList[0]
                                            .stateProvinceGeoId != "undefined"
                                        ) {
                                          formData.postalAddress = {
                                            ...formData.postalAddress,
                                            ["stateProvinceGeoId"]: "",
                                          };
                                          const newFormdata = Object.assign(
                                            {},
                                            formData
                                          );
                                          setFormData(newFormdata);
                                        }
                                      }
                                    }
                                  }
                                }}
                                defaultValue={() => {
                                  let current = null;
                                  data.geos.GEOT_PROVINCE.map((item, index) => {
                                    if (
                                      nationalCodeIdStatus.defualtValueId !==
                                        -1 &&
                                      nationalCodeIdStatus?.postalHomeData
                                        ?.length &&
                                      item.geoId ===
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .stateProvinceGeoId
                                    ) {
                                      current = item;
                                    }

                                    if (
                                      familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0]
                                        .stateProvinceGeoId != "undefined"
                                    ) {
                                      if (
                                        item.geoId ===
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0]
                                          .stateProvinceGeoId
                                      ) {
                                        current = item;
                                      }
                                    }
                                  });
                                  return current;
                                }}
                                renderInput={(params) => {
                                  return (
                                    <TextField
                                      // value={formData.stateProvinceGeoId}
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
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ marginTop: -16 }}
                            >
                              <Autocomplete
                                id="countyGeoId"
                                name="countyGeoId"
                                options={data.geos.GEOT_COUNTY}
                                getOptionLabel={(option) =>
                                  option.geoName || ""
                                }
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                onChange={(event, newValue) => {
                                  handleChangeAutoComplete(
                                    newValue,
                                    "geoId",
                                    "postalAddress",
                                    "countyGeoId"
                                  );
                                  if (newValue === null) {
                                    if (
                                      familyToEdit !== -1 &&
                                      display !== false
                                    ) {
                                      if (
                                        typeof currentData.result[familyToEdit]
                                          .postaltelecomList != "undefined"
                                      ) {
                                        if (
                                          typeof currentData.result[
                                            familyToEdit
                                          ].postaltelecomList[0].countyGeoId !=
                                          "undefined"
                                        ) {
                                          formData.postalAddress = {
                                            ...formData.postalAddress,
                                            ["countyGeoId"]: "",
                                          };
                                          const newFormdata = Object.assign(
                                            {},
                                            formData
                                          );
                                          setFormData(newFormdata);
                                        }
                                      }
                                    }
                                  }
                                }}
                                defaultValue={() => {
                                  let current = null;
                                  data.geos.GEOT_COUNTY.map((item, index) => {
                                    if (
                                      nationalCodeIdStatus.defualtValueId !==
                                        -1 &&
                                      nationalCodeIdStatus.postalHomeData
                                        ?.length &&
                                      item.geoId ===
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .countyGeoId
                                    ) {
                                      current = item;
                                    }

                                    if (
                                      familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].countyGeoId !=
                                        "undefined"
                                    ) {
                                      if (
                                        item.geoId ===
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].countyGeoId
                                      ) {
                                        current = item;
                                      }
                                    }
                                  });
                                  return current;
                                }}
                                renderInput={(params) => {
                                  return (
                                    <TextField
                                      // value={formData.countyGeoId}
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
                                value={formData.district}
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                onChange={addFormData("", "postalAddress")}
                                defaultValue={
                                  nationalCodeIdStatus.defualtValueId != -1 &&
                                  nationalCodeIdStatus?.postalHomeData?.[0]
                                    ?.district
                                    ? setDefaultValue(
                                        nationalCodeIdStatus
                                          ?.postalHomeData?.[0].district ?? ""
                                      )
                                    : familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].district !=
                                        "undefined"
                                    ? setDefaultValue(
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].district
                                      )
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
                                value={formData.street}
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                onChange={addFormData("", "postalAddress")}
                                defaultValue={
                                  nationalCodeIdStatus.defualtValueId != -1 &&
                                  nationalCodeIdStatus?.postalHomeData?.[0]
                                    ?.street
                                    ? setDefaultValue(
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .street
                                      )
                                    : familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].street !=
                                        "undefined"
                                    ? setDefaultValue(
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].street
                                      )
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
                                value={formData.alley}
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                onChange={addFormData("", "postalAddress")}
                                defaultValue={
                                  nationalCodeIdStatus.defualtValueId != -1 &&
                                  nationalCodeIdStatus?.postalHomeData?.[0]
                                    ?.alley
                                    ? setDefaultValue(
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .alley
                                      )
                                    : familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].alley !=
                                        "undefined"
                                    ? setDefaultValue(
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].alley
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                id="plate"
                                name="plate"
                                label="پلاک"
                                value={formData.plate}
                                onChange={addFormData("", "postalAddress")}
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                defaultValue={
                                  nationalCodeIdStatus.defualtValueId != -1 &&
                                  nationalCodeIdStatus?.postalHomeData?.[0]
                                    ?.plate
                                    ? setDefaultValue(
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .plate
                                      )
                                    : familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].plate !=
                                        "undefined"
                                    ? setDefaultValue(
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].plate
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                id="floor"
                                name="floor"
                                label="طبقه"
                                value={formData.floor}
                                // defaultValue={currentData.floor}
                                onChange={addFormData("", "postalAddress")}
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                defaultValue={
                                  nationalCodeIdStatus.defualtValueId != -1 &&
                                  nationalCodeIdStatus?.postalHomeData?.[0]
                                    ?.floor
                                    ? setDefaultValue(
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .floor
                                      )
                                    : familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].floor !=
                                        "undefined"
                                    ? setDefaultValue(
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].floor
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                id="unitNumber"
                                name="unitNumber"
                                label="واحد"
                                value={formData.unitNumber}
                                onChange={addFormData("", "postalAddress")}
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                defaultValue={
                                  nationalCodeIdStatus.defualtValueId != -1 &&
                                  nationalCodeIdStatus?.postalHomeData?.[0]
                                    ?.unitNumber
                                    ? setDefaultValue(
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .unitNumber
                                      )
                                    : familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].unitNumber !=
                                        "undefined"
                                    ? setDefaultValue(
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].unitNumber
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                id="postalCode"
                                name="postalCode"
                                label="کدپستی"
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                value={formData.postalCode}
                                onChange={addFormData("", "postalAddress")}
                                defaultValue={
                                  nationalCodeIdStatus.defualtValueId != -1 &&
                                  nationalCodeIdStatus?.postalHomeData?.[0]
                                    ?.postalCode
                                    ? setDefaultValue(
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .postalCode
                                      )
                                    : familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].postalCode !=
                                        "undefined"
                                    ? setDefaultValue(
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].postalCode
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                className={classes.formControl}
                                variant="outlined"
                                id="contactNumber"
                                name="contactNumber"
                                label="شماره تماس ثابت"
                                value={formData.contactNumber}
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                onChange={addFormData("", "postalAddress")}
                                defaultValue={
                                  nationalCodeIdStatus.defualtValueId != -1 &&
                                  nationalCodeIdStatus?.postalHomeData?.[0]
                                    ?.contactNumber
                                    ? setDefaultValue(
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .contactNumber
                                      )
                                    : familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].contactNumber !=
                                        "undefined"
                                    ? setDefaultValue(
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].contactNumber
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                fullWidth
                                className={classes.formControl}
                                variant="outlined"
                                id="areaCode"
                                name="areaCode"
                                label="پیش شماره"
                                // disabled={nationalCodeIdStatus.defualtValueId !== -1 ? true : false}
                                disabled={
                                  formData?.partyIdentification?.Nationalcode
                                    ? disable
                                    : nationalCodeIdStatus.defualtValueId !== -1
                                    ? true
                                    : false
                                }
                                value={formData.areaCode}
                                onChange={addFormData("", "postalAddress")}
                                defaultValue={
                                  nationalCodeIdStatus.defualtValueId != -1 &&
                                  nationalCodeIdStatus?.postalHomeData?.[0]
                                    ?.areaCode
                                    ? setDefaultValue(
                                        nationalCodeIdStatus.postalHomeData[0]
                                          .areaCode
                                      )
                                    : familyToEdit !== -1 &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0] != "undefined" &&
                                      typeof currentData.result[familyToEdit]
                                        .postaltelecomList[0].areaCode !=
                                        "undefined"
                                    ? setDefaultValue(
                                        currentData.result[familyToEdit]
                                          .postaltelecomList[0].areaCode
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </Card>
                  </Box>
                </Grid>
              </Card>

              <ModalDelete
                currentData={currentData}
                setCurrentData={setCurrentData}
                open={open}
                id={idDelete}
                handleClose={handleClose}
                setTableContent={setTableContent}
                familyToEdit={familyToEdit}
                setDisplay={setDisplay}
              />
              <Grid style={{ display: "flex", flexDirection: "row-reverse" }}>
                {!enableDisableCreate ? (
                  <Button
                    variant="outlined"
                    id="add"
                    variant="contained"
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
                    o
                    className="mt-5"
                    style={{ marginLeft: "20px" }}
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
                    className="mt-5"
                    disabled={!enableDisableCreate}
                    style={{ color: "white", backgroundColor: "green" }}
                    onClick={() => updateRow()}
                  >
                    ثبت
                  </Button>
                ) : null}
                {enableDisableCreate ? (
                  <Button
                    id="modify"
                    variant="contained"
                    disabled={enablecancel}
                    className="mt-5"
                    style={{ marginLeft: "20px" }}
                    onClick={cancelUpdate}
                  >
                    لغو
                  </Button>
                ) : null}
              </Grid>
            </>
          )}
          <CTable
            headers={[
              {
                id: "index",
                label: "ردیف",
              },
              {
                id: "relationshipName",
                label: "نسبت",
              },
              {
                id: "familyFullName",
                label: "نام و نام خانوادگی",
              },
              {
                id: "nationalcode",
                label: "کد ملی",
              },
              {
                id: "birthDate",
                label: "تاریخ تولد",
              },
              {
                id: "maritalStatusEnumId",
                label: "وضعیت تاهل",
              },
              {
                id: "employmentStatusEnumId",
                label: "وضعیت  اشتغال",
              },
              {
                id: "delete",
                label: "حذف",
              },
              {
                id: "modify",
                label: "ویرایش",
              },
            ]}
            rows={tableContent}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default FamilyForm;
