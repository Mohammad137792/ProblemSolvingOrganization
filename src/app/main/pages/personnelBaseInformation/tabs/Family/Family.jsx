import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Grid, Button } from "@material-ui/core";
import { setFormDataHelper } from "../../../../helpers/setFormDataHelper";
import FamilyForm from "./FamilyForm";
import { useSelector } from "react-redux/es/hooks/useSelector";
import axios from "axios";
import { SERVER_URL } from "../../../../../../configs";
import { DeleteOutlined, Edit } from "@material-ui/icons";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import {
  ALERT_TYPES,
  setAlertContent,
  submitPost,
} from "../../../../../store/actions/fadak";
import { AXIOS_TIMEOUT } from "../../../../../../configs";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
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
  },

  spiner2: {
    height: "100%",
    width: "0",
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
  },
  divTest: {
    color: "black",
    fontWeight: "bold",
    marginLeft: "20px",
    fontSize: "20px",
  },
}));

const Family = (props) => {
  const [formData, setFormData] = useState({});
  const [data, setData] = useState(false);
  const addFormData = setFormDataHelper(setFormData);
  /**
   * set for party user
   */
  const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
  const partyIdUser = useSelector(
    ({ fadak }) => fadak.baseInformationInisial.user
  );
  const partyId = partyIdUser !== null ? partyIdUser : partyIdLogin;

  const [tableContent, setTableContent] = useState([]);
  const [open, setOpen] = useState(false);
  const [familyToEdit, setFamilyToEdit] = useState(-1);
  const [idDelete, setId] = useState([]);
  const [enablecancel, stenablecancel] = useState(false);
  const [display, setDisplay] = useState(true);
  const [currentData, setCurrentData] = useState({});

  const [enableDisableCreate, setEnableDisableCreate] = useState(false);

  const [nationalCodeId, setNationalCodeId] = useState({
    nationalCodeStatus: false,
    setNationalCodeId: -1,
    defualtValueId: -1,
  });
  const [addrow, setaddrow] = useState(false);
  const [addrowspouse, setaddrowspouse] = useState(false);
  const [addrowfirst, setaddrowfirst] = useState(false);
  const [addrowlast, setaddrowlast] = useState(false);
  const [addrowbirth, setaddrowbirth] = useState(false);
  const [support, setsupport] = useState(false);
  const [emergencycallState, setemergencycall] = useState(false);

  /**
   * state for neccery field
   */
  const [style, setStayle] = useState({
    relationshipTypeEnumId: false, //نسبت
    fromDate: false, //تاریخ ازدواج
    firstName: false, //نام
    lastName: false, //نام خانوادگی
    Nationalcode: false,
    NationalcodeId: false,
  });
  const [addrownationalcode, setaddrownationalcode] = useState(false);
  const [countryGeoId, setcountryGeoId] = useState(false);
  const [updaterow, setupdaterow] = useState(false);
  const [getFile, setgetFile] = useState(true);
  const dispatch = useDispatch();
  const classes = useStyles();
  /**
   * AXIOS AUTH CONF
   */

  const axiosConfig = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const configPost = {
    timeout: AXIOS_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
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

  /**
   * set Table data
   */

  useEffect(() => {
    if (currentData.result && data) {
      const converted = (date) => {
        let d = new Date(date);
        let converte = d.toLocaleDateString("fa-IR");

        return converte;
      };

      const autoSetValue = (itemCheck, index, enumitem) => {
        let value = "";
        if (itemCheck.PartyList[0]?.[index] && data.enums?.[enumitem]) {
          let check = itemCheck.PartyList[0]?.[index];

          data.enums[enumitem].map((item) => {
            if (item.enumId === check) {
              value = item.description;
            }
          });
        }
        return value;
      };
      let rows = [];
      currentData.result.map((partyRelation, index) => {
        if (typeof currentData.partyuserInfofileList == "undefined") {
          setgetFile(false);
        }
        data.relationShips.PartyRelationshipType.map((item, index) => {
          if (
            partyRelation.relationship &&
            item.enumId === partyRelation.relationship.relationshipTypeEnumId
          ) {
            partyRelation.relationship.relationshipTypeEnumId =
              item.description;
          }
        });

        if (partyRelation.relationship && partyRelation.IdentificationList) {
          const row1 = {
            id: index,
            index: index + 1,
            relationshipName: partyRelation.relationship.relationshipTypeEnumId,
            familyFullName: `${partyRelation.PartyList?.[0]?.firstName} ${
              partyRelation.PartyList?.[0]?.lastName
            } ${partyRelation.PartyList?.[0]?.suffix ?? ""}`,
            nationalcode: partyRelation.IdentificationList.Nationalcode,
            // familyTelephoneNumber: (PTelephone) + "-" + LTelephone,
            birthDate: converted(partyRelation.PartyList[0]?.birthDate),
            maritalStatusEnumId: autoSetValue(
              partyRelation,
              "maritalStatusEnumId",
              "MaritalStatus"
            ),
            employmentStatusEnumId: autoSetValue(
              partyRelation,
              "employmentStatusEnumId",
              "EmploymentStatus"
            ),
            delete: (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => openDeleteModal(index)}
              >
                <DeleteOutlined />
              </Button>
            ),
            modify: (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  displayUpdateForm(index);
                }}
              >
                ویرایش
              </Button>
            ),
          };
          rows.push(row1);
        }
      });
      setTableContent(rows);

      setDisplay(false);
      setTimeout(() => {
        setDisplay(true);
      }, 20);
    }
  }, [currentData, data]);

  /**
   *get page data and set current state
   */

  useEffect(() => {
    getDataFormDB();
  }, []);

  const getDataFormDB = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?" +
          "partyClassificationTypeList=Militarystate&" +
          "enumTypeList=PersonalTitleType,EmploymentStatus,MaritalStatus,UniversityFields," +
          "BaseInsuranceType," +
          "ReligionEnumId," +
          "SectEnumId," +
          "ResidenceStatus" +
          "&geoTypeList=GEOT_COUNTY,GEOT_COUNTRY,GEOT_PROVINCE" +
          "&peyvastTypeList=peyvast" +
          "&relationShipTypeList=FamilyMember" +
          "&typeAddressList=CmtPostalAddress",
        {
          headers: {
            api_key: localStorage.getItem("api_key"),
          },
        }
      )
      .then((response) => {
        axios
          .get(
            SERVER_URL +
              "/rest/s1/fadak/getdatarelationshippersonRest?fromPartyId=" +
              partyId,
            {
              headers: {
                api_key: localStorage.getItem("api_key"),
              },
            }
          )
          .then((response1) => {
            console.log("aklvakvav", response1);
            setNationalCodeId((prevState) => ({
              ...prevState,
              nationalCodeId: [],
            }));

            response1.data.result.map((item, index) => {
              if (typeof item.PartyQualificationList != "undefined") {
                if (typeof item.PartyQualificationList[0] != "undefined") {
                  if (
                    typeof item.PartyQualificationList[0]
                      .qualificationTypeEnumId != "undefined"
                  ) {
                    // setqualificationTypeEnumId(true)
                  } else if (
                    typeof item.PartyQualificationList[0]
                      .qualificationTypeEnumId == "undefined"
                  ) {
                    // setqualificationTypeEnumId(false)
                  } else if (
                    typeof item.PartyQualificationList[0].fieldEnumId !=
                    "undefined"
                  ) {
                    // setfieldEnumId(true)
                  } else if (
                    typeof item.PartyQualificationList[0].fieldEnumId ==
                    "undefined"
                  ) {
                    // setfieldEnumId(false)
                  }
                }
              }
            });
            let output = [];

            response1.data.result.map((item, index) => {
              let IdentificationList = {};
              let classification = {};

              item.PartyList.map((item2, index) => {
                classification["partyClassificationId"] =
                  item2.partyClassificationId;
              });
              item.IdentificationList.map((item2, index) => {
                IdentificationList[item2.partyIdTypeEnumId] = item2.idValue;
              });
              item.IdentificationList = IdentificationList;
              item.classification = classification;
              output.push(item);
            });

            let _currentData = {
              result: output,
            };

            setCurrentData(Object.assign({}, currentData, _currentData));
            setData(response.data);
          });
      });
  };

  useEffect(() => {
    setDisplay(false);
    setTimeout(() => {
      setDisplay(true);
    }, 40);
  }, [nationalCodeId]);

  useEffect(() => {
    if (typeof formData.person != "undefined") {
      if (typeof formData.person.firstName != "undefined") {
        setaddrowfirst(false);
      } else {
        if (
          familyToEdit !== -1 &&
          currentData.result &&
          currentData.result[familyToEdit].PartyList &&
          currentData.result[familyToEdit].PartyList[0].firstName
        ) {
          setaddrowfirst(false);
        } else {
          setaddrowfirst(true);
        }
      }
      if (typeof formData.person.lastName != "undefined") {
        setaddrowlast(false);
      } else {
        if (
          familyToEdit !== -1 &&
          currentData.result &&
          currentData.result[familyToEdit].PartyList &&
          currentData.result[familyToEdit].PartyList[0].lastName
        ) {
          setaddrowlast(false);
        } else {
          setaddrowlast(true);
        }
      }
      if (typeof formData.person.birthDate != "undefined") {
        setaddrowbirth(false);
      } else {
        if (
          familyToEdit !== -1 &&
          currentData.result &&
          currentData.result[familyToEdit].PartyList &&
          currentData.result[familyToEdit].PartyList[0].birthDate
        ) {
          setaddrowbirth(false);
        } else {
          setaddrowbirth(true);
        }
      }
    }
    if (typeof formData.partyIdentification != "undefined") {
      if (typeof formData.partyIdentification.Nationalcode != "undefined") {
        setaddrownationalcode(false);
      } else {
        if (
          familyToEdit !== -1 &&
          currentData.result &&
          currentData.result[familyToEdit].IdentificationList &&
          currentData.result[familyToEdit].IdentificationList.Nationalcode
        ) {
          setaddrownationalcode(false);
        } else {
          setaddrownationalcode(true);
        }
      }
    }

    if (typeof formData.partyRelationship != "undefined") {
      if (
        typeof formData.partyRelationship.relationshipTypeEnumId != "undefined"
      ) {
        if (formData.partyRelationship.relationshipTypeEnumId === "Spouse") {
          setaddrowspouse(true);
        } else {
          setaddrowspouse(false);
        }

        setaddrow(false);
      } else {
        if (
          familyToEdit !== -1 &&
          currentData.result &&
          currentData.result[familyToEdit].relationship &&
          currentData.result[familyToEdit].relationship.relationshipTypeEnumId
        ) {
          setaddrow(false);
        } else {
          setaddrow(true);
        }
      }
    }
  }, [addrowfirst, addrowlast, addrowbirth, addrow, addrownationalcode]);

  useEffect(() => {
    setDisplay(false);
    setTimeout(() => {
      setDisplay(true);
    }, 20);
  }, [familyToEdit]);

  const cancelUpdate = () => {
    setsupport(false);
    setemergencycall(false);

    setStayle((preState) => ({
      relationshipTypeEnumId: false, //نسبت
      fromDate: false, //تاریخ ازدواج
      firstName: false, //نام
      lastName: false, //نام خانوادگی
      Nationalcode: false,
    }));

    setNationalCodeId((prevState) => ({
      ...prevState,
      defualtValueId: -1,
      setNationalCodeId: -1,
    }));

    setEnableDisableCreate(false);
    stenablecancel(false);
    setFamilyToEdit(-1);

    setFormData(Object.assign({}, undefined));
    setDisplay(false);
    setTimeout(() => {
      setDisplay(true);
    }, 20);
  };
  const cancelAdd = () => {
    setStayle((preState) => ({
      relationshipTypeEnumId: false, //نسبت
      fromDate: false, //تاریخ ازدواج
      firstName: false, //نام
      lastName: false, //نام خانوادگی
      Nationalcode: false,
    }));

    setFamilyToEdit(-1);
    setNationalCodeId((prevState) => ({
      ...prevState,
      defualtValueId: -1,
      setNationalCodeId: -1,
    }));

    setFormData(Object.assign({}, undefined));
    setDisplay(false);
    setTimeout(() => {
      setDisplay(true);
    }, 20);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const openDeleteModal = (id) => {
    setId(id);
    setOpen(true);
  };

  function checkPrtEmployee(index) {
    console.log(currentData.result[index].PartyList, "kkkk");

    if (
      currentData.result[index].PartyList &&
      currentData.result[index].PartyList.length
    ) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            SERVER_URL +
              "/rest/s1/fadak/entity/PartyRelationship?relationshipTypeEnumId=PrtEmployee&fromPartyId=" +
              currentData.result[index].PartyList[0].partyId,
            axiosConfig
          )
          .then((res) => {
            if (res.data.result.length) {
              res.data.result.map((item) => {
                if (item.relationshipTypeEnumId === "PrtEmployee")
                  resolve(true);
              });
              return null;
            }
            setNationalCodeId((prevState) => ({
              ...prevState,
              defualtValueId: -1,
              setNationalCodeId: -1,
            }));
          });
      });
    }
  }
  const displayUpdateForm = (index) => {
    console.log(index, "ttttt");

    const partyId = [];
    checkPrtEmployee(index).then((value) => {
      if (value === true) {
        setNationalCodeId((prevState) => ({
          ...prevState,
          defualtValueId: 1,
          setNationalCodeId: 1,
        }));
      }
    });

    const suportData = {
      partyRelationshipId:
        currentData.result[index]?.relationship.partyRelationshipId,
    };

    console.log(suportData.partyRelationshipId, "ggggg1");
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/getSupport",
        { data: suportData },
        axiosConfig
      )
      .then((res) => {
        console.log(res.data.result.emergencycall, "ggggg2");
        const supportStatus =
          res.data.result.supportedPeople == "Y" ? true : false;
        setsupport(supportStatus);
        console.log(supportStatus, "supportStatus");
        const emergencycallStatus =
          res.data.result.emergencycall == "Y" ? true : false;
        console.log(emergencycallStatus, "ggggg3");

        setemergencycall(emergencycallStatus);
      })
      .catch(() => {});

    setFamilyToEdit(index);
    setEnableDisableCreate(true);
    setFormData(Object.assign({}, undefined));
  };

  const missingcheckRelation = (field) => {
    if (typeof formData.partyRelationship != "undefined") {
      if (formData.partyRelationship[field] === "") {
        setupdaterow(true);
        return true;
      } else {
        return false;
      }
    }
  };

  const missingcheckPerson = (field) => {
    if (typeof formData.person != "undefined") {
      if (
        formData.person[field] === "" ||
        typeof formData.person[field] == "undefined"
      ) {
        setupdaterow(true);
        return true;
      } else {
        return false;
      }
    }
  };
  const missingcheckIdentification = (field) => {
    if (typeof formData.partyIdentification != "undefined") {
      if (formData.partyIdentification[field] === "") {
        setupdaterow(true);
        return true;
      } else {
        return false;
      }
    }
  };

  /**
   *
   * we call addNationalcode in addRow function
   * and added that a family member entered according to the national code
   *
   */

  function addNationalcode() {
    if (
      formData &&
      formData.partyRelationship &&
      formData.partyRelationship.relationshipTypeEnumId &&
      nationalCodeId.respondePersonFamliy &&
      nationalCodeId.respondePersonFamliy.length
    ) {
      const data = {
        relationshipTypeEnumId:
          formData.partyRelationship.relationshipTypeEnumId,
        fromPartyId: partyId,
        toPartyId: nationalCodeId.respondePersonFamliy[0].partyId,
        fromDate:
          formData.partyRelationship && formData.partyRelationship.fromDate
            ? formData.partyRelationship.fromDate
            : null,
        thruDate:
          formData.partyRelationship && formData.partyRelationship.thruDate
            ? formData.partyRelationship.thruDate
            : null,
      };
      let familyD_data = {};

      axios
        .post(
          SERVER_URL + "/rest/s1/fadak/entity/PartyRelationship",
          { data: data },
          axiosConfig
        )
        .then((res) => {
          testFunction().then((resolve) => {
            familyD_data = {
              partyRelationshipId:
                res.data.partyRelationshipId.partyRelationshipId,
              description: formData.partyNote?.noteText,
              emergencycall: emergencycallState ? "Y" : "N",
              supportedPeople: support ? "Y" : "N",
              content: resolve ?? "",
            };
            axios
              .post(
                SERVER_URL + "/rest/s1/fadak/entity/Familydetails",
                { data: familyD_data },
                axiosConfig
              )
              .then((response) => {
                getDataFormDB();
                setNationalCodeId((prevState) => ({
                  setNationalCodeId: -1,
                  defualtValueId: -1,
                }));
                dispatch(
                  setAlertContent(
                    ALERT_TYPES.SUCCESS,
                    " اطلاعات با موفقیت ثبت شد"
                  )
                );
                // currentData.result[familyToEdit].Familydetails[0] = { ...familyD_data }

                // setCurrentData(Object.assign({}, currentData))
              });
          });
        });

      return null;
    }

    setStayle({
      relationshipTypeEnumId:
        formData.partyRelationship &&
        formData.partyRelationship.relationshipTypeEnumId
          ? false
          : true, //نسبت
    });
    dispatch(
      setAlertContent(ALERT_TYPES.ERROR, "باید فیلدهای ضروری تکمیل شوند")
    );
  }

  const addRow = () => {
    const personfields = ["birthDate", "firstName", "lastName"];
    const identificationfields = ["Nationalcode"];
    const relationshipfileds = ["relationshipTypeEnumId"];
    const meridaDateChck = ["fromDate"];

    let relationmissing_fileds = [];
    let personmissing_fileds = [];
    let identificationmissing_fileds = [];
    let meridaDate_fileds = [];
    let nationalCode_fileds = [];
    // nationalCodeId.nationalCodeId.map(item => {

    //     if (formData.partyIdentification && formData.partyIdentification.Nationalcode === item.idValue) {

    //         nationalCode_fileds.push(item.idValue)

    //     }
    // })
    giveNational().then((res) => {
      res.map((item) => {
        if (
          formData?.partyIdentification?.Nationalcode.length === 10 &&
          formData.partyIdentification.Nationalcode === item.idValue
        ) {
          nationalCode_fileds.push(item.idValue);
        }
      });
    });

    personfields.map((field, index) => {
      if (
        typeof formData.person == "undefined" ||
        (formData.person &&
          (typeof formData.person[field] == "undefined" ||
            formData.person[field] === ""))
      ) {
        personmissing_fileds.push(field);
      }
    });

    identificationfields.map((field, index) => {
      if (
        typeof formData.partyIdentification == "undefined" ||
        (formData.partyIdentification &&
          (typeof formData.partyIdentification[field] == "undefined" ||
            formData.partyIdentification[field] === ""))
      ) {
        identificationmissing_fileds.push(field);
      }
    });
    relationshipfileds.map((field, index) => {
      if (
        typeof formData.partyRelationship == "undefined" ||
        (formData.partyRelationship &&
          (typeof formData.partyRelationship[field] == "undefined" ||
            formData.partyRelationship[field] === ""))
      ) {
        relationmissing_fileds.push(field);
      }
    });
    meridaDateChck.map((field, index) => {
      if (
        typeof formData.partyRelationship == "undefined" ||
        (formData.partyRelationship &&
          (typeof formData.partyRelationship[field] == "undefined" ||
            formData.partyRelationship[field] === ""))
      ) {
        meridaDate_fileds.push(field);
      }
    });

    // if ( .length > 0) {
    //     setStayle(prevState => ({
    //         ...prevState,
    //         NationalcodeId: true
    //     }))
    //     dispatch(setAlertContent(ALERT_TYPES.ERROR, ' وارده شده تکراری میباشید '));
    //     return null

    // }

    if (nationalCodeId.defualtValueId !== -1) {
      addNationalcode();
      return;
    }

    if (
      formData?.partyIdentification?.Nationalcode.length < 10 ||
      relationmissing_fileds.length > 0 ||
      identificationmissing_fileds.length > 0 ||
      personmissing_fileds.length > 0 ||
      (formData.partyRelationship &&
        formData.partyRelationship.relationshipTypeEnumId === "Spouse" &&
        meridaDate_fileds.length > 0)
    ) {
      dispatch(
        setAlertContent(ALERT_TYPES.ERROR, "باید فیلدهای ضروری تکمیل شوند")
      );

      if (
        formData.partyRelationship &&
        formData.partyRelationship.relationshipTypeEnumId === "Spouse" &&
        meridaDate_fileds.length > 0
      ) {
        setStayle({
          relationshipTypeEnumId:
            formData.partyRelationship &&
            formData.partyRelationship.relationshipTypeEnumId
              ? false
              : true, //نسبت
          fromDate:
            formData.partyRelationship &&
            formData.partyRelationship.relationshipTypeEnumId === "Spouse" &&
            !formData.partyRelationship.fromDate
              ? true
              : false, //تاریخ ازدواج
          firstName:
            formData.person && formData.person.firstName ? false : true, //نام
          lastName: formData.person && formData.person.lastName ? false : true, //نام خانوادگی
          Nationalcode:
            formData.partyIdentification &&
            formData.partyIdentification.Nationalcode
              ? false
              : true, //کدملی
          birthDate:
            formData.person && formData.person.birthDate ? false : true, //تاریخ تولد
        });

        return false;
      }

      setStayle({
        relationshipTypeEnumId:
          formData.partyRelationship &&
          formData.partyRelationship.relationshipTypeEnumId
            ? false
            : true, //نسبت
        fromDate:
          formData.partyRelationship &&
          formData.partyRelationship.relationshipTypeEnumId === "Spouse" &&
          !formData.partyRelationship.fromDate
            ? true
            : false, //تاریخ ازدواج
        firstName: formData.person && formData.person.firstName ? false : true, //نام
        lastName: formData.person && formData.person.lastName ? false : true, //نام خانوادگی
        Nationalcode:
          formData.partyIdentification &&
          formData.partyIdentification.Nationalcode
            ? false
            : true, //کدملی
        birthDate: formData.person && formData.person.birthDate ? false : true, //تاریخ تولد
      });
      if (
        formData.partyRelationship &&
        formData.partyRelationship.relationshipTypeEnumId === "Spouse"
      ) {
        setaddrowspouse(true);
      }
      return false;
    } else {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
      const contactMechObj = {};
      const post_data = {};
      let familyD_data = {};

      let dataforCurrent = {};

      if (formData.person?.Emergencycall === true) {
        formData.person.Emergencycall = "Y";
      } else {
        formData.person.Emergencycall = "N";
      }

      if (
        typeof formData.person.CountryGeoId == "undefined" ||
        formData.person.CountryGeoId === null
      ) {
        formData.person.CountryGeoId = "IRN";
      }

      const person_obj = {
        firstName: formData.person.firstName,
        lastName: formData.person.lastName,
        suffix:
          typeof formData.person.suffix != "undefined"
            ? formData.person.suffix
            : "",
        FatherName: formData.person.FatherName,
        PlaceOfBirthGeoID:
          typeof formData.person.PlaceOfBirthGeoID != "undefined"
            ? formData.person.PlaceOfBirthGeoID
            : "",
        birthDate:
          typeof formData.person.birthDate != "undefined"
            ? formData.person.birthDate
            : "",
        CountryGeoId:
          typeof formData.person.CountryGeoId != "undefined"
            ? formData.person.CountryGeoId
            : "",
        sectEnumID:
          typeof formData.person.sectEnumID != "undefined"
            ? formData.person.sectEnumID
            : "",
        residenceStatusEnumId:
          typeof formData.person.residenceStatusEnumId != "undefined"
            ? formData.person.residenceStatusEnumId
            : "",
        maritalStatusEnumId:
          typeof formData.person.maritalStatusEnumId != "undefined"
            ? formData.person.maritalStatusEnumId
            : "",
        NumberofKids:
          typeof formData.person.NumberofKids != "undefined"
            ? formData.person.NumberofKids
            : "",
        Cityplaceofissue:
          typeof formData.person.stateProvinceGeoId != "undefined"
            ? formData.person.stateProvinceGeoId
            : "",
        ReligionEnumID:
          typeof formData.person.ReligionEnumID != "undefined"
            ? formData.person.ReligionEnumID
            : "",
        baseInsuranceTypeEnumId:
          typeof formData.person.baseInsuranceTypeEnumId != "undefined"
            ? formData.person.baseInsuranceTypeEnumId
            : "",
        baseInsurancenumber:
          typeof formData.person.baseInsurancenumber != "undefined"
            ? formData.person.baseInsurancenumber
            : "",
        employmentStatusEnumId:
          typeof formData.person.employmentStatusEnumId != "undefined"
            ? formData.person.employmentStatusEnumId
            : "",
        Regionplaceofissue:
          typeof formData.person.Regionplaceofissue != "undefined"
            ? formData.person.Regionplaceofissue
            : "",
        Emergencycall:
          typeof formData.person.Emergencycall != "undefined"
            ? formData.person.Emergencycall
            : "N",
        gender:
          typeof formData.person.gender != "undefined"
            ? formData.person.gender
            : "",
        personalTitle:
          typeof formData.person.personalTitle != "undefined"
            ? formData.person.personalTitle
            : "",
        MilitaryCode:
          typeof formData.person.MilitaryCode != "undefined"
            ? formData.person.MilitaryCode
            : "",
      };
      post_data.person_obj = person_obj;

      if (formData.person && formData.person.partyClassificationId) {
        const PartyClassification_obj = {
          partyClassificationId: formData.person.partyClassificationId,
        };
        post_data.PartyClassification_obj = PartyClassification_obj;
      }
      if (formData?.person?.gender === "N") {
        const PartyClassification_obj = {
          partyClassificationId: "NotIncluded",
        };
        post_data.PartyClassification_obj = PartyClassification_obj;
      }

      if (formData.postalAddress) {
        if (
          typeof formData.postalAddress.countyGeoId == "undefined" ||
          formData.postalAddress.countyGeoId === null
        ) {
          formData.postalAddress.countyGeoId = "IRN";
        }

        const postal_obj = {
          countryGeoId: formData.postalAddress.countryGeoId,
          stateProvinceGeoId: formData.postalAddress.stateProvinceGeoId,
          countyGeoId: formData.postalAddress.countyGeoId,
          district: formData.postalAddress.district,
          street: formData.postalAddress.street,
          alley: formData.postalAddress.alley,
          plate: formData.postalAddress.plate,
          floor: formData.postalAddress.floor,
          unitNumber: formData.postalAddress.unitNumber,
          postalCode: formData.postalAddress.postalCode,
        };
        post_data.postal_obj = postal_obj;
        if (
          typeof formData.postalAddress.areaCode != "undefined" ||
          typeof formData.postalAddress.contactNumber != "undefined"
        ) {
          const telecom_obj = {
            areaCode: formData.postalAddress.areaCode,
            contactNumber: formData.postalAddress.contactNumber,
          };
          post_data.telecom_obj = telecom_obj;
        }
        const partyContactMech_obj = {
          contactMechPurposeId: "PostalHome",
        };
        post_data.partyContactMech_obj = partyContactMech_obj;
      }
      //sarmadi
      if (formData.partyNote != "undefined") {
        const partyNote_obj = {
          noteText: formData.partyNote?.noteText,
        };
        // Emergencycall: (typeof formData.person.Emergencycall != 'undefined') ? (formData.person.Emergencycall) : "N",
        post_data.partyNote_obj = "";
      }

      if (typeof formData.partyIdentification != "undefined") {
        if (typeof formData.partyIdentification.idNumber != "undefined") {
          const idNumber = {
            idValue: formData.partyIdentification.idNumber,
            partyIdTypeEnumId: "idNumber",
          };
          post_data.idNumber = idNumber;
        }
        if (typeof formData.partyIdentification.serialnumber != "undefined") {
          const serialnumber = {
            idValue: formData.partyIdentification.serialnumber,
            partyIdTypeEnumId: "serialnumber",
          };
          post_data.serialnumber = serialnumber;
        }
        if (typeof formData.partyIdentification.Nationalcode != "undefined") {
          const Nationalcode = {
            idValue: formData.partyIdentification.Nationalcode,
            partyIdTypeEnumId: "Nationalcode",
          };
          post_data.Nationalcode = Nationalcode;
        }
      }
      if (typeof formData.PartyQualification != "undefined") {
        const partyQualification_obj = {
          fieldEnumId: formData.PartyQualification.fieldEnumId,
          qualificationTypeEnumId:
            formData.PartyQualification.qualificationTypeEnumId,
        };
        post_data.partyQualification_obj = partyQualification_obj;
      }
      const partyRelationship_obj = {
        fromPartyId: partyId,
        relationshipTypeEnumId:
          formData.partyRelationship.relationshipTypeEnumId,
        fromDate:
          typeof formData.partyRelationship.fromDate != "undefined"
            ? formData.partyRelationship.fromDate
            : null,
        thruDate:
          typeof formData.partyRelationship.thruDate != "undefined"
            ? formData.partyRelationship.thruDate
            : null,
      };
      post_data.partyRelationship_obj = partyRelationship_obj;

      axios
        .post(SERVER_URL + "/rest/s1/fadak/familyInfo", post_data, configPost)
        .then((resrel) => {
          testFunction().then((resolve) => {
            familyD_data = {
              partyRelationshipId: resrel.data.result.partyRelationshipId,
              description: formData.partyNote?.noteText,
              emergencycall: emergencycallState ? "Y" : "N",
              supportedPeople: support ? "Y" : "N",
              // emergencycall: formData.person?.Emergencycall,
              content: resolve ?? "",
            };

            axios
              .post(
                SERVER_URL + "/rest/s1/fadak/entity/Familydetails",
                { data: familyD_data },
                configPost
              )
              .then((response) => {
                dispatch(
                  setAlertContent(
                    ALERT_TYPES.SUCCESS,
                    "اطلاعات با موفقیت ثبت شد"
                  )
                );
                getDataFormDB();

                // currentData.result.push(dataforCurrent)

                // setCurrentData(Object.assign({}, currentData))
                setFormData({});
                setFamilyToEdit(-1);
              });
          });
        });
    }
  };

  const testFunction = () => {
    return new Promise((resolve, reject) => {
      if (formData.partyContent) {
        const fileUrl = new FormData();
        fileUrl.append("file", formData.partyContent.contentLocation);
        axios
          .post(
            SERVER_URL + "/rest/s1/fadak/getpersonnelfile/",
            fileUrl,
            configPost
          )
          .then((resUploadFile) => {
            resolve(resUploadFile.data.name);
          });
      } else {
        resolve("");
      }
    });
  };

  // const updateRow=()=>{
  //     const partyClassification={
  //     partyId:partyId,
  //     partyClassificationId:formData.person?.partyClassificationId

  // }
  // console.log(partyClassification,"ffff")

  //                         axios.post(SERVER_URL + "/rest/s1/fadak/saveLastPartyClassification", {data: partyClassification }, axiosConfig).then(responsePty => {
  //                             console.log("resoinseptyclas", responsePty)

  //                             dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ... به روزرسانی شد'));
  //                         })
  // }
  useEffect(() => {
    // axios.get(SERVER_URL + "/rest/s1/questionnaire/getTypeAssessmentLearning", {
    //     headers: { 'api_key': localStorage.getItem('api_key') }
    // }).then(res => {

    //     setAsesmentType(res.data.typeAssessment)
    //     setAssesmentTitle(res.data.titleAssessment)
    // }).catch(() => {
    // });
    console.log(emergencycallState, "jjjj");
    console.log(support, "jjjj1");
  }, [emergencycallState, support]);

  const updateRow = () => {
    //edit by sarmadi
    console.log("rrr1", formData);

    const personfields = ["birthDate", "firstName", "lastName"];
    const identificationfields = ["Nationalcode"];
    const relationshipfileds = ["relationshipTypeEnumId"];

    let relationmissing_fileds = [];
    let personmissing_fileds = [];
    let identificationmissing_fileds = [];
    let nationalCode_fileds = [];

    if (nationalCode_fileds.length > 0) {
      setStayle((prevState) => ({
        ...prevState,
        NationalcodeId: true,
      }));
      dispatch(
        setAlertContent(ALERT_TYPES.ERROR, "کد ملی وارده شده تکراری میباشید ")
      );
      return null;
    }

    if (
      formData.partyRelationship &&
      formData.partyRelationship.fromDate === ""
    ) {
      setStayle({
        relationshipTypeEnumId:
          formData.partyRelationship &&
          formData.partyRelationship.relationshipTypeEnumId === ""
            ? true
            : false, //نسبت
        fromDate:
          formData.partyRelationship &&
          formData.partyRelationship.fromDate === ""
            ? true
            : false, //تاریخ ازدواج
        firstName:
          formData.person && formData.person.firstName === "" ? true : false, //نام
        lastName:
          formData.person && formData.person.lastName === "" ? true : false, //نام خانوادگی
        Nationalcode:
          formData.partyIdentification &&
          formData.partyIdentification.Nationalcode === ""
            ? true
            : false, //کدملی
        birthDate:
          formData.person && formData.person.birthDate === "" ? true : false, //تاریخ تولد
      });
      dispatch(
        setAlertContent(
          ALERT_TYPES.ERROR,
          "باید فیلدهای ضروری تاریخ تکمیل شوند"
        )
      );
      return null;
    }

    personfields.map((field, index) => {
      let ifFilled =
        (formData.person &&
          typeof formData.person[field] != "undefined" &&
          formData.person[field].trim() !== "") ||
        typeof formData.person == "undefined" ||
        (formData.person && typeof formData.person[field] == "undefined") ||
        (formData.person &&
          typeof formData.person[field] != "undefined" &&
          formData.person[field].trim() !== "")
          ? true
          : false;
      if (!ifFilled) {
        personmissing_fileds.push(field);
      }
    });

    identificationfields.map((field, index) => {
      let ifFilled =
        (formData.partyIdentification &&
          typeof formData.partyIdentification[field] != "undefined" &&
          formData.partyIdentification[field].trim() !== "") ||
        typeof formData.partyIdentification == "undefined" ||
        (formData.partyIdentification &&
          typeof formData.partyIdentification[field] == "undefined") ||
        (formData.partyIdentification &&
          typeof formData.partyIdentification[field] != "undefined" &&
          formData.partyIdentification[field].trim() !== "")
          ? true
          : false;
      if (!ifFilled) {
        identificationmissing_fileds.push(field);
      }
    });
    relationshipfileds.map((field, index) => {
      let ifFilled =
        (formData.partyRelationship &&
          typeof formData.partyRelationship[field] != "undefined" &&
          formData.partyRelationship[field].trim() !== "") ||
        typeof formData.partyRelationship == "undefined" ||
        (formData.partyRelationship &&
          typeof formData.partyRelationship[field] == "undefined") ||
        (formData.partyRelationship &&
          typeof formData.partyRelationship[field] != "undefined" &&
          formData.partyRelationship[field].trim() !== "")
          ? true
          : false;
      if (!ifFilled) {
        relationmissing_fileds.push(field);
      }
    });

    if (
      relationmissing_fileds.length > 0 ||
      identificationmissing_fileds.length > 0 ||
      personmissing_fileds.length > 0
    ) {
      setStayle({
        relationshipTypeEnumId:
          formData.partyRelationship &&
          formData.partyRelationship.relationshipTypeEnumId === ""
            ? true
            : false, //نسبت
        fromDate:
          formData.partyRelationship &&
          formData.partyRelationship.relationshipTypeEnumId === "Spouse" &&
          formData.partyRelationship.fromDate === ""
            ? true
            : false, //تاریخ ازدواج
        firstName:
          formData.person && formData.person.firstName === "" ? true : false, //نام
        lastName:
          formData.person && formData.person.lastName === "" ? true : false, //نام خانوادگی
        Nationalcode:
          formData.partyIdentification &&
          formData.partyIdentification.Nationalcode === ""
            ? true
            : false, //کدملی
        birthDate:
          formData.person && formData.person.birthDate === "" ? true : false, //تاریخ تولد
      });

      dispatch(
        setAlertContent(ALERT_TYPES.ERROR, "باید فیلدهای ضروری تکمیل شوند")
      );
      // setaddrow(true)
      return false;
    } else {
      if (
        !formData.person &&
        !formData.partyIdentification &&
        !formData.partyRelationship &&
        !formData.postalAddress &&
        !formData.partyNote &&
        !formData.partyContent &&
        !formData.PartyQualification
      ) {
        setEnableDisableCreate(false);
        stenablecancel(false);
        setFamilyToEdit(-1);
      } else {
        let ddd = {};
        let dd = {};
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "اطلاعات در حال  به روز رسانی است"
          )
        );

        {
          const post_data = {};
          let person_obj = {
            partyId: currentData.result[familyToEdit].PartyList[0].partyId,
          };

          if (
            currentData.result[familyToEdit] &&
            currentData.result[familyToEdit].PartyList &&
            formData &&
            formData.person
          ) {
            if (typeof formData.person != "undefined") {
              if (typeof formData.person.Emergencycall != "undefined") {
                if (formData.person.Emergencycall === true) {
                  formData.person.Emergencycall = "Y";
                } else {
                  formData.person.Emergencycall = "N";
                }
              }
            }

            let listOfPerson = [
              "firstName",
              "lastName",
              "suffix",
              "FatherName",
              "PlaceOfBirthGeoID",
              "birthDate",
              "CountryGeoId",
              "sectEnumID",
              "residenceStatusEnumId",
              "maritalStatusEnumId",
              "maritalStatusEnumId",
              "NumberofKids",
              "stateProvinceGeoId",
              "ReligionEnumID",
              "baseInsuranceTypeEnumId",
              "baseInsurancenumber",
              "employmentStatusEnumId",
              "Regionplaceofissue",
              "Emergencycall",
              "gender",
              "personalTitle",
              "MilitaryCode",
            ];

            for (let ele in listOfPerson) {
              let item = listOfPerson[ele];
              person_obj = {
                ...person_obj,
                [item]:
                  formData.person[item] || formData.person[item] == ""
                    ? formData.person[item]
                    : currentData.result[familyToEdit].PartyList[0][item],
              };
            }
          }

          post_data.person_obj = person_obj;

          if (formData.person?.partyClassificationId) {
            const PartyClassification_obj = {
              partyClassificationId: formData.person.partyClassificationId,
            };
            post_data.PartyClassification_obj = PartyClassification_obj;
          }

          if (formData?.person?.gender === "N") {
            const PartyClassification_obj = {
              partyClassificationId: "NotIncluded",
            };
            post_data.PartyClassification_obj = PartyClassification_obj;
          }

          if (typeof formData.postalAddress != "undefined") {
            const postal_obj = {
              contactMechId:
                currentData.result[familyToEdit]?.postaltelecomList?.[0]
                  ?.contactMechId ?? null,
              telecomContactMechId:
                currentData.result[familyToEdit]?.postaltelecomList?.[0]
                  ?.telecomContactMechId ?? null,
              countryGeoId: formData.postalAddress.countryGeoId,
              stateProvinceGeoId: formData.postalAddress.stateProvinceGeoId,
              countyGeoId: formData.postalAddress.countyGeoId,
              district: formData.postalAddress.district,
              street: formData.postalAddress.street,
              alley: formData.postalAddress.alley,
              plate: formData.postalAddress.plate,
              floor: formData.postalAddress.floor,
              unitNumber: formData.postalAddress.unitNumber,
              postalCode: formData.postalAddress.postalCode,
              contactMechPurposeId: "PostalHome",
            };
            post_data.postal_obj = postal_obj;
            if (
              typeof formData.postalAddress.areaCode != "undefined" ||
              typeof formData.postalAddress.contactNumber != "undefined"
            ) {
              const telecom_obj = {
                contactMechId:
                  currentData.result?.[familyToEdit]?.postaltelecomList[0]
                    ?.telecomContactMechId ?? null,
                areaCode: formData.postalAddress.areaCode,
                contactNumber: formData.postalAddress.contactNumber,
              };
              post_data.telecom_obj = telecom_obj;
            }

            const partyContactMech_obj = {
              contactMechPurposeId: "PostalHome",
              fromDate:
                currentData.result &&
                currentData.result[familyToEdit].postaltelecomList &&
                currentData.result[familyToEdit].postaltelecomList[0]
                  ? currentData.result[familyToEdit].postaltelecomList[0]
                      .fromDate
                  : null,

              contactMechId:
                currentData.result?.[familyToEdit]?.postaltelecomList?.[0]
                  ?.contactMechId ?? null,
            };
            post_data.partyContactMech_obj = partyContactMech_obj;
          }
          if (typeof formData.partyNote != "undefined") {
            const partyNote_obj = {
              noteText: formData.partyNote.noteText,
            };
            post_data.partyNote_obj = partyNote_obj;
          }
          if (typeof formData.partyIdentification != "undefined") {
            if (typeof formData.partyIdentification.idNumber != "undefined") {
              const idNumber = {
                idValue: formData.partyIdentification.idNumber,
                partyIdTypeEnumId: "idNumber",
              };
              post_data.idNumber = idNumber;
            }
            if (
              typeof formData.partyIdentification.serialnumber != "undefined"
            ) {
              const serialnumber = {
                idValue: formData.partyIdentification.serialnumber,
                partyIdTypeEnumId: "serialnumber",
              };
              post_data.serialnumber = serialnumber;
            }
            if (
              typeof formData.partyIdentification.Nationalcode != "undefined"
            ) {
              const Nationalcode = {
                idValue: formData.partyIdentification.Nationalcode,
                partyIdTypeEnumId: "Nationalcode",
              };
              post_data.Nationalcode = Nationalcode;
            }
          }
          if (typeof formData.PartyQualification != "undefined") {
            let items =
              currentData?.result?.[familyToEdit]?.PartyQualificationList
                .length - 1;

            const partyQualification_obj = {
              fieldEnumId:
                formData.PartyQualification.fieldEnumId ??
                currentData.result[familyToEdit].PartyQualificationList?.[items]
                  ?.fieldEnumId ??
                null,
              partyId:
                currentData?.result?.[familyToEdit]?.PartyList?.[0]?.partyId ??
                null,
              fromDate:
                currentData?.result?.[familyToEdit]?.PartyQualificationList?.[
                  items
                ]?.fromDate ?? null,
              qualificationTypeEnumId:
                formData.PartyQualification.qualificationTypeEnumId ??
                currentData?.result?.[familyToEdit]?.PartyQualificationList?.[
                  items
                ]?.qualificationTypeEnumId ??
                null,
            };
            post_data.partyQualification_obj =
              partyQualification_obj?.qualificationTypeEnumId
                ? partyQualification_obj
                : null;
          }
          if (
            currentData?.result?.[familyToEdit]?.relationship &&
            formData.partyRelationship
          ) {
            const partyRelationship_obj = {
              partyRelationshipId:
                currentData.result[familyToEdit].relationship
                  .partyRelationshipId,
              fromPartyId:
                currentData.result[familyToEdit].relationship.fromPartyId,
              // relationshipTypeEnumId: (formData.partyRelationship.relationshipTypeEnumId) ? formData.partyRelationship.relationshipTypeEnumId : currentData.result[familyToEdit].relationship.relationshipTypeEnumId,
              fromDate: formData.partyRelationship.fromDate
                ? formData.partyRelationship.fromDate
                : currentData.result[familyToEdit].relationship.fromDate,

              thruDate: formData.partyRelationship.thruDate
                ? formData.partyRelationship.thruDate
                : currentData.result[familyToEdit].relationship.thruDate,
            };

            if (formData?.partyRelationship?.relationshipTypeEnumId)
              partyRelationship_obj["relationshipTypeEnumId"] =
                formData?.partyRelationship?.relationshipTypeEnumId;
            post_data.partyRelationship_obj = partyRelationship_obj;
          }

          const item =
            currentData?.result[familyToEdit]?.PartyList[
              currentData.result[familyToEdit]?.PartyList?.length - 1
            ];
          var partyId =
            currentData?.result?.[familyToEdit]?.PartyList?.[0]?.partyId;
          const start = Date.now();

          const partyClassification = {
            partyId: partyId,
            partyClassificationId: formData.person?.partyClassificationId,
          };

          axios
            .post(
              SERVER_URL + "/rest/s1/fadak/saveLastPartyClassification",
              { data: partyClassification },
              axiosConfig
            )
            .then((responsePty) => {
              console.log("resoinseptyclas", responsePty);

              // dispatch(setAlertContent(ALERT_TYPES.SUCCESS, 'اطلاعات با موفقیت ... به روزرسانی شد'));
            });

          axios
            .post(
              SERVER_URL + "/rest/s1/fadak/familyInfo",
              post_data,
              configPost
            )
            .then((resrel) => {
              let fromDate =
                currentData?.result?.[familyToEdit]?.PartyQualificationList?.[0]
                  ?.fromDate;
              let qualificationTypeEnumId =
                currentData?.result?.[familyToEdit]?.PartyQualificationList?.[0]
                  ?.qualificationTypeEnumId;

              !post_data.partyQualification_obj &&
                axios
                  .delete(
                    SERVER_URL +
                      `/rest/s1/fadak/entity/PartyQualification?partyId=${partyId}&fromDate=${fromDate}&qualificationTypeEnumId=${qualificationTypeEnumId}`,
                    configPost
                  )
                  .then((res) => {});

              let familyD_data = {};

              if (resrel.data.result.postalContactMechId) {
                let dataForPut = {
                  contactMechId: resrel.data.result.postalContactMechId,
                  contactMechTypeEnumId: "CmtPostalAddress",
                };
                axios.put(
                  SERVER_URL + `/rest/s1/fadak/entity/ContactMech`,
                  { data: dataForPut },
                  axiosConfig
                );
              }
              if (resrel.data.result.telecomContactMechId) {
                let dataForPut = {
                  contactMechId: resrel.data.result.telecomContactMechId,
                  contactMechTypeEnumId: "CmtTelecomNumber",
                };
                axios.put(
                  SERVER_URL + `/rest/s1/fadak/entity/ContactMech`,
                  { data: dataForPut },
                  axiosConfig
                );
              }

              testFunction().then((resolve) => {
                familyD_data = {
                  partyRelationshipId:
                    currentData?.result?.[familyToEdit]?.Familydetails?.[0]
                      ?.partyRelationshipId,
                  description:
                    formData.partyNote?.noteText ??
                    currentData?.result?.[familyToEdit]?.Familydetails?.[0]
                      ?.description,
                  emergencycall: emergencycallState ? "Y" : "N",
                  supportedPeople: support ? "Y" : "N",
                  // emergencycall:
                  //   formData.person?.Emergencycall ??
                  //   currentData?.result?.[familyToEdit]?.Familydetails?.[0]
                  //     ?.emergencycall,
                  content:
                    resolve !== ""
                      ? resolve
                      : currentData?.result?.[familyToEdit]?.Familydetails?.[0]
                          ?.content,
                };
                axios
                  .put(
                    SERVER_URL + "/rest/s1/fadak/entity/Familydetails",
                    { data: familyD_data },
                    configPost
                  )
                  .then((response) => {
                    currentData.result[familyToEdit].Familydetails[0] = {
                      ...familyD_data,
                    };

                    setCurrentData(Object.assign({}, currentData));
                  });
              });
              dispatch(
                setAlertContent(
                  ALERT_TYPES.SUCCESS,
                  "اطلاعات با موفقیت  ثبت شد"
                )
              );

              post_data.partyRelationship_obj = undefined;

              setFormData({});
              setCurrentData(Object.assign({}, currentData));
              getDataFormDB();
            })
            .catch((res) => {
              if (formData?.person?.gender === "N") {
                const PartyClassification_obj = {
                  partyClassificationId: "NotIncluded",
                };
                post_data.PartyClassification_obj = PartyClassification_obj;
              }
            });

          if (
            formData.postalAddress &&
            currentData.result[familyToEdit] &&
            currentData.result[familyToEdit].postaltelecomList
          ) {
            if (formData.postalAddress.contactNumber) {
              currentData.result[
                familyToEdit
              ].postaltelecomList[0].contactNumber =
                formData?.postalAddress?.contactNumber;
            } else if (formData.postalAddress?.contactNumber) {
              currentData.result[
                familyToEdit
              ].postaltelecomList[0].contactNumber = "";
            }
          }
        }
      }
      setFamilyToEdit(-1);
      setEnableDisableCreate(false);
    }

    let data = {
      // supportedPeople: formData.suportValue.suportValue,
      supportedPeople: support ? "Y" : "N",
      emergencycall: emergencycallState ? "Y" : "N",
      partyRelationshipId:
        currentData.result[familyToEdit].relationship.partyRelationshipId,
    };

    console.log(data, "oooo");
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/saveFamilyDetail",
        { data: data },
        axiosConfig
      )
      .then(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ذخیره شد")
        );

        setsupport(false);
        setemergencycall(false);
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
      });
  };

  const setNationalCode = (res) => {
    let itemValue = [];
    let postalHome = [];
    let idNumber = [];
    let serialnumber = [];
    let Nationalcode = [];

    if (nationalCodeId && formData.partyIdentification) {
      res.map((item, index) => {
        if (item.idValue === formData.partyIdentification.Nationalcode) {
          itemValue.push(item);
        }
      });

      const partyIdValue = itemValue[0].partyId;

      axios
        .post(
          SERVER_URL + "/rest/s1/fadak/familyInfo/PersonFamilyData",
          { partyId: partyIdValue },
          axiosConfig
        )
        .then((respondePersonFamliy) => {
          axios
            .get(
              SERVER_URL + "/rest/s1/fadak/getvaluespostal/" + partyIdValue,
              axiosConfig
            )
            .then((respondeAdress) => {
              respondeAdress.data.postalList.map((item, index) => {
                if (item.contactMechPurposeId === "PostalHome") {
                  postalHome.push(item);
                }
              });
              axios
                .get(
                  SERVER_URL +
                    "/rest/s1/fadak/entity/PartyIdentification?partyId=" +
                    partyIdValue,
                  axiosConfig
                )
                .then((responsePartyIn) => {
                  responsePartyIn.data.result.map((item, index) => {
                    if (item.partyIdTypeEnumId === "idNumber") {
                      idNumber.push(item);
                    }
                    if (item.partyIdTypeEnumId === "serialnumber") {
                      serialnumber.push(item);
                    }
                    if (item.partyIdTypeEnumId === "Nationalcode") {
                      Nationalcode.push(item);
                    }
                  });
                  setNationalCodeId((prevState) => ({
                    ...nationalCodeId,
                    defualtValueId: 1,
                    nationalCodeStatus: false,
                    postalHomeData: postalHome,
                    serialnumber: serialnumber,
                    Nationalcode: Nationalcode,
                    idNumber: idNumber,
                    respondePersonFamliy:
                      respondePersonFamliy.data.outPut.value,
                  }));
                });

              setDisplay(false);
              setTimeout(() => {
                setDisplay(true);
              }, 20);
            });
          // })
        });
    }
  };

  const giveNational = () => {
    return new Promise((resolve, reject) => {
      if (
        formData?.partyIdentification?.Nationalcode &&
        formData.partyIdentification.Nationalcode.length === 10
      ) {
        axios
          .get(
            SERVER_URL +
              "/rest/s1/fadak/entity/PartyIdentification?idValue=" +
              formData.partyIdentification.Nationalcode,
            axiosConfig
          )
          .then((res) => {
            return resolve(res.data.result);
          });
      } else {
        resolve([]);
      }
    });
  };
  const [suportValue, setSuportvaue] = React.useState("N");
  const [emergencycallValue, setEmergencycallValue] = React.useState("N");

  const chengeIcon = () => {
    setsupport(false);
    setSuportvaue("N");
  };

  const chengeIcon1 = () => {
    setsupport(true);
    setSuportvaue("Y");
  };
  const chengeIconE = () => {
    setemergencycall(false);
    setEmergencycallValue("N");
  };
  const chengeIconE1 = () => {
    setemergencycall(true);
    setEmergencycallValue("Y");
  };
  return (
    <Grid>
      <Card>
        <CardContent>
          <Grid
            className={
              nationalCodeId.nationalCodeStatus
                ? classes.spiner
                : classes.spiner2
            }
          >
            <CircularProgress style={{ color: "black" }} />
            <p className={classes.divTest}> درحال دریافت اطلاعات ....</p>
          </Grid>
        </CardContent>
      </Card>

      {data && display && (
        <FamilyForm
          addFormData={addFormData}
          setFormData={setFormData}
          formData={formData}
          cancelAdd={cancelAdd}
          chengeIcon={chengeIcon}
          chengeIcon1={chengeIcon1}
          suportValue={suportValue}
          emergencycallState={emergencycallState}
          chengeIconE={chengeIconE}
          chengeIconE1={chengeIconE1}
          setaddrownationalcode={setaddrownationalcode}
          setaddrowfirst={setaddrowfirst}
          setNationalCode={setNationalCode}
          setaddrowlast={setaddrowlast}
          setStayle={setStayle}
          style={style}
          setaddrowbirth={setaddrowbirth}
          setaddrow={setaddrow}
          addrowfirst={addrowfirst}
          addrownationalcode={addrownationalcode}
          support={support}
          addrowbirth={addrowbirth}
          addrowlast={addrowlast}
          setDisplay={setDisplay}
          nationalCodeIdStatus={nationalCodeId}
          setNationalCodeId={setNationalCodeId}
          giveNational={giveNational}
          setupdaterow={setupdaterow}
          updaterow={updaterow}
          data={data}
          tableContent={tableContent}
          setTableContent={setTableContent}
          setOpen={setOpen}
          setId={setId}
          idDelete={idDelete}
          open={open}
          handleClose={handleClose}
          enableDisableCreate={enableDisableCreate}
          countryGeoId={countryGeoId}
          currentData={currentData}
          missingcheckRelation={missingcheckRelation}
          updateRow={updateRow}
          addRow={addRow}
          enablecancel={enablecancel}
          cancelUpdate={cancelUpdate}
          setCurrentData={setCurrentData}
          addrowspouse={addrowspouse}
          setaddrowspouse={setaddrowspouse}
          display={display}
          addrow={addrow}
          missingcheckIdentification={missingcheckIdentification}
          familyToEdit={familyToEdit}
          getFile={getFile}
          missingcheckPerson={missingcheckPerson}
        />
      )}
    </Grid>
  );
};

export default Family;
