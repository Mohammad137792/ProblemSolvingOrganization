import { Card, CardContent, Box } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import { SERVER_URL } from "configs";
import { useSelector } from "react-redux";
import checkPermis from "app/main/components/CheckPermision";
import axios from "axios";
import ParaclinicalActions from "./tempComponent/ParaclinicalAction";
import ClinicalAttachment from "./tempComponent/ClinicalAttachment";

const ParaclinicsAndReferrals = ({
  bloodExperiment,
  setBloodExperiment,
  paraclinicalAction,
  setParaclinicalAction,
  setMedicalAttachment,
  medicalAttachment,
  medicalNote,
  setMedicalNote,
}) => {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formNoteValues, setFormNoteValues] = useState({ ...medicalNote });
  const [bloodLoading, setbloodLoading] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);

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
      required: true,
      style: { minWidth: "120px" },
    },
    {
      name: "bloodExperimentResultEnumId",
      label: "نتیجه",
      type: "select",
      options: fieldsInfo.bloodExperimentResult,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
      style: { minWidth: "120px" },
    },
    {
      name: "doneDate",
      label: "تاریخ انجام",
      type: "date",
      required: true,
      style: { minWidth: "120px" },
    },
  ];

  const formStructure = [
    {
      name: "MNTExame",
      label: "توضیحات پزشک در مورد آزمایشات",
      type: "textarea",
      col: 12,
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

  const bloodAdd = (newData) => {
    return new Promise((resolve, reject) => {
      resolve(newData);
    });
  };

  const bloodEdit = (editedData) => {
    return new Promise((resolve, reject) => {
      resolve(editedData);
    });
  };

  const bloodRemove = () => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  useEffect(() => {
    getEnumSelectFields();
  }, []);

  useEffect(() => {
    setMedicalNote((prevState) => {
      return {
        ...prevState,
        MNTExame: formNoteValues.MNTExame,
      };
    });
  }, [formNoteValues.MNTExame]);

  return (
    <Card>
      <CardContent>
        <CardContent>
          <TablePro
            title="لیست نتایج آزمایشات"
            columns={bloodTableCols}
            rows={bloodExperiment}
            setRows={setBloodExperiment}
            loading={bloodLoading}
            add="inline"
            addCallback={bloodAdd}
            edit="inline"
            editCallback={bloodEdit}
            removeCallback={bloodRemove}
          />
        </CardContent>
        <Box mb={3} />
        <FormPro
          prepend={formStructure}
          formValues={formNoteValues}
          setFormValues={setFormNoteValues}
        />
        <Box mb={2} />
        <ClinicalAttachment
          datas={datas}
          medicalAttachment={medicalAttachment}
          setMedicalAttachment={setMedicalAttachment}
          tableTitle="نتایج پاراکلینیک انجام شده توسط کارشناس بهداشت حرفه ای"
        />
        <Box mb={2} />
        <ParaclinicalActions
          datas={datas}
          medicalNote={medicalNote}
          setMedicalNote={setMedicalNote}
          fieldsInfo={fieldsInfo}
          paraclinicalAction={paraclinicalAction}
          setParaclinicalAction={setParaclinicalAction}
        />
      </CardContent>
    </Card>
  );
};

export default ParaclinicsAndReferrals;
