import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Button } from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../../store/actions/fadak";
import { SERVER_URL } from "configs";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const PersonalFamilyBackground = ({ medicalHistory, setMedicalHistory }) => {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const datas = useSelector(({ fadak }) => fadak);

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const tableCols = [
    {
      name: "medicalHistoryEnum",
      label: "نوع سابقه",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "familyRelationshipEnum",
      label: "نسبت با فرد",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "medicalHistoryDescription",
      label: "شرح سابقه",
      type: "text",
      style: { minWidth: "120px" },
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=MedicalHistory,FamilyRelationship",
        axiosKey
      )
      .then((res) => {
        const selectFields = {};
        selectFields.medicalHistory = res.data.enums.MedicalHistory;
        selectFields.familyRelationship = res.data.enums.FamilyRelationship;
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

  useEffect(() => {
    getEnumSelectFields();
  }, []);

  return (
    <Card>
      <CardContent>
        <Box mb={2} />
        <CardContent>
          <TablePro
            title="لیست سوابق شخصی خانوادگی پزشکی"
            columns={tableCols}
            rows={medicalHistory}
            setRows={setMedicalHistory}
            loading={loading}
            add="external"
            addForm={
              <ExternalForm
                formValues={formValues}
                setFormValues={setFormValues}
                editing={false}
                setLoading={setLoading}
                fieldsInfo={fieldsInfo}
                medicalHistory={medicalHistory}
                setMedicalHistory={setMedicalHistory}
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
                medicalHistory={medicalHistory}
                setMedicalHistory={setMedicalHistory}
              />
            }
            removeCallback={handleRemove}
          />
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default PersonalFamilyBackground;

function ExternalForm({ editing = false, ...restProps }) {
  const {
    formValues,
    setFormValues,
    handleClose,
    fieldsInfo,
    setLoading,
    medicalHistory,
    setMedicalHistory,
  } = restProps;
  const [waiting, setWaiting] = useState(false);
  const [formValidation, setFormValidation] = useState({});
  const dispatch = useDispatch();

  const formStructure = [
    {
      name: "medicalHistoryEnumId",
      label: "نوع سابقه",
      type: "select",
      options: fieldsInfo.medicalHistory,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
      col: 4,
    },
    {
      name: "familyRelationshipEnumId",
      label: "نسبت با فرد",
      type: "select",
      options: fieldsInfo.familyRelationship,
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 4,
    },
    {
      name: "medicalHistoryDescription",
      label: "شرح سابقه",
      type: "textarea",
      col: 12,
    },
  ];

  const handleSubmit = () => {
    setLoading(true);
    setWaiting(true);
    const editedTable = [...medicalHistory];
    const tempFormValues = { ...formValues };
    tempFormValues.medicalHistoryEnum = fieldsInfo?.medicalHistory.find(
      (enm) => enm.enumId == formValues?.medicalHistoryEnumId
    )?.description;
    tempFormValues.familyRelationshipEnum = fieldsInfo?.familyRelationship.find(
      (enm) => enm.enumId == formValues?.familyRelationshipEnumId
    )?.description;
    editedTable.unshift(tempFormValues);
    setMedicalHistory([...editedTable]);
    dispatch(
      setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ذخیره شد.")
    );
    handleReset();
  };

  const handleEdit = () => {
    setLoading(true);
    setWaiting(true);
    const rowIndex = medicalHistory.findIndex(
      (his) =>
        his.medicalHistoryEnum == formValues?.medicalHistoryEnum &&
        his.familyRelationshipEnum == formValues?.familyRelationshipEnum
    );
    const editedTable = [...medicalHistory];
    formValues.medicalHistoryEnum = fieldsInfo?.medicalHistory.find(
      (enm) => enm.enumId == formValues?.medicalHistoryEnumId
    )?.description;
    formValues.familyRelationshipEnum = fieldsInfo?.familyRelationship.find(
      (enm) => enm.enumId == formValues?.familyRelationshipEnumId
    )?.description;
    editedTable[rowIndex] = { ...formValues };
    setMedicalHistory([...editedTable]);
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
      <CardHeader title="سابقه شخصی خانوادگی پزشکی" />
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
