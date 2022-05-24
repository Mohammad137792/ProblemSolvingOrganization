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

const PersonalFamilyBackground = ({ medicalHistory }) => {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [tableContent, setTableContent] = useState([...medicalHistory]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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
            rows={tableContent}
            setRows={setTableContent}
            loading={loading}
            edit="external"
            editForm={
              <ExternalForm
                formValues={formValues}
                setFormValues={setFormValues}
                editing={true}
                setLoading={setLoading}
                fieldsInfo={fieldsInfo}
              />
            }
          />
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default PersonalFamilyBackground;

function ExternalForm({ editing = false, ...restProps }) {
  const { formValues, setFormValues, handleClose, fieldsInfo, setLoading } =
    restProps;
  const dispatch = useDispatch();

  const formStructure = [
    {
      name: "medicalHistoryEnumId",
      label: "نوع سابقه",
      type: "select",
      options: fieldsInfo.medicalHistory,
      optionIdField: "enumId",
      optionLabelField: "description",
      readOnly: true,
      col: 4,
    },
    {
      name: "familyRelationshipEnumId",
      label: "نسبت با فرد",
      type: "select",
      options: fieldsInfo.familyRelationship,
      optionIdField: "enumId",
      optionLabelField: "description",
      readOnly: true,
      col: 4,
    },
    {
      name: "medicalHistoryDescription",
      label: "شرح سابقه",
      type: "textarea",
      readOnly: true,
      col: 12,
    },
  ];

  const handleReset = () => {
    setLoading(false);
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
        formStructure={formStructure}
        actionBox={
          <ActionBox>
            <Button type="reset" role="secondary">
              لغو
            </Button>
          </ActionBox>
        }
        resetCallback={handleReset}
      />
    </CardContent>
  );
}
