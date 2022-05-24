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

export default function Documents({ welfareGroupPartyClassificationId }) {
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
      name: "welfareTypeEnum",
      label: "نوع خدمت رفاهی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "loanTypeEnum",
      label: "نوع تسهیل مالی",
      type: "text",
      style: { minWidth: "80px" },
    },
    {
      name: "welfareDocEnum",
      label: "مدرک مورد نیاز",
      type: "text",
      style: { minWidth: "80px" },
    },
  ];

  const getEnumSelectFields = () => {
    axios
      .get(
        SERVER_URL +
          "/rest/s1/fadak/getEnums?enumTypeList=Welfare,LoanType,PartyContentType",
        axiosKey
      )
      .then((res) => {
        setFieldsInfo((prevState) => {
          return {
            ...prevState,
            welfareType: res.data.enums.Welfare.filter(
              (item) => !item?.parentEnumId
            ),
            loanType: res.data.enums.LoanType,
            partyContentType: res.data.enums.PartyContentType.filter(
              (item) => item?.parentEnumId == "Attachment"
            ),
          };
        });
      });
  };

  const getNeededDocuments = () => {
    setLoading(true);
    axios
      .get(
        SERVER_URL +
          `/rest/s1/welfare/neededDocument?welfareGroupPartyClassificationId=${welfareGroupPartyClassificationId}`,
        axiosKey
      )
      .then((res) => {
        setTableContent(res.data?.neededDocument);
        setLoading(false);
      })
      .catch(() => {
        dispatch(
          setAlertContent(
            ALERT_TYPES.ERROR,
            "خطا در دریافت لیست مدارک مورد نیاز گروه خدمات رفاهی!"
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
            `/rest/s1/welfare/neededDocument?neededDocumentId=${row?.neededDocumentId}`,
          axiosKey
        )
        .then((res) => {
          const filteredTable = tableContent.filter(
            (attach) => attach.neededDocumentId != row?.neededDocumentId
          );
          setTableContent(filteredTable);
          setLoading(false);
          resolve();
        })
        .catch(() => {
          dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در حذف مدرک!"));
          setLoading(false);
          reject();
        });
    });
  };

  useEffect(() => {
    getEnumSelectFields();
  }, []);

  useEffect(() => {
    getNeededDocuments();
  }, [welfareGroupPartyClassificationId]);

  return (
    <>
      <TablePro
        title="مدارک مورد نیاز خدمات رفاهی"
        columns={tableCols}
        rows={tableContent}
        setRows={setTableContent}
        loading={loading}
        add={
          checkPermis(
            "welfareServices/welfareServicesGroup/Documents/add",
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
            "welfareServices/welfareServicesGroup/Documents/delete",
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
      changeCallback: (options) => {
        setFormValues((prevState) => ({
          ...prevState,
          loanTypeEnumId: null,
        }));
      },
      required: true,
    },
    {
      name: "loanTypeEnumId",
      label: "نوع تسهیل مالی",
      type: "select",
      options: fieldsInfo.loanType,
      optionLabelField: "description",
      optionIdField: "enumId",
      required: formValues?.welfareTypeEnumId == "WeLoan",
      display: formValues?.welfareTypeEnumId == "WeLoan",
    },
    {
      name: "welfareDocEnumId",
      label: "مدرک مورد نیاز",
      type: "select",
      options: fieldsInfo.partyContentType,
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
        SERVER_URL + "/rest/s1/welfare/neededDocument",
        {
          ...formValues,
          welfareGroupPartyClassificationId,
        },
        axiosKey
      )
      .then((res) => {
        const completedFormValues = {
          ...formValues,
          neededDocumentId: res.data?.neededDocumentId,
          welfareTypeEnum: fieldsInfo?.welfareType.find(
            (item) => item.enumId == formValues.welfareTypeEnumId
          )?.description,
          loanTypeEnum: fieldsInfo?.loanType.find(
            (item) => item.enumId == formValues.loanTypeEnumId
          )?.description,
          welfareDocEnum: fieldsInfo?.partyContentType.find(
            (item) => item.enumId == formValues.welfareDocEnumId
          )?.description,
        };
        setTableContent((prevState) => [...prevState, completedFormValues]);
        dispatch(
          setAlertContent(ALERT_TYPES.SUCCESS, "اطلاعات با موفقیت ثبت شد.")
        );
        handleReset();
      })
      .catch(() => {
        dispatch(setAlertContent(ALERT_TYPES.ERROR, "خطا در افزودن مدرک!"));
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
