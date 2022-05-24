import FormPro from "app/main/components/formControls/FormPro";
import { useState, useEffect } from "react";
import React from "react";
import ActionBox from "app/main/components/ActionBox";
import { Box, Button, Card, CardContent, Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "configs";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import CommentBox from "app/main/components/CommentBox";
import { useHistory } from "react-router-dom";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import TablePro from "app/main/components/TablePro";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../store/actions/fadak";
import useListState from "../../../../../../reducers/listState";
import {
  setUser,
  setUserId,
} from "./../../../../../../../store/actions/fadak/baseInformation.actions";

const ApprovalOfRelevantDepartmentUnitForm = (props) => {
  const { formVariables, submitCallback } = props;
  const [formValues, setFormValues] = useState({});
  const [tableContent, setTableContent] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [loading, setLoading] = useState(false);
  const comments = useListState(
    "id",
    formVariables?.unitManager?.value.comments || []
  );
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
      name: "employeementDate",
      label: "تاریخ استخدام",
      type: "date",
      style: { minWidth: "120px" },
    },
    {
      name: "emplPosition",
      label: "سمت سازمانی",
      type: "text",
      style: { minWidth: "120px" },
    },
    {
      name: "jobTitle",
      label: "شغل",
      type: "text",
      style: { minWidth: "120px" },
    },
  ];

  const setRequesterForm = () => {
    const defaultFormValues = {
      ...formVariables.examinationProcess.value,
      requesterFullName: `${formVariables.examinationProcess.value.requesterPseudoId} ─ ${formVariables.examinationProcess.value.requesterFullName}`,
      trackingCode: formVariables.trackingCode.value,
    };
    setFormValues(defaultFormValues);
  };

  const setManagerUsers = () => {
    setLoading(true);
    const filteredExaminers = formVariables.examiners.value.filter(
      (examiner) =>
        examiner.unitOrganizationId ==
        formVariables?.unitManager.value.unitOrganizationId
    );
    setTableContent(filteredExaminers);
    setLoading(false);
  };

  useEffect(() => {
    setRequesterForm();
    setManagerUsers();
  }, []);

  const submit = () => {
    setWaiting(true);
    if (formVariables.examinationProcess.value?.questionnaireId) {
      axios
        .post(
          SERVER_URL + "/rest/s1/healthAndCare/questionnaireForExaminers",
          {
            examiners: [...tableContent],
            questionnaireId:
              formVariables.examinationProcess.value?.questionnaireId,
          },
          axiosKey
        )
        .then((res) => {
          const completedExaminers = res.data?.completedExaminers;
          const filteredExaminers = [
            ...formVariables.examiners.value.filter(
              (examiner) =>
                examiner.unitOrganizationId !==
                formVariables?.unitManager.value.unitOrganizationId
            ),
            ...completedExaminers,
          ];
          let data = {
            examiners: [...filteredExaminers],
            unitManager: {
              ...formVariables?.unitManager.value,
              managerStatus: "confirm",
            },
          };
          submitCallback(data);
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ساخت پرسشنامه!"));
          setWaiting(false);
        });
    } else {
      const filteredExaminers = formVariables.examiners.value.filter(
        (examiner) =>
          examiner.unitOrganizationId !==
            formVariables?.unitManager.value.unitOrganizationId ||
          tableContent.some((row) => examiner.partyId === row.partyId)
      );
      let data = {
        examiners: [...filteredExaminers],
        unitManager: {
          ...formVariables?.unitManager.value,
          managerStatus: "confirm",
        },
      };
      submitCallback(data);
    }
  };

  const reject = () => {
    setWaiting(true);
    const filteredExaminers = formVariables.examiners.value.filter(
      (examiner) =>
        examiner.unitOrganizationId !==
        formVariables?.unitManager.value.unitOrganizationId
    );
    const filteredUnitManagers = formVariables.unitManagers.value.filter(
      (manager) =>
        manager.unitOrganizationId !==
        formVariables?.unitManager.value.unitOrganizationId
    );
    let data = {
      unitManagers: [...filteredUnitManagers],
      examiners: [...filteredExaminers],
      unitManager: {
        ...formVariables?.unitManager.value,
        managerStatus: "reject",
      },
    };
    submitCallback(data);
  };

  const modify = () => {
    setWaiting(true);
    const filteredExaminers = formVariables.examiners.value.filter(
      (examiner) =>
        examiner.unitOrganizationId !==
          formVariables?.unitManager.value.unitOrganizationId ||
        tableContent.some((row) => examiner.partyId === row.partyId)
    );
    let data = {
      examiners: [...filteredExaminers],
      unitManager: {
        ...formVariables?.unitManager.value,
        managerStatus: "correction",
        comments: comments.list,
      },
    };
    submitCallback(data);
  };

  const handleRemove = (rowData) => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  };

  const personnelProfile = (row) => {
    // history.push("/personnelBaseInformation");
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
              removeCallback={handleRemove}
              rowActions={[
                {
                  title: "پروفایل پرسنلی",
                  icon: AccountBoxIcon,
                  onClick: (row) => {
                    personnelProfile(row);
                  },
                },
              ]}
            />
          </CardContent>
          <Box mb={2} />
          <CardContent>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CommentBox context={comments} />
              </Card>
            </Grid>
          </CardContent>
          <Box mb={2} />
          <ActionBox>
            <Button
              type="submit"
              role="primary"
              onClick={submit}
              disabled={waiting || tableContent?.length == 0}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              {"تایید و ارسال"}
            </Button>
            <Button
              type="reset"
              role="secondary"
              onClick={reject}
              disabled={waiting}
            >
              رد{" "}
            </Button>
            <Button
              type="reset"
              role="secondary"
              onClick={modify}
              disabled={waiting}
            >
              اصلاح
            </Button>
          </ActionBox>
          <Box mb={2} />
        </Card>
      </CardContent>
    </Card>
  );
};

export default ApprovalOfRelevantDepartmentUnitForm;
