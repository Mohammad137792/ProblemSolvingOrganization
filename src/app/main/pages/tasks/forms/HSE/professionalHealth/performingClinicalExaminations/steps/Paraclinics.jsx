import { Card, CardContent, Box } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import { SERVER_URL } from "configs";
import axios from "axios";
import checkPermis from "app/main/components/CheckPermision";
import { useSelector } from "react-redux";

const Paraclinics = ({
  optometryTableContent,
  setOptometryTableContent,
  spirometryTableContent,
  setSpirometryTableContent,
  audiometryTableContent,
  setAudiometryTableContent,
  medicalNote,
  setMedicalNote,
}) => {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({ ...medicalNote });
  const [optometryLoading, setOptometryLoading] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);

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
      required: true,
      style: { minWidth: "120px" },
    },
    {
      name: "optometryEnumId",
      label: "معیار در حال بررسی",
      type: "select",
      options: fieldsInfo.optometry,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
      style: { minWidth: "120px" },
    },
    {
      name: "eyeEnumId",
      label: "چشم",
      type: "select",
      options: fieldsInfo.eye,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
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
      name: "MNTOptometeri",
      label: "تفسیر کارشناس در مورد ارزیابی اپتومتری",
      type: "textarea",
      col: 12,
    },
    {
      type: "component",
      component: (
        <Spirometry
          datas={datas}
          fieldsInfo={fieldsInfo}
          spirometryTableContent={spirometryTableContent}
          setSpirometryTableContent={setSpirometryTableContent}
        />
      ),
      col: 12,
    },
    {
      name: "MNTEspirometeri",
      label: "تفسیر کارشناس در مورد ارزیابی اسپیرومتری",
      type: "textarea",
      col: 12,
    },
    {
      type: "component",
      component: (
        <Audiometry
          datas={datas}
          fieldsInfo={fieldsInfo}
          audiometryTableContent={audiometryTableContent}
          setAudiometryTableContent={setAudiometryTableContent}
        />
      ),
      col: 12,
    },
    {
      name: "MNTAudiometeri",
      label: "تفسیر کارشناس در مورد ارزیابی اودیومتری",
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

  const setStereopsis = (data) => {
    const oldStereopsis = optometryTableContent.find((opt) => opt.stereopsis);
    const hasStereopsis =
      data.stereopsis && data.stereopsis !== oldStereopsis?.stereopsis
        ? data.stereopsis
        : oldStereopsis?.stereopsis;
    data.stereopsis = hasStereopsis;
    const tableContent = [...optometryTableContent];
    tableContent.map((row) => (row.stereopsis = hasStereopsis));
    setOptometryTableContent(tableContent);
  };

  const optometryAdd = (newData) => {
    return new Promise((resolve, reject) => {
      setStereopsis(newData);
      resolve(newData);
    });
  };

  const optometryEdit = (editedData) => {
    return new Promise((resolve, reject) => {
      setStereopsis(editedData);
      resolve(editedData);
    });
  };

  const optometryRemove = () => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  useEffect(() => {
    getEnumSelectFields();
  }, []);

  // useEffect(() => {
  //   const hasStereopsis = optometryTableContent.find((opt) => opt.stereopsis);
  //   console.log(hasStereopsis, "hasStereopsis");
  //   const tableContent = [...optometryTableContent];
  //   tableContent.map((row) => (row.stereopsis = hasStereopsis.stereopsis));
  //   setOptometryTableContent(tableContent);
  //   setOptometryLoading(false);
  // }, [optometryLoading == true]);

  useEffect(() => {
    setMedicalNote((prevState) => {
      return {
        ...prevState,
        MNTOptometeri: formValues.MNTOptometeri,
        MNTEspirometeri: formValues.MNTEspirometeri,
        MNTAudiometeri: formValues.MNTAudiometeri,
      };
    });
  }, [
    formValues.MNTOptometeri,
    formValues.MNTEspirometeri,
    formValues.MNTAudiometeri,
  ]);

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
              add="inline"
              addCallback={optometryAdd}
              // addForm={<SpirometryForm />}
              edit="inline"
              editCallback={optometryEdit}
              // editForm={<SpirometryForm  />}
              removeCallback={optometryRemove}
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

function Spirometry({
  datas,
  spirometryTableContent,
  setSpirometryTableContent,
  fieldsInfo,
}) {
  const [loading, setLoading] = useState(false);

  const tableCols = [
    {
      name: "spirometryEnumId",
      label: "معیار در حال بررسی",
      type: "select",
      options: fieldsInfo.spirometry,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
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

  const spirometryAdd = (newData) => {
    return new Promise((resolve, reject) => {
      resolve(newData);
    });
  };

  const spirometryEdit = (editedData) => {
    return new Promise((resolve, reject) => {
      resolve(editedData);
    });
  };

  const spirometryRemove = () => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  return (
    <Card>
      <CardContent>
        <TablePro
          title="اسپیرومتری"
          columns={tableCols}
          rows={spirometryTableContent}
          setRows={setSpirometryTableContent}
          loading={loading}
          add="inline"
          addCallback={spirometryAdd}
          edit="inline"
          editCallback={spirometryEdit}
          removeCallback={spirometryRemove}
        />
      </CardContent>
    </Card>
  );
}

function Audiometry({
  datas,
  audiometryTableContent,
  setAudiometryTableContent,
  fieldsInfo,
}) {
  const [loading, setLoading] = useState(false);

  const tableCols = [
    {
      name: "hearingFieldEnumId",
      label: "میدان شنوایی",
      type: "select",
      options: fieldsInfo.hearingField,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
      style: { minWidth: "120px" },
    },
    {
      name: "signalTypeEnumId",
      label: "نوع سیگنال",
      type: "select",
      options: fieldsInfo.signalType,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
      style: { minWidth: "120px" },
    },
    {
      name: "frquencyEnumId",
      label: "میزان فرکانس",
      type: "select",
      options: fieldsInfo.frequency,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
      style: { minWidth: "120px" },
    },
    {
      name: "frquencyAmount",
      label: "مقدار فرکانس",
      type: "number",
      required: true,
      style: { minWidth: "120px" },
    },
    {
      name: "speachAudiometryEnumId",
      label: "نوع آدیومتری گفتاری",
      type: "select",
      options: fieldsInfo.speechAudiometry,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
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
      label: "نوع آدیومتری",
      type: "select",
      options: fieldsInfo.audiometryMode,
      optionIdField: "enumId",
      optionLabelField: "description",
      style: { minWidth: "120px" },
    },
  ];

  const audiometryAdd = (newData) => {
    return new Promise((resolve, reject) => {
      resolve(newData);
    });
  };

  const audiometryEdit = (editedData) => {
    return new Promise((resolve, reject) => {
      resolve(editedData);
    });
  };

  const audiometryRemove = () => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };
  return (
    <Card>
      <CardContent>
        <TablePro
          title="اودیومتری"
          columns={tableCols}
          rows={audiometryTableContent}
          setRows={setAudiometryTableContent}
          loading={loading}
          add="inline"
          addCallback={audiometryAdd}
          edit="inline"
          editCallback={audiometryEdit}
          removeCallback={audiometryRemove}
        />
      </CardContent>
    </Card>
  );
}
