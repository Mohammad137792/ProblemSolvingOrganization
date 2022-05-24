import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardContent,
  CardHeader,
  Divider,
} from "@material-ui/core";
import FormPro from "../../../../components/formControls/FormPro";
import ActionBox from "../../../../components/ActionBox";
import Card from "@material-ui/core/Card";
import TablePro from "../../../../components/TablePro";
import useListState from "../../../../reducers/listState";
import axios from "../../../../api/axiosRest";
import {useDispatch, useSelector} from "react-redux";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../store/actions/fadak";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "../../../../components/CheckPermision";

const formDefaultValues = {
  voucherStatusId: "VTActive",
  severalVoucher: "N",
};
const primaryKey = "voucherTemplateId";
const defaultAction = { type: "add", payload: "" };

export default function AccountingDocumentTemplate({ scrollTop }) {
  const datas = useSelector(({ fadak }) => fadak);
  const dispatch = useDispatch();
  const [formValues, set_formValues] = useState(formDefaultValues);
  const [formValidation, set_formValidation] = useState({});
  const [action, set_action] = useState(defaultAction);
  const [waiting, set_waiting] = useState(false);
  const [data, set_data] = useState({
    groupDetailedAccounts: [],
    glAccounts: [],
    detailedAccounts: [],
    subArticle: {
      formulaList: [],
      payrollList: [],
      enumListExe: [],
      enumListPay: [],
      enumListVt: [],
    },
  });
  const dataList = useListState(primaryKey);
  const formStructure = [
    {
      name: "code",
      label: "کد الگو",
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
      label: "عنوان الگو",
      type: "text",
      required: true,
    },
    {
      name: "checkAccountBalanceEnumId",
      label: "بررسی تراز بودن سند حسابداری",
      type: "select",
      options: "CheckAccountBalance",
    },
    {
      name: "voucherStatusId",
      label: "وضعیت",
      type: "indicator",
      indicator: { true: "VTActive", false: "VTNotActive" },
    },
    {
      name: "severalVoucher",
      label: "صدور چند سند حسابداری",
      type: "indicator",
    },
    {
      name: "partyClassificationTypeEnumId",
      label: "روش تفکیک سند",
      type: "select",
      options: "PartyClassificationType",
      filterOptions: (options) =>
        options.filter((o) => o["parentEnumId"] === "PersonnelStructure"),
      disabled: formValues["severalVoucher"] === "N",
    },
    {
      name: "defaultVoucherNum",
      label: "مقدار پیش فرض شماره سند",
      type: "text",
    },
    {
      name: "defaultVoucherDescription",
      label: "شرح پیش فرض سند",
      type: "textarea",
      col: 6,
    },
    {
      name: "description",
      label: "شرح",
      type: "textarea",
      col: 6,
    },
  ];
  const tableColumns = [
    {
      name: "code",
      label: "کد الگو",
      type: "text",
    },
    {
      name: "title",
      label: "عنوان الگو",
      type: "text",
    },
    {
      name: "partyClassificationTypeEnumId",
      label: "روش تفکیک سند",
      type: "select",
      options: "PartyClassificationType",
    },
    {
      name: "description",
      label: "شرح سند",
      type: "text",
    },
  ];

  function get_dataList() {
    axios
      .get("/s1/payroll/voucherTemplate")
      .then((res) => {
        dataList.set(res.data.templateList);
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
      .post("/s1/payroll/voucherTemplate", { newVoucher: formValues })
      .then((res) => {
        dataList.add({
          ...formValues,
          ...res.data,
        });
        handle_edit(res.data);
        dispatch(
          setAlertContent(
            ALERT_TYPES.SUCCESS,
            "الگوی جدید سند حسابداری با موفقیت اضافه شد."
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
      .put("/s1/payroll/voucherTemplate", { editedVoucher: formValues })
      .then(() => {
        dataList.update(formValues);
        set_action(defaultAction);
        set_formValues(formDefaultValues);
        dispatch(
          setAlertContent(
            ALERT_TYPES.SUCCESS,
            "ویرایش الگو با موفقیت انجام شد."
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
        code: { error: true, helper: "کد الگو تکراری است!" },
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
        .delete(`/s1/payroll/voucherTemplate?${primaryKey}=${row[primaryKey]}`)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  useEffect(() => {
    get_dataList();
    axios
      .get("/s1/payroll/groupAccount")
      .then((res) => {
        set_data((prevState) => ({
          ...prevState,
          groupDetailedAccounts: res.data.allAccount,
        }));
      })
      .catch(() => {});
    axios
      .get("/s1/payroll/glAccount")
      .then((res) => {
        set_data((prevState) => ({
          ...prevState,
          glAccounts: res.data.allAccount,
        }));
      })
      .catch(() => {});
    axios
      .get("/s1/payroll/detailAccount")
      .then((res) => {
        set_data((prevState) => ({
          ...prevState,
          detailedAccounts: res.data.allAccount,
        }));
      })
      .catch(() => {});
    axios
      .get("/s1/payroll/subArticleList")
      .then((res) => {
        set_data((prevState) => ({
          ...prevState,
          subArticle: res.data.subArticle,
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (action.type === "edit") {
      get_object(action.payload);
      scrollTop();
    }
  }, [action]);

  useEffect(() => {
    if (formValues["severalVoucher"] === "N") {
      set_formValues((prevState) => ({
        ...prevState,
        partyClassificationTypeEnumId: null,
      }));
    }
  }, [formValues["severalVoucher"]]);

  return (
    <Box p={2}>
      {(checkPermis("payroll/accounting/voucherTemplate/add", datas) || action.type==="edit") && (
          <React.Fragment>
            <Card>
              <CardHeader title="تعریف الگوی سند حسابداری" />
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
                      <Button type="reset" role="secondary">
                        لغو
                      </Button>
                    </ActionBox>
                  }
                  submitCallback={handle_submit}
                  resetCallback={handle_cancel}
                />
                {action.type === "edit" && checkPermis("payroll/accounting/voucherTemplate/items", datas) && (
                  <React.Fragment>
                    <Box my={2}>
                      <Divider variant="fullWidth" />
                    </Box>
                    <AccountingDocumentTemplateArticles
                      parentKey={primaryKey}
                      parentKeyValue={action.payload}
                      data={data}
                    />
                  </React.Fragment>
                )}
              </CardContent>
            </Card>
            <Box m={2} />
          </React.Fragment>
      )}
      <Card>
        <TablePro
          title="لیست الگوهای سند حسابداری"
          columns={tableColumns}
          rows={dataList.list || []}
          setRows={dataList.set}
          loading={dataList.list === null}
          edit={checkPermis("payroll/accounting/voucherTemplate/edit", datas) && "callback"}
          editCallback={handle_edit}
          removeCallback={checkPermis("payroll/accounting/voucherTemplate/delete", datas) ? handle_remove : null}
        />
      </Card>
    </Box>
  );
}

function AccountingDocumentTemplateArticles({
  parentKey,
  parentKeyValue,
  data,
}) {
  const datas = useSelector(({ fadak }) => fadak);
  const primaryKey = "vtItemId";
  const dataList = useListState(primaryKey);
  const tableColumns = [
    {
      name: "seqNum",
      label: "ترتیب",
      type: "number",
    },
    {
      name: "glAccountId",
      label: "حساب معین",
      type: "select",
      options: data.glAccounts,
      optionIdField: "glAccountId",
      optionLabelField: "accountName",
    },
    {
      name: "vtItemTypeEnumId",
      label: "نوع آرتیکل",
      type: "select",
      options: "VTItemType",
      filterOptions: (options) => options.filter((o) => !o["parentEnumId"]),
    },
    {
      name: "description",
      label: "شرح",
      type: "text",
    },
  ];
  function handle_remove(row) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/s1/payroll/vTItem?${primaryKey}=${row[primaryKey]}`)
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
      .get("/s1/payroll/vTItem?voucherTemplateId=" + parentKeyValue)
      .then((res) => {
        dataList.set(res.data.articleList);
      })
      .catch(() => {
        dataList.set([]);
      });
  }

  useEffect(() => {
    get_dataList();
  }, [parentKeyValue]);

  return (
    <Card variant="outlined">
      <TablePro
        title="اقلام سند"
        columns={tableColumns}
        rows={dataList.list || []}
        setRows={dataList.set}
        loading={dataList.list === null}
        add={checkPermis("payroll/accounting/voucherTemplate/items/add", datas) && "external"}
        addForm={
          <TableForm
            data={data}
            parentKey={parentKey}
            parentKeyValue={parentKeyValue}
            articleList={dataList.list}
          />
        }
        edit={checkPermis("payroll/accounting/voucherTemplate/items/edit", datas) && "external"}
        editForm={
          <TableForm
            editing={true}
            data={data}
            parentKey={parentKey}
            parentKeyValue={parentKeyValue}
            articleList={dataList.list}
          />
        }
        removeCallback={checkPermis("payroll/accounting/voucherTemplate/items/delete", datas) ? handle_remove : null}
        showRowNumber={false}
        defaultOrderBy="sequenceNum"
      />
    </Card>
  );
}

function TableForm({
  editing = false,
  parentKey,
  parentKeyValue,
  articleList,
  data,
  ...restProps
}) {
  const [formValidation, setFormValidation] = useState({});
  const {
    formValues,
    setFormValues,
    oldData = {},
    successCallback,
    failedCallback,
    handleClose,
  } = restProps;
  const dispatch = useDispatch();
  const [waiting, set_waiting] = useState(false);
  const formDefaultValues = {};
  const formStructure = [
    {
      name: "seqNum",
      label: "ترتیب",
      type: "number",
    },
    {
      name: "glAccountId",
      label: "حساب معین",
      type: "select",
      options: data.glAccounts,
      optionIdField: "glAccountId",
      optionLabelField: "accountName",
      required: true,
    },
    {
      name: "detailedAccountId",
      label: "حساب تفصیلی",
      type: "multiselect",
      options: data.detailedAccounts,
      optionIdField: "detailedAccountId",
      optionLabelField: "accountTitle",
    },
    {
      name: "groupDetailedAccountId",
      label: "گروه حساب های تفصیلی",
      type: "multiselect",
      options: data.groupDetailedAccounts,
      optionIdField: "groupDetailedAccountId",
      optionLabelField: "title",
    },
    {
      name: "description",
      label: "شرح",
      type: "text",
      required: true,
      col: { sm: 8, md: 6 },
    },
    {
      name: "vtItemTypeEnumId",
      label: "نوع آرتیکل",
      type: "select",
      options: "VTItemType",
      required: true,
      filterOptions: (options) => options.filter((o) => !o["parentEnumId"]),
      changeCallback: () =>
        setFormValues((prevState) => ({
          ...prevState,
          enumId: null,
          formulaId: null,
        })),
    },
    {
      name: "enumId",
      label: "کسورات قانونی",
      type: "select",
      options: data.subArticle.enumListExe,
      display: !!formValues["vtItemTypeEnumId"]?.startsWith("VTITExemption"), //==="VTITExemption" || formValues["vtItemTypeEnumId"]==="VTITExemptionEmployer",
      required: !!formValues["vtItemTypeEnumId"]?.startsWith("VTITExemption"), //==="VTITExemption" || formValues["vtItemTypeEnumId"]==="VTITExemptionEmployer",
    },
    {
      name: "enumId",
      label: "تراکنش‌های حقوق و دستمزد",
      type: "select",
      options: data.subArticle.enumListPay,
      display: !!formValues["vtItemTypeEnumId"]?.startsWith("VTITTranPayroll"), //==="VTITTranPayroll" || formValues["vtItemTypeEnumId"]==="VTITTranPayrollEmployer",
      required: !!formValues["vtItemTypeEnumId"]?.startsWith("VTITTranPayroll"), //==="VTITTranPayroll" || formValues["vtItemTypeEnumId"]==="VTITTranPayrollEmployer"
    },
    {
      name: "enumId",
      label: "سایر",
      type: "select",
      options: "VTItemType",
      filterOptions: (options) =>
        options.filter((o) => o["parentEnumId"] === "VTITOther"),
      display: formValues["vtItemTypeEnumId"] === "VTITOther",
      required: formValues["vtItemTypeEnumId"] === "VTITOther",
    },
    {
      name: "formulaId",
      label: "فرمول محاسباتی",
      type: "select",
      options: data.subArticle.formulaList,
      optionIdField: "formulaId",
      optionLabelField: "title",
      display: formValues["vtItemTypeEnumId"] === "VTITFormula",
      required: formValues["vtItemTypeEnumId"] === "VTITFormula",
    },
    {
      name: "payrollFactorId",
      label: "عوامل حقوقی",
      type: "select",
      options: data.subArticle.payrollList,
      optionIdField: "payrollFactorId",
      optionLabelField: "title",
      display:
        !!formValues["vtItemTypeEnumId"]?.startsWith("VTITPayrollFactor"), // || formValues["vtItemTypeEnumId"]==="VTITPayrollFactorSave" || formValues["vtItemTypeEnumId"]==="VTITPayrollFactorArrears" || formValues["vtItemTypeEnumId"]==="VTITPayrollFactorSeverance",
      required:
        !!formValues["vtItemTypeEnumId"]?.startsWith("VTITPayrollFactor"), //==="VTITPayrollFactor" || formValues["vtItemTypeEnumId"]==="VTITPayrollFactorSave" || formValues["vtItemTypeEnumId"]==="VTITPayrollFactorArrears" || formValues["vtItemTypeEnumId"]==="VTITPayrollFactorSeverance"
    },
  ];

  console.log(
    "vliusssss",
    formValues["vtItemTypeEnumId"]?.startsWith("VTITPayrollFactor")
  );

  const handle_add = () => {
    let data = { ...formValues, [parentKey]: parentKeyValue };
    axios
      .post("/s1/payroll/vTItem", { newVTItem: data })
      .then((res) => {
        set_waiting(false);
        setFormValues(formDefaultValues);
        successCallback({ ...formValues, ...res.data });
      })
      .catch(() => {
        set_waiting(false);
        failedCallback();
      });
  };
  const handle_edit = () => {
    axios
      .put("/s1/payroll/vTItem", { editedVTItem: formValues })
      .then(() => {
        set_waiting(false);
        setFormValues(formDefaultValues);
        successCallback(formValues);
      })
      .catch(() => {
        set_waiting(false);
        failedCallback();
      });
  };

  // useEffect(()=>{
  //     if(!editing){
  //         setFormValues(prevState=>({
  //             ...prevState,
  //             ...formDefaultValues
  //         }))
  //     }
  // },[])

  return (
    <FormPro
      prepend={formStructure}
      formValues={formValues}
      setFormValues={setFormValues}
      formDefaultValues={formDefaultValues}
      formValidation={formValidation}
      setFormValidation={setFormValidation}
      submitCallback={() => {
        if (
          articleList.findIndex(
            (i) =>
              i["seqNum"] === formValues["seqNum"] &&
              i["vtItemId"] !== formValues["vtItemId"]
          ) >= 0
        ) {
          setFormValidation({
            seqNum: {
              error: true,
              helper: "ترتیب تعیین شده برای آرتیکل تکراری است!",
            },
          });
          return false;
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
          <Button type="reset" role="secondary">
            لغو
          </Button>
        </ActionBox>
      }
    />
  );
}
