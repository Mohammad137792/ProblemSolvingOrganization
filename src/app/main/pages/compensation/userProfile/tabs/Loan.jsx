import React, { useState, useEffect } from "react";
import { Box, Card } from "@material-ui/core";
import TablePro from "app/main/components/TablePro";
import DescriptionIcon from "@material-ui/icons/Description";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "configs";
import axios from "axios";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";

export default function Loan({ partyId, partyRelationshipId }) {
  const [tableContent, setTableContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const tableCols = [
    {
      name: "loanTypeEnum",
      label: "نوع تسهیل مالی",
      type: "select",
    },
    {
      name: "welfareTitle",
      label: "تسهیل مالی",
      type: "render",
      render: (row) => {
        return `${row.welfareCode || ""}-${row.title || ""}`;
      },
    },
    {
      name: "personLoanCode",
      label: "کد تسهیل فرد",
      type: "text",
    },
    {
      name: "loanInstallmentCalculationMethodEnum",
      label: "نحوه بازپرداخت اقساط",
      type: "text",
    },
    {
      name: "finalLoanAmount",
      label: "مبلغ تسهیل مالی",
      type: "text",
    },
    {
      name: "loanFeeAmount",
      label: "کل مبلغ کارمزد",
      type: "text",
    },
    {
      name: "totalInstallmentProfit",
      label: "کل سود",
      type: "text",
    },
    {
      name: "finalInstallmentNumber",
      label: "تعداد اقساط",
      type: "text",
    },
    {
      name: "totalPaidAmount",
      label: "کل مبلغ قابل پرداخت",
      type: "text",
    },
    {
      name: "totalPaidForThisAccompany",
      label: "جمع اقساط پرداخت شده",
      type: "text",
    },
    {
      name: "remainingAmountForThisAccompany",
      label: "باقی مانده تسویه اقساط",
      type: "text",
    },
    {
      name: "requestDate",
      label: "تاریخ درخواست",
      type: "date",
    },
    {
      name: "requestMeetDate",
      label: "تاریخ دریافت",
      type: "date",
    },
  ];

  const getFinancialFacilities = () => {
    setLoading(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/getRequestedLoanInfo",
        {
          personLoanInfo: {
            partyRelationshipId: partyRelationshipId || null,
            inProfile: true,
          },
        },
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data.requestedLoanInfo);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت تسهیلات مالی دریافتی رخ داده است."
          )
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getFinancialFacilities();
  }, []);

  return (
    <Box p={2}>
      <Card>
        <TablePro
          title="لیست تسهیلات مالی دریافتی"
          loading={loading}
          columns={tableCols}
          rows={tableContent}
          setRows={setTableContent}
          exportCsv="لیست تسهیلات مالی دریافتی"
          rowActions={[
            {
              title: "مشاهده",
              icon: DescriptionIcon,
              onClick: (row) => {
                history.push(`/viewRecipient/${row.accompanyId}`);
              },
            },
          ]}
        />
      </Card>
    </Box>
  );
}
