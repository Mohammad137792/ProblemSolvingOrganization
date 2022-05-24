import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Button, Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "configs";
import axios from "axios";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Attachment from "./../requestForFinancialFacilitation/steps/tempComponent/Attachment";

export default function GuarantorReview({ formVariables, submitCallback }) {
  const [waiting, setWaiting] = useState(false);
  const [attachments, setAttachments] = useState(
    formVariables.guarantor.value?.attachments || []
  );
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [borrowerInformation, setBorrowerInformation] = useState({
    ...formVariables.informationForm?.value,
  });
  const [loanInformation, setLoanInformation] = useState({
    ...formVariables.loanInformation?.value,
  });
  const [installmentCalc, setInstallmentCalc] = useState({
    ...formVariables.installmentCalc?.value,
  });

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
    {
      name: "phoneNumber",
      label: "تلفن همراه متقاضی",
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
      type: "group",
      items: [
        {
          name: "finalLoanAmount",
          label: "مبلغ وام درخواستی",
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

  const installmentCalcStructure = [
    {
      name: "installmentAmount",
      label: "مبلغ اقساط",
      type: "float",
      readOnly: true,
    },
    {
      name: "totalInstallmentProfit",
      label: "کل سود",
      type: "float",
      readOnly: true,
    },
    {
      name: "loanFeeAmount",
      label: "کل مبلغ کارمزد",
      type: "float",
      readOnly: true,
    },
    {
      name: "totalLoanAmount",
      label: "کل مبلغ قابل پرداخت",
      type: "float",
      readOnly: true,
    },
  ];

  const getUomSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/entity/Uom?uomTypeEnumId=WelfareTimePeriod",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            welfareTimePeriod: res.data.result,
          };
        });
      });
  };

  const handleSubmit = () => {
    setWaiting(true);
    const editedguarantors = [...formVariables.guarantors.value];
    const guarantorIndex = formVariables.guarantors.value.findIndex(
      (guarantor) =>
        guarantor?.username == formVariables.guarantor.value.username
    );
    const editedGuarantor = {
      ...formVariables.guarantor.value,
      attachments: attachments.map(
        ({ observeFile, ...keepAttrs }) => keepAttrs
      ),
      statusId: "Confirmation",
      status: "قبول",
    };
    editedguarantors[guarantorIndex] = editedGuarantor;
    const packet = {
      guarantors: editedguarantors,
    };
    submitCallback(packet);
  };

  const handleReject = () => {
    setWaiting(true);
    const editedguarantors = [...formVariables.guarantors.value];
    const guarantorIndex = formVariables.guarantors.value.findIndex(
      (guarantor) =>
        guarantor?.username == formVariables.guarantor.value.username
    );
    const editedGuarantor = {
      ...formVariables.guarantor.value,
      attachments: attachments.map(
        ({ observeFile, ...keepAttrs }) => keepAttrs
      ),
      statusId: "Rejection",
      status: "رد",
    };
    editedguarantors[guarantorIndex] = editedGuarantor;
    const packet = {
      guarantors: editedguarantors,
    };
    submitCallback(packet);
  };

  useEffect(() => {
    getUomSelectFields();
  }, []);

  return (
    <>
      <Box p={2}>
        <CardHeader title={"بررسی ضمانت تسهیل مالی"} />
        <Box p={2} />
        <Card variant="outlined">
          <CardHeader title={"اطلاعات متقاضی تسهیل"} />
          <CardContent>
            <FormPro
              append={borrowerStructure}
              formValues={borrowerInformation}
              setFormValues={setBorrowerInformation}
            />
          </CardContent>
        </Card>
        <Box p={2} />
        <Card>
          <CardContent>
            <CardHeader title={"اطلاعات تسهیل مالی"} />
            <FormPro
              append={loanStructure}
              formValues={loanInformation}
              setFormValues={setLoanInformation}
            />
            <Box p={2} />
            <CardHeader title={"نتیجه محاسبات اقساط"} />
            <FormPro
              append={installmentCalcStructure}
              formValues={installmentCalc}
              setFormValues={setInstallmentCalc}
            />
          </CardContent>
        </Card>
        <Box p={2} />

        <Attachment
          title={"مدارک ضامن"}
          attachments={attachments}
          setAttachments={setAttachments}
          partyContentType={formVariables.guarantor.value?.partyContentType}
        />
        <Box p={2} />
        <ActionBox>
          <Button
            role="primary"
            onClick={handleSubmit}
            disabled={waiting || attachments.length == 0}
            endIcon={waiting ? <CircularProgress size={20} /> : null}
          >
            قبول ضمانت وام
          </Button>
          <Button role="secondary" onClick={handleReject} disabled={waiting}>
            رد ضمانت وام
          </Button>
        </ActionBox>
      </Box>
    </>
  );
}
