import { FusePageSimple } from "@fuse";
import React, { createRef, useState } from "react";
import { useSelector } from "react-redux";
import CardHeader from "@material-ui/core/CardHeader";
import NotificationForm from "./NotificationForm";
import Box from "@material-ui/core/Box";
import NotificationList from "./NotificationList";
import useListState from "../../reducers/listState";
import axios from "../../api/axiosRest";
import checkPermis from "app/main/components/CheckPermision";
import { SERVER_URL } from "configs";

export default function Notification() {
  const myScrollElement = createRef(0);
  const notifications = useListState("notificationMessageId");
  const [action, setAction] = useState({ type: "add", payload: "" });
  const datas = useSelector(({ fadak }) => fadak);
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  React.useEffect(() => {
    axios

      .get(SERVER_URL + "/rest/s1/fadak/listOfAllMessages", axiosKey)
      .then((res) => {
        notifications.set(res.data.notifs);
      })
      .catch(() => {
        notifications.set([]);
      });
  }, []);

  return (
    checkPermis("notification", datas) && (
      <FusePageSimple
        ref={myScrollElement}
        header={<CardHeader title={"مدیریت اعلان‌ها"} />}
        content={
          <Box p={2}>
            <NotificationForm
              notifications={notifications}
              setAction={setAction}
              action={action}
              myScrollElement={myScrollElement}
            />
            <Box m={2} />
            <NotificationList
              notifications={notifications}
              setAction={setAction}
            />
          </Box>
        }
      />
    )
  );
}
