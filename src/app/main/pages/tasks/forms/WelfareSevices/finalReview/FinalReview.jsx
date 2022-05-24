import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Grid,
} from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "configs";
import axios from "axios";
import LoanInformation from "./tabs/LoanInformation";
import Installments from "./tabs/Installments";
import Documents from "./tabs/Documents";
import CommentBox from "app/main/components/CommentBox";
import useListState from "app/main/reducers/listState";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import moment from "moment-jalaali";
import TabPro from "app/main/components/TabPro";

export default function FinalReview({ formVariables, submitCallback }) {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [borrowerInformation, setBorrowerInformation] = useState({
    ...formVariables.informationForm?.value,
  });
  const [loanInformation, setLoanInformation] = useState({
    ...formVariables.loanInformation?.value,
    requestReviewDate: moment(new Date().getTime()).format("YYYY-MM-DD"),
  });
  const [criteriaLoading, setCriteriaLoading] = useState(false);
  const [installmentLoading, setInstallmentLoading] = useState(false);
  const [guarantorLoading, setGuarantorLoading] = useState(false);
  const [borrowerLoading, setBorrowerLoading] = useState(false);

  const [criteriaTable, setCriteriaTable] = useState(
    formVariables.criteriaTable?.value || []
  );
  const [installmentCalc, setInstallmentCalc] = useState(
    formVariables.installmentCalc?.value || {}
  );
  const [installmentTable, setInstallmentTable] = useState(
    formVariables.installmentTable?.value || []
  );
  const [borrowerAttach, setBorrowerAttach] = useState(
    formVariables.borrowerAttach?.value || []
  );
  const [guarantorTable, setGuarantorTable] = useState(
    formVariables.guarantors?.value || []
  );
  const [submitWaiting, setSubmitWaiting] = useState(false);
  const comments = useListState("id", formVariables?.allComments.value || []);

  const permisions = JSON.parse(formVariables?.reviewer.value.actionEnumId);

  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const borrowerStructure = [
    {
      name: "trackingCode",
      label: "کد رهگیری",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "starterInfo",
      label: "درخواست دهنده",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "starterEmplPosition",
      label: "پست سازمانی درخواست دهنده",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "requestDate",
      label: "تاریخ درخواست",
      type: "date",
      readOnly: true,
      col: 4,
    },
    {
      name: "requestReviewDate",
      label: "تاریخ بررسی درخواست",
      type: "date",
      readOnly: true,
      col: 4,
    },
    {
      name: "applicantEmplPosition",
      label: "پست سازمانی متقاضی تسهیل مالی",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "applicantFullName",
      label: "متقاضی تسهیل مالی",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "welfareTitle",
      label: "تسهیل مالی",
      type: "text",
      readOnly: true,
      col: 4,
    },
  ];

  const getUomSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/entity/Uom?uomTypeEnumId=WelfareTimePeriod",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            welfareTimePeriod: res.data.result,
          };
        });
      });
  };

  const handleSubmit = () => {
    setSubmitWaiting(true);
    const packect = {
      reviewersStatus: "Confirmation",
      allComments: comments.list,
    };
    submitCallback(packect);
  };

  const handleModify = () => {
    setSubmitWaiting(true);
    const packect = {
      reviewersStatus: "Correction",
      allComments: comments.list,
    };
    submitCallback(packect);
  };

  const handleReject = () => {
    setSubmitWaiting(true);
    const packect = {
      reviewersStatus: "Rejection",
      allComments: comments.list,
    };
    submitCallback(packect);
  };

  const tabs = [
    {
      label: "اطلاعات تسهیل مالی",
      panel: (
        <Box mt={2}>
          <LoanInformation
            fieldsInfo={fieldsInfo}
            loanInformation={loanInformation}
            setLoanInformation={setLoanInformation}
          />
        </Box>
      ),
    },
    {
      label: "اطلاعات اقساط",
      panel: (
        <Box mt={2}>
          <Installments
            criteriaLoading={criteriaLoading}
            installmentLoading={installmentLoading}
            installmentCalc={installmentCalc}
            setInstallmentCalc={setInstallmentCalc}
            criteriaTable={criteriaTable}
            setCriteriaTable={setCriteriaTable}
            installmentTable={installmentTable}
            setInstallmentTable={setInstallmentTable}
          />
        </Box>
      ),
    },
    {
      label: "اطلاعات ضامن و مدارک",
      panel: (
        <Box mt={2}>
          <Documents
            submitWaiting={submitWaiting}
            borrowerAttach={borrowerAttach}
            setBorrowerAttach={setBorrowerAttach}
            guarantorTable={guarantorTable}
            setGuarantorTable={setGuarantorTable}
            guarantorLoading={guarantorLoading}
            borrowerLoading={borrowerLoading}
            setBorrowerLoading={setBorrowerLoading}
          />
        </Box>
      ),
    },
  ];

  useEffect(() => {
    getUomSelectFields();
  }, []);

  return (
    <>
      <Box p={2}>
        <CardHeader title={"بررسی درخواست تسهیل مالی"} />
        <CardContent>
          <FormPro
            append={borrowerStructure}
            formValues={borrowerInformation}
            setFormValues={setBorrowerInformation}
          />
        </CardContent>
        <Card style={{ height: "97%", padding: "0.5%", marginTop: "1%" }}>
          <TabPro tabs={tabs} />
        </Card>
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
            role="primary"
            onClick={handleSubmit}
            disabled={submitWaiting}
            endIcon={submitWaiting ? <CircularProgress size={20} /> : null}
          >
            تایید{" "}
          </Button>

          <Button
            style={{
              display: permisions.find((perm) => perm == "LoanModify")
                ? "inherit"
                : "none",
            }}
            role="secondary"
            onClick={handleModify}
            disabled={submitWaiting}
          >
            اصلاح{" "}
          </Button>

          <Button
            style={{
              display: permisions.find((perm) => perm == "LoanReject")
                ? "inherit"
                : "none",
            }}
            role="secondary"
            onClick={handleReject}
            disabled={submitWaiting}
          >
            رد
          </Button>
        </ActionBox>
      </Box>
    </>
  );
}
