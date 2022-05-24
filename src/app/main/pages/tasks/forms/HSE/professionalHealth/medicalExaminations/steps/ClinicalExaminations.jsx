import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Button } from "@material-ui/core";
import FormPro from "../../../../../../../components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import ActionBox from "../../../../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../../store/actions/fadak";
import { SERVER_URL } from "configs";
import axios from "axios";
import { useDispatch } from "react-redux";

const ClinicalExaminations = ({
  personalExamination,
  setPersonalExamination,
  clinicalExamination,
  setClinicalExamination,
  medicalNote,
  setMedicalNote,
  personalSubmit,
}) => {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [formValidation, setFormValidation] = useState({});
  const [formNoteValues, setFormNoteValues] = useState({ ...medicalNote });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const tableCols = [
    {
      name: "diseaseDiagnosisEnum",
      label: "نوع مشکل فعلی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "fromDate",
      label: "تاریخ شروع مشکل",
      type: "date",
      style: { minWidth: "80px" },
    },
  ];

  const personalStructure = [
    {
      name: "height",
      label: "قد",
      type: "number",
      required: true,
      col: 4,
    },
    {
      name: "weight",
      label: "وزن",
      type: "number",
      required: true,
      col: 4,
    },
    {
      name: "bloodTypeEnumId",
      label: "گروه خونی",
      type: "select",
      options: fieldsInfo.bloodType,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
      col: 4,
    },
    {
      name: "heartBeatRate",
      label: "نرخ ضربان",
      type: "number",
      required: true,
      col: 4,
    },
    {
      name: "temperature",
      label: "درجه حرارت",
      type: "number",
      required: true,
      col: 4,
    },
    {
      name: "bloodPressureMax",
      label: "فشار خون سیستولیک",
      type: "number",
      required: true,
      col: 4,
    },
    {
      name: "bloodPressureMin",
      label: "فشار خون دیاستولیک",
      type: "number",
      required: true,
      col: 4,
    },
  ];
  const formStructure = [
    {
      name: "MNTBaliny",
      label: "توضیحات پزشک در مورد معاینات بالینی",
      type: "textarea",
      col: 12,
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=DiseaseDiagnosis,BloodType",
        axiosKey
      )
      .then((res) => {
        const selectFields = {};
        selectFields.diseaseDiagnosis = res.data.enums.DiseaseDiagnosis;
        selectFields.bloodType = res.data.enums.BloodType;
        setFieldsInfo(selectFields);
      });
  };

  const handleRemove = () => {
    return new Promise((resolve, reject) => {
      dispatch(
        setAlertContent(ALERT_TYPES.SUCCESS, "سطر مورد نظر با موفقیت حذف شد.")
      );
      resolve();
    });
  };
  const fakeSubmit = () => {};

  useEffect(() => {
    getEnumSelectFields();
  }, []);

  useEffect(() => {
    setMedicalNote((prevState) => {
      return { ...prevState, MNTBaliny: formNoteValues.MNTBaliny };
    });
  }, [formNoteValues.MNTBaliny]);

  return (
    <Card>
      <CardContent>
        <Box mb={2} />
        <CardContent>
          <CardHeader title="معاینات بالینی" />
          <FormPro
            prepend={personalStructure}
            formValues={personalExamination}
            setFormValues={setPersonalExamination}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            actionBox={
              <ActionBox style={{ display: "none" }}>
                <Button ref={personalSubmit} type="submit" role="primary">
                  ثبت
                </Button>
              </ActionBox>
            }
            submitCallback={fakeSubmit}
          />
          <TablePro
            title="لیست مشکلات فعلی"
            columns={tableCols}
            rows={clinicalExamination}
            setRows={setClinicalExamination}
            loading={loading}
            add="external"
            addForm={
              <ExternalForm
                formValues={formValues}
                setFormValues={setFormValues}
                editing={false}
                setLoading={setLoading}
                fieldsInfo={fieldsInfo}
                clinicalExamination={clinicalExamination}
                setClinicalExamination={setClinicalExamination}
              />
            }
            edit="external"
            editForm={
              <ExternalForm
                formValues={formValues}
                setFormValues={setFormValues}
                editing={true}
                setLoading={setLoading}
                fieldsInfo={fieldsInfo}
                clinicalExamination={clinicalExamination}
                setClinicalExamination={setClinicalExamination}
              />
            }
            removeCallback={handleRemove}
          />
          <Box mb={2} />
          <FormPro
            prepend={formStructure}
            formValues={formNoteValues}
            setFormValues={setFormNoteValues}
          />
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default ClinicalExaminations;

function ExternalForm({ editing = false, ...restProps }) {
  const {
    formValues,
    setFormValues,
    handleClose,
    fieldsInfo,
    setLoading,
    clinicalExamination,
    setClinicalExamination,
  } = restProps;
  const [waiting, setWaiting] = useState(false);
  const [formValidation, setFormValidation] = useState({});
  const dispatch = useDispatch();

  const formStructure = [
    {
      name: "diseaseDiagnosisEnumId",
      label: "نوع مشکل فعلی",
      type: "select",
      options: fieldsInfo.diseaseDiagnosis,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
      col: 4,
    },
    {
      name: "fromDate",
      label: "تاریخ شروع مشکل",
      type: "date",
      col: 4,
    },
    {
      name: "description",
      label: "شرح مشکل فعلی",
      type: "textarea",
      col: 12,
    },
  ];

  const handleSubmit = () => {
    setLoading(true);
    setWaiting(true);
    const editedTable = [...clinicalExamination];
    const tempFormValues = { ...formValues };
    tempFormValues.diseaseDiagnosisEnum = fieldsInfo?.diseaseDiagnosis.find(
      (enm) => enm.enumId == formValues?.diseaseDiagnosisEnumId
    )?.description;
    editedTable.unshift(tempFormValues);
    setClinicalExamination([...editedTable]);
    dispatch(
      setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ذخیره شد.")
    );
    handleReset();
  };

  const handleEdit = () => {
    setLoading(true);
    setWaiting(true);
    const rowIndex = clinicalExamination.findIndex(
      (his) => his.diseaseDiagnosisEnum == formValues?.diseaseDiagnosisEnum
    );
    const editedTable = [...clinicalExamination];
    formValues.diseaseDiagnosisEnum = fieldsInfo?.diseaseDiagnosis.find(
      (enm) => enm.enumId == formValues?.diseaseDiagnosisEnumId
    )?.description;
    editedTable[rowIndex] = { ...formValues };
    setClinicalExamination([...editedTable]);
    dispatch(
      setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
    );
    handleReset();
  };

  const handleReset = () => {
    setLoading(false);
    setWaiting(false);
    setFormValues({});
    handleClose();
  };

  return (
    <CardContent>
      <FormPro
        prepend={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        formValidation={formValidation}
        setFormValidation={setFormValidation}
        formStructure={formStructure}
        submitCallback={() => (editing ? handleEdit() : handleSubmit())}
        actionBox={
          <ActionBox>
            <Button
              type="submit"
              role="primary"
              disabled={waiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              {editing ? "ویرایش" : "افزودن"}
            </Button>
            <Button type="reset" role="secondary" disabled={waiting}>
              لغو
            </Button>
          </ActionBox>
        }
        resetCallback={handleReset}
      />
    </CardContent>
  );
}
