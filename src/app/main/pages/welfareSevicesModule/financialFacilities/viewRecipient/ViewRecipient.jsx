import { FusePageSimple } from "@fuse";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardHeader,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { SERVER_URL } from "configs";
import axios from "axios";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import TabPro from "app/main/components/TabPro";
import FormPro from "app/main/components/formControls/FormPro";
import LoanInformation from "./../../../tasks/forms/WelfareSevices/finalReview/tabs/LoanInformation";
import Documents from "./../../../tasks/forms/WelfareSevices/finalReview/tabs/Documents";
import Installments from "./tabs/Installments";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function ViewRecipient() {
  const classes = useStyles();
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [borrowerInformation, setBorrowerInformation] = useState({});
  const [loanInformation, setLoanInformation] = useState({});
  const [criteriaLoading, setCriteriaLoading] = useState(false);
  const [guarantorLoading, setGuarantorLoading] = useState(false);
  const [borrowerLoading, setBorrowerLoading] = useState(false);
  const [installmentLoading, setInstallmentLoading] = useState(false);
  const [criteriaTable, setCriteriaTable] = useState([]);
  const [installmentCalc, setInstallmentCalc] = useState({});
  const [installmentTable, setInstallmentTable] = useState([]);
  const [borrowerAttach, setBorrowerAttach] = useState([]);
  const [guarantorTable, setGuarantorTable] = useState([]);
  const [waiting, setWaiting] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const { accompanyId } = useParams();

  const borrowerStructure = [
    {
      name: "nationalCode",
      label: "?????????? ??????",
      type: "number",
      readOnly: true,
    },
    {
      name: "pseudoId",
      label: "?????????? ????????????",
      type: "text",
      readOnly: true,
    },
    {
      name: "firstName",
      label: "??????",
      type: "text",
      readOnly: true,
    },
    {
      name: "lastName",
      label: "?????? ????????????????",
      type: "text",
      readOnly: true,
    },
    {
      name: "organizationName",
      label: "????????",
      type: "text",
      readOnly: true,
    },
    {
      name: "unitName",
      label: "???????? ??????????????",
      type: "text",
      readOnly: true,
    },
    {
      name: "emplPosition",
      label: "??????",
      type: "text",
      readOnly: true,
    },
    {
      name: "phoneMobileNumber",
      label: "???????? ??????????",
      type: "text",
      readOnly: true,
    },
    {
      name: "requestDate",
      label: "?????????? ?????????????? ??????????",
      type: "date",
      readOnly: true,
    },
    {
      name: "requestMeetDate",
      label: "?????????? ???????????? ??????????",
      type: "date",
      readOnly: true,
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
    setBorrowerLoading(true);
    setGuarantorLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/RecipientInfo?accompanyId=${accompanyId}`,
        axiosKey
      )
      .then((res) => {
        setLoanInformation((prevState) => {
          return {
            ...prevState,
            ...res.data.informationForm,
          };
        });
        setBorrowerInformation((prevState) => {
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
            "?????? ???? ?????????? ?????????????? ?????????? ????????????!"
          )
        );
      });
  };

  const tabs = [
    {
      label: "?????????????? ?????????? ????????",
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
      label: "?????????????? ??????????",
      panel: (
        <Box mt={2}>
          <Installments
            installmentLoading={installmentLoading}
            setInstallmentLoading={setInstallmentLoading}
            installmentCalc={installmentCalc}
            setInstallmentCalc={setInstallmentCalc}
            installmentTable={installmentTable}
            setInstallmentTable={setInstallmentTable}
          />
        </Box>
      ),
    },
    {
      label: "?????????????? ???????? ?? ??????????",
      panel: (
        <Box mt={2}>
          <Documents
            submitWaiting={waiting}
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
    },
  ];

  useEffect(() => {
    getUomSelectFields();
    getRecipientInfo();
  }, []);

  return (
    <>
      <FusePageSimple
        header={
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <CardHeader
              title={
                <Box className={classes.headerTitle}>
                  <Typography color="textSecondary">?????????? ??????????</Typography>
                  <KeyboardArrowLeftIcon color="disabled" />
                  ???????????? ?????????????? ?????????? ????????????
                </Box>
              }
            />
            <Button
              variant="contained"
              style={{ background: "white", color: "black", height: "50px" }}
              className="ml-10  mt-5"
              onClick={() => history.goBack()}
              startIcon={<KeyboardBackspaceIcon />}
            >
              ????????????
            </Button>
          </div>
        }
        content={
          <Box p={2}>
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
          </Box>
        }
      />
    </>
  );
}
