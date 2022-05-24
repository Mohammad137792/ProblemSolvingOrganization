import { useState, useEffect, createRef } from "react";
import React from "react";
import ActionBox from "../../../../../../components/ActionBox";
import { Button, Card, CardContent } from "@material-ui/core";
import { SERVER_URL } from "configs";
import axios from "axios";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import ReferencesInformation from "./steps/ReferencesInformation";
import PersonalFamilyBackground from "./steps/PersonalFamilyBackground";
import ClinicalExaminations from "./steps/ClinicalExaminations";
import ParaclinicsAndReferrals from "./steps/ParaclinicsAndReferrals";
import ConfirmationAndDoctorFinalOpinion from "./steps/ConfirmationAndDoctorFinalOpinion";
import moment from "moment-jalaali";

const MedicalExaminationsForm = (props) => {
  const { formVariables, submitCallback } = props;
  const [step, set_step] = useState("ReferencesInformation");
  const [waiting, setWaiting] = useState(false);

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [personalExamination, setPersonalExamination] = useState({});
  const [clinicalExamination, setClinicalExamination] = useState([]);
  const [bloodExperiment, setBloodExperiment] = useState([]);
  const [paraclinicalAction, setParaclinicalAction] = useState([]);
  const [recommendation, setRecommendation] = useState({});
  const [medicalAttachment, setMedicalAttachment] = useState({});
  const [medicalNote, setMedicalNote] = useState({});
  const recomendSubmit = createRef(0);
  const personalSubmit = createRef(0);

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
      ...formVariables.examiner.value.personalExamination,
      ...personalExamination,
      doctorExaminationDate: moment(new Date().getTime()).format("YYYY-MM-DD"),
      doctorPartyRelationshipId: writerPartyRelationshipId,
      doctorDiagnosisEnumId: recommendation.doctorDiagnosisEnumId,
      specialConsideration: recommendation.specialConsideration,
    };

    const attachments = [...formVariables.examiner.value.medicalAttachment];
    if (medicalAttachment?.DoctorReferrals?.length > 0) {
      attachments.push(...medicalAttachment?.DoctorReferrals);
    }
    if (medicalAttachment?.recommendation?.length > 0) {
      attachments.push(...medicalAttachment?.recommendation);
    }

    const notes = [...formVariables.examiner.value.medicalNote];
    if (medicalNote?.MNTBaliny) {
      const MNTBalinyNote = {
        descriptionEnumId: "MNTBaliny",
        writerPartyRelationshipId: writerPartyRelationshipId,
        description: medicalNote?.MNTBaliny,
      };
      notes.push(MNTBalinyNote);
    }

    if (medicalNote?.MNTExame) {
      const MNTExameNote = {
        descriptionEnumId: "MNTExame",
        writerPartyRelationshipId: writerPartyRelationshipId,
        description: medicalNote?.MNTExame,
      };
      notes.push(MNTExameNote);
    }

    if (medicalNote?.MNTParacilinic) {
      const MNTParacilinicNote = {
        descriptionEnumId: "MNTParacilinic",
        writerPartyRelationshipId: writerPartyRelationshipId,
        description: medicalNote?.MNTParacilinic,
      };
      notes.push(MNTParacilinicNote);
    }

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
    tempExaminer.medicalHistory = medicalHistory;
    tempExaminer.clinicalExamination = clinicalExamination;
    tempExaminer.bloodExperiment = bloodExperiment;
    tempExaminer.paraclinicalAction = paraclinicalAction;
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
      set_step("PersonalFamilyBackground");
    } else if (step === "PersonalFamilyBackground") {
      set_step("ClinicalExaminations");
    } else if (step === "ClinicalExaminations") {
      if (
        personalExamination.height &&
        personalExamination.weight &&
        personalExamination.bloodTypeEnumId &&
        personalExamination.heartBeatRate &&
        personalExamination.temperature &&
        personalExamination.bloodPressureMax &&
        personalExamination.bloodPressureMin
      ) {
        set_step("ParaclinicsAndReferrals");
      } else {
        personalSubmit.current.click();
      }
    } else if (step === "ParaclinicsAndReferrals") {
      set_step("ConfirmationAndDoctorFinalOpinion");
    }
  };

  const priviousStep = () => {
    if (step === "ConfirmationAndDoctorFinalOpinion") {
      set_step("ParaclinicsAndReferrals");
    } else if (step === "ParaclinicsAndReferrals") {
      set_step("ClinicalExaminations");
    } else if (step === "ClinicalExaminations") {
      set_step("PersonalFamilyBackground");
    } else if (step === "PersonalFamilyBackground") {
      set_step("ReferencesInformation");
    }
  };

  return (
    <Card>
      <CardContent>
        <HandleStep
          stepName={step}
          formVariables={formVariables}
          medicalHistory={medicalHistory}
          setMedicalHistory={setMedicalHistory}
          personalExamination={personalExamination}
          setPersonalExamination={setPersonalExamination}
          clinicalExamination={clinicalExamination}
          setClinicalExamination={setClinicalExamination}
          bloodExperiment={bloodExperiment}
          setBloodExperiment={setBloodExperiment}
          paraclinicalAction={paraclinicalAction}
          setParaclinicalAction={setParaclinicalAction}
          recommendation={recommendation}
          setRecommendation={setRecommendation}
          medicalAttachment={medicalAttachment}
          setMedicalAttachment={setMedicalAttachment}
          medicalNote={medicalNote}
          setMedicalNote={setMedicalNote}
          personalSubmit={personalSubmit}
          recomendSubmit={recomendSubmit}
        />
      </CardContent>
      <CardContent>
        <ActionBox>
          {step == "ConfirmationAndDoctorFinalOpinion" ? (
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
          {step != "ConfirmationAndDoctorFinalOpinion" ? (
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

export default MedicalExaminationsForm;

function HandleStep(props) {
  const {
    stepName,
    formVariables,
    medicalHistory,
    setMedicalHistory,
    personalExamination,
    setPersonalExamination,
    clinicalExamination,
    setClinicalExamination,
    bloodExperiment,
    setBloodExperiment,
    paraclinicalAction,
    setParaclinicalAction,
    recommendation,
    setRecommendation,
    medicalAttachment,
    setMedicalAttachment,
    medicalNote,
    setMedicalNote,
    personalSubmit,
    recomendSubmit,
  } = props;
  const [faceImage, setFaceImage] = useState("");
  const [formValues, setFormValues] = useState({
    ...formVariables.examiner.value,
    trackingCode: formVariables.trackingCode.value,
    examinationTypeEnum:
      formVariables.examinationProcess.value.examinationTypeEnum,
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
      name: "PersonalFamilyBackground",
      label: "سابقه شخصی خانوادگی",
      component: (
        <PersonalFamilyBackground
          medicalHistory={medicalHistory}
          setMedicalHistory={setMedicalHistory}
        />
      ),
    },
    {
      name: "ClinicalExaminations",
      label: "معاینات بالینی",
      component: (
        <ClinicalExaminations
          personalExamination={personalExamination}
          setPersonalExamination={setPersonalExamination}
          clinicalExamination={clinicalExamination}
          setClinicalExamination={setClinicalExamination}
          medicalNote={medicalNote}
          setMedicalNote={setMedicalNote}
          personalSubmit={personalSubmit}
        />
      ),
    },
    {
      name: "ParaclinicsAndReferrals",
      label: "پاراکلینیک ها و ارجاعات",
      component: (
        <ParaclinicsAndReferrals
          bloodExperiment={bloodExperiment}
          setBloodExperiment={setBloodExperiment}
          paraclinicalAction={paraclinicalAction}
          setParaclinicalAction={setParaclinicalAction}
          medicalAttachment={medicalAttachment}
          setMedicalAttachment={setMedicalAttachment}
          medicalNote={medicalNote}
          setMedicalNote={setMedicalNote}
        />
      ),
    },
    {
      name: "ConfirmationAndDoctorFinalOpinion",
      label: "تایید و نظر نهایی پزشک",
      component: (
        <ConfirmationAndDoctorFinalOpinion
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
