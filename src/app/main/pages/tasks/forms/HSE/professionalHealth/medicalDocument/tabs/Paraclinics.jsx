import { Card, CardContent, Box } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import FormPro from "../../../../../../../components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import { SERVER_URL } from "configs";
import axios from "axios";

const Paraclinics = ({ optometry, spirometry, audiometry, MNTHealthNote }) => {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({ MNTHealth: MNTHealthNote });
  const [optometryTableContent, setOptometryTableContent] = useState([
    ...optometry,
  ]);
  const [optometryLoading, setOptometryLoading] = useState(false);
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const optometryTableCols = [
    {
      name: "stereopsis",
      label: "دید عمیق",
      type: "number",
      style: { minWidth: "120px" },
    },
    {
      name: "optometryEnumId",
      label: "معیار در حال بررسی",
      type: "select",
      options: fieldsInfo.optometry,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
    {
      name: "eyeEnumId",
      label: "چشم",
      type: "select",
      options: fieldsInfo.eye,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
    {
      name: "eyeModeEnumId",
      label: "نوع",
      type: "select",
      options: fieldsInfo.eyeMode,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
  ];

  const formStructure = [
    {
      type: "component",
      component: <Spirometry fieldsInfo={fieldsInfo} spirometry={spirometry} />,
      col: 12,
    },
    {
      type: "component",
      component: <Audiometry fieldsInfo={fieldsInfo} audiometry={audiometry} />,
      col: 12,
    },
    {
      name: "MNTHealth",
      label: "توضیحات نهایی و ملاحظات کارشناس بهداشت حرفه ای",
      type: "textarea",
      col: 12,
    },
  ];
  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=Optometry,Eye,EyeMode,Spirometry,SpirometryMode,HearingField,SignalType,Frequency,SpeechAudiometry,AudiometryMode",
        axiosKey
      )
      .then((res) => {
        const selectFields = {};
        selectFields.optometry = res.data.enums.Optometry;
        selectFields.eye = res.data.enums.Eye;
        selectFields.eyeMode = res.data.enums.EyeMode;
        selectFields.spirometry = res.data.enums.Spirometry;
        selectFields.spirometryMode = res.data.enums.SpirometryMode;
        selectFields.hearingField = res.data.enums.HearingField;
        selectFields.signalType = res.data.enums.SignalType;
        selectFields.frequency = res.data.enums.Frequency;
        selectFields.speechAudiometry = res.data.enums.SpeechAudiometry;
        selectFields.audiometryMode = res.data.enums.AudiometryMode;
        setFieldsInfo(selectFields);
      });
  };

  useEffect(() => {
    getEnumSelectFields();
  }, []);

  return (
    <Card>
      <CardContent>
        <Card>
          <CardContent>
            <TablePro
              title="اپتومتری"
              columns={optometryTableCols}
              rows={optometryTableContent}
              setRows={setOptometryTableContent}
              loading={optometryLoading}
            />
          </CardContent>
        </Card>
        <Box mb={2} />
        <FormPro
          prepend={formStructure}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </CardContent>
    </Card>
  );
};

export default Paraclinics;

function Spirometry({ spirometry, fieldsInfo }) {
  const [spirometryTableContent, setSpirometryTableContent] = useState([
    ...spirometry,
  ]);
  const [loading, setLoading] = useState(false);

  const tableCols = [
    {
      name: "spirometryEnumId",
      label: "معیار در حال بررسی",
      type: "select",
      options: fieldsInfo.spirometry,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
    {
      name: "spirometryAmount",
      label: "مقدار",
      type: "number",
      style: { minWidth: "120px" },
    },
    {
      name: "spirometryModeEnumId",
      label: "نوع",
      type: "select",
      options: fieldsInfo.spirometryMode,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
  ];

  return (
    <Card>
      <CardContent>
        <TablePro
          title="اسپیرومتری"
          columns={tableCols}
          rows={spirometryTableContent}
          setRows={setSpirometryTableContent}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}

function Audiometry({ audiometry, fieldsInfo }) {
  const [audiometryTableContent, setAudiometryTableContent] = useState([
    ...audiometry,
  ]);
  const [loading, setLoading] = useState(false);

  const tableCols = [
    {
      name: "hearingFieldEnumId",
      label: "میدان شنوایی",
      type: "select",
      options: fieldsInfo.hearingField,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
    {
      name: "signalTypeEnumId",
      label: "نوع سیگنال",
      type: "select",
      options: fieldsInfo.signalType,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
    {
      name: "frquencyEnumId",
      label: "میزان فرکانس",
      type: "select",
      options: fieldsInfo.frequency,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
    {
      name: "frquencyAmount",
      label: "مقدار",
      type: "number",
      style: { minWidth: "120px" },
    },
    {
      name: "speachAudiometryEnumId",
      label: "نوع آدیومتری گفتاری",
      type: "select",
      options: fieldsInfo.speechAudiometry,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
    {
      name: "speachAudiometryAmount",
      label: "مقدار آدیومتری گفتاری",
      type: "number",
      style: { minWidth: "120px" },
    },
    {
      name: "audiometryModeEnumId",
      label: "نوع",
      type: "select",
      options: fieldsInfo.audiometryMode,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
  ];

  return (
    <Card>
      <CardContent>
        <TablePro
          title="اودیومتری"
          columns={tableCols}
          rows={audiometryTableContent}
          setRows={setAudiometryTableContent}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}
