import { FusePageSimple } from "@fuse";
import React, { createRef } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import MyNotificationsForm from "./MyNotificationsForm";

const myNotifications = () => {
  const myScrollElement =  createRef(0);

  return (
    <React.Fragment>
      <FusePageSimple ref={myScrollElement}
        header={
        <CardHeader title={"پیام‌های من"} />}
        content=
        {
         <MyNotificationsForm myScrollElement = {myScrollElement} />
        }
        />
    </React.Fragment>
  );
};

export default myNotifications;