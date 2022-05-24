import React, { useState, useEffect, createRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Button,
  StepLabel,
  Grid,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "configs";
import axios from "axios";
import Documents from "./steps/Documents";
import LoanInformation from "./steps/LoanInformation";
import CommentBox from "app/main/components/CommentBox";
import CircularProgress from "@material-ui/core/CircularProgress";
import ActionBox from "app/main/components/ActionBox";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import Divider from "@material-ui/core/Divider";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import moment from "moment-jalaali";
import useListState from "app/main/reducers/listState";

export default function RequestForm({ formVariables, submitCallback, reset }) {
  const [activeStepIndex, setactiveStepIndex] = useState(0);
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [informationForm, setInformationForm] = useState(
    formVariables?.informationForm?.value || {}
  );
  const [borrowerTable, setBorrowerTable] = useState(
    formVariables?.borrowerAttach?.value || []
  );
  const [guarantorTable, setGuarantorTable] = useState(
    formVariables?.guarantors?.value || []
  );
  const [submitWaiting, setSubmitWaiting] = useState(false);
  const comments = useListState("id", formVariables?.allComments.value || []);
  const infoSubmit = createRef(0);
  const isDisableSubmit = !(
    borrowerTable.every((borrower) => borrower.statusId === "Completed") &&
    guarantorTable.every(
      (guarantor) =>
        guarantor.statusId === "Completed" ||
        guarantor.statusId === "Confirmation"
    )
  );
  // const inGuarantorStep =
  //   formVariables?.responsibleStatus?.value !== "Correction" &&
  //   formVariables?.guarantors?.value
  //     .filter((guarantor) => guarantor.statusId !== "Confirmation")
  //     .map((guarantor) => guarantor.username);

  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const nextStep = () => {
    if (
      informationForm.starterEmplPositionId &&
      informationForm.welfareId &&
      informationForm.finalLoanAmount &&
      informationForm.finalInstallmentNumber &&
      informationForm.requestMeetDate &&
      informationForm.purpose
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

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=LoanType,InstallmentCalculationMethod",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            loanType: res.data.enums.LoanType,
            installmentCalculationMethod:
              res.data.enums.InstallmentCalculationMethod,
          };
        });
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

  const getCompanyPositions = () => {
    axios
      .get(SERVER_URL + "/rest/s1/humanres/companyInfo", axiosKey)
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            companyEmplPositions: res.data.emplPosition,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت پست‌های سازمانی!")
        );
      });
  };

  const getCompanyPesonnel = () => {
    axios
      .post(
        SERVER_URL + "/rest/s1/fadak/searchUsers",
        {
          data: { justCompanyPartyId: "Y" },
        },
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            companyPesonnel: res.data.result,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در دریافت پرسنل رخ داده است."
          )
        );
      });
  };

  const getWelfareList = () => {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/filterWelfareWithPartyRel?partyRelationshipId=${
            informationForm.applicantPartyRelationshipId ||
            informationForm.starterPartyRelationshipId
          }`,
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            welfare: res.data.loanInfo,
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

  const getStarterInfo = () => {
    axios
      .get(SERVER_URL + "/rest/s1/humanres/getCurrentUser", axiosKey)
      .then((res) => {
        const defaultvalue = {};
        if (!formVariables?.trackingCode?.value) {
          defaultvalue.starterEmplPositionId = res.data.emplPositionId;
          defaultvalue.applicantEmplPositionId = res.data.emplPositionId;
          defaultvalue.starterEmplPosition = res.data.emplPosition;
          defaultvalue.starterFullName = res.data.fullName;
          defaultvalue.starterPseudoId = res.data.pseudoId;
          defaultvalue.starterPartyRelationshipId =
            res.data.partyRelationshipId;
          defaultvalue.applicantPartyRelationshipId =
            res.data.partyRelationshipId;
          defaultvalue.starterInfo =
            `${res.data.pseudoId} ─ ${res.data.fullName}` || "؟";
          defaultvalue.requestDate = moment(new Date().getTime()).format(
            "YYYY-MM-DD"
          );
          setInformationForm((prevState) => {
            return { ...prevState, ...defaultvalue };
          });
        }
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            starterEmplPositions: res.data.emplPositions,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در گرفتن اطلاعات کاربر!")
        );
      });
  };

  const getGuarantorDocuments = () => {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/guarantorNeededDocument?welfareId=${
            informationForm?.welfareId
          }&partyRelationshipId=${
            informationForm.applicantPartyRelationshipId ||
            informationForm.starterPartyRelationshipId
          }`,
        axiosKey
      )
      .then((res) => {
        setGuarantorTable((prevState) => {
          return [...res.data?.guarantorNeededDocument];
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در گرفتن لیست ضامن‌های مورد نیاز!"
          )
        );
      });
  };

  const getBorrowerDocuments = () => {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/personNeededDocument?loanTypeEnumId=${
            informationForm?.loanTypeEnumId
          }&partyRelationshipId=${
            informationForm.applicantPartyRelationshipId ||
            informationForm.starterPartyRelationshipId
          }`,
        axiosKey
      )
      .then((res) => {
        setBorrowerTable((prevState) => {
          return [...res.data?.neededDocumentInfo];
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در گرفتن لیست مدارک مورد نیاز وام گیرنده!"
          )
        );
      });
  };

  const handleSubmit = () => {
    setSubmitWaiting(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/WelfareGroupType?welfareGroupPartyClassificationId=${informationForm?.welfareGroupPartyClassificationId}`,
        axiosKey
      )
      .then((res) => {
        const completedInformationForm = {};

        const applicantInfo = fieldsInfo?.companyPesonnel.find(
          (person) =>
            person.partyRelationshipId ==
            informationForm.applicantPartyRelationshipId
        );

        completedInformationForm.applicantFullName =
          informationForm.applicantPartyRelationshipId
            ? `${applicantInfo?.pseudoId || ""} ─ ${
                applicantInfo?.fullName || ""
              }`
            : `${informationForm?.starterPseudoId || ""} ─ ${
                informationForm?.starterFullName || ""
              }`;

        completedInformationForm.applicantPartyRelationshipId =
          informationForm.applicantPartyRelationshipId
            ? informationForm.applicantPartyRelationshipId
            : informationForm.starterPartyRelationshipId;

        completedInformationForm.applicantEmplPositionId =
          informationForm.applicantEmplPositionId
            ? informationForm.applicantEmplPositionId
            : informationForm.starterEmplPositionId;

        completedInformationForm.applicantEmplPosition =
          informationForm.applicantEmplPositionId
            ? fieldsInfo?.companyEmplPositions.find(
                (emp) =>
                  emp.emplPositionId == informationForm.applicantEmplPositionId
              )?.description
            : informationForm.starterEmplPosition;

        completedInformationForm.borrowerName =
          informationForm.applicantPartyRelationshipId
            ? completedInformationForm.applicantFullName
            : informationForm.starterFullName;

        completedInformationForm.welfareTitle = `${
          informationForm?.welfareCode || ""
        } ─ ${informationForm?.title || ""}`;

        completedInformationForm.welfareCode = informationForm?.welfareCode;
        completedInformationForm.loanTypeEnum = fieldsInfo.loanType.find(
          (item) => item.enumId == informationForm.loanTypeEnumId
        )?.description;

        const initialData = {
          informationForm: { ...informationForm, ...completedInformationForm },
          borrowerAttach: borrowerTable.map(
            ({ observeFile, ...keepAttrs }) => keepAttrs
          ),
          guarantors: guarantorTable,
          internalGuarantors: guarantorTable.filter(
            (guarantor) =>
              guarantor.guarantorTypeEnumId == "InternalGuarantor" &&
              guarantor.statusId == "Completed"
          ),
          reviewers: res.data?.WelfareGroupTypeInfo,
          allComments: comments.list,
          borrowerStatus: formVariables?.trackingCode?.value
            ? "Confirmation"
            : "Initial",
          processType: "WelfareLoan",
        };

        submitCallback(initialData);
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت بررسی کنندگان وام!")
        );
      });
  };

  const handleReject = () => {
    setSubmitWaiting(true);
    const packet = { borrowerStatus: "Rejection" };
    submitCallback(packet);
  };

  const handleReset = () => {
    setInformationForm(formVariables?.informationForm?.value || {});
    setBorrowerTable(formVariables?.borrowerAttach?.value || []);
    setGuarantorTable(formVariables?.guarantors?.value || []);
    comments.set(formVariables?.allComments.value || []);
    setactiveStepIndex(0);
    setSubmitWaiting(false);
  };

  const steps = [
    {
      name: "LoanInformation",
      label: "اطلاعات تسهیل مالی",
      component: (
        <LoanInformation
          fieldsInfo={fieldsInfo}
          formValues={informationForm}
          setFormValues={setInformationForm}
          infoSubmit={infoSubmit}
          inResponsibleStep={formVariables?.responsibleStatus?.value}
        />
      ),
    },
    {
      name: "Documents",
      label: "مدارک",
      component: (
        <Documents
          borrowerTable={borrowerTable}
          setBorrowerTable={setBorrowerTable}
          guarantorTable={guarantorTable}
          setGuarantorTable={setGuarantorTable}
          submitWaiting={submitWaiting}
          inResponsibleStep={formVariables?.responsibleStatus?.value}
        />
      ),
    },
  ];

  useEffect(() => {
    getEnumSelectFields();
    getUomSelectFields();
    getStarterInfo();
    getCompanyPositions();
    getCompanyPesonnel();
  }, []);

  useEffect(() => {
    if (informationForm?.welfareId && !formVariables?.trackingCode?.value) {
      getGuarantorDocuments();
    }
  }, [informationForm.welfareId, informationForm.applicantPartyRelationshipId]);

  useEffect(() => {
    if (
      informationForm.starterPartyRelationshipId ||
      informationForm.applicantPartyRelationshipId
    ) {
      getWelfareList();
    }
    if (!formVariables?.trackingCode?.value && informationForm.loanTypeEnumId) {
      getBorrowerDocuments();
    }
  }, [
    informationForm.starterPartyRelationshipId,
    informationForm.applicantPartyRelationshipId,
    informationForm.loanTypeEnumId,
  ]);

  useEffect(() => {
    if (reset == "success") {
      handleReset();
    }
  }, [reset]);

  const activeStep = steps[activeStepIndex];

  return (
    <>
      <Box p={2}>
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
          {formVariables?.allComments && (
            <CardContent>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CommentBox context={comments} />
                </Card>
              </Grid>
            </CardContent>
          )}
          <Box mb={2} />
          <ActionBox>
            {activeStepIndex == 0 ? (
              <Button role="primary" type="submit" onClick={nextStep}>
                مرحله بعد{" "}
              </Button>
            ) : (
              ""
            )}
            {activeStepIndex == 1 ? (
              <Button
                role="primary"
                onClick={handleSubmit}
                disabled={submitWaiting || isDisableSubmit}
                endIcon={submitWaiting ? <CircularProgress size={20} /> : null}
              >
                ثبت درخواست{" "}
              </Button>
            ) : (
              ""
            )}
            {activeStepIndex == 1 && formVariables?.trackingCode?.value ? (
              <Button
                role="secondary"
                onClick={handleReject}
                disabled={submitWaiting || isDisableSubmit}
              >
                رد
              </Button>
            ) : (
              ""
            )}
            {activeStepIndex == 1 ? (
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
        </Card>
      </Box>
    </>
  );
}
