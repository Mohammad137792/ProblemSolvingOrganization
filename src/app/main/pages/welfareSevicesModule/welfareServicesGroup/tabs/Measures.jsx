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

export default function Measures({ welfareGroupPartyClassificationId }) {
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
      name: "criteriaScoreEnum",
      label: "معیار دریافت تسهیل مالی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "amount",
      label: "مقدار",
      type: "render",
      render: (row) => {
        if (row?.criteriaScoreEnumId != "MaterialStatusLc") {
          return row?.amount;
        }
      },
      style: { minWidth: "80px" },
    },
    {
      name: "maritalStatus",
      label: "وضعیت تاهل",
      type: "render",
      render: (row) => {
        if (row?.criteriaScoreEnumId == "MaterialStatusLc") {
          return fieldsInfo?.maritalStatus?.find(
            (item) => item.amount == row?.amount
          )?.description;
        }
      },
      style: { minWidth: "80px" },
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=LoanType,LoanCriteriaScore",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            loanType: res.data.enums.LoanType,
            loanCriteriaScore: res.data.enums.LoanCriteriaScore,
            maritalStatus: [
              { amount: 1, description: "مجرد" },
              { amount: 2, description: "متاهل" },
              { amount: 3, description: "مطلقه" },
            ],
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

  const getWelfareGroupCriteria = () => {
    setLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/welfareGroupCriteria?welfareGroupPartyClassificationId=${welfareGroupPartyClassificationId}`,
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.welfareGroupCriteria);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت لیست معیارهای دریافت تسهیل مالی!"
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
            `/rest/s1/welfare/welfareGroupCriteria?criteriaId=${row?.criteriaId}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContent.filter(
            (person) => person.criteriaId != row?.criteriaId
          );
          setTableContent(filteredTable);
          setLoading(false);
          resolve();
        })
        .catch(() => {
          dispatch(
            setAlertContent(
              ALERT_TYPES.ERROR,
              "خطا در حذف معیار دریافت تسهیل مالی!"
            )
          );
          setLoading(false);
          reject();
        });
    });
  };

  useEffect(() => {
    getEnumSelectFields();
    getWelfareList();
  }, []);

  useEffect(() => {
    getWelfareGroupCriteria();
  }, [welfareGroupPartyClassificationId]);

  return (
    <>
      <TablePro
        title="معیارهای دریافت تسهیل مالی"
        columns={tableCols}
        rows={tableContent}
        setRows={setTableContent}
        loading={loading}
        add={
          checkPermis(
            "welfareServices/welfareServicesGroup/Measures/add",
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
            "welfareServices/welfareServicesGroup/Measures/update",
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
            "welfareServices/welfareServicesGroup/Measures/delete",
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
      col: 4,
    },
    {
      name: "criteriaScoreEnumId",
      label: "معیار دریافت تسهیل مالی",
      type: "select",
      options: fieldsInfo.loanCriteriaScore,
      optionLabelField: "description",
      optionIdField: "enumId",
      changeCallback: () =>
        setFormValues((prevState) => ({
          ...prevState,
          amount: null,
        })),
      required: true,
      col: 5,
    },
    {
      name: "amount",
      label:
        formValues?.criteriaScoreEnumId == "MaterialStatusLc"
          ? "وضعیت تاهل"
          : "مقدار",
      type:
        formValues?.criteriaScoreEnumId == "MaterialStatusLc"
          ? "select"
          : "float",
      options: fieldsInfo.maritalStatus,
      optionLabelField: "description",
      optionIdField: "amount",
    },
  ];
  const handleSubmit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setLoading(true);
    setWaiting(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/welfareGroupCriteria",
        {
          ...formValues,
          welfareGroupPartyClassificationId: welfareGroupPartyClassificationId,
        },
        axiosKey
      )
      .then((res) => {
        const completedFormValues = {
          ...formValues,
          criteriaId: res.data?.criteriaId,
          welfareTitle: fieldsInfo?.welfare.find(
            (item) => item.welfareId == formValues.welfareId
          )?.title,
          criteriaScoreEnum: fieldsInfo?.loanCriteriaScore.find(
            (item) => item.enumId == formValues.criteriaScoreEnumId
          )?.description,
        };
        setTableContent((prevState) => [...prevState, completedFormValues]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در افزودن معیار دریافت تسهیل مالی!"
          )
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
        SERVER_URL + "/rest/s1/welfare/welfareGroupCriteria",
        {
          ...formValues,
        },
        axiosKey
      )
      .then((res) => {
        const editedTableContent = [...tableContent];
        const criteriaIndex = tableContent.findIndex(
          (criteria) => criteria.criteriaId == formValues.criteriaId
        );
        const completedFormValues = {
          ...formValues,
          welfareTitle: fieldsInfo?.welfare.find(
            (item) => item.welfareId == formValues.welfareId
          )?.title,
          criteriaScoreEnum: fieldsInfo?.loanCriteriaScore.find(
            (item) => item.enumId == formValues.criteriaScoreEnumId
          )?.description,
        };
        editedTableContent[criteriaIndex] = { ...completedFormValues };
        setTableContent(editedTableContent);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در ویرایش معیار دریافت تسهیل مالی!"
          )
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
