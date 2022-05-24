import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormPro from "app/main/components/formControls/FormPro";
import { Box, Button, Card, CardContent } from "@material-ui/core";
import ActionBox from "app/main/components/ActionBox";
import TablePro from "app/main/components/TablePro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ModalPro from "app/main/components/ModalPro";
import axios from "axios";
import {
  ALERT_TYPES,
  decreaseMyNotifs,
  getAllMyNotifs,
  increaseMyNotifs,
  setAlertContent,
} from "app/store/actions";
import { SERVER_URL } from "configs";
import moment from "moment-jalaali";
import checkPermis from "app/main/components/CheckPermision";

const MyNotificationsForm = () => {
  const dispatch = useDispatch();
  const datas = useSelector(({ fadak }) => fadak);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState([]);
  const [company, setCompany] = useState([]);
  const [reasonEnumId, setReasonEnumId] = useState([]);
  const [tableContent, setTableContent] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [icon, setIcon] = useState("");
  const [showNotif, setShowNotif] = useState("");

  const showOptions = [
    { option: "مشاهده شده", optionId: "viewed" },
    { option: "مشاهده نشده", optionId: "notViewed" },
    { option: "همه", optionId: "all" },
  ];
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "company",
      label: "شرکت",
      type: "select",
      options: company,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
      col: 3,
    },
    {
      name: "subject",
      label: "عنوان",
      type: "text",
      col: 3,
    },
    {
      name: "reason",
      label: "هدف",
      type: "multiselect",
      options: reasonEnumId,
      optionLabelField: "description",
      optionIdField: "enumId",
      col: 3,
    },
    {
      name: "sentDateFrom",
      label: "از تاریخ",
      type: "date",
      col: 3,
    },
    {
      name: "sentDateTo",
      label: "تا تاریخ",
      type: "date",
      col: 3,
    },
    {
      name: "show",
      label: "نمایش بر اساس",
      type: "select",
      options: showOptions,
      optionLabelField: "option",
      optionIdField: "optionId",
      col: 3,
    },
  ];
  const tableCols = [
    {
      name: "company",
      label: "شرکت",
      type: "text",
      style: { minWidth: "130px" },
    },
    {
      name: "subject",
      label: "عنوان",
      type: "text",
      style: { minWidth: "130px" },
    },
    {
      name: "reason",
      label: "هدف",
      type: "text",
      style: { minWidth: "130px" },
    },
    {
      name: "entryDate",
      label: "تاریخ",
      type: "date",
      style: { minWidth: "130px" },
    },
  ];
  function getReasonEnumId() {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnumeration?enumTypeId=CommunicationPurpose",
        axiosKey
      )
      .then((res) => {
        setReasonEnumId(res.data);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
  }
  function getCompany() {
    axios
      // .get(SERVER_URL + "/rest/s1/fadak/comp", axiosKey)
      .get(SERVER_URL + "/rest/s1/fadak/getCompanies", axiosKey)
      .then((res) => {
        setCompany(res.data.companies);
        // setCompany(res.data.result);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
  }

  function filter() {
    if (formValues.sentDateFrom > formValues.sentDateTo) {
      dispatch(setAlertContent(ALERT_TYPES.ERROR, "بازه‌ی زمانی صحیح نیست."));
      return false;
    }
    const data = {
      company: formValues.company ? formValues.company : null,
      subject:
        formValues.subject && formValues.subject.length != 0
          ? formValues.subject
          : null,
      reason:
        formValues.reason && formValues.reason.length != 0
          ? formValues.reason
          : null,
      sentDateFrom: formValues.sentDateFrom ? formValues.sentDateFrom : null,
      sentDateTo: formValues.sentDateTo ? formValues.sentDateTo : null,
      show: formValues.show ? formValues.show : "notViewed",
    };
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/listOfMyMessages",
        { data: data },
        axiosKey
      )
      .then((res) => {
        setLoading(false);
        setIcon(data.show);
        const notifs = res.data.notifs.filter(
          (v, i, a) =>
            a.findIndex(
              (t) => t.communicationEventId === v.communicationEventId
            ) === i
        );
        for (let i = 0; i < notifs; i++) {
          notifs[i].datetimeStarted = moment(notifs[i].datetimeStarted).locale(
            "fa",
            { useGregorianParser: true }
          );
        }
        dispatch(getAllMyNotifs(res.data.numberNotif));
        setTableContent(notifs);
      })
      .catch(() => {
        setLoading(false);
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
  }
  function seenMessage(row) {
    let notif = {
      subject: row.subject,
      body: row.body,
    };
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const time = today.getHours() + ":" + today.getMinutes();
    const viewedDate = date + " " + time;
    console.log(viewedDate, "viewedDate");
    const data = {
      notificationMessageId: row.notificationMessageId
        ? row.notificationMessageId
        : null,
      viewedDate: viewedDate,
    };
    setShowNotif(notif);
    setOpenModal(true);
    if (row.statusId == "CeReceived") {
      dispatch(decreaseMyNotifs());
    }
    axios
      .patch(SERVER_URL + "/rest/s1/fadak/viewdNotif", { data: data }, axiosKey)
      .then((res) => {
        const tableValue = [...tableContent];
        const filteredTable = tableValue.filter(
          (item) => item.notificationMessageId != row.notificationMessageId
        );
        if (icon !== "all") {
          setTableContent(filteredTable);
        }
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
  }
  function notSeen(row) {
    const data = {
      notificationMessageId: row.notificationMessageId
        ? row.notificationMessageId
        : null,
    };
    axios
      .put(
        SERVER_URL + "/rest/s1/fadak/notViewdNotif",
        { data: data },
        axiosKey
      )
      .then((res) => {
        const tableValue = [...tableContent];
        const filteredTable = tableValue.filter(
          (item) => item.notificationMessageId != row.notificationMessageId
        );
        setTableContent(filteredTable);
        dispatch(increaseMyNotifs());
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
  }
  useEffect(() => {
    getReasonEnumId();
    getCompany();
    filter();
    const formDefaultValues = {
      show: "notViewed",
    };
    setFormValues(formDefaultValues);
  }, []);

  return (
    checkPermis("notification/myNotifications", datas) && (
      <Box>
        <Card variant="outlined">
          <CardContent>
            <TablePro
              title="لیست پیام‌ها"
              columns={tableCols}
              rows={tableContent}
              loading={loading}
              rowActions={[
                icon === "notViewed" || icon === "all"
                  ? {
                      title: "نمایش",
                      icon: VisibilityIcon,
                      onClick: (row) => {
                        seenMessage(row);
                      },
                    }
                  : {
                      title: "دیده نشده",
                      icon: VisibilityOffIcon,
                      onClick: (row) => {
                        notSeen(row);
                      },
                    },
              ]}
              filter="external"
              filterForm={
                <FormPro
                  append={formStructure}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  submitCallback={filter}
                  actionBox={
                    <ActionBox>
                      <Button type="submit" role="primary">
                        جستجو
                      </Button>
                    </ActionBox>
                  }
                />
              }
            />

            <ModalPro
              title={showNotif.subject}
              open={openModal}
              setOpen={setOpenModal}
              content={
                <Card>
                  <CardContent>
                    {showNotif.body ? showNotif.body : "این پیام متنی ندارد."}
                  </CardContent>
                </Card>
              }
            />
          </CardContent>
        </Card>
      </Box>
    )
  );
};

export default MyNotificationsForm;
