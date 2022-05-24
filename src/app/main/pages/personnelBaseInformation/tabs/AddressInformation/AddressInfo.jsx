import React from "react";
import { setFormDataHelper } from "../../../../helpers/setFormDataHelper";
import AddressInfoForm from "./AddressInfoForm";
import { Button, Grid, Paper } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AXIOS_TIMEOUT, SERVER_URL } from "../../../../../../configs";
import { DeleteOutlined } from "@material-ui/icons";
import {
  ALERT_TYPES,
  setAlertContent,
  submitPost,
} from "../../../../../store/actions/fadak";
import checkPermis from "../../../../components/CheckPermision";

const AddressInfo = (props) => {
  const datas = useSelector(({ fadak }) => fadak);
  console.log("propstest", props);
  const [addRows, setAddRows] = React.useState({
    postalAddress: 1,
    telecom: 1,
  });

  const confg = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  let { CmtOrgPostalAddress } = props;
  console.log("vasdvajvav", CmtOrgPostalAddress);

  const [tableContent, setTableContent] = React.useState([]);
  const [enableDisableCreate, setEnableDisableCreate] = React.useState(false);
  const [activeStep, setactiveStep] = React.useState(false);
  const [addressToEdit, setaddressToEdit] = React.useState(-1);
  const [partyIdsets, setpartyIdsets] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [currentData, setCurrentData] = React.useState({});
  const [data, setData] = React.useState(false);
  const addFormData = setFormDataHelper(setFormData);
  const [open, setOpen] = React.useState(false);
  const [idDelete, setId] = React.useState([]);
  const [contactMechId, setcontactMechId] = React.useState([]);
  const [telecomcontactMechId, settelecomcontactMechId] = React.useState([]);
  const [display, setdisplay] = React.useState(false);
  const [display1, setdisplay1] = React.useState(true);
  const dispatch = useDispatch();
  const [missingpostal, setmissingpostal] = React.useState([]);

  const [style, setStyle] = React.useState({
    contactMechPurposeId: false,
    countryGeoId: false,
    stateProvinceGeoId: false,
    street: false,
    plate: false,
    postalCode: false,
  });

  const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
  const partyIdUser = useSelector(
    ({ fadak }) => fadak.baseInformationInisial.user
  );

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  // const partyId ;
  const partyRelationshipId = useSelector(
    ({ auth }) => auth.user.data.partyRelationshipId
  );
  const [partyIdOrg, setpartyIdOrg] = React.useState(false);
  const partyIdLoginPerson = partyIdUser !== null ? partyIdUser : partyIdLogin;
  let partyId;
  if (props.partyIdOrg === null) {
    partyId = partyIdLoginPerson;
  }
  if (props.partyIdOrg !== null) {
    partyId = props.partyIdOrg;
  }
  console.log("vavavavav", formData);

  React.useEffect(() => {
    let rows = [];

    if (currentData && data) {
      if (typeof currentData != "undefined" && currentData.postalList) {
        currentData.postalList.map((pa, index) => {
          if (pa.contactMechPurposeId === "PostalHome") {
            setactiveStep(true);
          }
        });

        currentData.postalList.map((pa, index) => {
          console.log("advavavavavavvavadv", pa);
          let stateContactMEchPurposeId = {};

          data.postalAddress.map((item, index) => {
            if (item.contactMechPurposeId === pa.contactMechPurposeId) {
              stateContactMEchPurposeId = {
                contactMechPurposeId: item.description,
              };
              pa.contactMechPurposeId = item.description;
            }
          });

          let d = {
            countryGeoId: pa.countryGeoId,
            countyGeoId: pa.countyGeoId,
            stateProvinceGeoId: pa.stateProvinceGeoId,
            district: pa.district,
            street: pa.street,
            alley: pa.alley,
            plate: pa.plate,
            unitNumber: pa.unitNumber,
            floor: pa.floor,
            postalCode: pa.postalCode,
          };

          data.data.geos.GEOT_COUNTRY.map((addressList1, index) => {
            if (typeof d.countryGeoId != "undefined") {
              if (addressList1.geoId === d.countryGeoId) {
                d.countryGeoId = addressList1.geoName;
                d.countryGeoId = d.countryGeoId + ",";
              }
            } else {
              d.countryGeoId = "";
            }
          });
          data.data.geos.GEOT_COUNTY.map((addressList2, index) => {
            if (typeof d.countyGeoId != "undefined") {
              if (addressList2.geoId === d.countyGeoId) {
                d.countyGeoId = addressList2.geoName;
                d.countyGeoId = d.countyGeoId + ",";
              }
            } else {
              d.countyGeoId = "";
            }
          });
          data.data.geos.GEOT_PROVINCE.map((stateProvinceGeoIdList, index) => {
            if (typeof d.stateProvinceGeoId != "undefined") {
              if (stateProvinceGeoIdList.geoId === d.stateProvinceGeoId) {
                d.stateProvinceGeoId = stateProvinceGeoIdList.geoName;
                d.stateProvinceGeoId = d.stateProvinceGeoId + ",";
              }
            } else {
              d.stateProvinceGeoId = "";
            }
          });

          let dataStr = {
            district: d?.district ? `محله  ${d?.district ?? ""} , ` : "",
            street: d?.street ? `  خیابان  ${d?.street ?? ""} , ` : "",
            alley: d?.alley ? ` کوچه   ${d?.alley ?? ""} , ` : "",
            plate: d?.plate ? `پلاک    ${d?.plate ?? ""} , ` : "",
            floor: d?.floor ? `طبقه  ${d?.floor ?? ""} , ` : "",
            unitNumber: d?.unitNumber ? ` واحد  ${d?.unitNumber ?? ""} , ` : "",
            postalCode: d?.postalCode
              ? `کد پستی   ${d?.postalCode ?? ""} ,  `
              : "",
          };

          var lastDataStr = Object.keys(dataStr);
          var lastobj = lastDataStr[lastDataStr.length - 1];

          d = {
            ...d,
            ...dataStr,
            [lastobj]: dataStr[lastDataStr[lastDataStr.length - 1]].replace(
              ",",
              ""
            ),
          };

          let telephone;
          if (typeof pa.areaCode == "undefined") {
            if (typeof pa.contactNumber != "undefined") {
              telephone = pa.contactNumber;
            }
          } else if (typeof pa.areaCode != "undefined") {
            if (typeof pa.contactNumber != "undefined") {
              telephone = pa.areaCode + "-" + pa.contactNumber;
            }
          }
          setdisplay(true);

          let row1 = {
            // id: pa.contactMechId,
            id: index,
            contactMechPurposeId: pa.contactMechPurposeId,
            address:
              "" +
              d.countryGeoId +
              " " +
              d.stateProvinceGeoId +
              " " +
              d.countyGeoId +
              "" +
              d.district +
              " " +
              "" +
              "  " +
              d.street +
              " " +
              "" +
              "  " +
              d.alley +
              " " +
              "" +
              "  " +
              d.plate +
              " " +
              "" +
              " " +
              d.floor +
              " " +
              "" +
              "  " +
              d.unitNumber +
              " " +
              "" +
              " " +
              d.postalCode +
              " ",

            contactNumber: telephone,
            // delete: (
            //   <Button
            //     variant="outlined"
            //     color="secondary"
            //     onClick={() => openDeleteModal(index)}
            //   >
            //     <DeleteOutlined />
            //   </Button>
            // ),
            // modify: (
            //   <Button
            //     variant="outlined"
            //     color="secondary"
            //     onClick={() => displayUpdateForm(index)}
            //   >
            //     ویرایش
            //   </Button>
            // )
          };
          if (
            checkPermis(
              "reports/personnelReport/addressReport/address/delete",
              datas
            )
          ) {
            row1.delete = (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => openDeleteModal(index)}
              >
                <DeleteOutlined />
              </Button>
            );
          }
          if (
            checkPermis(
              "reports/personnelReport/addressReport/address/edit",
              datas
            )
          ) {
            row1.modify = (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => displayUpdateForm(index)}
              >
                ویرایش
              </Button>
            );
          }

          rows.push(row1);
          d = undefined;
        });
        setTableContent(rows);

        setdisplay1(false);
        setTimeout(() => {
          setdisplay1(true);
        }, 20);
      }
    }
  }, [currentData, data]);

  /**
   *
   * requset get data
   *
   */
  React.useEffect(() => {
    getData();
  }, [partyId]);

  React.useEffect(() => {
    const axiosConfig = {
      headers: {
        api_key: localStorage.getItem("api_key"),
      },
    };

    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?" +
          "geoTypeList=GEOT_COUNTY,GEOT_COUNTRY,GEOT_PROVINCE" +
          "&typeAddressList=CmtPostalAddress",
        axiosConfig
      )
      .then((response) => {
        axios
          .get(
            SERVER_URL +
              "/rest/s1/fadak/gettypeAddressrest?inValue=" +
              props.CmtOrgPostalAddress,
            axiosConfig
          )
          .then((response1) => {
            setData({
              postalAddress: response1.data.typeAddressList,
              data: response.data,
            });
          });
      });
  }, [partyId]);

  /**
   *
   * requset get data
   *
   */

  React.useEffect(() => {
    setdisplay(false);
    setTimeout(() => {
      setdisplay(true);
    }, 20);
  }, [addressToEdit]);
  React.useEffect(() => {
    setpartyIdsets(partyId);
    setdisplay(false);
    setTimeout(() => {
      setdisplay(true);
    }, 20);
  }, [partyIdsets]);

  React.useEffect(() => {}, [partyIdOrg]);

  React.useEffect(() => {
    const data_types = ["postalAddress", "telecom"];
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
        }, 2000);
      }
    });
    if (is_updating === false) {
    }
  }, [addRows]);

  const getData = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getrelationOrganization?partyRelationshipId=" +
          partyRelationshipId,
        confg
      )
      .then((responseGetOrg) => {
        console.log("valvalkvav", responseGetOrg);
        if (responseGetOrg.data.orgPartyRelationResult) {
          if (responseGetOrg.data.orgPartyRelationResult[0]) {
            if (responseGetOrg.data.orgPartyRelationResult[0].toPartyId) {
              setpartyIdOrg(
                responseGetOrg.data.orgPartyRelationResult[0].toPartyId
              );
            }
          }
        }
      });
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/entity/Party?partyTypeEnumId=PtyOrganization",
        confg
      )
      .then((response1) => {
        setpartyIdOrg(response1.data.result[0].partyId);
      });
    axios
      .get(SERVER_URL + "/rest/s1/fadak/getvaluespostal/" + partyId, confg)
      .then((response) => {
        console.log("asdvavjavajvjdvk", response);
        setCurrentData(response.data);
      });
  };

  const cancelAdd = () => {
    setStyle({
      contactMechPurposeId: false,
      countryGeoId: false,
      stateProvinceGeoId: false,
      street: false,
      plate: false,
      postalCode: false,
    });

    formData.postalAddress = undefined;
    const newFormdata = Object.assign({}, formData);

    setFormData(newFormdata);
    setdisplay1(false);
    setTimeout(() => {
      setdisplay1(true);
    }, 20);
  };

  const cancelUpdate = () => {
    setaddressToEdit(-1);
    setdisplay1(false);
    setStyle({
      contactMechPurposeId: false,
      countryGeoId: false,
      stateProvinceGeoId: false,
      street: false,
      plate: false,
      postalCode: false,
    });

    formData.postalAddress = undefined;
    const newFormdata = Object.assign({}, formData);
    setFormData(newFormdata);
    setTimeout(() => {
      setdisplay1(true);
    }, 20);
    setEnableDisableCreate(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const openDeleteModal = (id) => {
    setId(id);
    setOpen(true);
  };

  const displayUpdateForm = (index) => {
    setaddressToEdit(index);
    setdisplay1(false);
    setTimeout(() => {
      setdisplay1(true);
    }, 20);
    setEnableDisableCreate(true);
  };

  const missingcheckPostal = (field) => {
    if (typeof formData.postalAddress != "undefined") {
      if (
        formData.postalAddress[field] === "" ||
        formData.postalAddress[field] === null
      ) {
        return true;
      } else {
        return false;
      }
    }

    if (missingpostal.indexOf(field) > -1) {
      return true;
    } else {
      return false;
    }
  };

  const addRow = () => {
    const postalfields = [
      "contactMechPurposeId",
      "countryGeoId",
      "stateProvinceGeoId",
      "street",
      "plate",
      "postalCode",
    ];

    let postalmissing_fileds = [];

    postalfields.map((field, index) => {
      // if (addressEdit === -1) {
      if (formData.postalAddress) {
        if (
          formData.postalAddress[field] === "" ||
          formData.postalAddress[field] === null ||
          typeof formData.postalAddress[field] == "undefined"
        ) {
          postalmissing_fileds.push(field);
        }
      } else {
        postalmissing_fileds.push(field);
      }

      // postalmissing_fileds.push(field);
    });
    setmissingpostal(postalmissing_fileds);

    if (postalmissing_fileds.length > 0) {
      dispatch(
        setAlertContent(ALERT_TYPES.ERROR, "باید فیلدهای ضروری تکمیل شوند")
      );
      setStyle((prevState) => ({
        contactMechPurposeId:
          formData.postalAddress && formData.postalAddress.contactMechPurposeId
            ? false
            : true,
        countryGeoId:
          formData.postalAddress && formData.postalAddress.countryGeoId
            ? false
            : true,
        stateProvinceGeoId:
          formData.postalAddress && formData.postalAddress.stateProvinceGeoId
            ? false
            : true,
        street:
          formData.postalAddress && formData.postalAddress.street
            ? false
            : true,
        plate:
          formData.postalAddress && formData.postalAddress.plate ? false : true,
        postalCode:
          formData.postalAddress && formData.postalAddress.postalCode
            ? false
            : true,
      }));

      return null;
    } else {
      if (typeof formData.postalAddress != "undefined") {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
        dispatch(
          submitPost(
            "/rest/s1/mantle/parties/contactMechs/telecomNumbers",
            {
              areaCode: formData.postalAddress.areaCode,
              contactNumber: formData.postalAddress.contactNumber,
              // contactMechPurposeId:formData.postalAddress.contactMechPurposeId
            },
            "add"
          )
        ).then((res) => {
          formData.postalAddress.telecomContactMechId = res.data.contactMechId;
          currentData.postalList[tableContent.length] = {
            ...currentData.postalList[tableContent.length],
            telecomContactMechId: res.data.contactMechId,
          };

          if (typeof formData.postalAddress != "undefined") {
            if (typeof formData.postalAddress.areaCode != "undefined") {
              currentData.postalList[tableContent.length] = {
                ...currentData.postalList[tableContent.length],
                areaCode: formData.postalAddress.areaCode,
              };
            }
            if (typeof formData.postalAddress.contactNumber != "undefined") {
              currentData.postalList[tableContent.length] = {
                ...currentData.postalList[tableContent.length],
                contactNumber: formData.postalAddress.contactNumber,
              };
            }
          }
          setCurrentData(Object.assign({}, currentData));
          const newaddRows = Object.assign({}, { ["telecom"]: 0 });
          setAddRows(newaddRows);

          if (
            typeof formData.postalAddress.countryGeoId == "undefined" ||
            formData.postalAddress.countryGeoId === null
          ) {
            formData.postalAddress.countryGeoId = "IRN";
          }

          dispatch(
            submitPost(
              "/rest/s1/mantle/parties/" +
                partyId +
                "/contactMechs/postalAddresses/findOrCreate",
              {
                telecomContactMechId: res.data.contactMechId,
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
                contactMechPurposeId:
                  formData.postalAddress.contactMechPurposeId,
              },
              "add"
            )
          ).then((res1) => {
            if (props.CmtOrgPostalAddress) {
              axios
                .put(
                  SERVER_URL + `/rest/s1/fadak/entity/ContactMech`,
                  {
                    data: {
                      contactMechId: res1.data.contactMechId,
                      contactMechTypeEnumId: "CmtOrgPostalAddress",
                    },
                  },
                  axiosKey
                )
                .then((response) => {});
            }

            formData.postalAddress.contactMechId = res1.data.contactMechId;

            const newaddRows = Object.assign({}, { ["postalAddress"]: 0 });
            setAddRows(newaddRows);
            formData.postalAddress.contactMechId = res1.data.contactMechId;

            let index = tableContent.length;
            getData();
            // setCurrenstData(Object.assign({}, currentData))
          });

          // setCurrentData(Object.assign({}, currentData ))
        });

        setStyle({
          contactMechPurposeId: false,
          countryGeoId: false,
          stateProvinceGeoId: false,
          street: false,
          plate: false,
          postalCode: false,
        });
        const newFormdata = Object.assign({}, formData);
        setFormData({});
        setdisplay1(false);
        setTimeout(() => {
          setdisplay1(true);
        }, 20);
      }
    }
  };

  const setContectMec = (id) => {
    let current = null;
    if (data.postalAddress && currentData.postalList) {
      data.postalAddress.map((item) => {
        if (
          currentData.postalList[id].contactMechPurposeId === item.description
        ) {
          current = item.contactMechPurposeId;
        }
      });
    }
    console.log("current", current);
    return current;
  };

  console.log("akjavkadv", formData);
  const updateRow = () => {
    const addCurrent = [
      "countryGeoId",
      "stateProvinceGeoId",
      "countyGeoId",
      "district",
      "unitNumber",
      "plate",
      "alley",
      "street",
      "postalCode",
      "floor",
    ];
    const postalfileds = [
      "contactMechPurposeId",
      "countryGeoId",
      "stateProvinceGeoId",
      "street",
      "plate",
      "postalCode",
    ];

    let postal_fileds = [];

    postalfileds.map((field, index) => {
      let ifFilled =
        (formData.postalAddress &&
          typeof formData.postalAddress[field] != "undefined" &&
          formData.postalAddress[field].trim() !== "") ||
        typeof formData.postalAddress == "undefined" ||
        (formData.postalAddress &&
          typeof formData.postalAddress[field] == "undefined") ||
        (formData.postalAddress &&
          typeof formData.postalAddress[field] != "undefined" &&
          formData.postalAddress[field].trim() !== "")
          ? true
          : false;
      if (!ifFilled) {
        postal_fileds.push(field);
      }
    });

    if (postal_fileds.length > 0) {
      dispatch(
        setAlertContent(ALERT_TYPES.ERROR, "باید فیلدهای ضروری تکمیل شوند")
      );

      setStyle((prevState) => ({
        contactMechPurposeId:
          formData.postalAddress &&
          formData.postalAddress.contactMechPurposeId === ""
            ? true
            : false,
        countryGeoId:
          formData.postalAddress && formData.postalAddress.countryGeoId === ""
            ? true
            : false,
        stateProvinceGeoId:
          formData.postalAddress &&
          formData.postalAddress.stateProvinceGeoId === ""
            ? true
            : false,
        street:
          formData.postalAddress && formData.postalAddress.street === ""
            ? true
            : false,
        plate:
          formData.postalAddress && formData.postalAddress.plate === ""
            ? true
            : false,
        postalCode:
          formData.postalAddress && formData.postalAddress.postalCode === ""
            ? true
            : false,
      }));
      return false;
    } else {
      if (typeof formData.postalAddress == "undefined") {
        setaddressToEdit(-1);
        setdisplay1(false);
        setTimeout(() => {
          setdisplay1(true);
        }, 20);
        setEnableDisableCreate(false);
      } else {
        console.log("avjavjavjanvfaavbafb 1");
        if (
          typeof formData.postalAddress != "undefined" &&
          typeof currentData != "undefined"
        ) {
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "اطلاعات در حال  به روز رسانی است"
            )
          );
          settelecomcontactMechId(
            currentData.postalList[addressToEdit].telecomContactMechId
          );
          setcontactMechId(currentData.postalList[addressToEdit].contactMechId);
          axios
            .delete(
              SERVER_URL +
                "/rest/s1/fadak/entity/PartyContactMech?contactMechId=" +
                currentData.postalList[addressToEdit].contactMechId +
                "&partyId=" +
                partyId +
                "&fromDate=" +
                "*",
              confg
            )
            .then((res) => {
              const datePtyCmech = {
                contactMechPurposeId:
                  formData.postalAddress.contactMechPurposeId ??
                  setContectMec(addressToEdit),
                contactMechId:
                  currentData.postalList[addressToEdit].contactMechId,
                fromDate: Date.now(),
                partyId: partyId,
              };
              axios
                .post(
                  SERVER_URL + "/rest/s1/fadak/entity/PartyContactMech",
                  { data: datePtyCmech },
                  confg
                )
                .then((response) => {
                  axios
                    .patch(
                      SERVER_URL + "/rest/s1/fadak/entity/PostalAddress",
                      {
                        data: {
                          countryGeoId: formData.postalAddress.countryGeosId,
                          stateProvinceGeoId:
                            formData.postalAddress.stateProvinceGeoId,
                          countyGeoId: formData.postalAddress.countyGeoId,
                          district: formData.postalAddress.district,
                          street: formData.postalAddress.street,
                          alley: formData.postalAddress.alley,
                          plate: formData.postalAddress.plate,
                          floor: formData.postalAddress.floor,
                          unitNumber: formData.postalAddress.unitNumber,
                          postalCode: formData.postalAddress.postalCode,
                          contactMechId:
                            currentData.postalList[addressToEdit].contactMechId,
                        },
                      },
                      confg
                    )
                    .then((response) => {
                      const newaddRows = Object.assign(
                        {},
                        { ["postalAddress"]: -1 }
                      );
                      setAddRows(newaddRows);

                      addCurrent.map((item, index) => {
                        if (
                          typeof formData.postalAddress[item] != "undefined"
                        ) {
                          currentData.postalList[addressToEdit] = {
                            ...currentData.postalList[addressToEdit],
                            [item]: formData.postalAddress[item],
                          };
                        }
                      });
                      currentData.postalList[addressToEdit] = {
                        ...currentData.postalList[addressToEdit],
                        contactMechPurposeId:
                          formData.postalAddress.contactMechPurposeId ??
                          setContectMec(addressToEdit),
                      };
                      setCurrentData(Object.assign({}, currentData));
                      setStyle({
                        contactMechPurposeId: false,
                        countryGeoId: false,
                        stateProvinceGeoId: false,
                        street: false,
                        plate: false,
                        postalCode: false,
                      });
                    });
                });
            });

          if (
            typeof formData.postalAddress.areaCode != "undefined" ||
            typeof formData.postalAddress.contactNumber != "undefined"
          ) {
            if (
              currentData.postalList[addressToEdit].telecomContactMechId ===
              undefined
            ) {
              //post telecom, update postal
              axios
                .post(
                  SERVER_URL + "/rest/s1/fadak/entity/ContactMech",
                  { data: {} },
                  confg
                )
                .then((response1112222) => {
                  axios
                    .post(
                      SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber",
                      {
                        data: {
                          contactMechId:
                            response1112222.data.contactMechId.contactMechId,
                        },
                      },
                      confg
                    )
                    .then((response) => {
                      axios
                        .patch(
                          SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber",
                          {
                            data: {
                              areaCode: formData.postalAddress.areaCode,
                              contactNumber:
                                formData.postalAddress.contactNumber,
                              contactMechId:
                                response1112222.data.contactMechId
                                  .contactMechId,
                            },
                          },
                          confg
                        )
                        .then((response) => {
                          currentData.postalList = {
                            ...currentData.postalList,
                            ["telecomContactMechId"]:
                              response.data.contacpartyIdOrgtMechId,
                          };
                          if (
                            typeof formData.postalAddress.areaCode !=
                            "undefined"
                          ) {
                            currentData.postalList[addressToEdit] = {
                              ...currentData.postalList[addressToEdit],
                              ["areaCode"]: formData.postalAddress.areaCode,
                            };
                          }
                          if (
                            typeof formData.postalAddress.contactNumber !=
                            "undefined"
                          ) {
                            currentData.postalList[addressToEdit] = {
                              ...currentData.postalList[addressToEdit],
                              ["contactNumber"]:
                                formData.postalAddress.contactNumber,
                            };
                          }
                          setCurrentData(Object.assign({}, currentData));
                        });
                      axios
                        .patch(
                          SERVER_URL + "/rest/s1/fadak/entity/PostalAddress",
                          {
                            data: {
                              telecomContactMechId:
                                response1112222.data.contactMechId
                                  .contactMechId,
                              contactMechId:
                                currentData.postalList[addressToEdit]
                                  .contactMechId,
                            },
                          },
                          confg
                        )
                        .then((response) => {
                          setStyle({
                            contactMechPurposeId: false,
                            countryGeoId: false,
                            stateProvinceGeoId: false,
                            street: false,
                            plate: false,
                            postalCode: false,
                          });
                        });
                    });
                });
            } else {
              //patch telecom
              axios
                .patch(
                  SERVER_URL + "/rest/s1/fadak/entity/TelecomNumber",
                  {
                    data: {
                      areaCode: formData.postalAddress.areaCode,
                      contactNumber: formData.postalAddress.contactNumber,
                      contactMechId:
                        currentData.postalList[addressToEdit]
                          .telecomContactMechId,
                    },
                  },
                  {
                    headers: {
                      api_key: localStorage.getItem("api_key"),
                    },
                  }
                )
                .then((response) => {
                  const newaddRows = Object.assign({}, { ["telecom"]: -1 });
                  setAddRows(newaddRows);
                  if (typeof formData.postalAddress.areaCode != "undefined") {
                    currentData.postalList[addressToEdit] = {
                      ...currentData.postalList[addressToEdit],
                      ["areaCode"]: formData.postalAddress.areaCode,
                    };
                  }
                  if (
                    typeof formData.postalAddress.contactNumber != "undefined"
                  ) {
                    currentData.postalList[addressToEdit] = {
                      ...currentData.postalList[addressToEdit],
                      ["contactNumber"]: formData.postalAddress.contactNumber,
                    };
                  }
                  setCurrentData(Object.assign({}, currentData));
                });
            }
          }

          setdisplay1(false);
          setTimeout(() => {
            setdisplay1(true);
          }, 20);
          setEnableDisableCreate(false);
          setaddressToEdit(-1);
        }
      }
    }
  };

  return (
    <Grid>
      {display1 && data && (
        <AddressInfoForm
          CmtOrgPostalAddress={CmtOrgPostalAddress}
          addressToEdit={addressToEdit}
          addFormData={addFormData}
          setFormData={setFormData}
          formData={formData}
          addRow={addRow}
          display={display}
          setdisplay1={setdisplay1}
          style={style}
          setStyle={setStyle}
          data={data}
          tableContent={tableContent}
          setTableContent={setTableContent}
          display1={display1}
          setOpen={setOpen}
          setId={setId}
          idDelete={idDelete}
          open={open}
          handleClose={handleClose}
          cancelAdd={cancelAdd}
          missingcheckPostal={missingcheckPostal}
          partyIdOrg={props.partyIdOrg}
          currentData={currentData}
          cancelUpdate={cancelUpdate}
          updateRow={updateRow}
          activeStep={activeStep}
          telecomcontactMechId={telecomcontactMechId}
          contactMechId={contactMechId}
          setCurrentData={setCurrentData}
          setEnableDisableCreate={setEnableDisableCreate}
          enableDisableCreate={enableDisableCreate}
        />
      )}
    </Grid>
  );
};

export default AddressInfo;
