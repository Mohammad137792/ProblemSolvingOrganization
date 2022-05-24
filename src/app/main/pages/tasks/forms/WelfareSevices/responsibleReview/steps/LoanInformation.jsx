import React, { useState } from "react";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import { Card, CardHeader, CardContent, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";

export default function LoanInformation({
  infoSubmit,
  fieldsInfo,
  borrowerInformation,
  setBorrowerInformation,
  loanInformation,
  setLoanInformation,
}) {
  const [formValidation, setFormValidation] = useState({});
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const borrowerStructure = [
    {
      name: "trackingCode",
      label: "کد رهگیری",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "starterInfo",
      label: "درخواست دهنده",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "starterEmplPosition",
      label: "پست سازمانی درخواست دهنده",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "requestDate",
      label: "تاریخ درخواست",
      type: "date",
      readOnly: true,
      col: 4,
    },
    {
      name: "applicantEmplPosition",
      label: "پست سازمانی متقاضی تسهیل مالی",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "applicantFullName",
      label: "متقاضی تسهیل مالی",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "welfareTitle",
      label: "تسهیل مالی",
      type: "text",
      readOnly: true,
      col: 4,
    },
  ];

  const loanStructure = [
    {
      name: "loanTypeEnum",
      label: "نوع تسهیل مالی",
      type: "text",
      readOnly: true,
    },
    {
      type: "group",
      items: [
        {
          name: "loanAmountLimit",
          label: "حداکثر مبلغ تسهیل مالی",
          type: "float",
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
          type: "float",
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
          type: "float",
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
          type: "float",
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

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <FormPro
            append={borrowerStructure}
            formValues={borrowerInformation}
            setFormValues={setBorrowerInformation}
          />
        </CardContent>
      </Card>
      <CardHeader title={"اطلاعات درخواست"} />
      <FormPro
        append={loanStructure}
        formValues={loanInformation}
        setFormValues={setLoanInformation}
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
