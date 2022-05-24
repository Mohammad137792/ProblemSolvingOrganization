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
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TabPro from "app/main/components/TabPro";
import TablePro from "app/main/components/TablePro";
import { SERVER_URL } from "configs";
import axios from "axios";
import {
  ALERT_TYPES,
  setAlertContent,
} from "../../../../../store/actions/fadak";
import checkPermis from "app/main/components/CheckPermision";
import CircularProgress from "@material-ui/core/CircularProgress";
import Attachment from "./tempComponent/Attachment";
import moment from "moment-jalaali";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function DefinitionForm() {
  const classes = useStyles();
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [formValidation, setFormValidation] = useState({});
  const [tableContentFacilities, setTableContentFacilities] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [welfareId, setWelfareId] = useState("");
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
      name: "welfareCode",
      label: "کد تسهیل مالی",
      type: "text",
      required: true,
      validator: (values) => {
        const ind = tableContentFacilities?.findIndex(
          (row) =>
            row.welfareCode == values.welfareCode &&
            row?.welfareId != values?.welfareId
        );
        return new Promise((resolve) => {
          if (/[^a-z0-9]/i.test(values.welfareCode)) {
            resolve({
              error: true,
              helper:
                "کد تسهیل مالی فقط می تواند شامل اعداد و حروف لاتین باشد!",
            });
          }
          if (ind > -1) {
            resolve({ error: true, helper: "کد وارد شده تکراری است." });
          } else {
            resolve({ error: false, helper: "" });
          }
        });
      },
      col: 3,
    },
    {
      name: "title",
      label: "عنوان تسهیل مالی",
      type: "text",
      required: true,
      col: 3,
    },
    {
      name: "date",
      label: "تاریخ ایجاد",
      type: "date",
      required: true,
      readOnly: true,
      col: 2,
    },
    {
      name: "statusId",
      label: "وضعیت",
      type: "select",
      options: fieldsInfo.loanStatus,
      optionLabelField: "description",
      optionIdField: "statusId",
      col: 1,
    },
    {
      name: "welfareTypeEnumId",
      label: "جنس تسهیل مالی تعریفی",
      type: "select",
      options: fieldsInfo.welfareType,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,

      col: 3,
    },

    {
      name: "loanTypeEnumId",
      label: "نوع تسهیل مالی",
      type: "select",
      options: fieldsInfo.loanType,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
      col: 3,
    },
    {
      name: "financialFacilityTypeId",
      label: "منبع تسهیل",
      type: "select",
      options: fieldsInfo.finantionalFacility,
      optionLabelField: "description",
      optionIdField: "enumId",
      changeCallback: () =>
        setFormValues((prevState) => ({
          ...prevState,
          bankParentPartyId: null,
          bankPartyId: null,
        })),
      col: 3,
    },
    {
      name: "bankParentPartyId",
      label: "انتخاب بانک",
      type: "select",
      options: fieldsInfo.bankList,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
      display: formValues?.financialFacilityTypeId == "BankFinantionalFacility",
      col: 3,
    },
    {
      name: "bankPartyId",
      label: "انتخاب شعبه",
      type: "select",
      options: fieldsInfo.bankBranches,
      optionLabelField: "organizationName",
      optionIdField: "partyId",
      filterOptions: (options) =>
        formValues["bankParentPartyId"] &&
        formValues["bankParentPartyId"] != null
          ? options.filter(
              (item) => item.ownerPartyId == formValues["bankParentPartyId"]
            )
          : options,
      changeCallback: (options) => {
        if (options) {
          setFormValues((prevState) => ({
            ...prevState,
            bankParentPartyId: options?.ownerPartyId,
          }));
        }
      },
      display: formValues?.financialFacilityTypeId == "BankFinantionalFacility",
      required:
        formValues?.financialFacilityTypeId == "BankFinantionalFacility",
      col: 3,
    },
    {
      type: "group",
      items: [
        {
          name: "loanInterestAmount",
          label: "نرخ بهره سالیانه",
          type: "float",
          required: true,
        },
        {
          label: "درصد",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
    },
    {
      type: "group",
      items: [
        {
          name: "loanFeeAmount",
          label: "نرخ کارمزد سالیانه",
          type: "float",
          required: true,
        },
        {
          label: "درصد",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
    },
    {
      type: "group",
      items: [
        {
          name: "loanPenaltyAmount",
          label: "نرخ جریمه",
          type: "float",
          required: true,
        },
        {
          label: "درصد",
          type: "text",
          disabled: true,
          fullWidth: false,
          style: { minWidth: "20px" },
        },
      ],
    },
    {
      type: "group",
      items: [
        {
          name: "installmentGap",
          label: "فاصله زمانی بین پرداخت اقساط",
          type: "number",
          required: true,
        },
        {
          name: "installmentGapUomId",
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
      type: "group",
      items: [
        {
          name: "breathingPeriod",
          label: "دوره تنفس",
          type: "number",
        },
        {
          name: "breathingUomId",
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
      name: "installmentCalculationMethodEnumId",
      label: "نحوه بازپرداخت اقساط",
      type: "select",
      options: fieldsInfo.installmentCalculationMethod,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
      changeCallback: () =>
        setFormValues((prevState) => ({
          ...prevState,
          payslipTypeId: null,
        })),
      col: 3,
    },
    {
      name: "payslipTypeId",
      label: "نوع فیش کسر تسهیل مالی ",
      type: "select",
      options: fieldsInfo.payslipType,
      optionLabelField: "title",
      optionIdField: "payslipTypeId",
      display:
        formValues?.installmentCalculationMethodEnumId == "AutoDeduction",
      required:
        formValues?.installmentCalculationMethodEnumId == "AutoDeduction",
      col: 3,
    },
    {
      name: "paymentFormulaId",
      label: "روش محاسبه مبلغ اقساط  ",
      type: "select",
      options: fieldsInfo.loanInstallmentFormula,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
      col: 3,
    },
    // {
    //   name: "penaltyFormulaId",
    //   label: "روش محاسبه پرداخت جریمه",
    //   type: "select",
    //   options: fieldsInfo.loanPenaltyFormula,
    //   optionLabelField: "description",
    //   optionIdField: "enumId",
    //   required: true,
    //   col: 3,
    // },
    {
      name: "description",
      label: "توضیحات",
      type: "textarea",
      col: 6,
    },
  ];

  const tabs = [
    {
      label: "پیوست",
      panel: (
        <Attachment
          datas={datas}
          attachments={attachments}
          setAttachments={setAttachments}
          welfareId={welfareId}
        />
      ),
      display: welfareId,
    },
    // {
    //   label: "مراحل تامین",
    //   panel: <SupplySteps fieldsInfo={fieldsInfo} welfareId={welfareId}/>,
    //   display: welfareId && formValues.welfareTypeEnumId == "SupplyLoan",
    // },
  ];

  const definitionListCols = [
    {
      name: "welfareCode",
      label: "کد",
      type: "number",
      style: { minWidth: "80px" },
    },
    {
      name: "title",
      label: "عنوان",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "date",
      label: "تاریخ ایجاد",
      type: "date",
      style: { minWidth: "80px" },
    },
    {
      name: "loanTypeEnum",
      label: "نوع تسهیل مالی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "status",
      label: "وضعیت",
      type: "text",
      style: { minWidth: "80px" },
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=Welfare,LoanType,FinantionalFacility,InstallmentCalculationMethod,LoanInstallmentFormula,LoanPenaltyFormula,VerActionWelfare",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            welfareType: res.data.enums.Welfare.filter(
              (item) => item?.parentEnumId == "WeLoan"
            ),
            loanType: res.data.enums.LoanType,
            finantionalFacility: res.data.enums.FinantionalFacility,
            installmentCalculationMethod:
              res.data.enums.InstallmentCalculationMethod,
            loanInstallmentFormula: res.data.enums.LoanInstallmentFormula,
            loanPenaltyFormula: res.data.enums.LoanPenaltyFormula,
            verActionWelfare: res.data.enums.VerActionWelfare,
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

  const getStatusSelectFields = () => {
    axios
      .get(
        SERVER_URL + "/rest/s1/fadak/entity/StatusItem?statusTypeId=LoanStatus",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            loanStatus: res.data.status,
          };
        });
      });
  };

  const getPayslipSelectFields = () => {
    axios
      .get(SERVER_URL + "/rest/s1/payroll/payslipType", axiosKey)
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            payslipType: res.data.payslipTypes,
          };
        });
      });
  };
  const getBankSelectFields = () => {
    axios
      .get(SERVER_URL + "/rest/s1/welfare/BankBranches", axiosKey)
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            bankBranches: res.data.bankBranches,
            bankList: res.data.bankList,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در گرفتن شعب بانکی !")
        );
      });
  };

  const getWelfareList = () => {
    setLoading(true);
    axios
      .get(SERVER_URL + "/rest/s1/welfare/Welfare", axiosKey)
      .then((res) => {
        setTableContentFacilities(res.data?.welfareInfo);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت لیست تسهیلات مالی!")
        );
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setWaiting(true);
    setLoading(true);
    axios
      .post(SERVER_URL + "/rest/s1/welfare/Welfare", formValues, axiosKey)
      .then((res) => {
        const completedFormValues = {
          ...formValues,
          welfareId: res.data?.welfareId,
          loanId: res.data?.loanId,
          loanInterestRateId: res.data?.loanInterestRateId,
          loanFeeRateId: res.data?.loanFeeRateId,
          loanPenaltyRateId: res.data?.loanPenaltyRateId,
          loanTypeEnum: fieldsInfo?.loanType.find(
            (item) => item.enumId == formValues.loanTypeEnumId
          ).description,
          status: fieldsInfo?.loanStatus.find(
            (item) => item.statusId == formValues.statusId
          ).description,
        };
        setTableContentFacilities((prevState) => [
          ...prevState,
          completedFormValues,
        ]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد.")
        );
        setWaiting(false);
        setLoading(false);
        setWelfareId(res.data?.welfareId);
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در ایجاد تسهیل مالی!")
        );
        setWaiting(false);
        setLoading(false);
      });
  };

  const editCallback = (row) => {
    setFormValues(row);
    setWelfareId(row?.welfareId);
    setAttachments(row?.welfareContent);
  };

  const handleEdit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setWaiting(true);
    setLoading(true);
    axios
      .put(SERVER_URL + "/rest/s1/welfare/Welfare", formValues, axiosKey)
      .then((res) => {
        const completedFormValues = {
          ...formValues,
          welfareId: res.data?.welfareId,
          loanId: res.data?.loanId,
          loanInterestRateId: res.data?.loanInterestRateId,
          loanFeeRateId: res.data?.loanFeeRateId,
          loanPenaltyRateId: res.data?.loanPenaltyRateId,
          loanTypeEnum: fieldsInfo?.loanType.find(
            (item) => item.enumId == formValues.loanTypeEnumId
          ).description,
          status: fieldsInfo?.loanStatus.find(
            (item) => item.statusId == formValues.statusId
          ).description,
        };
        const editedTableContent = [...tableContentFacilities];
        const welfareIndex = tableContentFacilities.findIndex(
          (row) => row.welfareId == welfareId
        );
        editedTableContent[welfareIndex] = {
          ...editedTableContent[welfareIndex],
          ...completedFormValues,
        };
        setTableContentFacilities(editedTableContent);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در ویرایش تسهیل مالی!")
        );
        setWaiting(false);
        setLoading(false);
      });
  };

  const handleRemove = (row) => {
    return new Promise((resolve, reject) => {
      dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
      setWaiting(true);
      setLoading(true);
      axios
        .delete(
          SERVER_URL + `/rest/s1/welfare/Welfare?welfareId=${row?.welfareId}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContentFacilities.filter(
            (welfare) => welfare.welfareId != row?.welfareId
          );
          setTableContentFacilities(filteredTable);
          setWaiting(false);
          setLoading(false);
          if (welfareId == row?.welfareId) {
            handleReset();
          }
          resolve();
        })
        .catch(() => {
          dispatch(
            setAlertContent(ALERT_TYPES.ERROR, "خطا در حذف تسهیل مالی!")
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
        statusId: "ActiveLoan",
        breathingUomId: "TimePeriodMonth",
        installmentGapUomId: "TimePeriodMonth",
        date: moment(new Date().getTime()).format("YYYY-MM-DD"),
      };
    });
    setWelfareId("");
  };

  useEffect(() => {
    getEnumSelectFields();
    getUomSelectFields();
    getStatusSelectFields();
    getPayslipSelectFields();
    getBankSelectFields();
    getWelfareList();
    setFormValues((prevState) => {
      return {
        ...prevState,
        statusId: "ActiveLoan",
        breathingUomId: "TimePeriodMonth",
        installmentGapUomId: "TimePeriodMonth",
        date: moment(new Date().getTime()).format("YYYY-MM-DD"),
      };
    });
  }, []);

  useEffect(() => {
    if (welfareId) {
      const editedTableContent = [...tableContentFacilities];
      const welfareIndex = tableContentFacilities.findIndex(
        (row) => row.welfareId == welfareId
      );
      editedTableContent[welfareIndex] = {
        ...editedTableContent[welfareIndex],
        welfareContent: attachments,
      };
      setTableContentFacilities(editedTableContent);
    }
  }, [attachments]);

  return (
    <FusePageSimple
      header={
        <CardHeader
          title={
            <Box className={classes.headerTitle}>
              <Typography color="textSecondary">خدمات رفاهی</Typography>
              <KeyboardArrowLeftIcon color="disabled" />
              تعریف تسهیل مالی
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
                    welfareId
                      ? checkPermis(
                          "welfareServices/financialFacilities/definitionOfFinancialFacilitation/update",
                          datas
                        ) && handleEdit()
                      : checkPermis(
                          "welfareServices/financialFacilities/definitionOfFinancialFacilitation/add",
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
                          waiting || welfareId
                            ? !checkPermis(
                                "welfareServices/financialFacilities/definitionOfFinancialFacilitation/update",
                                datas
                              )
                            : !checkPermis(
                                "welfareServices/financialFacilities/definitionOfFinancialFacilitation/add",
                                datas
                              )
                        }
                        endIcon={
                          waiting ? <CircularProgress size={20} /> : null
                        }
                      >
                        {welfareId ? "ویرایش" : "ثبت"}
                      </Button>
                      <Button type="reset" role="secondary" disabled={waiting}>
                        لغو
                      </Button>
                    </ActionBox>
                  }
                />
                <Box p={2} />
                {welfareId && (
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
                  title="لیست تسهیلات مالی"
                  loading={loading}
                  columns={definitionListCols}
                  rows={tableContentFacilities}
                  setRows={setTableContentFacilities}
                  removeCondition={() =>
                    checkPermis(
                      "welfareServices/financialFacilities/definitionOfFinancialFacilitation/delete",
                      datas
                    )
                  }
                  removeCallback={handleRemove}
                  editCondition={() =>
                    checkPermis(
                      "welfareServices/financialFacilities/definitionOfFinancialFacilitation/update",
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

const SupplySteps = ({ fieldsInfo }) => {
  const [tableContent, setTableContent] = useState();
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const tableCols = [
    {
      name: "sequence",
      label: "ترتیب رده تایید",
      type: "number",
      style: { minWidth: "80px" },
    },
    {
      name: "emplPosition",
      label: "عنوان رده تایید",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "actionEnum",
      label: "اقدامات قابل انجام",
      type: "text",
      style: { minWidth: "80px" },
    },
  ];

  const handleRemove = () => {
    return new Promise((resolve, reject) => {
      dispatch(
        setAlertContent(ALERT_TYPES.SUCCESS, "سطر مورد نظر با موفقیت حذف شد.")
      );
      resolve();
    });
  };

  return (
    <>
      <TablePro
        title="لیست مراحل"
        columns={tableCols}
        rows={tableContent}
        setRows={setTableContent}
        loading={loading}
        add="external"
        addForm={
          <ExternalForm
            formValues={formValues}
            setFormValues={setFormValues}
            editing={false}
            setLoading={setLoading}
            fieldsInfo={fieldsInfo}
            tableContent={tableContent}
            setTableContent={setTableContent}
          />
        }
        edit="external"
        editForm={
          <ExternalForm
            formValues={formValues}
            setFormValues={setFormValues}
            editing={true}
            setLoading={setLoading}
            fieldsInfo={fieldsInfo}
            tableContent={tableContent}
            setTableContent={setTableContent}
          />
        }
        removeCallback={handleRemove}
      />
    </>
  );
};
function ExternalForm({ editing = false, ...restProps }) {
  const {
    formValues,
    setFormValues,
    handleClose,
    fieldsInfo,
    setLoading,
    tableContent,
    setTableContent,
  } = restProps;
  const [waiting, setWaiting] = useState(false);
  const [formValidation, setFormValidation] = useState({});
  const dispatch = useDispatch();

  const formStructure = [
    {
      name: "sequence",
      label: "ترتیب رده تایید",
      type: "number",
      required: true,
    },
    {
      name: "emplPositionId",
      label: "عنوان رده تایید",
      type: "select",
      options: fieldsInfo.verActionWelfare,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
    },
    {
      name: "actionEnumId",
      label: "اقدامات قابل انجام",
      type: "multiselect",
      options: fieldsInfo.verActionWelfare,
      optionLabelField: "description",
      optionIdField: "enumId",
    },
  ];
  const handleSubmit = () => {
    setLoading(true);
    setWaiting(true);
    dispatch(
      setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ذخیره شد.")
    );
    handleReset();
  };

  const handleEdit = () => {
    setLoading(true);
    setWaiting(true);
    dispatch(
      setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
    );
    handleReset();
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
        formStructure={formStructure}
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
