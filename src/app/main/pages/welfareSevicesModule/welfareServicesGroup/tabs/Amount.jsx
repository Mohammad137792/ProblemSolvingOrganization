import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TablePro from "app/main/components/TablePro";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, CardContent } from "@material-ui/core";
import { SERVER_URL } from "configs";
import axios from "axios";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../store/actions/fadak";

export default function Amount({ welfareGroupPartyClassificationId }) {
  const [tableContent, setTableContent] = useState([]);
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const tableCols = [
    {
      name: "welfareTitle",
      label: "تسهیل مالی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "amountTypeEnum",
      label: "نوع مبلغ تسهیل مالی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "loanAmountLimit",
      label: "حداکثر مبلغ تسهیل مالی",
      type: "number",
      style: { minWidth: "80px" },
    },

    {
      name: "calculationImpact",
      label: " سقف مجاز درخواست",
      type: "number",
      style: { minWidth: "80px" },
    },
    {
      name: "maxInstallmentNumber",
      label: "حداکثر تعداد اقساط",
      type: "number",
      style: { minWidth: "80px" },
    },
    {
      name: "fromDate",
      label: "از تاریخ",
      type: "date",
      style: { minWidth: "80px" },
    },
    {
      name: "thruDate",
      label: "تا تاریخ",
      type: "date",
      style: { minWidth: "140px" },
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=LoanType,LoanTypeAmount",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            loanType: res.data.enums.LoanType,
            loanTypeAmount: res.data.enums.LoanTypeAmount,
          };
        });
      });
  };

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

  const getWelfareList = () => {
    axios
      .get(SERVER_URL + "/rest/s1/welfare/filterWelfare", axiosKey)
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            welfare: res.data.loanInfo,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت  لیست تسهیلات مالی!"
          )
        );
      });
  };

  const getWelfareGroupLoan = () => {
    setLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/welfareGroupLoan?welfareGroupPartyClassificationId=${welfareGroupPartyClassificationId}`,
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.welfareGroupLoan);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت لیست مبالغ تسهیل مالی!"
          )
        );
        setLoading(false);
      });
  };

  const handleRemove = (row) => {
    return new Promise((resolve, reject) => {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
      setLoading(true);
      axios
        .delete(
          SERVER_URL +
            `/rest/s1/welfare/welfareGroupLoan?welfareGroupLoanId=${row?.welfareGroupLoanId}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContent.filter(
            (person) => person.welfareGroupLoanId != row?.welfareGroupLoanId
          );
          setTableContent(filteredTable);
          setLoading(false);
          resolve();
        })
        .catch(() => {
          dispatch(
            setAlertContent(ALERT_TYPES.ERROR, "خطا در حذف مبلغ تسهیل مالی!")
          );
          setLoading(false);
          reject();
        });
    });
  };

  useEffect(() => {
    getEnumSelectFields();
    getUomSelectFields();
    getWelfareList();
  }, []);

  useEffect(() => {
    getWelfareGroupLoan();
    setFormValues((prevState) => {
      return {
        ...prevState,
        loanUsageLimitUomId: "TimePeriodMonth",
      };
    });
  }, [welfareGroupPartyClassificationId]);

  return (
    <>
      <TablePro
        title="مبالغ تسهیل مالی در بازه های زمانی مختلف"
        columns={tableCols}
        rows={tableContent}
        setRows={setTableContent}
        loading={loading}
        add={
          checkPermis(
            "welfareServices/welfareServicesGroup/Amount/add",
            datas
          ) && "external"
        }
        addForm={
          <ExternalForm
            formValues={formValues}
            setFormValues={setFormValues}
            editing={false}
            setLoading={setLoading}
            fieldsInfo={fieldsInfo}
            tableContent={tableContent}
            setTableContent={setTableContent}
            welfareGroupPartyClassificationId={
              welfareGroupPartyClassificationId
            }
          />
        }
        edit={
          checkPermis(
            "welfareServices/welfareServicesGroup/Amount/update",
            datas
          ) && "external"
        }
        editForm={
          <ExternalForm
            formValues={formValues}
            setFormValues={setFormValues}
            editing={true}
            setLoading={setLoading}
            fieldsInfo={fieldsInfo}
            tableContent={tableContent}
            setTableContent={setTableContent}
            welfareGroupPartyClassificationId={
              welfareGroupPartyClassificationId
            }
          />
        }
        removeCondition={() =>
          checkPermis(
            "welfareServices/welfareServicesGroup/Amount/delete",
            datas
          )
        }
        removeCallback={handleRemove}
      />
    </>
  );
}

