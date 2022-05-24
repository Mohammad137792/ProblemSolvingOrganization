import React, { useEffect, useState } from "react";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import { Button } from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import axios from "../../../../api/axiosRest";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "../../../../components/CheckPermision";

const primaryKey = "payGroupFactorId";

export default function PayGroupFactors({ parentKey, parentKeyValue }) {
  const datas = useSelector(({ fadak }) => fadak);
  const [data, set_data] = useState({
    legalAgents: [],
    dependTypes: {
      judicalFactors: [],
      formuls: [],
      otherBenefits: [],
    },
  });
  const dataList = useListState(primaryKey);
  const tableColumns = [
    {
      name: "displaySequence",
      label: "ترتیب نمایش",
      type: "number",
    },
    {
      name: "payrollFactorId",
      label: "عامل حقوقی",
      type: "select",
      options: data.legalAgents,
      optionIdField: "payrollFactorId",
      optionLabelField: "title",
      required: true,
    },
    {
      name: "methodEnumId",
      label: "نحوه تعیین مقدار عامل",
      type: "select",
      options: "MethodPayrollFactor",
      required: true,
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
    {
      name: "propertyFactorEnumId",
      label: "ویژگی های عامل",
      type: "multiselect",
      options: "PropertyPayGroupFactor",
    },
  ];
  function handle_remove(row) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/s1/payroll/payGroupFactor?${primaryKey}=${row[primaryKey]}`)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
  function get_dataList() {
    axios
      .get(
        "/s1/payroll/payGroupFactor?payGroupPartyClassificationId=" +
          parentKeyValue
      )
      .then((res) => {
        dataList.set(res.data.payGroupFactorList);
      })
      .catch(() => {
        dataList.set([]);
      });
  }

  useEffect(() => {
    get_dataList();
  }, [parentKeyValue]);

  useEffect(() => {
    axios
      .get("/s1/payroll/legalAgentTypes")
      .then((res) => {
        set_data((prevState) => ({
          ...prevState,
          legalAgents: res.data.legalAgents,
        }));
      })
      .catch(() => {});
    axios
      .get("/s1/payroll/legalDependTypes")
      .then((res) => {
        set_data((prevState) => ({
          ...prevState,
          dependTypes: res.data.dependTypes,
        }));
      })
      .catch(() => {});
  }, []);

  return (
    <TablePro
      title="لیست عوامل حقوقی"
      columns={tableColumns}
      rows={dataList.list || []}
      setRows={dataList.set}
      loading={dataList.list === null}
      add={checkPermis("payroll/payGroup/payrollFactor/add", datas) && "external"}
      addForm={
        <TableForm
          dataList={dataList}
          data={data}
          parent={{ [parentKey]: parentKeyValue }}
        />
      }
      edit={checkPermis("payroll/payGroup/payrollFactor/edit", datas) && "external"}
      editForm={
        <TableForm
          dataList={dataList}
          data={data}
          parent={{ [parentKey]: parentKeyValue }}
          editing={true}
        />
      }
      removeCallback={checkPermis("payroll/payGroup/payrollFactor/delete", datas) ? handle_remove : null}
      showRowNumber={false}
      defaultOrderBy="displaySequence"
    />
  );
}

function TableForm({ editing = false, dataList, data, parent, ...restProps }) {
  let moment = require("moment-jalaali");
  const [formValidation, setFormValidation] = useState({});
  const {
    formValues,
    setFormValues,
    oldData = {},
    successCallback,
    failedCallback,
    handleClose,
  } = restProps;
  const [waiting, set_waiting] = useState(false);
  const dispatch = useDispatch();
  const formDefaultValues = {
    methodEnumId: "MPFEmplOrderFactor",
    isDeduct: "N",
    agreementId: "",
  };
  const formStructure = [
    {
      name: "payrollFactorId",
      label: "عامل حقوقی",
      type: "select",
      options: data.legalAgents,
      optionIdField: "payrollFactorId",
      optionLabelField: "title",
      required: true,
    },
    {
      name: "agreementId",
      label: "نوع قرارداد",
      type: "select",
      options: "Agreement",
      optionIdField: "agreementId",
      appendOptions: [{ agreementId: "", description: "تمام قراردادها" }],
    },
    {
      name: "methodEnumId",
      label: "نحوه تعیین مقدار عامل",
      type: "select",
      options: "MethodPayrollFactor",
      required: true,
      disableClearable: true,
      changeCallback: () =>
        setFormValues((prevState) => ({
          ...prevState,
          emplOrderPayrollFactorId: null,
          formulaId: null,
          benefitTypeId: null,
        })),
    },
    {
      name: "emplOrderPayrollFactorId",
      label: "عامل حکمی",
      type: "select",
      options: data.dependTypes.judicalFactors,
      optionIdField: "payrollFactorId",
      optionLabelField: "title",
      required: formValues["methodEnumId"] === "MPFEmplOrderFactor",
      display: formValues["methodEnumId"] === "MPFEmplOrderFactor",
    },
    {
      name: "formulaId",
      label: "فرمول",
      type: "select",
      options: data.dependTypes.formuls,
      optionIdField: "formulaId",
      optionLabelField: "title",
      required: formValues["methodEnumId"] === "MPFFormula",
      display: formValues["methodEnumId"] === "MPFFormula",
    },
    {
      name: "benefitTypeId",
      label: "سایر مزایا",
      type: "select",
      options: data.dependTypes.otherBenefits,
      optionIdField: "benefitTypeId",
      required: formValues["methodEnumId"] === "MPFBenefite",
      display: formValues["methodEnumId"] === "MPFBenefite",
    },
    {
      name: "propertyFactorEnumId",
      label: "ویژگی های عامل",
      type: "multiselect",
      options: "PropertyPayGroupFactor",
    },
    {
      name: "isDeduct",
      label: "نوع عامل حقوقی",
      type: "select",
      options: [
        { enumId: "Y", description: "کسورات" },
        { enumId: "N", description: "مزایا" },
        { enumId: "Z", description: "بدون ماهیت" },
      ],
      required: true,
    },
    {
      name: "displaySequence",
      label: "ترتیب نمایش",
      type: "number",
    },
    {
      name: "calcSequence",
      label: "ترتیب محاسبه",
      type: "number",
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
    {
      name: "displayArears",
      label: "نمایش معوقه به تفکیک در فیش حقوقی",
      type: "indicator",
      col: 6,
    },
  ];

  const handle_add = () => {
    let packet = { ...formValues, ...parent };
    axios
      .post("/s1/payroll/payGroupFactor", packet)
      .then((res) => {
        setFormValues(formDefaultValues);
        set_waiting(false);
        successCallback({ ...packet, ...res.data });
      })
      .catch(() => {
        set_waiting(false);
        failedCallback();
      });
  };
  const handle_edit = () => {
    axios
      .put("/s1/payroll/payGroupFactor", formValues)
      .then(() => {
        setFormValues(formDefaultValues);
        set_waiting(false);
        successCallback(formValues);
      })
      .catch(() => {
        set_waiting(false);
        failedCallback();
      });
  };

  function has_overlap() {
    const check_for_overlap = (fromDate1, thruDate1, fromDate2, thruDate2) => {
      if (typeof fromDate1 !== "string") {
        fromDate1 = moment(fromDate1).format("YYYY-MM-DD");
        thruDate1 = moment(thruDate1).format("YYYY-MM-DD");
      }
      if (typeof fromDate2 !== "string") {
        fromDate2 = moment(fromDate2).format("YYYY-MM-DD");
        thruDate2 = moment(thruDate2).format("YYYY-MM-DD");
      }
      return !(
        (fromDate1 && thruDate2 && fromDate1 > thruDate2) ||
        (fromDate2 && thruDate1 && fromDate2 > thruDate1)
      );
    };
    let checkList = dataList.list.filter(
      (item) =>
        item["payrollFactorId"] === formValues["payrollFactorId"] &&
        item[primaryKey] !== formValues[primaryKey]
    );
    if (formValues["agreementId"]) {
      checkList = checkList.filter(
        (item) =>
          !item["agreementId"] ||
          item["agreementId"] === formValues["agreementId"]
      );
    }
    for (let i in checkList) {
      const row = checkList[i];
      if (
        check_for_overlap(
          formValues.fromDate,
          formValues.thruDate,
          row.fromDate,
          row.thruDate
        )
      ) {
        setFormValidation({
          thruDate: { error: true, helper: "" },
          fromDate: { error: true, helper: "" },
        });
        return true;
      }
    }
    setFormValidation({
      thruDate: { error: false, helper: "" },
      fromDate: { error: false, helper: "" },
    });
    return false;
  }

  function is_dates_invalid() {
    let fromDate = formValues.fromDate;
    let thruDate = formValues.thruDate;
    if (!fromDate || !thruDate) {
      return false;
    }
    if (typeof fromDate !== "string") {
      fromDate = moment(fromDate).format("YYYY-MM-DD");
    }
    if (typeof thruDate !== "string") {
      thruDate = moment(thruDate).format("YYYY-MM-DD");
    }
    const error = fromDate >= thruDate;
    if (error)
      setFormValidation({
        thruDate: { error: true, helper: "" },
        fromDate: { error: true, helper: "" },
      });
    else
      setFormValidation({
        thruDate: { error: false, helper: "" },
        fromDate: { error: false, helper: "" },
      });
    return error;
  }

  useEffect(() => {
    if (!editing) {
      setFormValues((prevState) => ({
        ...prevState,
        ...formDefaultValues,
      }));
    }
  }, []);

  return (
    <FormPro
      prepend={formStructure}
      formValues={formValues}
      setFormValues={setFormValues}
      formDefaultValues={formDefaultValues}
      formValidation={formValidation}
      setFormValidation={setFormValidation}
      submitCallback={() => {
        if (is_dates_invalid()) {
          failedCallback("محدوده تاریخ تعیین شده نادرست است!");
          return;
        }
        if (has_overlap()) {
          failedCallback(
            "محدوده تاریخ تعیین شده با عامل دیگری دارای همپوشانی است!"
          );
          return;
        }
        dispatch(
          setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات...")
        );
        set_waiting(true);
        if (editing) {
          handle_edit();
        } else {
          handle_add();
        }
      }}
      resetCallback={() => {
        handleClose();
      }}
      actionBox={
        <ActionBox>
          <Button
            type="submit"
            role="primary"
            disabled={waiting}
            endIcon={waiting ? <CircularProgress size={20} /> : null}
          >
            {editing ? "ویرایش" : "افزودن"}
          </Button>
          <Button type="reset" role="secondary" disabled={waiting}>
            لغو
          </Button>
        </ActionBox>
      }
    />
  );
}
