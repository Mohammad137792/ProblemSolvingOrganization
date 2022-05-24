import React from "react";
import FormPro from "../../components/formControls/FormPro";
import ActionBox from "../../components/ActionBox";
import { Button } from "@material-ui/core";
import FilterHistory from "../../components/FilterHistory";

export default function PersonnelFilterForm({
  search,
  formValues,
  setFormValues,
  formDefaultValues = {},
  organizations,
  handleClose,
}) {
  const fValue = JSON.parse(formValues.organizationPartyId);
  const disableAccess = () =>
    fValue.length == 0 ||
    fValue.some(
      (item) => item != JSON.parse(formDefaultValues.organizationPartyId)[0]
    );
  // +formValues.organizationPartyId !== formDefaultValues.organizationPartyId ;
  const formStructure = [
    {
      name: "pseudoId",
      label: "کد پرسنلی",
      type: "text",
    },
    {
      name: "firstName",
      label: "نام پرسنل",
      type: "text",
    },
    {
      name: "lastName",
      label: "نام خانوادگی پرسنل",
      type: "text",
    },
    {
      name: "suffix",
      label: "پسوند پرسنل",
      type: "text",
    },
    {
      name: "relationshipTypeEnumId",
      label: "نوع ارتباط",
      type: "select",
      options: [
        { enumId: "PrtEmployee", description: "کارمند" },
        { enumId: "prtInstructor", description: "مدرس" },
      ],
    },
    {
      name: "organizationPartyId",
      label: "شرکت",
      type: "multiselect",
      options: organizations,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
    },
    {
      name: "personnelArea",
      label: "منطقه فعالیت",
      type: "multiselect",
      options: "ActivityArea",
      optionIdField: "partyClassificationId",
      disabled: disableAccess(),
    },
    {
      name: "personnelSubArea",
      label: "حوزه کاری",
      type: "multiselect",
      options: "ExpertiseArea",
      optionIdField: "partyClassificationId",
      disabled: disableAccess(),
    },
    {
      name: "personnelGroupId",
      label: "گروه پرسنلی",
      type: "multiselect",
      options: "EmployeeGroups",
      optionIdField: "partyClassificationId",
      disabled: disableAccess(),
      changeCallback: () => {
        setFormValues((prevState) => ({
          ...prevState,
          personnelSubGroup: null,
        }));
      },
    },
    {
      name: "personnelSubGroup",
      label: "زیرگروه پرسنلی",
      type: "multiselect",
      options: "EmployeeSubGroups",
      optionIdField: "partyClassificationId",
      filterOptions: (options) =>
        formValues["personnelGroupId"] &&
        eval(formValues["personnelGroupId"]).length > 0
          ? options.filter(
              (item) =>
                formValues["personnelGroupId"].indexOf(
                  item.parentClassificationId
                ) >= 0
            )
          : options,
      disabled: disableAccess(),
    },
    {
      name: "costCenter",
      label: "مرکز هزینه",
      type: "multiselect",
      options: "CostCenter",
      optionIdField: "partyClassificationId",
      disabled: disableAccess(),
    },
    {
      name: "organizationUnit",
      label: "واحد سازمانی",
      type: "multiselect",
      options: "OrganizationUnit",
      optionIdField: "partyId",
      optionLabelField: "organizationName",
      disabled: disableAccess(),
    },
    {
      name: "emplPositionId",
      label: "پست سازمانی",
      type: "multiselect",
      options: "EmplPosition",
      optionIdField: "emplPositionId",
      filterOptions: (options) =>
        formValues["role"] && eval(formValues["role"]).length > 0
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
      disabled: disableAccess(),
    },
    {
      name: "role",
      label: "نقش سازمانی",
      type: "multiselect",
      options: "Role",
      optionIdField: "roleTypeId",
      optionLabelField: "description",
      disabled: disableAccess(),
    },
  ];

  React.useEffect(() => {
    if (disableAccess()) {
      setFormValues((prevState) => ({
        ...prevState,
        personnelArea: null,
        personnelSubArea: null,
        personnelGroup: null,
        personnelSubGroup: null,
        costCenter: null,
        organizationUnit: null,
        emplPositionId: null,
      }));
    }
  }, [formValues.organizationPartyId]);

  function handle_submit() {
    search();
    handleClose();
  }
  function handle_reset() {
    search("res");
    setFormValues(formDefaultValues);
    handleClose();
  }
  return (
    <FormPro
      prepend={formStructure}
      formDefaultValues={formDefaultValues}
      formValues={formValues}
      setFormValues={setFormValues}
      // submitCallback={handle_submit}
      // resetCallback={handle_reset}
      actionBox={
        <ActionBox>
          <Button type="button" role="primary" onClick={handle_submit}>
            اعمال فیلتر
          </Button>
          <Button type="button" role="secondary" onClick={handle_reset}>
            لغو
          </Button>
          <FilterHistory
            role="tertiary"
            formValues={formValues}
            setFormValues={setFormValues}
            filterType={"filter_search_personnel"}
            loadCallback={(val) => search(val)}
          />
        </ActionBox>
      }
    />
  );
}
