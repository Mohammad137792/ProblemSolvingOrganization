import React, { useState, useEffect, createRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Grid,
  StepLabel,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "configs";
import axios from "axios";
import LoanInformation from "./steps/LoanInformation";
import Installments from "./steps/Installments";
import Documents from "./steps/Documents";
import CommentBox from "app/main/components/CommentBox";
import ActionBox from "app/main/components/ActionBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import Divider from "@material-ui/core/Divider";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import useListState from "app/main/reducers/listState";

export default function ResponsibleReview({ formVariables, submitCallback }) {
  const [activeStepIndex, setactiveStepIndex] = useState(0);
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [borrowerInformation, setBorrowerInformation] = useState({
    ...formVariables.informationForm?.value,
  });
  const [loanInformation, setLoanInformation] = useState({});
  const [criteriaLoading, setCriteriaLoading] = useState(false);
  const [installmentLoading, setInstallmentLoading] = useState(false);
  const [criteriaTable, setCriteriaTable] = useState([]);
  const [installmentCalc, setInstallmentCalc] = useState({});
  const [installmentTable, setInstallmentTable] = useState([]);
  const [borrowerAttach, setBorrowerAttach] = useState([
    ...formVariables.borrowerAttach?.value,
  ]);
  const [guarantorTable, setGuarantorTable] = useState([
    ...formVariables.guarantors?.value,
  ]);
  const [submitWaiting, setSubmitWaiting] = useState(false);
  const comments = useListState("id", formVariables?.allComments.value || []);
  const infoSubmit = createRef(0);

  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const nextStep = () => {
    if (
      loanInformation.finalLoanAmount &&
      loanInformation.finalInstallmentNumber &&
      loanInformation.requestMeetDate &&
      loanInformation.purpose
    ) {
      setactiveStepIndex((prevState) => {
        return prevState + 1;
      });
    } else {
      infoSubmit.current.click();
    }
  };

  const prevStep = () => {
    setactiveStepIndex((prevState) => {
      return prevState - 1;
    });
  };

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

  const getLoan = () => {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/personLoanInfo?welfareId=${
            formVariables.informationForm?.value?.welfareId
          }&partyRelationshipId=${
            formVariables.informationForm?.value
              ?.applicantPartyRelationshipId ||
            formVariables.informationForm?.value?.starterPartyRelationshipId
          }`,
        axiosKey
      )
      .then((res) => {
        setLoanInformation((prevState) => {
          return {
            ...res.data.personLoanInfo,
            internalAmount:
              formVariables.informationForm?.value?.internalAmount,
            externalAmount:
              formVariables.informationForm?.value?.externalAmount,
            finalLoanAmount:
              formVariables.informationForm?.value?.finalLoanAmount,
            finalInstallmentNumber:
              formVariables.informationForm?.value?.finalInstallmentNumber,
            requestMeetDate:
              formVariables.informationForm?.value?.requestMeetDate,
            purpose: formVariables.informationForm?.value?.purpose,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت  لیست تسهیلات مالی!"
          )
        );
      });
  };

  const getCriteriaList = () => {
    setCriteriaLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/processPersonCriteria?welfareId=${
            formVariables.informationForm?.value?.welfareId
          }&partyRelationshipId=${
            formVariables.informationForm?.value
              ?.applicantPartyRelationshipId ||
            formVariables.informationForm?.value?.starterPartyRelationshipId
          }`,
        axiosKey
      )
      .then((res) => {
        setCriteriaTable(res.data.personWelfareGroupCriteria);
        setCriteriaLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت  لیست معیارهای دریافت تسهیل مالی!"
          )
        );
        setCriteriaLoading(false);
      });
  };

  const getInstallmentList = () => {
    setInstallmentLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/ComputeInstallmentInfo?welfareId=${formVariables.informationForm?.value?.welfareId}&finalLoanAmount=${loanInformation.finalLoanAmount}&finalInstallmentNumber=${loanInformation.finalInstallmentNumber}&requestMeetDate=${loanInformation.requestMeetDate}`,
        axiosKey
      )
      .then((res) => {
        const installmentForm = {
          installmentAmount: res.data?.installmentAmount,
          totalInstallmentProfit: res.data?.totalInstallmentProfit,
          loanFeeAmount: res.data?.loanFeeAmount,
          totalLoanAmount: res.data?.totalLoanAmount,
        };
        setInstallmentCalc(installmentForm);
        setInstallmentTable(res.data.loanInstallment);
        setInstallmentLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت  لیست اقساط!")
        );
        setInstallmentLoading(false);
      });
  };

  const handleSubmit = () => {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/getPhoneNumber?partyRelationshipId=${
            formVariables.informationForm?.value.applicantPartyRelationshipId ||
            formVariables.informationForm?.value.starterPartyRelationshipId
          }`,
        axiosKey
      )
      .then((res) => {
        const packect = {
          borrowerInformation: {
            ...borrowerInformation,
            phoneNumber: res.data?.phoneNumber,
          },
          loanInformation: loanInformation,
          criteriaTable: criteriaTable,
          installmentCalc: installmentCalc,
          installmentTable: installmentTable,
          informationForm: {
            ...formVariables.informationForm?.value,
            ...loanInformation,
            trackingCode: formVariables?.trackingCode.value,
          },
          allComments: comments.list,
          reviewersStatus: "initial",
          responsibleStatus: "Confirmation",
        };
        submitCallback(packect);
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در گرفتن شماره تلفن متقاضی!")
        );
      });
    setSubmitWaiting(true);
  };

  const handleModify = () => {
    setSubmitWaiting(true);
    const packect = {
      responsibleStatus: "Correction",
      allComments: comments.list,
      informationForm: {
        ...formVariables.informationForm?.value,
        ...loanInformation,
        trackingCode: formVariables?.trackingCode.value,
      },
    };
    submitCallback(packect);
  };

  const handleReject = () => {
    setSubmitWaiting(true);
    const packect = {
      responsibleStatus: "Rejection",
      informationForm: {
        ...formVariables.informationForm?.value,
        ...loanInformation,
        trackingCode: formVariables?.trackingCode.value,
      },
    };
    submitCallback(packect);
  };

  const steps = [
    {
      name: "LoanInformation",
      label: "اطلاعات تسهیل مالی",
      component: (
        <LoanInformation
          infoSubmit={infoSubmit}
          fieldsInfo={fieldsInfo}
          borrowerInformation={borrowerInformation}
          setBorrowerInformation={setBorrowerInformation}
          loanInformation={loanInformation}
          setLoanInformation={setLoanInformation}
        />
      ),
    },
    {
      name: "Installments",
      label: "اقساط و شرایط",
      component: (
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
      ),
    },
    {
      name: "Documents",
      label: "مدارک",
      component: (
        <Documents
          submitWaiting={submitWaiting}
          borrowerAttach={borrowerAttach}
          setBorrowerAttach={setBorrowerAttach}
          guarantorTable={guarantorTable}
          setGuarantorTable={setGuarantorTable}
        />
      ),
    },
  ];

  useEffect(() => {
    getUomSelectFields();
    getLoan();
    getCriteriaList();
  }, []);

  useEffect(() => {
    if (
      loanInformation.finalLoanAmount &&
      loanInformation.finalInstallmentNumber &&
      loanInformation.requestMeetDate
    ) {
      getInstallmentList();
    }
  }, [loanInformation]);

  const activeStep = steps[activeStepIndex];

  return (
    <>
      <Box p={2}>
        <CardHeader title={"بررسی درخواست تسهیل مالی"} />
        <Card variant="outlined">
          <Stepper alternativeLabel activeStep={activeStepIndex}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Divider variant="fullWidth" />
          <CardContent>{activeStep.component}</CardContent>
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
          {activeStepIndex != 2 ? (
            <Button role="primary" type="submit" onClick={nextStep}>
              مرحله بعد{" "}
            </Button>
          ) : (
            ""
          )}
          {activeStepIndex == 2 ? (
            <Button
              role="primary"
              onClick={handleSubmit}
              disabled={submitWaiting}
              endIcon={submitWaiting ? <CircularProgress size={20} /> : null}
            >
              تایید{" "}
            </Button>
          ) : (
            ""
          )}
          {activeStepIndex == 2 ? (
            <Button
              role="secondary"
              onClick={handleModify}
              disabled={submitWaiting}
            >
              اصلاح{" "}
            </Button>
          ) : (
            ""
          )}
          {activeStepIndex == 2 ? (
            <Button
              role="secondary"
              onClick={handleReject}
              disabled={submitWaiting}
            >
              رد
            </Button>
          ) : (
            ""
          )}
          {activeStepIndex != 0 ? (
            <Button
              role="secondary"
              onClick={prevStep}
              disabled={submitWaiting}
            >
              مرحله قبل{" "}
            </Button>
          ) : (
            ""
          )}
        </ActionBox>
      </Box>
    </>
  );
}
