import { FusePageSimple } from "@fuse";
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Button,
  Box,
  CardHeader,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Tooltip,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Image } from "@material-ui/icons";
import ActionBox from "app/main/components/ActionBox";
import {
  Visibility,
  Delete,
  CloudUpload,
  Description,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SERVER_URL } from "configs";
import axios from "axios";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import moment from "moment-jalaali";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  headerTitle: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function InstallmentSettlement() {
  const classes = useStyles();
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formDefaultValue, setFormDefaultValue] = useState({});
  const [formValues, setFormValues] = useState({});
  const [filterFormValues, setFilterFormValues] = useState({});
  const [tableContent, setTableContent] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const datas = useSelector(({ fadak }) => fadak);
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const tableCols = [
    {
      name: "pseudoId",
      label: "کد پرسنلی",
      type: "text",
    },
    {
      name: "firstName",
      label: "نام",
      type: "text",
    },

    {
      name: "lastName",
      label: "نام خانوادگی",
      type: "text",
    },
    {
      name: "organizationName",
      label: "شرکت",
      type: "text",
    },
    {
      name: "unitName",
      label: "واحد",
      type: "text",
    },
    {
      name: "emplPosition",
      label: "پست",
      type: "text",
    },
    {
      name: "nationalCode",
      label: "کد ملی",
      type: "number",
    },
    {
      name: "loanTypeEnum",
      label: "نوع تسهیل مالی",
      type: "select",
    },
    {
      name: "welfareTitle",
      label: "تسهیل مالی",
      type: "render",
      render: (row) => {
        return `${row.title || ""}-${row.welfareCode || ""}`;
      },
    },
    {
      name: "personLoanCode",
      label: "کد تسهیل فرد",
      type: "text",
    },
    {
      name: "installmentCalculationMethodEnum",
      label: "نحوه بازپرداخت",
      type: "text",
    },
    {
      name: "installmentCode",
      label: "شماره قسط",
      type: "number",
    },
    {
      name: "orginalInstallmentCode",
      label: "شماره قسط اصلی",
      type: "number",
    },
    {
      name: "payslipCode",
      label: "شماره فیش",
      type: "text",
    },
    {
      name: "paymentDate",
      label: "سر رسید پرداخت",
      type: "date",
    },
    {
      name: "actualPaymentDate",
      label: "تاریخ پرداخت قسط",
      type: "date",
    },
    {
      name: "installmentAmount",
      label: "مبلغ قسط",
      type: "number",
    },
    {
      name: "originalAmount",
      label: "اصل قسط",
      type: "number",
    },
    {
      name: "profitAmount",
      label: "سود قسط",
      type: "number",
    },
    {
      name: "feeAmount",
      label: "کارمزد قسط",
      type: "number",
    },
    {
      name: "paidInstallmentAmount",
      label: "مبلغ پرداخت شده",
      type: "number",
    },
    {
      name: "installmentPenaltyAmount",
      label: "مبلغ جریمه دیرکرد پرداخت",
      type: "number",
    },
    {
      name: "status",
      label: "وضعیت پرداخت",
      type: "text",
    },
    {
      name: "responsibleFullName",
      label: "تسویه کننده",
      type: "render",
      render: (row) => {
        return `${row.responsibleFirstName || ""} ${
          row.responsibleLastName || ""
        }`;
      },
    },
    {
      name: "responsibleEmplPosition",
      label: "پست سازمانی تسویه کننده",
      type: "text",
    },
    {
      name: "observeFile",
      label: "فایل بارگذاری شده",
      style: { width: "30%" },
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=InstallmentCalculationMethod",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            installmentCalculationMethod:
              res.data.enums.InstallmentCalculationMethod,
          };
        });
      });
  };

  const getStatusSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/entity/StatusItem?statusTypeId=LoanInstallment",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            loanInstallment: res.data.status,
          };
        });
      });
  };

  const getResponsibleInfo = () => {
    axios
      .get(SERVER_URL + "/rest/s1/humanres/getCurrentUser", axiosKey)
      .then((res) => {
        const defaultvalue = {};
        defaultvalue.responsibleEmplPositionId = res.data.emplPositionId;
        defaultvalue.responsibleEmplPosition = res.data.emplPosition;
        defaultvalue.responsiblePseudoId = res.data.pseudoId;
        defaultvalue.responsiblePartyRelationshipId =
          res.data.partyRelationshipId;
        defaultvalue.responsibleFullName =
          `${res.data.pseudoId} ─ ${res.data.fullName}` || "؟";
        defaultvalue.actualPaymentDate = moment(new Date().getTime()).format(
          "YYYY-MM-DD"
        );
        setFormDefaultValue(defaultvalue);
        setFormValues((prevState) => {
          return { ...prevState, ...defaultvalue };
        });
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            responsibleEmplPositions: res.data.emplPositions,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در گرفتن اطلاعات تسویه کننده!"
          )
        );
      });
  };

  const handleFilter = (reset = false) => {
    setWaiting(true);
    setLoading(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/filterLoanInstallment",
        {
          loanInstallmentInfo: reset
            ? { statusId: "UnPaidInstallment" }
            : { ...filterFormValues },
        },
        axiosKey
      )
      .then((res) => {
        const loanInstallment = res.data.filteredLoanInstallment;
        if (loanInstallment?.length > 0) {
          let tableDataArray = [];
          [...loanInstallment].map((item, index) => {
            let data = item.contentLocation
              ? {
                  ...item,
                  observeFile: (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={
                        SERVER_URL +
                        "/rest/s1/fadak/getpersonnelfile1?name=" +
                        item?.contentLocation
                      }
                      target="_blank"
                    >
                      {" "}
                      <Image />{" "}
                    </Button>
                  ),
                }
              : { ...item };
            tableDataArray.push(data);
            if (index == loanInstallment?.length - 1) {
              setTableContent(tableDataArray);
              setLoading(false);
              setWaiting(false);
            }
          });
        } else {
          setTableContent([]);
          setLoading(false);
          setWaiting(false);
        }
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در فیلتر اقساط رخ داده است."
          )
        );
        setLoading(false);
        setWaiting(false);
      });
  };

  useEffect(() => {
    getEnumSelectFields();
    getStatusSelectFields();
    getResponsibleInfo();
    handleFilter(true);
  }, []);

  return (
    <>
      <FusePageSimple
        header={
          <CardHeader
            title={
              <Box className={classes.headerTitle}>
                <Typography color="textSecondary">خدمات رفاهی</Typography>
                <KeyboardArrowLeftIcon color="disabled" />
                تسویه اقساط تسهیل مالی
              </Box>
            }
          />
        }
        content={
          <Box p={2}>
            <CardContent>
              <TablePro
                title="لیست اقساط"
                loading={loading}
                columns={tableCols}
                rows={tableContent}
                setRows={setTableContent}
                edit="external"
                editCondition={(row) =>
                  !waiting && row.statusId == "UnPaidInstallment"
                }
                editForm={
                  <EditForm
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formDefaultValue={formDefaultValue}
                    fieldsInfo={fieldsInfo}
                    editing={true}
                    datas={datas}
                    waiting={waiting}
                    setWaiting={setWaiting}
                    setLoading={setLoading}
                    tableContent={tableContent}
                    setTableContent={setTableContent}
                    handleFilter={handleFilter}
                  />
                }
                filter="external"
                filterForm={
                  <FilterForm
                    formValues={filterFormValues}
                    setFormValues={setFilterFormValues}
                    fieldsInfo={fieldsInfo}
                    setFieldsInfo={setFieldsInfo}
                    waiting={waiting}
                    handleFilter={handleFilter}
                  />
                }
                rowActions={[
                  {
                    title: "مشاهده",
                    icon: Description,
                    onClick: (row) => {
                      history.push(`/viewRecipient/${row.accompanyId}`);
                    },
                    display: () =>
                      checkPermis(
                        "welfareServices/financialFacilities/reportFinancialFacilitation/observe",
                        datas
                      ),
                  },
                ]}
              />
            </CardContent>
          </Box>
        }
      />
    </>
  );
}

