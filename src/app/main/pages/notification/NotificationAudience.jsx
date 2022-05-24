import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useListState from "../../reducers/listState";
import axios from "../../api/axiosRest";
import { ALERT_TYPES, setAlertContent } from "../../../store/actions/fadak";
import TransferList from "../../components/TransferList";
import PersonnelFilterForm from "./PersonnelFilterForm";
import { SERVER_URL } from "configs";

export default function NotificationAudience({
  notificationMessageId,
  disabled,
  personnel,
  audience,
  allPersonnel,
  setAllPersonnel,
  deletedAudience,
  setNewAudience,
  setDeletedAudience,
}) {
  const dispatch = useDispatch();
  const userIdLogin = useSelector(({ auth }) => auth.user.data.userId);

  const [formDefaultValues, setFormDefaultValues] = useState({});
  const [formValues, setFormValues] = useState({});
  const [notifUsers, setNotifUsers] = useState([]);
  const [load, setLoad] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const filter_audience = (parties) => {
    if (audience.list) {
      return parties.filter(
        (i) => audience.list.findIndex((j) => j.partyId === i.partyId) < 0
      );
    } else {
      return parties;
    }
  };
  const load_personnel = (filter = "sub") => {
    personnel.set(null);
    const data = {
      organizationPartyId: formValues.organizationPartyId,
      organizationUnit: formValues.organizationUnit,
      role: formValues.role,
      position: formValues.emplPositionId,
      activityArea: formValues.personnelArea,
      expertiseArea: formValues.personnelSubArea,
      costCenter: formValues.costCenter,
      employeeGroups: formValues.personnelGroupId,
      employeeSubGroups: formValues.personnelSubGroup,
      pseudoId: formValues.pseudoId,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      suffix: formValues.suffix,
      relationshipTypeEnumId: formValues.relationshipTypeEnumId,
    };
    console.log(data, "searchUsers");
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/searchUsers",
        {
          data: filter == "res" ? formDefaultValues : data,
        },
        axiosKey
      )
      .then((res) => {
        const users = res.data.result.filter((user) => user.userId);
        const filteredPersonnel = filter_audience(users);
        personnel.set(filteredPersonnel);
        if (filter == "res") {
          setAllPersonnel(users);
        }
      })
      .catch(() => {
        personnel.set([]);
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
  };
  const load_audience = () => {
    if (notificationMessageId) {
      axios
        .get(
          SERVER_URL +
            "/rest/s1/fadak/notificationAudience?notificationMessageId=" +
            notificationMessageId,
          axiosKey
        )
        .then((res) => {
          setLoad(true);
          setNotifUsers(res.data.audience);
          audience.set(res.data.audience);
        })
        .catch(() => {
          audience.set([]);
        });
    } else {
      audience.set([]);
    }
  };
  // const handle_add_audience = (parties) =>
  //   new Promise((resolve, reject) => {
  //     const users = parties.filter((p) => p.userId != userIdLogin);
  //     let Audience = filter_audience(users);
  //     let newUser = Audience.filter(
  //       (i) => notifUsers.findIndex((j) => j.userId === i.userId) < 0
  //     );
  //     if (newUser.length > 0) {
  //       setNewAudience(newUser);
  //       resolve(newUser);
  //     } else {
  //       reject();
  //       dispatch(
  //         setAlertContent(
  //           ALERT_TYPES.WARNING,
  //           "پرسنل انتخابی قبلا اضافه شده اند."
  //         )
  //       );
  //     }
  //   });
  const handle_add_participant = (parties) =>
    new Promise((resolve, reject) => {
      setLoad(false);
      const users = parties.filter((p) => p.userId != userIdLogin);
      if (notificationMessageId) {
        let Audience = filter_audience(users);
        const deletedUsers = deletedAudience.filter(
          (i) => Audience.findIndex((j) => j.userId === i.userId) < 0
        );
        setDeletedAudience(deletedUsers);
        let newUser = Audience.filter(
          (i) => notifUsers.findIndex((j) => j.userId === i.userId) < 0
        );
        if (newUser.length > 0) {
          setNewAudience(newUser);
          resolve(newUser);
        } else {
          reject();
          dispatch(
            setAlertContent(
              ALERT_TYPES.WARNING,
              "پرسنل انتخابی قبلا اضافه شده اند."
            )
          );
        }
      } else {
        if (users.length > 0) {
          resolve(users);
        } else {
          reject();
        }
      }
    });
  const handle_delete_participant = (parties) =>
    new Promise((resolve, reject) => {
      setDeletedAudience(parties);
      resolve(parties);
    });

  // React.useEffect(() => {
  //   axios
  //     .get("/s1/fadak/party/subOrganization")
  //     .then((res) => {
  //       const defaultFilter = {
  //         relationshipTypeEnumId: "PrtEmployee",
  //         organizationPartyId: JSON.stringify([
  //           res.data.organization[0].partyId,
  //         ]),
  //       };
  //       setFormDefaultValues(defaultFilter);
  //       load_personnel(defaultFilter);
  //     })
  //     .catch(() => {});
  // }, []);

  React.useEffect(() => {
    if (notificationMessageId) {
      load_audience();
    } else {
      audience.set([]);
    }
  }, [notificationMessageId]);

  React.useEffect(() => {
    axios
      .get(SERVER_URL + "/rest/s1/fadak/party/subOrganization", axiosKey)
      .then((res) => {
        const defaultFilter = {
          relationshipTypeEnumId: "PrtEmployee",
          organizationPartyId: JSON.stringify([
            res.data.organization[0].partyId,
          ]),
        };
        setFormDefaultValues(defaultFilter);
        if (!notificationMessageId && allPersonnel.length == 0) {
          load_personnel("res");
        } else if (load) {
          personnel.set(filter_audience(allPersonnel));
        } else if (!load) {
          personnel.set(filter_audience(personnel.list));
        }
      })
      .catch(() => {});
  }, [audience.list]);

  React.useEffect(() => {
    // if (personnel.list) {
    //   personnel.set(filter_audience(personnel.list));
    // }
    if (notifUsers.length > 0) {
      const filterd = audience.list.filter(
        (i) => notifUsers.findIndex((j) => j.userId === i.userId) < 0
      );
      setNewAudience([...filterd]);
    }
  }, [audience.list]);
  React.useEffect(() => {
    setFormValues(formDefaultValues);
  }, [formDefaultValues]);

  React.useEffect(() => {
    axios
      .get(SERVER_URL + "/rest/s1/fadak/getCompanies", axiosKey)
      .then((res) => {
        setOrganizations(res.data.companies);
      })
      .catch(() => {});
  }, []);

  const display_org_info = (item) => {
    let info = [];
    if (item.emplPosition) info.push(item.emplPosition);
    if (item.unitOrganization) info.push(item.unitOrganization);
    if (item.organizationName) info.push(item.organizationName);
    return info.join("، ") || "─";
  };
  const display_name = (item) =>
    `${item.pseudoId} ─ ${item.firstName || "-"} ${item.lastName || "-"}`;

  return notificationMessageId ? (
    <TransferList
      rightTitle="لیست پرسنل"
      rightContext={personnel}
      rightItemLabelPrimary={display_name}
      rightItemLabelSecondary={display_org_info}
      leftTitle="لیست مخاطبان"
      leftContext={audience}
      leftItemLabelPrimary={display_name}
      leftItemLabelSecondary={display_org_info}
      onMoveLeft={handle_add_participant}
      onMoveRight={handle_delete_participant}
      rightFilterForm={
        <PersonnelFilterForm
          search={load_personnel}
          formValues={formValues}
          setFormValues={setFormValues}
          formDefaultValues={formDefaultValues}
          organizations={organizations}
        />
      }
      disabled={disabled}
    />
  ) : (
    <TransferList
      rightTitle="لیست پرسنل"
      rightContext={personnel}
      rightItemLabelPrimary={display_name}
      rightItemLabelSecondary={display_org_info}
      leftTitle="لیست مخاطبان"
      leftContext={audience}
      leftItemLabelPrimary={display_name}
      leftItemLabelSecondary={display_org_info}
      onMoveLeft={handle_add_participant}
      rightFilterForm={
        <PersonnelFilterForm
          search={load_personnel}
          formValues={formValues}
          setFormValues={setFormValues}
          formDefaultValues={formDefaultValues}
          organizations={organizations}
        />
      }
      disabled={disabled}
    />
  );
}
