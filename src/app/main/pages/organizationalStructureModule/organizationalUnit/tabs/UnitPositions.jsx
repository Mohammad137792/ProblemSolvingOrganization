import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import TablePro from "app/main/components/TablePro";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import { SERVER_URL } from "configs";
import axios from "axios";

export default function UnitPositions({ partyId }) {
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
      label: "پست سازمانی",
      type: "render",
      render: (row) => {
        return `${row.pseudoId || ""}-${row.description || ""}`;
      },
    },
    {
      name: "emplPosition",
      label: "شغل پست سازمانی",
      type: "render",
      render: (row) => {
        return `${row.jobCode || ""}-${row.jobTitle || ""}`;
      },
    },
  ];

  const getOrganizationalUnitPositions = () => {
    setLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/orgStructure/unit/organizationalUnitPositions?partyId=${partyId}`,
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.emplPositions);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت لیست پست‌های سازمانی!"
          )
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getOrganizationalUnitPositions();
  }, [partyId]);

  return (
    <TablePro
      title="پست‌های سازمانی"
      loading={loading}
      columns={tableCols}
      rows={tableContent}
      setRows={setTableContent}
    />
  );
}