function ExternalForm({ editing = false, ...restProps }) {
  const {
    formValues,
    setFormValues,
    handleClose,
    fieldsInfo,
    setLoading,
    tableContent,
    setTableContent,
    welfareGroupPartyClassificationId,
  } = restProps;

  const [waiting, setWaiting] = useState(false);
  const [formValidation, setFormValidation] = useState({});
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };
  const formStructure = [
    {
      name: "welfareId",
      label: "انتخاب تسهیل مالی",
      type: "select",
      required: true,
      options: fieldsInfo.welfare,
      optionIdField: "welfareId",
      optionLabelField: "title",
      getOptionLabel: (opt) => `${opt.welfareCode} ─ ${opt.title}` || "؟",
    },
    {
      name: "amountTypeEnumId",
      label: "نوع مبلغ تسهیل مالی",
      type: "select",
      options: fieldsInfo.loanTypeAmount,
      optionLabelField: "description",
      optionIdField: "enumId",
      readOnly: editing,
      changeCallback: () =>
        setFormValues((prevState) => ({
          ...prevState,
          loanAmountLimit: null,
          calculationImpact: null,
        })),
    },
    {
      type: "group",
      items: [
        {
          name: "loanAmountLimit",
          label:
            formValues?.amountTypeEnumId == "VariableLoanTypeAmount"
              ? "حداکثر مبلغ تسهیل مالی"
              : "مبلغ تسهیل مالی",
          type: "float",
          required: true,
        },
        {
          label: "ریال",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "10px" },
        },
      ],
      col: 4,
    },
    {
      name: "calculationImpact",
      label: "سقف مجاز درخواست (درصد حکم کارگزینی)",
      required: true,
      display: formValues?.amountTypeEnumId == "VariableLoanTypeAmount",
      required: formValues?.amountTypeEnumId == "VariableLoanTypeAmount",
      type: "number",
      col: 4,
    },
    {
      name: "maxInstallmentNumber",
      label: "حداکثر تعداد اقساط",
      type: "number",
      required: true,
    },
    {
      type: "group",
      items: [
        {
          name: "loanUsageLimit",
          label: " محدودیت درخواست",
          type: "number",
        },
        {
          name: "loanUsageLimitUomId",
          label: " دوره زمانی",
          type: "select",
          options: fieldsInfo.welfareTimePeriod,
          optionLabelField: "description",
          optionIdField: "uomId",
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
    },
    {
      name: "fromDate",
      label: "از تاریخ",
      type: "date",
      required: true,
    },
    {
      name: "thruDate",
      label: "تا تاریخ",
      type: "date",
      required: true,
    },
  ];
  const handleSubmit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setLoading(true);
    setWaiting(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/welfareGroupLoan",
        {
          ...formValues,
          welfareGroupPartyClassificationId: welfareGroupPartyClassificationId,
        },
        axiosKey
      )
      .then((res) => {
        const completedFormValues = {
          ...formValues,
          welfareTitle: fieldsInfo?.welfare.find(
            (item) => item.welfareId == formValues.welfareId
          )?.title,
          amountTypeEnum: fieldsInfo?.loanTypeAmount.find(
            (item) => item.enumId == formValues.amountTypeEnumId
          )?.description,
          welfareGroupLoanId: res.data?.welfareGroupLoanId,
        };
        setTableContent((prevState) => [...prevState, completedFormValues]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در افزودن مبلغ تسهیل مالی!")
        );
        setWaiting(false);
        setLoading(false);
      });
  };

  const handleEdit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setLoading(true);
    setWaiting(true);
    axios
      .put(
        SERVER_URL + "/rest/s1/welfare/welfareGroupLoan",
        {
          ...formValues,
        },
        axiosKey
      )
      .then((res) => {
        const editedTableContent = [...tableContent];
        const amountIndex = tableContent.findIndex(
          (person) => person.welfareGroupLoanId == formValues.welfareGroupLoanId
        );
        const completedFormValues = {
          ...formValues,
          welfareTitle: fieldsInfo?.welfare.find(
            (item) => item.welfareId == formValues.welfareId
          )?.title,
          amountTypeEnum: fieldsInfo?.loanTypeAmount.find(
            (item) => item.enumId == formValues.amountTypeEnumId
          )?.description,
        };
        editedTableContent[amountIndex] = { ...completedFormValues };
        setTableContent(editedTableContent);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در ویرایش مبلغ تسهیل مالی!")
        );
        setWaiting(false);
        setLoading(false);
      });
  };

  const handleReset = () => {
    setLoading(false);
    setWaiting(false);
    setFormValues({});
    handleClose();
  };

  return (
    <CardContent>
      <FormPro
        prepend={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        formValidation={formValidation}
        setFormValidation={setFormValidation}
        submitCallback={() => (editing ? handleEdit() : handleSubmit())}
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
        resetCallback={handleReset}
      />
    </CardContent>
  );
}
