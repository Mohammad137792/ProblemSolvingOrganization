import { Card, CardContent, Box } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import FormPro from "../../../../../../../components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import { SERVER_URL } from "configs";
import axios from "axios";
import ParaclinicalActions from "./ParaclinicalAction";

const Referrals = ({ bloodExperiment, paraclinicalAction }) => {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [bloodTable, setBloodTable] = useState([...bloodExperiment]);
  const [bloodLoading, setbloodLoading] = useState(false);
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const bloodTableCols = [
    {
      name: "bloodExperimentEnumId",
      label: "عامل مورد آزمایش",
      type: "select",
      options: fieldsInfo.bloodExperiment,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
    {
      name: "bloodExperimentResultEnumId",
      label: "نتیجه",
      type: "select",
      options: fieldsInfo.bloodExperimentResult,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
    {
      name: "doneDate",
      label: "تاریخ انجام",
      type: "date",
      style: { minWidth: "120px" },
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=BloodExperiment,BloodExperimentResult,ParaAction",
        axiosKey
      )
      .then((res) => {
        const selectFields = {};
        selectFields.bloodExperiment = res.data.enums.BloodExperiment;
        selectFields.bloodExperimentResult =
          res.data.enums.BloodExperimentResult;
        selectFields.paraAction = res.data.enums.ParaAction;
        setFieldsInfo(selectFields);
      });
  };

  useEffect(() => {
    getEnumSelectFields();
  }, []);

  return (
    <Card>
      <CardContent>
        <CardContent>
          <TablePro
            title="لیست نتایج آزمایشات"
            columns={bloodTableCols}
            rows={bloodTable}
            setRows={setBloodTable}
            loading={bloodLoading}
          />
        </CardContent>
        <Box mb={3} />
        <ParaclinicalActions
          paraclinicalAction={paraclinicalAction}
          fieldsInfo={fieldsInfo}
        />
      </CardContent>
    </Card>
  );
};

export default Referrals;
