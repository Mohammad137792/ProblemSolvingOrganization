import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Button } from "@material-ui/core";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDispatch } from "react-redux";
import { SERVER_URL } from "configs";
import axios from "axios";

const RejectRequest = ({ formVariables, submitCallback }) => {
  const [submitWaiting, setSubmitWaiting] = useState(false);
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({
    ...formVariables.informationForm?.value,
  });
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const formStructure = [
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
    {
      name: "installmentCalculationMethodEnum",
      label: "نحوه بازپرداخت اقساط",
      type: "text",
      readOnly: true,
      col: 4,
    },
    {
      type: "group",
      items: [
        {
          name: "installmentGap",
          label: "فاصله زمانی بین پرداخت اقساط",
          type: "number",
          readOnly: true,
        },
        {
          name: "installmentGapUomId",
          label: " دوره",
          type: "select",
          options: fieldsInfo.welfareTimePeriod,
          optionLabelField: "description",
          optionIdField: "uomId",
          fullWidth: false,
          readOnly: true,
          style: { minWidth: "20px" },
        },
      ],
    },
    {
      type: "group",
      items: [
        {
          name: "finalLoanAmount",
          label: "مبلغ وام درخواستی",
          type: "number",
          readOnly: true,
        },
        {
          label: "ریال",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
      col: 4,
    },

    {
      name: "finalInstallmentNumber",
      label: "تعداد اقساط",
      type: "number",
      readOnly: true,
    },
    {
      name: "requestMeetDate",
      label: "تاریخ دریافت تسهیل",
      type: "date",
      readOnly: true,
    },
    {
      name: "purpose",
      label: "دلیل تقاضا",
      type: "textarea",
      readOnly: true,
      col: 12,
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
    submitCallback({});
  };

  useEffect(() => {
    getUomSelectFields();
  }, []);

  return (
    <>
      <Card variant="outlined">
        <CardHeader title={"متاسفانه با تسهیل مالی درخواستی شما موافقت نشد."} />
        <CardContent>
          <FormPro
            prepend={formStructure}
            formValues={formValues}
            setFormValues={setFormValues}
            submitCallback={handleSubmit}
            actionBox={
              <ActionBox>
                <Button
                  type="submit"
                  role="primary"
                  disabled={submitWaiting}
                  endIcon={
                    submitWaiting ? <CircularProgress size={20} /> : null
                  }
                >
                  تایید
                </Button>
              </ActionBox>
            }
          ></FormPro>
        </CardContent>
      </Card>
    </>
  );
};

export default RejectRequest;
