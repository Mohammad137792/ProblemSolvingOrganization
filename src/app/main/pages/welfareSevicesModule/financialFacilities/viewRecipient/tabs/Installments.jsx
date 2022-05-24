import React, { useEffect } from "react";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import { Button, CardHeader, Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "configs";
import { Image } from "@material-ui/icons";

export default function Installments({
  criteriaLoading,
  installmentLoading,
  setInstallmentLoading,
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
      name: "finalLoanAmount",
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

  const installmentCols = [
    {
      name: "installmentCode",
      label: "شماره قسط",
      type: "number",
    },
    {
      name: "orginalInstallmentCode",
      label: "شماره قسط اصلی",
      type: "number",
    },
    {
      name: "installmentCalculationMethodEnum",
      label: "نحوه بازپرداخت",
      type: "text",
    },
    {
      name: "payslipCode",
      label: "شماره فیش",
      type: "text",
    },
    {
      name: "paymentDate",
      label: "سر رسید پرداخت قسط",
      type: "date",
    },
    {
      name: "actualPaymentDate",
      label: "تاریخ پرداخت قسط",
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
    {
      name: "paidInstallmentAmount",
      label: "مبلغ پرداخت شده",
      type: "number",
    },
    {
      name: "installmentPenaltyAmount",
      label: "مبلغ جریمه دیرکرد پرداخت",
      type: "number",
    },
    {
      name: "status",
      label: "وضعیت پرداخت",
      type: "text",
    },
    {
      name: "responsibleFullName",
      label: "تسویه کننده",
      type: "render",
      render: (row) => {
        return `${row.responsibleFirstName || ""} ${
          row.responsibleLastName || ""
        }`;
      },
    },
    {
      name: "responsibleEmplPosition",
      label: "پست سازمانی تسویه کننده",
      type: "text",
    },
    {
      name: "observeFile",
      label: "دانلود فایل",
      style: { width: "20%" },
    },
  ];

  const getInstallmentAttach = () => {
    setInstallmentLoading(true);
    if (installmentTable?.length > 0) {
      let tableDataArray = [];
      [...installmentTable].map((item, index) => {
        let data = item.contentLocation
          ? {
              ...item,
              observeFile: (
                <Button
                  variant="outlined"
                  color="primary"
                  href={
                    SERVER_URL +
                    "/rest/s1/fadak/getpersonnelfile1?name=" +
                    item?.contentLocation
                  }
                  target="_blank"
                >
                  {" "}
                  <Image />{" "}
                </Button>
              ),
            }
          : { ...item };
        tableDataArray.push(data);
        if (index == installmentTable?.length - 1) {
          setInstallmentTable(tableDataArray);
          setInstallmentLoading(false);
        }
      });
    } else {
      setInstallmentTable([]);
      setInstallmentLoading(false);
    }
  };

  useEffect(() => {
    getInstallmentAttach();
  }, []);

  return (
    <>
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
    </>
  );
}
