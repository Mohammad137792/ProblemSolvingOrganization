import React, { useEffect, useState } from "react";
import { setFormDataHelper } from "../../../../helpers/setFormDataHelper";
import EducationalHistoryForm from "./EducationalHistoryForm";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../../configs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Button } from "@material-ui/core";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../store/actions/fadak";
import { Add, Edit, Delete, Image } from "@material-ui/icons";

const EducationalHistory = (props) => {
  const [formData, setFormData] = useState({});
  const addFormData = setFormDataHelper(setFormData);
  const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
  const partyIdUser = useSelector(
    ({ fadak }) => fadak.baseInformationInisial.user
  );
  //ُSTART STATE
  const [data, setData] = useState();
  const [table, setTable] = useState([]);
  const [styleBorder, setStayle] = useState({
    jobTitle: true,
    industry: true,
    qualificationTypeEnumId: true,
    fromDateEducational: true,
    thruDateEducational: true,
    fromDateJob: true,
    thruDateJob: true,
  });
  const [currentData, setCurrentData] = useState({
    qualifaicatioId: -1,
    jobQualifaicatioId: -1,
    deleteJobQualifaicatioId: -1,
    deletequalifaicatioId: -1,
  });
  const [display, setDisplay] = useState();
  const [openModel, setOpenModel] = useState(false);
  const [addRows, setAddRows] = React.useState({
    PartyQualification: 1,
    SetPartyQualification: 1,
    addJobPartQ: 1,
    setAddJobPartQ: 1,
  });
  const contentIdFormData = new FormData();
  const partyId = partyIdUser !== null ? partyIdUser : partyIdLogin;
  const dispatch = useDispatch();

  //config axios
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const config = {
    timeout: AXIOS_TIMEOUT,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      api_key: localStorage.getItem("api_key"),
    },
  };

  const getData = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=UniversityName,RelationDegree,GradeType,UniversityFields,UniversityType,AcademicDepartmentType ,QualificationType ,AcademicDepartmentType,&geoTypeList=GEOT_COUNTRY,GEOT_PROVINCE",
        axiosKey
      )
      .then((res) => {
        // setData({ ...res.data })
        const initialData = { ...res.data };
        initialData.enums.QualificationType = [
          ...res.data.enums.QualificationType.filter(
            (item) => item?.enumCode && item?.sequenceNum
          ),
        ];
        setData({ ...initialData });
        axios
          .get(
            SERVER_URL +
              "/rest/s1/fadak/entity/PartyQualification?partyId=" +
              partyId,
            axiosKey
          )
          .then((res) => {
            console.log("adijasdvav", res);
            let itemPartyQualification = [];
            let itemJobPartyQ = [];
            res.data.result.map((item, index) => {
              if (item.qualificationTypeEnumId !== "WorkExperience") {
                itemPartyQualification.push({ ...item });
              }
              if (item.qualificationTypeEnumId == "WorkExperience") {
                itemJobPartyQ.push({ ...item });
              }
            });
            setCurrentData(
              Object.assign(
                {},
                currentData,
                { partyQualification: itemPartyQualification },
                { jobPartyQ: itemJobPartyQ }
              )
            );
            // setDisplay(false);
            // setTimeout(() => {
            //     setDisplay(true);
            // }, 100)
          });
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let reducationalRows = [];
    let jobRows = [];

    const setQualifaication = (item) => {
      if (data && data.enums.qualificationtype) {
        let val = data.enums.qualificationtype
          .map((el, index) => {
            if (el.enumId === item) return el.description;
          })
          .filter((item) => item !== undefined);
        return val[0];
      }
      return "";
    };
    const setUni = (item) => {
      if (data && data.enums.UniversityName) {
        let val = data.enums.UniversityName.map((el, index) => {
          if (el.enumId === item) return el.description;
        }).filter((item) => item !== undefined);

        return val[0];
      }
      return "";
    };
    const setDB = (item, checkEnum) => {
      if (data && data.enums[checkEnum]) {
        let val = data.enums[checkEnum]
          .map((el, index) => {
            if (el.enumId === item) return el.description;
          })
          .filter((item) => item !== undefined);

        return val[0];
      }
      return "";
    };

    const setField = (item) => {
      if (data && data.enums.UniversityFields) {
        let val = data.enums.UniversityFields.map((el, index) => {
          if (el.enumId === item) return el.description;
        }).filter((item) => item !== undefined);

        return val[0];
      }
      return "";
    };

    if (currentData && currentData.partyQualification) {
      currentData.partyQualification.map((item, index) => {
        let rows = {
          id: index,
          educationalInformationGroupinput: setDB(
            item.academicDepartmentEnumId,
            "AcademicDepartmentType"
          ),
          educationalInformationGrade: setQualifaication(
            item.qualificationTypeEnumId
          ),
          educationalInformationField: setField(item.fieldEnumId),
          educationalInformationFieldInput: setDB(
            item.typeOfUniEnumId,
            "UniversityType"
          ),
          educationalInformationUniversity: setUni(item.uniEnumId),
          branchCode: item.branchCode,

          delete: (
            <Button
              variant="contained"
              startIcon={<Delete />}
              onClick={() => deleteTableFristHandler(index)}
              style={{ background: "red", minWidth: "90px", color: "white" }}
            >
              حذف
            </Button>
          ),
          modify: (
            <Button
              variant="contained"
              style={{ minWidth: "90px" }}
              onClick={() => editPartyQualification(index)}
              startIcon={<Edit />}
              color="secondary"
            >
              ویرایش
            </Button>
          ),
        };
        reducationalRows.push(rows);
      });

      setTable((prevSate) => {
        return {
          ...prevSate,
          a: reducationalRows,
        };
      });

      setDisplay(false);
      setTimeout(() => {
        setDisplay(true);
      }, 100);
    }

    // --------------------------->secound table <--------------------------------//

    if (currentData && currentData.jobPartyQ) {
      const converDate = (dateStart, dateEnd) => {
        let frist = dateStart === undefined ? new Date().getTime : dateStart;
        let secound = dateEnd === undefined ? new Date().getTime : dateEnd;
        var a = secound - frist;

        if (secound > frist) {
          let result = secound - frist;

          let resaYear = result / 31536000000;

          if (1 < resaYear) {
            return ` حدودا  ${resaYear.toFixed(0)}  سال`;
          }

          let resultMonth = resaYear * 12;
          return ` حدودا  ${resultMonth.toFixed(0)}  ماه`;
        }
        return "کمتر از یک ماه";
      };
      currentData.jobPartyQ.map((item, index) => {
        let row = {
          id: index,
          title: item.title,
          employer: item.employer,
          educationalInformationJobWorkingDuration: converDate(
            item.fromDate,
            item.thruDate
          ),
          educationalInformationJobHierarchicalLevel: setDB(
            item.employmentStatusTypeEnumId,
            "GradeType"
          ),
          industry: item.industry,
          delete: (
            <Button
              variant="contained"
              startIcon={<Delete />}
              onClick={() => deleteTableSecoundHandler(index)}
              style={{ background: "red", minWidth: "90px", color: "white" }}
            >
              حذف
            </Button>
          ),
          modify: (
            <Button
              variant="contained"
              style={{ minWidth: "90px" }}
              onClick={() => editJobPartyQualification(index)}
              startIcon={<Edit />}
              color="secondary"
            >
              ویرایش
            </Button>
          ),
        };

        jobRows.push(row);
      });

      setTable((prevSate) => {
        return {
          ...prevSate,
          b: jobRows,
        };
      });
      setDisplay(false);
      setTimeout(() => {
        setDisplay(true);
      }, 100);
    }
  }, [currentData]);

  useEffect(() => {
    const data_types = [
      "PartyQualification",
      "SetPartyQualification",
      "addJobPartQ",
      "setAddJobPartQ",
    ];
    let is_updating = false;
    data_types.map((item, index) => {
      if (typeof addRows[item] != "undefined" && addRows[item] === 0) {
        is_updating = true;
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت  ثبت شد")
        );
      }
    });
    data_types.map((item, index) => {
      if (typeof addRows[item] != "undefined" && addRows[item] === -1) {
        // is_updating = true;

        setTimeout(() => {
          dispatch(
            setAlertContent(
              ALERT_TYPES.SUCCESS,
              "اطلاعات با موفقیت  به روزرسانی شد"
            )
          );
        }, 1000);
      }
    });
  }, [addRows]);

  const addPartyQualification = () => {
    if (
      formData.educational !== undefined &&
      formData.educational.fromDate !== undefined &&
      formData.educational.qualificationTypeEnumId
    ) {
      dispatch(
        setAlertContent(ALERT_TYPES.WARNING, "اطلاعات در حال  به روز رسانی است")
      );
      const newaddRows = Object.assign({}, { ["PartyQualification"]: -1 });
      setAddRows(newaddRows);
      if (formData.educational.contentId) {
        contentIdFormData.append("file", formData.educational.contentId);
        axios
          .post(
            SERVER_URL + "/rest/s1/fadak/getpersonnelfile",
            contentIdFormData,
            config
          )
          .then((response) => {
            formData.educational = {
              ...formData.educational,
              contentId: response.data.name,
            };
            setFormData(Object.assign({}, formData));
            axios
              .post(
                SERVER_URL + "rest/s1/fadak/entity/PartyQualification",
                { data: { ...formData.educational, partyId: partyId } },
                axiosKey
              )
              .then((res) => {
                const row = {
                  partyId,
                  uniEnumId: formData.educational.uniEnumId,
                  academicDepartmentEnumId:
                    formData.educational.academicDepartmentEnumId,
                  countryGeoId: formData.educational.countryGeoId
                    ? formData.educational.countryGeoId
                    : "IRN",
                  fieldEnumId: formData.educational.fieldEnumId,
                  gradePointAverage: formData.educational.gradePointAverage,
                  qualificationTypeEnumId:
                    formData.educational.qualificationTypeEnumId,
                  title: formData.educational.title,
                  relationDegreeEnumId:
                    formData.educational.relationDegreeEnumId,
                  typeOfUniEnumId: formData.educational.typeOfUniEnumId,
                  branchCode: formData.educational.branchCode,
                  fromDate: formData.educational.fromDate
                    ? Math.round(
                        new Date(formData.educational.fromDate).getTime()
                      )
                    : null,
                  thruDate: formData.educational.thruDate
                    ? Math.round(
                        new Date(formData.educational.thruDate).getTime()
                      )
                    : null,
                  contentId: response ? response.data.name : "",
                };

                currentData.partyQualification = [
                  ...currentData.partyQualification,
                  row,
                ];

                setCurrentData(Object.assign({}, currentData));
                formData.educational = undefined;
                setFormData(Object.assign(formData));
              });
          });
        setStayle((prevState) => ({
          ...prevState,
          qualificationTypeEnumId: true,
          fromDateEducational: true,
          thruDateEducational: true,
        }));
        return null;
      }
      console.log("vakvavav", formData.educational);

      axios
        .post(
          SERVER_URL + "/rest/s1/fadak/entity/PartyQualification",
          { data: { ...formData.educational, partyId: partyId } },
          axiosKey
        )
        .then((res) => {
          const row = {
            partyId,
            uniEnumId: formData.educational.uniEnumId,
            academicDepartmentEnumId:
              formData.educational.academicDepartmentEnumId,
            countryGeoId: formData.educational.countryGeoId
              ? formData.educational.countryGeoId
              : "IRN",
            fieldEnumId: formData.educational.fieldEnumId,
            gradePointAverage: formData.educational.gradePointAverage,
            qualificationTypeEnumId:
              formData.educational.qualificationTypeEnumId,
            title: formData.educational.title,
            relationDegreeEnumId: formData.educational.relationDegreeEnumId,
            typeOfUniEnumId: formData.educational.typeOfUniEnumId,
            branchCode: formData.educational.branchCode,
            fromDate: formData.educational.fromDate
              ? Math.round(new Date(formData.educational.fromDate).getTime())
              : null,
            thruDate: formData.educational.thruDate
              ? Math.round(new Date(formData.educational.thruDate).getTime())
              : null,
            contentId: "",
          };

          currentData.partyQualification = [
            ...currentData.partyQualification,
            row,
          ];

          setCurrentData(Object.assign({}, currentData));
          formData.educational = undefined;
          setFormData(Object.assign(formData));
        });
      setStayle((prevState) => ({
        ...prevState,
        qualificationTypeEnumId: true,
        fromDateEducational: true,
        thruDateEducational: true,
      }));
      return null;
    }
    dispatch(setAlertContent(ALERT_TYPES.ERROR, "فیلد های اجباری را پر کنید"));
    setStayle((prevState) => ({
      ...prevState,
      qualificationTypeEnumId:
        formData &&
        formData.educational &&
        formData.educational.qualificationTypeEnumId
          ? true
          : false,
      fromDateEducational:
        formData && formData.educational && formData.educational.fromDate
          ? true
          : false,
      thruDateEducational:
        formData && formData.educational && formData.educational.thruDate
          ? true
          : false,
    }));
  };

  const deleteTableFristHandler = (id) => {
    setOpenModel(true);
    currentData.deletequalifaicatioId = id;
    setCurrentData(Object.assign({}, currentData));
  };

  const partyQualiCancelHandelr = () => {
    setStayle({
      jobTitle: true,
      industry: true,
      qualificationTypeEnumId: true,
      fromDateEducational: true,
      thruDateEducational: true,
      fromDateJob: true,
      thruDateJob: true,
    });
    formData.jobPartyQ = undefined;
    setFormData(Object.assign(formData));
    formData.educational = undefined;
    setFormData(Object.assign(formData));

    if (currentData.qualifaicatioId != -1) {
      currentData.qualifaicatioId = -1;
      setCurrentData(Object.assign({}, currentData));
      setDisplay(false);
      setTimeout(() => {
        setDisplay(true);
      }, 20);
      formData.educational = undefined;
      setFormData(Object.assign(formData));
      return null;
    }
    if (currentData.jobQualifaicatioId != -1) {
      currentData.jobQualifaicatioId = -1;
      setCurrentData(Object.assign({}, currentData));
      setDisplay(false);
      setTimeout(() => {
        setDisplay(true);
      }, 20);
      formData.educational = undefined;
      setFormData(Object.assign(formData));
      return null;
    }
    setDisplay(false);
    setTimeout(() => {
      setDisplay(true);
    }, 20);
  };

  const handlerCloseModel = () => {
    setOpenModel(false);
  };

  const editPartyQualification = (index) => {
    currentData.qualifaicatioId = index;
    setCurrentData(Object.assign({}, currentData));
  };

  const editePartyQualificationHandler = () => {
    dispatch(
      setAlertContent(ALERT_TYPES.WARNING, "اطلاعات در حال  به روز رسانی است")
    );

    if (
      formData.educational &&
      formData.educational.qualificationTypeEnumId !== ""
    ) {
      let fromDate = Math.round(
        new Date(
          currentData.partyQualification[currentData.qualifaicatioId].fromDate
        ).getTime()
      );
      let partyId =
        currentData.partyQualification[currentData.qualifaicatioId].partyId;
      let qualificationTypeEnumId =
        currentData.partyQualification[currentData.qualifaicatioId]
          .qualificationTypeEnumId;
      const newaddRows = Object.assign({}, { ["SetPartyQualification"]: -1 });
      setAddRows(newaddRows);
      if (formData.educational.contentId) {
        contentIdFormData.append("file", formData.educational.contentId);
        axios
          .post(
            SERVER_URL + "/rest/s1/fadak/getpersonnelfile",
            contentIdFormData,
            config
          )
          .then((response) => {
            const row = {
              uniEnumId: formData.educational.uniEnumId
                ? formData.educational.uniEnumId
                : formData.educational.uniEnumId === ""
                ? ""
                : currentData.partyQualification[currentData.qualifaicatioId]
                    .uniEnumId,
              academicDepartmentEnumId: formData.educational
                .academicDepartmentEnumId
                ? formData.educational.academicDepartmentEnumId
                : formData.educational.academicDepartmentEnumId === ""
                ? ""
                : currentData.partyQualification[currentData.qualifaicatioId]
                    .academicDepartmentEnumId,
              countryGeoId: formData.educational.countryGeoId
                ? formData.educational.countryGeoId
                : formData.educational.countryGeoId === ""
                ? ""
                : currentData.partyQualification[currentData.qualifaicatioId]
                    .countryGeoId,
              fieldEnumId: formData.educational.fieldEnumId
                ? formData.educational.fieldEnumId
                : formData.educational.fieldEnumId === ""
                ? ""
                : currentData.partyQualification[currentData.qualifaicatioId]
                    .fieldEnumId,
              gradePointAverage:
                Number(formData.educational.gradePointAverage) ??
                currentData.partyQualification[currentData.qualifaicatioId]
                  .gradePointAverage,
              typeOfUniEnumId: formData.educational.typeOfUniEnumId
                ? formData.educational.typeOfUniEnumId
                : formData.educational.typeOfUniEnumId === ""
                ? ""
                : currentData.partyQualification[currentData.qualifaicatioId]
                    .typeOfUniEnumId,
              title: formData.educational.title
                ? formData.educational.title
                : formData.educational.title === ""
                ? ""
                : currentData.partyQualification[currentData.qualifaicatioId]
                    .title,

              relationDegreeEnumId: formData.educational.relationDegreeEnumId
                ? formData.educational.relationDegreeEnumId
                : formData.educational.relationDegreeEnumId === ""
                ? ""
                : currentData.partyQualification[currentData.qualifaicatioId]
                    .relationDegreeEnumId,

              branchCode: formData.educational.branchCode
                ? formData.educational.branchCode
                : formData.educational.branchCode === ""
                ? ""
                : currentData.partyQualification[currentData.qualifaicatioId]
                    .branchCode,
              thruDate: formData.educational
                ? formData.educational.thruDate
                : "",
              contentId: response.data.name,
            };
            formData.educational = {
              ...formData.educational,
              contentId: response.data.name,
            };
            setFormData(Object.assign({}, formData));
            axios
              .put(
                SERVER_URL + `/rest/s1/fadak/entity/PartyQualification`,
                {
                  data: {
                    ...row,
                    partyId: partyId,
                    fromDate: fromDate,
                    qualificationTypeEnumId: qualificationTypeEnumId,
                  },
                },
                axiosKey
              )
              .then((res) => {
                let newValue = Object.assign(
                  {},
                  currentData.partyQualification[currentData.qualifaicatioId],
                  row
                );
                currentData.partyQualification[currentData.qualifaicatioId] =
                  newValue;
                currentData.qualifaicatioId = -1;
                setCurrentData(Object.assign({}, currentData));
                formData.educational = undefined;
                setFormData(Object.assign(formData));
              });
          });

        return null;
      }
      const row = {
        uniEnumId: formData.educational.uniEnumId
          ? formData.educational.uniEnumId
          : formData.educational.uniEnumId === ""
          ? ""
          : currentData.partyQualification[currentData.qualifaicatioId]
              .uniEnumId,
        academicDepartmentEnumId: formData.educational.academicDepartmentEnumId
          ? formData.educational.academicDepartmentEnumId
          : formData.educational.academicDepartmentEnumId === ""
          ? ""
          : currentData.partyQualification[currentData.qualifaicatioId]
              .academicDepartmentEnumId,
        countryGeoId: formData.educational.countryGeoId
          ? formData.educational.countryGeoId
          : formData.educational.countryGeoId === ""
          ? ""
          : currentData.partyQualification[currentData.qualifaicatioId]
              .countryGeoId,
        fieldEnumId: formData.educational.fieldEnumId
          ? formData.educational.fieldEnumId
          : formData.educational.fieldEnumId === ""
          ? ""
          : currentData.partyQualification[currentData.qualifaicatioId]
              .fieldEnumId,
        gradePointAverage:
          Number(formData.educational.gradePointAverage) ??
          currentData.partyQualification[currentData.qualifaicatioId]
            .gradePointAverage,
        typeOfUniEnumId: formData.educational.typeOfUniEnumId
          ? formData.educational.typeOfUniEnumId
          : formData.educational.typeOfUniEnumId === ""
          ? ""
          : currentData.partyQualification[currentData.qualifaicatioId]
              .typeOfUniEnumId,
        title: formData.educational.title
          ? formData.educational.title
          : formData.educational.title === ""
          ? ""
          : currentData.partyQualification[currentData.qualifaicatioId].title,
        relationDegreeEnumId: formData.educational.relationDegreeEnumId
          ? formData.educational.relationDegreeEnumId
          : formData.educational.relationDegreeEnumId === ""
          ? ""
          : currentData.partyQualification[currentData.qualifaicatioId]
              .relationDegreeEnumId,

        branchCode: formData.educational.branchCode
          ? formData.educational.branchCode
          : formData.educational.branchCode === ""
          ? ""
          : currentData.partyQualification[currentData.qualifaicatioId]
              .branchCode,
        thruDate: formData.educational ? formData.educational.thruDate : "",
        contentId: currentData.partyQualification[currentData.qualifaicatioId]
          .contentId
          ? currentData.partyQualification[currentData.qualifaicatioId]
              .contentId
          : "",
      };

      axios
        .put(
          SERVER_URL + `/rest/s1/fadak/entity/PartyQualification`,
          {
            data: {
              ...row,
              partyId: partyId,
              fromDate: fromDate,
              qualificationTypeEnumId: qualificationTypeEnumId,
            },
          },
          axiosKey
        )
        .then((res) => {
          let newValue = Object.assign(
            {},
            currentData.partyQualification[currentData.qualifaicatioId],
            row
          );
          currentData.partyQualification[currentData.qualifaicatioId] =
            newValue;
          currentData.qualifaicatioId = -1;
          setCurrentData(Object.assign({}, currentData));
          formData.jobPartyQ = undefined;
          setFormData(Object.assign(formData));
        });

      return null;
    }

    dispatch(
      setAlertContent(ALERT_TYPES.ERROR, "اطلاعات در حال  به روز رسانی است")
    );
    setStayle((prevState) => ({
      ...prevState,
      thruDateEducational: false,
    }));
  };

  // --------------------------->secound part<------------------------------------------------------------//

  async function addJobPartQ(data, setFormValuesData) {
    formData.jobPartyQ = {
      ...formData.jobPartyQ,
      qualificationTypeEnumId: "WorkExperience",
    };
    const valueForm = Object.assign({}, formData);
    setFormData(Object.assign({}, { ...valueForm }));

    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/entity/PartyQualification",
        {
          data: {
            ...data,
            qualificationTypeEnumId: "WorkExperience",
            partyId: partyId,
          },
        },
        axiosKey
      )
      .then((res) => {
        console.log("aajbababa", res);
        getData();
        // alert('ok')?
        // const row = {
        //     partyId,
        //     employer: dataemployer,
        //     qualificationTypeEnumId: dataqualificationTypeEnumId,
        //     title: dataTitle,
        //     provinceGeoID: dataprovinceGeoID,
        //     industry: dataindustry,
        //     jobEnumId: datajobEnumId,
        //     employmentStatusTypeEnumId: dataemploymentStatusTypeEnumId,
        //     workingTimeInHoursPerWeek: dataworkingTimeInHoursPerWeek,
        //     description: datadescription,
        //     fromDate: (formData.jobPartyQ) ? Math.round(new Date(datafromDate)) : '',
        //     thruDate: (formData.jobPartyQ) ? Math.round(new Date(datathruDate)) : '',

        // }

        // currentData.jobPartyQ = [...currentData.jobPartyQ, row]

        // setCurrentData(Object.assign({}, currentData))

        formData.jobPartyQ = undefined;
        setFormData(Object.assign(formData));
        const newaddRows = Object.assign({}, { ["addJobPartQ"]: -1 });
        setAddRows(newaddRows);
      });
  }

  const deleteTableSecoundHandler = (item) => {
    setOpenModel(true);
    currentData.deleteJobQualifaicatioId = item;
    setCurrentData(Object.assign({}, currentData));
  };

  const editJobPartyQualificationHandler = (data) => {
    const id = currentData.jobQualifaicatioId;
    const Validate = formData.jobPartyQ ? true : false;

    const currentItem = currentData.jobPartyQ[currentData.jobQualifaicatioId];

    // if (formData.jobPartyQ) {

    let fromDate = currentItem.fromDate;
    let partyId = currentItem.partyId;
    let qualificationTypeEnumId = currentItem.qualificationTypeEnumId;
    dispatch(
      setAlertContent(ALERT_TYPES.WARNING, "اطلاعات در حال  به روز رسانی است")
    );
    const newaddRows = Object.assign({}, { ["setAddJobPartQ"]: -1 });
    setAddRows(newaddRows);

    axios
      .put(
        `${SERVER_URL}/rest/s1/fadak/entity/PartyQualification`,
        {
          data: {
            ...data,
            partyId: partyId,
            fromDate: fromDate,
            qualificationTypeEnumId: qualificationTypeEnumId,
          },
        },
        axiosKey
      )
      .then((res) => {
        // let newValue = Object.assign({}, currentData.jobPartyQ[currentData.jobQualifaicatioId], data)
        // currentData.jobPartyQ[currentData.jobQualifaicatioId] = newValue
        currentData.jobQualifaicatioId = -1;
        setCurrentData(Object.assign({}, currentData));
        getData();
      });
  };
  const editJobPartyQualification = (index) => {
    currentData.jobQualifaicatioId = index;
    setCurrentData(Object.assign({}, currentData));
    const jobEnumId = currentData?.jobPartyQ[index]?.jobEnumId;
    setFormData((prevState) => ({ ...prevState, jobEnumId }));
  };

  return (
    <>
      {currentData && display && data && (
        <EducationalHistoryForm
          setCurrentData={setCurrentData}
          data={data}
          setDisplay={setDisplay}
          currentData={currentData}
          editePartyQualificationHandler={editePartyQualificationHandler}
          setFormData={setFormData}
          partyQualiCancelHandelr={partyQualiCancelHandelr}
          addPartyQualification={addPartyQualification}
          editPartyQualification={editPartyQualification}
          table={table}
          setTable={setTable}
          handlerCloseModel={handlerCloseModel}
          editJobPartyQualificationHandler={editJobPartyQualificationHandler}
          openModel={openModel}
          setOpenModel={setOpenModel}
          addJobPartQ={addJobPartQ}
          styleBorder={styleBorder}
          formValues={formData}
          addFormValue={addFormData}
          setStayle={setStayle}
          style={styleBorder}
        />
      )}
    </>
  );
};

export default EducationalHistory;
