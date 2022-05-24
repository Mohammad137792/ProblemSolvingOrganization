import { Card, CardContent, CardHeader } from "@material-ui/core";
import React from "react";
import QuestionnaireResponder from "app/main/pages/questionnaire/responder/QuestionnaireResponder";
import checkPermis from "app/main/components/CheckPermision";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const SpecialExamination = ({ questionnaireSubmit, answerId }) => {
  const dispatch = useDispatch();
  const datas = useSelector(({ fadak }) => fadak);

  return (
    <Card>
      <CardContent>
        <CardHeader title="تکمیل پرسشنامه" />
        <QuestionnaireResponder
          answerId={answerId}
          ref={questionnaireSubmit}
          loadAnswer={true}
        />
      </CardContent>
    </Card>
  );
};

export default SpecialExamination;
