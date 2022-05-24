import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormPro from "app/main/components/formControls/FormPro";
import useListState from "../../reducers/listState";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
} from "@material-ui/core";
import ActionBox from "app/main/components/ActionBox";
import axios from "../../api/axiosRest";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import NotificationAudience from "./NotificationAudience";
import moment from "moment-jalaali";
import checkPermis from "app/main/components/CheckPermision";
import { SERVER_URL } from "configs";

export default function NotificationForm({
  notifications,
  action,
  setAction,
  myScrollElement,
}) {
  const dispatch = useDispatch();
  const datas = useSelector(({ fadak }) => fadak);
  const formDefaultValues = {
    purposes: "[]",
  };
  const [formValues, setFormValues] = useState(formDefaultValues);
  const [formValidation, setFormValidation] = useState({});
  const personnel = useListState("userId");
  const audience = useListState("userId");
  const [newAudience, setNewAudience] = useState([]);
  const [allPersonnel, setAllPersonnel] = useState([]);
  const [deletedAudience, setDeletedAudience] = useState([]);
  const disableForm = action.type === "view";
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const formStructure = [
    {
      name: "subject",
      label: "عنوان",
      type: "text",
      required: true,
      disabled: disableForm,
    },
    {
      name: "purposes",
      label: "هدف",
      type: "multiselect",
      options: "CommunicationPurpose",
      disabled: disableForm,
      col: { sm: 8, md: 6 },
    },
    {
      name: "sentDate",
      label: "تاریخ ارسال",
      type: "date",
      disabled: disableForm,
    },
    {
      name: "body",
      label: "متن پیام",
      type: "textarea",
      disabled: disableForm,
      col: 12,
    },
  ];

  function handle_submit() {
    if (audience.list.length !== 0) {
      let nowDate = moment(new Date().getTime()).format("YYYY-MM-DD");
      let sentDate = moment(new Date(formValues.sentDate).getTime()).format(
        "YYYY-MM-DD"
      );
      if (formValues.sentDate && new Date(sentDate) < new Date(nowDate)) {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "تاریخ ارسال پیام نباید از تاریخ امروز کوچکتر باشد."
          )
        );
      } else {
        dispatch(
          setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات...")
        );
        if (action.type === "add") {
          create_notification();
          personnel.set([...allPersonnel]);
        } else if (action.type === "edit") {
          edit_notification();
          personnel.set([...allPersonnel]);
        }
      }
    }
  }

  function edit_notification() {
    const editedFormValues = { ...formValues };
    editedFormValues.sentDate = formValues.sentDate
      ? new Date(formValues.sentDate).toISOString().slice(0, 10)
      : "";
    const data = { ...editedFormValues, notificationMessageId: action.payload };
    axios
      .put(SERVER_URL + "/rest/s1/fadak/editNotification", data, axiosKey)
      .then(() => {
        let nowDate = moment(new Date().getTime()).format("YYYY-MM-DD");
        if (
          formValues.sentDate &&
          moment(new Date(formValues.sentDate).getTime()).format(
            "YYYY-MM-DD"
          ) == nowDate
        ) {
          const editedObject = {
            ...formValues,
            statusId: "CeSent",
          };
          notifications.update(editedObject);
        } else if (!formValues.sentDate) {
          const statusId = "CeSent";
          const editedObject = {
            ...formValues,
            statusId: statusId,
            sentDate: new Date().getTime(),
          };
          notifications.update(editedObject);
        } else {
          notifications.update(formValues);
        }
        if (newAudience?.length > 0 || deletedAudience?.length > 0) {
          editAudience();
        }
        // setAction({ type: "add", payload: "" });
        setAction({ type: "add", payload: "" });
        setFormValues({});
        dispatch(
          setAlertContent(
            ALERT_TYPES.SUCCESS,
            "ویرایش پیام با موفقیت انجام شد."
          )
        );
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
      });
  }
  function editAudience() {
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/notificationAudience",
        {
          notificationMessageId: action.payload,
          audience: newAudience,
          deletedaudience: deletedAudience,
        },
        axiosKey
      )
      .then((res) => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.SUCCESS,
            "اطلاعات مخاطبان با موفقیت  ثبت شد."
          )
        );
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
      });
  }

  function create_notification() {
    const users = audience.list;
    const data = { ...formValues, users: users };
    axios
      .post(SERVER_URL + "/rest/s1/fadak/createNotification", data, axiosKey)
      .then((res) => {
        setFormValues(formDefaultValues);
        const editedform = { ...formValues };
        editedform.sentDate = editedform.sentDate
          ? editedform.sentDate
          : new Date().getTime();
        notifications.add({
          ...editedform,
          ...res.data,
        });
        audience.set([]);
        setAction({ type: "add", payload: "" });
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "پیام با موفقیت ثبت شد.")
        );
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
      });
  }

  function handle_reset() {
    personnel.set([...allPersonnel]);
    // personnel.set([...personnel.list.concat(audience.list)]);
    setAction({ type: "add", payload: "" });
    audience.set([]);
  }

  function load_notif(notificationMessageId) {
    const notif = notifications.list.find(
      (i) => i.notificationMessageId === notificationMessageId
    );
    setFormValues(notif);
  }

  useEffect(() => {
    if (
      action.preventDefault !== true &&
      (action.type === "edit" || action.type === "view")
    ) {
      load_notif(action.payload);
      myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
    }
  }, [action]);

  return (
    (checkPermis("notification/management/add", datas) ||
      action.type === "view") && (
      <Card>
        <CardHeader title="تعریف پیام" />
        <CardContent>
          <FormPro
            formValues={formValues}
            setFormValues={setFormValues}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            formDefaultValues={formDefaultValues}
            prepend={formStructure}
            // append={formStructure}
            actionBox={
              <ActionBox>
                <Button
                  type="submit"
                  role="primary"
                  disabled={disableForm || audience.list?.length == 0}
                >
                  {action.type === "add" ? "ارسال" : "ویرایش"}
                </Button>
                <Button type="reset" role="secondary">
                  لغو
                </Button>
              </ActionBox>
            }
            submitCallback={handle_submit}
            resetCallback={handle_reset}
          >
            {action.type == "add" && (
              <Grid item xs={12}>
                <NotificationAudience
                  allPersonnel={allPersonnel}
                  setAllPersonnel={setAllPersonnel}
                  personnel={personnel}
                  audience={audience}
                />
              </Grid>
            )}
            {(action.type === "edit" || action.type === "view") && (
              <Grid item xs={12}>
                <NotificationAudience
                  personnel={personnel}
                  audience={audience}
                  allPersonnel={allPersonnel}
                  setAllPersonnel={setAllPersonnel}
                  deletedAudience={deletedAudience}
                  setNewAudience={setNewAudience}
                  setDeletedAudience={setDeletedAudience}
                  notificationMessageId={action.payload}
                  disabled={action.type === "view"}
                />
              </Grid>
            )}
          </FormPro>
        </CardContent>
      </Card>
    )
  );
}
