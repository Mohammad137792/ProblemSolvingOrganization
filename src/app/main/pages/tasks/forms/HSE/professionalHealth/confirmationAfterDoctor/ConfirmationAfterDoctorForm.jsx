import FormPro from "../../../../../../components/formControls/FormPro";
import ModalPro from "app/main/components/ModalPro";
import { useState, useEffect } from "react";
import React from "react";
import ActionBox from "../../../../../../components/ActionBox";
import { Box, Button, Card, CardContent } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { setExaminer } from "../../../../../../../store/actions/fadak";
import axios from "axios";
import { SERVER_URL } from "configs";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import { useHistory } from "react-router-dom";
import TablePro from "app/main/components/TablePro";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import ErrorIcon from "@material-ui/icons/Error";
import ExaminersFilterForm from "./ExaminersFilterForm";

const ConfirmationAfterDoctorForm = ({ formVariables, submitCallback }) => {
  const [formValues, setFormValues] = useState();
  const [considerationValues, setConsiderationValues] = useState({});
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [tableContent, setTableContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const reduxInfo = useSelector(({ fadak }) => fadak.hseDoq);
  const examiners =
    reduxInfo.examiners.length > 0 &&
    formVariables.examinationProcess.value?.occupationalPartyRelationshipId !=
      null
      ? reduxInfo.examiners
      : formVariables.examiners.value;

  const history = useHistory();
  const dispatch = useDispatch();

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "trackingCode",
      label: "کد رهگیری",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "requesterFullName",
      label: "نام و نام خانوادگی تنظیم کننده",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "requesterEmplPosition",
      label: "پست سازمانی تنظیم کننده",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "createdDate",
      label: "تاریخ درخواست",
      type: "date",
      readOnly: true,
      col: 4,
    },
    {
      name: "doctorName",
      label: "پزشک معاینه کننده",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "occupationalName",
      label: "کارشناس بهداشت حرفه‌ای",
      type: "text",
      readOnly: true,
      display:
        formVariables.examinationProcess.value
          ?.occupationalPartyRelationshipId != null,
      col: 4,
    },
    {
      name: "examinationLocationEnum",
      label: "محل انجام معاینه",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "examinationTypeEnum",
      label: "نوع معاینه",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "questionnaireName",
      label: "نوع پرسشنامه",
      type: "text",
      readOnly: true,
      display: formVariables.examinationProcess.value?.questionnaireId != null,
      col: 4,
    },
  ];

  const considerationStructure = [
    {
      name: "specialConsideration",
      label: "نظر نهایی پزشک در خصوص کار شاغل",
      type: "select",
      options: fieldsInfo.specialConsideration,
      optionLabelField: "description",
      optionIdField: "enumId",
      readOnly: true,
      col: 4,
    },
    {
      name: "MNTPresence",
      label: "توضیحات پزشک در مورد حضور شروط یا  عدم صلاحیت",
      type: "textarea",
      readOnly: true,
      col: 12,
    },
    {
      name: "MNTNecessary",
      label: "توصیه ها پزشکی لازم و ملاحظات کلی",
      type: "textarea",
      readOnly: true,
      col: 12,
    },
  ];

  const tableCols = [
    {
      name: "fullName",
      label: "نام و نام خانوادگی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "nationalCode",
      label: "کد ملی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "pseudoId",
      label: "کد پرسنلی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "emplPosition",
      label: "پست سازمانی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "doctorExaminationDate",
      label: "تاریخ مراجعه",
      type: "date",
      style: { minWidth: "80px" },
    },
  ];
  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=SpecialConsideration",
        axiosKey
      )
      .then((res) => {
        const selectFields = {};
        selectFields.specialConsideration = res.data.enums.SpecialConsideration;
        setFieldsInfo(selectFields);
      });
  };
  useEffect(() => {
    setRequesterForm();
    getEnumSelectFields();
  }, []);

  const setRequesterForm = () => {
    const defaultFormValues = {
      ...formVariables.examinationProcess.value,
      requesterFullName: `${formVariables.examinationProcess.value.requesterPseudoId} ─ ${formVariables.examinationProcess.value.requesterFullName}`,
      trackingCode: formVariables.trackingCode.value,
    };
    setFormValues(defaultFormValues);
  };

  const showSpecialConsideration = (row) => {
    setShowModal(true);
    const defaultFormValues = {
      specialConsideration: row.personalExamination?.specialConsideration,
      MNTPresence: row?.medicalNote?.find(
        (note) => note?.descriptionEnumId == "MNTPresence"
      )?.description,
      MNTNecessary: row?.medicalNote?.find(
        (note) => note?.descriptionEnumId == "MNTNecessary"
      )?.description,
    };
    setConsiderationValues(defaultFormValues);
  };

  const medicalDocument = (row) => {
    dispatch(
      setExaminer(examiners, formVariables.examinationProcess.value, row)
    );
    history.push(`/medicalDocument`);
  };

  const submit = () => {
    setWaiting(true);
    const data = {
      examiners: examiners,
      examinationProcess: {
        ...formVariables.examinationProcess.value,
        trackingCodeId: formVariables.trackingCode.value,
      },
    };
    axios
      .post(
        SERVER_URL + `/rest/s1/healthAndCare/MedicalRecord`,
        {
          ...data,
        },
        axiosKey
      )
      .then((res) => {
        data.examiners = data.examiners.map((exam) => {
          return {
            ...exam,
            examinationId: res.data.examineInfo.find(
              (item) => item.partyRelationshipId == exam.partyRelationshipId
            )?.examinationId,
          };
        });
        data.examinationProcess = {
          ...formVariables.examinationProcess.value,
          examinationProcessId: res.data.examinationProcessId,
        };
        submitCallback(data);
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات !"));
        setWaiting(false);
      });
  };

  return (
    <Card>
      <CardContent>
        <Card>
          <CardContent>
            <FormPro
              prepend={formStructure}
              formValues={formValues}
              setFormValues={setFormValues}
            />
          </CardContent>
          <CardContent>
            <TablePro
              title="لیست افراد"
              columns={tableCols}
              rows={tableContent}
              setRows={setTableContent}
              loading={loading}
              rowCondition={(row) => {
                if (row.personalExamination.specialConsideration == "ScHave")
                  return "warning";
              }}
              filter="external"
              filterForm={
                <ExaminersFilterForm
                  examiners={examiners.map((exam) => {
                    return {
                      ...exam,
                      doctorExaminationDate:
                        exam.personalExamination.doctorExaminationDate,
                    };
                  })}
                  setLoading={setLoading}
                  fieldsInfo={fieldsInfo}
                  setFieldsInfo={setFieldsInfo}
                  setTableContent={setTableContent}
                />
              }
              rowActions={
                formVariables.examinationProcess.value
                  ?.occupationalPartyRelationshipId != null
                  ? [
                      {
                        title: "پرونده پزشکی",
                        icon: AssignmentIndIcon,
                        onClick: (row) => {
                          medicalDocument(row);
                        },
                      },
                      {
                        title: "ملاحظات",
                        icon: ErrorIcon,
                        onClick: (row) => {
                          showSpecialConsideration(row);
                        },
                      },
                    ]
                  : [
                      {
                        title: "ملاحظات",
                        icon: ErrorIcon,
                        onClick: (row) => {
                          showSpecialConsideration(row);
                        },
                      },
                    ]
              }
            />
          </CardContent>
          <Box mb={2} />
          <CardContent>
            <ActionBox>
              <Button
                type="submit"
                role="primary"
                onClick={submit}
                disabled={waiting}
                endIcon={waiting ? <CircularProgress size={20} /> : null}
              >
                تایید و ارسال
              </Button>
            </ActionBox>
          </CardContent>
        </Card>
      </CardContent>
      <ModalPro
        title={"ملاحظات"}
        titleBgColor={"#3C4252"}
        titleColor={"#dddddd"}
        open={showModal}
        setOpen={setShowModal}
        content={
          <Box>
            <FormPro
              prepend={considerationStructure}
              formValues={considerationValues}
              setFormValues={setConsiderationValues}
            />
          </Box>
        }
      />
    </Card>
  );
};

export default ConfirmationAfterDoctorForm;
