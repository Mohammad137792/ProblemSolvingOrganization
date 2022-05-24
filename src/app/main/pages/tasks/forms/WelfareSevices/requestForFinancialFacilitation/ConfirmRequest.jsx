import React, { useState, useEffect } from "react";
import { Card, CardHeader, Button, Box, CardContent } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "configs";
import axios from "axios";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import FormPro from "app/main/components/formControls/FormPro";
import TabPro from "app/main/components/TabPro";
import LoanInformation from "../finalReview/tabs/LoanInformation";
import Installments from "../finalReview/tabs/Installments";
import Documents from "../finalReview/tabs/Documents";

export default function ConfirmRequest({ formVariables, submitCallback }) {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [loanInformation, setLoanInformation] = useState({});
  const [criteriaLoading, setCriteriaLoading] = useState(false);
  const [installmentLoading, setInstallmentLoading] = useState(false);
  const [guarantorLoading, setGuarantorLoading] = useState(false);
  const [borrowerLoading, setBorrowerLoading] = useState(false);
  const [borrowerInformation, setBorrowerInformation] = useState({});
  const [criteriaTable, setCriteriaTable] = useState([]);
  const [installmentCalc, setInstallmentCalc] = useState({});
  const [installmentTable, setInstallmentTable] = useState([]);
  const [borrowerAttach, setBorrowerAttach] = useState([]);
  const [guarantorTable, setGuarantorTable] = useState([]);
  const [submitWaiting, setSubmitWaiting] = useState(false);

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
      name: "requestDate",
      label: "تاریخ درخواست",
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

  const getRecipientInfo = () => {
    setInstallmentLoading(true);
    setGuarantorLoading(true);
    setBorrowerLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/RecipientInfo?accompanyId=${formVariables.accompanyId?.value}`,
        axiosKey
      )
      .then((res) => {
        setBorrowerInformation((prevState) => {
          return {
            ...prevState,
            ...res.data.informationForm,
            applicantEmplPosition: res.data?.informationForm?.emplPosition,
            trackingCode: formVariables?.trackingCode.value,
          };
        });
        setLoanInformation((prevState) => {
          return {
            ...prevState,
            ...res.data.informationForm,
          };
        });
        setInstallmentCalc((prevState) => {
          return {
            ...prevState,
            ...res.data.installmentCalc,
            installmentAmount: res.data.installmentCalc?.finalLoanAmount,
          };
        });
        setInstallmentTable((prevState) => {
          return [...prevState, ...res.data.installmentTable];
        });
        setBorrowerAttach((prevState) => {
          return [...prevState, ...res.data.borrowerAttach];
        });
        setGuarantorTable((prevState) => {
          return [...prevState, ...res.data.guarantors];
        });
        setInstallmentLoading(false);
        setGuarantorLoading(false);
      })
      .catch(() => {
        setInstallmentLoading(false);
        setGuarantorLoading(false);
        setBorrowerLoading(false);

        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در گرفتن اطلاعات تسهیل گیرنده!"
          )
        );
      });
  };

  const handleSubmit = () => {
    setSubmitWaiting(true);
    submitCallback({});
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
      label: "اقساط و شرایط",
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
      label: "مدارک",
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
      display: !formVariables?.guarantor?.value,
    },
  ];

  useEffect(() => {
    getUomSelectFields();
    getRecipientInfo();
  }, []);

  return (
    <>
      <Box p={2}>
        <CardHeader title={"مشخصات تسهیل مالی تایید شده"} />
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
        <ActionBox>
          <Button
            role="primary"
            onClick={handleSubmit}
            disabled={submitWaiting}
            endIcon={submitWaiting ? <CircularProgress size={20} /> : null}
          >
            تایید{" "}
          </Button>
        </ActionBox>
      </Box>
    </>
  );
}
