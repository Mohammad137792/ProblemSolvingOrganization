import React, { useEffect, useState } from "react";
import TablePro from "../../../../../components/TablePro";
import { SERVER_URL } from "configs";
import axios from "../../../../../api/axiosRest";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../store/actions/fadak";
import { useSelector, useDispatch } from "react-redux";

export default function SettingsFactors({ formVariables, set_formVariables }) {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [tableContent, setTableContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const dispatch = useDispatch();

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const tableColumns = [
    {
      name: "title",
      label: "عامل حقوق",
      type: "text",
      style: { width: "7.5%" },
      readOnly: true,
    },
    {
      name: "PayGroupFactorDescription",
      label: "گروه عامل حقوق",
      type: "text",
      style: { width: "7.5%" },
      readOnly: true,
    },
    {
      name: "isDeduct",
      label: "نوع عامل حقوق",
      type: "select",
      options: [
        { desc: "معوقات", id: "Y" },
        { desc: "کسورات", id: "N" },
      ],
      optionLabelField: "desc",
      optionIdField: "id",
      style: { width: "7.5%" },
      readOnly: true,
    },
    {
      name: "calcTypeDescription",
      label: "نوع محاسبات",
      type: "text",
      style: { width: "15%" },
      readOnly: true,
    },
    {
      name: "arrearsPay",
      label: "پرداخت معوقات",
      type: "indicator",
      style: { width: "5%" },
      disabaled: true,
    },
    {
      name: "id5",
      label: "باز خرید از تاریخ",
      type: "date",
      style: { width: "10%" },
    },
    {
      name: "id7",
      label: "باز خرید تا تاریخ",
      type: "date",
      style: { width: "10%" },
    },
    {
      name: "id8",
      label: "درصد باز خرید",
      type: "number",
      style: { width: "40%" },
    },
  ];

  useEffect(() => {
    if (formVariables?.payslipPaygroupList) {
      setTableContent(formVariables.payslipPaygroupList);
      setLoading(false);
    }
  }, [formVariables]);

  useEffect(() => {
    if (editing) {
      set_formVariables({
        ...formVariables,
        payslipPaygroupList: tableContent,
      });
      setEditing(false);
    }
  }, [tableContent]);

  const getData = () => {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/payroll/GetPagOpt?PayslipTypeId=${formVariables?.payslipTypeId}&PayGroup=${formVariables?.partyClassificationId}`,
        axiosKey
      )
      .then((res) => {
        /* todo: rest? */
        setTableContent(res.data.PayGroupOpt);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت اطلاعات رخ داده است."
          )
        );
      });
  };

  const handleEdit = (newData, oldData) => {
    return new Promise((resolve, reject) => {
      setEditing(true);
      resolve(newData);
    });
  };

  return (
    <TablePro
      rows={tableContent}
      setRows={setTableContent}
      loading={loading}
      columns={tableColumns}
      showTitleBar={false}
      edit="inline"
      editCallback={handleEdit}
    />
  );
}
