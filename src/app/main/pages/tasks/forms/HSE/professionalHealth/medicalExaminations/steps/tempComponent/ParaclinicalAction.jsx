import React, { useState, useEffect } from "react";
import { Card, CardContent, Box, Button } from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../../../store/actions/fadak";
import { useDispatch } from "react-redux";

const ParaclinicalActions = ({
  datas,
  paraclinicalAction,
  setParaclinicalAction,
  fieldsInfo,
  medicalNote,
  setMedicalNote,
}) => {
  const [formValues, setFormValues] = useState({});
  const [formNoteValues, setFormNoteValues] = useState({ ...medicalNote });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const tableCols = [
    {
      name: "paraclinicalActionEnum",
      label: "نوع اقدام",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "doneDate",
      label: "تاریخ انجام",
      type: "date",
      style: { minWidth: "80px" },
    },
  ];

  const formStructure = [
    {
      name: "MNTParacilinic",
      label:
        "توضیحات پزشک در مورد آزمایشات پاراکلینیکی انجام شده توسط کارشناس بهداشت حرفه ای",
      type: "textarea",
      col: 12,
    },
  ];

  const handleRemove = () => {
    return new Promise((resolve, reject) => {
      dispatch(
        setAlertContent(ALERT_TYPES.SUCCESS, "سطر مورد نظر با موفقیت حذف شد.")
      );
      resolve();
    });
  };

  useEffect(() => {
    setMedicalNote((prevState) => {
      return {
        ...prevState,
        MNTParacilinic: formNoteValues.MNTParacilinic,
      };
    });
  }, [formNoteValues.MNTParacilinic]);

  return (
    <Card>
      <CardContent>
        <CardContent>
          <TablePro
            title="سایر اقدامات"
            columns={tableCols}
            rows={paraclinicalAction}
            setRows={setParaclinicalAction}
            loading={loading}
            add="external"
            addForm={
              <ExternalForm
                formValues={formValues}
                setFormValues={setFormValues}
                editing={false}
                setLoading={setLoading}
                fieldsInfo={fieldsInfo}
                paraclinicalAction={paraclinicalAction}
                setParaclinicalAction={setParaclinicalAction}
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
                paraclinicalAction={paraclinicalAction}
                setParaclinicalAction={setParaclinicalAction}
              />
            }
            removeCallback={handleRemove}
          />
        </CardContent>
        <Box mb={3} />
        <FormPro
          prepend={formStructure}
          formValues={formNoteValues}
          setFormValues={setFormNoteValues}
        />
      </CardContent>
    </Card>
  );
};
export default ParaclinicalActions;

function ExternalForm({ editing = false, ...restProps }) {
  const {
    formValues,
    setFormValues,
    handleClose,
    fieldsInfo,
    setLoading,
    paraclinicalAction,
    setParaclinicalAction,
  } = restProps;
  const [waiting, setWaiting] = useState(false);
  const [formValidation, setFormValidation] = useState({});
  const dispatch = useDispatch();

  const formStructure = [
    {
      name: "paraclinicalActionEnumId",
      label: "نوع اقدام",
      type: "select",
      options: fieldsInfo.paraAction,
      optionIdField: "enumId",
      optionLabelField: "description",
      required: true,
      col: 4,
    },
    {
      name: "doneDate",
      label: "تاریخ انجام",
      type: "date",
      col: 4,
    },
    {
      name: "paraclinicalActionElaboration",
      label: "شرح اقدام",
      type: "textarea",
      col: 8,
    },
    {
      name: "paraclinicalActionResult",
      label: "نتیجه",
      type: "textarea",
      col: 12,
    },
  ];

  const handleSubmit = () => {
    setLoading(true);
    setWaiting(true);
    const editedTable = [...paraclinicalAction];
    const tempFormValues = { ...formValues };
    tempFormValues.paraclinicalActionEnum = fieldsInfo?.paraAction.find(
      (enm) => enm.enumId == formValues?.paraclinicalActionEnumId
    )?.description;
    editedTable.unshift(tempFormValues);
    setParaclinicalAction([...editedTable]);
    dispatch(
      setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ذخیره شد.")
    );
    handleReset();
  };

  const handleEdit = () => {
    setLoading(true);
    setWaiting(true);
    const rowIndex = paraclinicalAction.findIndex(
      (his) => his.paraclinicalActionEnum == formValues?.paraclinicalActionEnum
    );
    const editedTable = [...paraclinicalAction];
    formValues.paraclinicalActionEnum = fieldsInfo?.paraAction.find(
      (enm) => enm.enumId == formValues?.paraclinicalActionEnumId
    )?.description;
    editedTable[rowIndex] = { ...formValues };
    setParaclinicalAction([...editedTable]);
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
