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

export default function UnitTel({
  externalPartyId = null,
  electronicWay = false,
  addPermis,
  updatePermis,
  deletePermis,
  addPermisElectronic,
  updatePermisElectronic,
  deletePermisElectronic,
}) {
  const primaryKey = "contactMechId";
  const datas = useSelector(({ fadak }) => fadak);
  const dataList = useListState(primaryKey);
  const electronicList = useListState(primaryKey);
  const [telTypes, set_telTypes] = useState([]);
  const [electronicTypes, set_electronicTypes] = useState([]);
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
      label: "نوع شماره تماس",
      type: "select",
      options: telTypes,
      optionIdField: "contactMechPurposeId",
      // style   : {width: "20%"},
    },
    {
      name: "contactNumber",
      label: "شماره تماس",
      type: "render",
      render: (row) =>
        row.areaCode
          ? `${row.areaCode}-${row.contactNumber}`
          : row.contactNumber,
    },
  ];

  const tableCols = [
    {
      name: "contactMechPurposeId",
      label: "نوع راه ارتباطی",
      type: "select",
      options: electronicTypes,
      optionIdField: "contactMechPurposeId",
    },
    {
      name: "infoString",
      label: "راه ارتباطی",
      type: "text",
    },
  ];

  function handle_remove(row) {
    return new Promise((resolve, reject) => {
      axios
        .delete(
          SERVER_URL +
            `/rest/s1/orgStructure/tel?${primaryKey}=${row[primaryKey]}`,
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

  function handle_remove_electronic(row) {
    return new Promise((resolve, reject) => {
      axios
        .delete(
          SERVER_URL +
            `/rest/s1/orgStructure/electronic?${primaryKey}=${row[primaryKey]}`,
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
        SERVER_URL + `/rest/s1/orgStructure/tel?partyId=${partyId}`,
        axiosKey
      )
      .then((res) => {
        dataList.set(res.data.allTel);
      })
      .catch(() => {
        dataList.set([]);
      });
  }

  function get_electronicList() {
    axios
      .get(
        SERVER_URL + `/rest/s1/orgStructure/electronic?partyId=${partyId}`,
        axiosKey
      )
      .then((res) => {
        electronicList.set(res.data.allElectronicWay);
      })
      .catch(() => {
        electronicList.set([]);
      });
  }

  useEffect(() => {
    get_dataList();
    if (electronicWay) {
      get_electronicList();
    }
  }, [partyId]);

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/orgStructure/contactMechPurpose?contactMechTypeEnumId=CmtTelecomNumber`,
        axiosKey
      )
      .then((res) => {
        set_telTypes(res.data.purposes);
      })
      .catch(() => {});
    if (electronicWay) {
      axios
        .get(
          SERVER_URL +
            `/rest/s1/orgStructure/contactMechPurpose?contactMechTypeEnumId=CmtElectronicAddress`,
          axiosKey
        )
        .then((res) => {
          set_electronicTypes(res.data.purposes);
        })
        .catch(() => {});
    }
  }, []);

  return (
    <Box
      style={{
        padding: 12,
        margin: 10,
      }}
    >
      <TablePro
        title="لیست شماره های تماس"
        columns={tableColumns}
        rows={dataList.list || []}
        setRows={dataList.set}
        loading={dataList.list === null}
        add={checkPermis(addPermis, datas) && "external"}
        addForm={
          <TableForm telTypes={telTypes} partyId={partyId} reset={reset} />
        }
        edit={checkPermis(updatePermis, datas) && "external"}
        editForm={
          <TableForm
            editing={true}
            telTypes={telTypes}
            partyId={partyId}
            reset={reset}
          />
        }
        removeCallback={checkPermis(deletePermis, datas) ? handle_remove : null}
      />
      {electronicWay && (
        <TablePro
          title="لیست راه‌های ارتباطی"
          columns={tableCols}
          rows={electronicList.list || []}
          setRows={electronicList.set}
          loading={electronicList.list === null}
          add={checkPermis(addPermisElectronic, datas) && "external"}
          addForm={
            <ElectronicForm
              electronicTypes={electronicTypes}
              partyId={partyId}
              reset={reset}
            />
          }
          edit={checkPermis(updatePermisElectronic, datas) && "external"}
          editForm={
            <ElectronicForm
              editing={true}
              electronicTypes={electronicTypes}
              partyId={partyId}
              reset={reset}
            />
          }
          removeCallback={
            checkPermis(deletePermisElectronic, datas)
              ? handle_remove_electronic
              : null
          }
        />
      )}
    </Box>
  );
}

function TableForm({ editing = false, telTypes, partyId, ...restProps }) {
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
      label: "نوع شماره تماس",
      type: "select",
      options: telTypes,
      optionIdField: "contactMechPurposeId",
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
          label: "شماره تماس",
          type: "number",
          hideSpin: true,
          required: true,
        },
      ],
    },
  ];

  const handle_add = () => {
    let data = { ...formValues, partyId: partyId };
    axios
      .post(SERVER_URL + "/rest/s1/orgStructure/tel", { ...data }, axiosKey)
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
        SERVER_URL + "/rest/s1/orgStructure/tel",
        { ...formValues },
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

function ElectronicForm({
  editing = false,
  electronicTypes,
  partyId,
  ...restProps
}) {
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
      label: "نوع راه ارتباطی",
      type: "select",
      options: electronicTypes,
      optionIdField: "contactMechPurposeId",
      required: true,
    },

    {
      name: "infoString",
      label: "راه ارتباطی",
      type: "text",
      required: true,
      col: 6,
    },
  ];

  const handle_add = () => {
    let data = { ...formValues, partyId: partyId };
    axios
      .post(
        SERVER_URL + "/rest/s1/orgStructure/electronic",
        { ...data },
        axiosKey
      )
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
        SERVER_URL + "/rest/s1/orgStructure/electronic",
        { ...formValues },
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
