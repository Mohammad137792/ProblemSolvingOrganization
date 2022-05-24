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

export default function DegreeOfApproval({
  welfareGroupPartyClassificationId,
}) {
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

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=Welfare,VerActionWelfare",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            welfareType: res.data.enums.Welfare.filter(
              (item) => !item?.parentEnumId
            ),
            verActionWelfare: res.data.enums.VerActionWelfare,
          };
        });
      });
  };

  const getCompanyPositions = () => {
    axios
      .get(SERVER_URL + "/rest/s1/humanres/companyInfo", axiosKey)
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            emplPositions: res.data.emplPosition,
          };
        });
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت پست‌های سازمانی!")
        );
      });
  };

  const getWelfareGroupType = () => {
    setLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/WelfareGroupType?welfareGroupPartyClassificationId=${welfareGroupPartyClassificationId}`,
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.WelfareGroupTypeInfo);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت لیست مراحل!")
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
            `/rest/s1/welfare/WelfareGroupType?levelId=${row?.levelId}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContent.filter(
            (level) => level.levelId != row?.levelId
          );
          setTableContent(filteredTable);
          setLoading(false);
          resolve();
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در حذف مرحله!"));
          setLoading(false);
          reject();
        });
    });
  };

  useEffect(() => {
    getEnumSelectFields();
    getCompanyPositions();
  }, []);

  useEffect(() => {
    getWelfareGroupType();
  }, [welfareGroupPartyClassificationId]);

  return (
    <>
      <TablePro
        columns={tableCols}
        rows={tableContent}
        setRows={setTableContent}
        loading={loading}
        add={
          checkPermis(
            "welfareServices/welfareServicesGroup/DegreeOfApproval/add",
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
            setTableContent={setTableContent}
            welfareGroupPartyClassificationId={
              welfareGroupPartyClassificationId
            }
          />
        }
        removeCondition={() =>
          checkPermis(
            "welfareServices/welfareServicesGroup/DegreeOfApproval/delete",
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
      name: "welfareTypeEnumId",
      label: "نوع خدمت رفاهی",
      type: "select",
      options: fieldsInfo.welfareType,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
    },

    {
      name: "emplPositionId",
      label: "پست سازمانی",
      type: "select",
      options: fieldsInfo.emplPositions,
      optionLabelField: "description",
      optionIdField: "emplPositionId",
      getOptionLabel: (opt) => `${opt.pseudoId} ─ ${opt.description}` || "؟",
    },
    {
      name: "sequence",
      label: "ترتیب تایید",
      type: "number",
      required: true,
    },
    {
      name: "actionEnumId",
      label: "اقدامات قابل انجام",
      type: "multiselect",
      options: fieldsInfo.verActionWelfare,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
    },
  ];
  const handleSubmit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setLoading(true);
    setWaiting(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/WelfareGroupType",
        {
          ...formValues,
          welfareGroupPartyClassificationId: welfareGroupPartyClassificationId,
        },
        axiosKey
      )
      .then((res) => {
        const actionEnumIds = JSON.parse(formValues.actionEnumId);
        const completedFormValues = {
          ...formValues,
          emplPosition: fieldsInfo?.emplPositions.find(
            (item) => item.emplPositionId == formValues.emplPositionId
          )?.description,
          actionEnum: fieldsInfo?.verActionWelfare
            .filter(
              (item) =>
                actionEnumIds?.findIndex((doc) => doc == item.enumId) != -1
            )
            .map((doc) => doc?.description)
            ?.join("،"),
          levelId: res.data?.levelId,
        };
        setTableContent((prevState) => [...prevState, completedFormValues]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در افزودن مرحله!"));
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
        submitCallback={handleSubmit}
        actionBox={
          <ActionBox>
            <Button
              type="submit"
              role="primary"
              disabled={waiting}
              endIcon={waiting ? <CircularProgress size={20} /> : null}
            >
              افزودن
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
