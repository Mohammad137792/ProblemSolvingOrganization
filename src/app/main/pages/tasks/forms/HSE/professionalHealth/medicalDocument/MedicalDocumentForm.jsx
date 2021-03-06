import { FusePageSimple } from "@fuse";
import FormPro from "app/main/components/formControls/FormPro";
import TabPro from "app/main/components/TabPro";
import TablePro from "app/main/components/TablePro";
import { useState, useEffect } from "react";
import React from "react";
import ActionBox from "app/main/components/ActionBox";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../store/actions/fadak";
import axios from "axios";
import { SERVER_URL } from "configs";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import { addNote } from "./../../../../../../../store/actions/fadak/hse.actions";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import AHFJO from "./tabs/AHFJO";
import Paraclinics from "./tabs/Paraclinics";
import PersonalFamilyBackground from "./tabs/PersonalFamilyBackground";
import Referrals from "./tabs/Referrals";

const MedicalDocumentForm = () => {
  const reduxInfo = useSelector(({ fadak }) => fadak.hseDoq);
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [processValue, setProcessValue] = useState({});
  const [personalValue, setPersonalValue] = useState({
    ...reduxInfo.examiner.personalExamination,
  });
  const [recommendationValue, setRecommendationValue] = useState({});
  const [clinicalLoading, setClinicalLoading] = useState(false);
  const [clinicalValue, setClinicalValue] = useState({});
  const [clinicalExamination, setClinicalExamination] = useState([
    ...reduxInfo.examiner.clinicalExamination,
  ]);
  const datas = useSelector(({ fadak }) => fadak);
  const dispatch = useDispatch();
  const history = useHistory();

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const processStructure = [
    {
      name: "doctorName",
      label: "???????? ???????????? ??????????",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "occupationalName",
      label: "?????????????? ???????????? ???????? ???? ???????????? ??????????",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      name: "doctorExaminationDate",
      label: "?????????? ????????????",
      type: "date",
      readOnly: true,
      col: 4,
    },
  ];

  const personalStructure = [
    {
      name: "height",
      label: "????",
      type: "number",
      readOnly: true,
      col: 4,
    },
    {
      name: "weight",
      label: "??????",
      type: "number",
      readOnly: true,
      col: 4,
    },
    {
      name: "bloodTypeEnumId",
      label: "???????? ????????",
      type: "select",
      options: fieldsInfo.bloodType,
      optionLabelField: "description",
      optionIdField: "enumId",
      readOnly: true,
      col: 4,
    },
    {
      name: "heartBeatRate",
      label: "?????? ??????????",
      type: "number",
      readOnly: true,
      col: 4,
    },
    {
      name: "temperature",
      label: "???????? ??????????",
      type: "number",
      readOnly: true,
      col: 4,
    },
    {
      name: "bloodPressureMax",
      label: "???????? ?????? ????????????????",
      type: "number",
      readOnly: true,
      col: 4,
    },
    {
      name: "bloodPressureMin",
      label: "???????? ?????? ??????????????????",
      type: "number",
      readOnly: true,
      col: 4,
    },
  ];

  const recommendationStructure = [
    {
      name: "doctorDiagnosisEnumId",
      label: "?????? ?????????? ???? ???????? ?????? ????????",
      type: "select",
      options: fieldsInfo.doctorDiagnosis,
      optionLabelField: "description",
      optionIdField: "enumId",
      readOnly: true,
      col: 4,
    },
    {
      name: "specialConsideration",
      label: "???????????? ??????",
      type: "select",
      options: fieldsInfo.specialConsideration,
      optionLabelField: "description",
      optionIdField: "enumId",
      readOnly: true,
      col: 4,
    },
    reduxInfo.examiner.personalExamination.specialConsideration == "ScHave"
      ? {
          name: "MNTPresence",
          label: "?????????????? ???????? ???? ???????? ???????? ???????? ????  ?????? ????????????",
          type: "textarea",
          readOnly: true,
          col: 12,
        }
      : {
          name: "empty",
          label: "",
          type: "text",
          disabled: true,
          style: { display: "none" },
          col: 12,
        },
    {
      name: "MNTNecessary",
      label: "?????????? ???? ?????????? ???????? ?? ?????????????? ??????",
      type: "textarea",
      readOnly: true,
      col: 12,
    },
    {
      name: "MNTHuman",
      label: "?????????? ?? ?????????? ?????? ?????????????? ?????????? ???? ?????????????? ?????????? ????????????",
      type: "textarea",
      readOnly: reduxInfo.examiners.length == 0 ? true : false,
      col: 12,
    },
  ];

  const clinicalCols = [
    {
      name: "diseaseDiagnosisEnum",
      label: "?????? ???????? ????????",
      type: "text",
      style: { minWidth: "40px" },
    },
    {
      name: "fromDate",
      label: "?????????? ???????? ????????",
      type: "date",
      style: { minWidth: "40px" },
    },
  ];

  const tabs = [
    {
      label: "?????????? ????????????????? ????????",
      panel: (
        <Box>
          <AHFJO damagingAgent={reduxInfo.examiner.damagingAgent} />
        </Box>
      ),
    },
    {
      label: "?????????????? ??????????????????????",
      panel: (
        <Box>
          <Paraclinics
            optometry={reduxInfo.examiner.optometryExamination}
            spirometry={reduxInfo.examiner.spirometryExamination}
            audiometry={reduxInfo.examiner.audiometryExamination}
            MNTHealthNote={
              reduxInfo.examiner.medicalNote.find(
                (note) => note.descriptionEnumId == "MNTHealth"
              )?.description
            }
          />
        </Box>
      ),
    },
    {
      label: "?????????? ???????? ???????????????? ??????????",
      panel: (
        <PersonalFamilyBackground
          medicalHistory={reduxInfo.examiner.medicalHistory}
        />
      ),
    },
    {
      label: "??????????????",
      panel: (
        <Referrals
          bloodExperiment={reduxInfo.examiner.bloodExperiment}
          paraclinicalAction={reduxInfo.examiner.paraclinicalAction}
        />
      ),
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=DiseaseDiagnosis,BloodType,DoctorDiagnosis,SpecialConsideration",
        axiosKey
      )
      .then((res) => {
        const selectFields = {};
        selectFields.diseaseDiagnosis = res.data.enums.DiseaseDiagnosis;
        selectFields.bloodType = res.data.enums.BloodType;
        selectFields.doctorDiagnosis = res.data.enums.DoctorDiagnosis;
        selectFields.specialConsideration = res.data.enums.SpecialConsideration;
        setFieldsInfo(selectFields);
      });
  };

  const setExaminee = () => {
    axios
      .get(
        SERVER_URL +
          `/rest/s1/healthAndCare/DoctorAndOccupationalName?occupationalPartyRelationshipId=${reduxInfo.examinationProcess.occupationalPartyRelationshipId}&doctorPartyRelationshipId=${reduxInfo.examiner.personalExamination.doctorPartyRelationshipId}`,
        axiosKey
      )
      .then((res) => {
        const defaultProcessValues = {
          doctorExaminationDate:
            reduxInfo.examiner.personalExamination.doctorExaminationDate,
          occupationalName: res.data.occupationalName,
          doctorName: res.data.doctorName,
        };
        setProcessValue(defaultProcessValues);
      });
    const defaultRecommendationValues = {
      doctorDiagnosisEnumId:
        reduxInfo.examiner.personalExamination.doctorDiagnosisEnumId,
      specialConsideration:
        reduxInfo.examiner.personalExamination.specialConsideration,
      MNTPresence: reduxInfo.examiner?.medicalNote?.find(
        (note) => note?.descriptionEnumId == "MNTPresence"
      )?.description,
      MNTNecessary: reduxInfo.examiner?.medicalNote?.find(
        (note) => note?.descriptionEnumId == "MNTNecessary"
      )?.description,
      MNTHuman: reduxInfo.examiner?.medicalNote?.find(
        (note) => note?.descriptionEnumId == "MNTHuman"
      )?.description,
    };
    setRecommendationValue(defaultRecommendationValues);
  };

  const backToConfirmPage = () => {
    if (
      recommendationValue.MNTHuman != null &&
      recommendationValue.MNTHuman != ""
    ) {
      dispatch(
        addNote(
          recommendationValue.MNTHuman,
          reduxInfo.examinationProcess.occupationalPartyRelationshipId
        )
      );
    }
    history.goBack();
  };

  useEffect(() => {
    getEnumSelectFields();
    setExaminee();
  }, []);

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
              ???????????? ???????? ??????????
            </Typography>

            <Button
              variant="contained"
              style={{ background: "white", color: "black", height: "50px" }}
              className="ml-10  mt-5"
              onClick={backToConfirmPage}
              startIcon={<KeyboardBackspaceIcon />}
            >
              {reduxInfo.examiners.length == 0 || !recommendationValue.MNTHuman
                ? "????????????"
                : "???????????? ?? ?????? ??????"}
            </Button>
          </div>
        }
        content={
          <Card>
            <CardContent>
              <FormPro
                prepend={processStructure}
                formValues={processValue}
                setFormValues={setProcessValue}
              />
            </CardContent>
            <Box mb={2} />
            <Card>
              <CardHeader title="?????????????? ????????????" />
              <CardContent>
                <FormPro
                  prepend={personalStructure}
                  formValues={personalValue}
                  setFormValues={setPersonalValue}
                />
              </CardContent>
            </Card>
            <Box mb={2} />
            <Card>
              <CardContent>
                <TablePro
                  title="???????? ???????????? ????????"
                  columns={clinicalCols}
                  rows={clinicalExamination}
                  setRows={setClinicalExamination}
                  loading={clinicalLoading}
                  edit="external"
                  editForm={
                    <ClinicalForm
                      formValues={clinicalValue}
                      setFormValues={setClinicalValue}
                      editing={true}
                      setLoading={setClinicalLoading}
                      fieldsInfo={fieldsInfo}
                    />
                  }
                />
              </CardContent>
            </Card>
            <Box mb={2} />
            <Card>
              <CardHeader title="?????????? ?? ?????? ?????????? ????????" />
              <CardContent>
                <FormPro
                  prepend={recommendationStructure}
                  formValues={recommendationValue}
                  setFormValues={setRecommendationValue}
                />
              </CardContent>
            </Card>
            <Box mb={2} />
            <Card style={{ height: "97%", padding: "0.5%", marginTop: "1%" }}>
              <TabPro tabs={tabs} />
            </Card>
          </Card>
        }
      />
    </React.Fragment>
  );
};

export default MedicalDocumentForm;

function ClinicalForm({ editing = false, ...restProps }) {
  const { formValues, setFormValues, handleClose, fieldsInfo, setLoading } =
    restProps;

  const formStructure = [
    {
      name: "diseaseDiagnosisEnumId",
      label: "?????? ???????? ????????",
      type: "select",
      options: fieldsInfo.diseaseDiagnosis,
      optionLabelField: "description",
      optionIdField: "enumId",
      readOnly: true,
      col: 4,
    },
    {
      name: "fromDate",
      label: "?????????? ???????? ????????",
      type: "date",
      readOnly: true,
      col: 4,
    },
    {
      name: "description",
      label: "?????? ???????? ????????",
      type: "textarea",
      readOnly: true,
      col: 12,
    },
  ];

  const handleReset = () => {
    setLoading(false);
    setFormValues({});
    handleClose();
  };

  return (
    <CardContent>
      <FormPro
        prepend={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        formStructure={formStructure}
        actionBox={
          <ActionBox>
            <Button type="reset" role="secondary">
              ??????
            </Button>
          </ActionBox>
        }
        resetCallback={handleReset}
      />
    </CardContent>
  );
}
