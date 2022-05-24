import React, { useEffect, useState } from "react";
import useListState from "app/main/reducers/listState";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import { Button, Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "configs";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function UnitAddress({
  externalPartyId = null,
  contactMechTypeEnumId,
  addPermis,
  updatePermis,
  deletePermis,
}) {
  const primaryKey = "contactMechId";
  const datas = useSelector(({ fadak }) => fadak);
  const dataList = useListState(primaryKey);
  const [addressTypes, set_addressTypes] = useState([]);
  const [reset, setReset] = useState(false);

  const partyIdLogin = useSelector(({ auth }) => auth.user.data);
  const partyIdUser = useSelector(
    ({ fadak }) => fadak.baseInformationInisial.user
  );
  const partyId = externalPartyId
    ? externalPartyId
    : partyIdUser !== null
    ? partyIdUser
    : partyIdLogin.partyId;

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const tableColumns = [
    {
      name: "contactMechPurposeId",
      label: "نوع آدرس",
      type: "select",
      options: addressTypes,
      optionIdField: "contactMechPurposeId",
      style: { width: "20%" },
    },
    {
      name: "address",
      label: "آدرس",
      type: "render",
      style: { width: "50%" },
      render: (row) => {
        let adr = [];
        if (row.district) adr.push(`محله ${row.district}`);
        if (row.street) adr.push(`خیابان ${row.street}`);
        if (row.alley) adr.push(`کوچه ${row.alley}`);
        if (row.plate) adr.push(`پلاک ${row.plate}`);
        if (row.floor) adr.push(`طبقه ${row.floor}`);
        if (row.unitNumber) adr.push(`واحد ${row.unitNumber}`);
        if (row.postalCode) adr.push(`کد پستی ${row.postalCode}`);
        return adr.join("، ");
      },
    },
    {
      name: "areaCode",
      label: "تلفن ثابت",
      type: "render",
      render: (row) => `${row.areaCode || ""}-${row.contactNumber || ""}`,
    },
  ];

  function handle_remove(row) {
    return new Promise((resolve, reject) => {
      axios
        .delete(
          SERVER_URL +
            `/rest/s1/orgStructure/address?${primaryKey}=${row[primaryKey]}`,
          axiosKey
        )
        .then(() => {
          setReset(true);
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
  function get_dataList() {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/orgStructure/address?partyId=${partyId}&contactMechTypeEnumId=${contactMechTypeEnumId}`,
        axiosKey
      )
      .then((res) => {
        dataList.set(res.data.allAddress);
      })
      .catch(() => {
        dataList.set([]);
      });
  }

  useEffect(() => {
    get_dataList();
  }, [partyId]);

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/orgStructure/contactMechPurpose?contactMechTypeEnumId=${contactMechTypeEnumId}`,
        axiosKey
      )
      .then((res) => {
        set_addressTypes(res.data.purposes);
      })
      .catch(() => {});
  }, []);

  return (
    <Box
      style={{
        padding: 12,
        margin: 10,
      }}
    >
      <TablePro
        title="لیست آدرس ها"
        columns={tableColumns}
        rows={dataList.list || []}
        setRows={dataList.set}
        loading={dataList.list === null}
        add={checkPermis(addPermis, datas) && "external"}
        addForm={
          <TableForm
            addressTypes={addressTypes}
            partyId={partyId}
            reset={reset}
          />
        }
        edit={checkPermis(updatePermis, datas) && "external"}
        editForm={
          <TableForm
            editing={true}
            addressTypes={addressTypes}
            partyId={partyId}
            reset={reset}
          />
        }
        removeCallback={checkPermis(deletePermis, datas) ? handle_remove : null}
      />
    </Box>
  );
}

function TableForm({ editing = false, addressTypes, partyId, ...restProps }) {
  const [formValidation, setFormValidation] = useState({});
  const {
    formValues,
    setFormValues,
    reset,
    successCallback,
    failedCallback,
    handleClose,
  } = restProps;
  const [waiting, set_waiting] = useState(false);
  const dispatch = useDispatch();
  const formDefaultValues = {};
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const formStructure = [
    {
      name: "contactMechPurposeId",
      label: "نوع آدرس",
      type: "select",
      options: addressTypes,
      optionIdField: "contactMechPurposeId",
      required: true,
    },
    {
      name: "countryGeoId",
      label: "کشور",
      type: "select",
      options: "Country",
      optionIdField: "geoId",
      optionLabelField: "geoName",
      required: true,
    },
    {
      name: "stateProvinceGeoId",
      label: "استان",
      type: "select",
      options: "Province",
      optionIdField: "geoId",
      optionLabelField: "geoName",
      required: true,
      filterOptions: (options) =>
      formValues["countyGeoId"] 
          ? options.filter(
              (item) => formValues["countyGeoId"]===item.county) : options,
    },
    {
      name: "countyGeoId",
      label: "شهرستان",
      type: "select",
      options: "County",
      optionIdField: "geoId",
      optionLabelField: "geoName",
      filterOptions: (options) =>
      formValues["stateProvinceGeoId"] 
          ? options.filter(
              (item) => formValues["stateProvinceGeoId"]===item.city) : options,
    },
    {
      name: "postalCodeGeoId",
      label: "بخش",
      type: "select",
      options: "Postal_Code",
      optionIdField: "geoId",
      optionLabelField: "geoName",
    },
    {
      name: "cityGeoId",
      label: "دهستان/شهر",
      type: "select",
      options: "City",
      optionIdField: "geoId",
      optionLabelField: "geoName",
    },
    {
      name: "district",
      label: "محله",
      type: "text",
    },
    {
      name: "street",
      label: "خیابان",
      type: "text",
      required: true,
    },
    {
      name: "alley",
      label: "کوچه",
      type: "text",
    },
    {
      name: "plate",
      label: "پلاک",
      type: "text",
      required: true,
    },
    {
      name: "floor",
      label: "طبقه",
      type: "number",
    },
    {
      name: "unitNumber",
      label: "واحد",
      type: "number",
    },
    {
      name: "postalCode",
      label: "کد پستی",
      type: "number",
      hideSpin: true,
      required: true,
    },
    {
      type: "group",
      reverse: true,
      items: [
        {
          name: "areaCode",
          label: "پیش شماره",
          type: "number",
          style: { width: "150px" },
          hideSpin: true,
        },
        {
          name: "contactNumber",
          label: "تلفن ثابت",
          type: "number",
          hideSpin: true,
        },
      ],
    },
  ];

  const handle_add = () => {
    let data = { ...formValues, partyId: partyId };
    axios
      .post(SERVER_URL + "/rest/s1/orgStructure/address", { ...data }, axiosKey)
      .then((res) => {
        setFormValues(formDefaultValues);
        successCallback(formValues);
        set_waiting(false);
        successCallback({ ...data, ...res.data });
      })
      .catch(() => {
        set_waiting(false);
        failedCallback();
      });
  };
  const handle_edit = () => {
    axios
      .put(
        SERVER_URL + "/rest/s1/orgStructure/address",
        {
          ...formValues,
        },
        axiosKey
      )
      .then(() => {
        setFormValues(formDefaultValues);
        set_waiting(false);
        successCallback(formValues);
      })
      .catch(() => {
        set_waiting(false);
        failedCallback();
      });
  };

  const handle_reset = () => {
    handleClose();
  };

  useEffect(() => {
    if (reset) {
      handle_reset();
    }
  }, [reset]);

  return (
    <FormPro
      prepend={formStructure}
      formValues={formValues}
      setFormValues={setFormValues}
      formDefaultValues={formDefaultValues}
      formValidation={formValidation}
      setFormValidation={setFormValidation}
      submitCallback={() => {
        set_waiting(true);
        dispatch(
          setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات...")
        );
        if (editing) {
          handle_edit();
        } else {
          handle_add();
        }
      }}
      resetCallback={handle_reset}
      actionBox={
        <ActionBox>
          <Button
            type="submit"
            role="primary"
            disabled={waiting}
            endIcon={waiting ? <CircularProgress size={20} /> : null}
          >
            {editing ? "ویرایش" : "افزودن"}
          </Button>
          <Button type="reset" role="secondary" disabled={waiting}>
            لغو
          </Button>
        </ActionBox>
      }
    />
  );
}
