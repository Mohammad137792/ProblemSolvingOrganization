import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FusePageSimple } from "@fuse";
import {
  Card,
  CardContent,
  Button,
  CardHeader,
  Box,
  Typography,
} from "@material-ui/core";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import TabPro from "app/main/components/TabPro";
import TablePro from "app/main/components/TablePro";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import { SERVER_URL } from "configs";
import axios from "axios";
//tabs
import BaseInfo from "./tabs/BaseInfo";
import Amount from "./tabs/Amount";
import Measures from "./tabs/Measures";
import Guarantor from "./tabs/Guarantor";
import DegreeOfApproval from "./tabs/DegreeOfApproval";
import Documents from "./tabs/Documents";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";
import CostWelfare from "./tabs/CostWelfare";
import ConditionsUse from "./tabs/ConditionsUse";
import Chest from "./tabs/Chest";
import SupplementaryInsurance from "./tabs/SupplementaryInsurance";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function WelfareServicesGroup() {
  const classes = useStyles();
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [formValidation, setFormValidation] = useState({});
  const [tableContentGroupList, setTableContentGroupList] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [
    welfareGroupPartyClassificationId,
    setWelfareGroupPartyClassificationId,
  ] = useState("");
  const [loading, setLoading] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "standardCode",
      label: "???? ???????? ?????????? ??????????",
      type: "text",
      required: true,
      validator: (values) => {
        const ind = tableContentGroupList?.findIndex(
          (row) =>
            row.standardCode == values.standardCode &&
            row?.welfareGroupPartyClassificationId !=
              values?.welfareGroupPartyClassificationId
        );
        return new Promise((resolve) => {
          if (/[^a-z0-9]/i.test(values.standardCode)) {
            resolve({
              error: true,
              helper:
                "???? ???????? ?????????? ?????????? ?????? ???? ?????????? ???????? ?????????? ?? ???????? ?????????? ????????!",
            });
          }
          if (ind > -1) {
            resolve({ error: true, helper: "???? ???????? ?????? ???????????? ??????." });
          } else {
            resolve({ error: false, helper: "" });
          }
        });
      },
      col: 3,
    },
    {
      name: "description",
      label: "  ?????????? ???????? ?????????? ??????????",
      type: "text",
      required: true,
      col: 6,
    },

    {
      name: "welfareGroupStatusId",
      label: "??????????",
      type: "select",
      options: fieldsInfo.welfareGroupStatus,
      optionLabelField: "description",
      optionIdField: "statusId",
      col: 3,
    },
    {
      name: "responsibleEmplPositionId",
      label: "?????? ?????????????? ?????????? ????????   ",
      type: "select",
      options: fieldsInfo.emplPositions,
      optionLabelField: "description",
      optionIdField: "emplPositionId",
      getOptionLabel: (opt) => `${opt.pseudoId} ??? ${opt.description}` || "??",
      required: true,
      col: 3,
    },
  ];

  const tabs = [
    {
      label: "?????????????? ???????? ???????? ???????? ??????????",
      panel: (
        <BaseInfo
          welfareGroupPartyClassificationId={welfareGroupPartyClassificationId}
        />
      ),
      display:
        welfareGroupPartyClassificationId &&
        checkPermis("welfareServices/welfareServicesGroup/BaseInfo", datas),
    },
    {
      label: "????????  ???????? ??????????",
      panel: (
        <CostWelfare
        />
      ),
      display:
        welfareGroupPartyClassificationId &&
        checkPermis("welfareServices/welfareServicesGroup/BaseInfo", datas),
    },
    {
      label: "?????????? ?????????????? ???? ?????????? ??????????",
      panel: (
        <ConditionsUse
        />
      ),
      display:
        welfareGroupPartyClassificationId &&
        checkPermis("welfareServices/welfareServicesGroup/BaseInfo", datas),
    },
    {
      label: "??????????",
      panel: (
        <Chest
        />
      ),
      display:
        welfareGroupPartyClassificationId &&
        checkPermis("welfareServices/welfareServicesGroup/BaseInfo", datas),
    },
    {
      label: "???????? ????????????",
      panel: (
        <SupplementaryInsurance
        />
      ),
      display:
        welfareGroupPartyClassificationId &&
        checkPermis("welfareServices/welfareServicesGroup/BaseInfo", datas),
    },
    {
      label: " ?????????? ???????????????? ?????????? ??????????",
      panel: (
        <Documents
          welfareGroupPartyClassificationId={welfareGroupPartyClassificationId}
        />
      ),
      display:
        welfareGroupPartyClassificationId &&
        checkPermis("welfareServices/welfareServicesGroup/Documents", datas),
    },
    {
      label: "???????? ?????????????? ????????",
      panel: (
        <Amount
          welfareGroupPartyClassificationId={welfareGroupPartyClassificationId}
        />
      ),
      display:
        welfareGroupPartyClassificationId &&
        checkPermis("welfareServices/welfareServicesGroup/Amount", datas),
    },
    {
      label: "???????????????? ???????????? ?????????????? ????????",
      panel: (
        <Measures
          welfareGroupPartyClassificationId={welfareGroupPartyClassificationId}
        />
      ),
      display:
        welfareGroupPartyClassificationId &&
        checkPermis("welfareServices/welfareServicesGroup/Measures", datas),
    },
    ,
    {
      label: "????????",
      panel: (
        <Guarantor
          welfareGroupPartyClassificationId={welfareGroupPartyClassificationId}
        />
      ),
      display:
        welfareGroupPartyClassificationId &&
        checkPermis("welfareServices/welfareServicesGroup/Guarantor", datas),
    },
    ,
    {
      label: "?????????? ?????????? ?????????????? ?????????? ??????????",
      panel: (
        <DegreeOfApproval
          welfareGroupPartyClassificationId={welfareGroupPartyClassificationId}
        />
      ),
      display:
        welfareGroupPartyClassificationId &&
        checkPermis(
          "welfareServices/welfareServicesGroup/DegreeOfApproval",
          datas
        ),
    },
  ];

  const groupListCols = [
    {
      name: "standardCode",
      label: "???? ???????? ??????????",
      type: "number",
      style: { minWidth: "80px" },
    },
    {
      name: "description",
      label: "?????????? ???????? ??????????",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "welfareGroupStatus",
      label: "??????????",
      type: "text",
      style: { minWidth: "80px" },
    },
  ];

  const getStatusSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/entity/StatusItem?statusTypeId=WelfareGroupStatus",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            welfareGroupStatus: res.data.status,
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
            emplPositions: res.data.emplPosition,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "?????? ???? ???????????? ??????????????? ??????????????!")
        );
      });
  };

  const getWelfareGroupList = () => {
    setLoading(true);
    axios
      .get(SERVER_URL + "/rest/s1/welfare/welfareGroup", axiosKey)
      .then((res) => {
        setTableContentGroupList(res.data?.welfareGroup);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "?????? ???? ???????????? ???????? ???????? ?????????? ??????????!"
          )
        );
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "???? ?????? ?????????? ??????????????"));
    setWaiting(true);
    setLoading(true);
    axios
      .post(SERVER_URL + "/rest/s1/welfare/welfareGroup", formValues, axiosKey)
      .then((res) => {
        const completedFormValues = {
          ...formValues,
          welfareGroupPartyClassificationId:
            res.data?.welfareGroupPartyClassificationId,
          welfareGroupStatus: fieldsInfo?.welfareGroupStatus.find(
            (item) => item.statusId == formValues.welfareGroupStatusId
          ).description,
        };
        setTableContentGroupList((prevState) => [
          ...prevState,
          completedFormValues,
        ]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "?????????????? ???? ???????????? ?????? ????.")
        );
        setWaiting(false);
        setLoading(false);
        setWelfareGroupPartyClassificationId(
          res.data?.welfareGroupPartyClassificationId
        );
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "?????? ???? ?????????? ???????? ?????????? ??????????!")
        );
        setWaiting(false);
        setLoading(false);
      });
  };

  const editCallback = (row) => {
    setFormValues(row);
    setWelfareGroupPartyClassificationId(
      row?.welfareGroupPartyClassificationId
    );
  };

  const handleEdit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "???? ?????? ?????????? ??????????????"));
    setWaiting(true);
    setLoading(true);
    axios
      .put(SERVER_URL + "/rest/s1/welfare/welfareGroup", formValues, axiosKey)
      .then((res) => {
        const completedFormValues = {
          ...formValues,
          welfareGroupStatus: fieldsInfo?.welfareGroupStatus.find(
            (item) => item.statusId == formValues.welfareGroupStatusId
          ).description,
        };
        const editedTableContent = [...tableContentGroupList];
        const welfareGroupIndex = tableContentGroupList.findIndex(
          (row) =>
            row.welfareGroupPartyClassificationId ==
            welfareGroupPartyClassificationId
        );
        editedTableContent[welfareGroupIndex] = {
          ...editedTableContent[welfareGroupIndex],
          ...completedFormValues,
        };
        setTableContentGroupList(editedTableContent);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "?????????????? ???? ???????????? ???????????? ????.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "?????? ???? ???????????? ???????? ?????????? ??????????!")
        );
        setWaiting(false);
        setLoading(false);
      });
  };
  const handleRemove = (row) => {
    return new Promise((resolve, reject) => {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "???? ?????? ?????????? ??????????????"));
      setWaiting(true);
      setLoading(true);
      axios
        .delete(
          SERVER_URL +
            `/rest/s1/welfare/welfareGroup?welfareGroupPartyClassificationId=${row?.welfareGroupPartyClassificationId}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContentGroupList.filter(
            (welfare) =>
              welfare.welfareGroupPartyClassificationId !=
              row?.welfareGroupPartyClassificationId
          );
          setTableContentGroupList(filteredTable);
          setWaiting(false);
          setLoading(false);
          if (
            welfareGroupPartyClassificationId ==
            row?.welfareGroupPartyClassificationId
          ) {
            handleReset();
          }
          resolve();
        })
        .catch(() => {
          dispatch(
            setAlertContent(ALERT_TYPES.ERROR, "?????? ???? ?????? ???????? ?????????? ??????????!")
          );
          setWaiting(false);
          setLoading(false);
          reject();
        });
    });
  };

  const handleReset = () => {
    setWaiting(false);
    setLoading(false);
    setFormValues((prevState) => {
      return {
        welfareGroupStatusId: "ActiveWelfareGroup",
      };
    });
    setWelfareGroupPartyClassificationId("");
  };

  useEffect(() => {
    getStatusSelectFields();
    getCompanyPositions();
    getWelfareGroupList();
    setFormValues((prevState) => {
      return {
        welfareGroupStatusId: "ActiveWelfareGroup",
      };
    });
  }, []);

  return (
    <FusePageSimple
      header={
        <CardHeader
          title={
            <Box className={classes.headerTitle}>
              <Typography color="textSecondary">?????????? ??????????</Typography>
              <KeyboardArrowLeftIcon color="disabled" />
              ?????????? ???????? ?????????? ??????????
            </Box>
          }
        />
      }
      content={
        <>
          <Box p={2}>
            <Card variant="outlined">
              <CardContent>
                <FormPro
                  append={formStructure}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formValidation={formValidation}
                  setFormValidation={setFormValidation}
                  submitCallback={() =>
                    welfareGroupPartyClassificationId
                      ? checkPermis(
                          "welfareServices/welfareServicesGroup/update",
                          datas
                        ) && handleEdit()
                      : checkPermis(
                          "welfareServices/welfareServicesGroup/add",
                          datas
                        ) && handleSubmit()
                  }
                  resetCallback={handleReset}
                  actionBox={
                    <ActionBox>
                      <Button
                        type="submit"
                        role="primary"
                        disabled={
                          waiting || welfareGroupPartyClassificationId
                            ? !checkPermis(
                                "welfareServices/welfareServicesGroup/update",
                                datas
                              )
                            : !checkPermis(
                                "welfareServices/welfareServicesGroup/add",
                                datas
                              )
                        }
                        endIcon={
                          waiting ? <CircularProgress size={20} /> : null
                        }
                      >
                        {welfareGroupPartyClassificationId ? "????????????" : "??????"}
                      </Button>
                      <Button type="reset" role="secondary" disabled={waiting}>
                        ??????
                      </Button>
                    </ActionBox>
                  }
                />
                <Box p={2} />
                {welfareGroupPartyClassificationId && (
                  <Card variant="outlined">
                    <TabPro tabs={tabs} />
                  </Card>
                )}
              </CardContent>
            </Card>
          </Box>
          <Box p={2}>
            <Card variant="outlined">
              <CardContent>
                <TablePro
                  title="???????? ???????? ?????????? ??????????"
                  loading={loading}
                  columns={groupListCols}
                  rows={tableContentGroupList}
                  setRows={setTableContentGroupList}
                  removeCondition={() =>
                    checkPermis(
                      "welfareServices/welfareServicesGroup/delete",
                      datas
                    )
                  }
                  removeCallback={handleRemove}
                  editCondition={() =>
                    checkPermis(
                      "welfareServices/welfareServicesGroup/update",
                      datas
                    )
                  }
                  edit="callback"
                  editCallback={editCallback}
                />
              </CardContent>
            </Card>
          </Box>
        </>
      }
    />
  );
}
