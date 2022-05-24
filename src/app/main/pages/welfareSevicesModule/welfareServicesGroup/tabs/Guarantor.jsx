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

export default function Guarantor({ welfareGroupPartyClassificationId }) {
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
      name: "guarantorTypeEnum",
      label: "نوع ضامن",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "amount",
      label: "تعداد",
      type: "number",
      style: { minWidth: "80px" },
    },
    {
      name: "welfareDocEnum",
      label: "مدارک موردنیاز ضامن",
      type: "text",
      style: { minWidth: "80px" },
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=LoanType,GuarantorType,PartyContentType",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            loanType: res.data.enums.LoanType,
            guarantorType: res.data.enums.GuarantorType,
            partyContentType: res.data.enums.PartyContentType.filter(
              (item) => item?.parentEnumId == "Attachment"
            ),
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

  const getGuarantor = () => {
    setLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/Guarantor?welfareGroupPartyClassificationId=${welfareGroupPartyClassificationId}`,
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.Guarantor);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(ALERT_TYPES.ERROR, "خطا در دریافت لیست ضامن‌ها!")
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
            `/rest/s1/welfare/Guarantor?guarantorId=${row?.guarantorId}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContent.filter(
            (guarantor) => guarantor.guarantorId != row?.guarantorId
          );
          setTableContent(filteredTable);
          setLoading(false);
          resolve();
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در حذف ضامن!"));
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
    getGuarantor();
  }, [welfareGroupPartyClassificationId]);

  return (
    <>
      <TablePro
        title="لیست ضامن"
        columns={tableCols}
        rows={tableContent}
        setRows={setTableContent}
        loading={loading}
        add={
          checkPermis(
            "welfareServices/welfareServicesGroup/Guarantor/add",
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
            "welfareServices/welfareServicesGroup/Guarantor/update",
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
            "welfareServices/welfareServicesGroup/Guarantor/delete",
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
      name: "guarantorTypeEnumId",
      label: "نوع ضامن",
      type: "select",
      options: fieldsInfo.guarantorType,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: true,
    },
    {
      name: "amount",
      label: "تعداد",
      type: "number",
      required: true,
    },
    {
      name: "welfareDocEnumId",
      label: "مدارک موردنیاز ضامن",
      type: "multiselect",
      options: fieldsInfo.partyContentType,
      optionLabelField: "description",
      optionIdField: "enumId",
    },
    {
      name: "terms",
      label: "شرایط",
      type: "textarea",
      col: 12,
    },
  ];
  const handleSubmit = () => {
    dispatch(setAlertContent(ALERT_TYPES.WARNING, "در حال ارسال اطلاعات"));
    setLoading(true);
    setWaiting(true);
    axios
      .post(
        SERVER_URL + "/rest/s1/welfare/Guarantor",
        {
          ...formValues,
          welfareGroupPartyClassificationId: welfareGroupPartyClassificationId,
        },
        axiosKey
      )
      .then((res) => {
        const welfareDocEnumIds = JSON.parse(formValues.welfareDocEnumId);
        const completedFormValues = {
          ...formValues,
          welfareTitle: fieldsInfo?.welfare.find(
            (item) => item.welfareId == formValues.welfareId
          )?.title,
          guarantorTypeEnum: fieldsInfo?.guarantorType.find(
            (item) => item.enumId == formValues.guarantorTypeEnumId
          )?.description,
          welfareDocEnum: fieldsInfo?.partyContentType
            .filter(
              (item) =>
                welfareDocEnumIds?.findIndex((doc) => doc == item.enumId) != -1
            )
            .map((doc) => doc?.description)
            ?.join("،"),
          guarantorId: res.data?.guarantorId,
        };
        setTableContent((prevState) => [...prevState, completedFormValues]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در افزودن ضامن!"));
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
        SERVER_URL + "/rest/s1/welfare/Guarantor",
        {
          ...formValues,
        },
        axiosKey
      )
      .then((res) => {
        const editedTableContent = [...tableContent];
        const guarantorIndex = tableContent.findIndex(
          (guarantor) => guarantor.guarantorId == formValues.guarantorId
        );
        const welfareDocEnumIds = JSON.parse(formValues.welfareDocEnumId);
        const completedFormValues = {
          ...formValues,
          welfareTitle: fieldsInfo?.welfare.find(
            (item) => item.welfareId == formValues.welfareId
          )?.title,
          guarantorTypeEnum: fieldsInfo?.guarantorType.find(
            (item) => item.enumId == formValues.guarantorTypeEnumId
          )?.description,
          welfareDocEnum: fieldsInfo?.partyContentType
            .filter(
              (item) =>
                welfareDocEnumIds?.findIndex((doc) => doc == item.enumId) != -1
            )
            .map((doc) => doc?.description)
            ?.join("،"),
        };
        editedTableContent[guarantorIndex] = { ...completedFormValues };
        setTableContent(editedTableContent);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ویرایش شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در ویرایش ضامن!"));
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
