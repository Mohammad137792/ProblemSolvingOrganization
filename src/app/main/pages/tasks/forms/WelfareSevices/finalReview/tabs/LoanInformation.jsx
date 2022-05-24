import React from "react";
import FormPro from "app/main/components/formControls/FormPro";
import { CardHeader } from "@material-ui/core";
import { useDispatch } from "react-redux";

export default function LoanInformation({
  fieldsInfo,
  loanInformation,
  setLoanInformation,
}) {
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const loanStructure = [
    {
      name: "loanTypeEnum",
      label: "نوع تسهیل مالی",
      type: "text",
      readOnly: true,
    },
    {
      name: "welfareTitle",
      label: "تسهیل مالی",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      type: "group",
      items: [
        {
          name: "loanAmountLimit",
          label: "حداکثر مبلغ تسهیل مالی",
          type: "number",
          readOnly: true,
        },
        {
          label: "ریال",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
      col: 4,
    },
    {
      name: "financialFacilityType",
      label: "منبع تسهیل",
      type: "text",
      readOnly: true,
    },
    {
      type: "group",
      items: [
        {
          name: "loanInterestAmount",
          label: "نرخ بهره سالیانه",
          type: "number",
          readOnly: true,
        },
        {
          label: "درصد",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
    },
    {
      type: "group",
      items: [
        {
          name: "loanFeeAmount",
          label: "نرخ کارمزد سالیانه",
          type: "number",
          readOnly: true,
        },
        {
          label: "درصد",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
    },
    {
      type: "group",
      items: [
        {
          name: "loanPenaltyAmount",
          label: "نرخ جریمه",
          type: "number",
          readOnly: true,
        },
        {
          label: "درصد",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
    },
    {
      type: "group",
      items: [
        {
          name: "breathingPeriod",
          label: "دوره تنفس",
          type: "number",
          readOnly: true,
        },
        {
          name: "breathingUomId",
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
      name: "maxInstallmentNumber",
      label: "حداکثر تعداد اقساط",
      type: "number",
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
      name: "installmentCalculationMethodEnum",
      label: "نحوه بازپرداخت اقساط",
      type: "text",
      readOnly: true,
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
      type: "group",
      items: [
        {
          name: "finalLoanAmount",
          label: "مبلغ وام درخواستی",
          type: "number",
          readOnly: true,
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
      readOnly: true,
    },
    {
      name: "requestMeetDate",
      label: "تاریخ دریافت تسهیل",
      type: "date",
      readOnly: true,
    },
    {
      name: "purpose",
      label: "دلیل تقاضا",
      type: "textarea",
      readOnly: true,
      col: 12,
    },
  ];

  return (
    <>
      <CardHeader title={"اطلاعات درخواست"} />
      <FormPro
        append={loanStructure}
        formValues={loanInformation}
        setFormValues={setLoanInformation}
      />
    </>
  );
}
