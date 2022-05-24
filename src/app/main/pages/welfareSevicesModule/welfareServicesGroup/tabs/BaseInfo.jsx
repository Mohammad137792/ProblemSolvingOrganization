import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Button,
  CardContent,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import { SERVER_URL } from "configs";
import axios from "axios";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../store/actions/fadak";
import moment from "moment-jalaali";

export default function BaseInfo({ welfareGroupPartyClassificationId }) {
  const [tableContent, setTableContent] = useState([]);
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const tableCols = [
    {
      name: "fullName",
      label: "نام و نام خانوادگی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "fromDate",
      label: "از تاریخ",
      type: "date",
      style: { minWidth: "80px" },
    },
    {
      name: "thruDate",
      label: "تا تاریخ",
      type: "date",
      style: { minWidth: "80px" },
    },
  ];

  const getBasicPersonnel = () => {
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/searchUsers",
        {
          data: { justCompanyPartyId: "Y" },
        },
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            personnel: res.data.result,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت پرسنل رخ داده است."
          )
        );
      });
  };

  const getWelfareGroupPersonel = () => {
    setLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/personWelfareGroup?welfareGroupPartyClassificationId=${welfareGroupPartyClassificationId}`,
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.welfareGroupPersonel);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت لیست اعضای گروه خدمات رفاهی!"
          )
        );
        setLoading(false);
      });
  };

  const handleRemove = (row) => {
    return new Promise((resolve, reject) => {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
      setLoading(true);
      axios
        .delete(
          SERVER_URL +
            `/rest/s1/welfare/personWelfareGroup?partyClassificationId=${welfareGroupPartyClassificationId}&partyRelationshipId=${row?.partyRelationshipId}&fromDate=${row?.fromDate}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContent.filter(
            (person) =>
              person.partyRelationshipId != row?.partyRelationshipId &&
              person.fromDate != row?.fromDate
          );
          setTableContent(filteredTable);
          setLoading(false);
          resolve();
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در حذف پرسنل!"));
          setLoading(false);
          reject();
        });
    });
  };

  useEffect(() => {
    getBasicPersonnel();
  }, []);

  useEffect(() => {
    getWelfareGroupPersonel();
  }, [welfareGroupPartyClassificationId]);

  return (
    <>
      <TablePro
        title="لیست اعضای گروه خدمات رفاهی"
        columns={tableCols}
        rows={tableContent}
        setRows={setTableContent}
        loading={loading}
        add={
          checkPermis(
            "welfareServices/welfareServicesGroup/BaseInfo/add",
            datas
          ) && "external"
        }
        addForm={
          <ExternalForm
            formValues={formValues}
            setFormValues={setFormValues}
            editing={false}
            setLoading={setLoading}
            fieldsInfo={fieldsInfo}
            tableContent={tableContent}
            setTableContent={setTableContent}
            welfareGroupPartyClassificationId={
              welfareGroupPartyClassificationId
            }
          />
        }
        edit="external"
        editCondition={(row) =>
          checkPermis(
            "welfareServices/welfareServicesGroup/BaseInfo/update",
            datas
          ) && !row.anotherActiveGroup
        }
        editForm={
          <ExternalForm
            formValues={formValues}
            setFormValues={setFormValues}
            editing={true}
            setLoading={setLoading}
            fieldsInfo={fieldsInfo}
            tableContent={tableContent}
            setTableContent={setTableContent}
            welfareGroupPartyClassificationId={
              welfareGroupPartyClassificationId
            }
          />
        }
        removeCondition={() =>
          checkPermis(
            "welfareServices/welfareServicesGroup/BaseInfo/delete",
            datas
          )
        }
        removeCallback={handleRemove}
      />
    </>
  );
}

