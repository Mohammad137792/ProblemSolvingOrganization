import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Button } from "@material-ui/core";
import FormPro from "../../../../../../../components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import ActionBox from "../../../../../../../components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SERVER_URL } from "configs";
import axios from "axios";

const AHFJO = ({ damagingAgent }) => {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [tableContent, setTableContent] = useState([...damagingAgent]);
  const [loading, setLoading] = useState(false);
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const tableCols = [
    {
      name: "locationType",
      label: "محل خدمت فرد",
      type: "render",
      render: (row) => {
        return row.location == "ELIndoor" ? "داخل سازمان" : "خارج سازمان";
      },
      style: { minWidth: "80px" },
    },
    {
      name: "position" || "jobTitle",
      label: "پست",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "fromDate",
      label: "تاریخ شروع",
      type: "date",
      style: { minWidth: "80px" },
    },
    {
      name: "thruDate",
      label: "تاریخ پایان",
      type: "date",
      style: { minWidth: "80px" },
    },
    {
      name: "damageAgentDescription",
      label: "عوامل زیان‌آور",
      type: "text",
      style: { minWidth: "80px" },
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL + "/rest/s1/fadak/getEnums?enumTypeList=DamagingAgent",
        axiosKey
      )
      .then((res) => {
        const selectFields = {};
        selectFields.physical = res.data.enums.DamagingAgent.filter(
          (item) => item.parentEnumId == "Physical"
        );
        selectFields.chemical = res.data.enums.DamagingAgent.filter(
          (item) => item.parentEnumId == "Chemical"
        );
        selectFields.biological = res.data.enums.DamagingAgent.filter(
          (item) => item.parentEnumId == "Biological"
        );
        selectFields.ergonomics = res.data.enums.DamagingAgent.filter(
          (item) => item.parentEnumId == "Ergonomics"
        );
        selectFields.mental = res.data.enums.DamagingAgent.filter(
          (item) => item.parentEnumId == "Mental"
        );
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
            title="لیست مشاغل فرد"
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

export default AHFJO;

function ExternalForm({ editing = false, ...restProps }) {
  const { formValues, setFormValues, handleClose, fieldsInfo, setLoading } =
    restProps;

  const formStructure = [
    {
      name: "physical",
      label: "فیزیکی",
      type: "multiselect",
      options: fieldsInfo.physical,
      optionIdField: "enumId",
      optionLabelField: "description",
      readOnly: true,
      col: 4,
    },
    {
      name: "chemical",
      label: "شیمیایی",
      type: "multiselect",
      options: fieldsInfo.chemical,
      optionIdField: "enumId",
      optionLabelField: "description",
      readOnly: true,
      col: 4,
    },
    {
      name: "biological",
      label: "بیولوژیک",
      type: "multiselect",
      options: fieldsInfo.biological,
      optionIdField: "enumId",
      optionLabelField: "description",
      readOnly: true,
      col: 4,
    },
    {
      name: "ergonomics",
      label: "آرگونومی",
      type: "multiselect",
      options: fieldsInfo.ergonomics,
      optionIdField: "enumId",
      optionLabelField: "description",
      readOnly: true,
      col: 4,
    },
    {
      name: "mental",
      label: "روانی",
      type: "multiselect",
      options: fieldsInfo.mental,
      optionIdField: "enumId",
      optionLabelField: "description",
      readOnly: true,
      col: 4,
    },
  ];

  const handleReset = () => {
    setLoading(false);
    setFormValues({});
    handleClose();
  };

  return (
    <CardContent>
      <CardHeader title="عوامل زیان اور شغل" />

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
