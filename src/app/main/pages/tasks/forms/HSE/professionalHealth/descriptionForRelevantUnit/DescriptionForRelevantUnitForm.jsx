import FormPro from "app/main/components/formControls/FormPro";
import ModalPro from "app/main/components/ModalPro";
import { useState, useEffect } from "react";
import React from "react";
import ActionBox from "app/main/components/ActionBox";
import { Box, Button, Card, CardContent } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { setExaminer } from "../../../../../../../store/actions/fadak";
import axios from "axios";
import { SERVER_URL } from "configs";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import { useHistory } from "react-router-dom";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import TablePro from "app/main/components/TablePro";
import {
  setUser,
  setUserId,
} from "./../../../../../../../store/actions/fadak/baseInformation.actions";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../store/actions/fadak";
import ErrorIcon from "@material-ui/icons/Error";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import ExaminersFilterForm from "./ExaminersFilterForm";

const ApprovalOfRelevantDepartmentUnitForm = (props) => {
  const { formVariables, submitCallback } = props;
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [considerationValues, setConsiderationValues] = useState({});
  const [managerExaminers, setManagerExaminers] = useState([]);
  const [tableContent, setTableContent] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const history = useHistory();
  const dispatch = useDispatch();

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
      style: { minWidth: "120px" },
    },
    {
      name: "nationalCode",
      label: "کد ملی",
      type: "text",
      style: { minWidth: "120px" },
    },
    {
      name: "pseudoId",
      label: "کد پرسنلی",
      type: "text",
      style: { minWidth: "120px" },
    },
    {
      name: "emplPosition",
      label: "سمت سازمانی",
      type: "text",
      style: { minWidth: "120px" },
    },
    {
      name: "doctorExaminationDate",
      label: "تاریخ مراجعه",
      type: "date",
      style: { minWidth: "120px" },
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

  const setFormInfo = () => {
    const defaultValue = {
      ...formVariables.examinationProcess.value,
      requesterFullName: `${formVariables.examinationProcess.value.requesterPseudoId} ─ ${formVariables.examinationProcess.value.requesterFullName}`,
      trackingCode: formVariables.trackingCode.value,
    };

    setFormValues(defaultValue);
  };

  const setManagerUsers = () => {
    setLoading(true);
    const filteredExaminers = formVariables.examiners.value.filter(
      (examiner) =>
        examiner.unitOrganizationId ==
        formVariables?.unitManager.value.unitOrganizationId
    );
    const examinationIds = filteredExaminers.map((exam) => exam.examinationId);
    axios
      .get(
        SERVER_URL +
          "/rest/s1/healthAndCare/MedicalRecord?examineInfo=" +
          examinationIds,
        axiosKey
      )
      .then((res) => {
        const tempExaminers = res.data.examiners;
        const editedExaminers = filteredExaminers.map((exam) => {
          return {
            ...exam,
            ...tempExaminers.find(
              (tExam) =>
                tExam.personalExamination.examinationId == exam.examinationId
            ),
            doctorExaminationDate:
              exam.personalExamination.doctorExaminationDate,
          };
        });
        setTableContent(editedExaminers);
        setManagerExaminers(editedExaminers);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت پرسنل رخ داده است."
          )
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    setFormInfo();
    setManagerUsers();
    getEnumSelectFields();
  }, []);

  const submit = () => {
    setWaiting(true);
    const filteredExaminers = [
      ...formVariables.examiners.value.filter(
        (examiner) =>
          examiner.unitOrganizationId !==
          formVariables?.unitManager.value.unitOrganizationId
      ),
      ...managerExaminers,
    ];
    let data = {
      examiners: [...filteredExaminers],
    };
    submitCallback(data);
  };

  const personnelProfile = (row) => {
    dispatch(setUser(row.partyId));
    dispatch(setUserId(row?.username, row?.userId, row.partyRelationshipId));
    history.push({
      pathname: "/personnel/profile",
      state: {
        partyId: row.partyId,
        partyRelationshipId: row.partyRelationshipId,
        from: "search",
      },
    });
  };

  const medicalDocument = (row) => {
    dispatch(setExaminer([], formVariables.examinationProcess.value, row));
    history.push(`/medicalDocument`);
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

  const handleRemove = (rowData) => {
    return new Promise((resolve, reject) => {
      const filteredExaminers = managerExaminers.filter(
        (examiner) => examiner.partyId != rowData.partyId
      );
      setManagerExaminers(filteredExaminers);
      resolve();
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
              // removeCallback={handleRemove}
              filter="external"
              filterForm={
                <ExaminersFilterForm
                  managerExaminers={managerExaminers}
                  unitOrganizationId={
                    formVariables?.unitManager.value.unitOrganizationId
                  }
                  setLoading={setLoading}
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
                      {
                        title: "پروفایل پرسنلی",
                        icon: AccountBoxIcon,
                        onClick: (row) => {
                          personnelProfile(row);
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
                      {
                        title: "پروفایل پرسنلی",
                        icon: AccountBoxIcon,
                        onClick: (row) => {
                          personnelProfile(row);
                        },
                      },
                    ]
              }
            />
            <Box mb={2} />
            <ActionBox>
              <Button
                type="submit"
                role="primary"
                onClick={submit}
                disabled={waiting}
                endIcon={waiting ? <CircularProgress size={20} /> : null}
              >
                {"تایید و ارسال"}
              </Button>
            </ActionBox>
          </CardContent>

          <Box mb={2} />
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

export default ApprovalOfRelevantDepartmentUnitForm;
