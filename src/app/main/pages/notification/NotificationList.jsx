import React from "react";
import { Card } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TablePro from "../../components/TablePro";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axiosRest";
import { ALERT_TYPES, setAlertContent } from "../../../store/actions/fadak";
import DoneIcon from "@material-ui/icons/Done";
import checkPermis from "app/main/components/CheckPermision";
import { SERVER_URL } from "configs";

export default function NotificationList({ notifications, setAction }) {
  const dispatch = useDispatch();
  const datas = useSelector(({ fadak }) => fadak);
  const CommunicationPurposeEnums = useSelector(
    ({ fadak }) => fadak.constData.list.CommunicationPurpose
  );
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const tableCols = [
    {
      name: "subject",
      label: " عنوان ",
      type: "text",
      style: { width: "200px" },
    },
    {
      name: "purposes",
      label: " هدف ",
      // type: "multiselect",
      // options: "CommunicationPurpose",
      type: "render",
      render: (row) => {
        const purposeIds = JSON.parse(row.purposes);
        let purposes = purposeIds
          ? purposeIds.map(
              (id) =>
                CommunicationPurposeEnums?.find((i) => i.enumId === id)
                  ?.description
            )
          : [];
        return purposes.length ? purposes.join("؛ ") : "-";
      },
    },
    {
      name: "sentDate",
      label: "تاریخ ارسال",
      type: "date",
      style: { width: "130px" },
    },
    {
      name: "statusId",
      label: "وضعیت",
      type: "select",
      options: "StaCommunicationEvent",
      optionIdField: "statusId",
      style: { width: "150px" },
    },
  ];

  function handle_view_notification(row) {
    setAction({ type: "view", payload: row.notificationMessageId });
  }
  function handle_edit_notification(row) {
    setAction({ type: "edit", payload: row.notificationMessageId });
  }
  function handle_remove_notification(row) {
    setAction({ type: "add", payload: "" });
    return new Promise((resolve, reject) => {
      axios
        .delete(
          SERVER_URL +
            "/rest/s1/fadak/deleteNotification?notificationMessageId=" +
            row.notificationMessageId,
          axiosKey
        )
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
  function handle_approve_notification(row) {
    setAction({ type: "edit", payload: "" });
    axios
      .put(
        SERVER_URL +
          "/rest/s1/fadak/approveNotification?notificationMessageId=" +
          row.notificationMessageId,
        axiosKey
      )
      .then((res) => {
        notifications.update({
          notificationMessageId: row.notificationMessageId,
          ...res.data,
        });
        setAction({ type: "add", payload: "" });
        if (res.data.statusId === "CeReady") {
          dispatch(
            setAlertContent(
              ALERT_TYPES.SUCCESS,
              "پیام مورد نظر تایید و آماده ارسال به مخاطبان گردید."
            )
          );
        } else {
          dispatch(
            setAlertContent(
              ALERT_TYPES.SUCCESS,
              "پیام مورد نظر تایید و با موفقیت به مخاطبان ارسال گردید."
            )
          );
        }
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
      });
  }

  return (
    <Card>
      <TablePro
        title="لیست پیام‌ها"
        rowNumberWidth="40px"
        fixedLayout={true}
        columns={tableCols}
        rows={notifications.list || []}
        setRows={notifications.set}
        loading={notifications.list === null}
        edit="callback"
        editCallback={handle_edit_notification}
        editCondition={(row) =>
          checkPermis("notification/management/edit", datas) &&
          row.statusId === "CeReady"
        }
        removeCallback={handle_remove_notification}
        removeCondition={(row) =>
          checkPermis("notification/management/edit", datas) &&
          row.statusId === "CeReady"
        }
        rowActions={[
          {
            title: "نمایش",
            icon: VisibilityIcon,
            onClick: (row) => handle_view_notification(row),
            display: (row) =>
              row.statusId === "CeSent" ||
              row.statusId === "CeReceived" ||
              row.statusId === "CeViewed",
          },
          // {
          //     title: "تایید نهایی",
          //     icon: DoneIcon,
          //     onClick: handle_approve_notification,
          //     display: (row) => row.statusId === "CeInProgress"
          // }
        ]}
      />
    </Card>
  );
}
