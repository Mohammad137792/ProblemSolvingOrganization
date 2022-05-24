import { useState, useEffect, createRef } from "react";
import React from "react";
import ActionBox from "app/main/components/ActionBox";
import { Button, Card, CardContent } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "configs";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../store/actions/fadak";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";
import SpecialExamination from "./steps/SpecialExamination";
import DoctorConfirmation from "./steps/DoctorConfirmation";
import ReferencesInformation from "./steps/ReferencesInformation";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import moment from "moment-jalaali";

const SpecialExaminationForm = (props) => {
  const { formVariables, submitCallback } = props;
  const [step, set_step] = useState("ReferencesInformation");
  const [waiting, setWaiting] = useState(false);
  const [recommendation, setRecommendation] = useState({});
  const [medicalAttachment, setMedicalAttachment] = useState({});
  const [medicalNote, setMedicalNote] = useState({});
  const recomendSubmit = createRef(0);
  const questionnaireSubmit = createRef(0);

  const history = useHistory();

  const dispatch = useDispatch();

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const checkPermissionForSubmit = () => {
    if (
      recommendation.doctorDiagnosisEnumId &&
      recommendation.specialConsideration
    ) {
      submit();
    } else {
      recomendSubmit.current.click();
    }
  };

  const submit = () => {
    setWaiting(true);

    const writerPartyRelationshipId =
      formVariables.examinationProcess.value.doctorPartyRelationshipId;

    const personalExaminationD = {
      examineePartyRelationshipId:
        formVariables.examiner.value?.partyRelationshipId,
      trackingCodeId: formVariables.trackingCode.value,
      doctorExaminationDate: moment(new Date().getTime()).format("YYYY-MM-DD"),
      doctorPartyRelationshipId: writerPartyRelationshipId,
      doctorDiagnosisEnumId: recommendation.doctorDiagnosisEnumId,
      specialConsideration: recommendation.specialConsideration,
      questionnaireAnswerId:
        formVariables.examiner.value?.questionnaireAnswerId,
    };

    const attachments = [];
    if (medicalAttachment?.recommendation?.length > 0) {
      attachments.push(...medicalAttachment?.recommendation);
    }

    const notes = [];
    if (medicalNote?.MNTPresence) {
      const MNTPresenceNote = {
        descriptionEnumId: "MNTPresence",
        writerPartyRelationshipId: writerPartyRelationshipId,
        description: medicalNote?.MNTPresence,
      };
      notes.push(MNTPresenceNote);
    }

    if (medicalNote?.MNTNecessary) {
      const MNTNecessaryNote = {
        descriptionEnumId: "MNTNecessary",
        writerPartyRelationshipId: writerPartyRelationshipId,
        description: medicalNote?.MNTNecessary,
      };
      notes.push(MNTNecessaryNote);
    }

    const tempExaminer = { ...formVariables.examiner.value };
    tempExaminer.personalExamination = personalExaminationD;
    tempExaminer.medicalAttachment = attachments;
    tempExaminer.medicalNote = notes;

    const tempExaminers = [...formVariables.examiners.value];

    const examinerIndex = tempExaminers.findIndex(
      (exam) => exam.partyId == tempExaminer.partyId
    );
    tempExaminers[examinerIndex] = tempExaminer;

    const data = {
      examiners: tempExaminers,
      examiner: tempExaminer,
    };
    submitCallback(data);
  };

  const nextStep = () => {
    if (step === "ReferencesInformation") {
      set_step("SpecialExamination");
    } else if (step === "SpecialExamination") {
      set_step("DoctorConfirmation");
    }
  };

  const priviousStep = () => {
    if (step === "DoctorConfirmation") {
      set_step("SpecialExamination");
    } else if (step === "SpecialExamination") {
      set_step("ReferencesInformation");
    }
  };

  return (
    <Card>
      <CardContent>
        <HandleStep
          stepName={step}
          formVariables={formVariables}
          recommendation={recommendation}
          setRecommendation={setRecommendation}
          medicalAttachment={medicalAttachment}
          setMedicalAttachment={setMedicalAttachment}
          medicalNote={medicalNote}
          setMedicalNote={setMedicalNote}
          personalSubmit={questionnaireSubmit}
          recomendSubmit={recomendSubmit}
        />
      </CardContent>
      <CardContent>
        <ActionBox>
          {step == "DoctorConfirmation" ? (
            <Button
              type="submit"
              role="primary"
              onClick={checkPermissionForSubmit}
              disabled={waiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              تایید و ارسال
            </Button>
          ) : (
            ""
          )}
          {step != "DoctorConfirmation" ? (
            <Button type="submit" role="primary" onClick={nextStep}>
              گام بعدی{" "}
            </Button>
          ) : (
            ""
          )}
          {step != "ReferencesInformation" ? (
            <Button
              type="reset"
              role="secondary"
              onClick={priviousStep}
              disabled={waiting}
            >
              گام قبلی
            </Button>
          ) : (
            ""
          )}
        </ActionBox>
      </CardContent>
    </Card>
  );
};

export default SpecialExaminationForm;

function HandleStep(props) {
  const {
    stepName,
    formVariables,
    recommendation,
    setRecommendation,
    medicalAttachment,
    setMedicalAttachment,
    medicalNote,
    setMedicalNote,
    questionnaireSubmit,
    recomendSubmit,
  } = props;

  const [faceImage, setFaceImage] = useState("");
  const [formValues, setFormValues] = useState({
    ...formVariables.examiner.value,
    trackingCode: formVariables.trackingCode.value,
    examinationTypeEnum:
      formVariables.examinationProcess.value.examinationTypeEnum,
    questionnaireName: formVariables.examinationProcess.value.questionnaireName,
    requesterFullName: formVariables.examinationProcess.value.requesterFullName,
  });

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/fadak/userHedaerInfo?justFace=Y&partyId=${formVariables.examiner.value.partyId}&partyRelationshipId=${formVariables.examiner.value.partyRelationshipId}`,
        axiosKey
      )
      .then((res) => {
        setFaceImage(res.data.faceImage);
      })
      .catch(() => {});
  }, []);

  const steps = [
    {
      name: "ReferencesInformation",
      label: "اطلاعات مراجع",
      component: (
        <ReferencesInformation
          formValues={formValues}
          setFormValues={setFormValues}
          setMedicalAttachment={setMedicalAttachment}
          faceImage={faceImage}
        />
      ),
    },
    {
      name: "SpecialExamination",
      label: "معاینات خاص",
      component: (
        <SpecialExamination
          questionnaireSubmit={questionnaireSubmit}
          answerId={formVariables.examiner.value.questionnaireAnswerId}
        />
      ),
    },
    {
      name: "DoctorConfirmation",
      label: "تایید و نظر نهایی پزشک",
      component: (
        <DoctorConfirmation
          recommendation={recommendation}
          setRecommendation={setRecommendation}
          medicalAttachment={medicalAttachment}
          setMedicalAttachment={setMedicalAttachment}
          medicalNote={medicalNote}
          setMedicalNote={setMedicalNote}
          recomendSubmit={recomendSubmit}
        />
      ),
    },
  ];

  const activeStepIndex = steps.findIndex((i) => i.name === stepName);
  const activeStep = steps[activeStepIndex];

  return (
    <div>
      <Stepper alternativeLabel activeStep={activeStepIndex}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep.component}
    </div>
  );
}
