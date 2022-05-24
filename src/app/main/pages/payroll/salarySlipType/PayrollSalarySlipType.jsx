import React, { createRef, useEffect, useState } from "react";
import { FusePageSimple } from "../../../../../@fuse";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import { useDispatch } from "react-redux";
import useListState from "../../../reducers/listState";
import { ALERT_TYPES, setAlertContent } from "../../../../store/actions/fadak";
import Card from "@material-ui/core/Card";
import { Button, CardContent, Divider } from "@material-ui/core";
import FormPro from "../../../components/formControls/FormPro";
import ActionBox from "../../../components/ActionBox";
import TablePro from "../../../components/TablePro";
import PayrollSalarySlipTypeFactors from "./PayrollSalarySlipTypeFactors";
import axios from "../../../api/axiosRest";
import ModalPro from "../../../components/ModalPro";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { PayrollCardHeader } from "../Payroll";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function PayrollSalarySlipType() {
  const formDefaultValues = {};
  const primaryKey = "payslipTypeId";
  const defaultAction = { type: "add", payload: "" };
  const myScrollElement = createRef();
  const dispatch = useDispatch();
  const [formValues, set_formValues] = useState(formDefaultValues);
  const [formValidation, set_formValidation] = useState({});
  const [action, set_action] = useState(defaultAction);
  const [modalPreview, set_modalPreview] = useState({
    display: false,
    data: null,
  });
  const [timePeriodTypes, set_timePeriodTypes] = useState([]);
  const [printSettings, set_printSettings] = useState([]);
  const [outputTypes, set_outputTypes] = useState([]);
  const [waiting, set_waiting] = useState(false);
  const dataList = useListState(primaryKey);
  const formStructure = [
    {
      name: "code",
      label: "کد نوع فیش حقوقی",
      type: "text",
      required: true,
      validator: (values) =>
        new Promise((resolve) => {
          if (/[^a-z0-9]/i.test(values.code)) {
            resolve({
              error: true,
              helper: "این کد فقط می تواند شامل اعداد و حروف لاتین باشد!",
            });
          }
          resolve({ error: false, helper: "" });
        }),
    },
    {
      name: "title",
      label: "عنوان نوع فیش حقوقی",
      type: "text",
      required: true,
    },
    {
      name: "timePeriodTypeId",
      label: "نوع دوره زمانی",
      type: "select",
      options: timePeriodTypes,
      optionIdField: "timePeriodTypeId",
      required: true,
    },
    {
      name: "outputTypeId",
      label: "خروجی ها",
      type: "multiselect",
      options: outputTypes,
      optionIdField: "outputTypeId",
      optionLabelField: "title",
      getOptionDisabled: (option) => {
        const selectedIds = JSON.parse(formValues.outputTypeId || "[]");
        const selectedOptions = outputTypes.filter(
          (item) => selectedIds.indexOf(item.outputTypeId) > -1
        );
        const selectedTypes = selectedOptions.map(
          (item) => item.outputTypeEnumId
        );
        return (
          selectedTypes.indexOf(option.outputTypeEnumId) > -1 &&
          selectedIds.indexOf(option.outputTypeId) <= -1
        );
      },
    },
    {
      name: "roundingTypeEnumId",
      label: "روش رند کردن",
      type: "select",
      options: "RoundingType",
      changeCallback: (newOption) => {
        if (!newOption)
          set_formValues((prev) => ({ ...prev, roundingNumbers: null }));
      },
    },
    {
      name: "roundingNumbers",
      label: "تعداد رقم",
      type: "number",
      disabled: !formValues["roundingTypeEnumId"],
    },
    {
      name: "printSettingId",
      label: "نسخه فیش",
      type: "select",
      options: printSettings,
      optionIdField: "settingId",
      optionLabelField: "title",
      required: true,
    },
    {
      name: "autgenTimePeriod",
      label: "تولید خودکار دوره زمانی",
      type: "indicator",
    },
    {
      name: "autgenTitleTimePeriodEnumId",
      label: "عنوان دوره زمانی تولید خودکار",
      type: "select",
      options: "TitleTimePeriod",
      required: formValues["autgenTimePeriod"] === "Y",
      disabled: formValues["autgenTimePeriod"] !== "Y",
    },
    {
      name: "changeCalcType",
      label: "امکان تغییر نوع محاسبات در فرایند محاسبات",
      type: "indicator",
      col: 6,
    },
    {
      name: "description",
      label: "توضیحات",
      type: "textarea",
      col: 12,
    },
  ];

  const tableColumns = [
    {
      name: "code",
      label: "کد نوع فیش",
      type: "text",
    },
    {
      name: "title",
      label: "عنوان نوع فیش",
      type: "text",
    },
    {
      name: "timePeriodTypeId",
      label: "نوع دوره زمانی",
      type: "select",
      options: timePeriodTypes,
      optionIdField: "timePeriodTypeId",
    },
    {
      name: "printSettingId",
      label: "نسخه فیش",
      type: "select",
      options: printSettings,
      optionIdField: "settingId",
      optionLabelField: "title",
    },
    {
      name: "changeCalcType",
      label: "امکان تغییر نوع محاسبات",
      type: "indicator",
    },
  ];

  function get_dataList() {
    axios
      .get("/s1/payroll/PayslipType")
      .then((res) => {
        dataList.set(res.data.payslipTypeList);
      })
      .catch(() => {
        dataList.set([]);
      });
  }
  function get_object(pk) {
    const object = dataList.list.find((i) => i[primaryKey] === pk);
    set_formValues(object);
  }
  function create_object() {
    axios
      .post("/s1/payroll/PayslipType", { newPayroll: formValues })
      .then((res) => {
        dataList.add({
          ...formValues,
          ...res.data,
        });
        handle_edit(res.data);
        dispatch(
          setAlertContent(
            ALERT_TYPES.SUCCESS,
            "نوع جدید فیش حقوقی با موفقیت اضافه شد."
          )
        );
        set_waiting(false);
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
        set_waiting(false);
      });
  }
  function update_object() {
    axios
      .put("/s1/payroll/PayslipType", { editedPayslip: formValues })
      .then(() => {
        dataList.update(formValues);
        set_action(defaultAction);
        set_formValues(formDefaultValues);
        dispatch(
          setAlertContent(
            ALERT_TYPES.SUCCESS,
            "ویرایش نوع فیش حقوقی با موفقیت انجام شد."
          )
        );
        set_waiting(false);
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
        set_waiting(false);
      });
  }
  function handle_submit() {
    if (
      dataList.list.findIndex(
        (i) =>
          i["code"] === formValues["code"] &&
          i[primaryKey] !== formValues[primaryKey]
      ) >= 0
    ) {
      set_formValidation({
        code: { error: true, helper: "کد نوع فیش تکراری است!" },
      });
      return false;
    }
    set_waiting(true);
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات..."));
    if (action.type === "add") {
      create_object();
    } else if (action.type === "edit") {
      update_object();
    }
  }
  function handle_cancel() {
    set_action({ type: "add", payload: "" });
  }
  function handle_edit(row) {
    set_action({ type: "edit", payload: row[primaryKey] });
  }
  function handle_remove(row) {
    set_action(defaultAction);
    return new Promise((resolve, reject) => {
      axios
        .delete(`/s1/payroll/PayslipType?${primaryKey}=${row[primaryKey]}`)
        .then((res) => {
          if (res.data.deleteRow === "true") resolve();
          reject(
            "این فیش در صفحات دیگر مورد استفاده قرار گرفته و حذف آن امکانپذیر نیست!"
          );
        })
        .catch(() => {
          reject();
        });
    });
  }
  function show_preview(data) {
    if (!data) {
      data = {
        title: "",
      };
    }
    set_modalPreview({
      display: true,
      data: data,
    });
  }
  function scroll_to_top() {
    myScrollElement.current.rootRef.current.parentElement.scrollTop = 0;
  }

  useEffect(() => {
    get_dataList();
    axios
      .get("/s1/payroll/entity/timePeriodType?periodPurposeEnumId=TPPPayroll")
      .then((res) => {
        set_timePeriodTypes(res.data.timePeriodTypeList);
      })
      .catch(() => {});
    axios
      .get("/s1/payroll/getPrintSetting")
      .then((res) => {
        set_printSettings(res.data.printSetting);
      })
      .catch(() => {});
    axios
      .get("/s1/payroll/outputType")
      .then((res) => {
        set_outputTypes(res.data.outputTypeList);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (action.type === "edit") {
      get_object(action.payload);
      scroll_to_top();
    }
  }, [action]);

  return (
    <FusePageSimple
      ref={myScrollElement}
      header={<PayrollCardHeader title={"نوع فیش حقوق و دستمزد"} />}
      content={
        <Box p={2}>
          <Card>
            <CardHeader title="تعریف نوع فیش حقوقی" />
            <CardContent>
              <FormPro
                formValues={formValues}
                setFormValues={set_formValues}
                formDefaultValues={formDefaultValues}
                formValidation={formValidation}
                setFormValidation={set_formValidation}
                prepend={formStructure}
                actionBox={
                  <ActionBox>
                    <Button
                      type="submit"
                      role="primary"
                      disabled={waiting}
                      endIcon={waiting ? <CircularProgress size={20} /> : null}
                    >
                      {action.type === "add" ? "افزودن" : "ویرایش"}
                    </Button>
                    <Button type="reset" role="secondary" disabled={waiting}>
                      لغو
                    </Button>
                    <Button
                      type="button"
                      onClick={() => show_preview()}
                      role="tertiary"
                    >
                      پیش نمایش
                    </Button>
                  </ActionBox>
                }
                submitCallback={handle_submit}
                resetCallback={handle_cancel}
              />
              {action.type === "edit" && (
                <React.Fragment>
                  <Box my={2}>
                    <Divider variant="fullWidth" />
                  </Box>
                  <PayrollSalarySlipTypeFactors
                    parentKey={primaryKey}
                    parentKeyValue={action.payload}
                  />
                </React.Fragment>
              )}
            </CardContent>
          </Card>
          <Box m={2} />
          <Card>
            <TablePro
              title="لیست انواع فیش حقوقی"
              columns={tableColumns}
              rows={dataList.list || []}
              setRows={dataList.set}
              loading={dataList.list === null}
              edit="callback"
              editCallback={handle_edit}
              removeCallback={handle_remove}
              rowActions={[
                {
                  title: "پیش نمایش",
                  icon: VisibilityIcon,
                  onClick: (row) => show_preview(row),
                },
              ]}
            />
          </Card>
          <ModalPro
            title={`پیش نمایش ${modalPreview.data?.title}`}
            open={modalPreview.display}
            setOpen={(val) =>
              set_modalPreview((prevState) => ({ ...prevState, display: val }))
            }
            content={<Box p={5}></Box>}
          />
        </Box>
      }
    />
  );
}
