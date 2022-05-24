import React, { useState, useEffect } from "react";

import { FusePageSimple } from "@fuse";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from "@material-ui/core";
import FormPro from "app/main/components/formControls/FormPro";
import ActionBox from "app/main/components/ActionBox";
import TablePro from "app/main/components/TablePro";
import axios from "axios";
import { SERVER_URL } from "./../../../../../configs";
import { ALERT_TYPES } from "app/store/actions";
import { setAlertContent } from "./../../../../store/actions/fadak/alert.actions";
import { useDispatch } from "react-redux";

const ModelOfExcellence = () => {
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const [formValues, setFormValues] = useState([]);
  const [tableContent, setTableContent] = useState([]);
  const [parentWork, setParentWork] = useState([]);
  const [statusId, setStatusId] = useState([]);
  const [uom, setUom] = useState([]);
  const [edit, setEdit] = useState(false);
  const [btnName, setBtnName] = useState("افزودن");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const formStructure = [
    {
      name: "workEffortName",
      label: "کد",
      type: "text",
      col: 3,
      required: true,
    },
    {
      name: "description",
      label: "عنوان",
      type: "text",
      col: 6,
      required: true,
    },
    {
      name: "statusId",
      label: "وضعیت",
      type: "select",
      options: statusId,
      filterOptions: (options) =>
        options.filter((o) => o["statusId"].includes("Active")),
      optionLabelField: "description",
      optionIdField: "statusId",
      col: 3,
      // required: true,
    },
    {
      name: "purposeEnumId",
      label: "نوع مولفه",
      type: "select",
      options: "WorkEffortPurpose",
      filterOptions: (options) =>
        options.filter((o) => o["parentEnumId"] === "ExcellenceModelItem"),
      required: true,
    },
    {
      name: "scopeEnumId",
      label: "دسته مولفه",
      type: "select",
      options: "StructureScope",
      required: true,
    },
    {
      name: "parentWorkEffortId",
      label: "مولفه بالاتر",
      type: "select",
      options: parentWork,
      optionLabelField: "parent",
      optionIdField: "parentWorkEffortId",
      display:
        formValues.purposeEnumId === "ExcellenceModelCriterion" ? false : true,
    },
    {
      name: "parameterScore",
      label: "امتیاز",
      type: "text",
      display:
        formValues.purposeEnumId === "ExcellenceModelIndex" ? false : true,
    },
    {
      name: "weight",
      label: "وزن",
      type: "number",
      display:
        formValues.purposeEnumId === "ExcellenceModelIndex" ? true : false,
    },
    {
      name: "parameterScore",
      label: "هدف کمی",
      type: "number",
      display:
        formValues.purposeEnumId === "ExcellenceModelIndex" ? true : false,
    },
    {
      name: "uomId",
      label: "واحد",
      type: "select",
      options: uom,
      optionLabelField: "description",
      optionIdField: "uomId",
      display:
        formValues.purposeEnumId === "ExcellenceModelIndex" ? true : false,
    },
  ];
  const tableCols = [
    {
      name: "workEffortName",
      label: "کد",
      type: "text",
    },
    {
      name: "description",
      label: "عنوان",
      type: "text",
    },
    {
      name: "purposeEnumId",
      label: "نوع مولفه",
      type: "select",
      options: "WorkEffortPurpose",
    },
    {
      name: "scopeEnumId",
      label: "دسته مولفه",
      type: "select",
      options: "StructureScope",
    },
    {
      name: "parentWorkEffortId",
      label: "مولفه بالاتر",
      type: "select",
      options: parentWork,
      optionLabelField: "parent",
      optionIdField: "parentWorkEffortId",
    },
    {
      name: "statusId",
      label: "وضعیت",
      type: "select",
      options: statusId,
      optionLabelField: "description",
      optionIdField: "statusId",
    },
  ];

  const getSelectData = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/entity/Uom?uomTypeEnumId=ExcellenceModelUom",
        axiosKey
      )
      .then((res) => {
        setUom(res.data.result);
      })
      .catch(() => {});

    axios
      .get(SERVER_URL + "/rest/s1/workEffort/getParentWorkEffort", axiosKey)
      .then(function (response) {
        setParentWork(response.data.result);
      })
      .catch({});

    axios
      .get(
        SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=WorkEffort",
        axiosKey
      )
      .then((res) => {
        setStatusId(res.data.status);
      })
      .catch(() => {});
  };

  const handleSubmit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات..."));
    axios
      .post(
        SERVER_URL + "/rest/s1/workEffort/model",
        { data: formValues },
        axiosKey
      )
      .then((res) => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.SUCCESS,
            "اطلاعات مورد نظر با موفقیت اضافه شد."
          )
        );
        getData();
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات افزودن!"));
      });
  };

  const handleEdit = (row) => {
    setBtnName("ویرایش");
    let config = {
      method: "get",
      url: `${SERVER_URL}/rest/s1/workEffort/model?workEffortId=${row.workEffortId}`,
      headers: { api_key: localStorage.getItem("api_key") },
    };

    axios(config).then((response) => {
      setFormValues(row);
      setEdit(true);
    });
  };

  const handleSubmitEdit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات ..."));
    axios
      .put(
        SERVER_URL + "/rest/s1/workEffort/model",
        { data: formValues },
        axiosKey
      )
      .then(() => {
        setEdit(false);
        setFormValues({});
        dispatch(
          setAlertContent(
            ALERT_TYPES.SUCCESS,
            "تغییرات ردیف مورد نظر با موفقیت انجام شد."
          )
        );
        setBtnName("افزودن");
        getData();
      })
      .catch((err) => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در عملیات ویرایش!"));
        console.log("err", err);
      });
  };

  const handleReset = () => {
    setBtnName("افزودن");
    setEdit(false);
    setFormValues({});
  };

  function getData(filter) {
    setLoading(true);
    axios
      .get(SERVER_URL + "/rest/s1/workEffort/model", {
        headers: { api_key: localStorage.getItem("api_key") },
        params: filter,
      })
      .then((res) => {
        setTableContent(res.data.modelList);
        setLoading(false);
      })
      .catch(() => {});
  }

  useEffect(() => {
    getSelectData();
    getData();
  }, []);

  return (
    <>
      <Card>
        <CardHeader title="ایجاد مولفه مدل" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormPro
                formValues={formValues}
                setFormValues={setFormValues}
                append={formStructure}
                submitCallback={edit ? handleSubmitEdit : handleSubmit}
                resetCallback={handleReset}
                actionBox={
                  <ActionBox>
                    <Button type="submit" role="primary">
                      {btnName}
                    </Button>
                    <Button type="reset" role="secondary">
                      لغو
                    </Button>
                  </ActionBox>
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box p={1}>
        <Card variant="outlined">
          <TablePro
            title="لیست مولفه های موجود در مدل"
            columns={tableCols}
            
            rows={tableContent}
            edit="callback"
            editCallback={handleEdit}
            loading={loading}
            exportCsv="خروجی اکسل"
            filter="external"
            filterForm={
              <FilterForm
                getData={getData}
                parentWork={parentWork}
                statusId={statusId}
              />
            }
            expandable={true}
            rowDetailsRenderer={(row) => (
              <TablePro
                rows={row.history}
                columns={[
                  {
                    name: "parameterScore",
                    label: "امتیاز",
                    type: "text",
                  },
                  {
                    name: "weight",
                    label: "وزن",
                    type: "number",
                  },
                  {
                    name: "parameterScore",
                    label: "هدف کمی",
                    type: "number",
                  },
                  {
                    name: "uomId",
                    label: "واحد",
                    type: "select",
                    options: uom,
                    optionLabelField: "description",
                    optionIdField: "uomId",
                  },
                  {
                    name: "fromDate",
                    label: "از تاریخ",
                    type: "date",
                  },
                  {
                    name: "thruDate",
                    label: "تا تاریخ",
                    type: "date",
                  },
                ]}
                showTitleBar={false}
                lightHeader={false}
                showRowNumber={false}
              />
            )}
          />
        </Card>
      </Box>
    </>
  );
};
export default ModelOfExcellence;