function ExternalForm({ editing = false, ...restProps }) {
  const {
    formValues,
    setFormValues,
    handleClose,
    fieldsInfo,
    setLoading,
    tableContent,
    setTableContent,
    welfareGroupPartyClassificationId,
  } = restProps;
  const [waiting, setWaiting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editBeforePerson, setEditBeforePerson] = useState(false);
  const [formValidation, setFormValidation] = useState({});
  const [editedPerson, setEditedPerson] = useState({});
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "partyRelationshipId",
      label: "پرسنل",
      type: "select",
      options: editing
        ? fieldsInfo.personnel
        : fieldsInfo.personnel?.filter(
            (person) =>
              tableContent.findIndex(
                (row) =>
                  (!row?.thruDate ||
                    new Date(row?.thruDate) >
                      new Date(
                        moment(new Date().getTime()).format("YYYY-MM-DD")
                      )) &&
                  person.partyRelationshipId == row.partyRelationshipId
              ) == -1
          ),
      optionLabelField: "fullName",
      optionIdField: "partyRelationshipId",
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.fullName}` || "؟",
      readOnly: editing,
      required: true,
    },
    {
      name: "fromDate",
      label: "از تاریخ",
      type: "date",
      readOnly: editing,
      required: true,
    },
    {
      name: "thruDate",
      label: "تا تاریخ",
      type: "date",
    },
  ];

  const addPerson = () => {
    setLoading(true);
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/personWelfareGroup",
        {
          ...formValues,
          partyClassificationId: welfareGroupPartyClassificationId,
        },
        axiosKey
      )
      .then((res) => {
        setEditBeforePerson(true);
        const completedFormValues = {
          ...formValues,
          fullName: fieldsInfo?.personnel.find(
            (person) =>
              person.partyRelationshipId == formValues.partyRelationshipId
          )?.fullName,
        };
        setTableContent((prevState) => [...prevState, completedFormValues]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در افزودن پرسنل!"));
        setWaiting(false);
        setLoading(false);
        setOpenDialog(false);
      });
  };

  const handleSubmit = () => {
    setWaiting(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/welfareGroupPartyClassificationId?partyRelationshipId=${formValues.partyRelationshipId}`,
        axiosKey
      )
      .then((res) => {
        if (res.data?.welfareGroupPartyClassificationId) {
          setEditedPerson(res.data?.employmentClassificationAppl);
          setOpenDialog(true);
        } else {
          addPerson();
        }
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت گروه پرسنل انتخابی!"
          )
        );
      });
  };

  const handleEdit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setLoading(true);
    setWaiting(true);
    axios
      .put(
        SERVER_URL + "/rest/s1/welfare/personWelfareGroup",
        editedPerson.partyRelationshipId
          ? {
              ...editedPerson,
              thruDate: moment(new Date().getTime()).format("YYYY-MM-DD"),
            }
          : {
              ...formValues,
              partyClassificationId: welfareGroupPartyClassificationId,
            },
        axiosKey
      )
      .then((res) => {
        setEditBeforePerson(false);
        if (!editedPerson.partyRelationshipId) {
          const editedTableContent = [...tableContent];
          const personIndex = tableContent.findIndex(
            (person) =>
              person.partyRelationshipId == formValues.partyRelationshipId &&
              person.fromDate == formValues.fromDate
          );
          editedTableContent[personIndex] = {
            ...editedTableContent[personIndex],
            ...formValues,
          };
          setTableContent(editedTableContent);
          dispatch(
            setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
          );
          handleReset();
        }
      })
      .catch(() => {
        if (!editedPerson.partyRelationshipId) {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ویرایش پرسنل!"));
          setWaiting(false);
          setLoading(false);
        }
      });
  };

  const handleReset = () => {
    setLoading(false);
    setWaiting(false);
    setOpenDialog(false);
    setFormValues({});
    handleClose();
  };

  useEffect(() => {
    if (editedPerson.partyRelationshipId && editBeforePerson) {
      handleEdit();
    }
  }, [editedPerson, editBeforePerson]);

  return (
    <CardContent>
      <FormPro
        prepend={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        formValidation={formValidation}
        setFormValidation={setFormValidation}
        submitCallback={() => (editing ? handleEdit() : handleSubmit())}
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
        resetCallback={handleReset}
      />
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {
            "پرسنل انتخابی در گروه خدمت رفاهی دیگری فعال است، آیا از تغییر گروه او مطمئن هستید؟"
          }
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={handleReset}>لغو</Button>
          <Button onClick={addPerson} autoFocus>
            تایید
          </Button>
        </DialogActions>
      </Dialog>
    </CardContent>
  );
}
