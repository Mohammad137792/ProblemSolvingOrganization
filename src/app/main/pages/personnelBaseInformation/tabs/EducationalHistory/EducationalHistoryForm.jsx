import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  TextField,
  useTheme,
} from "@material-ui/core";
import DatePicker from "../../../../components/DatePicker";
import { Add, Image } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import CTable from "../../../../components/CTable";
import { INPUT_TYPES } from "../../../../helpers/setFormDataHelper";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ModalDelete from "./ModalDelete";
import { SERVER_URL } from "../../../../../../configs";

import FormPro from "./../../../../components/formControls/FormPro";
import ActionBox from "./../../../../components/ActionBox";
import axios from "axios";

const helperTextStyles = makeStyles((theme) => ({
  root: {
    margin: 4,
    color: "red",
    borderWidth: "1px",
    "&  .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
    "& label span": {
      color: "red",
    },
  },
  error: {
    "&.MuiFormHelperText-root.Mui-error": {
      color: theme.palette.common.white,
    },
  },
}));
const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "purple",
    },
    width: "100%",
    "& label span": {
      color: "red",
    },
  },
  NonDispaly: {
    display: "none",
  },
  formControl: {
    width: "100%",
    "& label span": {
      color: "red",
    },
  },
  enter: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "green",
    },
  },
});
const defualtValue = { title: "", jobEnumId: "248302" };
const EducationalHistoryForm = (props) => {
  let {
    formValues,
    addFormValue,
    editePartyQualificationHandler,
    data,
    currentData,
    setFormData,
    addPartyQualification,
    setCurrentData,
    table,
    setTable,
    addJobPartQ,
    style,
    partyQualiCancelHandelr,
    openModel,
    handlerCloseModel,
    setOpenModel,
    setDisplay,
    editJobPartyQualificationHandler,
    setStayle,
    styleBorder,
  } = props;

  const helperTestClasses = helperTextStyles();
  const classes = useStyles();

  var QualificationTypeArrya = [];

  const QualificationType = (data) => {
    let value = [];
    data.map((item, index) => {
      if (item.enumId !== "WorkExperience") {
        QualificationTypeArrya.push(item);
      }
      QualificationTypeArrya.sort((a, b) => {
        return b.sequenceNum - a.sequenceNum;
      });
    });
  };
  QualificationType(data.enums.QualificationType);

  const autoCompleteHandlerChange = (newValue, field, tableName, filedName) => {
    if (newValue !== null) {
      setStayle((prevState) => ({
        ...prevState,
        qualificationTypeEnumId: true,
      }));
      formValues[tableName] = {
        ...formValues[tableName],
        [filedName]: newValue[field],
      };
      const newFormdata = Object.assign({}, formValues);
      setFormData(newFormdata);
      return null;
    }
    formValues[tableName] = { ...formValues[tableName], [filedName]: "" };
    const newFormdata = Object.assign({}, formValues);
    setFormData(newFormdata);
  };

  //start to set value for date
  const startDateEducationHandler = (date) => {
    if (date !== null) {
      formValues.educational = {
        ...formValues.educational,
        fromDate: Math.round(new Date(date._d)),
      };
      setStayle((prevState) => ({ ...prevState, fromDateEducational: true }));
      const newFormData = Object.assign({}, formValues);
      setFormData(newFormData);
      return null;
    }
    formValues.educational = {
      ...formValues.educational,
      fromDate: "",
    };
    const newFormData = Object.assign({}, formValues);
    setFormData(newFormData);
  };
  const endDateEducationHandler = (date) => {
    if (date !== null) {
      formValues.educational = {
        ...formValues.educational,
        thruDate: Math.round(new Date(date._d)),
      };
      setStayle((prevState) => ({ ...prevState, thruDateEducational: true }));
      const newFormData = Object.assign({}, formValues);
      setFormData(newFormData);
      return null;
    }
    formValues.educational = {
      ...formValues.educational,
      thruDate: "",
    };
    const newFormData = Object.assign({}, formValues);
    setFormData(newFormData);
  };

  //End
  const [formValuesData, setFormValuesData] = useState(defualtValue);
  const [jobFormValue, setJobFormValue] = useState([]);

  React.useEffect(() => {
    if (formValues[pk]) {
      axios
        .get(
          SERVER_URL +
            "/rest/s1/fadak/entity/Enumeration?enumId=" +
            formValues[pk],
          {
            headers: { api_key: localStorage.getItem("api_key") },
          }
        )
        .then((res) => {
          // setJobTitles([res.data])
          setJobFormValue([res.data.result]);
        })
        .catch(() => {});
    }
  }, []);

  const onChange = (newOption) => {
    setJobFormValue([newOption]);
  };
  const formStructure = [
    { name: "title", label: "عنوان شغل", type: "text", required: true },
    {
      name: "fromDate",
      label: "تاریخ شروع",
      type: "date",
      required: true,
      disabled: currentData.jobQualifaicatioId != -1 ? true : false,
    },
    { name: "thruDate", label: "تاریخ پایان", type: "date", required: true },
    { name: "employer", label: "کارفرما", type: "text" },
    {
      name: "provinceGeoID",
      label: "استان",
      type: "select",
      options: data.geos.GEOT_PROVINCE,
      optionLabelField: "geoName",
      optionIdField: "geoId",
    },
    { name: "industry", label: "صنعت", type: "text", required: true },
    {
      name: "jobEnumId",
      label: "شغل",
      type: "select",
      long: true,
      urlLong: "/rest/s1/fadak/long",
      options: jobFormValue,
      changeCallback: onChange,
    },
    {
      name: "relationDegreeEnumId",
      label: "سطح ارتباط",
      type: "select",
      options: data?.enums?.RelationDegree,
    },
    {
      name: "workingTimeInHoursPerWeek",
      label: "ساعت کاری در هفته",
      type: "number",
    },
    { name: "description", label: "توضیحات", type: "text" },
  ];

  const handler_data = async () => {
    await addJobPartQ(formValuesData, setFormValuesData);

    setFormValuesData(defualtValue);
  };

  useEffect(() => {
    if (currentData?.jobQualifaicatioId !== -1) {
      const currentItem =
        currentData?.jobPartyQ[currentData.jobQualifaicatioId];
      const defualtValues = { ...currentItem };

      setFormValuesData(defualtValues);
    }
  }, [currentData?.jobQualifaicatioId]);

  const pk = "jobEnumId";

  const handler_edit = () => {
    editJobPartyQualificationHandler(formValuesData);
  };
  const handler_rest = () => {
    setFormValuesData(defualtValue);
    setCurrentData((prevState) => ({ ...prevState, jobQualifaicatioId: -1 }));
  };
  return (
    <Card>
      <CardContent>
        <Card variant="outlined">
          <CardHeader title="سوابق تحصیلی" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  id="educationalInformationGroup"
                  name="educationalInformationGroup"
                  options={data.enums.AcademicDepartmentType}
                  getOptionLabel={(options) => options.description || ""}
                  fullWidth
                  onChange={(event, newVal) => {
                    autoCompleteHandlerChange(
                      newVal,
                      "enumId",
                      "educational",
                      "academicDepartmentEnumId"
                    );
                  }}
                  defaultValue={() => {
                    let academicDepartmentEnumId = {};
                    data.enums.AcademicDepartmentType.map((academic, index) => {
                      if (
                        currentData.qualifaicatioId != -1 &&
                        academic.enumId ==
                          currentData.partyQualification[
                            currentData.qualifaicatioId
                          ].academicDepartmentEnumId
                      ) {
                        academicDepartmentEnumId = academic;
                      }
                    });

                    return academicDepartmentEnumId ?? null;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=" گروه آموزشی"
                      id="educationalInformationGroupinput"
                      name="educationalInformationGroupinput"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  id="educationalInformationGrade"
                  name="educationalInformationGrade"
                  options={QualificationTypeArrya}
                  getOptionLabel={(options) => options.description || ""}
                  fullWidth
                  disabled={currentData.qualifaicatioId != -1 ? true : false}
                  onChange={(event, newVal) => {
                    autoCompleteHandlerChange(
                      newVal,
                      "enumId",
                      "educational",
                      "qualificationTypeEnumId"
                    );
                  }}
                  defaultValue={() => {
                    let educationalInformationGrade = {};
                    data.enums.QualificationType.map((grade, index) => {
                      if (
                        currentData.qualifaicatioId != -1 &&
                        grade.enumId ==
                          currentData.partyQualification[
                            currentData.qualifaicatioId
                          ].qualificationTypeEnumId
                      ) {
                        educationalInformationGrade = grade;
                      }
                    });

                    return educationalInformationGrade ?? null;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label=" مقطع"
                      helperText={
                        style && style.qualificationTypeEnumId
                          ? ""
                          : "پر کردن این فیلد الزامی است"
                      }
                      className={
                        style && style.qualificationTypeEnumId
                          ? classes.formControl
                          : classes.root
                      }
                      FormHelperTextProps={{ classes: helperTestClasses }}
                      id="educationalInformationGradeInput"
                      name="educationalInformationGradeInput"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Autocomplete
                  id="educationalInformationField"
                  name="educationalInformationField"
                  options={data.enums.UniversityFields.sort(
                    (a, b) => b.sequenceNum - a.sequenceNum
                  )}
                  getOptionLabel={(options) => options.description || ""}
                  fullWidth
                  onChange={(event, newVal) => {
                    autoCompleteHandlerChange(
                      newVal,
                      "enumId",
                      "educational",
                      "fieldEnumId"
                    );
                  }}
                  defaultValue={() => {
                    let educationalInformationField = {};

                    data.enums.UniversityFields.map((field, index) => {
                      if (
                        currentData.qualifaicatioId != -1 &&
                        field.enumId ==
                          currentData.partyQualification[
                            currentData.qualifaicatioId
                          ].fieldEnumId
                      ) {
                        educationalInformationField = field;
                      }
                    });

                    return educationalInformationField ?? null;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=" رشته تحصیلی"
                      id="educationalInformationFieldInput"
                      name="educationalInformationFieldInput"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  id="typeOfUniEnumId"
                  name="typeOfUniEnumId"
                  options={data.enums.UniversityType}
                  getOptionLabel={(options) => options.description || ""}
                  fullWidth
                  onChange={(event, newVal) => {
                    autoCompleteHandlerChange(
                      newVal,
                      "enumId",
                      "educational",
                      "typeOfUniEnumId"
                    );
                  }}
                  defaultValue={() => {
                    let typeOfUni = {};
                    data.enums.UniversityType.map((grade, index) => {
                      if (
                        currentData.qualifaicatioId != -1 &&
                        grade.enumId ==
                          currentData.partyQualification[
                            currentData.qualifaicatioId
                          ].typeOfUniEnumId
                      ) {
                        typeOfUni = grade;
                      }
                    });

                    return typeOfUni ?? null;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=" نوع دانشگاه"
                      id="typeOfUniInpu"
                      name="typeOfUniInpu"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  id="educationalInformationUniversity"
                  name="educationalInformationUniversity"
                  options={data.enums.UniversityName}
                  getOptionLabel={(options) => options.description || ""}
                  fullWidth
                  onChange={(event, newVal) => {
                    autoCompleteHandlerChange(
                      newVal,
                      "enumId",
                      "educational",
                      "uniEnumId"
                    );
                  }}
                  defaultValue={() => {
                    let educationalInformationUniversity = {};
                    data.enums.UniversityName.map((uni, index) => {
                      if (
                        currentData.qualifaicatioId != -1 &&
                        uni.enumId ==
                          currentData.partyQualification[
                            currentData.qualifaicatioId
                          ].uniEnumId
                      ) {
                        educationalInformationUniversity = uni;
                      }
                    });

                    return educationalInformationUniversity ?? null;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=" دانشگاه یا دانشکده"
                      id="educationalInformationUniversityInput"
                      name="educationalInformationUniversityInput"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Autocomplete
                  id="educationalInformationCountry"
                  name="educationalInformationCountry"
                  options={data.geos.GEOT_COUNTRY}
                  getOptionLabel={(options) => options.geoName || ""}
                  fullWidth
                  onChange={(event, newVal) => {
                    autoCompleteHandlerChange(
                      newVal,
                      "geoId",
                      "educational",
                      "countryGeoId"
                    );
                  }}
                  defaultValue={() => {
                    let educationalInformationCountry = {};
                    let IRN = {};
                    data.geos.GEOT_COUNTRY.map((geo, index) => {
                      if (geo.geoId === "IRN") {
                        IRN = geo;
                      }

                      if (
                        currentData.qualifaicatioId != -1 &&
                        geo.geoId ==
                          currentData.partyQualification[
                            currentData.qualifaicatioId
                          ].countryGeoId
                      ) {
                        educationalInformationCountry = geo;
                      }
                    });

                    return Object.keys(educationalInformationCountry).length ===
                      0
                      ? IRN
                      : educationalInformationCountry;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=" کشور"
                      id="educationalInformationCountryInput"
                      name="educationalInformationCountryInput"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  id="branchCode"
                  name="branchCode"
                  defaultValue={
                    currentData.qualifaicatioId != -1 &&
                    currentData.partyQualification
                      ? currentData.partyQualification[
                          currentData.qualifaicatioId
                        ].branchCode
                      : ""
                  }
                  label="واحد دانشگاه"
                  onChange={addFormValue("", "educational")}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <DatePicker
                  variant="outlined"
                  id="educationalInformationStartDate"
                  name="educationalInformationStartDate"
                  value={
                    formValues.educational && formValues.educational.fromDate
                      ? formValues.educational.fromDate
                      : currentData.qualifaicatioId != -1
                      ? currentData.partyQualification[
                          currentData.qualifaicatioId
                        ].fromDate
                      : null
                  }
                  setValue={startDateEducationHandler}
                  format={"jYYYY/jMMMM/jDD"}
                  helperText={
                    style && style.fromDateEducational
                      ? ""
                      : "پر کردن این فیلد الزامی است"
                  }
                  FormHelperTextProps={{ classes: helperTestClasses }}
                  errorState={style && style.fromDateEducational ? false : true}
                  required
                  disabled={currentData.qualifaicatioId != -1 ? true : false}
                  label="تاریخ شروع"
                  fullWidth
                />
                {/* <p className={(!styleBorder.fromDateEducational) ? '' : classes.NonDispaly} style={{ lineHeight: 0.1, color: "red", fontSize: "12px", letterSpacing: "-0.1px" }}>پر کردن این فیلد الزامی است</p> */}
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  variant="outlined"
                  id="educationalInformationEndDate"
                  value={
                    formValues?.educational?.thruDate
                      ? formValues.educational.thruDate
                      : currentData.qualifaicatioId != -1 &&
                        currentData?.partyQualification?.[
                          currentData.qualifaicatioId
                        ]?.thruDate
                      ? currentData.partyQualification[
                          currentData.qualifaicatioId
                        ].thruDate
                      : null
                  }
                  setValue={endDateEducationHandler}
                  format={"jYYYY/jMMMM/jDD"}
                  // required
                  // errorState={(style && style.thruDateEducational) ? false : true}

                  // helperText={(style && style.thruDateEducational) ? "" : "پر کردن این فیلد الزامی است"}
                  FormHelperTextProps={{ classes: helperTestClasses }}
                  label="تاریخ پایان"
                  fullWidth
                />
                {/* <p className={(!styleBorder.thruDateEducational) ? '' : classes.NonDispaly} style={{ lineHeight: 0.1, color: "red", fontSize: "12px", letterSpacing: "-0.1px" }}>پر کردن این فیلد الزامی است</p> */}
              </Grid>

              <Grid item xs={12} md={4}>
                <Autocomplete
                  id="relationDegreeEnumId"
                  name="relationDegreeEnumId"
                  options={data?.enums?.RelationDegree ?? []}
                  getOptionLabel={(options) => options.description || ""}
                  fullWidth
                  onChange={(event, newVal) => {
                    autoCompleteHandlerChange(
                      newVal,
                      "enumId",
                      "educational",
                      "relationDegreeEnumId"
                    );
                  }}
                  defaultValue={() => {
                    let educationalInformationUniversity = {};
                    data.enums.RelationDegree.map((uni, index) => {
                      if (
                        currentData.qualifaicatioId != -1 &&
                        uni.enumId ==
                          currentData.partyQualification[
                            currentData.qualifaicatioId
                          ].relationDegreeEnumId
                      ) {
                        educationalInformationUniversity = uni;
                      }
                    });

                    return educationalInformationUniversity ?? null;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=" سطح ارتباط"
                      id="relationDegreeEnumId"
                      name="relationDegreeEnumId"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  id="gradePointAverage"
                  name="gradePointAverage"
                  type="number"
                  defaultValue={
                    currentData.qualifaicatioId != -1 &&
                    currentData.partyQualification
                      ? currentData.partyQualification[
                          currentData.qualifaicatioId
                        ].gradePointAverage
                      : ""
                  }
                  label="معدل نهایی"
                  onChange={addFormValue("", "educational")}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  id="title"
                  name="title"
                  defaultValue={
                    currentData.qualifaicatioId != -1 &&
                    currentData.partyQualification
                      ? currentData.partyQualification[
                          currentData.qualifaicatioId
                        ].title
                      : ""
                  }
                  label="عنوان پایان‌نامه"
                  onChange={addFormValue("", "educational")}
                  fullWidth
                />
                <ModalDelete
                  open={openModel}
                  currentData={currentData}
                  setDisplay={setDisplay}
                  setCurrentData={setCurrentData}
                  handleClose={handlerCloseModel}
                  setOpen={setOpenModel}
                  setId={50}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Grid>
                  <label htmlFor="contentId">پیوست</label>
                  <br />
                  <input
                    onChange={addFormValue(INPUT_TYPES.FILE, "educational")}
                    accept=".pdf , image/* , .gif , "
                    type="file"
                    id="contentId"
                    name="contentId"
                    filename={""}
                  />
                </Grid>
                <Grid>
                  <Button
                    variant="outlined"
                    color="primary"
                    href={
                      currentData.qualifaicatioId != -1
                        ? typeof currentData.qualifaicatioId[
                            currentData.qualifaicatioId
                          ] !== undefined
                          ? SERVER_URL +
                            `/rest/s1/fadak/getpersonnelfile1?name=` +
                            currentData.partyQualification[
                              currentData.qualifaicatioId
                            ].contentId
                          : ""
                        : ""
                    }
                    target="_blank"
                  >
                    {" "}
                    <Image />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="default"
                className="mt-5"
                onClick={() => partyQualiCancelHandelr()}
              >
                لفو
              </Button>
              {currentData.qualifaicatioId != -1 ? (
                <Button
                  style={{ maxWidth: "88px", marginRight: "6px" }}
                  variant="contained"
                  color="default"
                  className="mt-5"
                  onClick={() => editePartyQualificationHandler()}
                  startIcon={<Add />}
                >
                  ویرایش
                </Button>
              ) : (
                <Button
                  style={{ maxWidth: "88px", marginRight: "6px" }}
                  variant="contained"
                  color="secondary"
                  className="mt-5"
                  onClick={() => addPartyQualification()}
                  startIcon={<Add />}
                >
                  افزودن
                </Button>
              )}
            </Grid>
            <CTable
              headers={[
                {
                  id: "educationalInformationGroupinput",
                  label: "گروه اموزشی",
                },
                {
                  id: "educationalInformationGrade",
                  label: "مقطع",
                },
                {
                  id: "educationalInformationField",
                  label: "رشته تحصیلی",
                },
                {
                  id: "educationalInformationFieldInput",
                  label: "نوع دانشگاه",
                },
                {
                  id: "educationalInformationUniversity",
                  label: "دانشگاه یا دانشکده",
                },
                {
                  id: "branchCode",
                  label: "واحد",
                },
                {
                  id: "delete",
                  label: " حذف",
                },
                {
                  id: "modify",
                  label: "ویرایش",
                },
              ]}
              rows={table?.a?.length ? [...table?.a] : []}
            />
          </CardContent>
        </Card>
        <Card variant="outlined" className="mt-20">
          <CardHeader title="سوابق شغلی" />
          <CardContent p={2}>
            <FormPro
              prepend={formStructure}
              formValues={formValuesData}
              setFormValues={setFormValuesData}
              submitCallback={
                currentData.jobQualifaicatioId == -1
                  ? handler_data
                  : handler_edit
              }
              // setFormValuesData(defualtValue)
              resetCallback={handler_rest}
              actionBox={
                <ActionBox>
                  <Button type="submit" role="primary">
                    {currentData.jobQualifaicatioId == -1 ? "تایید" : "ویرایش"}
                  </Button>
                  <Button type="reset" role="secondary">
                    لغو
                  </Button>
                </ActionBox>
              }
            />
            <CTable
              headers={[
                {
                  id: "title",
                  label: "عنوان شغلی",
                },
                {
                  id: "employer",
                  label: "کارفرما",
                },
                {
                  id: "educationalInformationJobWorkingDuration",
                  label: "مدت زمان همکاری",
                },
                {
                  id: "educationalInformationJobHierarchicalLevel",
                  label: "رده سازمانی",
                },
                {
                  id: "industry",
                  label: "صنعت",
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
              rows={table?.b?.length ? [...table.b] : []}
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default EducationalHistoryForm;
