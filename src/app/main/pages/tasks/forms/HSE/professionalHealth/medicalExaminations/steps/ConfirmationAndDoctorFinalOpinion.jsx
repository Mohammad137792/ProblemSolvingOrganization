import { Card, CardContent, CardHeader, Box, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import FormPro from "app/main/components/formControls/FormPro";
import { SERVER_URL } from "configs";
import axios from "axios";
import { useSelector } from "react-redux";
import ClinicalAttachment from "./tempComponent/ClinicalAttachment";
import ActionBox from "app/main/components/ActionBox";

const ConfirmationAndDoctorFinalOpinion = ({
  recommendation,
  setRecommendation,
  setMedicalNote,
  medicalAttachment,
  setMedicalAttachment,
  recomendSubmit,
}) => {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValidation, setFormValidation] = useState({});
  const datas = useSelector(({ fadak }) => fadak);

  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const recommendationStructure = [
    {
      name: "doctorDiagnosisEnumId",
      label: "نظر نهایی در خصوص کار شاغل",
      type: "select",
      options: fieldsInfo.doctorDiagnosis,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
      col: 4,
    },
    {
      name: "specialConsideration",
      label: "ملاحظه خاص",
      type: "select",
      options: fieldsInfo.specialConsideration,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
      col: 4,
    },
    {
      name: "MNTPresence",
      label: "توضیحات پزشک در مورد حضور شروط یا  عدم صلاحیت",
      type: "textarea",
      display: recommendation.specialConsideration == "ScHave",
      col: 12,
    },
    {
      name: "MNTNecessary",
      label: "توصیه ها پزشکی لازم و ملاحظات کلی",
      type: "textarea",
      col: 12,
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=DoctorDiagnosis,SpecialConsideration",
        axiosKey
      )
      .then((res) => {
        const selectFields = {};
        selectFields.doctorDiagnosis = res.data.enums.DoctorDiagnosis;
        selectFields.specialConsideration = res.data.enums.SpecialConsideration;
        setFieldsInfo(selectFields);
      });
  };

  const fakeSubmit = () => {};

  useEffect(() => {
    getEnumSelectFields();
  }, []);

  useEffect(() => {
    setMedicalNote((prevState) => {
      return {
        ...prevState,
        MNTPresence: recommendation.MNTPresence,
        MNTNecessary: recommendation.MNTNecessary,
      };
    });
  }, [recommendation.MNTPresence, recommendation.MNTNecessary]);

  return (
    <Card>
      <CardContent>
        <Box mb={2} />
        <CardContent>
          <CardHeader title="نظر نهایی در خصوص کار شاغل" />
          <FormPro
            prepend={recommendationStructure}
            formValues={recommendation}
            setFormValues={setRecommendation}
            formValidation={formValidation}
            setFormValidation={setFormValidation}
            actionBox={
              <ActionBox style={{ display: "none" }}>
                <Button ref={recomendSubmit} type="submit" role="primary">
                  ثبت
                </Button>
              </ActionBox>
            }
            submitCallback={fakeSubmit}
          />
          <Box mb={2} />
          <ClinicalAttachment
            datas={datas}
            fileType="Y"
            medicalAttachment={medicalAttachment}
            setMedicalAttachment={setMedicalAttachment}
            tableTitle="پیوست مدارک"
          />
        </CardContent>
      </CardContent>
    </Card>
  );
};

export default ConfirmationAndDoctorFinalOpinion;
