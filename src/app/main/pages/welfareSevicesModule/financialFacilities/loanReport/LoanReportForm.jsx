import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Box } from "@material-ui/core";
import ActionBox from "app/main/components/ActionBox";
import FormPro from "app/main/components/formControls/FormPro";
import TablePro from "app/main/components/TablePro";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkPermis from "app/main/components/CheckPermision";
import DescriptionIcon from "@material-ui/icons/Description";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "configs";
import axios from "axios";
import { ALERT_TYPES, setAlertContent } from "app/store/actions";

export default function LoanReportForm() {
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [formValues, setFormValues] = useState({});
  const [tableContent, setTableContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
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
      name: "loanInstallmentCalculationMethodEnum",
      label: "نحوه بازپرداخت اقساط",
      type: "text",
    },
    {
      name: "finalLoanAmount",
      label: "مبلغ تسهیل مالی",
      type: "number",
    },
    {
      name: "loanFeeAmount",
      label: "کل مبلغ کارمزد",
      type: "number",
    },
    {
      name: "totalInstallmentProfit",
      label: "کل سود",
      type: "number",
    },
    {
      name: "finalInstallmentNumber",
      label: "تعداد اقساط",
      type: "number",
    },
    {
      name: "totalPaidAmount",
      label: "کل مبلغ قابل پرداخت",
      type: "number",
    },
    {
      name: "totalPaidForThisAccompany",
      label: "جمع اقساط پرداخت شده",
      type: "number",
    },
    {
      name: "remainingAmountForThisAccompany",
      label: "باقی مانده تسویه اقساط",
      type: "number",
    },
    {
      name: "requestDate",
      label: "تاریخ درخواست",
      type: "date",
    },
    {
      name: "requestMeetDate",
      label: "تاریخ دریافت",
      type: "date",
    },
  ];

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
      name: "nationalCode",
      label: "کد ملی",
      type: "number",
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
      name: "loanInstallmentCalculationMethodEnumId",
      label: "نحوه بازپرداخت اقساط",
      type: "select",
      options: fieldsInfo.installmentCalculationMethod,
      optionLabelField: "description",
      optionIdField: "enumId",
    },
  ];

  const handleFilter = (reset = false) => {
    setWaiting(true);
    setLoading(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/getRequestedLoanInfo",
        {
          personLoanInfo: reset ? {} : { ...formValues, inProfile: false },
        },
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data.requestedLoanInfo);
        setLoading(false);
        setWaiting(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.WARNING,
            "مشکلی در فیلتر دریافت کنندگان رخ داده است."
          )
        );
        setLoading(false);
        setWaiting(false);
      });
  };

  const handleReset = () => {
    setFormValues({});
    handleFilter(true);
  };

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=LoanType,InstallmentCalculationMethod",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            loanType: res.data.enums.LoanType,
            installmentCalculationMethod:
              res.data.enums.InstallmentCalculationMethod,
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

  useEffect(() => {
    getEnumSelectFields();
    getWelfareList();
    getCompanyInfo();
    handleFilter();
  }, []);

  return (
    <Box p={2}>
      <Card variant="outlined">
        <CardContent>
          <TablePro
            title="لیست دریافت کنندگان تسهیل مالی"
            loading={loading}
            columns={tableCols}
            rows={tableContent}
            setRows={setTableContent}
            exportCsv="لیست دریافت کنندگان تسهیل مالی"
            filter="external"
            filterForm={
              <FormPro
                append={formStructure}
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
                      فیلتر{" "}
                    </Button>
                    <Button type="reset" role="secondary" disabled={waiting}>
                      لغو
                    </Button>
                  </ActionBox>
                }
              />
            }
            rowActions={[
              {
                title: "مشاهده",
                icon: DescriptionIcon,
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
      </Card>
    </Box>
  );
}
