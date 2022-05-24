import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button } from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import checkPermis from "app/main/components/CheckPermision";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "configs";
import axios from "axios";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";

export default function PersonnelFilterForm({
  search,
  handleClose,
  formValues,
  setFormValues,
  personnel,
  users,
  fieldsInfo,
}) {
  const [waiting, setWaiting] = useState(false);
  const [formDefaultValues, setFormDefaultValues] = useState({});
  const dispatch = useDispatch();
  const datas = useSelector(({ fadak }) => fadak);
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "organizationPartyId",
      label: "شرکت",
      type: "select",
      options: fieldsInfo.companies,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
    },
    {
      name: "organizationUnit",
      label: "واحد سازمانی",
      type: "select",
      options: fieldsInfo.organizationUnit,
      optionIdField: "partyId",
      optionLabelField: "organizationName",
      filterOptions: (options) =>
        formValues.organizationPartyId
          ? options.filter(
              (item) => item.companyPartyId == formValues.organizationPartyId
            )
          : options,
    },
    {
      name: "gender",
      label: "جنسیت",
      type: "select",
      options: [
        { genderId: "Y", genderName: "مرد" },
        { genderId: "N", genderName: "زن" },
      ],
      optionIdField: "genderId",
      optionLabelField: "genderName",
    },
  ];

  function filterPersonnel() {
    setWaiting(true);
    search(false);
    handleClose();
    setWaiting(false);
  }

  function handleReset() {
    personnel.set(users);
    setFormValues({ organizationPartyId: fieldsInfo.myCompany });
    handleClose();
  }

  return (
    <FormPro
      prepend={formStructure}
      formValues={formValues}
      setFormValues={setFormValues}
      actionBox={
        <ActionBox>
          <Button
            type="button"
            role="primary"
            onClick={filterPersonnel}
            disabled={waiting}
            endIcon={waiting ? <CircularProgress size={20} /> : null}
          >
            جستجو
          </Button>
          {checkPermis(
            "hse/professionalHealth/humanResourcesExpert/deleteFilter",
            datas
          ) && (
            <Button type="button" role="secondary" onClick={handleReset}>
              لغو
            </Button>
          )}
        </ActionBox>
      }
    />
  );
}
