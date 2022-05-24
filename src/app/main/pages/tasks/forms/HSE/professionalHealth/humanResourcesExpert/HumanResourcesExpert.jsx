import React, { useState, useEffect } from "react";
import { FusePageSimple } from "@fuse";
import HumanResourcesExpertForm from "./HumanResourcesExpertForm";
import { useDispatch } from "react-redux";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../../../store/actions/fadak";
import axios from "axios";
import { SERVER_URL } from "configs";
import { Box, CardHeader, Typography } from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

const HumanResourcesExpert = () => {
  const classes = useStyles();

  // <process functions>
  const dispatch = useDispatch();
  const [processDefinitionId, setProcessDefinitionId] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [reset, setReset] = useState("initial");
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const getProccess = () => {
    axios
      .get(SERVER_URL + "/rest/s1/fadak/process/list", axiosKey)
      .then((res) => {
        setProcessDefinitionId(
          res.data.outList.find((i) => i.key === "HSE").id
        );
      })
      .catch(() => {});
  };

  const formatVariables = (varObject) => {
    let variables = {};
    Object.keys(varObject).map((key) => {
      variables[key] = { value: varObject[key] };
    });
    return variables;
  };

  const startProcess = (processDefinitionId, initialData) => {
    return new Promise((resolve, reject) => {
      let variables = formatVariables(initialData);

      const packet = {
        processDefinitionId: processDefinitionId,
        variables: variables,
      };
      axios
        .post(SERVER_URL + "/rest/s1/fadak/process/start", packet, {
          headers: { api_key: localStorage.getItem("api_key") },
          params: { basicToken: localStorage.getItem("Authorization") },
        })
        .then((res) => {
          resolve(res.data.id);
        })
        .catch(() => {
          reject();
        });
    });
  };

  const getTask = (id) => {
    return new Promise((resolve, reject) => {
      axios
        .get(SERVER_URL + "/rest/s1/fadak/process/task", {
          headers: { api_key: localStorage.getItem("api_key") },
          params: {
            filterId: "7bbba147-5313-11eb-80ec-0050569142e7",
            firstResult: 0,
            maxResults: 15,
            processInstanceId: id,
          },
        })
        .then((res) => {
          resolve(res.data._embedded.task[0].id);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const submitTask = (initialData, taskId) => {
    return new Promise((resolve, reject) => {
      let variables = formatVariables(initialData);
      const packet = {
        taskId: taskId,
        variables: variables,
      };
      axios
        .post(SERVER_URL + "/rest/s1/fadak/process/form", packet, {
          headers: { api_key: localStorage.getItem("api_key") },
        })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  };
  const submitCallback = (initialData) => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    startProcess(processDefinitionId, initialData)
      .then((processId) =>
        getTask(processId).then((taskId) =>
          submitTask(initialData, taskId).then(() => {
            dispatch(
              setAlertContent(ALERT_TYPES.SUCCESS, "عملیات با موفقیت انجام شد.")
            );
            setWaiting(false);
            setReset("success");
          })
        )
      )
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در انجام عملیات!"));
        setWaiting(false);
        setReset("error");
      });
  };
  // </process functions>

  useEffect(() => {
    getProccess();
  }, []);

  return (
    <React.Fragment>
      <FusePageSimple
        header={
          <CardHeader
            title={
              <Box className={classes.headerTitle}>
                <Typography color="textSecondary">
                  ایمنی ، بهداشت و سلامت کارکنان
                </Typography>
                <KeyboardArrowLeftIcon color="disabled" />
                فرایند بهداشت حرفه‌ای
              </Box>
            }
          />
        }
        content={
          <HumanResourcesExpertForm
            submitCallback={submitCallback}
            reset={reset}
          />
        }
      />
    </React.Fragment>
  );
};
export default HumanResourcesExpert;
