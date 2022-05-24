import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import TablePro from "app/main/components/TablePro";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { SERVER_URL } from "configs";
import axios from "axios";

export default function SubUnits({ partyId }) {
  const [tableContent, setTableContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const tableCols = [
    {
      name: "pseudoId",
      label: "کد واحد سازمانی",
      type: "text",
    },
    {
      name: "organizationName",
      label: "عنوان واحد سازمانی",
      type: "text",
    },

    {
      name: "partyClassification",
      label: "سطح واحد سازمانی",
      type: "text",
    },
    {
      name: "organizationTypeEnum",
      label: "نوع واحد سازمانی",
      type: "text",
    },
    {
      name: "ownerName",
      label: "واحد سازمانی بالاتر",
      type: "text",
    },
    {
      name: "disabled",
      label: "وضعیت",
      type: "render",
      render: (row) => {
        return row.disabled == "N" ? "فعال" : "غیر فعال";
      },
    },
    {
      name: "fromDate",
      label: "تاریخ ایجاد",
      type: "date",
    },
  ];

  const getSubOrganizationalUnits = () => {
    setLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/orgStructure/unit/subOrganizationalUnits?partyId=${partyId}`,
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.subUnits);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت لیست واحدهای زیر مجموعه!"
          )
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getSubOrganizationalUnits();
  }, [partyId]);

  return (
    <TablePro
      title="واحدهای زیر مجموعه"
      loading={loading}
      columns={tableCols}
      rows={tableContent}
      setRows={setTableContent}
    />
  );
}
