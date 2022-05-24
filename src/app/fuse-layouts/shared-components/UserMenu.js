import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  Popover,
  MenuItem,
  Typography,
} from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "app/auth/store/actions";
import { Link } from "react-router-dom";
import translate from "../../main/helpers/translate";
import axios from "axios";
import { SERVER_URL } from "../../../configs";
import { setUser } from "./../../store/actions/fadak";
import { useHistory } from "react-router-dom";
import { getAllMyNotifs } from "./../../store/actions/fadak/notification.actions";
import { useSnackbar } from "notistack";
import Grow from "@material-ui/core/Grow";
import checkPermis from "app/main/components/CheckPermision";

function UserMenu(props) {
  const dispatch = useDispatch();
  const datas = useSelector(({ fadak }) => fadak);
  const user = useSelector(({ auth }) => auth.user);
  let history = useHistory();
  const [userMenu, setUserMenu] = useState(null);
  const [myNotifs, setMyNotifs] = useState([]);
  const numberNotifs = useSelector(({ fadak }) => fadak.myNotifications);
  const { enqueueSnackbar } = useSnackbar();

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const partyIdLogin = useSelector(({ auth }) => auth.user.data.partyId);
  const partyIdUser = useSelector(
    ({ fadak }) => fadak.baseInformationInisial.user
  );

  const partyId = partyIdUser !== null ? partyIdUser : partyIdLogin;

  const [partyPerson, setpartyPerson] = React.useState([]);
  const [partyPerson13, setpartyPerson13] = React.useState(false);
  const [emplpsitionPartyId, setEmplpsitionPartyId] = useState();

  React.useEffect(() => {
    const axiosKey = {
      headers: {
        api_key: localStorage.getItem("api_key"),
      },
    };
    if (partyIdLogin) {
      axios
        .get(
          SERVER_URL +
            "/rest/s1/fadak/getpartyuserInfoHeader?partyId=" +
            partyIdLogin,
          axiosKey
        )
        .then((response) => {
          if (typeof response.data.partyuserInfolist[0] != "undefined") {
            response.data.partyuserInfolist.map((identification1, index) => {
              if (identification1.partyContentTypeEnumId === "PcntFaceImage") {
                setpartyPerson13(identification1);
              }
            });

            setpartyPerson({
              fullName: `${
                response.data.partyuserInfolist[0]?.firstName || ""
              } ${response.data.partyuserInfolist[0]?.lastName || ""} ${
                response.data.partyuserInfolist[0]?.suffix || ""
              } `,
            });
          } else if (typeof response.data.partyuserInfolist[0] == "undefined") {
            axios
              .get(
                SERVER_URL +
                  "/rest/s1/fadak/getpartyuserInfo?partyId=" +
                  partyIdLogin,
                axiosKey
              )
              .then((response2) => {
                response2.data.partyuserInfolist.map(
                  (identification12, index) => {
                    if (
                      identification12.partyContentTypeEnumId ===
                        "PcntFaceImage" ||
                      identification12.partyContentTypeEnumId ===
                        "signatureImage" ||
                      typeof identification12.partyContentTypeEnumId ==
                        "undefined"
                    ) {
                      identification12.partyContentTypeEnumId = null;
                      // setpartyPerson1(identification12);
                      setpartyPerson({
                        fullName: `${identification12.firstName} ${
                          identification12.lastName
                        } ${identification12?.suffix || ""} `,
                      });
                    }
                  }
                );
              });
          }
        });
    }
  }, [partyIdLogin]);

  React.useEffect(() => {
    const axiosKey = {
      headers: {
        api_key: localStorage.getItem("api_key"),
      },
    };
    if (partyIdLogin) {
      axios
        .get(
          SERVER_URL +
            `/rest/s1/fadak/EmplpsitionPartyId?partyId=${partyIdLogin}`,
          axiosKey
        )
        .then((response) => {
          console.log("dakvadvava");
          console.log("dakvadvavaavabaklb;akb", response);

          setEmplpsitionPartyId(response.data.description);
        });
    }
  }, [partyIdLogin]);

  function pushToMyNotifs() {
    history.push(`/myNotifications`);
  }
  function getMyNotif() {
    const axiosKey = {
      headers: {
        api_key: localStorage.getItem("api_key"),
      },
    };
    const data = {
      show: "notReceived",
    };
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/listOfMyMessages",
        { data: data },
        axiosKey
      )
      .then((res) => {
        const notifs = res.data.notifs.filter(
          (v, i, a) =>
            a.findIndex(
              (t) => t.communicationEventId === v.communicationEventId
            ) === i
        );
        for (let i = 0; i < notifs.length; i++) {
          enqueueSnackbar(`پیام جدید با عنوان: ${notifs[i].subject}`, {
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "rigth",
            },
            variant: "info",
            TransitionComponent: Grow,
          });
        }
        dispatch(getAllMyNotifs());
        if (notifs.length > 0) {
          changeStatus(
            notifs.map(({ notificationMessageId }) => notificationMessageId)
          );
        }
        setMyNotifs(
          notifs.map(({ notificationMessageId }) => notificationMessageId)
        );
      })
      .catch(() => {});
  }
  function changeStatus(ids) {
    const axiosKey = {
      headers: {
        api_key: localStorage.getItem("api_key"),
      },
    };
    axios
      .patch(
        SERVER_URL + "/rest/s1/fadak/receivedMessage",
        { notifId: ids },
        axiosKey
      )
      .then((res) => {})
      .catch(() => {});
  }
  function getNewNotif() {
    const axiosKey = {
      headers: {
        api_key: localStorage.getItem("api_key"),
      },
    };
    const data = {
      show: "notViewed",
    };
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/listOfMyMessages",
        { data: data },
        axiosKey
      )
      .then((res) => {
        const notifs = res.data.notifs.filter(
          (v, i, a) =>
            a.findIndex(
              (t) => t.communicationEventId === v.communicationEventId
            ) === i
        );
        const newNotif = notifs.filter(
          ({ notificationMessageId: id1 }) =>
            !myNotifs.some(({ notificationMessageId: id2 }) => id2 === id1)
        );
        setMyNotifs(notifs);
        dispatch(getAllMyNotifs(res.data.numberNotif));
        for (let i = 0; i < newNotif.length; i++) {
          enqueueSnackbar(`پیام جدید با عنوان: ${newNotif[i].subject}`, {
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "rigth",
            },
            variant: "info",
            TransitionComponent: Grow,
          });
        }
      })
      .catch(() => {});
  }
  // useEffect(() => {
  //   const interval = setInterval(() => getNewNotif(), 600000);
  //   return () => clearInterval(interval);
  // });
  useEffect(() => {
    getMyNotif();
    // dispatch(getAllMyNotifs());
  }, []);

  return (
    <React.Fragment>
      {checkPermis("myNotifications", datas) && (
        <div
          onClick={pushToMyNotifs}
          style={{
            position: "relative",
            top: "2rem",
            left: "1rem",
            cursor: "pointer",
          }}
        >
          <Badge color="secondary" badgeContent={numberNotifs}>
            <MailIcon color="primary" />
          </Badge>
        </div>
      )}
      <Button className="h-64" onClick={userMenuClick}>
        {partyPerson13.length !== 0 &&
        partyPerson13.partyContentTypeEnumId !== undefined ? (
          <Avatar
            src={
              SERVER_URL +
              "/rest/s1/fadak/getpersonnelfile1?name=" +
              partyPerson13.contentLocation
            }
            id={"imagePreview-" + "contentLocation"}
          />
        ) : (
          <Avatar src={"assets/images/avatars/profile.png"} />
        )}

        <div className="hidden md:flex flex-col ltr:ml-12 rtl:mr-12 items-start">
          <Typography component="span" className="normal-case font-600 flex">
            {/* {partyPerson1.firstName + " " + partyPerson1.lastName + " " + (typeof partyPerson1.suffix != 'undefined' ? partyPerson1.suffix : "")} */}
            {`${partyPerson.fullName || "درحال پردازش ..."}`}
          </Typography>
          <Typography className="text-11 capitalize" color="textSecondary">
            {/* {translate(user.role[0])} */}
            {emplpsitionPartyId || ""}
          </Typography>
        </div>

        <Icon
          className="text-16 ltr:ml-12 rtl:mr-12 hidden sm:flex"
          variant="action"
        >
          keyboard_arrow_down
        </Icon>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: "py-8",
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <React.Fragment>
            <MenuItem component={Link} to="/login">
              <ListItemIcon className="min-w-40">
                <Icon>lock</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="ورود" />
            </MenuItem>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <MenuItem
              component={Link}
              to="/pages/profile"
              onClick={userMenuClose}
            >
              <ListItemIcon className="min-w-40">
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="پروفایل" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(authActions.logoutUser());
                dispatch(setUser(null));
                userMenuClose();
                window.location.replace("/");
                // history.push("/login");
              }}
            >
              <ListItemIcon className="min-w-40">
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary="خروج" />
              {/*<MenuItem component={Link} to="/login">*/}
              {/*<ListItemIcon className="min-w-40">*/}
              {/*<Icon>lock</Icon>*/}
              {/*</ListItemIcon>*/}
              {/*<ListItemText className="pl-0" primary="ورود"/>*/}
              {/*</MenuItem>*/}
            </MenuItem>
          </React.Fragment>
        )}

        {/*login*/}
      </Popover>
    </React.Fragment>
  );
}

export default React.memo(UserMenu);