const FilterForm = ({ getData, parentWork, statusId }) => {
  const [formValues, setFormValues] = useState([]);
  const formStructure = [
    {
      name: "workEffortName",
      label: "کد",
      type: "text",
      col: 2,
    },
    {
      name: "description",
      label: "عنوان",
      type: "text",
      col: 2,
    },
    {
      name: "purposeEnumId",
      label: "نوع مولفه",
      type: "select",
      options: "WorkEffortPurpose",
      filterOptions: (options) =>
        options.filter((o) => o["parentEnumId"] === "ExcellenceModelItem"),
      col: 2,
    },
    {
      name: "scopeEnumId",
      label: "دسته مولفه",
      type: "select",
      options: "StructureScope",
      col: 2,
    },
    {
      name: "parentWorkEffortId",
      label: "مولفه بالاتر",
      type: "select",
      options: parentWork,
      optionLabelField: "parent",
      optionIdField: "parentWorkEffortId",
      col: 2,
    },
    {
      name: "statusId",
      label: "وضعیت",
      type: "select",
      options: statusId,
      filterOptions: (options) =>
        options.filter((o) => o["statusId"].includes("Active")),
      optionLabelField: "description",
      optionIdField: "statusId",
      col: 2,
    },
  ];
  return (
    <Box p={2}>
      <Card variant="outlined">
        <CardContent>
          <FormPro
            formValues={formValues}
            setFormValues={setFormValues}
            append={formStructure}
            submitCallback={() => getData(formValues)}
            resetCallback={() => getData()}
            actionBox={
              <ActionBox>
                <Button type="submit" role="primary">
                  اعمال فیلتر
                </Button>
                <Button type="reset" role="secondary">
                  لغو
                </Button>
              </ActionBox>
            }
          />
        </CardContent>
      </Card>
    </Box>
  );
};
