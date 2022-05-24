import React, { useState, useEffect } from "react";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import checkPermis from "app/main/components/CheckPermision";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "configs";
import axios from "axios";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";

export default function LoanInformation({
  fieldsInfo,
  formValues,
  setFormValues,
  infoSubmit,
  inResponsibleStep,
}) {
  const [formValidation, setFormValidation] = useState({});
  const datas = useSelector(({ fadak }) => fadak);
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "trackingCode",
      label: "کد رهگیری",
      type: "text",
      readOnly: true,
    },
    {
      name: "starterInfo",
      label: "درخواست دهنده",
      type: "text",
      readOnly: true,
    },
    {
      name: "starterEmplPositionId",
      label: "پست سازمانی درخواست دهنده",
      type: "select",
      options: fieldsInfo.starterEmplPositions,
      optionIdField: "emplPositionId",
      optionLabelField: "description",
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.description}` || "؟",
      required: true,
      readOnly: inResponsibleStep,
    },
    {
      name: "requestDate",
      label: "تاریخ درخواست",
      type: "date",
      readOnly: true,
    },
    {
      name: "applicantEmplPositionId",
      label: "پست سازمانی متقاضی تسهیل مالی",
      type: "select",
      options: fieldsInfo.companyEmplPositions,
      optionIdField: "emplPositionId",
      optionLabelField: "description",
      // display: checkPermis(
      //   "welfareServices/financialFacilities/requestForFinancialFacility/applicant",
      //   datas
      // ),
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.description}` || "؟",
      changeCallback: () =>
        !inResponsibleStep &&
        setFormValues((prevState) => ({
          ...prevState,
          applicantPartyRelationshipId: null,
        })),
      readOnly:
        !checkPermis(
          "welfareServices/financialFacilities/requestForFinancialFacility/applicant",
          datas
        ) || inResponsibleStep,
    },
    {
      name: "applicantPartyRelationshipId",
      label: "متقاضی تسهیل مالی",
      type: "select",
      options: fieldsInfo.companyPesonnel,
      optionIdField: "partyRelationshipId",
      optionLabelField: "fullName",
      // display: checkPermis(
      //   "welfareServices/financialFacilities/requestForFinancialFacility/applicant",
      //   datas
      // ),
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.fullName}` || "؟",
      filterOptions: (options) =>
        formValues.applicantEmplPositionId
          ? options.filter(
              (item) =>
                item.emplPositionId == formValues.applicantEmplPositionId
            )
          : options,
      changeCallback: (options) =>
        !inResponsibleStep &&
        setFormValues((prevState) => ({
          ...prevState,
          applicantEmplPositionId: options?.emplPositionId,
        })),
      readOnly:
        !checkPermis(
          "welfareServices/financialFacilities/requestForFinancialFacility/applicant",
          datas
        ) || inResponsibleStep,
    },
    {
      name: "loanTypeEnumId",
      label: "نوع تسهیل مالی",
      type: "select",
      options: fieldsInfo.loanType,
      optionLabelField: "description",
      optionIdField: "enumId",
      changeCallback: () => {
        !inResponsibleStep &&
          setFormValues((prevState) => ({
            ...prevState,
            welfareId: null,
            installmentCalculationMethodEnumId: null,
            installmentGap: null,
            installmentGapUomId: null,
            internalAmount: null,
            externalAmount: null,
          }));
      },
      readOnly: inResponsibleStep,
    },
    {
      name: "welfareId",
      label: "انتخاب تسهیل مالی",
      type: "select",
      required: true,
      options: fieldsInfo.welfare,
      optionIdField: "welfareId",
      optionLabelField: "title",
      otherOutputs: [
        { name: "welfareCode", optionIdField: "welfareCode" },
        { name: "title", optionIdField: "title" },
      ],
      getOptionLabel: (opt) => `${opt.welfareCode} ─ ${opt.title}` || "؟",
      filterOptions: (options) =>
        formValues["loanTypeEnumId"] && formValues["loanTypeEnumId"] != null
          ? options.filter(
              (item) => item.loanTypeEnumId == formValues["loanTypeEnumId"]
            )
          : options,
      changeCallback: (options) => {
        !inResponsibleStep &&
          setFormValues((prevState) => ({
            ...prevState,
            loanTypeEnumId: options?.loanTypeEnumId,
            installmentCalculationMethodEnumId:
              options?.installmentCalculationMethodEnumId,
            installmentGap: options?.installmentGap,
            installmentGapUomId: options?.installmentGapUomId,
          }));
      },
      readOnly: inResponsibleStep,
    },
    {
      name: "internalAmount",
      label: "تعداد ضامن های داخلی موردنیاز",
      type: "number",
      readOnly: true,
    },
    {
      name: "externalAmount",
      label: " تعداد ضامن های خارجی موردنیاز",
      type: "number",
      readOnly: true,
    },
    {
      name: "installmentCalculationMethodEnumId",
      label: "نحوه بازپرداخت اقساط",
      type: "select",
      options: fieldsInfo.installmentCalculationMethod,
      optionLabelField: "description",
      optionIdField: "enumId",
      readOnly: true,
    },
    {
      type: "group",
      items: [
        {
          name: "installmentGap",
          label: "فاصله زمانی بین پرداخت اقساط",
          type: "number",
          readOnly: true,
        },
        {
          name: "installmentGapUomId",
          label: " دوره",
          type: "select",
          options: fieldsInfo.welfareTimePeriod,
          optionLabelField: "description",
          optionIdField: "uomId",
          fullWidth: false,
          readOnly: true,
          style: { minWidth: "20px" },
        },
      ],
    },

    {
      type: "group",
      items: [
        {
          name: "finalLoanAmount",
          label: "مبلغ وام درخواستی",
          type: "float",
          required: true,
        },
        {
          label: "ریال",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
    },

    {
      name: "finalInstallmentNumber",
      label: "تعداد اقساط",
      type: "number",
      required: true,
    },
    {
      name: "requestMeetDate",
      label: "تاریخ دریافت تسهیل",
      type: "date",
      required: true,
    },
    {
      name: "purpose",
      label: "دلیل تقاضا",
      type: "textarea",
      required: true,
      col: 12,
    },
  ];

  const fakeSubmit = () => {};

  useEffect(() => {
    if (!inResponsibleStep) {
      if (formValues?.welfareId) {
        axios
          .get(
            SERVER_URL +
              `/rest/s1/welfare/guarantorInfo?welfareId=${
                formValues?.welfareId
              }&partyRelationshipId=${
                formValues.applicantPartyRelationshipId ||
                formValues.starterPartyRelationshipId
              }`,
            axiosKey
          )
          .then((res) => {
            setFormValues((prevState) => ({
              ...prevState,
              internalAmount: res.data?.internalAmount,
              externalAmount: res.data?.externalAmount,
              responsibleEmplPositionId: res.data?.responsibleEmplPositionId,
              welfareGroupPartyClassificationId:
                res.data?.welfareGroupPartyClassificationId,
            }));
          })
          .catch(() => {
            dispatch(
              setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت تعداد ضامن‌ها!")
            );
          });
      } else {
        setFormValues((prevState) => ({
          ...prevState,
          internalAmount: null,
          externalAmount: null,
        }));
      }
    }
  }, [formValues.welfareId, formValues.applicantPartyRelationshipId]);

  return (
    <>
      <FormPro
        append={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        formValidation={formValidation}
        setFormValidation={setFormValidation}
        submitCallback={() => {
          fakeSubmit();
        }}
        actionBox={
          <ActionBox style={{ display: "none" }}>
            <Button role="primary" type="submit" ref={infoSubmit}>
              مرحله بعد{" "}
            </Button>
          </ActionBox>
        }
      />
    </>
  );
}
