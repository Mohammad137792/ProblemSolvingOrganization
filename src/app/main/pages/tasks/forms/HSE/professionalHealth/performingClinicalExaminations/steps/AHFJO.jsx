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

const AHFJO = ({
  examiner,
  medicalNote,
  setMedicalNote,
  damagingAgent,
  setDamagingAgent,
}) => {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [formNoteValues, setFormNoteValues] = useState({ ...medicalNote });
  const [loading, setLoading] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);

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

  const formStructure = [
    {
      name: "MNTExpert",
      label: "توضیحات کارشناس در مورد شغل فرد",
      type: "textarea",
      col: 12,
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

  useEffect(() => {
    setMedicalNote((prevState) => {
      return { ...prevState, MNTExpert: formNoteValues.MNTExpert };
    });
  }, [formNoteValues.MNTExpert]);

  return (
    <Card>
      <CardContent>
        <Box mb={2} />
        <CardContent>
          <FormPro
            prepend={formStructure}
            formValues={formNoteValues}
            setFormValues={setFormNoteValues}
            formStructure={formStructure}
          />
          <Box mb={2} />
          <TablePro
            title="لیست مشاغل فرد"
            columns={tableCols}
            rows={damagingAgent}
            setRows={setDamagingAgent}
            loading={loading}
            add="external"
            addForm={
              <ExternalForm
                examiner={examiner}
                formValues={formValues}
                setFormValues={setFormValues}
                editing={false}
                setLoading={setLoading}
                fieldsInfo={fieldsInfo}
                damagingAgent={damagingAgent}
                setDamagingAgent={setDamagingAgent}
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
                damagingAgent={damagingAgent}
                setDamagingAgent={setDamagingAgent}
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
  const {
    examiner,
    formValues,
    setFormValues,
    handleClose,
    fieldsInfo,
    setLoading,
    damagingAgent,
    setDamagingAgent,
  } = restProps;
  const [waiting, setWaiting] = useState(false);
  const dispatch = useDispatch();

  const formStructure = [
    {
      name: "physical",
      label: "فیزیکی",
      type: "multiselect",
      options: fieldsInfo.physical,
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 4,
    },
    {
      name: "chemical",
      label: "شیمیایی",
      type: "multiselect",
      options: fieldsInfo.chemical,
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 4,
    },
    {
      name: "biological",
      label: "بیولوژیک",
      type: "multiselect",
      options: fieldsInfo.biological,
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 4,
    },
    {
      name: "ergonomics",
      label: "آرگونومی",
      type: "multiselect",
      options: fieldsInfo.ergonomics,
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 4,
    },
    {
      name: "mental",
      label: "روانی",
      type: "multiselect",
      options: fieldsInfo.mental,
      optionIdField: "enumId",
      optionLabelField: "description",
      col: 4,
    },
  ];

  useEffect(() => {
    if (editing == false) {
      handleReset();
    }
  }, [editing, damagingAgent]);

  const handleSubmit = () => {
    setLoading(true);
    setWaiting(true);
    const rowIndex = damagingAgent.findIndex(
      (row) => row.emplPositionId == examiner?.emplPositionId
    );
    const descriptions = [];
    if (formValues.physical !== "[]") {
      descriptions.push("فیزیکی");
    }
    if (formValues.chemical !== "[]") {
      descriptions.push("شیمیایی");
    }
    if (formValues.biological !== "[]") {
      descriptions.push("بیولوژیک");
    }
    if (formValues.ergonomics !== "[]") {
      descriptions.push("آرگونومی");
    }
    if (formValues.mental !== "[]") {
      descriptions.push("روانی");
    }
    const editedTable = [...damagingAgent];
    editedTable[rowIndex] = formValues;
    editedTable[rowIndex].damageAgentDescription = descriptions.join("،");
    setDamagingAgent([...editedTable]);
    dispatch(
      setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ذخیره شد.")
    );
    // handleReset();
  };

  const handleEdit = () => {
    setLoading(true);
    setWaiting(true);
    let rowIndex;
    if (formValues.location == "ELIndoor") {
      rowIndex = damagingAgent.findIndex(
        (row) => row.emplPositionId == formValues?.emplPositionId
      );
    } else {
      rowIndex = damagingAgent.findIndex(
        (row) => row.jobTitle == formValues?.jobTitle
      );
    }
    const descriptions = [];
    if (formValues.physical !== "[]") {
      descriptions.push("فیزیکی");
    }
    if (formValues.chemical !== "[]") {
      descriptions.push("شیمیایی");
    }
    if (formValues.biological !== "[]") {
      descriptions.push("بیولوژیک");
    }
    if (formValues.ergonomics !== "[]") {
      descriptions.push("آرگونومی");
    }
    if (formValues.mental !== "[]") {
      descriptions.push("روانی");
    }
    const editedTable = [...damagingAgent];
    editedTable[rowIndex] = { ...formValues };
    editedTable[rowIndex].damageAgentDescription = descriptions.join("،");
    setDamagingAgent([...editedTable]);
    dispatch(
      setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
    );
    handleReset();
  };

  const handleReset = () => {
    let customJob = damagingAgent.find(
      (row) => row.emplPositionId == examiner?.emplPositionId
    );
    setFormValues(customJob);
    setLoading(false);
    setWaiting(false);
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
