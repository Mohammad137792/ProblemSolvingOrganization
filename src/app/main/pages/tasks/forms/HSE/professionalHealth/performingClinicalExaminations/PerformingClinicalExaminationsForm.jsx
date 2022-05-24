import { useState, useEffect } from "react";
import { FusePageSimple } from "@fuse";
import React from "react";
import ActionBox from "app/main/components/ActionBox";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { SERVER_URL } from "configs";
import axios from "axios";
import { useDispatch } from "react-redux";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import ReferencesInformation from "./steps/ReferencesInformation";
import AHFJO from "./steps/AHFJO";
import Paraclinics from "./steps/Paraclinics";
import AFOPHE from "./steps/AFOPHE";
import { setAlertContent } from "./../../../../../../../store/actions/fadak/alert.actions";
import { ALERT_TYPES } from "app/store/actions";
import moment from "moment-jalaali";

const PerformingClinicalExaminationsForm = (props) => {
  const { formVariables, submitCallback } = props;
  const [step, set_step] = useState("ReferencesInformation");
  const [waiting, setWaiting] = useState(false);

  const [damagingAgent, setDamagingAgent] = useState([]);
  const [optometryExamination, setOptometryExamination] = useState([]);
  const [spirometryExamination, setSpirometryExamination] = useState([]);
  const [audiometryExamination, setAudiometryExamination] = useState([]);
  const [medicalAttachment, setMedicalAttachment] = useState({});
  const [medicalNote, setMedicalNote] = useState({});

  useEffect(() => {
    console.log(formVariables.examiner.value, "examiner");
    console.log(formVariables, "formVariables");
  }, []);

  const submit = () => {
    setWaiting(true);

    const writerPartyRelationshipId =
      formVariables.examinationProcess.value.occupationalPartyRelationshipId;

    const personalExamination = {
      examineePartyRelationshipId:
        formVariables.examiner.value.partyRelationshipId,
      occupationalExaminationDate: moment(new Date().getTime()).format(
        "YYYY-MM-DD"
      ),
      trackingCodeId: formVariables.trackingCode.value,
      occupationalPartyRelationshipId: writerPartyRelationshipId,
      stereopsis:
        optometryExamination?.find((opt) => opt.stereopsis)?.stereopsis || null,
    };

    const attachments = [];
    if (medicalAttachment?.OccuationalRef) {
      const OccuationalRefAttach = {
        medicalAttachEnumId: "OccuationalRef",
        contentLocation: medicalAttachment?.OccuationalRef,
      };
      attachments.push(OccuationalRefAttach);
    }
    if (medicalAttachment?.FinalOccuational?.length > 0) {
      attachments.push(...medicalAttachment?.FinalOccuational);
    }

    const notes = [];
    if (medicalNote?.MNTExpert) {
      const MNTExpertNote = {
        descriptionEnumId: "MNTExpert",
        writerPartyRelationshipId: writerPartyRelationshipId,
        description: medicalNote?.MNTExpert,
      };
      notes.push(MNTExpertNote);
    }
    if (medicalNote?.MNTOptometeri) {
      const MNTOptometeriNote = {
        descriptionEnumId: "MNTOptometeri",
        writerPartyRelationshipId: writerPartyRelationshipId,
        description: medicalNote?.MNTOptometeri,
      };
      notes.push(MNTOptometeriNote);
    }
    if (medicalNote?.MNTEspirometeri) {
      const MNTEspirometeriNote = {
        descriptionEnumId: "MNTEspirometeri",
        writerPartyRelationshipId: writerPartyRelationshipId,
        description: medicalNote?.MNTEspirometeri,
      };
      notes.push(MNTEspirometeriNote);
    }
    if (medicalNote?.MNTAudiometeri) {
      const MNTAudiometeriNote = {
        descriptionEnumId: "MNTAudiometeri",
        writerPartyRelationshipId: writerPartyRelationshipId,
        description: medicalNote?.MNTAudiometeri,
      };
      notes.push(MNTAudiometeriNote);
    }
    if (medicalNote?.MNTHealth) {
      const MNTHealthNote = {
        descriptionEnumId: "MNTHealth",
        writerPartyRelationshipId: writerPartyRelationshipId,
        description: medicalNote?.MNTHealth,
      };
      notes.push(MNTHealthNote);
    }

    const tempExaminer = { ...formVariables.examiner.value };
    tempExaminer.personalExamination = personalExamination;
    tempExaminer.damagingAgent = damagingAgent;
    tempExaminer.optometryExamination = optometryExamination;
    tempExaminer.spirometryExamination = spirometryExamination;
    tempExaminer.audiometryExamination = audiometryExamination;
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
      set_step("AHFJO");
    } else if (step === "AHFJO") {
      set_step("Paraclinics");
    } else if (step === "Paraclinics") {
      set_step("AFOPHE");
    }
  };

  const priviousStep = () => {
    if (step === "AFOPHE") {
      set_step("Paraclinics");
    } else if (step === "Paraclinics") {
      set_step("AHFJO");
    } else if (step === "AHFJO") {
      set_step("ReferencesInformation");
    }
  };

  return (
    <Card>
      <CardContent>
        <HandleStep
          stepName={step}
          formVariables={formVariables}
          damagingAgent={damagingAgent}
          setDamagingAgent={setDamagingAgent}
          optometryExamination={optometryExamination}
          setOptometryExamination={setOptometryExamination}
          spirometryExamination={spirometryExamination}
          setSpirometryExamination={setSpirometryExamination}
          audiometryExamination={audiometryExamination}
          setAudiometryExamination={setAudiometryExamination}
          medicalAttachment={medicalAttachment}
          setMedicalAttachment={setMedicalAttachment}
          medicalNote={medicalNote}
          setMedicalNote={setMedicalNote}
        />
      </CardContent>
      <CardContent>
        <ActionBox>
          {step == "AFOPHE" ? (
            <Button
              type="submit"
              role="primary"
              onClick={submit}
              disabled={waiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              تایید و ارسال
            </Button>
          ) : (
            ""
          )}
          {step != "AFOPHE" ? (
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

export default PerformingClinicalExaminationsForm;

function HandleStep(props) {
  const {
    stepName,
    formVariables,
    damagingAgent,
    setDamagingAgent,
    optometryExamination,
    setOptometryExamination,
    spirometryExamination,
    setSpirometryExamination,
    audiometryExamination,
    setAudiometryExamination,
    medicalAttachment,
    setMedicalAttachment,
    medicalNote,
    setMedicalNote,
  } = props;
  const [faceImage, setFaceImage] = useState("");
  const [formValues, setFormValues] = useState({
    ...formVariables.examiner.value,
    trackingCode: formVariables.trackingCode.value,
    examinationTypeEnum:
      formVariables.examinationProcess.value.examinationTypeEnum,
  });
  // const [damagingAgent, setDamagingAgent] = useState([]);
  // const [optometryExamination, setOptometryExamination] = useState([]);
  // const [spirometryExamination, setSpirometryExamination] = useState([]);
  // const [audiometryExamination, setAudiometryExamination] = useState([]);
  // const [medicalAttachment, setMedicalAttachment] = useState({});
  // const [medicalNote, setMedicalNote] = useState({});
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const getExaminerJobs = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/healthAndCare/workExperience?partyRelationshipId=" +
          formVariables.examiner.value.partyRelationshipId,
        axiosKey
      )
      .then((res) => {
        setDamagingAgent(res.data.workExperiences);
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در گرفتن  مشاغل فرد!")
        );
      });
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
    getExaminerJobs();
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
      name: "AHFJO",
      label: "ارزابی عوامل زیان آور مشاغل",
      component: (
        <AHFJO
          examiner={{ ...formVariables.examiner.value }}
          medicalNote={medicalNote}
          setMedicalNote={setMedicalNote}
          damagingAgent={damagingAgent}
          setDamagingAgent={setDamagingAgent}
        />
      ),
    },
    {
      name: "Paraclinics",
      label: "پاراکلینیک ها",
      component: (
        <Paraclinics
          optometryTableContent={optometryExamination}
          setOptometryTableContent={setOptometryExamination}
          spirometryTableContent={spirometryExamination}
          setSpirometryTableContent={setSpirometryExamination}
          audiometryTableContent={audiometryExamination}
          setAudiometryTableContent={setAudiometryExamination}
          medicalNote={medicalNote}
          setMedicalNote={setMedicalNote}
        />
      ),
    },
    {
      name: "AFOPHE",
      label: "تایید و نظر نهایی کارشناس بهداشت حرفه ای",
      component: (
        <AFOPHE
          setMedicalAttachment={setMedicalAttachment}
          medicalAttachment={medicalAttachment}
          medicalNote={medicalNote}
          setMedicalNote={setMedicalNote}
        />
      ),
    },
  ];

  const activeStepIndex = steps.findIndex((i) => i.name === stepName);
  const activeStep = steps[activeStepIndex];

  return (
    <React.Fragment>
      <FusePageSimple
        header={
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" className="p-10">
              {" "}
              معاینات پاراکلینیکی
            </Typography>
          </div>
        }
        content={
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
        }
      />
    </React.Fragment>
  );
}
