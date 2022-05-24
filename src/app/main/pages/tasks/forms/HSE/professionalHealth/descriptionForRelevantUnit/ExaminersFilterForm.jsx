import React, { useState, useEffect } from "react";
import ActionBox from "../../../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button } from "@material-ui/core";
import FormPro from "../../../../../../components/formControls/FormPro";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../store/actions/fadak";
import axios from "axios";
import { SERVER_URL } from "configs";
import { useDispatch } from "react-redux";

export default function ExaminersFilterForm({
  managerExaminers,
  unitOrganizationId,
  setLoading,
  setTableContent,
}) {
  const [formValues, setFormValues] = useState({});
  const [waiting, setWaiting] = useState(false);
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "emplPositionId",
      label: "پست سازمانی",
      type: "multiselect",
      options: "EmplPosition",
      optionIdField: "emplPositionId",
      optionLabelField: "description",
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.description}` || "؟",
      filterOptions: (options) =>
        options.filter(
          (item) => item.organizationPartyId == unitOrganizationId
        ),
      col: 4,
    },
    {
      name: "partyRelationshipId",
      label: "نام و نام خانوادگی",
      type: "multiselect",
      options: managerExaminers,
      optionIdField: "partyRelationshipId",
      optionLabelField: "fullName",
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.fullName}` || "؟",
      filterOptions: (options) =>
        formValues["emplPositionId"] &&
        eval(formValues["emplPositionId"]).length > 0
          ? options.filter(
              (item) =>
                formValues["emplPositionId"].indexOf(item.emplPositionId) > 0
            )
          : options,
      changeCallback: (options) =>
        setFormValues((prevState) => ({
          ...prevState,
          emplPositionId: JSON.stringify(
            options.map((opt) => opt.emplPositionId).filter(Boolean)
          ),
        })),
      col: 4,
    },
  ];

  const filterExaminers = () => {
    setWaiting(true);
    setLoading(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/healthAndCare/filterExaminers",
        {
          filterOptions: { ...formValues },
          examiners: managerExaminers,
        },
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data.filteredExaminers);
        setLoading(false);
        setWaiting(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در فیلتر پرسنل رخ داده است."
          )
        );
        setLoading(false);
        setWaiting(false);
      });
  };

  const handleReset = () => {
    setTableContent(managerExaminers);
  };

  return (
    <FormPro
      prepend={formStructure}
      formValues={formValues}
      setFormValues={setFormValues}
      submitCallback={filterExaminers}
      resetCallback={handleReset}
      actionBox={
        <ActionBox>
          <Button
            type="submit"
            role="primary"
            disabled={waiting}
            endIcon={waiting ? <CircularProgress size={20} /> : null}
          >
            جستجو
          </Button>
          <Button type="reset" role="secondary">
            لغو
          </Button>
        </ActionBox>
      }
    />
  );
}
