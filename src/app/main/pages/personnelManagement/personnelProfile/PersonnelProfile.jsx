import React from "react";
import { FusePageSimple } from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import PersonnelProfileView from "./PersonnelProfileView";
import { useLocation, Redirect, useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import BackIcon from "@material-ui/icons/ArrowBack";

export default function PersonnelProfile() {
  const location = useLocation();
  const history = useHistory();

  return (
    <FusePageSimple
      header={
        <CardHeader
          title="پروفایل پرسنلی"
          action={
            <Tooltip title="بازگشت">
              <IconButton onClick={history.goBack}>
                <BackIcon />
              </IconButton>
            </Tooltip>
          }
          style={{ width: "calc(100% - 15rem - 90px)" }}
        />
      }
      content={
        location.state ? (
          <PersonnelProfileView
            partyId={location.state?.partyId}
            partyRelationshipId={location.state?.partyRelationshipId}
            origin={location.state?.from}
            tab={location.state?.tab}
          />
        ) : (
          <Redirect to="/personnel/search" />
          // <Card>
          //     <CardContent>
          //         <QuickBox variant="error" title="خطای ناوبری" description="پرسنلی برای نمایش پروفایل انتخاب نشده است!"/>
          //     </CardContent>
          // </Card>
        )
      }
    />
  );
}
