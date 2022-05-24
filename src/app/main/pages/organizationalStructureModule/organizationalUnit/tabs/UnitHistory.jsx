import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import TablePro from "app/main/components/TablePro";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { SERVER_URL } from "configs";
import axios from "axios";

export default function UnitHistory({ partyId }) {
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
      name: "emplPosition",
      label: "درجه",
      type: "text",
    },
    {
      name: "fromDate",
      label: "از تاریخ",
      type: "date",
    },
    {
      name: "thruDate",
      label: "تا تاریخ",
      type: "date",
    },
  ];

  const getOrganizationalUnitHistory = () => {
    setLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/orgStructure/unit/organizationalUnitHistory?partyId=${partyId}`,
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.history);
        setLoading(false);
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت تاریخچه!"));
        setLoading(false);
      });
  };

  useEffect(() => {
    getOrganizationalUnitHistory();
  }, [partyId]);

  return (
    <TablePro
      title="تاریخچه درجه واحد سازمانی"
      loading={loading}
      columns={tableCols}
      rows={tableContent}
      setRows={setTableContent}
    />
  );
}
