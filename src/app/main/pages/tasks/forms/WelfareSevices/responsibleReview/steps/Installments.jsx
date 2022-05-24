import React from "react";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import { Card, CardHeader, CardContent, Box } from "@material-ui/core";
import { useDispatch } from "react-redux";

export default function Installments({
  criteriaLoading,
  installmentLoading,
  installmentCalc,
  setInstallmentCalc,
  criteriaTable,
  setCriteriaTable,
  installmentTable,
  setInstallmentTable,
}) {
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

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

  const criteriaCols = [
    {
      name: "welfareTitle",
      label: "تسهیل مالی انتخابی",
      type: "text",
    },
    {
      name: "criteriaScoreEnum",
      label: "معیار دریافت تسهیل مالی",
      type: "text",
    },
    {
      name: "amount",
      label: "مقدار مورد انتظار",
      type: "number",
    },
    {
      name: "acquiredAmount",
      label: "مقدار اکتسابی متقاضی",
      type: "number",
    },
  ];

  const installmentCols = [
    {
      name: "installmentCode",
      label: "شماره قسط",
      type: "number",
    },
    {
      name: "paymentDate",
      label: "سررسید پرداخت قسط",
      type: "date",
    },
    {
      name: "installmentAmount",
      label: "مبلغ قسط",
      type: "number",
    },
    {
      name: "originalAmount",
      label: "اصل قسط",
      type: "number",
    },
    {
      name: "profitAmount",
      label: "سود قسط",
      type: "number",
    },
    {
      name: "feeAmount",
      label: "کارمزد قسط",
      type: "number",
    },
  ];

  return (
    <>
      <CardHeader title={"نتیجه محاسبه اقساط و وضعیت متقاضی تسهیل مالی"} />
      <Card variant="outlined">
        <CardContent>
          <TablePro
            title="معیارهای دریافت تسهیل مالی"
            loading={criteriaLoading}
            columns={criteriaCols}
            rows={criteriaTable}
            setRows={setCriteriaTable}
          />
        </CardContent>
      </Card>
      <Box p={2} />
      <Card variant="outlined">
        <CardContent>
          <CardHeader title={"نتیجه محاسبات اقساط"} />
          <FormPro
            append={installmentCalcStructure}
            formValues={installmentCalc}
            setFormValues={setInstallmentCalc}
          />
          <Box p={2} />
          <TablePro
            title="اطلاعات اقساط"
            loading={installmentLoading}
            columns={installmentCols}
            rows={installmentTable}
            setRows={setInstallmentTable}
          />
        </CardContent>
      </Card>
    </>
  );
}
