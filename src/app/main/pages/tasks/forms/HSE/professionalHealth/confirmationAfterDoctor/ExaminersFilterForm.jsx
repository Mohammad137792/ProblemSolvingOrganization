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
  examiners,
  setLoading,
  fieldsInfo,
  setFieldsInfo,
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
      name: "unitOrganizationId",
      label: "واحد سازمانی",
      type: "multiselect",
      options: "OrganizationUnit",
      optionIdField: "partyId",
      optionLabelField: "organizationName",
    },
    {
      name: "emplPositionId",
      label: "پست سازمانی",
      type: "multiselect",
      options: "EmplPosition",
      optionIdField: "emplPositionId",
      optionLabelField: "description",
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.description}` || "؟",
      filterOptions: (options) =>
        formValues["unitOrganizationId"] &&
        eval(formValues["unitOrganizationId"]).length > 0
          ? options.filter(
              (item) =>
                formValues["unitOrganizationId"].indexOf(
                  item.organizationPartyId
                ) >= 0
            )
          : options,
      changeCallback: (options) =>
        setFormValues((prevState) => ({
          ...prevState,
          unitOrganizationId: JSON.stringify(
            options.map((opt) => opt.organizationPartyId).filter(Boolean)
          ),
        })),
    },
    {
      name: "partyRelationshipId",
      label: "نام و نام خانوادگی",
      type: "multiselect",
      options: examiners,
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
          : formValues["unitOrganizationId"] &&
            eval(formValues["unitOrganizationId"]).length > 0
          ? options.filter(
              (item) =>
                formValues["unitOrganizationId"].indexOf(
                  item.unitOrganizationId
                ) > 0
            )
          : options,
      changeCallback: (options) =>
        setFormValues((prevState) => ({
          ...prevState,
          emplPositionId: JSON.stringify(
            options.map((opt) => opt.emplPositionId).filter(Boolean)
          ),
          unitOrganizationId: JSON.stringify(
            options.map((opt) => opt.unitOrganizationId).filter(Boolean)
          ),
        })),
    },
    {
      name: "specialConsideration",
      label: "ملاحظات خاص",
      type: "select",
      options: fieldsInfo.specialConsideration,
      optionLabelField: "description",
      optionIdField: "enumId",
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
          examiners: examiners,
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
    setTableContent(examiners);
  };

  useEffect(() => {
    filterExaminers();
  }, []);

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
