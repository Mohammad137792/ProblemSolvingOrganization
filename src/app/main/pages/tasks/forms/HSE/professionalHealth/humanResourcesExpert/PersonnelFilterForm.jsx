import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button } from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import checkPermis from "app/main/components/CheckPermision";

export default function PersonnelFilterForm({
  search,
  handleClose,
  formValues,
  setFormValues,
  personnel,
  users,
}) {
  const [waiting, setWaiting] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);

  const formStructure = [
    {
      name: "organizationUnit",
      label: "واحد سازمانی",
      type: "multiselect",
      options: "OrganizationUnit",
      optionIdField: "partyId",
      optionLabelField: "organizationName",
      changeCallback: (options) =>
        setFormValues((prevState) => ({
          ...prevState,
          position: null,
        })),
    },
    {
      name: "role",
      label: "نقش سازمانی",
      type: "multiselect",
      options: "Role",
      optionIdField: "roleTypeId",
      optionLabelField: "description",
      changeCallback: (options) =>
        setFormValues((prevState) => ({
          ...prevState,
          position: null,
        })),
    },
    {
      name: "job",
      label: "شغل",
      type: "multiselect",
      options: "Job",
      optionIdField: "jobId",
      optionLabelField: "jobTitle",
      changeCallback: (options) =>
        setFormValues((prevState) => ({
          ...prevState,
          position: null,
        })),
    },
    {
      name: "position",
      label: "پست سازمانی",
      type: "multiselect",
      options: "EmplPosition",
      optionIdField: "emplPositionId",
      optionLabelField: "description",
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.description}` || "؟",
      filterOptions: (options) =>
        formValues["job"] && eval(formValues["job"]).length > 0
          ? options.filter((item) => formValues["job"].indexOf(item.jobId) >= 0)
          : formValues["role"] && eval(formValues["role"]).length > 0
          ? options.filter((item) =>
              item.roleTypeIds.some((r) => formValues["role"].indexOf(r) >= 0)
            )
          : formValues["organizationUnit"] &&
            eval(formValues["organizationUnit"]).length > 0
          ? options.filter(
              (item) =>
                formValues["organizationUnit"].indexOf(
                  item.organizationPartyId
                ) >= 0
            )
          : options,
      changeCallback: (options) =>
        setFormValues((prevState) => ({
          ...prevState,
          partyId: null,
        })),
      // changeCallback: (options) =>
      //   setFormValues((prevState) => ({
      //     ...prevState,
      //     organizationUnit: JSON.stringify(
      //       options.map((opt) => opt.organizationPartyId).filter(Boolean)
      //     ),
      //     job: JSON.stringify(options.map((opt) => opt.jobId).filter(Boolean)),
      //     role: JSON.stringify(
      //       [].concat.apply(
      //         [],
      //         options.map((opt) => opt.roleTypeIds).filter(Boolean)
      //       )
      //     ),
      //   })),
    },
    {
      name: "partyId",
      label: "نام و نام خانوادگی",
      type: "multiselect",
      options: users,
      optionIdField: "partyId",
      optionLabelField: "fullName",
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.fullName}` || "؟",
      filterOptions: (options) =>
        formValues["position"] && eval(formValues["position"]).length > 0
          ? options.filter(
              (item) => formValues["position"].indexOf(item.emplPositionId) > 0
            )
          : formValues["job"] && eval(formValues["job"]).length > 0
          ? options.filter((item) => formValues["job"].indexOf(item.jobId) > 0)
          : formValues["role"] && eval(formValues["role"]).length > 0
          ? options.filter(
              (item) => formValues["role"].indexOf(item.roleTypeId) >= 0
            )
          : formValues["organizationUnit"] &&
            eval(formValues["organizationUnit"]).length > 0
          ? options.filter(
              (item) =>
                formValues["organizationUnit"].indexOf(
                  item.unitOrganizationId
                ) > 0
            )
          : options,
      // changeCallback: (options) =>
      //   setFormValues((prevState) => ({
      //     ...prevState,
      //     position: JSON.stringify(
      //       options.map((opt) => opt.emplPositionId).filter(Boolean)
      //     ),
      //     organizationUnit: JSON.stringify(
      //       options.map((opt) => opt.unitOrganizationId).filter(Boolean)
      //     ),
      //     job: JSON.stringify(options.map((opt) => opt.jobId).filter(Boolean)),
      //     role: JSON.stringify(
      //       options.map((opt) => opt.roleTypeId).filter(Boolean)
      //     ),
      //   })),
    },
    {
      name: "pseudoId",
      label: "کد پرسنلی",
      type: "text",
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
    setFormValues({});
    handleClose();
  }

  return (
    <FormPro
      prepend={formStructure}
      formValues={formValues}
      setFormValues={setFormValues}
      // submitCallback={filterPersonnel}
      // resetCallback={handleReset}
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