function FilterForm({ ...restProps }) {
  const {
    formValues,
    setFormValues,
    fieldsInfo,
    setFieldsInfo,
    waiting,
    handleFilter,
  } = restProps;
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "pseudoId",
      label: "کد پرسنلی",
      type: "text",
    },
    {
      name: "firstName",
      label: "نام",
      type: "text",
    },

    {
      name: "lastName",
      label: "نام خانوادگی",
      type: "text",
    },
    // {
    //   name: "organizationPartyId",
    //   label: "شرکت",
    //   type: "select",
    //   options: fieldsInfo.companies,
    //   optionIdField: "partyId",
    //   optionLabelField: "organizationName",
    // },
    {
      name: "unitPartyId",
      label: "واحد",
      type: "select",
      options: fieldsInfo.organizationUnit,
      optionIdField: "partyId",
      optionLabelField: "organizationName",
      changeCallback: (options) =>
        setFormValues((prevState) => ({
          ...prevState,
          emplPositionId: null,
        })),
    },
    {
      name: "emplPositionId",
      label: "پست",
      type: "select",
      options: fieldsInfo.emplPositions,
      optionIdField: "emplPositionId",
      optionLabelField: "description",
      filterOptions: (options) =>
        formValues["unitPartyId"]
          ? options.filter(
              (item) => item.organizationPartyId == formValues["unitPartyId"]
            )
          : options,
    },
    {
      name: "loanTypeEnumId",
      label: "نوع تسهیل مالی",
      type: "select",
      options: fieldsInfo.loanType,
      optionLabelField: "description",
      optionIdField: "enumId",
    },
    {
      name: "welfareId",
      label: "تسهیل مالی",
      type: "select",
      options: fieldsInfo.welfare,
      optionIdField: "welfareId",
      optionLabelField: "title",
      getOptionLabel: (opt) => `${opt.welfareCode} ─ ${opt.title}` || "؟",
    },
    {
      name: "statusId",
      label: "وضعیت",
      type: "select",
      options: fieldsInfo.loanInstallment,
      optionLabelField: "description",
      optionIdField: "statusId",
    },
    {
      name: "paymentFromDate",
      label: "سر رسید پرداخت (از)",
      type: "date",
    },
    {
      name: "paymentThruDate",
      label: "سر رسید پرداخت (تا)",
      type: "date",
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL + "/rest/s1/fadak/getEnums?enumTypeList=LoanType",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            loanType: res.data.enums.LoanType,
          };
        });
      });
  };

  const getWelfareList = () => {
    axios
      .get(
        SERVER_URL + "/rest/s1/welfare/filterWelfare?filterOption=Y",
        axiosKey
      )
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

  const getCompanyInfo = () => {
    axios
      .get(SERVER_URL + "/rest/s1/humanres/companyInfo", axiosKey)
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            companies: res.data.companies,
            organizationUnit: res.data.organizationUnit,
            emplPositions: res.data.emplPosition,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت اطلاعات شرکت!")
        );
      });
  };

  const handleReset = () => {
    setFormValues((prevState) => {
      return {
        ...prevState,
        statusId: "UnPaidInstallment",
      };
    });
    handleFilter(true);
  };

  useEffect(() => {
    getEnumSelectFields();
    getWelfareList();
    getCompanyInfo();
  }, []);

  useEffect(() => {
    setFormValues((prevState) => {
      return {
        ...prevState,
        statusId: "UnPaidInstallment",
      };
    });
  }, []);

  return (
    <CardContent>
      <FormPro
        prepend={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        submitCallback={handleFilter}
        resetCallback={handleReset}
        actionBox={
          <ActionBox>
            <Button
              type="submit"
              role="primary"
              disabled={waiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              فیلتر
            </Button>
            <Button type="reset" role="secondary" disabled={waiting}>
              لغو
            </Button>
          </ActionBox>
        }
      />
    </CardContent>
  );
}

function EditForm({ editing = false, ...restProps }) {
  const {
    handleClose,
    setLoading,
    formValues,
    setFormValues,
    formDefaultValue,
    fieldsInfo,
    tableContent,
    setTableContent,
    handleFilter,
    datas,
    waiting,
    setWaiting,
  } = restProps;
  const [formValidation, setFormValidation] = useState({});
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const formStructure = [
    {
      name: "installmentCode",
      label: "شماره قسط",
      type: "number",
      readOnly: true,
    },
    {
      name: "responsibleFullName",
      label: "تسویه کننده",
      type: "text",
      readOnly: true,
    },
    {
      name: "actualPaymentDate",
      label: "تاریخ پرداخت قسط",
      type: "date",
      readOnly: true,
    },
    {
      name: "responsibleEmplPositionId",
      label: "پست سازمانی تسویه کننده",
      type: "select",
      options: fieldsInfo.responsibleEmplPositions,
      optionLabelField: "description",
      optionIdField: "emplPositionId",
      required: true,
    },

    {
      type: "group",
      items: [
        {
          name: "installmentAmount",
          label: "مبلغ قسط اصلی",
          type: "float",
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
      name: "paymentDate",
      label: "سر رسید پرداخت قسط",
      type: "date",
      readOnly: true,
    },
    {
      type: "group",
      items: [
        {
          name: "installmentPenaltyAmount",
          label: "مبلغ جریمه پرداخت",
          type: "float",
          disabled:
            new Date(formValues.paymentDate) >
            new Date(formValues.actualPaymentDate),
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
      type: "group",
      items: [
        {
          name: "payableInstallmentAmount",
          label: "مبلغ قابل پرداخت",
          type: "float",
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
      type: "group",
      items: [
        {
          name: "paidInstallmentAmount",
          label: "مبلغ پرداخت شده",
          type: "float",
          required: formValues.statusId != "DelayedInstallment",
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
      name: "installmentCalculationMethodEnumId",
      label: "نحوه بازپرداخت قسط",
      type: "select",
      options: fieldsInfo.installmentCalculationMethod,
      optionLabelField: "description",
      optionIdField: "enumId",
      display: checkPermis(
        "welfareServices/financialFacilities/installmentSettlement/installmentCalculationMethod",
        datas
      ),
      required:
        checkPermis(
          "welfareServices/financialFacilities/installmentSettlement/installmentCalculationMethod",
          datas
        ) && formValues.statusId != "DelayedInstallment",
    },
    {
      name: "partyContent",
      type: "component",
      col: { sm: 12, md: 6 },
      component: (
        <UploadFile formValues={formValues} setFormValues={setFormValues} />
      ),
    },
    {
      name: "statusId",
      label: "وضعیت",
      type: "select",
      options: fieldsInfo.loanInstallment?.filter(
        (item) => item?.statusId !== "UnPaidInstallment"
      ),
      optionLabelField: "description",
      optionIdField: "statusId",
      required: true,
    },
    {
      name: "newPaymentDate",
      label: "سر رسید پرداخت جدید",
      type: "date",
      display: formValues.statusId == "DelayedInstallment",
      required: formValues.statusId == "DelayedInstallment",
    },

    {
      name: "description",
      label: "توضیحات",
      type: "textarea",
      col: 9,
    },
  ];

  const handleEdit = () => {
    setWaiting(true);
    setLoading(true);
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ثبت اطلاعات!"));
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/payInstallment",
        {
          loanInstallment: formValues,
        },
        axiosKey
      )
      .then((res) => {
        handleFilter();
        handleReset();
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ثبت اطلاعات!"));
        handleReset();
      });
  };

  const handleReset = () => {
    setLoading(false);
    setWaiting(false);
    setFormValues({});
    handleClose();
  };

  useEffect(() => {
    setFormValues((prevState) => {
      return {
        ...prevState,
        ...formDefaultValue,
      };
    });
  }, []);

  useEffect(() => {
    const payableInstallmentAmount =
      parseFloat(formValues.installmentPenaltyAmount) +
      parseFloat(formValues.installmentAmount);
    setFormValues((prevState) => {
      return {
        ...prevState,
        payableInstallmentAmount:
          payableInstallmentAmount || formValues.installmentAmount,
      };
    });
  }, [formValues.installmentPenaltyAmount, formValues.installmentAmount]);

  return (
    <CardContent>
      <FormPro
        prepend={formStructure}
        formValues={formValues}
        setFormValues={setFormValues}
        formValidation={formValidation}
        setFormValidation={setFormValidation}
        submitCallback={handleEdit}
        resetCallback={handleReset}
        actionBox={
          <ActionBox>
            <Button
              type="submit"
              role="primary"
              disabled={waiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              ثبت
            </Button>
            <Button type="reset" role="secondary" disabled={waiting}>
              لغو
            </Button>
          </ActionBox>
        }
      />
    </CardContent>
  );
}

function UploadFile({ formValues, setFormValues }) {
  const inputRef = useRef(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const datas = useSelector(({ fadak }) => fadak);
  const dispatch = useDispatch();
  const axiosKey = {
    headers: {
      api_key: localStorage.getItem("api_key"),
    },
  };

  const handleUpload = () => {
    setUploadDialog(false);
    inputRef.current.click();
    inputRef.current.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (
        file &&
        (formValues?.partyContent?.name != file.name ||
          formValues?.partyContent?.size != file.size)
      ) {
        dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
        const fileUrl = new FormData();
        fileUrl.append("file", file);
        axios
          .post(
            SERVER_URL + "/rest/s1/fadak/getpersonnelfile/",
            fileUrl,
            axiosKey
          )
          .then((res) => {
            setFormValues((prevState) => ({
              ...prevState,
              partyContent: file,
              contentLocation: res.data.name,
            }));
            dispatch(
              setAlertContent(ALERT_TYPES.SUCCESS, "فایل با موفقیت آپلود شد.")
            );
          });
      }
    });
  };

  const handleDelete = () => {
    setDeleteDialog(false);
    setFormValues((prevState) => ({
      ...prevState,
      partyContent: {},
      contentLocation: null,
    }));
    dispatch(setAlertContent(ALERT_TYPES.SUCCESS, "فایل با موفقیت حذف شد."));
  };

  return (
    <Box display="flex" className="outlined-input">
      <Box flexGrow={1} style={{ padding: "18px 14px" }}>
        <Typography color="textSecondary">{`پیوست : ${
          formValues?.partyContent?.name
            ? formValues?.partyContent?.name?.substring(0, 5) + "..."
            : ""
        } `}</Typography>
      </Box>
      <Box style={{ padding: "3px 14px" }}>
        <input type="file" ref={inputRef} style={{ display: "none" }} />
        <Tooltip title="آپلود فایل">
          <IconButton>
            <CloudUpload
              onClick={() =>
                formValues?.partyContent?.name
                  ? setUploadDialog(true)
                  : handleUpload()
              }
            />
          </IconButton>
        </Tooltip>

        <Dialog
          open={uploadDialog}
          onClose={() => setUploadDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">هشدار !</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              فایل جدید جایگزین پیوست قبلی خواهد شد. از جایگزینی فایل اطمینان
              دارید؟
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpload} color="primary">
              بلی
            </Button>
            <Button
              onClick={() => setUploadDialog(false)}
              color="primary"
              autoFocus
            >
              خیر
            </Button>
          </DialogActions>
        </Dialog>

        <Tooltip title="حذف فایل پیوست شده">
          <IconButton size={"large"}>
            <Delete
              onClick={() =>
                formValues?.partyContent?.name
                  ? setDeleteDialog(true)
                  : dispatch(
                      setAlertContent(
                        ALERT_TYPES.ERROR,
                        "فایل پیوست شده ای برای حذف وجود ندارد !"
                      )
                    )
              }
            />
          </IconButton>
        </Tooltip>
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            آیا از حذف فایل پیوست شده اطمینان دارید ؟
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleDelete} color="primary">
              بلی
            </Button>
            <Button
              onClick={() => setDeleteDialog(false)}
              color="primary"
              autoFocus
            >
              خیر
            </Button>
          </DialogActions>
        </Dialog>

        <Tooltip title="دانلود فایل پیوست شده">
          {formValues?.contentLocation ? (
            <IconButton
              size={"large"}
              href={
                SERVER_URL +
                "/rest/s1/fadak/getpersonnelfile1?name=" +
                formValues?.contentLocation
              }
            >
              <Visibility />
            </IconButton>
          ) : (
            <IconButton size={"large"}>
              <Visibility
                onClick={() =>
                  dispatch(
                    setAlertContent(
                      ALERT_TYPES.ERROR,
                      "فایل پیوست شده ای برای دانلود وجود ندارد !"
                    )
                  )
                }
              ></Visibility>
            </IconButton>
          )}
        </Tooltip>
      </Box>
    </Box>
  );
}
